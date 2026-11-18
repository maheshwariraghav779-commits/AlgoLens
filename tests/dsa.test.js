import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DSA_ALGORITHMS } from '../src/modules/dsa/sortGenerators.js';

function runSort(algoKey, rawValues) {
  const algo = DSA_ALGORITHMS[algoKey];
  let seq = 0;
  const A = rawValues.map(v => ({ id: `id_${seq++}`, v }));
  const done = new Set();
  const steps = [];

  const S = (text, line, indices, kind) => ({
    order: A.map(x => x.id),
    highlighted: indices.map(i => A[i]?.id).filter(Boolean),
    kind,
    done: Array.from(done),
    text,
    line
  });

  const gen = algo.generate(A, S, done);
  for (const s of gen) {
    steps.push(s);
  }

  return {
    finalArray: A.map(x => x.v),
    steps,
    doneCount: done.size
  };
}

test('Bubble Sort ends with array fully sorted and marks all items done', () => {
  const input = [34, 12, 27, 8, 41, 19, 5, 30, 16];
  const sorted = [...input].sort((a, b) => a - b);
  const res = runSort('bubble', input);
  assert.deepEqual(res.finalArray, sorted);
  assert.ok(res.steps.length > 0);
  assert.equal(res.doneCount, input.length);
});

test('Selection Sort ends with array fully sorted', () => {
  const input = [45, 12, 89, 34, 7, 23];
  const sorted = [...input].sort((a, b) => a - b);
  const res = runSort('selection', input);
  assert.deepEqual(res.finalArray, sorted);
  assert.ok(res.steps.length > 0);
});

test('Insertion Sort ends with array fully sorted', () => {
  const input = [99, 14, 55, 2, 87, 36, 1];
  const sorted = [...input].sort((a, b) => a - b);
  const res = runSort('insertion', input);
  assert.deepEqual(res.finalArray, sorted);
  assert.ok(res.steps.length > 0);
});

test('Merge Sort ends with array fully sorted', () => {
  const input = [50, 20, 80, 10, 30, 70, 40, 60];
  const sorted = [...input].sort((a, b) => a - b);
  const res = runSort('merge', input);
  assert.deepEqual(res.finalArray, sorted);
  assert.ok(res.steps.length > 0);
});

test('Quick Sort ends with array fully sorted', () => {
  const input = [28, 77, 12, 5, 93, 44, 31, 62];
  const sorted = [...input].sort((a, b) => a - b);
  const res = runSort('quick', input);
  assert.deepEqual(res.finalArray, sorted);
  assert.ok(res.steps.length > 0);
});
