import React, { useMemo } from 'react';
import { DSA_ALGORITHMS, ArrayItem } from './generators/sortGenerators';
import { Step } from '../../engine/types';

interface CompareAlgorithmsModalProps {
  baseArray: number[];
  onClose: () => void;
}

interface BenchmarkResult {
  id: string;
  name: string;
  timeComplexity: string;
  comparisons: number;
  swaps: number;
  totalSteps: number;
}

export const CompareAlgorithmsModal: React.FC<CompareAlgorithmsModalProps> = ({
  baseArray,
  onClose
}) => {
  const results: BenchmarkResult[] = useMemo(() => {
    const algosToBenchmark = ['bubble', 'selection', 'insertion', 'merge', 'quick'] as const;

    return algosToBenchmark.map(key => {
      const algo = DSA_ALGORITHMS[key];
      let seq = 0;
      const A: ArrayItem[] = baseArray.map(v => ({ id: `item_${seq++}`, v }));
      const done = new Set<string>();

      let comparisons = 0;
      let swaps = 0;
      let stepCount = 0;

      const S = (
        text: string,
        line: number,
        highlightedIndices: number[],
        kind: string
      ): Step => {
        if (kind === 'compare') comparisons++;
        if (kind === 'swap') swaps++;
        stepCount++;
        return {
          order: A.map(x => x.id),
          highlighted: highlightedIndices.map(i => A[i]?.id).filter(Boolean),
          kind: kind as any,
          done: Array.from(done),
          text,
          line,
          comparisons,
          swaps
        };
      };

      // Run generator to completion
      const gen = algo.generate(A, S, done);
      let res = gen.next();
      while (!res.done) {
        res = gen.next();
      }

      return {
        id: algo.id,
        name: algo.name,
        timeComplexity: algo.timeComplexity.replace('Time ', ''),
        comparisons,
        swaps,
        totalSteps: stepCount
      };
    });
  }, [baseArray]);

  const maxComparisons = Math.max(...results.map(r => r.comparisons), 1);
  const maxSwaps = Math.max(...results.map(r => r.swaps), 1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 700 }}>
              ⚡ Algorithm Benchmark & Comparison
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--mute)', marginTop: '4px' }}>
              Simulated simultaneously on array: <code>[{baseArray.join(', ')}]</code> ({baseArray.length} items)
            </div>
          </div>
          <button className="btn" onClick={onClose} style={{ padding: '4px 10px', fontSize: '13px' }}>
            ✕ Close
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--cmp)' }} />
            <span>Comparisons</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--swap)' }} />
            <span>Swaps / Moves</span>
          </div>
        </div>

        <div>
          {results.map(res => (
            <div key={res.id} className="compare-chart-row">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 600 }}>
                <span>{res.name} <span className="pill purple" style={{ marginLeft: 6 }}>{res.timeComplexity}</span></span>
                <span style={{ color: 'var(--mute)', fontSize: '12.5px' }}>
                  {res.comparisons} compares • {res.swaps} swaps
                </span>
              </div>

              {/* Comparisons bar */}
              <div className="compare-bar-track">
                <div
                  className="compare-bar-fill"
                  style={{
                    width: `${Math.max((res.comparisons / maxComparisons) * 100, 6)}%`,
                    background: 'var(--cmp)'
                  }}
                >
                  {res.comparisons}
                </div>
              </div>

              {/* Swaps bar */}
              <div className="compare-bar-track" style={{ marginTop: 3 }}>
                <div
                  className="compare-bar-fill"
                  style={{
                    width: `${Math.max((res.swaps / maxSwaps) * 100, 6)}%`,
                    background: 'var(--swap)'
                  }}
                >
                  {res.swaps}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg)', borderRadius: '12px', fontSize: '13px', color: 'var(--mute)', lineHeight: 1.6 }}>
          💡 <b>Analysis:</b> Notice how <b>Merge Sort</b> and <b>Quick Sort</b> scale logarithmically with dramatically fewer comparisons on larger datasets compared to O(n²) Bubble Sort. Quick Sort minimizes swaps in-place, whereas Merge Sort ensures consistent O(n log n) bounds.
        </div>
      </div>
    </div>
  );
};
