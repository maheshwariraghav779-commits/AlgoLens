import React from 'react';
import { FSNode } from './types';
import { calculateTreeStats } from './initialTree';

interface FileSystemAnalysisPanelProps {
  tree: FSNode;
  activeOperationName: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export const FileSystemAnalysisPanel: React.FC<FileSystemAnalysisPanelProps> = ({
  tree,
  activeOperationName,
  timeComplexity,
  spaceComplexity
}) => {
  const stats = calculateTreeStats(tree);

  return (
    <div className="card" style={{ marginTop: '16px' }}>
      <div className="card-header">
        <div className="card-title">
          <span>🌳 Tree Properties & Structural Metrics</span>
        </div>
        <div className="pills">
          <span className="pill purple">{timeComplexity}</span>
          <span className="pill orange">{spaceComplexity}</span>
        </div>
      </div>

      <div className="analyser-strip">
        <div className="analyser-stat">
          <span className="analyser-stat-label">Total Files</span>
          <span className="analyser-stat-val" style={{ color: 'var(--acc)' }}>
            {stats.totalFiles}
          </span>
        </div>
        <div className="analyser-stat">
          <span className="analyser-stat-label">Total Directories</span>
          <span className="analyser-stat-val">
            {stats.totalFolders}
          </span>
        </div>
        <div className="analyser-stat">
          <span className="analyser-stat-label">Tree Max Depth (H)</span>
          <span className="analyser-stat-val">
            {stats.maxDepth}
          </span>
        </div>
        <div className="analyser-stat">
          <span className="analyser-stat-label">Max Branching Factor</span>
          <span className="analyser-stat-val">
            {stats.maxBranching}
          </span>
        </div>
        <div className="analyser-stat">
          <span className="analyser-stat-label">Current Op</span>
          <span className="analyser-stat-val" style={{ fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {activeOperationName}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--mute)', lineHeight: 1.6 }}>
        💡 <b>File System Note:</b> A realistic operating system file hierarchy is a <i>General Multi-Way Tree</i> where each directory node holds an arbitrary list of child nodes (subdirectories and leaf files). Post-order traversal guarantees all children are processed before computing parent storage sizes or deleting folders safely.
      </div>
    </div>
  );
};
