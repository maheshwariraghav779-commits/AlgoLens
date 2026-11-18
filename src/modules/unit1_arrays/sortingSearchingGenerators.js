// Unit 1: Advanced Sorting and Searching Generators

export const UNIT1_SEARCHING = {
  linear: {
    name: 'Linear Search',
    time: 'O(n)',
    space: 'O(1)',
    pseudocode: [
      'for i from 0 to n-1:',
      '  if A[i] == target: return i',
      'return -1 (not found)'
    ],
    *generate(A, target, S, doneSet) {
      yield S(`Linear Search: scanning sequentially for target ${target}.`, 0, [], 'none');
      for (let i = 0; i < A.length; i++) {
        yield S(`Inspect index ${i}: is ${A[i].v} == ${target}?`, 1, [i], 'cmp');
        if (A[i].v === target) {
          doneSet.add(A[i].id);
          yield S(`Found target ${target} at index ${i}!`, 1, [i], 'swap');
          return;
        }
      }
      yield S(`Target ${target} was not found in the array.`, 2, [], 'none');
    }
  },

  binary: {
    name: 'Binary Search',
    time: 'O(log n)',
    space: 'O(1)',
    pseudocode: [
      'low = 0, high = n - 1',
      'while low <= high:',
      '  mid = floor((low + high) / 2)',
      '  if A[mid] == target: return mid',
      '  else if A[mid] < target: low = mid + 1',
      '  else: high = mid - 1'
    ],
    *generate(A, target, S, doneSet) {
      A.sort((a, b) => a.v - b.v);
      let low = 0, high = A.length - 1;
      yield S(`Array sorted. Searching for target ${target} in range [${low}..${high}].`, 0, [], 'none');

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        yield S(`Check midpoint index ${mid} (${A[mid].v}) in active range [${low}..${high}].`, 2, [mid], 'cmp');
        if (A[mid].v === target) {
          doneSet.add(A[mid].id);
          yield S(`Found target ${target} at index ${mid}!`, 3, [mid], 'swap');
          return;
        } else if (A[mid].v < target) {
          yield S(`${A[mid].v} < ${target}; search right half [${mid + 1}..${high}].`, 4, [mid], 'none');
          low = mid + 1;
        } else {
          yield S(`${A[mid].v} > ${target}; search left half [${low}..${mid - 1}].`, 5, [mid], 'none');
          high = mid - 1;
        }
      }
      yield S(`Target ${target} is not present in the array.`, 1, [], 'none');
    }
  },

  indexed: {
    name: 'Indexed Sequential Search',
    time: 'O(√n)',
    space: 'O(√n)',
    pseudocode: [
      'Build index table with k elements (blocks)',
      'Find block where index_key >= target',
      'Perform linear search within block'
    ],
    *generate(A, target, S, doneSet) {
      A.sort((a, b) => a.v - b.v);
      const blockSize = Math.max(2, Math.floor(Math.sqrt(A.length)));
      const indexTable = [];
      for (let i = 0; i < A.length; i += blockSize) {
        indexTable.push({ idx: i, val: A[i].v });
      }

      yield S(`Indexed Search: array split into blocks of size ${blockSize}. Index table built.`, 0, indexTable.map(t => t.idx), 'none');

      let blockStart = 0;
      let blockEnd = A.length - 1;

      for (let b = 0; b < indexTable.length; b++) {
        yield S(`Checking index table entry ${b}: key ${indexTable[b].val} at index ${indexTable[b].idx}.`, 1, [indexTable[b].idx], 'cmp');
        if (indexTable[b].val > target) {
          blockEnd = indexTable[b].idx - 1;
          break;
        }
        blockStart = indexTable[b].idx;
      }
      blockEnd = Math.min(blockStart + blockSize - 1, A.length - 1);

      yield S(`Target belongs in block [${blockStart}..${blockEnd}]. Running linear scan...`, 2, [blockStart, blockEnd], 'cmp');
      for (let i = blockStart; i <= blockEnd; i++) {
        yield S(`Scan block element ${A[i].v} at index ${i}.`, 2, [i], 'cmp');
        if (A[i].v === target) {
          doneSet.add(A[i].id);
          yield S(`Target ${target} found at index ${i}!`, 2, [i], 'swap');
          return;
        }
      }
      yield S(`Target not found in candidate block.`, 2, [], 'none');
    }
  },

  fibonacci: {
    name: 'Fibonacci Search',
    time: 'O(log n)',
    space: 'O(1)',
    pseudocode: [
      'Find smallest Fibonacci number fibM >= n',
      'Compare A[offset + fibM2] with target',
      'If target is smaller: cut by fibM2',
      'If target is larger: cut by fibM1, offset = i'
    ],
    *generate(A, target, S, doneSet) {
      A.sort((a, b) => a.v - b.v);
      const n = A.length;
      let fibM2 = 0;
      let fibM1 = 1;
      let fibM = fibM2 + fibM1;
      while (fibM < n) {
        fibM2 = fibM1;
        fibM1 = fibM;
        fibM = fibM2 + fibM1;
      }

      yield S(`Fibonacci Search: initialized Fibonacci numbers (fibM=${fibM}, fibM1=${fibM1}, fibM2=${fibM2}).`, 0, [], 'none');

      let offset = -1;
      while (fibM > 1) {
        const i = Math.min(offset + fibM2, n - 1);
        yield S(`Inspect index ${i} (value ${A[i].v}) using Fibonacci offset ${offset} + fibM2 ${fibM2}.`, 1, [i], 'cmp');

        if (A[i].v < target) {
          yield S(`${A[i].v} < ${target}; shift range right by 1 Fibonacci step.`, 3, [i], 'none');
          fibM = fibM1;
          fibM1 = fibM2;
          fibM2 = fibM - fibM1;
          offset = i;
        } else if (A[i].v > target) {
          yield S(`${A[i].v} > ${target}; shift range left by 2 Fibonacci steps.`, 2, [i], 'none');
          fibM = fibM2;
          fibM1 = fibM1 - fibM2;
          fibM2 = fibM - fibM1;
        } else {
          doneSet.add(A[i].id);
          yield S(`Found target ${target} at index ${i} using only addition/subtraction!`, 1, [i], 'swap');
          return;
        }
      }

      if (fibM1 && offset + 1 < n && A[offset + 1].v === target) {
        doneSet.add(A[offset + 1].id);
        yield S(`Found target ${target} at index ${offset + 1}!`, 1, [offset + 1], 'swap');
        return;
      }
      yield S(`Target ${target} not found in array.`, 0, [], 'none');
    }
  }
};

export const UNIT1_SORTING = {
  heap: {
    name: 'Heap Sort',
    time: 'O(n log n)',
    space: 'O(1)',
    pseudocode: [
      'buildMaxHeap(A)',
      'for i from n-1 down to 1:',
      '  swap(A[0], A[i]) // move max to end',
      '  maxHeapify(A, 0, i)'
    ],
    *generate(A, S, doneSet) {
      const n = A.length;

      function* heapify(size, root) {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        if (left < size) {
          yield S(`Compare parent ${A[largest].v} with left child ${A[left].v}.`, 3, [largest, left], 'cmp');
          if (A[left].v > A[largest].v) largest = left;
        }

        if (right < size) {
          yield S(`Compare current largest ${A[largest].v} with right child ${A[right].v}.`, 3, [largest, right], 'cmp');
          if (A[right].v > A[largest].v) largest = right;
        }

        if (largest !== root) {
          const temp = A[root];
          A[root] = A[largest];
          A[largest] = temp;
          yield S(`Swap ${A[root].v} with ${A[largest].v} to satisfy max-heap property.`, 3, [root, largest], 'swap');
          yield* heapify(size, largest);
        }
      }

      yield S(`Building initial Max-Heap from unsorted array.`, 0, [], 'none');
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(n, i);
      }

      yield S(`Max-Heap constructed! Root A[0] is the maximum element.`, 0, [0], 'cmp');

      for (let i = n - 1; i > 0; i--) {
        const temp = A[0];
        A[0] = A[i];
        A[i] = temp;
        doneSet.add(A[i].id);
        yield S(`Extracted max ${A[i].v} to sorted end position ${i}.`, 2, [0, i], 'swap');
        yield* heapify(i, 0);
      }
      doneSet.add(A[0].id);
      yield S(`Heap Sort complete! Array fully sorted.`, 2, [0], 'none');
    }
  },

  radix: {
    name: 'Radix Sort (LSD)',
    time: 'O(d · (n + b))',
    space: 'O(n + b)',
    pseudocode: [
      'maxVal = max(A)',
      'for exp = 1; maxVal / exp > 0; exp *= 10:',
      '  countSortByDigit(A, exp)'
    ],
    *generate(A, S, doneSet) {
      const maxVal = Math.max(...A.map(x => x.v));

      for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
        const digitName = exp === 1 ? 'Units' : exp === 10 ? 'Tens' : 'Hundreds';
        yield S(`Radix Sort: distributing elements into 10 buckets by ${digitName} digit (exp=${exp}).`, 1, [], 'none');

        const buckets = Array.from({ length: 10 }, () => []);
        for (let i = 0; i < A.length; i++) {
          const digit = Math.floor(A[i].v / exp) % 10;
          buckets[digit].push(A[i]);
          yield S(`Element ${A[i].v} has digit ${digit} at place ${exp}; assigned to bucket [${digit}].`, 2, [i], 'cmp');
        }

        // Flatten buckets back into A
        let idx = 0;
        for (let d = 0; d < 10; d++) {
          for (const item of buckets[d]) {
            const oldIdx = A.findIndex(x => x.id === item.id);
            if (oldIdx !== idx) {
              const temp = A[oldIdx];
              A.splice(oldIdx, 1);
              A.splice(idx, 0, temp);
              yield S(`Collected bucket [${d}]: placed ${item.v} at position ${idx}.`, 2, [idx], 'swap');
            }
            idx++;
          }
        }
      }
      A.forEach(x => doneSet.add(x.id));
      yield S(`Radix Sort finished! All digit passes completed.`, 2, [], 'none');
    }
  },

  shell: {
    name: 'Shell Sort',
    time: 'O(n¹.⁵) / O(n log² n)',
    space: 'O(1)',
    pseudocode: [
      'for gap = floor(n / 2) down to 1 (gap /= 2):',
      '  for i = gap to n - 1:',
      '    temp = A[i]; j = i',
      '    while j >= gap and A[j - gap] > temp: A[j] = A[j - gap]; j -= gap',
      '    A[j] = temp'
    ],
    *generate(A, S, doneSet) {
      const n = A.length;
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        yield S(`Shell Sort: starting pass with gap interval = ${gap}.`, 0, [], 'none');

        for (let i = gap; i < n; i++) {
          const temp = A[i];
          let j = i;
          yield S(`Gapped insertion for ${temp.v} across stride distance ${gap}.`, 2, [i], 'cmp');

          while (j >= gap) {
            yield S(`Compare ${A[j - gap].v} at index ${j - gap} with ${temp.v} at index ${j}.`, 3, [j - gap, j], 'cmp');
            if (A[j - gap].v > temp.v) {
              A[j] = A[j - gap];
              yield S(`Shift ${A[j].v} forward by ${gap} slots.`, 3, [j - gap, j], 'swap');
              j -= gap;
            } else {
              break;
            }
          }
          A[j] = temp;
          yield S(`Placed element ${temp.v} at position ${j}.`, 4, [j], 'swap');
        }
      }
      A.forEach(x => doneSet.add(x.id));
      yield S(`Shell Sort complete! Array fully sorted with diminishing increments.`, 4, [], 'none');
    }
  },

  bucket: {
    name: 'Bucket Sort',
    time: 'O(n + k)',
    space: 'O(n + k)',
    pseudocode: [
      'Create k empty buckets over range [min..max]',
      'Distribute each A[i] into bucket b = floor(k * (val - min) / range)',
      'Sort each bucket individually (Insertion sort)',
      'Concatenate all buckets in order'
    ],
    *generate(A, S, doneSet) {
      const minVal = Math.min(...A.map(x => x.v));
      const maxVal = Math.max(...A.map(x => x.v));
      const k = 4; // 4 buckets
      const range = (maxVal - minVal + 1) || 1;

      yield S(`Bucket Sort: partitioning range [${minVal}..${maxVal}] into ${k} range buckets.`, 0, [], 'none');

      const buckets = Array.from({ length: k }, () => []);
      for (let i = 0; i < A.length; i++) {
        const b = Math.min(k - 1, Math.floor(((A[i].v - minVal) / range) * k));
        buckets[b].push(A[i]);
        yield S(`Value ${A[i].v} placed in Bucket ${b}.`, 1, [i], 'cmp');
      }

      // Sort each bucket and put back
      let pos = 0;
      for (let b = 0; b < k; b++) {
        buckets[b].sort((x, y) => x.v - y.v);
        yield S(`Bucket ${b} sorted internally: [${buckets[b].map(x => x.v).join(', ')}].`, 2, [], 'none');
        for (const item of buckets[b]) {
          const curIdx = A.findIndex(x => x.id === item.id);
          if (curIdx !== pos) {
            const temp = A[curIdx];
            A.splice(curIdx, 1);
            A.splice(pos, 0, temp);
            yield S(`Concatenating: placed ${item.v} into position ${pos}.`, 3, [pos], 'swap');
          }
          doneSet.add(item.id);
          pos++;
        }
      }
      yield S(`Bucket Sort complete! All buckets concatenated into sorted order.`, 3, [], 'none');
    }
  }
};
