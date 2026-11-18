export type FSNodeType = 'folder' | 'file';

export interface FSNode {
  id: string;
  name: string;
  type: FSNodeType;
  size: number; // in KB
  parentId: string | null;
  children: FSNode[];
  expanded?: boolean;
}

export type FSTraversalType =
  | 'dfs-pre'
  | 'dfs-post'
  | 'dfs-in'
  | 'bfs'
  | 'find-path'
  | 'compute-size'
  | 'create-file'
  | 'create-folder'
  | 'rename'
  | 'delete'
  | 'move';

export interface TreeLayoutNode {
  node: FSNode;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
}
