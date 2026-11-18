// Unit 1: Array Address Calculation & Sparse Matrix Transpose

export const MATRIX_OPERATIONS = {
  rowMajorAddress: {
    name: 'Row-Major Address Calculation',
    time: 'O(1) formula',
    space: 'O(1)',
    pseudocode: [
      '// Formula: Addr(A[i][j]) = Base + W * ((i - Lr) * Cols + (j - Lc))',
      'offset_rows = (i - Lr) * Cols',
      'offset_cols = (j - Lc)',
      'total_offset = offset_rows + offset_cols',
      'Address = Base + W * total_offset'
    ],
    *generate(params, S) {
      const { rows = 3, cols = 4, targetI = 2, targetJ = 1, base = 1000, w = 4 } = params || {};

      yield S(`Row-Major Order: 2D array of ${rows} rows × ${cols} cols. Base Address = ${base}, Element Size W = ${w} bytes.`, 0, [], 'none', {
        type: 'address',
        mode: 'row',
        rows, cols, targetI, targetJ, base, w
      });

      const rowOffset = targetI * cols;
      yield S(`Step 1: Skip completed preceding rows = i × Cols = ${targetI} × ${cols} = ${rowOffset} elements.`, 1, [], 'cmp', {
        type: 'address', mode: 'row', rows, cols, targetI, targetJ, base, w, stepVal: rowOffset
      });

      const totalOffset = rowOffset + targetJ;
      yield S(`Step 2: Add column offset j = ${targetJ}. Total elements skipped in 1D memory = ${totalOffset}.`, 3, [], 'cmp', {
        type: 'address', mode: 'row', rows, cols, targetI, targetJ, base, w, stepVal: totalOffset
      });

      const finalAddress = base + w * totalOffset;
      yield S(`Step 3: Multiply by ${w} bytes and add Base: Addr(A[${targetI}][${targetJ}]) = ${base} + (${w} × ${totalOffset}) = ${finalAddress}.`, 4, [], 'swap', {
        type: 'address', mode: 'row', rows, cols, targetI, targetJ, base, w, resultAddr: finalAddress
      });
    }
  },

  colMajorAddress: {
    name: 'Column-Major Address Calculation',
    time: 'O(1) formula',
    space: 'O(1)',
    pseudocode: [
      '// Formula: Addr(A[i][j]) = Base + W * ((j - Lc) * Rows + (i - Lr))',
      'offset_cols = (j - Lc) * Rows',
      'offset_rows = (i - Lr)',
      'total_offset = offset_cols + offset_rows',
      'Address = Base + W * total_offset'
    ],
    *generate(params, S) {
      const { rows = 3, cols = 4, targetI = 1, targetJ = 2, base = 1000, w = 4 } = params || {};

      yield S(`Column-Major Order: consecutive elements of columns are stored contiguously in memory.`, 0, [], 'none', {
        type: 'address', mode: 'col', rows, cols, targetI, targetJ, base, w
      });

      const colOffset = targetJ * rows;
      yield S(`Step 1: Skip completed preceding columns = j × Rows = ${targetJ} × ${rows} = ${colOffset} elements.`, 1, [], 'cmp', {
        type: 'address', mode: 'col', rows, cols, targetI, targetJ, base, w, stepVal: colOffset
      });

      const totalOffset = colOffset + targetI;
      yield S(`Step 2: Add row offset i = ${targetI}. Total offset = ${totalOffset} elements.`, 3, [], 'cmp', {
        type: 'address', mode: 'col', rows, cols, targetI, targetJ, base, w, stepVal: totalOffset
      });

      const finalAddress = base + w * totalOffset;
      yield S(`Step 3: Addr(A[${targetI}][${targetJ}]) = ${base} + (${w} × ${totalOffset}) = ${finalAddress}.`, 4, [], 'swap', {
        type: 'address', mode: 'col', rows, cols, targetI, targetJ, base, w, resultAddr: finalAddress
      });
    }
  },

  sparseSimpleTranspose: {
    name: 'Sparse Simple Transpose',
    time: 'O(Cols × Terms)',
    space: 'O(1) aux',
    pseudocode: [
      '// 3-Tuple: [row, col, val]',
      '1. For c from 0 to numCols - 1:',
      '2.   For i from 0 to numTerms - 1:',
      '3.     If matrix.terms[i].col == c: append (col, row, val)'
    ],
    *generate(initialSparse, S) {
      const matrix = initialSparse || {
        rows: 4,
        cols: 5,
        terms: [
          { r: 0, c: 1, v: 10 },
          { r: 1, c: 3, v: 20 },
          { r: 2, c: 1, v: 30 },
          { r: 3, c: 4, v: 40 }
        ]
      };
      const numCols = matrix.cols;
      const numTerms = matrix.terms.length;
      const transposed = [];

      yield S(`Simple Transpose: scanning column by column (0 to ${numCols - 1}) across ${numTerms} terms.`, 0, [], 'none', {
        type: 'sparse', matrix, stepName: 'init'
      });

      for (let c = 0; c < numCols; c++) {
        yield S(`Pass for Column ${c}: searching all ${numTerms} terms for column match...`, 1, [], 'cmp', {
          type: 'sparse', matrix, activeCol: c, transposed: [...transposed]
        });

        for (let i = 0; i < numTerms; i++) {
          const item = matrix.terms[i];
          yield S(`Inspect term ${i} (${item.r}, ${item.c}, ${item.v}): is col ${item.c} == ${c}?`, 2, [i], 'cmp', {
            type: 'sparse', matrix, activeCol: c, currentTerm: item, transposed: [...transposed]
          });

          if (item.c === c) {
            transposed.push({ r: item.c, c: item.r, v: item.v });
            yield S(`Match found for Col ${c}! Placed (${item.c}, ${item.r}, val=${item.v}) into transposed array.`, 3, [i], 'swap', {
              type: 'sparse', matrix, activeCol: c, transposed: [...transposed], currentTerm: item
            });
          }
        }
      }

      yield S(`Simple Transpose complete! Took O(Cols × Terms) = ${numCols * numTerms} iterations.`, 0, [], 'none', {
        type: 'sparse', matrix, transposed, stepName: 'done'
      });
    }
  },

  sparseFastTranspose: {
    name: 'Sparse Matrix Fast Transpose',
    time: 'O(Cols + Terms)',
    space: 'O(Cols)',
    pseudocode: [
      '// 3-Tuple: [row, col, val]',
      '1. Compute total[col] count for each col in 0..numCols-1',
      '2. Compute start_pos[col] using prefix sum',
      '3. For each term in matrix: place at start_pos[term.col]++'
    ],
    *generate(initialSparse, S) {
      // Default sample sparse matrix (4 rows, 5 cols, 4 non-zero terms)
      const matrix = initialSparse || {
        rows: 4,
        cols: 5,
        terms: [
          { r: 0, c: 1, v: 10 },
          { r: 1, c: 3, v: 20 },
          { r: 2, c: 1, v: 30 },
          { r: 3, c: 4, v: 40 }
        ]
      };

      const numCols = matrix.cols;
      const numTerms = matrix.terms.length;

      yield S(`Sparse Matrix: ${matrix.rows}×${matrix.cols} with ${numTerms} non-zero entries in 3-tuple format.`, 0, [], 'none', {
        type: 'sparse', matrix, stepName: 'init'
      });

      // Step 1: count frequency per col
      const total = Array(numCols).fill(0);
      for (let i = 0; i < numTerms; i++) {
        total[matrix.terms[i].c]++;
      }
      yield S(`Step 1: Computed frequency array total[col] across columns: [${total.join(', ')}].`, 1, [], 'cmp', {
        type: 'sparse', matrix, total, stepName: 'total'
      });

      // Step 2: compute starting positions
      const startPos = Array(numCols).fill(0);
      startPos[0] = 0;
      for (let c = 1; c < numCols; c++) {
        startPos[c] = startPos[c - 1] + total[c - 1];
      }
      yield S(`Step 2: Computed prefix positions start_pos[col]: [${startPos.join(', ')}].`, 2, [], 'cmp', {
        type: 'sparse', matrix, total, startPos: [...startPos], stepName: 'startPos'
      });

      // Step 3: place each term directly in transposed position
      const transposed = Array(numTerms);
      const currentPos = [...startPos];

      for (let i = 0; i < numTerms; i++) {
        const item = matrix.terms[i];
        const destIdx = currentPos[item.c];
        transposed[destIdx] = { r: item.c, c: item.r, v: item.v };
        currentPos[item.c]++;

        yield S(`Step 3: Placed element (${item.r}, ${item.c}, val=${item.v}) into transposed slot ${destIdx} as (${item.c}, ${item.r}, ${item.v}).`, 3, [i], 'swap', {
          type: 'sparse', matrix, total, startPos, transposed: transposed.filter(Boolean), currentTerm: item, stepName: 'placing'
        });
      }

      yield S(`Fast Transpose complete! Transposed in linear O(Cols + Terms) without nested column scanning loops.`, 3, [], 'none', {
        type: 'sparse', matrix, transposed, stepName: 'done'
      });
    }
  }
};
