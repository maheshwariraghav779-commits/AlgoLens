import React, { useState } from 'react';
import { FSNode } from './types';
import { Step } from '../../engine/types';

interface SidebarTreeViewProps {
  tree: FSNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  currentStep?: Step;
  onMoveNode?: (sourceId: string, destFolderId: string) => void;
}

export const SidebarTreeView: React.FC<SidebarTreeViewProps> = ({
  tree,
  selectedNodeId,
  onSelectNode,
  currentStep,
  onMoveNode
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeHighlighted = currentStep?.highlighted || [];
  const doneNodes = currentStep?.done || [];

  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    e.dataTransfer.setData('text/plain', nodeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId && sourceId !== targetFolderId && onMoveNode) {
      onMoveNode(sourceId, targetFolderId);
    }
  };

  const renderNode = (node: FSNode, depth: number = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = !collapsed[node.id];
    const isSelected = selectedNodeId === node.id;
    const isHighlighted = activeHighlighted.includes(node.id);
    const isDone = doneNodes.includes(node.id);

    return (
      <div key={node.id} style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          className={`sidebar-node ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${isDone ? 'done' : ''}`}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
          onClick={() => onSelectNode(node.id)}
          draggable={node.id !== 'root'}
          onDragStart={e => handleDragStart(e, node.id)}
          onDragOver={isFolder ? handleDragOver : undefined}
          onDrop={isFolder ? e => handleDrop(e, node.id) : undefined}
        >
          {isFolder ? (
            <span
              onClick={e => toggleCollapse(node.id, e)}
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                width: 14,
                textAlign: 'center',
                fontSize: 10,
                color: 'var(--mute)'
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          ) : (
            <span style={{ display: 'inline-block', width: 14 }} />
          )}

          <span className="sidebar-icon">{isFolder ? '📁' : '📄'}</span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.name}
          </span>
          <span style={{ fontSize: '10.5px', color: 'var(--mute)' }}>
            {node.size > 0 ? `${node.size}K` : ''}
          </span>
        </div>

        {isFolder && isExpanded && node.children.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="fs-sidebar" title="Directory Tree (Drag & Drop files into folders to move)">
      <div style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--mute)', textTransform: 'uppercase' }}>
        Hierarchy Explorer
      </div>
      {renderNode(tree, 0)}
    </div>
  );
};
