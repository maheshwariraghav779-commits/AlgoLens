import { Step, StepKind } from '../../../engine/types';

export interface ArrayItem {
  id: string;
  v: number;
}

export type EmitStepFn = (
  text: string,
  line: number,
  highlightedIndices: number[],
  kind: StepKind,
  meta?: any
) => Step;

export const DSA_ALGORITHMS = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    timeComplexity: 'Time O(n²)',
    spaceComplexity: 'Space O(1)',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    pseudocode: [
      'for i from 0 to n - 1:',
      '  for j from 0 to n - i - 2:',
      '    if A[j] > A[j+1]:',
      '      swap(A[j], A[j+1])',
      '  A[n - 1 - i] is sorted'
    ],
    *generate(arr: ArrayItem[], S: EmitStepFn, done: Set<string>): Generator<Step, void, unknown> {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
          yield S(`Compare ${arr[j].v} with adjacent ${arr[j + 1].v}.`, 2, [j, j + 1], 'compare');
          if (arr[j].v > arr[j + 1].v) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            yield S(`${arr[j + 1].v} is greater than ${arr[j].v}, swapping them so larger values bubble right.`, 3, [j, j + 1], 'swap');
          }
        }
        done.add(arr[n - 1 - i].id);
        yield S(`${arr[n - 1 - i].v} has bubbled to the end and is now locked in place.`, 4, [n - 1 - i], 'none');
      }
      done.add(arr[0].id);
    }
  },

  selection: {
    id: 'selection',
    name: 'Selection Sort',
    timeComplexity: 'Time O(n²)',
    spaceComplexity: 'Space O(1)',
    bestCase: 'O(n²)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    description: 'Divides the list into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted region and placing it at the front.',
    pseudocode: [
      'for i from 0 to n - 1:',
      '  minIdx = i',
      '  for j from i + 1 to n - 1:',
      '    if A[j] < A[minIdx]: minIdx = j',
      '  swap(A[i], A[minIdx])'
    ],
    *generate(arr: ArrayItem[], S: EmitStepFn, done: Set<string>): Generator<Step, void, unknown> {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        yield S(`Assume ${arr[i].v} at index ${i} is the minimum for this pass.`, 1, [i], 'compare');
        for (let j = i + 1; j < n; j++) {
          yield S(`Scan: is ${arr[j].v} smaller than current minimum ${arr[minIdx].v}?`, 3, [j, minIdx], 'compare');
          if (arr[j].v < arr[minIdx].v) {
            minIdx = j;
            yield S(`New minimum found: ${arr[minIdx].v} at index ${minIdx}.`, 3, [minIdx], 'compare');
          }
        }
        if (minIdx !== i) {
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          yield S(`Swap minimum ${arr[i].v} into position ${i}.`, 4, [i, minIdx], 'swap');
        }
        done.add(arr[i].id);
        yield S(`${arr[i].v} is in its sorted position.`, 4, [i], 'none');
      }
      done.add(arr[n - 1].id);
    }
  },

  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    timeComplexity: 'Time O(n²)',
    spaceComplexity: 'Space O(1)',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    description: 'Builds the final sorted array one item at a time by repeatedly picking the next element and shifting larger elements to the right to make room.',
    pseudocode: [
      'for i from 1 to n - 1:',
      '  key = A[i]',
      '  j = i - 1',
      '  while j >= 0 and A[j] > key:',
      '    A[j + 1] = A[j]; j--',
      '  A[j + 1] = key'
    ],
    *generate(arr: ArrayItem[], S: EmitStepFn, done: Set<string>): Generator<Step, void, unknown> {
      const n = arr.length;
      done.add(arr[0].id);
      for (let i = 1; i < n; i++) {
        const keyItem = arr[i];
        let j = i;
        yield S(`Select key ${keyItem.v} to insert into the sorted prefix [0..${i - 1}].`, 1, [i], 'compare');

        while (j > 0) {
          yield S(`Compare sorted item ${arr[j - 1].v} with ${arr[j].v}.`, 3, [j - 1, j], 'compare');
          if (arr[j - 1].v > arr[j].v) {
            const temp = arr[j];
            arr[j] = arr[j - 1];
            arr[j - 1] = temp;
            yield S(`${arr[j].v} is larger than ${arr[j - 1].v}, shifting it rightward.`, 4, [j - 1, j], 'swap');
            j--;
          } else {
            break;
          }
        }
        for (let k = 0; k <= i; k++) {
          done.add(arr[k].id);
        }
        yield S(`Key ${keyItem.v} inserted. The first ${i + 1} elements are now sorted.`, 5, [j], 'none');
      }
    }
  },

  merge: {
    id: 'merge',
    name: 'Merge Sort',
    timeComplexity: 'Time O(n log n)',
    spaceComplexity: 'Space O(n)',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    description: 'Divide-and-conquer algorithm that recursively divides the array into halves until singletons, then merges sorted halves.',
    pseudocode: [
      'function mergeSort(arr, left, right):',
      '  if left >= right: return',
      '  mid = floor((left + right) / 2)',
      '  mergeSort(arr, left, mid)',
      '  mergeSort(arr, mid + 1, right)',
      '  merge(arr, left, mid, right)'
    ],
    *generate(arr: ArrayItem[], S: EmitStepFn, done: Set<string>): Generator<Step, void, unknown> {
      function* mergeSortHelper(start: number, end: number): Generator<Step, void, unknown> {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        yield S(`Divide subarray [${start}..${end}] at mid index ${mid}.`, 2, [start, end], 'compare');
        
        yield* mergeSortHelper(start, mid);
        yield* mergeSortHelper(mid + 1, end);

        yield S(`Merge sorted subarrays [${start}..${mid}] and [${mid + 1}..${end}].`, 5, [start, end], 'compare');

        // In-place merge simulation with animations
        let i = start;
        let j = mid + 1;

        while (i <= mid && j <= end) {
          yield S(`Compare left element ${arr[i].v} with right element ${arr[j].v}.`, 5, [i, j], 'compare');
          if (arr[i].v <= arr[j].v) {
            i++;
          } else {
            const temp = arr[j];
            let k = j;
            while (k > i) {
              arr[k] = arr[k - 1];
              k--;
            }
            arr[i] = temp;
            yield S(`Right element ${temp.v} is smaller; shifted ahead into position ${i}.`, 5, [i, j], 'swap');
            i++;
            // mid shifted right by 1
            // end stays the same
          }
        }

        if (start === 0 && end === arr.length - 1) {
          arr.forEach(x => done.add(x.id));
        }
      }

      yield* mergeSortHelper(0, arr.length - 1);
      arr.forEach(x => done.add(x.id));
    }
  },

  quick: {
    id: 'quick',
    name: 'Quick Sort',
    timeComplexity: 'Time O(n log n)',
    spaceComplexity: 'Space O(log n)',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)',
    description: 'Selects a "pivot" element and partitions the array such that smaller elements move before the pivot and larger elements move after it.',
    pseudocode: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    pi = partition(arr, low, high)',
      '    quickSort(arr, low, pi - 1)',
      '    quickSort(arr, pi + 1, high)',
      'partition: pivot = A[high], swap smaller to front'
    ],
    *generate(arr: ArrayItem[], S: EmitStepFn, done: Set<string>): Generator<Step, void, unknown> {
      function* quickSortHelper(low: number, high: number): Generator<Step, void, unknown> {
        if (low > high) return;
        if (low === high) {
          done.add(arr[low].id);
          yield S(`Single element ${arr[low].v} at index ${low} is already in place.`, 1, [low], 'none');
          return;
        }

        const pivotVal = arr[high].v;
        yield S(`Partition range [${low}..${high}] with pivot ${pivotVal} (index ${high}).`, 5, [high], 'compare');

        let i = low - 1;
        for (let j = low; j < high; j++) {
          yield S(`Check if ${arr[j].v} <= pivot ${pivotVal}.`, 5, [j, high], 'compare');
          if (arr[j].v <= pivotVal) {
            i++;
            if (i !== j) {
              const temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;
              yield S(`Swap ${arr[i].v} with ${arr[j].v} to group smaller elements on left.`, 5, [i, j], 'swap');
            }
          }
        }

        // Swap pivot to i + 1
        const pi = i + 1;
        if (pi !== high) {
          const temp = arr[pi];
          arr[pi] = arr[high];
          arr[high] = temp;
          yield S(`Place pivot ${arr[pi].v} into its correct final sorted position ${pi}.`, 5, [pi, high], 'swap');
        }
        done.add(arr[pi].id);
        yield S(`Pivot ${arr[pi].v} is locked in place.`, 2, [pi], 'none');

        yield* quickSortHelper(low, pi - 1);
        yield* quickSortHelper(pi + 1, high);
      }

      yield* quickSortHelper(0, arr.length - 1);
      arr.forEach(x => done.add(x.id));
    }
  },

  binarySearch: {
    id: 'binarySearch',
    name: 'Binary Search',
    timeComplexity: 'Time O(log n)',
    spaceComplexity: 'Space O(1)',
    bestCase: 'O(1)',
    averageCase: 'O(log n)',
    worstCase: 'O(log n)',
    description: 'Searches a sorted array by repeatedly dividing the search interval in half.',
    pseudocode: [
      'low = 0, high = n - 1',
      'while low <= high:',
      '  mid = floor((low + high) / 2)',
      '  if A[mid] == target: return mid',
      '  else if A[mid] < target: low = mid + 1',
      '  else: high = mid - 1'
    ],
    *generate(arr: ArrayItem[], S: EmitStepFn, done: Set<string>): Generator<Step, void, unknown> {
      // Ensure array is sorted for binary search
      arr.sort((a, b) => a.v - b.v);
      const target = arr[Math.floor(arr.length / 2)].v; // pick a realistic target
      let low = 0;
      let high = arr.length - 1;
      let found = false;

      yield S(`Starting Binary Search for target value: ${target} on sorted array.`, 0, [], 'none');

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        yield S(`Check midpoint index ${mid} (value ${arr[mid].v}) in range [${low}..${high}].`, 2, [mid], 'compare');

        if (arr[mid].v === target) {
          done.add(arr[mid].id);
          yield S(`Target ${target} found at index ${mid}!`, 3, [mid], 'swap');
          found = true;
          break;
        } else if (arr[mid].v < target) {
          yield S(`${arr[mid].v} < ${target}, so search right half [${mid + 1}..${high}].`, 4, [mid], 'none');
          low = mid + 1;
        } else {
          yield S(`${arr[mid].v} > ${target}, so search left half [${low}..${mid - 1}].`, 5, [mid], 'none');
          high = mid - 1;
        }
      }

      if (!found) {
        yield S(`Target ${target} is not in the array.`, 0, [], 'none');
      }
    }
  },

  linearSearch: {
    id: 'linearSearch',
    name: 'Linear Search',
    timeComplexity: 'Time O(n)',
    spaceComplexity: 'Space O(1)',
    bestCase: 'O(1)',
    averageCase: 'O(n)',
    worstCase: 'O(n)',
    description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
    pseudocode: [
      'for i from 0 to n - 1:',
      '  if A[i] == target:',
      '    return i',
      'return -1 (not found)'
    ],
    *generate(arr: ArrayItem[], S: EmitStepFn, done: Set<string>): Generator<Step, void, unknown> {
      const target = arr[Math.floor(arr.length * 0.75)].v;
      yield S(`Linear Search: scanning sequentially for target ${target}.`, 0, [], 'none');

      for (let i = 0; i < arr.length; i++) {
        yield S(`Inspect index ${i}: is ${arr[i].v} == ${target}?`, 1, [i], 'compare');
        if (arr[i].v === target) {
          done.add(arr[i].id);
          yield S(`Found target ${target} at index ${i}!`, 2, [i], 'swap');
          return;
        }
      }
      yield S(`Finished scanning all elements. Target not found.`, 3, [], 'none');
    }
  }
};
