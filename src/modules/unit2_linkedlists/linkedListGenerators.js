// Unit 2: Linked Lists and Vectors Generators

export const UNIT2_LINKED_LIST = {
  // SLL Operations
  sllInsertFront: {
    name: 'SLL Insert at Front',
    time: 'O(1)',
    space: 'O(1)',
    pseudocode: [
      'newNode = createNode(value)',
      'newNode.next = head',
      'head = newNode'
    ],
    *generate(list, val, S) {
      const copy = list.map(x => ({ ...x }));
      const newId = 'n_' + Date.now();
      yield S(`Allocate new node with value ${val}.`, 0, [], 'none', { list: copy, newNode: { id: newId, val } });

      const newNode = { id: newId, val, next: copy[0]?.id || null };
      yield S(`Point newNode.next to current head (${copy[0]?.val ?? 'null'}).`, 1, [newId], 'cmp', {
        list: [newNode, ...copy], newNode
      });

      yield S(`Updated head pointer to newNode (${val}). Completed in O(1) time.`, 2, [newId], 'swap', {
        list: [newNode, ...copy], headId: newId
      });
    }
  },

  sllInsertEnd: {
    name: 'SLL Insert at End',
    time: 'O(n) [or O(1) with tail]',
    space: 'O(1)',
    pseudocode: [
      'newNode = createNode(value)',
      'curr = head',
      'while curr.next != null: curr = curr.next',
      'curr.next = newNode'
    ],
    *generate(list, val, S) {
      const copy = list.map(x => ({ ...x }));
      const newId = 'n_' + Date.now();
      yield S(`Allocate new node with value ${val}. Traversing from head to tail...`, 0, [], 'none', { list: copy });

      for (let i = 0; i < copy.length; i++) {
        yield S(`Visiting node ${copy[i].val}...`, 2, [copy[i].id], 'cmp', { list: copy, activeId: copy[i].id });
      }

      const newNode = { id: newId, val, next: null };
      copy.push(newNode);
      yield S(`Linked last node to newNode (${val}).`, 3, [newId], 'swap', { list: copy, activeId: newId });
    }
  },

  sllDeleteAt: {
    name: 'SLL Delete at Index',
    time: 'O(n)',
    space: 'O(1)',
    pseudocode: [
      'if index == 0: head = head.next; free(node); return',
      'curr = head; for i from 0 to index-2: curr = curr.next',
      'temp = curr.next',
      'curr.next = temp.next',
      'free(temp)'
    ],
    *generate(list, targetIdx, S) {
      const copy = list.map(x => ({ ...x }));
      if (copy.length === 0) return;
      const idx = Math.min(Math.max(0, targetIdx), copy.length - 1);

      yield S(`Traversing to node at position ${idx} for deletion...`, 1, [], 'none', { list: copy });

      for (let i = 0; i < idx; i++) {
        yield S(`Pointer at index ${i} (${copy[i].val})...`, 1, [copy[i].id], 'cmp', { list: copy });
      }

      const deletedItem = copy[idx];
      yield S(`Located target node ${deletedItem.val} at index ${idx}. Unlinking pointers...`, 2, [deletedItem.id], 'swap', {
        list: copy, deletedId: deletedItem.id
      });

      copy.splice(idx, 1);
      yield S(`Unlinked node ${deletedItem.val} and reconnected neighboring links.`, 3, [], 'none', { list: copy });
    }
  },

  sllReverse: {
    name: 'SLL In-Place Reversal',
    time: 'O(n)',
    space: 'O(1)',
    pseudocode: [
      'prev = null, curr = head',
      'while curr != null:',
      '  next = curr.next',
      '  curr.next = prev',
      '  prev = curr; curr = next',
      'head = prev'
    ],
    *generate(list, S) {
      let copy = list.map(x => ({ ...x }));
      yield S(`Starting in-place pointer reversal using 3 pointers (prev, curr, next).`, 0, [], 'none', { list: copy });

      const reversed = [];
      while (copy.length > 0) {
        const curr = copy.shift();
        reversed.unshift(curr);
        yield S(`Reversed link of node ${curr.val} to point to preceding node.`, 3, [curr.id], 'swap', {
          list: [...reversed, ...copy], activeId: curr.id
        });
      }
      yield S(`Reversal complete! Head now points to the last node.`, 5, [reversed[0]?.id], 'none', { list: reversed });
    }
  },

  // Polynomial Addition Application
  polyAdd: {
    name: 'Polynomial Addition (Linked List Application)',
    time: 'O(m + n)',
    space: 'O(m + n)',
    pseudocode: [
      'while p1 != null and p2 != null:',
      '  if p1.exp == p2.exp: addCoeff(p1, p2); adv(p1); adv(p2)',
      '  else if p1.exp > p2.exp: insert(p1); adv(p1)',
      '  else: insert(p2); adv(p2)',
      'appendRemaining(p1, p2)'
    ],
    *generate(poly1, poly2, S) {
      // Default: P1 = 4x³ + 3x² + 2x, P2 = 5x³ + 2x² + 7
      const p1 = poly1 || [
        { coeff: 4, exp: 3 },
        { coeff: 3, exp: 2 },
        { coeff: 2, exp: 1 }
      ];
      const p2 = poly2 || [
        { coeff: 5, exp: 3 },
        { coeff: -2, exp: 2 },
        { coeff: 7, exp: 0 }
      ];

      const result = [];
      let i = 0, j = 0;

      yield S(`Polynomial Addition: P1 = ${formatPoly(p1)} and P2 = ${formatPoly(p2)}.`, 0, [], 'none', { p1, p2, result: [] });

      while (i < p1.length && j < p2.length) {
        if (p1[i].exp === p2[j].exp) {
          const sumCoeff = p1[i].coeff + p2[j].coeff;
          yield S(`Exponents match (exp=${p1[i].exp}): adding coefficients (${p1[i].coeff} + ${p2[j].coeff}) = ${sumCoeff}.`, 1, [], 'cmp', {
            p1, p2, active1: i, active2: j, result: [...result]
          });
          if (sumCoeff !== 0) {
            result.push({ coeff: sumCoeff, exp: p1[i].exp });
          }
          i++; j++;
        } else if (p1[i].exp > p2[j].exp) {
          yield S(`P1 has higher exponent ${p1[i].exp} > ${p2[j].exp}: copying P1 term into result.`, 2, [], 'none', {
            p1, p2, active1: i, active2: j, result: [...result]
          });
          result.push({ ...p1[i] });
          i++;
        } else {
          yield S(`P2 has higher exponent ${p2[j].exp} > ${p1[i].exp}: copying P2 term into result.`, 3, [], 'none', {
            p1, p2, active1: i, active2: j, result: [...result]
          });
          result.push({ ...p2[j] });
          j++;
        }
      }

      while (i < p1.length) { result.push({ ...p1[i++] }); }
      while (j < p2.length) { result.push({ ...p2[j++] }); }

      yield S(`Addition finished! Result = ${formatPoly(result)}.`, 4, [], 'swap', { p1, p2, result });
    }
  },

  // Dynamic Array / Vector Resizing
  vectorResize: {
    name: 'Vector / Dynamic Array Resizing',
    time: 'Amortized O(1)',
    space: 'O(N)',
    pseudocode: [
      'if size == capacity:',
      '  newCapacity = 2 * capacity',
      '  newBuffer = allocate(newCapacity)',
      '  copyElements(oldBuffer -> newBuffer)',
      'newBuffer[size++] = element'
    ],
    *generate(initialVector, newItems, S) {
      let capacity = initialVector?.capacity || 2;
      let buffer = initialVector?.buffer || [10, 20];
      const toPush = newItems || [30, 40, 50];

      yield S(`Vector initialized: Size = ${buffer.length}, Capacity = ${capacity}. Buffer: [${buffer.join(', ')}].`, 0, [], 'none', {
        buffer: [...buffer], capacity, size: buffer.length
      });

      for (const val of toPush) {
        if (buffer.length === capacity) {
          const oldCap = capacity;
          capacity *= 2;
          yield S(`Capacity full (${buffer.length}/${oldCap})! Doubling capacity to ${capacity}.`, 1, [], 'cmp', {
            buffer: [...buffer], capacity: oldCap, nextCapacity: capacity
          });

          yield S(`Allocated contiguous block of size ${capacity} and copied existing ${buffer.length} elements.`, 3, [], 'swap', {
            buffer: [...buffer], capacity, size: buffer.length
          });
        }

        buffer.push(val);
        yield S(`Pushed ${val} into vector. (Size = ${buffer.length}, Capacity = ${capacity}).`, 4, [buffer.length - 1], 'swap', {
          buffer: [...buffer], capacity, size: buffer.length
        });
      }

      yield S(`Vector operations complete! Notice doubling capacity ensures amortized O(1) push operations.`, 4, [], 'none', {
        buffer, capacity, size: buffer.length
      });
    }
  },

  // Doubly Linked List (DLL with prev and next)
  dllOperations: {
    name: 'Doubly Linked List (prev & next)',
    time: 'O(1) ends, O(n) index',
    space: 'O(1) aux',
    pseudocode: [
      '// Node has: prev, val, next',
      'newNode = createNode(value)',
      'newNode.next = curr.next; newNode.prev = curr',
      'if curr.next != null: curr.next.prev = newNode',
      'curr.next = newNode'
    ],
    *generate(sampleList, S) {
      if (typeof sampleList === 'function') {
        S = sampleList;
        sampleList = null;
      }
      let list = sampleList || [
        { id: 'dll_1', val: 15, prev: null, next: 'dll_2' },
        { id: 'dll_2', val: 28, prev: 'dll_1', next: 'dll_3' },
        { id: 'dll_3', val: 42, prev: 'dll_2', next: null }
      ];

      yield S(`Doubly Linked List initialized: each node stores both 'prev' (backward) and 'next' (forward) pointers.`, 0, [], 'none', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: null
      });

      // Forward Traversal
      yield S(`Traversing FORWARD from head using 'next' pointers: Node 15.`, 0, ['dll_1'], 'cmp', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: 'dll_1', dir: 'forward'
      });
      yield S(`Forward step: 15.next -> Node 28.`, 0, ['dll_2'], 'cmp', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: 'dll_2', dir: 'forward'
      });
      yield S(`Forward step: 28.next -> Tail Node 42.`, 0, ['dll_3'], 'cmp', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: 'dll_3', dir: 'forward'
      });

      // Insert node in middle
      const newNode = { id: 'dll_new', val: 35, prev: 'dll_2', next: 'dll_3' };
      yield S(`Allocating new node 35 to insert between node 28 and node 42.`, 1, ['dll_new'], 'none', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), newNode, activeId: 'dll_new'
      });

      list[1].next = 'dll_new';
      list[2].prev = 'dll_new';
      list.splice(2, 0, newNode);

      yield S(`Wired dual pointers: newNode.prev = 28, newNode.next = 42; 28.next = newNode; 42.prev = newNode.`, 4, ['dll_new'], 'swap', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: 'dll_new'
      });

      // Backward Traversal from Tail
      yield S(`Traversing BACKWARD from tail (42) toward head using 'prev' pointers...`, 0, ['dll_3'], 'cmp', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: 'dll_3', dir: 'backward'
      });
      yield S(`Backward step: 42.prev points to node 35.`, 0, ['dll_new'], 'cmp', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: 'dll_new', dir: 'backward'
      });
      yield S(`Backward step: 35.prev points to node 28.`, 0, ['dll_2'], 'cmp', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: 'dll_2', dir: 'backward'
      });
      yield S(`Backward step: 28.prev points to head node 15 (head.prev is null).`, 0, ['dll_1'], 'cmp', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: 'dll_1', dir: 'backward'
      });

      yield S(`DLL operations complete! Demonstrates O(1) predecessor lookups and bidirectional traversal.`, 0, [], 'none', {
        type: 'dll', list: JSON.parse(JSON.stringify(list)), activeId: null
      });
    }
  },

  // Circular Linked List (CLL)
  cllOperations: {
    name: 'Circular Linked List (CLL)',
    time: 'O(1) ends, O(n) walk',
    space: 'O(1) aux',
    pseudocode: [
      '// Tail node points back to Head (never NULL)',
      'curr = head',
      'do:',
      '  visit(curr)',
      '  curr = curr.next',
      'while curr != head'
    ],
    *generate(sampleList, S) {
      if (typeof sampleList === 'function') {
        S = sampleList;
        sampleList = null;
      }
      let list = sampleList || [
        { id: 'cll_1', val: 10, next: 'cll_2' },
        { id: 'cll_2', val: 20, next: 'cll_3' },
        { id: 'cll_3', val: 30, next: 'cll_1' } // circular!
      ];

      yield S(`Circular Linked List: tail node (30) points back to head node (10) instead of NULL!`, 0, [], 'none', {
        type: 'cll', list: JSON.parse(JSON.stringify(list)), activeId: null
      });

      yield S(`Start circular traversal from head node 10...`, 1, ['cll_1'], 'cmp', {
        type: 'cll', list: JSON.parse(JSON.stringify(list)), activeId: 'cll_1'
      });
      yield S(`Traverse: 10 -> next is node 20.`, 2, ['cll_2'], 'cmp', {
        type: 'cll', list: JSON.parse(JSON.stringify(list)), activeId: 'cll_2'
      });
      yield S(`Traverse: 20 -> next is tail node 30.`, 2, ['cll_3'], 'cmp', {
        type: 'cll', list: JSON.parse(JSON.stringify(list)), activeId: 'cll_3'
      });
      yield S(`CIRCULAR LOOP! Tail node 30's next pointer points back to HEAD (node 10)!`, 3, ['cll_1'], 'swap', {
        type: 'cll', list: JSON.parse(JSON.stringify(list)), activeId: 'cll_1', isLoop: true
      });

      const newNode = { id: 'cll_4', val: 40, next: 'cll_1' };
      list[2].next = 'cll_4';
      list.push(newNode);

      yield S(`Inserted new node 40: previous tail 30 links to 40, and 40.next wraps back to head node 10.`, 0, ['cll_4'], 'swap', {
        type: 'cll', list: JSON.parse(JSON.stringify(list)), activeId: 'cll_4'
      });

      yield S(`Circular Linked List complete! Notice zero NULL pointers exist in the entire chain.`, 0, [], 'none', {
        type: 'cll', list: JSON.parse(JSON.stringify(list)), activeId: null
      });
    }
  },

  // Generalized Linked List (GLL)
  gllOperations: {
    name: 'Generalized Linked List (GLL)',
    time: 'O(n) hierarchy',
    space: 'O(depth)',
    pseudocode: [
      '// A GLL node is either an Atom (data) or a Sublist pointer',
      '// Example: L = (10, (20, 30), 40, (50, 60))',
      'if node.tag == ATOM: visit(node.data)',
      'else if node.tag == SUBLIST: traverseGLL(node.down)'
    ],
    *generate(dummy, S) {
      if (typeof dummy === 'function') {
        S = dummy;
      }
      const gllTree = [
        { type: 'atom', val: 10 },
        {
          type: 'sublist',
          label: 'Sublist L₁',
          children: [
            { type: 'atom', val: 20 },
            { type: 'atom', val: 30 }
          ]
        },
        { type: 'atom', val: 40 },
        {
          type: 'sublist',
          label: 'Sublist L₂',
          children: [
            { type: 'atom', val: 50 },
            { type: 'atom', val: 60 }
          ]
        }
      ];

      yield S(`Generalized Linked List (GLL): elements can be atomic values or nested sublists! Structure: (10, (20, 30), 40, (50, 60)).`, 0, [], 'none', {
        type: 'gll', gll: gllTree, activePath: []
      });

      yield S(`Visiting element 0: tag = ATOM (value 10). Processed directly in O(1).`, 1, ['0'], 'cmp', {
        type: 'gll', gll: gllTree, activePath: [0]
      });

      yield S(`Visiting element 1: tag = SUBLIST! Branching downwards into Sublist L₁...`, 2, ['1'], 'swap', {
        type: 'gll', gll: gllTree, activePath: [1]
      });

      yield S(`Sublist L₁: processed child atom 20.`, 2, ['1-0'], 'cmp', {
        type: 'gll', gll: gllTree, activePath: [1, 0]
      });

      yield S(`Sublist L₁: processed child atom 30. Sublist L₁ finished! Returning to parent list.`, 2, ['1-1'], 'cmp', {
        type: 'gll', gll: gllTree, activePath: [1, 1]
      });

      yield S(`Visiting element 2: tag = ATOM (value 40).`, 1, ['2'], 'cmp', {
        type: 'gll', gll: gllTree, activePath: [2]
      });

      yield S(`Visiting element 3: tag = SUBLIST! Branching downwards into Sublist L₂...`, 2, ['3'], 'swap', {
        type: 'gll', gll: gllTree, activePath: [3]
      });

      yield S(`Sublist L₂: processed child atom 50.`, 2, ['3-0'], 'cmp', {
        type: 'gll', gll: gllTree, activePath: [3, 0]
      });

      yield S(`Sublist L₂: processed child atom 60. Sublist L₂ completed!`, 2, ['3-1'], 'cmp', {
        type: 'gll', gll: gllTree, activePath: [3, 1]
      });

      yield S(`GLL Traversal complete! Depth = 2, Total elements = 6. Ideal for polynomials & symbolic algebra.`, 0, [], 'none', {
        type: 'gll', gll: gllTree, activePath: []
      });
    }
  }
};

function formatPoly(terms) {
  if (!terms || terms.length === 0) return '0';
  return terms
    .map((t, idx) => {
      const sign = t.coeff > 0 && idx > 0 ? '+ ' : t.coeff < 0 ? '- ' : '';
      const absC = Math.abs(t.coeff);
      const cStr = absC === 1 && t.exp > 0 ? '' : absC;
      const xStr = t.exp === 0 ? '' : t.exp === 1 ? 'x' : `x^${t.exp}`;
      return `${sign}${cStr}${xStr}`;
    })
    .join(' ');
}
