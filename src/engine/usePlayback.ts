import { useState, useEffect, useRef, useCallback } from 'react';
import { Step } from './types';

export function usePlayback(steps: Step[]) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const jumpTo = useCallback((index: number) => {
    pause();
    const clamped = Math.max(0, Math.min(steps.length - 1, index));
    setStepIndex(clamped);
  }, [steps.length, pause]);

  const stepNext = useCallback(() => {
    pause();
    setStepIndex(prev => {
      const next = prev + 1;
      return next < steps.length ? next : prev;
    });
  }, [steps.length, pause]);

  const stepPrev = useCallback(() => {
    pause();
    setStepIndex(prev => Math.max(0, prev - 1));
  }, [pause]);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    setIsPlaying(true);
    setStepIndex(prev => (prev >= steps.length - 1 ? 0 : prev));
  }, [steps.length]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Handle Playback Interval
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const interval = Math.max(100, Math.round(1500 / speed));
    timerRef.current = setInterval(() => {
      setStepIndex(curr => {
        if (curr >= steps.length - 1) {
          pause();
          return curr;
        }
        return curr + 1;
      });
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, speed, steps.length, pause]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepNext, stepPrev, togglePlay]);

  return {
    stepIndex,
    setStepIndex,
    currentStep: steps[stepIndex],
    totalSteps: steps.length,
    isPlaying,
    play,
    pause,
    togglePlay,
    stepNext,
    stepPrev,
    jumpTo,
    speed,
    setSpeed
  };
}
