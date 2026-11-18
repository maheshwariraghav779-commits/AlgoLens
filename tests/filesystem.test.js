import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialFSTree,
  calculateTreeStats,
  FS_OPERATIONS,
  findNodeById
} from '../src/modules/filesystem/treeGenerators.js';

test('Initial tree contains valid hierarchy and calculated statistics', () => {
  const tree = createInitialFSTree();
  const stats = calculateTreeStats(tree);

  assert.equal(tree.id, 'root');
  assert.ok(stats.totalFolders >= 4);
  assert.ok(stats.totalFiles >= 5);
  assert.ok(stats.maxDepth >= 4);
});

test('DFS Pre-order traversal visits root first and marks nodes completed', () => {
  const tree = createInitialFSTree();
  const done = new Set();
  const steps = [];

  const S = (text, line, highlighted, kind, meta) => ({
    order: [],
    highlighted,
    kind,
    done: Array.from(done),
    text,
    line,
    meta
  });

  const gen = FS_OPERATIONS['dfs-pre'].generate(tree, S, done);
  for (const step of gen) {
    steps.push(step);
  }

  assert.ok(steps.length > 10);
  assert.ok(done.has('root'));
  assert.ok(done.has('home'));
  assert.ok(done.has('resume'));
});

test('BFS traversal visits nodes level by level', () => {
  const tree = createInitialFSTree();
  const done = new Set();
  const visitedOrder = [];

  const S = (text, line, highlighted, kind, meta) => {
    if (kind === 'visit' && meta?.activeNodeId) {
      visitedOrder.push(meta.activeNodeId);
    }
    return {
      order: [],
      highlighted,
      kind,
      done: Array.from(done),
      text,
      line,
      meta
    };
  };

  const gen = FS_OPERATIONS['bfs'].generate(tree, S, done);
  for (const _ of gen) {
    // iterate
  }

  assert.equal(visitedOrder[0], 'root');
  assert.ok(visitedOrder.indexOf('home') < visitedOrder.indexOf('resume'));
  assert.ok(visitedOrder.indexOf('etc') < visitedOrder.indexOf('resume'));
});

test('Folder size computation post-order calculates exact aggregated sums', () => {
  const tree = createInitialFSTree();
  const done = new Set();
  let finalRootSize = 0;

  const S = (text, line, highlighted, kind, meta) => {
    if (meta?.folderSizes?.root !== undefined) {
      finalRootSize = meta.folderSizes.root;
    }
    return {
      order: [],
      highlighted,
      kind,
      done: Array.from(done),
      text,
      line,
      meta
    };
  };

  const gen = FS_OPERATIONS['compute-size'].generate(tree, S, done);
  for (const _ of gen) {
    // iterate
  }

  // Leaf files: resume(120), notes(15), algolens(85), readme(8), bashrc(4), nginx(12), hosts(2), syslog(450), authlog(90), node(1800), git(2200)
  // Sum = 120 + 15 + 85 + 8 + 4 + 12 + 2 + 450 + 90 + 1800 + 2200 = 4786 KB
  assert.equal(finalRootSize, 4786);
});
