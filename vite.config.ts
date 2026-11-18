import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';

function tutorApiPlugin() {
  return {
    name: 'tutor-api-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/tutor', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { message, context, history } = data;

            const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
            const anthropicKey = process.env.ANTHROPIC_API_KEY;

            const systemPrompt = `You are Lens, a friendly data-structures tutor inside an interactive visualizer.
Be concrete about the learner's CURRENT step, use plain words, max 110 words, no headings.
Be encouraging and explain the "why" simply.`;

            const promptText = `${context}\n\nUser Question: ${message}`;

            if (geminiKey) {
              try {
                const response = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [
                        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${promptText}` }] }
                      ],
                      generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
                    })
                  }
                );

                if (response.ok) {
                  const result = await response.json();
                  const reply = result.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (reply) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ text: reply.trim(), live: true }));
                    return;
                  }
                }
              } catch (err) {
                console.warn('Gemini API call failed, using tutor engine fallback', err);
              }
            } else if (anthropicKey) {
              try {
                const response = await fetch('https://api.anthropic.com/v1/messages', {
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

                if (response.ok) {
                  const result = await response.json();
                  const reply = result.content?.[0]?.text;
                  if (reply) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ text: reply.trim(), live: true }));
                    return;
                  }
                }
              } catch (err) {
                console.warn('Anthropic API call failed, using tutor engine fallback', err);
              }
            }

            // High quality fallback with step-awareness
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              text: generateContextualFallback(message, context),
              live: false
            }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e?.message || 'Server error' }));
          }
        });
      });
    }
  };
}

function generateContextualFallback(q: string, ctx: string): string {
  const lowerQ = (q || '').toLowerCase();
  
  if (lowerQ.includes('why this step') || lowerQ.includes('why')) {
    return `Notice what the active line is doing right now. The algorithm is comparing or moving items to maintain the sorted invariant or tree hierarchy. Without this check, items would be placed out of order!`;
  }
  if (lowerQ.includes('next') || lowerQ.includes('what happens')) {
    return `In the next step, the pointer or loop counter advances to the adjacent element or child branch. Press ▶| (or Right Arrow) to step forward and watch the highlighted positions move.`;
  }
  if (lowerQ.includes('o(n') || lowerQ.includes('complexity') || lowerQ.includes('time') || lowerQ.includes('space')) {
    return `Take a look at the nested loops or tree depth. In nested passes (like Bubble or Selection Sort), comparing every pair takes about n*(n-1)/2 operations, giving O(n²). For trees, balanced traversals visit all n nodes in O(n) time!`;
  }
  if (lowerQ.includes('analogy') || lowerQ.includes('real world') || lowerQ.includes('example')) {
    return `Think of this like sorting playing cards in your hand or organizing files in your desk drawers. You inspect one item at a time, compare it to its neighbor, and shift it into its rightful place until everything is in order.`;
  }

  return `Here is what's happening at your current position: inspect the highlighted items and the pseudocode line. Live AI is currently offline (set GEMINI_API_KEY or ANTHROPIC_API_KEY in .env to activate live streaming LLM responses).`;
}

export default defineConfig({
  plugins: [react(), tutorApiPlugin()],
  server: {
    port: 5173
  }
});
