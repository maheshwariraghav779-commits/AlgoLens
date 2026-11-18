import React, { useState } from 'react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepPrev: () => void;
  onStepNext: () => void;
  stepIndex: number;
  totalSteps: number;
  onScrub: (index: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  // Custom array props (optional for DSA)
  showArrayControls?: boolean;
  onSetCustomArray?: (arr: number[]) => void;
  onShuffleArray?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onStepPrev,
  onStepNext,
  stepIndex,
  totalSteps,
  onScrub,
  speed,
  onSpeedChange,
  showArrayControls = false,
  onSetCustomArray,
  onShuffleArray
}) => {
  const [customInput, setCustomInput] = useState('');

  const handleApplyArray = () => {
    if (!onSetCustomArray) return;
    const nums = customInput
      .split(/[ ,]+/)
      .map(Number)
      .filter(x => !isNaN(x) && x > 0 && x <= 99)
      .slice(0, 14);

    if (nums.length >= 2) {
      onSetCustomArray(nums);
      setCustomInput('');
    } else {
      alert('Please enter between 2 and 14 numbers from 1 to 99 separated by commas or spaces.');
    }
  };

  return (
    <div style={{ marginTop: '14px' }}>
      {/* Primary Playback Bar */}
      <div className="ctrl">
        <button
          className="btn"
          onClick={onStepPrev}
          disabled={stepIndex <= 0}
          title="Step back (Left Arrow)"
          aria-label="Step back"
        >
          ◀
        </button>

        <button
          className="btn p"
          onClick={onTogglePlay}
          title="Play / Pause (Space)"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          className="btn"
          onClick={onStepNext}
          disabled={stepIndex >= totalSteps - 1}
          title="Step forward (Right Arrow)"
          aria-label="Step forward"
        >
          ▶|
        </button>

        <input
          type="range"
          id="scrub"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={stepIndex}
          onChange={e => onScrub(Number(e.target.value))}
          aria-label="Step scrubber"
        />

        <label>
          Speed
          <input
            type="range"
            min={1}
            max={8}
            value={speed}
            onChange={e => onSpeedChange(Number(e.target.value))}
            aria-label="Playback speed"
            style={{ width: '80px' }}
          />
          <span style={{ fontSize: '11px', fontWeight: 600, minWidth: '16px' }}>{speed}x</span>
        </label>
      </div>

      {/* Array Input Controls (for DSA module) */}
      {showArrayControls && (
        <div className="ctrl" style={{ marginTop: '12px' }}>
          <input
            type="text"
            className="input-text"
            placeholder="e.g. 34, 12, 27, 8, 41"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleApplyArray();
            }}
            aria-label="Custom array numbers"
          />
          <button className="btn" onClick={handleApplyArray}>
            Use array
          </button>
          <button className="btn" onClick={onShuffleArray}>
            🎲 Shuffle
          </button>
        </div>
      )}
    </div>
  );
};
