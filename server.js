import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env file loader
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"](.*)['"]$/, '$1');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    });
  }
}
loadEnv();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Handle Tutor API
  if (url.pathname === '/api/tutor' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const reply = await handleTutorRequest(payload);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(reply));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Serve Static Files
  let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = fs.readFileSync(filePath);
    res.setHeader('Content-Type', contentType);
    res.end(content);
  } catch (e) {
    res.statusCode = 404;
    res.end('File not found');
  }
});

async function handleTutorRequest({ message, context, history = [] }) {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const systemPrompt = `You are Lens, a friendly data-structures tutor inside an interactive visualizer.
Be concrete about the learner's CURRENT step, use plain words, max 110 words, no headings.
Be encouraging, explain why this step happens and connect it to algorithm invariants.`;

  const promptText = `${context}\n\nLearner Question: ${message}`;

  if (geminiKey) {
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${promptText}` }] }],
          generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { text: text.trim(), live: true };
        }
      }
    } catch (err) {
      console.warn('Gemini request failed:', err.message);
    }
  }

  if (anthropicKey) {
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 250,
          system: systemPrompt,
          messages: [{ role: 'user', content: promptText }]
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.content?.[0]?.text;
        if (text) {
          return { text: text.trim(), live: true };
        }
      }
    } catch (err) {
      console.warn('Anthropic request failed:', err.message);
    }
  }

  // High quality context-aware fallback
  return {
    text: generateContextualFallback(message, context),
    live: false
  };
}

function generateContextualFallback(q = '', ctx = '') {
  const query = q.toLowerCase();

  if (query.includes('why this step') || query.includes('why')) {
    return `Look at the two highlighted items or current node. We must compare them to check if they violate our target ordering. If they're out of order, a swap or move is necessary to preserve the sorted partition invariant!`;
  }
  if (query.includes('what happens next') || query.includes('next')) {
    return `In the next step, the pointer advances to the next position or child branch. Press ▶| (or Right Arrow) to step forward and watch how the active bars or tree nodes transition smoothly.`;
  }
  if (query.includes('o(n') || query.includes('complexity') || query.includes('time') || query.includes('space')) {
    return `Notice the nested loop structure or recursive tree depth. In quadratic sorts (like Bubble Sort), we do up to n*(n-1)/2 comparisons in the worst case, yielding O(n²). For tree traversals, we visit every node exactly once, giving O(N) linear time!`;
  }
  if (query.includes('analogy') || query.includes('real world') || query.includes('example')) {
    return `Imagine sorting playing cards by passing through them hand-by-hand, or exploring files in desk drawers. You inspect each item, compare it to its neighbor, and slide it into place until the whole hand is in perfect order!`;
  }

  return `Notice the highlighted position and active pseudocode line. Live AI is currently offline (set GEMINI_API_KEY in .env to activate live streaming LLM responses). Stepping forward reveals each invariant step-by-step!`;
}

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 AlgoLens is running at http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
