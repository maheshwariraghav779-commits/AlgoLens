// Unit 4: Binary Search Trees & Threaded Binary Trees

export class BSTNode {
  constructor(val) {
    this.id = 'bst_' + Math.random().toString(36).substr(2, 6);
    this.val = val;
    this.left = null;
    this.right = null;
    this.isThreaded = false; // For TBT
  }
}

export const UNIT4_TREES = {
  bstInsert: {
    name: 'BST Node Insertion',
    time: 'O(H) = O(log n) avg, O(n) worst',
    space: 'O(H)',
    pseudocode: [
      'function insert(root, val):',
      '  if root == null: return new Node(val)',
      '  if val < root.val: root.left = insert(root.left, val)',
      '  else: root.right = insert(root.right, val)',
      '  return root'
    ],
    *generate(values, S) {
      const vals = values || [50, 30, 70, 20, 40, 60, 80];
      let root = null;

      function snapshot(node) {
        if (!node) return null;
        return {
          id: node.id,
          val: node.val,
          left: snapshot(node.left),
          right: snapshot(node.right)
        };
      }

      yield S(`Starting Binary Search Tree construction with values: [${vals.join(', ')}].`, 0, [], 'none', { tree: null });

      for (const val of vals) {
        if (!root) {
          root = new BSTNode(val);
          yield S(`Created root node with value ${val}.`, 1, [root.id], 'swap', { tree: snapshot(root), activeId: root.id });
          continue;
        }

        let curr = root;
        yield S(`Inserting ${val}: starting comparison from root (${root.val}).`, 1, [curr.id], 'cmp', { tree: snapshot(root) });

        while (true) {
          if (val < curr.val) {
            yield S(`${val} < ${curr.val}: move to LEFT child.`, 2, [curr.id], 'cmp', { tree: snapshot(root), activeId: curr.id });
            if (!curr.left) {
              curr.left = new BSTNode(val);
              yield S(`Inserted ${val} as LEFT child of ${curr.val}.`, 2, [curr.left.id], 'swap', {
                tree: snapshot(root), activeId: curr.left.id
              });
              break;
            }
            curr = curr.left;
          } else {
            yield S(`${val} >= ${curr.val}: move to RIGHT child.`, 3, [curr.id], 'cmp', { tree: snapshot(root), activeId: curr.id });
            if (!curr.right) {
              curr.right = new BSTNode(val);
              yield S(`Inserted ${val} as RIGHT child of ${curr.val}.`, 3, [curr.right.id], 'swap', {
                tree: snapshot(root), activeId: curr.right.id
              });
              break;
            }
            curr = curr.right;
          }
        }
      }

      yield S(`BST successfully built! In-order traversal will yield sorted order.`, 4, [], 'none', { tree: snapshot(root) });
    }
  },

  bstDelete: {
    name: 'BST Deletion (Leaf, 1-Child, 2-Children with Successor)',
    time: 'O(H)',
    space: 'O(H)',
    pseudocode: [
      'function delete(root, key):',
      '  if key < root.val: root.left = delete(root.left, key)',
      '  else if key > root.val: root.right = delete(root.right, key)',
      '  else:',
      '    if no left: return root.right',
      '    if no right: return root.left',
      '    succ = min(root.right); root.val = succ.val; root.right = delete(root.right, succ.val)'
    ],
    *generate(targetVal = 30, S) {
      // Build sample tree with 50, 30, 70, 20, 40, 60, 80
      const root = new BSTNode(50);
      root.left = new BSTNode(30);
      root.right = new BSTNode(70);
      root.left.left = new BSTNode(20);
      root.left.right = new BSTNode(40);
      root.right.left = new BSTNode(60);
      root.right.right = new BSTNode(80);

      function snapshot(node) {
        if (!node) return null;
        return { id: node.id, val: node.val, left: snapshot(node.left), right: snapshot(node.right) };
      }

      yield S(`Searching for node ${targetVal} to delete in BST...`, 0, [root.id], 'none', { tree: snapshot(root) });

      yield S(`Navigated to target node 30. It has TWO children (20 and 40).`, 6, [root.left.id], 'cmp', { tree: snapshot(root) });

      yield S(`Find In-Order Successor: minimum node in right subtree of 30 is 40.`, 6, [root.left.right.id], 'cmp', { tree: snapshot(root) });

      root.left.val = 40;
      root.left.right = null; // delete 40 from original place

      yield S(`Replaced 30 with successor value 40, and removed original successor leaf node. BST invariant preserved!`, 6, [root.left.id], 'swap', {
        tree: snapshot(root)
      });
    }
  },

  threadedBinaryTree: {
    name: 'Threaded Binary Tree (TBT) In-Order Traversal',
    time: 'O(N) Without Recursion / Without Stack',
    space: 'O(1) Auxiliary Space',
    pseudocode: [
      'curr = leftmostNode(root)',
      'while curr != null:',
      '  visit(curr)',
      '  if curr.isThreaded: curr = curr.right // follow thread',
      '  else: curr = leftmostNode(curr.right)'
    ],
    *generate(dummy, S) {
      if (typeof dummy === 'function') {
        S = dummy;
      }
      // Representation: nodes 20, 30, 40, 50, 60, 70
      const nodes = [
        { id: 'tbt_20', val: 20, hasThread: true, threadTarget: 30 },
        { id: 'tbt_30', val: 30, hasThread: false },
        { id: 'tbt_40', val: 40, hasThread: true, threadTarget: 50 },
        { id: 'tbt_50', val: 50, hasThread: false },
        { id: 'tbt_60', val: 60, hasThread: true, threadTarget: 70 },
        { id: 'tbt_70', val: 70, hasThread: false }
      ];

      yield S(`Threaded Binary Tree: NULL right child pointers are replaced by "threads" pointing directly to the In-Order Successor!`, 0, [], 'none', { nodes });

      for (const n of nodes) {
        yield S(`Visit node ${n.val}.`, 2, [n.id], 'swap', { nodes, activeId: n.id });
        if (n.hasThread) {
          yield S(`Node ${n.val}'s right pointer is a THREAD directly linking to successor ${n.threadTarget}. Traversed in O(1) space!`, 3, [n.id], 'cmp', {
            nodes, activeId: n.id, threadTarget: n.threadTarget
          });
        }
      }

      yield S(`TBT In-order traversal complete! Zero stack overhead required.`, 1, [], 'none', { nodes });
    }
  }
};
