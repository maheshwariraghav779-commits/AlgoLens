import React, { useRef, useEffect, useState } from 'react';
import { Step } from '../../engine/types';
import { DSA_ALGORITHMS, ArrayItem } from './generators/sortGenerators';
import { DSAAnalyserStrip } from './DSAAnalyserStrip';
import { CompareAlgorithmsModal } from './CompareAlgorithmsModal';

interface DSAModuleProps {
  currentAlgo: keyof typeof DSA_ALGORITHMS;
  onSelectAlgo: (key: keyof typeof DSA_ALGORITHMS) => void;
  baseArray: number[];
  items: ArrayItem[];
  currentStep?: Step;
  stepIndex: number;
  totalSteps: number;
}

export const DSAModule: React.FC<DSAModuleProps> = ({
  currentAlgo,
  onSelectAlgo,
  baseArray,
  items,
  currentStep,
  stepIndex,
  totalSteps
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(600);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (stageRef.current) {
        setStageWidth(stageRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const maxValue = Math.max(...baseArray, 1);
  const n = items.length;
  const slotWidth = n > 0 ? stageWidth / n : 40;
  const barWidth = Math.max(10, slotWidth - 8);

  const order = currentStep?.order || items.map(x => x.id);
  const highlighted = currentStep?.highlighted || [];
  const done = currentStep?.done || [];
  const kind = currentStep?.kind || 'none';

  // Map item IDs to values
  const itemMap = new Map<string, number>();
  items.forEach(it => itemMap.set(it.id, it.v));

  const algoMeta = DSA_ALGORITHMS[currentAlgo];

  return (
    <div>
      {/* Algorithm Tabs */}
      <div className="tabs">
        {(Object.keys(DSA_ALGORITHMS) as Array<keyof typeof DSA_ALGORITHMS>).map(key => {
          const algo = DSA_ALGORITHMS[key];
          return (
            <button
              key={key}
              className={`tab ${currentAlgo === key ? 'on' : ''}`}
              onClick={() => onSelectAlgo(key)}
            >
              {algo.name}
            </button>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <b>{algoMeta.name}</b>
          </div>
          <div className="pills">
            <span className="pill purple">{algoMeta.timeComplexity}</span>
            <span className="pill orange">{algoMeta.spaceComplexity}</span>
          </div>
        </div>

        {/* Animated Bar Stage */}
        <div id="stage" ref={stageRef}>
          {order.map((id, index) => {
            const val = itemMap.get(id) || 10;
            const isHi = highlighted.includes(id);
            const isDone = done.includes(id);

            let barClass = 'bar';
            if (isHi) {
              if (kind === 'compare') barClass += ' cmp';
              else if (kind === 'swap') barClass += ' swap';
              else if (kind === 'visit') barClass += ' cmp';
              else barClass += ' cmp';
            } else if (isDone) {
              barClass += ' done';
            }

            const barHeight = Math.max(28, (val / maxValue) * (300 - 36));
            const x = index * slotWidth + 4;
            const y = isHi ? -16 : 0;

            return (
              <div
                key={id}
                className={barClass}
                style={{
                  width: `${barWidth}px`,
                  height: `${barHeight}px`,
                  transform: `translate(${x}px, ${y}px)`
                }}
              >
                <span>{val}</span>
                <span className="bar-index">[{index}]</span>
              </div>
            );
          })}
        </div>

        {/* Analyser strip */}
        <DSAAnalyserStrip
          currentAlgoKey={currentAlgo}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          currentStep={currentStep}
          onOpenCompare={() => setIsCompareOpen(true)}
        />
      </div>

      {isCompareOpen && (
        <CompareAlgorithmsModal
          baseArray={baseArray}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  );
};
