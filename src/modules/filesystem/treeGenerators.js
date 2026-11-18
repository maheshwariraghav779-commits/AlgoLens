export function createInitialFSTree() {
  return {
    id: 'root',
    name: '/',
    type: 'folder',
    size: 0,
    parentId: null,
    children: [
      {
        id: 'home',
        name: 'home',
        type: 'folder',
        size: 0,
        parentId: 'root',
        children: [
          {
            id: 'user',
            name: 'user',
            type: 'folder',
            size: 0,
            parentId: 'home',
            children: [
              {
                id: 'docs',
                name: 'docs',
                type: 'folder',
                size: 0,
                parentId: 'user',
                children: [
                  { id: 'resume', name: 'resume.pdf', type: 'file', size: 120, parentId: 'docs', children: [] },
                  { id: 'notes', name: 'notes.txt', type: 'file', size: 15, parentId: 'docs', children: [] }
                ]
              },
              {
                id: 'projects',
                name: 'projects',
                type: 'folder',
                size: 0,
                parentId: 'user',
                children: [
                  { id: 'algolens', name: 'algolens.js', type: 'file', size: 85, parentId: 'projects', children: [] },
                  { id: 'readme', name: 'README.md', type: 'file', size: 8, parentId: 'projects', children: [] }
                ]
              },
              { id: 'bashrc', name: '.bashrc', type: 'file', size: 4, parentId: 'user', children: [] }
            ]
          }
        ]
      },
      {
        id: 'etc',
        name: 'etc',
        type: 'folder',
        size: 0,
        parentId: 'root',
        children: [
          { id: 'nginx', name: 'nginx.conf', type: 'file', size: 12, parentId: 'etc', children: [] },
          { id: 'hosts', name: 'hosts', type: 'file', size: 2, parentId: 'etc', children: [] }
        ]
      },
      {
        id: 'var',
        name: 'var',
        type: 'folder',
        size: 0,
        parentId: 'root',
        children: [
          {
            id: 'log',
            name: 'log',
            type: 'folder',
            size: 0,
            parentId: 'var',
            children: [
              { id: 'syslog', name: 'syslog', type: 'file', size: 450, parentId: 'log', children: [] },
              { id: 'authlog', name: 'auth.log', type: 'file', size: 90, parentId: 'log', children: [] }
            ]
          }
        ]
      },
      {
        id: 'usr',
        name: 'usr',
        type: 'folder',
        size: 0,
        parentId: 'root',
        children: [
          {
            id: 'bin',
            name: 'bin',
            type: 'folder',
            size: 0,
            parentId: 'usr',
            children: [
              { id: 'node_bin', name: 'node', type: 'file', size: 1800, parentId: 'bin', children: [] },
              { id: 'git_bin', name: 'git', type: 'file', size: 2200, parentId: 'bin', children: [] }
            ]
          }
        ]
      }
    ]
  };
}

export function cloneTree(node) {
  return {
    ...node,
    children: (node.children || []).map(cloneTree)
  };
}

export function findNodeById(root, id) {
  if (root.id === id) return root;
  for (const child of root.children || []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function getPathToNode(root, targetId) {
  const path = [];
  function search(node) {
    path.push(node.id);
    if (node.id === targetId) return true;
    for (const child of node.children || []) {
      if (search(child)) return true;
    }
    path.pop();
    return false;
  }
  search(root);
  return path;
}

export function calculateTreeStats(root) {
  let totalFiles = 0;
  let totalFolders = 0;
  let maxDepth = 0;
  let maxBranching = 0;

  function traverse(node, depth) {
    if (depth > maxDepth) maxDepth = depth;
    if (node.type === 'folder') {
      totalFolders++;
      if (node.children.length > maxBranching) {
        maxBranching = node.children.length;
      }
      for (const child of node.children) {
        traverse(child, depth + 1);
      }
    } else {
      totalFiles++;
    }
  }

  traverse(root, 1);
  return { totalFiles, totalFolders, maxDepth, maxBranching };
}

export const FS_OPERATIONS = {
  'dfs-pre': {
    name: 'DFS Pre-order Traversal',
    timeComplexity: 'Time O(N)',
    spaceComplexity: 'Space O(H) stack',
    pseudocode: [
      'function dfsPre(node):',
      '  visit(node) // Process parent first',
      '  for each child in node.children:',
      '    dfsPre(child)'
    ],
    *generate(tree, S, doneSet) {
      function* traverse(curr, path) {
        path.push(curr.id);
        yield S(`Visit node "${curr.name}" (${curr.type}). Pre-order processes parent before children.`, 1, [curr.id], 'visit', {
          tree,
          activePath: [...path],
          activeNodeId: curr.id
        });

        for (const child of curr.children) {
          yield S(`Descending from "${curr.name}" down into child "${child.name}".`, 3, [curr.id, child.id], 'cmp', {
            tree,
            activePath: [...path, child.id],
            activeNodeId: child.id
          });
          yield* traverse(child, path);
        }

        doneSet.add(curr.id);
        yield S(`Completed subtree under "${curr.name}".`, 1, [curr.id], 'none', {
          tree,
          activePath: [...path],
          activeNodeId: curr.id
        });
        path.pop();
      }

      yield S(`Starting DFS Pre-Order traversal from root "/".`, 0, [tree.id], 'none', { tree, activePath: [tree.id] });
      yield* traverse(tree, []);
      yield S(`DFS Pre-Order complete! Every file and directory visited in top-down prefix order.`, 0, [], 'none', { tree, activePath: [] });
    }
  },

  'dfs-post': {
    name: 'DFS Post-order Traversal',
    timeComplexity: 'Time O(N)',
    spaceComplexity: 'Space O(H) stack',
    pseudocode: [
      'function dfsPost(node):',
      '  for each child in node.children:',
      '    dfsPost(child)',
      '  visit(node) // Process parent after all children'
    ],
    *generate(tree, S, doneSet) {
      function* traverse(curr, path) {
        path.push(curr.id);
        for (const child of curr.children) {
          yield S(`Recurse down into child "${child.name}" first before finishing parent "${curr.name}".`, 2, [curr.id, child.id], 'cmp', {
            tree,
            activePath: [...path, child.id],
            activeNodeId: child.id
          });
          yield* traverse(child, path);
        }

        doneSet.add(curr.id);
        yield S(`Visit "${curr.name}" now that all its children have finished.`, 3, [curr.id], 'visit', {
          tree,
          activePath: [...path],
          activeNodeId: curr.id
        });
        path.pop();
      }

      yield S(`Starting DFS Post-Order traversal from root "/".`, 0, [tree.id], 'none', { tree, activePath: [tree.id] });
      yield* traverse(tree, []);
      yield S(`DFS Post-Order complete! Bottom-up processing is finished.`, 3, [], 'none', { tree });
    }
  },

  'dfs-in': {
    name: 'In-order Traversal (Binary View)',
    timeComplexity: 'Time O(N)',
    spaceComplexity: 'Space O(H)',
    pseudocode: [
      'function dfsIn(node):',
      '  if hasLeftChild(node): dfsIn(leftChild)',
      '  visit(node) // Process node',
      '  if hasRightSibling(node): dfsIn(rightSibling)'
    ],
    *generate(tree, S, doneSet) {
      function* traverse(curr) {
        if (!curr) return;
        if (curr.children.length > 0) {
          yield S(`First traverse leftmost child branch "${curr.children[0].name}".`, 1, [curr.id, curr.children[0].id], 'cmp', { tree });
          yield* traverse(curr.children[0]);
        }

        doneSet.add(curr.id);
        yield S(`Visit node "${curr.name}" in LCRS binary order.`, 2, [curr.id], 'visit', { tree, activeNodeId: curr.id });

        for (let i = 1; i < curr.children.length; i++) {
          yield S(`Next traverse sibling branch "${curr.children[i].name}".`, 3, [curr.id, curr.children[i].id], 'cmp', { tree });
          yield* traverse(curr.children[i]);
        }
      }

      yield S(`Starting In-order traversal mapped onto the First-Child Next-Sibling representation.`, 0, [tree.id], 'none', { tree });
      yield* traverse(tree);
      yield S(`In-order traversal completed.`, 2, [], 'none', { tree });
    }
  },

  'bfs': {
    name: 'BFS (Level-order) Traversal',
    timeComplexity: 'Time O(N)',
    spaceComplexity: 'Space O(W) queue',
    pseudocode: [
      'queue = [root]',
      'while queue is not empty:',
      '  curr = queue.dequeue()',
      '  visit(curr)',
      '  enqueue all children of curr'
    ],
    *generate(tree, S, doneSet) {
      const queue = [tree];
      yield S(`Initialize FIFO queue with root directory "/".`, 0, [tree.id], 'none', { tree });

      while (queue.length > 0) {
        const curr = queue.shift();
        yield S(`Dequeue "${curr.name}" from front of queue and visit it.`, 3, [curr.id], 'visit', {
          tree,
          activeNodeId: curr.id
        });

        for (const child of curr.children) {
          queue.push(child);
          yield S(`Enqueue child "${child.name}" to visit on subsequent level.`, 4, [curr.id, child.id], 'cmp', {
            tree,
            activeNodeId: child.id
          });
        }
        doneSet.add(curr.id);
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
    *generate(tree, S, doneSet) {
      const targetName = 'algolens.js';
      let foundPath = [];

      function* search(curr, currentPath) {
        currentPath.push(curr.id);
        yield S(`Inspecting node "${curr.name}"... is it "${targetName}"?`, 1, [curr.id], 'cmp', {
          tree,
          activePath: [...currentPath],
          activeNodeId: curr.id
        });

        if (curr.name.toLowerCase() === targetName.toLowerCase()) {
          doneSet.add(curr.id);
          yield S(`Found target "${curr.name}"! Route: ${currentPath.join(' → ')}`, 1, [curr.id], 'swap', {
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

      yield S(`Initiating path search for "${targetName}" from root "/".`, 0, [tree.id], 'none', { tree, activePath: [tree.id] });
      yield* search(tree, []);
      if (foundPath.length > 0) {
        foundPath.forEach(id => doneSet.add(id));
        yield S(`Path successfully resolved! Located at /home/user/projects/algolens.js`, 4, foundPath, 'none', {
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
    *generate(tree, S, doneSet) {
      const folderSizes = {};

      function* calc(curr) {
        if (curr.type === 'file') {
          folderSizes[curr.id] = curr.size;
          doneSet.add(curr.id);
          yield S(`File "${curr.name}" is a leaf with static size ${curr.size} KB.`, 1, [curr.id], 'visit', {
            tree,
            folderSizes: { ...folderSizes },
            activeNodeId: curr.id
          });
          return curr.size;
        }

        let total = 0;
        yield S(`Calculating size of directory "${curr.name}". Aggregating child sizes...`, 2, [curr.id], 'cmp', {
          tree,
          folderSizes: { ...folderSizes },
          activeNodeId: curr.id
        });

        for (const child of curr.children) {
          const childSize = yield* calc(child);
          total += childSize;
          yield S(`Added ${child.name} (${childSize} KB) to "${curr.name}". Subtree sum: ${total} KB.`, 4, [curr.id, child.id], 'swap', {
            tree,
            folderSizes: { ...folderSizes, [curr.id]: total },
            activeNodeId: curr.id
          });
        }

        folderSizes[curr.id] = total;
        curr.size = total;
        doneSet.add(curr.id);
        yield S(`Directory "${curr.name}" total size resolved to ${total} KB.`, 5, [curr.id], 'none', {
          tree,
          folderSizes: { ...folderSizes },
          activeNodeId: curr.id
        });
        return total;
      }

      yield S(`Computing directory storage sizes with Post-Order traversal.`, 0, [tree.id], 'none', { tree });
      yield* calc(tree);
      yield S(`Finished size calculation! Root "/" contains ${tree.size} KB total.`, 5, [tree.id], 'none', {
        tree,
        folderSizes: { ...folderSizes }
      });
    }
  }
};

export function* generateFileActionStep(action, tree, params, S, doneSet) {
  const treeClone = cloneTree(tree);

  if (action === 'create-file' || action === 'create-folder') {
    const parentId = params.parentId || 'docs';
    const parent = findNodeById(treeClone, parentId) || treeClone;
    const path = getPathToNode(treeClone, parent.id);

    yield S(`Walking directory tree from root to target parent directory "${parent.name}"...`, 0, path, 'cmp', {
      tree: treeClone,
      activePath: path
    });

    const isFolder = action === 'create-folder';
    const newId = 'item_' + Date.now().toString(36);
    const newName = params.name || (isFolder ? 'backup' : 'data.csv');
    const newSize = isFolder ? 0 : (params.size || 25);

    const newNode = {
      id: newId,
      name: newName,
      type: isFolder ? 'folder' : 'file',
      size: newSize,
      parentId: parent.id,
      children: []
    };

    parent.children.push(newNode);
    doneSet.add(newNode.id);

    yield S(`Found parent "${parent.name}". Allocating and inserting child node "${newName}" (${newNode.type}).`, 3, [parent.id, newId], 'swap', {
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
    yield S(`Traversing tree to locate node "${target.name}" to delete...`, 0, path, 'cmp', {
      tree: treeClone,
      activePath: path,
      activeNodeId: target.id
    });

    yield S(`Located "${target.name}". Unlinking pointers from parent and freeing node memory.`, 2, [target.id], 'swap', {
      tree: treeClone,
      activeNodeId: target.id
    });

    if (target.parentId) {
      const parent = findNodeById(treeClone, target.parentId);
      if (parent) {
        parent.children = parent.children.filter(c => c.id !== target.id);
      }
    }
    yield S(`Node "${target.name}" removed successfully. Directory tree structure updated.`, 3, [], 'none', {
      tree: treeClone
    });
  } else if (action === 'rename') {
    const targetId = params.targetId || 'resume';
    const target = findNodeById(treeClone, targetId);
    if (target) {
      const oldName = target.name;
      const newName = params.name || 'portfolio_v2.pdf';
      yield S(`Locating "${oldName}" in directory tree...`, 0, [target.id], 'cmp', {
        tree: treeClone,
        activeNodeId: target.id
      });
      target.name = newName;
      doneSet.add(target.id);
      yield S(`Renamed node "${oldName}" → "${newName}".`, 2, [target.id], 'swap', {
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
      yield S(`Locating "${source.name}" in directory tree...`, 0, sourcePath, 'cmp', {
        tree: treeClone,
        activePath: sourcePath,
        activeNodeId: source.id
      });

      if (source.parentId) {
        const oldParent = findNodeById(treeClone, source.parentId);
        if (oldParent) {
          oldParent.children = oldParent.children.filter(c => c.id !== source.id);
        }
      }

      source.parentId = dest.id;
      dest.children.push(source);
      doneSet.add(source.id);

      const newPath = getPathToNode(treeClone, source.id);
      yield S(`Moved "${source.name}" into directory "${dest.name}". Pointers updated!`, 3, [dest.id, source.id], 'swap', {
        tree: treeClone,
        activePath: newPath,
        activeNodeId: source.id
      });
    }
  }
}
