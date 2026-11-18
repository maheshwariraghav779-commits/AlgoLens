import { describe, it, expect } from 'vitest';
import { createInitialFSTree, calculateTreeStats } from '../src/modules/filesystem/initialTree';
import { FS_OPERATIONS } from '../src/modules/filesystem/generators/treeGenerators';
import { Step } from '../src/engine/types';

describe('File System Tree Generators & Operations', () => {
  it('Initial tree contains valid hierarchy and calculated statistics', () => {
    const tree = createInitialFSTree();
    const stats = calculateTreeStats(tree);

    expect(tree.id).toBe('root');
    expect(stats.totalFolders).toBeGreaterThan(3);
    expect(stats.totalFiles).toBeGreaterThan(4);
    expect(stats.maxDepth).toBeGreaterThanOrEqual(4);
  });

  it('DFS Pre-order traversal visits root first and marks nodes completed', () => {
    const tree = createInitialFSTree();
    const done = new Set<string>();
    const steps: Step[] = [];

    const S = (text: string, line: number, highlighted: string[], kind: any, meta?: any): Step => ({
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

    expect(steps.length).toBeGreaterThan(10);
    // Root was visited and completed
    expect(done.has('root')).toBe(true);
    expect(done.has('home')).toBe(true);
    expect(done.has('resume')).toBe(true);
  });

  it('BFS traversal visits nodes level by level', () => {
    const tree = createInitialFSTree();
    const done = new Set<string>();
    const visitedOrder: string[] = [];

    const S = (text: string, line: number, highlighted: string[], kind: any, meta?: any): Step => {
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

    // Root visited first in BFS
    expect(visitedOrder[0]).toBe('root');
    // Direct children of root (home, etc, var, usr) should come before leaf files like resume
    expect(visitedOrder.indexOf('home')).toBeLessThan(visitedOrder.indexOf('resume'));
    expect(visitedOrder.indexOf('etc')).toBeLessThan(visitedOrder.indexOf('resume'));
  });

  it('Folder size computation post-order calculates exact aggregated sums', () => {
    const tree = createInitialFSTree();
    const done = new Set<string>();
    let finalRootSize = 0;

    const S = (text: string, line: number, highlighted: string[], kind: any, meta?: any): Step => {
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
    expect(finalRootSize).toBe(4786);
  });
});
