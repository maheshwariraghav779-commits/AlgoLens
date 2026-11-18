import React, { useMemo } from 'react';
import { FSNode } from './types';
import { Step } from '../../engine/types';

interface TreeDiagramProps {
  tree: FSNode;
  currentStep?: Step;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  viewMode: 'general' | 'binary' | 'trie';
}

interface LayoutNode {
  node: FSNode;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  parentId: string | null;
  // Binary tree specific
  binaryRole?: 'left-child' | 'right-sibling';
}

interface LayoutEdge {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromId: string;
  toId: string;
  label?: string;
}

export const TreeDiagram: React.FC<TreeDiagramProps> = ({
  tree,
  currentStep,
  selectedNodeId,
  onSelectNode,
  viewMode
}) => {
  const { nodes, edges, width, height } = useMemo(() => {
    if (viewMode === 'binary') {
      return computeBinaryTreeLayout(tree);
    } else if (viewMode === 'trie') {
      return computeTrieLayout(tree);
    }
    return computeGeneralTreeLayout(tree);
  }, [tree, viewMode]);

  const activeHighlighted = currentStep?.highlighted || [];
  const activePath = currentStep?.meta?.activePath || [];
  const doneNodes = currentStep?.done || [];
  const stepKind = currentStep?.kind || 'none';
  const folderSizes = currentStep?.meta?.folderSizes || {};

  return (
    <div className="fs-tree-stage">
      <svg
        className="tree-svg"
        viewBox={`0 0 ${Math.max(width, 700)} ${Math.max(height, 360)}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="var(--cmp)" />
          </filter>
          <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="var(--swap)" />
          </filter>
          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--ok)" />
          </filter>
          <filter id="glow-acc" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="var(--acc)" />
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((e, idx) => {
          const isEdgeActive =
            activePath.includes(e.fromId) && activePath.includes(e.toId);
          return (
            <g key={`edge-${idx}`}>
              <path
                d={`M ${e.fromX} ${e.fromY} C ${e.fromX} ${(e.fromY + e.toY) / 2}, ${e.toX} ${(e.fromY + e.toY) / 2}, ${e.toX} ${e.toY}`}
                className={`tree-edge ${isEdgeActive ? 'active' : ''}`}
              />
              {e.label && (
                <text
                  x={(e.fromX + e.toX) / 2 + 6}
                  y={(e.fromY + e.toY) / 2 - 2}
                  fontSize="9"
                  fill="var(--mute)"
                  fontFamily="sans-serif"
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(ln => {
          const isHighlighted = activeHighlighted.includes(ln.node.id);
          const isDone = doneNodes.includes(ln.node.id);
          const isSelected = selectedNodeId === ln.node.id;
          const isInPath = activePath.includes(ln.node.id);

          let nodeClass = 'tree-node-group';
          if (isHighlighted) {
            if (stepKind === 'compare' || stepKind === 'visit') nodeClass += ' cmp';
            else if (stepKind === 'swap') nodeClass += ' swap';
            else if (stepKind === 'delete') nodeClass += ' delete';
            else if (stepKind === 'insert') nodeClass += ' insert';
          } else if (isDone) {
            nodeClass += ' done';
          } else if (isInPath) {
            nodeClass += ' insert';
          }

          const displaySize = folderSizes[ln.node.id] !== undefined
            ? folderSizes[ln.node.id]
            : ln.node.size;

          return (
            <g
              key={ln.node.id}
              className={nodeClass}
              transform={`translate(${ln.x - ln.width / 2}, ${ln.y})`}
              onClick={() => onSelectNode(ln.node.id)}
            >
              <rect
                className="tree-node-rect"
                width={ln.width}
                height={ln.height}
                rx={10}
                stroke={isSelected ? 'var(--acc)' : undefined}
                strokeWidth={isSelected ? 3 : undefined}
              />
              {/* Icon */}
              <text x={12} y={24} fontSize="14">
                {ln.node.type === 'folder' ? '📁' : '📄'}
              </text>
              {/* Name */}
              <text
                x={32}
                y={22}
                className="tree-node-text"
              >
                {ln.node.name.length > 11 ? ln.node.name.slice(0, 10) + '…' : ln.node.name}
              </text>
              {/* Size badge */}
              <text
                x={32}
                y={33}
                className="tree-node-size"
              >
                {displaySize > 0 ? `${displaySize} KB` : ln.node.type === 'folder' ? 'dir' : '0 KB'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// General multi-way Tree Layout
function computeGeneralTreeLayout(root: FSNode) {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  const nodeWidth = 105;
  const nodeHeight = 40;
  const levelHeight = 65;

  let currentLeafX = 40;

  function layoutSubtree(node: FSNode, depth: number, parentId: string | null): number {
    if (node.children.length === 0) {
      const x = currentLeafX + nodeWidth / 2;
      currentLeafX += nodeWidth + 14;
      const y = 30 + depth * levelHeight;
      nodes.push({ node, x, y, width: nodeWidth, height: nodeHeight, depth, parentId });
      return x;
    }

    const childXs: number[] = [];
    for (const child of node.children) {
      const cx = layoutSubtree(child, depth + 1, node.id);
      childXs.push(cx);
    }

    const myX = (childXs[0] + childXs[childXs.length - 1]) / 2;
    const myY = 30 + depth * levelHeight;
    nodes.push({ node, x: myX, y: myY, width: nodeWidth, height: nodeHeight, depth, parentId });

    for (let i = 0; i < node.children.length; i++) {
      const childX = childXs[i];
      const childY = 30 + (depth + 1) * levelHeight;
      edges.push({
        fromX: myX,
        fromY: myY + nodeHeight,
        toX: childX,
        toY: childY,
        fromId: node.id,
        toId: node.children[i].id
      });
    }

    return myX;
  }

  layoutSubtree(root, 0, null);

  const maxX = Math.max(...nodes.map(n => n.x + n.width / 2), 650);
  const maxY = Math.max(...nodes.map(n => n.y + n.height), 340);

  return { nodes, edges, width: maxX + 30, height: maxY + 30 };
}

// First-Child Next-Sibling (LCRS) Binary Representation
function computeBinaryTreeLayout(root: FSNode) {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  const nodeWidth = 98;
  const nodeHeight = 38;

  let globalCol = 0;

  function traverseLCRS(
    node: FSNode,
    siblings: FSNode[],
    siblingIndex: number,
    depth: number,
    parentId: string | null
  ) {
    const col = globalCol++;
    const x = 50 + col * 105;
    const y = 40 + depth * 55;

    nodes.push({
      node,
      x,
      y,
      width: nodeWidth,
      height: nodeHeight,
      depth,
      parentId
    });

    // First child = Left Child in binary tree
    if (node.children.length > 0) {
      const firstChild = node.children[0];
      const childIdx = globalCol;
      const toX = 50 + childIdx * 105;
      const toY = 40 + (depth + 1) * 55;
      edges.push({
        fromX: x,
        fromY: y + nodeHeight,
        toX,
        toY,
        fromId: node.id,
        toId: firstChild.id,
        label: 'first_child'
      });
      traverseLCRS(firstChild, node.children, 0, depth + 1, node.id);
    }

    // Next sibling = Right Child in binary tree
    if (siblings && siblingIndex + 1 < siblings.length) {
      const nextSibling = siblings[siblingIndex + 1];
      const sibIdx = globalCol;
      const toX = 50 + sibIdx * 105;
      const toY = 40 + depth * 55;
      edges.push({
        fromX: x + nodeWidth / 2,
        fromY: y + nodeHeight / 2,
        toX: toX - nodeWidth / 2,
        toY: toY + nodeHeight / 2,
        fromId: node.id,
        toId: nextSibling.id,
        label: 'next_sib'
      });
      traverseLCRS(nextSibling, siblings, siblingIndex + 1, depth, parentId);
    }
  }

  traverseLCRS(root, [], 0, 0, null);

  const maxX = Math.max(...nodes.map(n => n.x + n.width / 2), 650);
  const maxY = Math.max(...nodes.map(n => n.y + n.height), 340);

  return { nodes, edges, width: maxX + 40, height: maxY + 40 };
}

// Trie Path Prefix Representation
function computeTrieLayout(root: FSNode) {
  // Same as General tree but visualizing the path prefixes
  const res = computeGeneralTreeLayout(root);
  res.edges.forEach(e => {
    e.label = '/';
  });
  return res;
}
