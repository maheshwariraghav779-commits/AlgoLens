import { DSA_ALGORITHMS } from './modules/dsa/sortGenerators.js';
import { UNIT1_SEARCHING, UNIT1_SORTING } from './modules/unit1_arrays/sortingSearchingGenerators.js';
import { MATRIX_OPERATIONS } from './modules/unit1_arrays/matrixGenerators.js';
import { UNIT2_LINKED_LIST } from './modules/unit2_linkedlists/linkedListGenerators.js';
import { UNIT3_STACKS_QUEUES } from './modules/unit3_stacks_queues/stackQueueGenerators.js';
import { UNIT4_TREES } from './modules/unit4_trees/bstGenerators.js';
import { UNIT5_GRAPHS } from './modules/unit5_graphs/graphGenerators.js';
import { UNIT6_HASHING } from './modules/unit6_hashing/hashingGenerators.js';
import {
  createInitialFSTree,
  cloneTree,
  calculateTreeStats,
  FS_OPERATIONS,
  generateFileActionStep
} from './modules/filesystem/treeGenerators.js';
import { PlaybackController } from './engine/playback.js';
import { generateMemorySnapshot } from './engine/memoryEngine.js';
import { generatePredictionQuestion } from './engine/predictionEngine.js';

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// Master App State
const state = {
  theme: localStorage.getItem('algolens_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  mode: 'normal', // 'normal' | 'prediction'
  stageView: 'algo', // 'algo' | 'memory'
  activeUnit: 'unit1', // 'unit1'..'unit6' | 'filesystem'
  activeSubtopic: 'bubble',
  steps: [],
  baseArray: [34, 12, 27, 8, 41, 19, 5, 30, 16],
  dsaItems: [],
  // Prediction / Blind Mode State
  predictStreak: 0,
  predictScore: 0,
  isWaitingPrediction: false,
  // File system specific
  fsTree: createInitialFSTree(),
  fsOp: 'dfs-pre',
  fsViewMode: 'general',
  fsSelectedNodeId: 'user',
  fsCustomAction: null,
  tutorHistory: []
};

// Playback controller
const playback = new PlaybackController([], onPlaybackUpdate);

/* ---------------- UNIT DEFINITIONS & TOPIC MAP ---------------- */
const SYLLABUS_UNITS = {
  unit1: {
    name: 'Module 1: Arrays & Sorting',
    topics: {
      bubble: { name: 'Bubble Sort', category: 'sort', source: DSA_ALGORITHMS.bubble },
      selection: { name: 'Selection Sort', category: 'sort', source: DSA_ALGORITHMS.selection },
      insertion: { name: 'Insertion Sort', category: 'sort', source: DSA_ALGORITHMS.insertion },
      merge: { name: 'Merge Sort', category: 'sort', source: DSA_ALGORITHMS.merge },
      quick: { name: 'Quick Sort', category: 'sort', source: DSA_ALGORITHMS.quick },
      heap: { name: 'Heap Sort', category: 'sort', source: UNIT1_SORTING.heap },
      radix: { name: 'Radix Sort', category: 'sort', source: UNIT1_SORTING.radix },
      shell: { name: 'Shell Sort', category: 'sort', source: UNIT1_SORTING.shell },
      bucket: { name: 'Bucket Sort', category: 'sort', source: UNIT1_SORTING.bucket },
      linearSearch: { name: 'Linear Search', category: 'search', source: UNIT1_SEARCHING.linear },
      binarySearch: { name: 'Binary Search', category: 'search', source: UNIT1_SEARCHING.binary },
      indexedSearch: { name: 'Indexed Search', category: 'search', source: UNIT1_SEARCHING.indexed },
      fibonacciSearch: { name: 'Fibonacci Search', category: 'search', source: UNIT1_SEARCHING.fibonacci },
      rowMajor: { name: 'Row-Major Addr', category: 'matrix', source: MATRIX_OPERATIONS.rowMajorAddress },
      colMajor: { name: 'Col-Major Addr', category: 'matrix', source: MATRIX_OPERATIONS.colMajorAddress },
      sparseSimpleTranspose: { name: 'Sparse Simple Transpose', category: 'matrix', source: MATRIX_OPERATIONS.sparseSimpleTranspose },
      sparseFastTranspose: { name: 'Sparse Fast Transpose', category: 'matrix', source: MATRIX_OPERATIONS.sparseFastTranspose }
    }
  },
  unit2: {
    name: 'Module 2: Linked Lists & Vectors',
    topics: {
      sllInsertFront: { name: 'SLL Insert Front', category: 'linkedlist', source: UNIT2_LINKED_LIST.sllInsertFront },
      sllInsertEnd: { name: 'SLL Insert End', category: 'linkedlist', source: UNIT2_LINKED_LIST.sllInsertEnd },
      sllDeleteAt: { name: 'SLL Delete Index', category: 'linkedlist', source: UNIT2_LINKED_LIST.sllDeleteAt },
      sllReverse: { name: 'SLL In-Place Reverse', category: 'linkedlist', source: UNIT2_LINKED_LIST.sllReverse },
      dllOperations: { name: 'Doubly Linked List (DLL)', category: 'linkedlist', source: UNIT2_LINKED_LIST.dllOperations },
      cllOperations: { name: 'Circular Linked List (CLL)', category: 'linkedlist', source: UNIT2_LINKED_LIST.cllOperations },
      gllOperations: { name: 'Generalized Linked List (GLL)', category: 'linkedlist', source: UNIT2_LINKED_LIST.gllOperations },
      polyAdd: { name: 'Polynomial Addition', category: 'poly', source: UNIT2_LINKED_LIST.polyAdd },
      vectorResize: { name: 'Vector Resizing', category: 'vector', source: UNIT2_LINKED_LIST.vectorResize }
    }
  },
  unit3: {
    name: 'Module 3: Stacks & Queues',
    topics: {
      infixToPostfix: { name: 'Infix to Postfix', category: 'stack', source: UNIT3_STACKS_QUEUES.infixToPostfix },
      infixToPrefix: { name: 'Infix to Prefix', category: 'stack', source: UNIT3_STACKS_QUEUES.infixToPrefix },
      postfixEval: { name: 'Postfix Evaluation', category: 'stack', source: UNIT3_STACKS_QUEUES.postfixEval },
      circularQueue: { name: 'Circular Queue', category: 'queue', source: UNIT3_STACKS_QUEUES.circularQueue },
      dequeOperations: { name: 'Double Ended Queue (Deque)', category: 'queue', source: UNIT3_STACKS_QUEUES.dequeOperations },
      josephus: { name: 'Josephus Problem', category: 'queue', source: UNIT3_STACKS_QUEUES.josephus }
    }
  },
  unit4: {
    name: 'Module 4: Trees & BST',
    topics: {
      bstInsert: { name: 'BST Insert', category: 'bst', source: UNIT4_TREES.bstInsert },
      bstDelete: { name: 'BST Delete', category: 'bst', source: UNIT4_TREES.bstDelete },
      threadedBinaryTree: { name: 'Threaded Tree (TBT)', category: 'bst', source: UNIT4_TREES.threadedBinaryTree }
    }
  },
  unit5: {
    name: 'Module 5: Graphs & MST',
    topics: {
      dijkstra: { name: "Dijkstra's Algorithm", category: 'graph', source: UNIT5_GRAPHS.dijkstra },
      kruskal: { name: "Kruskal's MST", category: 'graph', source: UNIT5_GRAPHS.kruskal },
      bipartiteCheck: { name: 'Bipartite Check', category: 'graph', source: UNIT5_GRAPHS.bipartiteCheck }
    }
  },
  unit6: {
    name: 'Module 6: Hashing',
    topics: {
      linearProbing: { name: 'Linear Probing', category: 'hashing', source: UNIT6_HASHING.linearProbing },
      quadraticProbing: { name: 'Quadratic Probing', category: 'hashing', source: UNIT6_HASHING.quadraticProbing },
      separateChaining: { name: 'Separate Chaining', category: 'hashing', source: UNIT6_HASHING.separateChaining },
      extendibleHashing: { name: 'Extendible Hashing', category: 'hashing', source: UNIT6_HASHING.extendibleHashing }
    }
  },
  filesystem: {
    name: 'Module 7: UNIX File System Explorer',
    topics: {
      'dfs-pre': { name: 'DFS Pre-order', category: 'fs', source: FS_OPERATIONS['dfs-pre'] },
      'dfs-post': { name: 'DFS Post-order', category: 'fs', source: FS_OPERATIONS['dfs-post'] },
      'dfs-in': { name: 'In-order (Binary)', category: 'fs', source: FS_OPERATIONS['dfs-in'] },
      'bfs': { name: 'BFS Level-order', category: 'fs', source: FS_OPERATIONS['bfs'] },
      'find-path': { name: 'Find Path to File', category: 'fs', source: FS_OPERATIONS['find-path'] },
      'compute-size': { name: 'Compute Sizes', category: 'fs', source: FS_OPERATIONS['compute-size'] }
    }
  }
};

/* ---------------- INITIALIZATION ---------------- */
function init() {
  applyTheme(state.theme);
  setupHeaderUnitTabs();
  setupEventListeners();
  setupLandingPage();
  switchUnit('unit1');
  switchView('landing'); // Landing page opens first!
  initTutor();
}

/* ---------------- VIEW SWITCHER (LANDING vs WORKBENCH) ---------------- */
function switchView(view) {
  state.currentView = view;
  const isLanding = view === 'landing';
  const landingEl = $('#landing-page-view');
  const workbenchEl = $('#workbench-view');
  const navLandingBtn = $('#nav-btn-landing');
  const navWorkbenchBtn = $('#nav-btn-workbench');

  if (landingEl) landingEl.style.display = isLanding ? 'block' : 'none';
  if (workbenchEl) workbenchEl.style.display = isLanding ? 'none' : 'block';

  if (navLandingBtn) navLandingBtn.classList.toggle('active', isLanding);
  if (navWorkbenchBtn) navWorkbenchBtn.classList.toggle('active', !isLanding);

  if (!isLanding) {
    renderVisualStage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function setupLandingPage() {
  // Brand Logo click returns to landing page
  if ($('#brand-home-btn')) {
    $('#brand-home-btn').onclick = () => switchView('landing');
  }

  // Top Nav Switcher buttons
  if ($('#nav-btn-landing')) {
    $('#nav-btn-landing').onclick = () => switchView('landing');
  }
  if ($('#nav-btn-workbench')) {
    $('#nav-btn-workbench').onclick = () => switchView('workbench');
  }

  // Hero CTA buttons
  if ($('#hero-launch-btn')) {
    $('#hero-launch-btn').onclick = () => switchView('workbench');
  }
  if ($('#hero-blind-btn')) {
    $('#hero-blind-btn').onclick = () => {
      switchView('workbench');
      if ($('#mode-predict-btn')) $('#mode-predict-btn').click();
    };
  }
  if ($('#hero-fs-btn')) {
    $('#hero-fs-btn').onclick = () => {
      switchView('workbench');
      switchUnit('filesystem');
    };
  }

  // Module Showcase "Explore Module X" buttons
  $$('.module-launch-btn').forEach(btn => {
    btn.onclick = () => {
      const unitKey = btn.dataset.unit;
      switchView('workbench');
      if (unitKey) {
        switchUnit(unitKey);
      }
    };
  });
}

/* ---------------- THEME ---------------- */
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('algolens_theme', theme);
  $('#theme-toggle-btn').textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

/* ---------------- UNIT & SUBTOPIC NAVIGATION ---------------- */
function setupHeaderUnitTabs() {
  const container = $('#unit-switcher-nav');
  if (!container) return;
  container.innerHTML = '';

  const unitEmojis = {
    unit1: '📊',
    unit2: '🔗',
    unit3: '🥞',
    unit4: '🌳',
    unit5: '🕸️',
    unit6: '🗝️',
    filesystem: '📁'
  };

  Object.keys(SYLLABUS_UNITS).forEach(unitKey => {
    const btn = document.createElement('button');
    btn.className = `module-btn ${state.activeUnit === unitKey ? 'active' : ''}`;
    btn.innerHTML = `<span style="font-size:14px">${unitEmojis[unitKey] || '📌'}</span> <span>${SYLLABUS_UNITS[unitKey].name}</span>`;
    btn.onclick = () => switchUnit(unitKey);
    container.appendChild(btn);
  });
}

function switchUnit(unitKey) {
  state.activeUnit = unitKey;
  const unitDef = SYLLABUS_UNITS[unitKey];
  if (unitDef) {
    const topicKeys = Object.keys(unitDef.topics);
    state.activeSubtopic = topicKeys[0];
  }
  state.isWaitingPrediction = false;
  if ($('#prediction-card-wrap')) $('#prediction-card-wrap').style.display = 'none';

  playback.pause();

  $$('#unit-switcher-nav .module-btn').forEach((btn, i) => {
    const key = Object.keys(SYLLABUS_UNITS)[i];
    btn.classList.toggle('active', key === unitKey);
  });

  // Render Subtopic Tabs
  const subtopicContainer = $('#subtopic-tabs');
  if (subtopicContainer && unitDef) {
    subtopicContainer.innerHTML = '';
    const topicKeys = Object.keys(unitDef.topics);

    topicKeys.forEach(tKey => {
      const btn = document.createElement('button');
      btn.className = `tab ${tKey === state.activeSubtopic ? 'on' : ''}`;
      btn.textContent = unitDef.topics[tKey].name;
      btn.onclick = () => selectSubtopic(tKey);
      subtopicContainer.appendChild(btn);
    });
  }

  // Show/Hide stages
  const isFS = unitKey === 'filesystem';
  if ($('#dsa-view')) $('#dsa-view').style.display = !isFS ? 'block' : 'none';
  if ($('#fs-view')) $('#fs-view').style.display = isFS ? 'block' : 'none';
  if ($('#dsa-custom-inputs')) $('#dsa-custom-inputs').style.display = unitKey === 'unit1' ? 'flex' : 'none';

  selectSubtopic(state.activeSubtopic);
}

function selectSubtopic(tKey) {
  state.activeSubtopic = tKey;
  state.isWaitingPrediction = false;
  if ($('#prediction-card-wrap')) $('#prediction-card-wrap').style.display = 'none';
  playback.pause();

  const unitDef = SYLLABUS_UNITS[state.activeUnit];
  const topicObj = unitDef?.topics[tKey] || (unitDef ? Object.values(unitDef.topics)[0] : null);
  if (!topicObj) return;

  $$('#subtopic-tabs .tab').forEach(t => {
    t.classList.toggle('on', t.textContent === topicObj.name);
  });

  const src = topicObj.source;

  if ($('#active-algo-name')) $('#active-algo-name').textContent = topicObj.name;
  if ($('#active-tc')) $('#active-tc').textContent = src.time || src.timeComplexity || 'Time O(N)';
  if ($('#active-sc')) $('#active-sc').textContent = src.space || src.spaceComplexity || 'Space O(1)';

  updatePseudocode(src.pseudocode || []);
  buildStepsForCurrentTopic();
}

/* ---------------- STEP BUILDER DISPATCHER ---------------- */
function buildStepsForCurrentTopic() {
  const unitKey = state.activeUnit;
  const unitDef = SYLLABUS_UNITS[unitKey];
  if (!unitDef) return;
  const tKey = state.activeSubtopic;
  const topic = unitDef.topics[tKey] || Object.values(unitDef.topics)[0];
  if (!topic) return;
  const src = topic.source;

  let steps = [];

  const S = (text, line, highlighted, kind, meta) => ({
    order: [],
    highlighted: highlighted || [],
    kind: kind || 'none',
    done: [],
    text,
    line,
    meta
  });

  if (unitKey === 'filesystem') {
    state.fsOp = tKey;
    buildFsSteps();
    return;
  }

  if (unitKey === 'unit1') {
    let seq = 0;
    state.dsaItems = state.baseArray.map(v => ({ id: `bar_${seq++}_${v}`, v }));
    const A = state.dsaItems.map(x => ({ ...x }));
    const doneSet = new Set();
    let comparisons = 0, swaps = 0;

    const S_sort = (text, line, indices, kind, meta) => {
      if (kind === 'cmp') comparisons++;
      if (kind === 'swap') swaps++;
      return {
        order: A.map(x => x.id),
        highlighted: (indices || []).map(i => A[i]?.id || i),
        kind,
        done: Array.from(doneSet),
        text,
        line,
        comparisons,
        swaps,
        meta
      };
    };

    if (topic.category === 'sort') {
      const gen = src.generate(A, S_sort, doneSet);
      steps.push({
        order: A.map(x => x.id),
        highlighted: [],
        kind: 'none',
        done: [],
        text: `Starting ${topic.name} on: [${state.baseArray.join(', ')}].`,
        line: -1,
        comparisons: 0,
        swaps: 0
      });
      for (const s of gen) steps.push(s);
    } else if (topic.category === 'search') {
      const target = state.baseArray[Math.floor(state.baseArray.length / 2)];
      const gen = src.generate(A, target, S_sort, doneSet);
      for (const s of gen) steps.push(s);
    } else if (topic.category === 'matrix') {
      const gen = src.generate(null, S);
      for (const s of gen) steps.push(s);
    }
  } else if (unitKey === 'unit2') {
    const sampleList = [
      { id: 'n1', val: 10, next: 'n2' },
      { id: 'n2', val: 20, next: 'n3' },
      { id: 'n3', val: 30, next: null }
    ];
    if (tKey === 'polyAdd' || tKey === 'vectorResize') {
      const gen = src.generate(null, null, S);
      for (const s of gen) steps.push(s);
    } else if (tKey === 'sllReverse' || tKey === 'dllOperations' || tKey === 'cllOperations') {
      const gen = src.generate(null, S);
      for (const s of gen) steps.push(s);
    } else if (tKey === 'gllOperations') {
      const gen = src.generate(S);
      for (const s of gen) steps.push(s);
    } else if (tKey === 'sllDeleteAt') {
      const gen = src.generate(sampleList, 1, S);
      for (const s of gen) steps.push(s);
    } else {
      const gen = src.generate(sampleList, 45, S);
      for (const s of gen) steps.push(s);
    }
  } else if (unitKey === 'unit3') {
    if (tKey === 'josephus') {
      const gen = src.generate(7, 3, S);
      for (const s of gen) steps.push(s);
    } else if (tKey === 'circularQueue') {
      const gen = src.generate(5, null, S);
      for (const s of gen) steps.push(s);
    } else if (tKey === 'dequeOperations') {
      const gen = src.generate(S);
      for (const s of gen) steps.push(s);
    } else if (tKey === 'infixToPrefix') {
      const gen = src.generate(null, S);
      for (const s of gen) steps.push(s);
    } else {
      const gen = src.generate(null, S);
      for (const s of gen) steps.push(s);
    }
  } else if (unitKey === 'unit4') {
    if (tKey === 'threadedBinaryTree') {
      const gen = src.generate(S);
      for (const s of gen) steps.push(s);
    } else if (tKey === 'bstDelete') {
      const gen = src.generate(30, S);
      for (const s of gen) steps.push(s);
    } else {
      const gen = src.generate(null, S);
      for (const s of gen) steps.push(s);
    }
  } else if (unitKey === 'unit5') {
    if (tKey === 'dijkstra') {
      const gen = src.generate(null, 'A', S);
      for (const s of gen) steps.push(s);
    } else if (tKey === 'kruskal') {
      const gen = src.generate(null, S);
      for (const s of gen) steps.push(s);
    } else {
      const gen = src.generate(S);
      for (const s of gen) steps.push(s);
    }
  } else if (unitKey === 'unit6') {
    if (tKey === 'extendibleHashing') {
      const gen = src.generate(S);
      for (const s of gen) steps.push(s);
    } else {
      const gen = src.generate(null, null, S);
      for (const s of gen) steps.push(s);
    }
  }

  if (steps.length === 0) {
    steps.push({
      order: [],
      highlighted: [],
      kind: 'none',
      done: [],
      text: `Ready to explore ${topic.name}. Step forward or play.`,
      line: -1
    });
  }

  state.steps = steps;
  playback.setSteps(steps);
  renderVisualStage();
  updateMemoryInspector();
}

/* ---------------- FILE SYSTEM STEPS ---------------- */
function buildFsSteps() {
  const treeClone = cloneTree(state.fsTree);
  const doneSet = new Set();
  const S = (text, line, highlighted, kind, meta) => ({
    order: [],
    highlighted: highlighted || [],
    kind: kind || 'none',
    done: Array.from(doneSet),
    text,
    line,
    meta
  });

  const steps = [];
  if (state.fsCustomAction) {
    const gen = generateFileActionStep(
      state.fsCustomAction.action,
      treeClone,
      state.fsCustomAction.params,
      S,
      doneSet
    );
    for (const s of gen) steps.push(s);
  } else {
    const op = FS_OPERATIONS[state.fsOp];
    if (op) {
      const gen = op.generate(treeClone, S, doneSet);
      for (const s of gen) steps.push(s);
    }
  }

  state.steps = steps;
  playback.setSteps(steps);
  renderFsSidebar();
  renderFsDiagram();
  updateFsStats();
  updateMemoryInspector();
}

/* ---------------- STAGE RENDER DISPATCHER ---------------- */
function renderVisualStage() {
  const stage = $('#dsa-stage');
  if (!stage) return;
  const step = playback.getCurrentStep() || state.steps[0];
  const unitKey = state.activeUnit;
  const unitDef = SYLLABUS_UNITS[unitKey];
  if (!unitDef) return;
  const topic = unitDef.topics[state.activeSubtopic] || Object.values(unitDef.topics)[0];
  if (!topic) return;

  if (unitKey === 'unit1' && (topic.category === 'sort' || topic.category === 'search')) {
    renderBarsStage(stage, step);
  } else {
    renderSpecializedStage(stage, step, topic);
  }
}

function renderBarsStage(stage, step) {
  stage.innerHTML = '';
  const maxVal = Math.max(...state.baseArray, 1);
  const stageW = stage.clientWidth || 600;
  const stageH = stage.clientHeight || 300;
  const n = state.dsaItems.length;
  const slotW = n > 0 ? stageW / n : 40;
  const barW = Math.max(10, slotW - 8);

  const order = step.order || state.dsaItems.map(x => x.id);
  const highlighted = step.highlighted || [];
  const done = step.done || [];
  const kind = step.kind || '';

  order.forEach((id, pos) => {
    const it = state.dsaItems.find(x => x.id === id);
    if (!it) return;

    const isHi = highlighted.includes(id);
    const isDone = done.includes(id);

    const el = document.createElement('div');
    el.className = 'bar' + (isHi ? ` ${kind}` : '') + (isDone && !isHi ? ' done' : '');
    el.style.width = `${barW}px`;
    const h = Math.max(28, (it.v / maxVal) * (stageH - 32));
    el.style.height = `${h}px`;

    const x = pos * slotW + 4;
    const y = isHi ? -16 : 0;
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.innerHTML = `<span>${it.v}</span><span class="bar-index">[${pos}]</span>`;

    stage.appendChild(el);
  });

  if ($('#dsa-stat-cmp')) $('#dsa-stat-cmp').textContent = step.comparisons ?? 0;
  if ($('#dsa-stat-swap')) $('#dsa-stat-swap').textContent = step.swaps ?? 0;
  if ($('#dsa-stat-step')) $('#dsa-stat-step').textContent = `${playback.index} / ${state.steps.length - 1}`;
}

function renderSpecializedStage(stage, step, topic) {
  const meta = step?.meta || {};
  stage.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;overflow:auto';

  if (meta.type === 'sparse') {
    renderSparseMatrixView(wrap, meta);
  } else if (meta.type === 'address') {
    renderAddressGrid(wrap, meta);
  } else if (meta.type === 'dll') {
    renderDLLView(wrap, meta);
  } else if (meta.type === 'cll') {
    renderCLLView(wrap, meta);
  } else if (meta.type === 'gll') {
    renderGLLView(wrap, meta);
  } else if (meta.type === 'deque') {
    renderDequeView(wrap, meta);
  } else if (meta.type === 'prefix') {
    renderInfixPrefixView(wrap, meta);
  } else if (meta.list) {
    renderLinkedListNodes(wrap, meta);
  } else if (meta.stack !== undefined || meta.output !== undefined || meta.buffer !== undefined) {
    renderStackQueueView(wrap, meta);
  } else if (meta.tree !== undefined || meta.nodes !== undefined) {
    renderBSTStage(wrap, meta);
  } else if (meta.graph || meta.dist || meta.mstEdges) {
    renderGraphStage(wrap, meta);
  } else if (meta.table || meta.directory) {
    renderHashTableView(wrap, meta);
  } else {
    wrap.innerHTML = `<div style="font-size:15px;color:var(--mute);text-align:center">Interactive visual simulation active for <b>${topic?.name || 'Algorithm'}</b>.<br>Step forward with ▶| or ▶ Play to watch the state transitions.</div>`;
  }

  stage.appendChild(wrap);
}

// Doubly Linked List View (Dual prev & next pointers)
function renderDLLView(wrap, meta) {
  let html = `<div style="font-size:14px;font-weight:700;margin-bottom:14px;color:var(--ink)">🔗 Doubly Linked List (Dual Direction Pointers: <code>prev ⇄ next</code>)</div>`;
  html += `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center">`;

  // Head NULL
  html += `<div style="padding:4px 8px;border-radius:6px;background:var(--code);font-size:11px;font-weight:700;color:var(--mute)">NULL</div>`;
  html += `<span style="font-size:16px;color:var(--acc);font-weight:700;margin:0 4px">⇄</span>`;

  meta.list.forEach((node, idx) => {
    const isAct = meta.activeId === node.id || meta.newNode?.id === node.id;
    const bg = isAct ? 'var(--cmp)' : 'var(--card)';
    const textCol = isAct ? '#fff' : 'var(--ink)';

    html += `
      <div style="background:${bg};color:${textCol};border:2px solid var(--line);border-radius:12px;padding:8px 12px;display:flex;align-items:center;gap:8px;box-shadow:var(--shadow);transition:all 0.3s ease;transform:${isAct ? 'translateY(-6px)' : 'none'}">
        <span style="font-size:10px;padding:2px 4px;background:rgba(0,0,0,0.12);border-radius:4px;font-family:var(--font-mono)">prev</span>
        <span style="font-weight:800;font-size:16px;padding:0 6px">${node.val}</span>
        <span style="font-size:10px;padding:2px 4px;background:rgba(0,0,0,0.12);border-radius:4px;font-family:var(--font-mono)">next</span>
      </div>
    `;

    if (idx < meta.list.length - 1) {
      html += `<span style="font-size:16px;color:var(--acc);font-weight:700;margin:0 4px">⇄</span>`;
    }
  });

  // Tail NULL
  html += `<span style="font-size:16px;color:var(--acc);font-weight:700;margin:0 4px">⇄</span>`;
  html += `<div style="padding:4px 8px;border-radius:6px;background:var(--code);font-size:11px;font-weight:700;color:var(--mute)">NULL</div>`;

  html += `</div>`;
  if (meta.dir) {
    html += `<div style="margin-top:14px;font-size:12.5px;color:var(--acc);font-weight:600">Active Direction: <b>${meta.dir.toUpperCase()}</b> walk</div>`;
  }
  wrap.innerHTML = html;
}

// Circular Linked List View (Tail wraps to Head)
function renderCLLView(wrap, meta) {
  let html = `<div style="font-size:14px;font-weight:700;margin-bottom:14px;color:var(--ink)">🔄 Circular Linked List (Tail <code>next</code> Loops Back to Head)</div>`;
  html += `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center">`;

  meta.list.forEach((node, idx) => {
    const isAct = meta.activeId === node.id;
    const bg = isAct ? 'var(--cmp)' : 'var(--card)';
    const textCol = isAct ? '#fff' : 'var(--ink)';

    html += `
      <div style="background:${bg};color:${textCol};border:2px solid var(--line);border-radius:12px;padding:8px 14px;display:flex;align-items:center;gap:8px;box-shadow:var(--shadow);transition:all 0.3s ease;transform:${isAct ? 'translateY(-6px)' : 'none'}">
        <span style="font-weight:800;font-size:16px">${node.val}</span>
        <span style="border-left:1px solid rgba(0,0,0,0.15);padding-left:6px;font-size:10px;font-family:var(--font-mono)">next</span>
      </div>
    `;

    if (idx < meta.list.length - 1) {
      html += `<span style="font-size:18px;color:var(--acc);font-weight:700">➔</span>`;
    }
  });

  // Circular loop badge linking tail back to head
  html += `
    <div style="background:var(--acc-light);border:1.5px dashed var(--acc);color:var(--acc);border-radius:10px;padding:8px 12px;font-weight:700;font-size:12px;display:flex;align-items:center;gap:6px">
      <span>↺</span>
      <span>Tail wraps back to Head Node (${meta.list[0]?.val})</span>
    </div>
  `;

  html += `</div>`;
  wrap.innerHTML = html;
}

// Generalized Linked List View (Nested Atoms and Sublists)
function renderGLLView(wrap, meta) {
  let html = `<div style="font-size:14px;font-weight:700;margin-bottom:14px;color:var(--ink)">🗂️ Generalized Linked List (Atoms &amp; Recursive Sublists)</div>`;
  html += `<div style="display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap;justify-content:center">`;

  meta.gll.forEach((item, idx) => {
    const isAct = meta.activePath?.[0] === idx;
    if (item.type === 'atom') {
      html += `
        <div style="background:${isAct ? 'var(--cmp)' : 'var(--card)'};color:${isAct ? '#fff' : 'var(--ink)'};border:2px solid var(--line);border-radius:10px;padding:10px 16px;box-shadow:var(--shadow);text-align:center">
          <div style="font-size:10px;font-weight:700;opacity:0.75;text-transform:uppercase">Atom</div>
          <div style="font-size:18px;font-weight:800">${item.val}</div>
        </div>
      `;
    } else if (item.type === 'sublist') {
      html += `
        <div style="border:2px dashed var(--acc);border-radius:12px;padding:10px 14px;background:var(--code);box-shadow:var(--shadow)">
          <div style="font-size:11px;font-weight:700;color:var(--acc);margin-bottom:6px">⇣ ${item.label}</div>
          <div style="display:flex;gap:8px">
            ${item.children.map((child, cIdx) => {
              const isChildAct = isAct && meta.activePath?.[1] === cIdx;
              return `
                <div style="background:${isChildAct ? 'var(--swap)' : 'var(--card)'};color:${isChildAct ? '#fff' : 'var(--ink)'};border:1px solid var(--line);border-radius:8px;padding:6px 12px;font-weight:700;font-size:14px">
                  ${child.val}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (idx < meta.gll.length - 1) {
      html += `<span style="font-size:18px;color:var(--mute);margin-top:14px">➔</span>`;
    }
  });

  html += `</div>`;
  wrap.innerHTML = html;
}

// Double Ended Queue View (Deque)
function renderDequeView(wrap, meta) {
  let html = `<div style="font-size:14px;font-weight:700;margin-bottom:12px;color:var(--ink)">↔️ Double Ended Queue (Deque: Front ⇄ Rear)</div>`;
  if (meta.activeOp) {
    html += `<div style="margin-bottom:10px;padding:4px 12px;background:var(--acc-light);border:1px solid var(--acc);border-radius:8px;font-size:12.5px;color:var(--acc);font-weight:700">⚡ Operation: <code>${meta.activeOp}</code> (${meta.activeVal ?? ''})</div>`;
  }

  html += `<div style="display:flex;gap:8px;align-items:center;justify-content:center">`;
  html += `<div style="font-size:12px;font-weight:700;color:var(--cmp);display:flex;align-items:center;gap:4px">◀ Front</div>`;

  html += `<div style="display:flex;gap:6px;padding:12px;background:var(--card);border:2px solid var(--line);border-radius:14px;min-width:300px">`;
  meta.items.forEach((item, idx) => {
    const isFront = idx === meta.front;
    const isRear = idx === meta.rear;
    const isFilled = item !== null;
    html += `
      <div style="flex:1;min-width:44px;height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${isFilled ? 'var(--acc)' : 'var(--code)'};color:${isFilled ? '#fff' : 'var(--mute)'};border-radius:8px;font-weight:700;position:relative">
        <span>${isFilled ? item : '-'}</span>
        ${isFront ? `<span style="position:absolute;top:-18px;font-size:9.5px;color:var(--cmp);font-weight:800">F[${idx}]</span>` : ''}
        ${isRear ? `<span style="position:absolute;bottom:-18px;font-size:9.5px;color:var(--ok);font-weight:800">R[${idx}]</span>` : ''}
      </div>
    `;
  });
  html += `</div>`;

  html += `<div style="font-size:12px;font-weight:700;color:var(--ok);display:flex;align-items:center;gap:4px">Rear ▶</div>`;
  html += `</div>`;
  wrap.innerHTML = html;
}

// Infix to Prefix Conversion View
function renderInfixPrefixView(wrap, meta) {
  let html = `<div style="font-size:14px;font-weight:700;margin-bottom:12px;color:var(--ink)">🔀 Infix to Prefix Conversion (3-Stage Inversion Pipeline)</div>`;
  html += `<div style="display:flex;gap:18px;flex-wrap:wrap;justify-content:center;max-width:650px">`;

  // Step 1: Reversed Infix
  html += `
    <div style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;min-width:180px">
      <div class="lbl">1. Inverted Infix (Parentheses Swapped)</div>
      <div style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--ink)">${meta.reversedInfix || meta.expr || '-'}</div>
    </div>
  `;

  // Step 2: Stack & Intermediate Output
  if (meta.stack) {
    html += `
      <div style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;min-width:140px">
        <div class="lbl">2. Operator Stack</div>
        <div style="font-family:var(--font-mono);font-size:13px;color:var(--cmp);font-weight:700">[${meta.stack.join(', ')}]</div>
      </div>
    `;
  }

  if (meta.output) {
    html += `
      <div style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;min-width:180px">
        <div class="lbl">Intermediate Output</div>
        <div style="font-family:var(--font-mono);font-size:13px;color:var(--acc);font-weight:700">${meta.output.join(' ') || '-'}</div>
      </div>
    `;
  }

  // Step 3: Final Prefix
  if (meta.finalPrefix) {
    html += `
      <div style="width:100%;background:rgba(6,185,135,0.1);border:1.5px solid var(--ok);border-radius:12px;padding:12px;text-align:center">
        <div class="lbl" style="color:var(--ok)">3. Final Prefix Expression (Reversed Output)</div>
        <div style="font-family:var(--font-mono);font-size:18px;font-weight:800;color:var(--ok)">${meta.finalPrefix}</div>
      </div>
    `;
  }

  html += `</div>`;
  wrap.innerHTML = html;
}

// 1. Sparse Matrix View
function renderSparseMatrixView(wrap, meta) {
  let html = `<div style="font-size:13px;font-weight:700;margin-bottom:8px">Sparse Matrix (3-Tuple: [Row, Col, Value])</div>`;
  html += `<div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center">`;
  html += `<div><div class="lbl">Original 3-Tuple</div><table class="complexity-table" style="width:160px"><tr><th>Row</th><th>Col</th><th>Val</th></tr>`;
  meta.matrix.terms.forEach(t => {
    html += `<tr><td>${t.r}</td><td>${t.c}</td><td><b>${t.v}</b></td></tr>`;
  });
  html += `</table></div>`;

  if (meta.total) {
    html += `<div><div class="lbl">total[col] (Frequency)</div><div style="display:flex;gap:4px">`;
    meta.total.forEach((cnt, c) => {
      html += `<div style="padding:4px 8px;background:var(--card);border:1px solid var(--line);border-radius:6px;font-size:12px">c${c}: <b>${cnt}</b></div>`;
    });
    html += `</div>`;

    if (meta.startPos) {
      html += `<div class="lbl" style="margin-top:10px">start_pos[col] (Prefix Positions)</div><div style="display:flex;gap:4px">`;
      meta.startPos.forEach((pos, c) => {
        html += `<div style="padding:4px 8px;background:var(--acc-light);border:1px solid var(--acc);color:var(--acc);border-radius:6px;font-size:12px">c${c}: <b>${pos}</b></div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;
  }

  if (meta.transposed) {
    html += `<div><div class="lbl">Transposed 3-Tuple [Linear O(C+T)]</div><table class="complexity-table" style="width:160px"><tr><th>Row</th><th>Col</th><th>Val</th></tr>`;
    meta.transposed.forEach(t => {
      html += `<tr style="background:rgba(6,185,135,0.1)"><td>${t.r}</td><td>${t.c}</td><td><b>${t.v}</b></td></tr>`;
    });
    html += `</table></div>`;
  }

  html += `</div>`;
  wrap.innerHTML = html;
}

// 2. Address Calculation Grid
function renderAddressGrid(wrap, meta) {
  let html = `<div style="font-size:13.5px;font-weight:700;margin-bottom:8px">2D Array Memory Mapping (${meta.mode === 'row' ? 'Row-Major' : 'Column-Major'})</div>`;
  html += `<div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">`;

  html += `<div><div class="lbl">2D Grid Layout (${meta.rows}×${meta.cols})</div><div style="display:grid;grid-template-columns:repeat(${meta.cols}, 40px);gap:4px">`;
  for (let r = 0; r < meta.rows; r++) {
    for (let c = 0; c < meta.cols; c++) {
      const isTarget = r === meta.targetI && c === meta.targetJ;
      html += `<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${isTarget ? 'var(--acc)' : 'var(--card)'};color:${isTarget ? '#fff' : 'var(--ink)'};border:1px solid var(--line);border-radius:8px;font-weight:600;font-size:11px">[${r},${c}]</div>`;
    }
  }
  html += `</div></div>`;

  html += `<div style="max-width:320px;font-size:13px;line-height:1.7;background:var(--card);padding:14px;border-radius:12px;border:1px solid var(--line)">
    <div class="lbl">Address Computation</div>
    <div>• Base Address: <code>${meta.base}</code></div>
    <div>• Element Size (W): <code>${meta.w} bytes</code></div>
    <div>• Target: <code>A[${meta.targetI}][${meta.targetJ}]</code></div>
    ${meta.stepVal !== undefined ? `<div>• Elements Offset: <b>${meta.stepVal}</b></div>` : ''}
    ${meta.resultAddr !== undefined ? `<div style="margin-top:6px;font-size:14px;color:var(--ok);font-weight:700">✓ Final Memory Address = ${meta.resultAddr}</div>` : ''}
  </div></div>`;

  wrap.innerHTML = html;
}

// 3. Linked List Nodes Chain
function renderLinkedListNodes(wrap, meta) {
  let html = `<div style="font-size:13.5px;font-weight:700;margin-bottom:12px">Linked List Pointer Visualization</div>`;
  html += `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center">`;

  meta.list.forEach((node, idx) => {
    const isAct = meta.activeId === node.id || meta.newNode?.id === node.id;
    const isDel = meta.deletedId === node.id;
    const bg = isDel ? 'var(--swap)' : isAct ? 'var(--cmp)' : 'var(--card)';
    const textCol = isDel || isAct ? '#fff' : 'var(--ink)';

    html += `
      <div style="display:flex;align-items:center">
        <div style="background:${bg};color:${textCol};border:2px solid var(--line);border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:8px;box-shadow:var(--shadow)">
          <span style="font-weight:700;font-size:15px">${node.val}</span>
          <span style="border-left:1px solid rgba(0,0,0,0.2);padding-left:6px;font-size:10px;opacity:0.8">next</span>
        </div>
        ${idx < meta.list.length - 1 ? `<span style="margin:0 6px;font-size:18px;color:var(--acc)">➔</span>` : `<span style="margin:0 6px;font-size:12px;color:var(--mute)">➔ NULL</span>`}
      </div>
    `;
  });

  html += `</div>`;
  wrap.innerHTML = html;
}

// 4. Stack & Queue Visualizer
function renderStackQueueView(wrap, meta) {
  let html = `<div style="display:flex;gap:30px;flex-wrap:wrap;align-items:center;justify-content:center">`;

  if (meta.stack) {
    html += `<div><div class="lbl">Stack (LIFO)</div><div style="display:flex;flex-direction:column-reverse;width:80px;min-height:160px;border:3px solid var(--line);border-top:none;border-radius:0 0 12px 12px;padding:4px;gap:4px;background:var(--card)">`;
    meta.stack.forEach(item => {
      html += `<div style="padding:8px;background:var(--acc);color:#fff;border-radius:6px;text-align:center;font-weight:700;font-size:13px">${item}</div>`;
    });
    html += `</div></div>`;
  }

  if (meta.output) {
    html += `<div><div class="lbl">Output Queue</div><div style="display:flex;gap:6px;padding:10px;background:var(--card);border:1px solid var(--line);border-radius:12px;min-width:180px">`;
    meta.output.forEach(item => {
      html += `<div style="padding:6px 10px;background:var(--code);border-radius:6px;font-weight:700">${item}</div>`;
    });
    html += `</div></div>`;
  }

  if (meta.buffer) {
    html += `<div><div class="lbl">Circular Buffer (${meta.count}/${meta.cap})</div><div style="display:flex;gap:6px">`;
    meta.buffer.forEach((item, idx) => {
      const isFront = idx === meta.front;
      const isRear = idx === meta.rear;
      html += `
        <div style="display:flex;flex-direction:column;align-items:center">
          <div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:${item !== null ? 'var(--acc)' : 'var(--card)'};color:${item !== null ? '#fff' : 'var(--mute)'};border:2px solid var(--line);border-radius:10px;font-weight:700">
            ${item !== null ? item : '-'}
          </div>
          <span style="font-size:10px;margin-top:2px;color:var(--mute)">[${idx}]</span>
          ${isFront ? `<span class="pill purple" style="font-size:9px;padding:1px 4px;margin-top:2px">Front</span>` : ''}
          ${isRear ? `<span class="pill orange" style="font-size:9px;padding:1px 4px;margin-top:2px">Rear</span>` : ''}
        </div>
      `;
    });
    html += `</div></div>`;
  }

  html += `</div>`;
  wrap.innerHTML = html;
}

// 5. Binary Search Tree / TBT Stage
function renderBSTStage(wrap, meta) {
  if (meta.nodes) {
    let html = `<div style="font-size:13.5px;font-weight:700;margin-bottom:8px">Threaded Binary Tree (In-Order Successor Threads)</div>`;
    html += `<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">`;
    meta.nodes.forEach(n => {
      const isAct = meta.activeId === n.id;
      html += `
        <div style="background:${isAct ? 'var(--cmp)' : 'var(--card)'};color:${isAct ? '#fff' : 'var(--ink)'};border:2px solid var(--line);border-radius:12px;padding:10px 14px;box-shadow:var(--shadow)">
          <div style="font-size:16px;font-weight:700">${n.val}</div>
          <div style="font-size:10px;color:${isAct ? '#fff' : 'var(--mute)'}">${n.hasThread ? `🔗 Thread ➔ ${n.threadTarget}` : 'Normal Node'}</div>
        </div>
      `;
    });
    html += `</div>`;
    wrap.innerHTML = html;
    return;
  }

  wrap.innerHTML = `
    <div style="font-size:13.5px;font-weight:700;margin-bottom:6px">Binary Search Tree (Left < Root ≤ Right)</div>
    <div style="color:var(--mute);font-size:12px;margin-bottom:12px">Root: 50 | In-order traversal visits nodes in sorted numerical order.</div>
    <svg width="400" height="180" viewBox="0 0 400 180">
      <line x1="200" y1="30" x2="120" y2="70" stroke="var(--line)" stroke-width="2" />
      <line x1="200" y1="30" x2="280" y2="70" stroke="var(--line)" stroke-width="2" />
      <line x1="120" y1="70" x2="80" y2="120" stroke="var(--line)" stroke-width="2" />
      <line x1="120" y1="70" x2="160" y2="120" stroke="var(--line)" stroke-width="2" />
      <line x1="280" y1="70" x2="240" y2="120" stroke="var(--line)" stroke-width="2" />
      <line x1="280" y1="70" x2="320" y2="120" stroke="var(--line)" stroke-width="2" />
      <circle cx="200" cy="30" r="18" fill="var(--card)" stroke="var(--acc)" stroke-width="2.5" />
      <text x="200" y="35" text-anchor="middle" fill="var(--ink)" font-size="12" font-weight="700">50</text>
      <circle cx="120" cy="70" r="16" fill="var(--card)" stroke="var(--cmp)" stroke-width="2" />
      <text x="120" y="75" text-anchor="middle" fill="var(--ink)" font-size="11" font-weight="700">30</text>
      <circle cx="280" cy="70" r="16" fill="var(--card)" stroke="var(--line)" stroke-width="2" />
      <text x="280" y="75" text-anchor="middle" fill="var(--ink)" font-size="11" font-weight="700">70</text>
      <circle cx="80" cy="120" r="14" fill="var(--card)" stroke="var(--line)" stroke-width="2" />
      <text x="80" y="124" text-anchor="middle" fill="var(--ink)" font-size="10">20</text>
      <circle cx="160" cy="120" r="14" fill="var(--card)" stroke="var(--ok)" stroke-width="2" />
      <text x="160" y="124" text-anchor="middle" fill="var(--ink)" font-size="10">40</text>
      <circle cx="240" cy="120" r="14" fill="var(--card)" stroke="var(--line)" stroke-width="2" />
      <text x="240" y="124" text-anchor="middle" fill="var(--ink)" font-size="10">60</text>
      <circle cx="320" cy="120" r="14" fill="var(--card)" stroke="var(--line)" stroke-width="2" />
      <text x="320" y="124" text-anchor="middle" fill="var(--ink)" font-size="10">80</text>
    </svg>
  `;
}

// 6. Graph & MST Stage
function renderGraphStage(wrap, meta) {
  wrap.innerHTML = `
    <div style="font-size:13.5px;font-weight:700;margin-bottom:8px">Graph Network & Shortest Path / MST Relaxation</div>
    <div style="display:flex;gap:30px;align-items:center;flex-wrap:wrap">
      <svg width="240" height="160" viewBox="0 0 240 160">
        <line x1="50" y1="40" x2="190" y2="40" stroke="var(--line)" stroke-width="2" />
        <line x1="50" y1="40" x2="120" y2="120" stroke="var(--acc)" stroke-width="3" />
        <line x1="190" y1="40" x2="120" y2="120" stroke="var(--line)" stroke-width="2" />
        <circle cx="50" cy="40" r="18" fill="var(--acc)" stroke="#fff" stroke-width="2" />
        <text x="50" y="45" text-anchor="middle" fill="#fff" font-weight="700">A</text>
        <circle cx="190" cy="40" r="18" fill="var(--card)" stroke="var(--line)" stroke-width="2" />
        <text x="190" y="45" text-anchor="middle" fill="var(--ink)" font-weight="700">B</text>
        <circle cx="120" cy="120" r="18" fill="var(--card)" stroke="var(--cmp)" stroke-width="2.5" />
        <text x="120" y="125" text-anchor="middle" fill="var(--ink)" font-weight="700">C</text>
      </svg>
      <div style="background:var(--card);padding:14px;border:1px solid var(--line);border-radius:12px;font-size:12.5px;line-height:1.7">
        <div class="lbl">Relaxation & Distance Table</div>
        ${meta.dist ? Object.entries(meta.dist).map(([k, v]) => `<div>• dist[${k}] = <b>${v}</b></div>`).join('') : ''}
        ${meta.totalCost !== undefined ? `<div style="margin-top:6px;color:var(--ok);font-weight:700">✓ MST Cost = ${meta.totalCost}</div>` : ''}
      </div>
    </div>
  `;
}

// 7. Hash Table Stage
function renderHashTableView(wrap, meta) {
  let html = `<div style="font-size:13.5px;font-weight:700;margin-bottom:8px">Hash Table Bucket Array & Collision Resolution</div>`;
  html += `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">`;

  if (meta.table) {
    meta.table.forEach((slot, idx) => {
      const isArr = Array.isArray(slot);
      const isAct = meta.activeSlot === idx || meta.activeBucket === idx;
      const isOccupied = isArr ? slot.length > 0 : slot !== null;
      html += `
        <div style="display:flex;flex-direction:column;align-items:center">
          <div style="min-width:44px;min-height:50px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${isAct ? 'var(--cmp)' : isOccupied ? 'var(--card)' : 'var(--bg)'};color:${isAct ? '#fff' : 'var(--ink)'};border:2px solid ${isOccupied ? 'var(--acc)' : 'var(--line)'};border-radius:10px;padding:4px 6px">
            <span style="font-weight:700;font-size:13px">${isArr ? (slot.join(' ➔ ') || '∅') : (slot ?? '∅')}</span>
          </div>
          <span style="font-size:10px;color:var(--mute);margin-top:2px">Bucket [${idx}]</span>
        </div>
      `;
    });
  }

  html += `</div>`;
  wrap.innerHTML = html;
}

/* ---------------- MEMORY VISUALIZER (STACK & HEAP) ---------------- */
function updateMemoryInspector() {
  const container = $('#memory-inspector');
  if (!container || state.stageView !== 'memory') return;

  const stackContainer = $('#memory-stack-frames');
  const heapContainer = $('#memory-heap-chunks');
  if (!stackContainer || !heapContainer) return;

  const step = playback.getCurrentStep() || state.steps[0];
  const { stackFrames, heapChunks } = generateMemorySnapshot(
    state.activeUnit,
    state.activeSubtopic,
    playback.index,
    step,
    state.baseArray
  );

  // Render Call Stack frames
  stackContainer.innerHTML = '';
  stackFrames.forEach(frame => {
    const el = document.createElement('div');
    el.className = 'stack-frame';
    let varsHtml = '';
    frame.vars.forEach(v => {
      varsHtml += `<div class="stack-var"><span>${v.name}:</span><b>${v.val}</b></div>`;
    });
    el.innerHTML = `
      <div class="stack-frame-header">
        <span>${frame.name}</span>
        <span class="hex-addr">${frame.addr}</span>
      </div>
      <div>${varsHtml}</div>
    `;
    stackContainer.appendChild(el);
  });

  // Render Heap chunks
  heapContainer.innerHTML = '';
  heapChunks.forEach(chunk => {
    const el = document.createElement('div');
    el.className = `heap-chunk ${chunk.active ? 'active' : ''} ${chunk.target ? 'target' : ''}`;
    el.innerHTML = `
      <div class="heap-chunk-addr">${chunk.addr}</div>
      <div style="font-weight:700;font-size:12px">${chunk.label}</div>
      <div class="heap-chunk-fields">${chunk.val}</div>
    `;
    heapContainer.appendChild(el);
  });
}

/* ---------------- PREDICTION CHALLENGE MODE ---------------- */
function checkPredictionModeOnStep() {
  if (state.mode !== 'prediction') return;

  const currentStep = playback.getCurrentStep();
  const nextStep = state.steps[playback.index + 1];

  if (!nextStep) return;

  // Pause playback and present prediction challenge
  state.isWaitingPrediction = true;
  playback.pause();

  const qObj = generatePredictionQuestion(
    state.activeUnit,
    state.activeSubtopic,
    playback.index,
    currentStep,
    nextStep
  );

  const cardWrap = $('#prediction-card-wrap');
  const qTitle = $('#predict-question');
  const optBox = $('#predict-options-box');
  const feedback = $('#predict-feedback');
  const continueBtn = $('#predict-continue-btn');

  if (!cardWrap || !qTitle || !optBox) return;

  cardWrap.style.display = 'block';
  feedback.style.display = 'none';
  continueBtn.style.display = 'none';
  qTitle.textContent = qObj.question;
  optBox.innerHTML = '';

  qObj.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'prediction-opt-btn';
    btn.innerHTML = `<span style="font-weight:700;color:var(--acc)">${String.fromCharCode(65 + idx)}.</span> <span>${opt.text}</span>`;
    btn.onclick = () => {
      // Disable all option buttons
      $$('.prediction-opt-btn').forEach(b => (b.disabled = true));

      if (opt.correct) {
        btn.classList.add('correct');
        state.predictStreak++;
        state.predictScore += 100;
        feedback.className = 'prediction-feedback success';
        feedback.innerHTML = `<b>🎉 Correct! (+100 pts)</b> ${qObj.explanation}`;
      } else {
        btn.classList.add('incorrect');
        state.predictStreak = 0;
        feedback.className = 'prediction-feedback error';
        feedback.innerHTML = `<b>✕ Not quite!</b> ${qObj.explanation}`;

        // Highlight correct option
        $$('.prediction-opt-btn').forEach((b, i) => {
          if (qObj.options[i].correct) b.classList.add('correct');
        });
      }

      if ($('#predict-streak')) $('#predict-streak').textContent = state.predictStreak;
      if ($('#predict-score')) $('#predict-score').textContent = `${state.predictScore} pts`;

      feedback.style.display = 'block';
      continueBtn.style.display = 'inline-block';
    };
    optBox.appendChild(btn);
  });

  continueBtn.onclick = () => {
    cardWrap.style.display = 'none';
    state.isWaitingPrediction = false;
    playback.stepNext();
  };
}

/* ---------------- PLAYBACK CALLBACK ---------------- */
function onPlaybackUpdate({ index, step, total, isPlaying, speed }) {
  if ($('#scrub')) {
    $('#scrub').max = Math.max(0, total - 1);
    $('#scrub').value = index;
  }
  if ($('#play-btn')) $('#play-btn').textContent = isPlaying ? '⏸ Pause' : '▶ Play';
  if ($('#speed-slider')) $('#speed-slider').value = speed;
  if ($('#speed-val')) $('#speed-val').textContent = `${speed}x`;

  if (!step) return;

  const currentTopic = SYLLABUS_UNITS[state.activeUnit]?.topics[state.activeSubtopic];
  updateExplanation(step, currentTopic, index, total);
  updateActivePseudocodeLine(step.line);

  if (state.activeUnit === 'filesystem') {
    renderFsSidebar();
    renderFsDiagram();
    updateFsStats();
  } else {
    renderVisualStage();
  }

  updateMemoryInspector();
}

/* ---------------- PSEUDOCODE & EXPLANATION ---------------- */
function updatePseudocode(lines) {
  const container = $('#pseudocode-box');
  if (!container) return;
  container.innerHTML = '';
  lines.forEach((line, idx) => {
    const el = document.createElement('div');
    el.className = 'code-line';
    el.id = `code-line-${idx}`;
    el.textContent = line;
    container.appendChild(el);
  });
}

function updateActivePseudocodeLine(activeLine) {
  $$('.code-line').forEach((el, idx) => {
    el.classList.toggle('on', idx === activeLine);
  });
}

function buildDetailedExplanation(step, topic, index, total) {
  const cat = topic?.category || 'algo';
  const name = topic?.name || 'Algorithm';
  const text = step?.text || 'Executing step transition.';
  const kind = step?.kind || 'none';
  const isStart = index === 0;
  const isEnd = index >= total - 1 && total > 1;

  let action = text;
  let invariant = '';
  let memory = '';
  let next = '';

  // 1. INVARIANT & PRINCIPLE
  if (isStart) {
    invariant = `${name} begins initialization. Establishes the base invariant and prepares the data structure for execution. Expected time complexity: ${topic?.source?.time || 'O(N)'}.`;
  } else if (isEnd) {
    invariant = `Postcondition achieved! ${name} has completed. All ordering and structural invariants are fully satisfied.`;
  } else if (cat === 'sort') {
    if (kind === 'cmp') {
      invariant = `In ${name}, elements are compared pairwise to verify sorted order ($A[i] \\le A[j]$). If the left element exceeds the right, an inversion is detected.`;
    } else if (kind === 'swap') {
      invariant = `In-place element exchange rectifies the detected inversion, moving the larger value closer to its final sorted partition.`;
    } else {
      invariant = `Partition boundary or loop iterator advances, preserving the sorted subarray prefix.`;
    }
  } else if (cat === 'search') {
    if (kind === 'cmp') {
      invariant = `Searching invariant: tests midpoint or candidate element to prune half the active search space or locate target.`;
    } else if (kind === 'swap') {
      invariant = `Target successfully located! Search terminates early with optimal ${topic?.source?.time || 'O(log n)'} efficiency.`;
    } else {
      invariant = `Candidate does not match target key; active window boundaries are adjusted.`;
    }
  } else if (cat === 'matrix') {
    invariant = `Memory representation mapping: computes 1D memory offset via Base + W * (Offset) formula or builds sparse prefix position vectors.`;
  } else if (cat === 'linkedlist' || cat === 'poly' || cat === 'vector') {
    invariant = `Dynamic pointer rewiring: updates forward and backward pointers in heap space without contiguous memory shifts, ensuring O(1) mutations.`;
  } else if (cat === 'stack' || cat === 'queue') {
    invariant = `Strict access discipline: enforces LIFO (Last-In-First-Out) for Stacks or FIFO (First-In-First-Out) circular buffer modular arithmetic.`;
  } else if (cat === 'bst') {
    invariant = `Binary Search Tree invariant: left child values < node.val < right child values across all recursive subtrees.`;
  } else if (cat === 'graph') {
    invariant = `Graph traversal and optimization: relaxes edge distances greedily or tracks connected components via Disjoint Set Union.`;
  } else if (cat === 'hashing') {
    invariant = `Hash mapping: calculates h(k) = k mod M. Employs collision probing sequence or chaining to resolve address conflicts.`;
  } else if (cat === 'fs') {
    invariant = `Hierarchical inode traversal: visits folder nodes in depth-first or breadth-first tree order, aggregating directory disk usage.`;
  } else {
    invariant = `Standard state transition preserving core invariants of ${name}.`;
  }

  // 2. MEMORY & RAM
  if (cat === 'sort' || cat === 'search') {
    memory = `Heap block 0x10A4_B000 elements loaded into CPU registers. Comparisons: ${step?.comparisons ?? 0}, Swaps/Moves: ${step?.swaps ?? 0}.`;
  } else if (cat === 'matrix') {
    memory = `1D Memory Mapping: Base = 1000, Element Size W = 4 bytes. Memory address offset computed directly.`;
  } else if (cat === 'linkedlist' || cat === 'poly' || cat === 'vector') {
    memory = `Dynamic Heap Allocation (0x10A4_...): Node addresses linked via 64-bit forward pointers; zero array shifting overhead.`;
  } else if (cat === 'stack' || cat === 'queue') {
    memory = `Call Stack / Buffer Memory (0x7FFF_EF40): Top pointer SP and queue pointers (front, rear) updated in registers.`;
  } else if (cat === 'bst' || cat === 'fs') {
    memory = `Tree Inode / Node Memory (0x10A4_...): Parent pointer and child reference pointers traversed in heap memory.`;
  } else if (cat === 'graph') {
    memory = `Graph Adjacency Memory: Distance vector and visited bitmask array updated in heap space.`;
  } else if (cat === 'hashing') {
    memory = `Hash Table Bucket Array: Memory slot Base + (slot × 4) bytes inspected. Collision probes recorded.`;
  } else {
    memory = `64-Bit Memory state synchronized with step ${index + 1} of ${total}.`;
  }

  // 3. NEXT TRANSITION
  if (isEnd) {
    next = `Postcondition finalized! You can inspect the final memory state, compare other algorithms, or test yourself in Blind Prediction Mode.`;
  } else if (kind === 'cmp') {
    next = `Next step will evaluate the comparison result to determine whether to execute an in-place swap, shift, or advance to the next index.`;
  } else if (kind === 'swap') {
    next = `Next step will complete value repositioning and advance loop pointers to the next candidate partition.`;
  } else {
    next = `Next step will continue the algorithm trajectory. Press ▶| to advance or ▶ Play to animate.`;
  }

  return { action, invariant, memory, next };
}

function updateExplanation(stepOrText, topic, index = 0, total = 1) {
  const why = $('#why');
  if (!why) return;
  why.style.animation = 'none';
  why.offsetHeight;
  why.style.animation = 'in .35s';

  if (!stepOrText) {
    why.innerHTML = `
      <div class="explanation-container">
        <div class="exp-row op">
          <span class="exp-badge op">Status</span>
          <span class="exp-text">Ready. Step through with ▶| or press Play to begin execution.</span>
        </div>
      </div>
    `;
    return;
  }

  const step = typeof stepOrText === 'object' ? stepOrText : { text: stepOrText, kind: 'none' };
  const currentTopic = topic || SYLLABUS_UNITS[state.activeUnit]?.topics[state.activeSubtopic];
  const expObj = buildDetailedExplanation(step, currentTopic, index, total);

  why.innerHTML = `
    <div class="explanation-container">
      <div class="exp-row op">
        <span class="exp-badge op">1. Operation</span>
        <span class="exp-text"><strong>Action:</strong> ${expObj.action}</span>
      </div>
      <div class="exp-row why">
        <span class="exp-badge why">2. Invariant</span>
        <span class="exp-text"><strong>Principle:</strong> ${expObj.invariant}</span>
      </div>
      <div class="exp-row mem">
        <span class="exp-badge mem">3. Memory &amp; RAM</span>
        <span class="exp-text"><strong>Internals:</strong> ${expObj.memory}</span>
      </div>
      <div class="exp-row next">
        <span class="exp-badge next">4. Next Step</span>
        <span class="exp-text"><strong>Preview:</strong> ${expObj.next}</span>
      </div>
    </div>
  `;
}

/* ---------------- EVENT LISTENERS ---------------- */
function setupEventListeners() {
  if ($('#theme-toggle-btn')) $('#theme-toggle-btn').onclick = toggleTheme;

  // Mode Switcher: Normal vs Prediction Challenge
  if ($('#mode-normal-btn')) {
    $('#mode-normal-btn').onclick = () => {
      state.mode = 'normal';
      state.isWaitingPrediction = false;
      $('#mode-normal-btn').classList.add('active');
      $('#mode-predict-btn').classList.remove('active');
      if ($('#prediction-card-wrap')) $('#prediction-card-wrap').style.display = 'none';
    };
  }

  if ($('#mode-predict-btn')) {
    $('#mode-predict-btn').onclick = () => {
      state.mode = 'prediction';
      $('#mode-predict-btn').classList.add('active');
      $('#mode-normal-btn').classList.remove('active');
      checkPredictionModeOnStep();
    };
  }

  // Stage View Switcher: Visual Stage vs Memory RAM
  if ($('#view-stage-algo-btn')) {
    $('#view-stage-algo-btn').onclick = () => {
      state.stageView = 'algo';
      $('#view-stage-algo-btn').classList.add('active');
      $('#view-stage-memory-btn').classList.remove('active');
      $('#dsa-stage').style.display = 'block';
      $('#memory-inspector').style.display = 'none';
      renderVisualStage();
    };
  }

  if ($('#view-stage-memory-btn')) {
    $('#view-stage-memory-btn').onclick = () => {
      state.stageView = 'memory';
      $('#view-stage-memory-btn').classList.add('active');
      $('#view-stage-algo-btn').classList.remove('active');
      $('#dsa-stage').style.display = 'none';
      $('#memory-inspector').style.display = 'block';
      updateMemoryInspector();
    };
  }

  // Playback Controls
  if ($('#play-btn')) {
    $('#play-btn').onclick = () => {
      if (state.mode === 'prediction') {
        checkPredictionModeOnStep();
      } else {
        playback.togglePlay();
      }
    };
  }
  if ($('#prev-btn')) {
    $('#prev-btn').onclick = () => {
      if ($('#prediction-card-wrap')) $('#prediction-card-wrap').style.display = 'none';
      state.isWaitingPrediction = false;
      playback.stepPrev();
    };
  }
  if ($('#next-btn')) {
    $('#next-btn').onclick = () => {
      if (state.mode === 'prediction') {
        checkPredictionModeOnStep();
      } else {
        playback.stepNext();
      }
    };
  }
  if ($('#scrub')) $('#scrub').oninput = e => {
    if ($('#prediction-card-wrap')) $('#prediction-card-wrap').style.display = 'none';
    state.isWaitingPrediction = false;
    playback.jumpTo(Number(e.target.value));
  };
  if ($('#speed-slider')) $('#speed-slider').oninput = e => playback.setSpeed(Number(e.target.value));

  // Custom Array Inputs
  if ($('#use-array-btn')) {
    $('#use-array-btn').onclick = () => {
      const raw = $('#custom-arr-input').value;
      const nums = raw.split(/[ ,]+/).map(Number).filter(x => !isNaN(x) && x > 0 && x <= 99).slice(0, 14);
      if (nums.length >= 2) {
        playback.pause();
        state.baseArray = nums;
        buildStepsForCurrentTopic();
        $('#custom-arr-input').value = '';
      } else {
        alert('Enter between 2 and 14 positive integers (1..99).');
      }
    };
  }

  if ($('#shuffle-arr-btn')) {
    $('#shuffle-arr-btn').onclick = () => {
      playback.pause();
      state.baseArray = Array.from({ length: 9 }, () => Math.ceil(Math.random() * 45) + 3);
      buildStepsForCurrentTopic();
    };
  }

  // Compare Algorithms Modal
  if ($('#compare-all-btn')) $('#compare-all-btn').onclick = openCompareModal;
  if ($('#modal-close-btn')) $('#modal-close-btn').onclick = () => $('#compare-modal').style.display = 'none';

  // FS Specific Listeners
  $$('.fs-view-btn').forEach(btn => {
    btn.onclick = () => {
      state.fsViewMode = btn.dataset.view;
      $$('.fs-view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFsDiagram();
    };
  });

  // Keyboard Navigation
  window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (state.mode === 'prediction') {
        checkPredictionModeOnStep();
      } else {
        playback.stepNext();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if ($('#prediction-card-wrap')) $('#prediction-card-wrap').style.display = 'none';
      state.isWaitingPrediction = false;
      playback.stepPrev();
    } else if (e.key === ' ') {
      e.preventDefault();
      if (state.mode === 'prediction') {
        checkPredictionModeOnStep();
      } else {
        playback.togglePlay();
      }
    }
  });

  window.addEventListener('resize', () => {
    if (state.activeUnit === 'unit1') renderVisualStage();
  });
}

/* ---------------- FILE SYSTEM RENDERING ---------------- */
function renderFsSidebar() {
  const container = $('#fs-sidebar-nodes');
  if (!container) return;
  container.innerHTML = '';
  const currentStep = playback.getCurrentStep();
  const highlighted = currentStep?.highlighted || [];
  const done = currentStep?.done || [];

  function walk(node, depth = 0) {
    const isFolder = node.type === 'folder';
    const isSelected = state.fsSelectedNodeId === node.id;
    const isHi = highlighted.includes(node.id);
    const isDone = done.includes(node.id);

    const row = document.createElement('div');
    row.className = `sidebar-node ${isSelected ? 'selected' : ''} ${isHi ? 'highlighted' : ''} ${isDone ? 'done' : ''}`;
    row.style.paddingLeft = `${6 + depth * 14}px`;

    row.innerHTML = `
      <span class="sidebar-icon">${isFolder ? '📁' : '📄'}</span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${node.name}</span>
      <span style="font-size:10.5px;color:var(--mute)">${node.size > 0 ? `${node.size}K` : ''}</span>
    `;

    row.onclick = () => {
      state.fsSelectedNodeId = node.id;
      renderFsSidebar();
      renderFsDiagram();
    };

    container.appendChild(row);

    if (isFolder && node.children) {
      node.children.forEach(child => walk(child, depth + 1));
    }
  }

  const activeTree = currentStep?.meta?.tree || state.fsTree;
  walk(activeTree, 0);
}

function renderFsDiagram() {
  const svg = $('#fs-tree-svg');
  if (!svg) return;
  svg.innerHTML = '';

  const currentStep = playback.getCurrentStep();
  const activeTree = currentStep?.meta?.tree || state.fsTree;
  const highlighted = currentStep?.highlighted || [];
  const activePath = currentStep?.meta?.activePath || [];
  const done = currentStep?.done || [];
  const folderSizes = currentStep?.meta?.folderSizes || {};

  const { nodes, edges, width, height } = computeTreeLayout(activeTree, state.fsViewMode);
  svg.setAttribute('viewBox', `0 0 ${Math.max(width, 700)} ${Math.max(height, 360)}`);

  edges.forEach(e => {
    const isEdgeActive = activePath.includes(e.fromId) && activePath.includes(e.toId);
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const midY = (e.fromY + e.toY) / 2;
    pathEl.setAttribute('d', `M ${e.fromX} ${e.fromY} C ${e.fromX} ${midY}, ${e.toX} ${midY}, ${e.toX} ${e.toY}`);
    pathEl.setAttribute('class', `tree-edge ${isEdgeActive ? 'active' : ''}`);
    svg.appendChild(pathEl);
  });

  nodes.forEach(ln => {
    const isHi = highlighted.includes(ln.node.id);
    const isDone = done.includes(ln.node.id);
    const isSelected = state.fsSelectedNodeId === ln.node.id;

    let nodeClass = 'tree-node-group' + (isHi ? ' cmp' : isDone ? ' done' : '');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', nodeClass);
    g.setAttribute('transform', `translate(${ln.x - ln.width / 2}, ${ln.y})`);
    g.onclick = () => {
      state.fsSelectedNodeId = ln.node.id;
      renderFsSidebar();
      renderFsDiagram();
    };

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'tree-node-rect');
    rect.setAttribute('width', ln.width);
    rect.setAttribute('height', ln.height);
    rect.setAttribute('rx', '10');
    if (isSelected) {
      rect.setAttribute('stroke', 'var(--acc)');
      rect.setAttribute('stroke-width', '3');
    }
    g.appendChild(rect);

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('x', '12'); icon.setAttribute('y', '24'); icon.setAttribute('font-size', '14');
    icon.textContent = ln.node.type === 'folder' ? '📁' : '📄';
    g.appendChild(icon);

    const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    nameText.setAttribute('x', '32'); nameText.setAttribute('y', '22'); nameText.setAttribute('class', 'tree-node-text');
    nameText.textContent = ln.node.name.length > 10 ? ln.node.name.slice(0, 9) + '…' : ln.node.name;
    g.appendChild(nameText);

    const sizeVal = folderSizes[ln.node.id] !== undefined ? folderSizes[ln.node.id] : ln.node.size;
    const sizeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    sizeText.setAttribute('x', '32'); sizeText.setAttribute('y', '33'); sizeText.setAttribute('class', 'tree-node-size');
    sizeText.textContent = sizeVal > 0 ? `${sizeVal} KB` : ln.node.type === 'folder' ? 'dir' : '0 KB';
    g.appendChild(sizeText);

    svg.appendChild(g);
  });
}

function computeTreeLayout(root, viewMode) {
  const nodes = [];
  const edges = [];
  const nodeWidth = 104, nodeHeight = 40, levelHeight = 65;

  let leafX = 35;
  function layoutSubtree(node, depth) {
    if (!node.children || node.children.length === 0) {
      const x = leafX + nodeWidth / 2;
      leafX += nodeWidth + 14;
      const y = 30 + depth * levelHeight;
      nodes.push({ node, x, y, width: nodeWidth, height: nodeHeight, depth });
      return x;
    }

    const childXs = node.children.map(child => layoutSubtree(child, depth + 1));
    const myX = (childXs[0] + childXs[childXs.length - 1]) / 2;
    const myY = 30 + depth * levelHeight;
    nodes.push({ node, x: myX, y: myY, width: nodeWidth, height: nodeHeight, depth });

    node.children.forEach((c, i) => {
      edges.push({
        fromX: myX,
        fromY: myY + nodeHeight,
        toX: childXs[i],
        toY: 30 + (depth + 1) * levelHeight,
        fromId: node.id,
        toId: c.id
      });
    });

    return myX;
  }
  layoutSubtree(root, 0);

  const maxX = Math.max(...nodes.map(n => n.x + n.width / 2), 650);
  const maxY = Math.max(...nodes.map(n => n.y + n.height), 340);
  return { nodes, edges, width: maxX + 30, height: maxY + 30 };
}

function updateFsStats() {
  const currentStep = playback.getCurrentStep();
  const tree = currentStep?.meta?.tree || state.fsTree;
  const stats = calculateTreeStats(tree);

  if ($('#fs-stat-files')) $('#fs-stat-files').textContent = stats.totalFiles;
  if ($('#fs-stat-folders')) $('#fs-stat-folders').textContent = stats.totalFolders;
  if ($('#fs-stat-depth')) $('#fs-stat-depth').textContent = stats.maxDepth;
  if ($('#fs-stat-branch')) $('#fs-stat-branch').textContent = stats.maxBranching;
}

/* ---------------- COMPARE ALL ALGORITHMS ---------------- */
function openCompareModal() {
  const modal = $('#compare-modal');
  const chartBox = $('#compare-chart-box');
  if (!modal || !chartBox) return;
  chartBox.innerHTML = '';

  const algos = ['bubble', 'selection', 'insertion', 'merge', 'quick'];
  const results = algos.map(key => {
    const algo = DSA_ALGORITHMS[key];
    let seq = 0;
    const A = state.baseArray.map(v => ({ id: `it_${seq++}`, v }));
    const done = new Set();
    let comparisons = 0, swaps = 0;
    const S = (text, line, indices, kind) => {
      if (kind === 'cmp') comparisons++;
      if (kind === 'swap') swaps++;
      return { order: [], highlighted: [], kind, done: [], text, line };
    };
    const gen = algo.generate(A, S, done);
    for (const _ of gen) {}
    return { name: algo.name, comparisons, swaps };
  });

  const maxCmp = Math.max(...results.map(r => r.comparisons), 1);
  const maxSwap = Math.max(...results.map(r => r.swaps), 1);

  results.forEach(res => {
    const row = document.createElement('div');
    row.className = 'compare-chart-row';
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">
        <span>${res.name}</span>
        <span style="color:var(--mute)">${res.comparisons} compares • ${res.swaps} swaps</span>
      </div>
      <div class="compare-bar-track">
        <div class="compare-bar-fill" style="width:${Math.max((res.comparisons / maxCmp) * 100, 6)}%;background:var(--cmp)">${res.comparisons}</div>
      </div>
      <div class="compare-bar-track" style="margin-top:3px">
        <div class="compare-bar-fill" style="width:${Math.max((res.swaps / maxSwap) * 100, 6)}%;background:var(--swap)">${res.swaps}</div>
      </div>
    `;
    chartBox.appendChild(row);
  });

  modal.style.display = 'flex';
}

/* ---------------- AI TUTOR ("LENS") ---------------- */
function initTutor() {
  const chipsContainer = $('#tutor-chips');
  if (!chipsContainer) return;
  const chips = ['Why this step?', 'What happens next?', 'Explain memory & pointers', 'Give me an analogy'];
  chipsContainer.innerHTML = '';
  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = chip;
    btn.onclick = () => askTutor(chip);
    chipsContainer.appendChild(btn);
  });

  if ($('#tutor-form')) {
    $('#tutor-form').onsubmit = e => {
      e.preventDefault();
      const val = $('#tutor-input').value.trim();
      if (val) {
        askTutor(val);
        $('#tutor-input').value = '';
      }
    };
  }
}

function addTutorMessage(role, text) {
  const msgs = $('#tutor-msgs');
  if (!msgs) return null;
  const div = document.createElement('div');
  div.className = `m ${role === 'user' ? 'u' : 'a'}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

async function askTutor(question) {
  playback.pause();
  addTutorMessage('user', question);
  const pendingEl = addTutorMessage('assistant', `Lens is inspecting step ${playback.index}…`);

  const currentStep = playback.getCurrentStep();
  const unitDef = SYLLABUS_UNITS[state.activeUnit];
  const topic = unitDef.topics[state.activeSubtopic];

  const context = `Context Information:
Unit: ${unitDef.name}
Topic: ${topic.name} (${topic.source.time || topic.source.timeComplexity || 'O(N)'})
Step Index: ${playback.index} of ${state.steps.length - 1}
Current Step Text: ${currentStep?.text || 'Reviewing current step'}
Pseudocode:
${(topic.source.pseudocode || []).join('\n')}`;

  try {
    const resp = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: question,
        context,
        history: state.tutorHistory.slice(-6)
      })
    });
    if (!resp.ok) throw new Error('API unavailable');
    const data = await resp.json();
    if (pendingEl) pendingEl.textContent = data.text || 'Step reviewed.';
    state.tutorHistory.push({ role: 'user', content: question }, { role: 'assistant', content: data.text });
  } catch (err) {
    if (pendingEl) {
      pendingEl.textContent = `Current step explanation: ${currentStep?.text || 'Inspecting step'}\nIn ${topic.name}, this operation updates pointers or preserves algorithm invariants. Try stepping with ◀ ▶| to trace the causes!`;
    }
  }
}

window.addEventListener('DOMContentLoaded', init);
