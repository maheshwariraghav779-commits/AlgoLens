import React, { useRef, useEffect } from 'react';

interface PseudocodeCardProps {
  code: string[];
  activeLine: number;
}

export const PseudocodeCard: React.FC<PseudocodeCardProps> = ({
  code,
  activeLine
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeLine >= 0 && containerRef.current) {
      const activeEl = containerRef.current.children[activeLine] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeLine]);

  return (
    <div className="card">
      <div className="lbl">Pseudocode</div>
      <div className="code" ref={containerRef}>
        {code.map((lineText, idx) => {
          const isActive = idx === activeLine;
          return (
            <div
              key={idx}
              className={`code-line ${isActive ? 'on' : ''}`}
            >
              {lineText}
            </div>
          );
        })}
      </div>
    </div>
  );
};
