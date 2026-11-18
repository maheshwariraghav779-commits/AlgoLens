import React, { useState } from 'react';
import { FSNode, FSTraversalType } from './types';
import { TreeDiagram } from './TreeDiagram';
import { SidebarTreeView } from './SidebarTreeView';
import { FileSystemAnalysisPanel } from './FileSystemAnalysisPanel';
import { FS_OPERATIONS } from './generators/treeGenerators';
import { Step } from '../../engine/types';

interface FileSystemModuleProps {
  tree: FSNode;
  currentStep?: Step;
  activeOp: FSTraversalType;
  onSelectOp: (op: FSTraversalType) => void;
  onPerformAction: (action: 'create-file' | 'create-folder' | 'rename' | 'delete' | 'move', params: any) => void;
  onResetTree: () => void;
}

export const FileSystemModule: React.FC<FileSystemModuleProps> = ({
  tree,
  currentStep,
  activeOp,
  onSelectOp,
  onPerformAction,
  onResetTree
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('user');
  const [viewMode, setViewMode] = useState<'general' | 'binary' | 'trie'>('general');
  const [showNewModal, setShowNewModal] = useState<'file' | 'folder' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemSize, setNewItemSize] = useState('25');

  const currentOpMeta = (FS_OPERATIONS as any)[activeOp] || {
    name: 'File System Operation',
    timeComplexity: 'Time O(N)',
    spaceComplexity: 'Space O(H)'
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onPerformAction(showNewModal === 'folder' ? 'create-folder' : 'create-file', {
      parentId: selectedNodeId || 'root',
      name: newItemName.trim(),
      size: parseInt(newItemSize, 10) || 10
    });
    setShowNewModal(null);
    setNewItemName('');
  };

  const handleDelete = () => {
    if (!selectedNodeId || selectedNodeId === 'root') {
      alert('Cannot delete root directory!');
      return;
    }
    onPerformAction('delete', { targetId: selectedNodeId });
  };

  const handleRename = () => {
    if (!selectedNodeId) return;
    const newName = prompt('Enter new name:');
    if (newName && newName.trim()) {
      onPerformAction('rename', { targetId: selectedNodeId, name: newName.trim() });
    }
  };

  const handleMove = (sourceId: string, destFolderId: string) => {
    onPerformAction('move', { targetId: sourceId, destinationId: destFolderId });
  };

  return (
    <div>
      {/* Traversal Tabs */}
      <div className="tabs">
        {(Object.keys(FS_OPERATIONS) as FSTraversalType[]).map(opKey => {
          const op = (FS_OPERATIONS as any)[opKey];
          return (
            <button
              key={opKey}
              className={`tab ${activeOp === opKey ? 'on' : ''}`}
              onClick={() => onSelectOp(opKey)}
            >
              {op.name}
            </button>
          );
        })}
      </div>

      <div className="card">
        {/* Card Header with View Switcher & Action Toolbar */}
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '16px' }}>📁 UNIX File System Tree</span>
            {/* View Mode Pills */}
            <div className="module-switcher" style={{ marginLeft: 6 }}>
              <button
                className={`module-btn ${viewMode === 'general' ? 'active' : ''}`}
                onClick={() => setViewMode('general')}
              >
                General Tree
              </button>
              <button
                className={`module-btn ${viewMode === 'binary' ? 'active' : ''}`}
                onClick={() => setViewMode('binary')}
                title="First-Child Next-Sibling representation"
              >
                LCRS Binary Tree
              </button>
              <button
                className={`module-btn ${viewMode === 'trie' ? 'active' : ''}`}
                onClick={() => setViewMode('trie')}
                title="Trie Path Lookup representation"
              >
                Trie View
              </button>
            </div>
          </div>

          {/* Quick FS action buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button className="btn sm" onClick={() => setShowNewModal('file')}>
              + New File
            </button>
            <button className="btn sm" onClick={() => setShowNewModal('folder')}>
              + New Folder
            </button>
            <button className="btn sm" onClick={handleRename}>
              ✏️ Rename
            </button>
            <button className="btn sm danger" onClick={handleDelete}>
              🗑️ Delete
            </button>
            <button className="btn sm" onClick={onResetTree} title="Reset to default tree">
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Dual Synchronized Stage: Sidebar Tree + SVG Tree Diagram */}
        <div className="fs-container">
          <SidebarTreeView
            tree={tree}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            currentStep={currentStep}
            onMoveNode={handleMove}
          />

          <TreeDiagram
            tree={tree}
            currentStep={currentStep}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            viewMode={viewMode}
          />
        </div>

        {/* File System Analysis Panel */}
        <FileSystemAnalysisPanel
          tree={tree}
          activeOperationName={currentOpMeta.name}
          timeComplexity={currentOpMeta.timeComplexity}
          spaceComplexity={currentOpMeta.spaceComplexity}
        />
      </div>

      {/* New File / Folder Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(null)}>
          <div className="modal-content" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px' }}>
              Create New {showNewModal === 'folder' ? 'Folder' : 'File'}
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label className="lbl">Parent Directory</label>
                <input
                  type="text"
                  className="input-text"
                  style={{ width: '100%' }}
                  value={selectedNodeId || 'root'}
                  readOnly
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label className="lbl">Name</label>
                <input
                  type="text"
                  className="input-text"
                  style={{ width: '100%' }}
                  placeholder={showNewModal === 'folder' ? 'e.g. backup' : 'e.g. main.py'}
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  autoFocus
                />
              </div>
              {showNewModal === 'file' && (
                <div style={{ marginBottom: '16px' }}>
                  <label className="lbl">Size (KB)</label>
                  <input
                    type="number"
                    className="input-text"
                    style={{ width: '100%' }}
                    min="1"
                    max="10000"
                    value={newItemSize}
                    onChange={e => setNewItemSize(e.target.value)}
                  />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn" onClick={() => setShowNewModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn p">
                  Create Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
