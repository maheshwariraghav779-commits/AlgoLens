import { FSNode } from './types';

export function createInitialFSTree(): FSNode {
  return {
    id: 'root',
    name: '/',
    type: 'folder',
    size: 0,
    parentId: null,
    expanded: true,
    children: [
      {
        id: 'home',
        name: 'home',
        type: 'folder',
        size: 0,
        parentId: 'root',
        expanded: true,
        children: [
          {
            id: 'user',
            name: 'user',
            type: 'folder',
            size: 0,
            parentId: 'home',
            expanded: true,
            children: [
              {
                id: 'docs',
                name: 'docs',
                type: 'folder',
                size: 0,
                parentId: 'user',
                expanded: true,
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
                expanded: true,
                children: [
                  { id: 'algolens', name: 'algolens.ts', type: 'file', size: 85, parentId: 'projects', children: [] },
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
        expanded: true,
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
        expanded: true,
        children: [
          {
            id: 'log',
            name: 'log',
            type: 'folder',
            size: 0,
            parentId: 'var',
            expanded: true,
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
        expanded: false,
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

export function cloneTree(node: FSNode): FSNode {
  return {
    ...node,
    children: node.children.map(cloneTree)
  };
}

export function findNodeById(root: FSNode, id: string): FSNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function getPathToNode(root: FSNode, targetId: string): string[] {
  const path: string[] = [];
  function search(node: FSNode): boolean {
    path.push(node.id);
    if (node.id === targetId) return true;
    for (const child of node.children) {
      if (search(child)) return true;
    }
    path.pop();
    return false;
  }
  search(root);
  return path;
}

export function calculateTreeStats(root: FSNode) {
  let totalFiles = 0;
  let totalFolders = 0;
  let maxDepth = 0;
  let maxBranching = 0;

  function traverse(node: FSNode, depth: number) {
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
