/* 
  script.js
  - Timer logic separated from UI (single responsibility)
  - UI functions control DOM & call Timer methods
  - Clean, commented, small functions with predictable behavior
*/

/* -------------------------
   Timer class: encapsulates time-tracking logic
   - Can act as a stopwatch (count up) or countdown (count down from duration)
   - Uses high-resolution timestamps (performance.now) to compute elapsed accurately
------------------------- */
class Timer {
  /**
   * Create a Timer.
   * @param {Object} options - options: { mode: 'stopwatch'|'countdown', durationMs: Number }
   */
  constructor(options = {}) {
    this.mode = options.mode || 'stopwatch';
    this.durationMs = options.durationMs || 0; // for countdown only
    this.running = false;
    this._startTs = null;     // performance.now when started
    this._pauseOffset = 0;    // ms elapsed before pause (for stopwatch) OR ms counted down already (for countdown)
    this._onTick = null;      // callback to call each tick
  }

  /**
   * Set the mode of the timer.
   * @param {string} mode - 'stopwatch' or 'countdown'
   */
  setMode(mode){
    if (mode !== 'stopwatch' && mode !== 'countdown') throw new Error('Invalid mode');
    this.mode = mode;
    this.reset(); // reset when switching
  }

  /**
   * Set countdown duration in milliseconds.
   * @param {number} ms
   */
  setDuration(ms){
    if (!Number.isFinite(ms) || ms < 0) throw new Error('Duration must be non-negative number');
    this.durationMs = Math.floor(ms);
    this.reset();
  }

  /**
   * Register a tick callback with signature (remainingMs, elapsedMs) => void.
   * remainingMs: for countdown - ms remaining, for stopwatch - ms remaining is null.
   */
  onTick(cb){
    this._onTick = cb;
  }

  /**
   * Start the timer.
   */
  start(){
    if (this.running) return;
    this._startTs = performance.now();
    this.running = true;
  }

  /**
   * Pause the timer.
   */
  pause(){
    if (!this.running) return;
    const now = performance.now();
    const delta = now - this._startTs;
    this._pauseOffset += delta;
    this.running = false;
  }

  /**
   * Reset the timer.
   */
  reset(){
    this.running = false;
    this._startTs = null;
    this._pauseOffset = 0;
    if (this._onTick){
      if (this.mode === 'stopwatch') this._onTick(null, 0);
      else this._onTick(this.durationMs, null);
    }
  }

  /**
   * Compute current elapsed and remaining times.
   * @returns {{elapsedMs: number, remainingMs: number|null}}
   */
  _computeNow(){
    let elapsed = this._pauseOffset;
    if (this.running && this._startTs != null) {
      elapsed += (performance.now() - this._startTs);
    }
    if (this.mode === 'stopwatch') {
      return { elapsedMs: Math.max(0, Math.floor(elapsed)), remainingMs: null };
    } else {
      const rem = Math.max(0, Math.floor(this.durationMs - elapsed));
      return { elapsedMs: Math.min(this.durationMs, Math.floor(elapsed)), remainingMs: rem };
    }
  }

  /**
   * Internal tick - call registered callback if present
   */
  tick(){
    if (!this._onTick) return;
    const { elapsedMs, remainingMs } = this._computeNow();
    this._onTick(remainingMs, elapsedMs);
    return { elapsedMs, remainingMs };
  }

  /**
   * Whether timer has finished (only valid in countdown)
   * @returns {boolean}
   */
  isFinished(){
    if (this.mode !== 'countdown') return false;
    const { remainingMs } = this._computeNow();
    return remainingMs === 0 && !this.running;
  }
}

/* -------------------------
   Utility functions
------------------------- */

/** Format milliseconds into hh:mm:ss */
function formatHHMMSS(ms){
  if (!Number.isFinite(ms) || ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return [hours, minutes, seconds].map(n => String(n).padStart(2,'0')).join(':');
}

/** Safe parse number from input */
function safeInt(v, fallback=0){
  const n = Number(v);
  return Number.isFinite(n) && !Number.isNaN(n) ? Math.floor(n) : fallback;
}

/* -------------------------
   UI wiring & behavior
------------------------- */

const displayEl = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const switchBtn = document.getElementById('switch-mode');
const countdownForm = document.getElementById('countdown-form');
const inputHours = document.getElementById('hours');
const inputMinutes = document.getElementById('minutes');
const inputSeconds = document.getElementById('seconds');
const titleEl = document.querySelector('.title');
const alertEl = document.getElementById('alert');

let rafHandle = null; // requestAnimationFrame handle
let soundEnabled = true;

/* Create timer instance - default stopwatch */
const timer = new Timer({ mode: 'stopwatch' });

/** Ensure only one update loop runs at a time */
function startUpdateLoop(){
  if (rafHandle != null) return;
  function loop(){
    const result = timer.tick();
    if (timer.mode === 'stopwatch'){
      const elapsed = result.elapsedMs;
      updateDisplay(formatHHMMSS(elapsed));
      // enable/disable UI as needed
    } else {
      const remaining = result.remainingMs;
      updateDisplay(formatHHMMSS(remaining));
      // If countdown reached zero, stop and fire alarm
      if (remaining === 0){
        timer.pause();
        stopUpdateLoop();
        fireAlarm();
      }
    }
    rafHandle = requestAnimationFrame(loop);
  }
  rafHandle = requestAnimationFrame(loop);
}

function stopUpdateLoop(){
  if (rafHandle != null){
    cancelAnimationFrame(rafHandle);
    rafHandle = null;
  }
}

/** Update visible time text */
function updateDisplay(text){
  displayEl.textContent = text;
}

/** Enable/disable controls according to state */
function refreshControls(){
  if (timer.running){
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
  } else {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    // reset should be enabled if any progress exists
    const { elapsedMs, remainingMs } = timer._computeNow();
    const hasProgress = (timer.mode === 'stopwatch' ? elapsedMs > 0 : remainingMs < timer.durationMs);
    resetBtn.disabled = !hasProgress;
  }
}

/** Validate countdown inputs and return total milliseconds or throw */
function getCountdownMsFromInputs(){
  const h = safeInt(inputHours.value, 0);
  const m = safeInt(inputMinutes.value, 0);
  const s = safeInt(inputSeconds.value, 0);

  if (h < 0 || m < 0 || s < 0) throw new Error('Negative values not allowed');
  if (m > 59 || s > 59) throw new Error('Minutes and seconds must be 0-59');

  const totalMs = ((h * 3600) + (m * 60) + s) * 1000;
  return totalMs;
}

/** Visual + audio alarm when countdown reaches zero */
function fireAlarm(){
  // Visual
  alertEl.hidden = false;
  alertEl.classList.add('pulse');

  // Briefly flash display
  displayEl.classList.add('pulse');

  // Play beep
  if (soundEnabled) playBeepSequence();

  // stop pulsing after a while
  setTimeout(()=>{
    alertEl.classList.remove('pulse');
    displayEl.classList.remove('pulse');
  }, 6000);
}

/** Play a short beep sequence using WebAudio */
function playBeepSequence(){
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const freqs = [880, 1046, 880];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const start = now + i*0.18;
      const end = start + 0.14;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.09, start+0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.start(start);
      osc.stop(end + 0.02);
    });
    // Close context after short delay to free resources
    setTimeout(()=>ctx.close(), 1200);
  } catch (e) {
    console.warn('Audio not available:', e);
  }
}

/* -------------------------
   Button event handlers
------------------------- */

/** Start button clicked */
startBtn.addEventListener('click', () => {
  try {
    // If countdown mode, ensure duration set and non-zero
    if (timer.mode === 'countdown'){
      const ms = getCountdownMsFromInputs();
      if (ms <= 0) { alert('Please set a time greater than 0'); return; }
      timer.setDuration(ms);
      alertEl.hidden = true;
    }
    timer.start();
    startUpdateLoop();
    refreshControls();
  } catch (err) {
    console.error(err);
    alert(err.message || 'Invalid input');
  }
});

/** Pause button clicked */
pauseBtn.addEventListener('click', () => {
  timer.pause();
  stopUpdateLoop();
  refreshControls();
});

/** Reset button clicked */
resetBtn.addEventListener('click', () => {
  timer.reset();
  stopUpdateLoop();
  // For countdown, reflect the set duration back on display
  if (timer.mode === 'countdown'){
    updateDisplay(formatHHMMSS(timer.durationMs));
  } else {
    updateDisplay(formatHHMMSS(0));
  }
  alertEl.hidden = true;
  refreshControls();
});

/** Switch between stopwatch and countdown */
switchBtn.addEventListener('click', () => {
  const newMode = (timer.mode === 'stopwatch' ? 'countdown' : 'stopwatch');
  // Stop any running timer
  timer.pause();
  stopUpdateLoop();
  // Change mode and update UI
  timer.setMode(newMode);
  if (newMode === 'countdown'){
    titleEl.textContent = 'Countdown';
    countdownForm.setAttribute('aria-hidden','false');
    countdownForm.style.display = 'flex';
    switchBtn.textContent = 'Switch to Stopwatch';
    // set display to show current chosen duration
    const defaultMs = getCountdownMsFromInputsSafe();
    updateDisplay(formatHHMMSS(defaultMs));
  } else {
    titleEl.textContent = 'Stopwatch';
    countdownForm.setAttribute('aria-hidden','true');
    countdownForm.style.display = 'none';
    switchBtn.textContent = 'Switch to Countdown';
    updateDisplay(formatHHMMSS(0));
  }
  alertEl.hidden = true;
  refreshControls();
});

/** If input changes while in countdown mode, update displayed duration */
[inputHours, inputMinutes, inputSeconds].forEach(inp => {
  inp.addEventListener('input', () => {
    if (timer.mode !== 'countdown') return;
    const safe = getCountdownMsFromInputsSafe();
    updateDisplay(formatHHMMSS(safe));
    // update timer's stored duration but don't start it
    try { timer.setDuration(safe); } catch(e){ console.warn(e); }
  });
});

/** Helper to silently get countdown ms (returns 0 for invalid) */
function getCountdownMsFromInputsSafe(){
  try { return getCountdownMsFromInputs(); } catch(e) { return 0; }
}

/* Connect timer tick -> UI refresh & enable/disable logic */
timer.onTick((remainingMs, elapsedMs) => {
  // This callback is called by timer.tick() inside the RAF loop.
  // We intentionally keep display updates inside the RAF loop code for smoother frame sync.
  // This callback is available for other observers if needed.
  // No-op here as updateDisplay is handled elsewhere.
});

/* Initialize UI */
(function init(){
  // default: hide countdown form
  countdownForm.style.display = 'none';
  updateDisplay('00:00:00');
  refreshControls();
  alertEl.hidden = true;

  // accessibility: keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === ' '){ // space toggles start/pause
      e.preventDefault();
      if (timer.running) pauseBtn.click();
      else startBtn.click();
    } else if (e.key === 'r' || e.key === 'R'){ resetBtn.click(); }
    else if (e.key === 'm' || e.key === 'M'){ switchBtn.click(); }
  });
})();
