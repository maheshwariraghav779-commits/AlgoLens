/**
 * Playback controller for step generators
 */
export class PlaybackController {
  constructor(steps = [], onStepChange = () => {}) {
    this.steps = steps;
    this.onStepChange = onStepChange;
    this.index = 0;
    this.isPlaying = false;
    this.speed = 3;
    this.timer = null;
  }

  setSteps(steps) {
    this.pause();
    this.steps = steps;
    this.index = 0;
    this.notify();
  }

  getCurrentStep() {
    return this.steps[this.index] || null;
  }

  notify() {
    this.onStepChange({
      index: this.index,
      step: this.getCurrentStep(),
      total: this.steps.length,
      isPlaying: this.isPlaying,
      speed: this.speed
    });
  }

  play() {
    if (this.steps.length === 0) return;
    if (this.index >= this.steps.length - 1) {
      this.index = 0;
    }
    this.isPlaying = true;
    this.notify();

    clearInterval(this.timer);
    const interval = Math.max(80, Math.round(1500 / this.speed));
    this.timer = setInterval(() => {
      if (this.index >= this.steps.length - 1) {
        this.pause();
      } else {
        this.index++;
        this.notify();
      }
    }, interval);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.timer);
    this.timer = null;
    this.notify();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  stepNext() {
    this.pause();
    if (this.index < this.steps.length - 1) {
      this.index++;
      this.notify();
    }
  }

  stepPrev() {
    this.pause();
    if (this.index > 0) {
      this.index--;
      this.notify();
    }
  }

  jumpTo(idx) {
    this.pause();
    this.index = Math.max(0, Math.min(this.steps.length - 1, idx));
    this.notify();
  }

  setSpeed(val) {
    this.speed = Math.max(1, Math.min(8, val));
    if (this.isPlaying) {
      this.play(); // re-anchor interval
    } else {
      this.notify();
    }
  }
}
