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
      'for i in 0..n-1:',
      '  for j in 0..n-i-2:',
      '    if A[j] > A[j+1]:',
      '      swap(A[j], A[j+1])',
      '  A[n-i-1] is now in place'
    ],
    *generate(A, S, doneSet) {
      const n = A.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
          yield S(`Compare ${A[j].v} with adjacent ${A[j + 1].v}.`, 2, [j, j + 1], 'cmp');
          if (A[j].v > A[j + 1].v) {
            const temp = A[j];
            A[j] = A[j + 1];
            A[j + 1] = temp;
            yield S(`${A[j + 1].v} is bigger than ${A[j].v}, so they swap. Big values bubble rightwards.`, 3, [j, j + 1], 'swap');
          }
        }
        doneSet.add(A[n - 1 - i].id);
        yield S(`${A[n - 1 - i].v} has bubbled to the end of this pass and is locked in place.`, 4, [n - 1 - i], 'none');
      }
      doneSet.add(A[0].id);
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
    description: 'Divides list into sorted and unsorted regions, repeatedly finding minimum from unsorted region.',
    pseudocode: [
      'for i in 0..n-1:',
      '  min = i',
      '  for j in i+1..n-1:',
      '    if A[j] < A[min]: min = j',
      '  swap(A[i], A[min])'
    ],
    *generate(A, S, doneSet) {
      const n = A.length;
      for (let i = 0; i < n - 1; i++) {
        let m = i;
        yield S(`Assume ${A[i].v} (position ${i}) is the smallest so far in this pass.`, 1, [i], 'cmp');
        for (let j = i + 1; j < n; j++) {
          yield S(`Is ${A[j].v} smaller than current minimum ${A[m].v}?`, 3, [j, m], 'cmp');
          if (A[j].v < A[m].v) {
            m = j;
            yield S(`New minimum found: ${A[m].v} at position ${m}.`, 3, [m], 'cmp');
          }
        }
        if (m !== i) {
          const temp = A[i];
          A[i] = A[m];
          A[m] = temp;
          yield S(`Swap minimum ${A[i].v} into position ${i}.`, 4, [i, m], 'swap');
        }
        doneSet.add(A[i].id);
        yield S(`${A[i].v} is locked in place.`, 4, [i], 'none');
      }
      doneSet.add(A[n - 1].id);
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
    description: 'Builds sorted array one element at a time by sliding larger items rightward.',
    pseudocode: [
      'for i in 1..n-1:',
      '  key = A[i]; j = i',
      '  while j > 0 and A[j-1] > A[j]:',
      '    swap(A[j-1], A[j]); j--',
      '  key is sorted in place'
    ],
    *generate(A, S, doneSet) {
      const n = A.length;
      doneSet.add(A[0].id);
      for (let i = 1; i < n; i++) {
        const key = A[i].v;
        let j = i;
        yield S(`Take ${key} and insert it into the sorted prefix on its left.`, 1, [i], 'cmp');

        while (j > 0) {
          yield S(`Compare ${A[j - 1].v} with ${A[j].v}.`, 2, [j - 1, j], 'cmp');
          if (A[j - 1].v > A[j].v) {
            const temp = A[j];
            A[j] = A[j - 1];
            A[j - 1] = temp;
            yield S(`${A[j].v} is larger than ${A[j - 1].v}, shifting it rightward.`, 3, [j - 1, j], 'swap');
            j--;
          } else {
            break;
          }
        }
        for (let t = 0; t <= i; t++) doneSet.add(A[t].id);
        yield S(`${key} sits correctly; the first ${i + 1} items are sorted.`, 4, [j], 'none');
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
    description: 'Divide-and-conquer algorithm that recursively divides subarrays in halves, then merges sorted pieces.',
    pseudocode: [
      'function mergeSort(arr, left, right):',
      '  if left >= right: return',
      '  mid = (left + right) / 2',
      '  mergeSort(arr, left, mid); mergeSort(arr, mid+1, right)',
      '  merge(arr, left, mid, right)'
    ],
    *generate(A, S, doneSet) {
      function* mergeSortHelper(start, end) {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        yield S(`Divide subarray [${start}..${end}] at mid index ${mid}.`, 2, [start, end], 'cmp');

        yield* mergeSortHelper(start, mid);
        yield* mergeSortHelper(mid + 1, end);

        yield S(`Merging sorted ranges [${start}..${mid}] and [${mid + 1}..${end}].`, 4, [start, end], 'cmp');

        let i = start;
        let midIdx = mid;
        let j = mid + 1;
        while (i <= midIdx && j <= end) {
          yield S(`Compare left value ${A[i].v} with right value ${A[j].v}.`, 4, [i, j], 'cmp');
          if (A[i].v <= A[j].v) {
            i++;
          } else {
            const temp = A[j];
            let k = j;
            while (k > i) {
              A[k] = A[k - 1];
              k--;
            }
            A[i] = temp;
            yield S(`Right value ${temp.v} is smaller; shifted forward into index ${i}.`, 4, [i, j], 'swap');
            i++;
            midIdx++;
            j++;
          }
        }

        if (start === 0 && end === A.length - 1) {
          A.forEach(x => doneSet.add(x.id));
        }
      }

      yield* mergeSortHelper(0, A.length - 1);
      A.forEach(x => doneSet.add(x.id));
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
    description: 'Partitions array around a pivot element so smaller elements land left and larger land right.',
    pseudocode: [
      'function quickSort(arr, low, high):',
      '  pivot = A[high]; i = low - 1',
      '  for j in low..high-1: if A[j] <= pivot: swap(A[++i], A[j])',
      '  swap(A[i+1], A[high]) // pivot in place',
      '  quickSort(left); quickSort(right)'
    ],
    *generate(A, S, doneSet) {
      function* quickSortHelper(low, high) {
        if (low > high) return;
        if (low === high) {
          doneSet.add(A[low].id);
          yield S(`Single element ${A[low].v} at index ${low} is already in place.`, 0, [low], 'none');
          return;
        }

        const pivotVal = A[high].v;
        yield S(`Partitioning range [${low}..${high}] around pivot ${pivotVal} (index ${high}).`, 1, [high], 'cmp');

        let i = low - 1;
        for (let j = low; j < high; j++) {
          yield S(`Compare ${A[j].v} with pivot ${pivotVal}.`, 2, [j, high], 'cmp');
          if (A[j].v <= pivotVal) {
            i++;
            if (i !== j) {
              const temp = A[i];
              A[i] = A[j];
              A[j] = temp;
              yield S(`Swap ${A[i].v} with ${A[j].v} to group smaller elements on left.`, 2, [i, j], 'swap');
            }
          }
        }

        const pi = i + 1;
        if (pi !== high) {
          const temp = A[pi];
          A[pi] = A[high];
          A[high] = temp;
          yield S(`Move pivot ${A[pi].v} into its correct final sorted position ${pi}.`, 3, [pi, high], 'swap');
        }
        doneSet.add(A[pi].id);
        yield S(`Pivot ${A[pi].v} is locked in place.`, 3, [pi], 'none');

        yield* quickSortHelper(low, pi - 1);
        yield* quickSortHelper(pi + 1, high);
      }

      yield* quickSortHelper(0, A.length - 1);
      A.forEach(x => doneSet.add(x.id));
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
    description: 'Searches sorted elements by repeatedly halving the search interval.',
    pseudocode: [
      'low = 0, high = n - 1',
      'while low <= high:',
      '  mid = floor((low + high) / 2)',
      '  if A[mid] == target: return mid',
      '  else if A[mid] < target: low = mid + 1',
      '  else: high = mid - 1'
    ],
    *generate(A, S, doneSet) {
      A.sort((a, b) => a.v - b.v);
      const target = A[Math.floor(A.length / 2)].v;
      let low = 0;
      let high = A.length - 1;

      yield S(`Sorted list ready. Searching for target value: ${target}.`, 0, [], 'none');

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        yield S(`Inspect midpoint index ${mid} (${A[mid].v}) in active range [${low}..${high}].`, 2, [mid], 'cmp');

        if (A[mid].v === target) {
          doneSet.add(A[mid].id);
          yield S(`Target ${target} found at position ${mid}!`, 3, [mid], 'swap');
          return;
        } else if (A[mid].v < target) {
          yield S(`${A[mid].v} is less than ${target}; discard left half, search [${mid + 1}..${high}].`, 4, [mid], 'none');
          low = mid + 1;
        } else {
          yield S(`${A[mid].v} is greater than ${target}; discard right half, search [${low}..${mid - 1}].`, 5, [mid], 'none');
          high = mid - 1;
        }
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
    description: 'Sequentially checks each element until match is found.',
    pseudocode: [
      'for i from 0 to n - 1:',
      '  if A[i] == target: return i',
      'return -1 (not found)'
    ],
    *generate(A, S, doneSet) {
      const target = A[Math.floor(A.length * 0.7)].v;
      yield S(`Starting Linear Search for target value: ${target}.`, 0, [], 'none');

      for (let i = 0; i < A.length; i++) {
        yield S(`Check index ${i}: does ${A[i].v} equal ${target}?`, 1, [i], 'cmp');
        if (A[i].v === target) {
          doneSet.add(A[i].id);
          yield S(`Found target ${target} at index ${i}!`, 1, [i], 'swap');
          return;
        }
      }
    }
  }
};
