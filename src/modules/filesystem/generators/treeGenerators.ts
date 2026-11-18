import { Step, StepKind } from '../../../engine/types';
import { FSNode } from '../types';
import { cloneTree, findNodeById, getPathToNode } from '../initialTree';

export interface TreeStepMeta {
  tree: FSNode;
  activePath?: string[];
  activeNodeId?: string;
  folderSizes?: Record<string, number>;
  highlightedEdges?: string[]; // "parent->child"
}

export type TreeEmitFn = (
  text: string,
  line: number,
  highlightedIds: string[],
  kind: StepKind,
  meta?: TreeStepMeta
) => Step;

export const FS_OPERATIONS = {
  'dfs-pre': {
    name: 'DFS Pre-order Traversal',
    timeComplexity: 'Time O(V + E) = O(N)',
    spaceComplexity: 'Space O(H) call stack',
    pseudocode: [
      'function dfsPre(node):',
      '  visit(node) // Process node first',
      '  for each child in node.children:',
      '    dfsPre(child)'
    ],
    *generate(tree: FSNode, S: TreeEmitFn, done: Set<string>): Generator<Step, void, unknown> {
      function* traverse(curr: FSNode, path: string[]): Generator<Step, void, unknown> {
        path.push(curr.id);
        yield S(`Visit node "${curr.name}" (${curr.type}). Pre-order processes parent before its children.`, 1, [curr.id], 'visit', {
          tree,
          activePath: [...path],
          activeNodeId: curr.id
        });

        for (let i = 0; i < curr.children.length; i++) {
          const child = curr.children[i];
          yield S(`Recurse down into child "${child.name}".`, 3, [curr.id, child.id], 'compare', {
            tree,
            activePath: [...path, child.id],
            activeNodeId: child.id
          });
          yield* traverse(child, path);
        }

        done.add(curr.id);
        yield S(`Completed subtree under "${curr.name}".`, 1, [curr.id], 'none', {
          tree,
          activePath: [...path],
          activeNodeId: curr.id
        });
        path.pop();
      }

      yield S(`Starting DFS Pre-Order traversal from root "${tree.name}".`, 0, [tree.id], 'none', { tree, activePath: [tree.id] });
      yield* traverse(tree, []);
      yield S(`DFS Pre-Order complete! Every directory and file was visited in top-down prefix order.`, 0, [], 'none', { tree, activePath: [] });
    }
  },

  'dfs-post': {
    name: 'DFS Post-order Traversal',
    timeComplexity: 'Time O(N)',
    spaceComplexity: 'Space O(H) recursion stack',
    pseudocode: [
      'function dfsPost(node):',
      '  for each child in node.children:',
      '    dfsPost(child)',
      '  visit(node) // Process node after children'
    ],
    *generate(tree: FSNode, S: TreeEmitFn, done: Set<string>): Generator<Step, void, unknown> {
      function* traverse(curr: FSNode, path: string[]): Generator<Step, void, unknown> {
        path.push(curr.id);
        for (const child of curr.children) {
          yield S(`Dive into child "${child.name}" before finishing "${curr.name}".`, 2, [curr.id, child.id], 'compare', {
            tree,
            activePath: [...path, child.id],
            activeNodeId: child.id
          });
          yield* traverse(child, path);
        }

        done.add(curr.id);
        yield S(`Visit "${curr.name}" after all of its children have completed.`, 3, [curr.id], 'visit', {
          tree,
          activePath: [...path],
          activeNodeId: curr.id
        });
        path.pop();
      }

      yield S(`Starting DFS Post-Order traversal from root "${tree.name}".`, 0, [tree.id], 'none', { tree, activePath: [tree.id] });
      yield* traverse(tree, []);
      yield S(`DFS Post-Order complete! (Ideal for bottom-up tasks like calculating folder size or deleting directories).`, 3, [], 'none', { tree });
    }
  },

  'bfs': {
    name: 'BFS (Level-order) Traversal',
    timeComplexity: 'Time O(N)',
    spaceComplexity: 'Space O(W) queue width',
    pseudocode: [
      'queue = [root]',
      'while queue is not empty:',
      '  node = queue.dequeue()',
      '  visit(node)',
      '  enqueue all children of node'
    ],
    *generate(tree: FSNode, S: TreeEmitFn, done: Set<string>): Generator<Step, void, unknown> {
      const queue: FSNode[] = [tree];
      yield S(`Initialize queue with root directory "${tree.name}".`, 0, [tree.id], 'none', { tree });

      while (queue.length > 0) {
        const curr = queue.shift()!;
        yield S(`Dequeue "${curr.name}" from the front of the queue and visit it.`, 2, [curr.id], 'visit', {
          tree,
          activeNodeId: curr.id
        });

        for (const child of curr.children) {
          queue.push(child);
          yield S(`Enqueue child "${child.name}" to visit on subsequent level.`, 4, [curr.id, child.id], 'compare', {
            tree,
            activeNodeId: child.id
          });
        }
        done.add(curr.id);
      }

      yield S(`BFS Level-order complete! Explored breadth-first level by level.`, 1, [], 'none', { tree });
    }
  },

  'find-path': {
    name: 'Find Path to File / Node',
    timeComplexity: 'Time O(N)',
    spaceComplexity: 'Space O(H) path trace',
    pseudocode: [
      'function findPath(node, target):',
      '  if node.name == target: return [node]',
      '  for child in node.children:',
      '    path = findPath(child, target)',
      '    if path: return [node] + path',
      '  return null'
    ],
    *generate(tree: FSNode, S: TreeEmitFn, done: Set<string>): Generator<Step, void, unknown> {
      const targetName = 'algolens.ts';
      let foundPath: string[] = [];

      function* search(curr: FSNode, currentPath: string[]): Generator<Step, boolean, unknown> {
        currentPath.push(curr.id);
        yield S(`Checking node "${curr.name}"... is it "${targetName}"?`, 1, [curr.id], 'compare', {
          tree,
          activePath: [...currentPath],
          activeNodeId: curr.id
        });

        if (curr.name.toLowerCase() === targetName.toLowerCase()) {
          done.add(curr.id);
          yield S(`Found target file "${curr.name}"! Exact path: ${currentPath.join(' → ')}`, 1, [curr.id], 'swap', {
            tree,
            activePath: [...currentPath],
            activeNodeId: curr.id
          });
          foundPath = [...currentPath];
          return true;
        }

        for (const child of curr.children) {
          yield S(`Descending into directory "${curr.name}" towards "${child.name}"...`, 3, [curr.id, child.id], 'visit', {
            tree,
            activePath: [...currentPath, child.id],
            activeNodeId: child.id
          });
          const found = yield* search(child, currentPath);
          if (found) return true;
        }

        yield S(`Target not in subtree "${curr.name}". Backtracking...`, 5, [curr.id], 'none', {
          tree,
          activePath: [...currentPath],
          activeNodeId: curr.id
        });
        currentPath.pop();
        return false;
      }

      yield S(`Initiating path resolution for "${targetName}" from root "/".`, 0, [tree.id], 'none', { tree, activePath: [tree.id] });
      yield* search(tree, []);
      if (foundPath.length > 0) {
        foundPath.forEach(id => done.add(id));
        yield S(`Path successfully resolved! The file is located at /home/user/projects/algolens.ts`, 4, foundPath, 'none', {
          tree,
          activePath: foundPath
        });
      }
    }
  },

  'compute-size': {
    name: 'Folder Size (Post-order Computation)',
    timeComplexity: 'Time O(N)',
    spaceComplexity: 'Space O(H)',
    pseudocode: [
      'function computeSize(node):',
      '  if node.type == file: return node.size',
      '  total = 0',
      '  for child in node.children:',
      '    total += computeSize(child)',
      '  node.size = total; return total'
    ],
    *generate(tree: FSNode, S: TreeEmitFn, done: Set<string>): Generator<Step, void, unknown> {
      const folderSizes: Record<string, number> = {};

      function* calc(curr: FSNode): Generator<Step, number, unknown> {
        if (curr.type === 'file') {
          folderSizes[curr.id] = curr.size;
          done.add(curr.id);
          yield S(`File "${curr.name}" is a leaf node with static size ${curr.size} KB.`, 1, [curr.id], 'visit', {
            tree,
            folderSizes: { ...folderSizes },
            activeNodeId: curr.id
          });
          return curr.size;
        }

        let total = 0;
        yield S(`Calculating size of directory "${curr.name}". Must aggregate child sizes first.`, 2, [curr.id], 'compare', {
          tree,
          folderSizes: { ...folderSizes },
          activeNodeId: curr.id
        });

        for (const child of curr.children) {
          const childSize = yield* calc(child);
          total += childSize;
          yield S(`Added ${child.name} (${childSize} KB) to "${curr.name}". Running sum: ${total} KB.`, 4, [curr.id, child.id], 'swap', {
            tree,
            folderSizes: { ...folderSizes, [curr.id]: total },
            activeNodeId: curr.id
          });
        }

        folderSizes[curr.id] = total;
        curr.size = total;
        done.add(curr.id);
        yield S(`Directory "${curr.name}" total size resolved to ${total} KB.`, 5, [curr.id], 'none', {
          tree,
          folderSizes: { ...folderSizes },
          activeNodeId: curr.id
        });
        return total;
      }

      yield S(`Computing folder sizes using Post-Order traversal. Subtree sizes bubble upward!`, 0, [tree.id], 'none', { tree });
      yield* calc(tree);
      yield S(`Finished size calculation! Root "/" contains ${tree.size} KB total.`, 5, [tree.id], 'none', {
        tree,
        folderSizes: { ...folderSizes }
      });
    }
  }
};

export function* generateFileActionStep(
  action: 'create-file' | 'create-folder' | 'rename' | 'delete' | 'move',
  tree: FSNode,
  params: {
    targetId?: string;
    parentId?: string;
    name?: string;
    size?: number;
    destinationId?: string;
  },
  S: TreeEmitFn,
  done: Set<string>
): Generator<Step, void, unknown> {
  const treeClone = cloneTree(tree);

  if (action === 'create-file' || action === 'create-folder') {
    const parentId = params.parentId || 'docs';
    const parent = findNodeById(treeClone, parentId) || treeClone;
    const path = getPathToNode(treeClone, parent.id);

    yield S(`Walking directory tree from root to target parent directory "${parent.name}"...`, 0, path, 'compare', {
      tree: treeClone,
      activePath: path
    });

    const isFolder = action === 'create-folder';
    const newId = 'item_' + Date.now().toString(36);
    const newName = params.name || (isFolder ? 'new_folder' : 'script.py');
    const newSize = isFolder ? 0 : (params.size || 24);

    const newNode: FSNode = {
      id: newId,
      name: newName,
      type: isFolder ? 'folder' : 'file',
      size: newSize,
      parentId: parent.id,
      children: [],
      expanded: true
    };

    parent.children.push(newNode);
    done.add(newNode.id);

    yield S(`Found parent "${parent.name}". Allocating and inserting child node "${newName}" (${newNode.type}).`, 2, [parent.id, newId], 'insert', {
      tree: treeClone,
      activePath: [...path, newId],
      activeNodeId: newId
    });
  } else if (action === 'delete') {
    const targetId = params.targetId || 'hosts';
    const target = findNodeById(treeClone, targetId);
    if (!target) {
      yield S(`Target node not found for deletion.`, 0, [], 'none', { tree: treeClone });
      return;
    }

    const path = getPathToNode(treeClone, target.id);
    yield S(`Searching tree for node "${target.name}" to remove...`, 1, path, 'compare', {
      tree: treeClone,
      activePath: path,
      activeNodeId: target.id
    });

    yield S(`Located "${target.name}". Unlinking from parent and reclaiming storage.`, 2, [target.id], 'delete', {
      tree: treeClone,
      activeNodeId: target.id
    });

    // Remove from parent
    if (target.parentId) {
      const parent = findNodeById(treeClone, target.parentId);
      if (parent) {
        parent.children = parent.children.filter(c => c.id !== target.id);
      }
    }
    yield S(`Node "${target.name}" deleted successfully. Directory tree re-balanced.`, 3, [], 'none', {
      tree: treeClone
    });
  } else if (action === 'rename') {
    const targetId = params.targetId || 'resume';
    const target = findNodeById(treeClone, targetId);
    if (target) {
      const oldName = target.name;
      const newName = params.name || 'portfolio_v2.pdf';
      yield S(`Locating "${oldName}" in directory tree...`, 1, [target.id], 'compare', {
        tree: treeClone,
        activeNodeId: target.id
      });
      target.name = newName;
      done.add(target.id);
      yield S(`Renamed node "${oldName}" → "${newName}".`, 2, [target.id], 'insert', {
        tree: treeClone,
        activeNodeId: target.id
      });
    }
  } else if (action === 'move') {
    const sourceId = params.targetId || 'bashrc';
    const destId = params.destinationId || 'etc';
    const source = findNodeById(treeClone, sourceId);
    const dest = findNodeById(treeClone, destId);

    if (source && dest && dest.type === 'folder') {
      const sourcePath = getPathToNode(treeClone, source.id);
      yield S(`Preparing to move "${source.name}" from current directory...`, 1, sourcePath, 'compare', {
        tree: treeClone,
        activePath: sourcePath,
        activeNodeId: source.id
      });

      // Detach
      if (source.parentId) {
        const oldParent = findNodeById(treeClone, source.parentId);
        if (oldParent) {
          oldParent.children = oldParent.children.filter(c => c.id !== source.id);
        }
      }

      source.parentId = dest.id;
      dest.children.push(source);
      done.add(source.id);

      const newPath = getPathToNode(treeClone, source.id);
      yield S(`Moved "${source.name}" into target directory "${dest.name}". Updated tree pointers!`, 3, [dest.id, source.id], 'insert', {
        tree: treeClone,
        activePath: newPath,
        activeNodeId: source.id
      });
    }
  }
}
