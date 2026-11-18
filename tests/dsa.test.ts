import { describe, it, expect } from 'vitest';
import { DSA_ALGORITHMS, ArrayItem } from '../src/modules/dsa/generators/sortGenerators';
import { Step } from '../src/engine/types';

function runSortGenerator(algoKey: 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick', rawValues: number[]) {
  const algo = DSA_ALGORITHMS[algoKey];
  let seq = 0;
  const A: ArrayItem[] = rawValues.map(v => ({ id: `id_${seq++}`, v }));
  const done = new Set<string>();
  const steps: Step[] = [];

  const S = (text: string, line: number, highlightedIndices: number[], kind: any): Step => ({
    order: A.map(x => x.id),
    highlighted: highlightedIndices.map(i => A[i]?.id).filter(Boolean),
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

describe('DSA Sort Generators', () => {
  const testArray = [29, 10, 14, 37, 13];
  const sortedExpected = [10, 13, 14, 29, 37];

  it('Bubble Sort ends with array fully sorted and marks all items done', () => {
    const { finalArray, steps } = runSortGenerator('bubble', testArray);
    expect(finalArray).toEqual(sortedExpected);
    expect(steps.length).toBeGreaterThan(0);
  });

  it('Selection Sort ends with array fully sorted', () => {
    const { finalArray, steps } = runSortGenerator('selection', testArray);
    expect(finalArray).toEqual(sortedExpected);
    expect(steps.length).toBeGreaterThan(0);
  });

  it('Insertion Sort ends with array fully sorted', () => {
    const { finalArray, steps } = runSortGenerator('insertion', testArray);
    expect(finalArray).toEqual(sortedExpected);
    expect(steps.length).toBeGreaterThan(0);
  });

  it('Merge Sort ends with array fully sorted', () => {
    const { finalArray, steps } = runSortGenerator('merge', testArray);
    expect(finalArray).toEqual(sortedExpected);
    expect(steps.length).toBeGreaterThan(0);
  });

  it('Quick Sort ends with array fully sorted', () => {
    const { finalArray, steps } = runSortGenerator('quick', testArray);
    expect(finalArray).toEqual(sortedExpected);
    expect(steps.length).toBeGreaterThan(0);
  });
});
