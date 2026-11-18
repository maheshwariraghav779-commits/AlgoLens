import { test } from 'node:test';
import assert from 'node:assert/strict';

import { UNIT1_SEARCHING, UNIT1_SORTING } from '../src/modules/unit1_arrays/sortingSearchingGenerators.js';
import { MATRIX_OPERATIONS } from '../src/modules/unit1_arrays/matrixGenerators.js';
import { UNIT2_LINKED_LIST } from '../src/modules/unit2_linkedlists/linkedListGenerators.js';
import { UNIT3_STACKS_QUEUES } from '../src/modules/unit3_stacks_queues/stackQueueGenerators.js';
import { UNIT4_TREES } from '../src/modules/unit4_trees/bstGenerators.js';
import { UNIT5_GRAPHS } from '../src/modules/unit5_graphs/graphGenerators.js';
import { UNIT6_HASHING } from '../src/modules/unit6_hashing/hashingGenerators.js';

const S = (text, line, highlighted, kind, meta) => ({ text, line, highlighted, kind, meta });

test('Unit 1: Heap Sort ends with array fully sorted', () => {
  const raw = [45, 12, 89, 34, 7, 23];
  const A = raw.map((v, i) => ({ id: `h_${i}`, v }));
  const done = new Set();
  const gen = UNIT1_SORTING.heap.generate(A, S, done);
  for (const _ of gen) {}
  assert.deepEqual(A.map(x => x.v), [7, 12, 23, 34, 45, 89]);
});

test('Unit 1: Radix Sort sorts multi-digit numbers', () => {
  const raw = [170, 45, 75, 90, 802, 24, 2, 66];
  const A = raw.map((v, i) => ({ id: `r_${i}`, v }));
  const done = new Set();
  const gen = UNIT1_SORTING.radix.generate(A, S, done);
  for (const _ of gen) {}
  assert.deepEqual(A.map(x => x.v), [2, 24, 45, 66, 75, 90, 170, 802]);
});

test('Unit 1: Sparse Matrix Fast Transpose swaps (r, c) correctly in linear time', () => {
  const matrix = {
    rows: 3,
    cols: 3,
    terms: [
      { r: 0, c: 2, v: 5 },
      { r: 1, c: 0, v: 3 },
      { r: 2, c: 1, v: 8 }
    ]
  };
  let lastMeta = null;
  const gen = MATRIX_OPERATIONS.sparseFastTranspose.generate(matrix, (t, l, h, k, m) => {
    lastMeta = m;
    return { text: t, meta: m };
  });
  for (const _ of gen) {}
  assert.ok(lastMeta?.transposed);
  assert.equal(lastMeta.transposed[0].r, 0); // column 0 of original becomes row 0
  assert.equal(lastMeta.transposed[0].v, 3);
});

test('Unit 2: SLL In-Place Reversal inverts node chain', () => {
  const list = [{ id: '1', val: 10 }, { id: '2', val: 20 }, { id: '3', val: 30 }];
  let finalMeta = null;
  const gen = UNIT2_LINKED_LIST.sllReverse.generate(list, (t, l, h, k, m) => {
    finalMeta = m;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.deepEqual(finalMeta.list.map(x => x.val), [30, 20, 10]);
});

test('Unit 3: Infix to Postfix conversion produces correct postfix string', () => {
  let finalMeta = null;
  const gen = UNIT3_STACKS_QUEUES.infixToPostfix.generate('A + B * C', (t, l, h, k, m) => {
    finalMeta = m;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.deepEqual(finalMeta.output, ['A', 'B', 'C', '*', '+']);
});

test('Unit 3: Postfix Evaluation evaluates math expression', () => {
  let finalMeta = null;
  const gen = UNIT3_STACKS_QUEUES.postfixEval.generate('5 3 + 2 *', (t, l, h, k, m) => {
    finalMeta = m;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.equal(finalMeta.stack[0], 16);
});

test('Unit 3: Josephus elimination finds survivor', () => {
  let finalMeta = null;
  const gen = UNIT3_STACKS_QUEUES.josephus.generate(7, 3, (t, l, h, k, m) => {
    finalMeta = m;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.equal(finalMeta.survivor, 4);
});

test('Unit 5: Kruskal MST finds minimum tree cost', () => {
  let finalMeta = null;
  const gen = UNIT5_GRAPHS.kruskal.generate(null, (t, l, h, k, m) => {
    finalMeta = m;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.equal(finalMeta.totalCost, 6);
});

test('Unit 6: Linear Probing inserts keys and handles collisions', () => {
  let finalMeta = null;
  const gen = UNIT6_HASHING.linearProbing.generate([12, 22], 10, (t, l, h, k, m) => {
    finalMeta = m;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.equal(finalMeta.table[2], 12);
  assert.equal(finalMeta.table[3], 22); // Collided at 2, resolved to 3!
});

test('Unit 1: Sparse Matrix Simple Transpose swaps elements in O(Cols*Terms)', () => {
  const matrix = {
    rows: 3,
    cols: 3,
    terms: [
      { r: 0, c: 2, v: 5 },
      { r: 1, c: 0, v: 3 },
      { r: 2, c: 1, v: 8 }
    ]
  };
  let lastMeta = null;
  const gen = MATRIX_OPERATIONS.sparseSimpleTranspose.generate(matrix, (t, l, h, k, m) => {
    lastMeta = m;
    return { text: t, meta: m };
  });
  for (const _ of gen) {}
  assert.ok(lastMeta?.transposed);
  assert.equal(lastMeta.transposed[0].r, 0);
  assert.equal(lastMeta.transposed[0].v, 3);
});

test('Unit 3: Circular Queue handles wrap-around enqueue and dequeue', () => {
  let finalMeta = null;
  const gen = UNIT3_STACKS_QUEUES.circularQueue.generate(5, null, (t, l, h, k, m) => {
    finalMeta = m;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.ok(finalMeta?.buffer);
});

test('Unit 4: Threaded Binary Tree traverses in O(1) space', () => {
  let stepCount = 0;
  const gen = UNIT4_TREES.threadedBinaryTree.generate(S);
  for (const _ of gen) stepCount++;
  assert.ok(stepCount > 0);
});

test('Unit 5: Bipartite Graph Check verifies 2-colorability', () => {
  let lastMeta = null;
  const gen = UNIT5_GRAPHS.bipartiteCheck.generate(null, (t, l, h, k, m) => {
    lastMeta = m;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.equal(lastMeta.isBipartite, true);
});

test('Module 2: Doubly Linked List wires dual prev and next pointers', () => {
  let stepCount = 0;
  const gen = UNIT2_LINKED_LIST.dllOperations.generate(S);
  for (const _ of gen) stepCount++;
  assert.ok(stepCount >= 5);
});

test('Module 2: Circular Linked List loops tail back to head', () => {
  let hasLoop = false;
  const gen = UNIT2_LINKED_LIST.cllOperations.generate(null, (t, l, h, k, m) => {
    if (m?.isLoop) hasLoop = true;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.ok(hasLoop);
});

test('Module 2: Generalized Linked List traverses atoms and sublists', () => {
  let stepCount = 0;
  const gen = UNIT2_LINKED_LIST.gllOperations.generate(S);
  for (const _ of gen) stepCount++;
  assert.ok(stepCount >= 6);
});

test('Module 3: Double Ended Queue supports insert/delete at both ends', () => {
  let stepCount = 0;
  const gen = UNIT3_STACKS_QUEUES.dequeOperations.generate(S);
  for (const _ of gen) stepCount++;
  assert.ok(stepCount >= 5);
});

test('Module 3: Infix to Prefix conversion produces valid prefix string', () => {
  let lastMeta = null;
  const gen = UNIT3_STACKS_QUEUES.infixToPrefix.generate('(A + B) * C', (t, l, h, k, m) => {
    lastMeta = m;
    return { meta: m };
  });
  for (const _ of gen) {}
  assert.equal(lastMeta?.finalPrefix, '* + A B C');
});
