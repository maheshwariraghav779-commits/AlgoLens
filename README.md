# AlgoLens 🔍
> **Interactive File System & Directory Tree Explorer & DSA Analyser**
> *See algorithms think step-by-step through fluid spring animation and an interactive AI doubt-solver.*

AlgoLens is a modern, polished single-page visualizer designed to teach fundamental computer science concepts, data structures, and algorithms through step-by-step pre-computed animation.

---

## 🌟 Modules Overview

AlgoLens includes **two unified modules** switched seamlessly from the header:

### 📊 Module A: DSA Analyser
- **Supported Algorithms**:
  - **Bubble Sort** (\(O(n^2)\) time, \(O(1)\) space)
  - **Selection Sort** (\(O(n^2)\) time, \(O(1)\) space)
  - **Insertion Sort** (\(O(n^2)\) time, \(O(1)\) space)
  - **Merge Sort** (\(O(n \log n)\) time, \(O(n)\) space)
  - **Quick Sort** (\(O(n \log n)\) time, \(O(\log n)\) space)
  - **Binary Search** (\(O(\log n)\) time, \(O(1)\) space)
  - **Linear Search** (\(O(n)\) time, \(O(1)\) space)
- **Fluid Animation**: Bars are absolutely positioned with CSS transforms using spring overshoot (`cubic-bezier(.34, 1.45, .55, 1)`).
- **Visual Color Semantics**:
  - 🟠 **Orange glow**: Comparing elements / active pointer.
  - 🔴 **Red/Pink glow**: Swapping or shifting elements.
  - 🟢 **Green glow**: Sorted / finalized elements.
  - 🔵 **Gradient Blue**: Unsorted / idle bars.
- **Performance Analyser Strip**: Live counters for comparisons, swaps/moves, and step progress, alongside best/average/worst case complexity reference tables.
- **Compare Algorithms Benchmark**: Benchmark all sorting algorithms simultaneously on the same array with real-time comparison bar charts.

---

### 📁 Module B: File System & Directory Tree Explorer
- **Realistic UNIX Hierarchy**: Root `/` directory containing `/home/user`, `/etc`, `/var`, `/usr`, with nested documents, configuration files, and system binaries.
- **Dual Synchronized Views**:
  1. **Animated SVG Tree Diagram**: Rounded cards with folder/file icons, size indicators, and highlighted parent-to-child edge lines.
  2. **Collapsible Sidebar Tree**: VS Code style collapsible file hierarchy with drag-and-drop moving between folders.
- **Tree Traversals**:
  - **DFS Pre-order** (top-down prefix visit)
  - **DFS Post-order** (bottom-up suffix visit)
  - **In-order** (mapped on LCRS binary view)
  - **BFS (Level-order)** (breadth-first queue exploration)
  - **Find Path to File** (recursive path search with backtrack)
  - **Folder Size Post-order Computation** (computes and bubbles directory storage sizes step-by-step)
- **Multiple Data Structure Perspectives**:
  - **General Tree**: Multi-way branching tree diagram.
  - **LCRS Binary Tree**: First-Child Next-Sibling binary representation.
  - **Trie View**: Path prefix lookup representation.
- **Tree Structural Metrics**: Real-time analysis of total files, directories, tree height/depth \(H\), and maximum branching factor.
- **File System Operations**: Create new file, create new folder, rename node, delete node, and move nodes.

---

## 🤖 Lens — Always-Available AI Doubt-Solver
- Sticky right-hand chat assistant that **knows the exact step you're currently on**.
- Quick chips for instant questions:
  - *"Why this step?"*
  - *"What happens next?"*
  - *"Why is it O(n²)?"*
  - *"Give me an analogy"*
- Context injection on every query includes:
  - Active module and algorithm/operation
  - Time & space complexity
  - Current step index & total steps
  - Array values or tree hierarchy state
  - Active highlighted pseudocode line
  - Current plain-English explanation
- Backend `/api/tutor` route keeps API keys secure on the server side:
  - Supports **Gemini** (`GEMINI_API_KEY`) and **Anthropic** (`ANTHROPIC_API_KEY`).
  - Includes a built-in step-aware contextual fallback if live AI keys are not configured.

---

## 🎨 Theme & Accessibility
- **Light & Dark Theme**: Toggle manually via the top-right button or automatically follows OS `prefers-color-scheme`.
- **Keyboard Shortcuts**:
  - `←` (Left Arrow): Step back
  - `→` (Right Arrow): Step forward
  - `Space`: Play / Pause (ignored when typing in text fields)
- **Reduced Motion Support**: Fully respects `prefers-reduced-motion`.

---

## 🚀 Quickstart

Run the entire application with one command:

```bash
npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Unit Tests
AlgoLens includes comprehensive tests for all step generators (ensuring all sorting algorithms end sorted and all tree traversals visit in valid mathematical order):

```bash
npm test
```

### Optional: Setting Up Live AI Tutor
To enable live streaming LLM answers with Gemini or Claude, create a `.env` file in the root directory:

```env
# Optional: Set one of these for live AI responses
GEMINI_API_KEY=your_gemini_api_key_here
# or
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

---

## 📂 Project Architecture

```
algolens/
├── index.html                   # Single-page shell with layout and modals
├── server.js                    # Node HTTP server with /api/tutor and static file delivery
├── package.json                 # Project configuration and test scripts
├── .env.example                 # Example environment configuration
├── src/
│   ├── app.js                   # Application coordinator and UI event wiring
│   ├── engine/
│   │   ├── playback.js          # Generator playback controller (play, pause, scrub, speed)
│   │   └── types.js             # Core Step and Generator contracts
│   ├── modules/
│   │   ├── dsa/
│   │   │   └── sortGenerators.js # Generator functions for Bubble, Selection, Insertion, Merge, Quick, etc.
│   │   └── filesystem/
│   │       └── treeGenerators.js # Tree hierarchy, traversals, and file mutation generators
│   └── styles/
│       └── index.css            # Exact CSS design system, dark mode, spring transitions
└── tests/
    ├── dsa.test.js              # Unit tests for all sorting and searching algorithms
    └── filesystem.test.js       # Unit tests for tree traversals, stats, and size calculations
```

---

## ➕ How to Add a New Algorithm

Adding a new algorithm to AlgoLens requires only three things: **metadata, pseudocode, and a generator function**.

1. Open `src/modules/dsa/sortGenerators.js`.
2. Add your algorithm entry to `DSA_ALGORITHMS`:

```javascript
myNewAlgo: {
  id: 'myNewAlgo',
  name: 'My New Algorithm',
  timeComplexity: 'Time O(n log n)',
  spaceComplexity: 'Space O(1)',
  bestCase: 'O(n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)',
  description: 'Explain your algorithm here.',
  pseudocode: [
    'for i in 0..n-1:',
    '  doSomething(A[i])'
  ],
  *generate(A, S, doneSet) {
    // S(explanationText, pseudocodeLineIndex, highlightedIndices, kind)
    // kind can be: 'cmp' (orange) | 'swap' (red) | 'none'
    for (let i = 0; i < A.length; i++) {
      yield S(`Inspecting element ${A[i].v}`, 1, [i], 'cmp');
      doneSet.add(A[i].id);
    }
  }
}
```

That's it! AlgoLens will automatically generate tabs, controls, complexity tables, and hook it up to the AI tutor without any extra UI code.

---

## 📸 Screenshots

```
+---------------------------------------------------------------------------------------+
|  AlgoLens  see algorithms think             [ Module A: DSA ] [ Module B: Tree ]  ☀️  |
+----------------------------------------------------------------------+----------------+
|  Bubble Sort                  Time O(n²)  Space O(1)                 | 🤖 Lens        |
|  +-----------------------------------------------------------------+ | "Knows step"   |
|  |   [34]   [12]   [27]   [8]   [41]   [19]   [5]   [30]   [16]    | | [Why this step]|
|  |    ||     ||                                                    | | [What's next?] |
|  +-----------------------------------------------------------------+ |                |
|  [ ◀ ] [ ▶ Play ] [ ▶| ]  ====o=========  Speed [ 3x ]               | User:          |
|                                                                      | Why this step? |
|  +--------------------------------+ +------------------------------+ |                |
|  | What's happening               | | Pseudocode                   | | Lens:          |
|  | Compare 34 with 12...          | | > if A[j] > A[j+1]: swap()   | | Comparing 34   |
|  +--------------------------------+ +------------------------------+ | and 12...      |
+----------------------------------------------------------------------+----------------+
```

---

## 📄 License
MIT License. Built for developers, students, and educators.
