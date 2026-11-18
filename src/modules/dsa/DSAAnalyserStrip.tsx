import React from 'react';
import { Step } from '../../engine/types';
import { DSA_ALGORITHMS } from './generators/sortGenerators';

interface DSAAnalyserStripProps {
  currentAlgoKey: keyof typeof DSA_ALGORITHMS;
  stepIndex: number;
  totalSteps: number;
  currentStep?: Step;
  onOpenCompare: () => void;
}

export const DSAAnalyserStrip: React.FC<DSAAnalyserStripProps> = ({
  currentAlgoKey,
  stepIndex,
  totalSteps,
  currentStep,
  onOpenCompare
}) => {
  const algo = DSA_ALGORITHMS[currentAlgoKey];

  return (
    <div style={{ marginTop: '16px' }}>
      <div className="card-header" style={{ marginBottom: '6px' }}>
        <div className="lbl" style={{ margin: 0 }}>📊 Performance Analyser & Metrics</div>
        <button className="btn sm p" onClick={onOpenCompare}>
          ⚡ Compare All Algorithms
        </button>
      </div>

      <div className="analyser-strip">
        <div className="analyser-stat">
          <span className="analyser-stat-label">Comparisons</span>
          <span className="analyser-stat-val" style={{ color: 'var(--cmp)' }}>
            {currentStep?.comparisons ?? 0}
          </span>
        </div>
        <div className="analyser-stat">
          <span className="analyser-stat-label">Swaps / Moves</span>
          <span className="analyser-stat-val" style={{ color: 'var(--swap)' }}>
            {currentStep?.swaps ?? 0}
          </span>
        </div>
        <div className="analyser-stat">
          <span className="analyser-stat-label">Step Progress</span>
          <span className="analyser-stat-val" style={{ color: 'var(--acc)' }}>
            {stepIndex} / {totalSteps > 0 ? totalSteps - 1 : 0}
          </span>
        </div>
        <div className="analyser-stat">
          <span className="analyser-stat-label">Time Complexity</span>
          <span className="analyser-stat-val" style={{ fontSize: '15px' }}>
            {algo.timeComplexity.replace('Time ', '')}
          </span>
        </div>
        <div className="analyser-stat">
          <span className="analyser-stat-label">Space Complexity</span>
          <span className="analyser-stat-val" style={{ fontSize: '15px' }}>
            {algo.spaceComplexity.replace('Space ', '')}
          </span>
        </div>
      </div>

      <table className="complexity-table">
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Time Complexity</th>
            <th>Space Complexity</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Best Case</b></td>
            <td><code>{algo.bestCase}</code></td>
            <td><code>{algo.spaceComplexity.replace('Space ', '')}</code></td>
            <td>Pre-sorted or ideal pivot partitions</td>
          </tr>
          <tr>
            <td><b>Average Case</b></td>
            <td><code>{algo.averageCase}</code></td>
            <td><code>{algo.spaceComplexity.replace('Space ', '')}</code></td>
            <td>Random distribution of elements</td>
          </tr>
          <tr>
            <td><b>Worst Case</b></td>
            <td><code>{algo.worstCase}</code></td>
            <td><code>{algo.spaceComplexity.replace('Space ', '')}</code></td>
            <td>Reverse sorted or degenerate partitions</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
