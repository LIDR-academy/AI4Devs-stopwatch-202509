'use strict';

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;

function clampNumber(value, min, max) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return min;
  return Math.min(Math.max(number, min), max);
}

function parseDurationValues(hours, minutes, seconds) {
  const safeHours = clampNumber(hours, 0, 99);
  const safeMinutes = clampNumber(minutes, 0, 59);
  const safeSeconds = clampNumber(seconds, 0, 59);
  return (safeHours * MS_IN_HOUR) + (safeMinutes * MS_IN_MINUTE) + (safeSeconds * MS_IN_SECOND);
}

class TimeFormatter {
  static pad(value, size = 2) {
    return String(value).padStart(size, '0');
  }

  static format(milliseconds) {
    const safeMilliseconds = Math.max(0, Math.floor(milliseconds));
    const hours = Math.floor(safeMilliseconds / MS_IN_HOUR);
    const minutes = Math.floor((safeMilliseconds % MS_IN_HOUR) / MS_IN_MINUTE);
    const seconds = Math.floor((safeMilliseconds % MS_IN_MINUTE) / MS_IN_SECOND);
    const millis = safeMilliseconds % MS_IN_SECOND;

    return {
      main: `${TimeFormatter.pad(hours)}:${TimeFormatter.pad(minutes)}:${TimeFormatter.pad(seconds)}`,
      millis: TimeFormatter.pad(millis, 3),
    };
  }
}

class StopwatchEngine {
  constructor() {
    this.elapsedBeforeStart = 0;
    this.startedAt = 0;
    this.running = false;
  }

  start(now = performance.now()) {
    if (this.running) return;
    this.startedAt = now;
    this.running = true;
  }

  pause(now = performance.now()) {
    if (!this.running) return;
    this.elapsedBeforeStart += now - this.startedAt;
    this.running = false;
  }

  reset() {
    this.elapsedBeforeStart = 0;
    this.startedAt = 0;
    this.running = false;
  }

  getElapsed(now = performance.now()) {
    if (!this.running) return this.elapsedBeforeStart;
    return this.elapsedBeforeStart + now - this.startedAt;
  }
}

class CountdownEngine {
  constructor(duration = 0) {
    this.duration = Math.max(0, duration);
    this.remainingBeforeStart = this.duration;
    this.startedAt = 0;
    this.running = false;
  }

  setDuration(duration) {
    if (this.running) return;
    this.duration = Math.max(0, duration);
    this.remainingBeforeStart = this.duration;
  }

  start(now = performance.now()) {
    if (this.running || this.remainingBeforeStart <= 0) return;
    this.startedAt = now;
    this.running = true;
  }

  pause(now = performance.now()) {
    if (!this.running) return;
    this.remainingBeforeStart = this.getRemaining(now);
    this.running = false;
  }

  reset() {
    this.remainingBeforeStart = this.duration;
    this.startedAt = 0;
    this.running = false;
  }

  getRemaining(now = performance.now()) {
    if (!this.running) return this.remainingBeforeStart;
    return Math.max(0, this.remainingBeforeStart - (now - this.startedAt));
  }

  hasFinished(now = performance.now()) {
    return this.running && this.getRemaining(now) <= 0;
  }
}

class TimerApp {
  constructor(root = document) {
    this.root = root;
    this.mode = 'stopwatch';
    this.stopwatch = new StopwatchEngine();
    this.countdown = new CountdownEngine(MS_IN_MINUTE);
    this.frameId = null;

    this.elements = {
      mainTime: root.getElementById('mainTime'),
      milliseconds: root.getElementById('milliseconds'),
      startButton: root.getElementById('startButton'),
      clearButton: root.getElementById('clearButton'),
      status: root.getElementById('status'),
      stopwatchMode: root.getElementById('stopwatchMode'),
      countdownMode: root.getElementById('countdownMode'),
      countdownForm: root.getElementById('countdownForm'),
      hoursInput: root.getElementById('hoursInput'),
      minutesInput: root.getElementById('minutesInput'),
      secondsInput: root.getElementById('secondsInput'),
    };
  }

  init() {
    this.elements.startButton.addEventListener('click', () => this.toggleStartPause());
    this.elements.clearButton.addEventListener('click', () => this.clear());
    this.elements.stopwatchMode.addEventListener('click', () => this.setMode('stopwatch'));
    this.elements.countdownMode.addEventListener('click', () => this.setMode('countdown'));

    [this.elements.hoursInput, this.elements.minutesInput, this.elements.secondsInput]
      .forEach((input) => input.addEventListener('input', () => this.updateCountdownFromInputs()));

    this.render();
  }

  setMode(nextMode) {
    if (this.mode === nextMode) return;
    this.stopwatch.reset();
    this.countdown.reset();
    this.stopAnimation();
    this.mode = nextMode;

    const isCountdown = nextMode === 'countdown';
    this.elements.countdownForm.classList.toggle('hidden', !isCountdown);
    this.elements.stopwatchMode.classList.toggle('active', !isCountdown);
    this.elements.countdownMode.classList.toggle('active', isCountdown);
    this.elements.stopwatchMode.setAttribute('aria-selected', String(!isCountdown));
    this.elements.countdownMode.setAttribute('aria-selected', String(isCountdown));
    this.elements.startButton.textContent = 'Start';
    this.elements.status.textContent = 'Ready.';

    if (isCountdown) this.updateCountdownFromInputs();
    this.render();
  }

  updateCountdownFromInputs() {
    if (this.countdown.running) return;
    const duration = parseDurationValues(
      this.elements.hoursInput.value,
      this.elements.minutesInput.value,
      this.elements.secondsInput.value,
    );
    this.countdown.setDuration(duration);
    if (this.mode === 'countdown') this.render();
  }

  toggleStartPause() {
    if (this.mode === 'stopwatch') {
      this.toggleStopwatch();
      return;
    }
    this.toggleCountdown();
  }

  toggleStopwatch() {
    if (this.stopwatch.running) {
      this.stopwatch.pause();
      this.elements.startButton.textContent = 'Resume';
      this.elements.status.textContent = 'Paused.';
      this.stopAnimation();
      this.render();
      return;
    }

    this.stopwatch.start();
    this.elements.startButton.textContent = 'Pause';
    this.elements.status.textContent = 'Running.';
    this.startAnimation();
  }

  toggleCountdown() {
    this.updateCountdownFromInputs();

    if (this.countdown.running) {
      this.countdown.pause();
      this.elements.startButton.textContent = 'Resume';
      this.elements.status.textContent = 'Paused.';
      this.stopAnimation();
      this.render();
      return;
    }

    if (this.countdown.getRemaining() <= 0) {
      this.elements.status.textContent = 'Set a time greater than zero.';
      return;
    }

    this.countdown.start();
    this.elements.startButton.textContent = 'Pause';
    this.elements.status.textContent = 'Counting down.';
    this.startAnimation();
  }

  clear() {
    this.stopAnimation();
    this.stopwatch.reset();
    this.updateCountdownFromInputs();
    this.countdown.reset();
    this.elements.startButton.textContent = 'Start';
    this.elements.status.textContent = 'Ready.';
    this.render();
  }

  getCurrentMilliseconds() {
    if (this.mode === 'countdown') return this.countdown.getRemaining();
    return this.stopwatch.getElapsed();
  }

  render() {
    const time = TimeFormatter.format(this.getCurrentMilliseconds());
    this.elements.mainTime.textContent = time.main;
    this.elements.milliseconds.textContent = time.millis;
  }

  startAnimation() {
    if (this.frameId !== null) return;

    const tick = () => {
      if (this.mode === 'countdown' && this.countdown.hasFinished()) {
        this.countdown.pause();
        this.elements.startButton.textContent = 'Start';
        this.elements.status.textContent = 'Time is up.';
        this.frameId = null;
        this.render();
        return;
      }

      this.render();
      this.frameId = requestAnimationFrame(tick);
    };

    this.frameId = requestAnimationFrame(tick);
  }

  stopAnimation() {
    if (this.frameId === null) return;
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }
}

if (typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const app = new TimerApp(document);
    app.init();
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    CountdownEngine,
    StopwatchEngine,
    TimeFormatter,
    clampNumber,
    parseDurationValues,
    MS_IN_SECOND,
    MS_IN_MINUTE,
    MS_IN_HOUR,
  };
}
