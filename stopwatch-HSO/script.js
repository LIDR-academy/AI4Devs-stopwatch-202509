/* Cronómetro + Cuenta Atrás
   - Uso de requestAnimationFrame y performance.now para precisión
   - Barra espaciadora: start/pausa; R: reinicio
*/

(() => {
  const el = (id) => document.getElementById(id);

  // Display elements
  const HHMMSS = el('hhmmss');
  const MS = el('ms');

  // Mode elements
  const btnStopwatch = el('btnStopwatch');
  const btnCountdown = el('btnCountdown');
  const countdownSection = el('countdownSection');

  // Inputs
  const inputH = el('hh');
  const inputM = el('mm');
  const inputS = el('ss');
  const btnSet = el('btnSet');

  // Controls
  const btnStart = el('btnStart');
  const btnClear = el('btnClear');

  // State
  let mode = 'stopwatch'; // 'stopwatch' | 'countdown'
  let running = false;
  let rafId = null;

  // Stopwatch timing
  let swStart = 0;      // high-res timestamp when (re)started
  let swElapsed = 0;    // ms accumulated while paused

  // Countdown timing
  let cdDuration = 0;   // ms
  let cdEnd = 0;        // high-res target time
  let cdRemainingPaused = 0; // remaining ms when paused

  function formatTime(ms) {
    ms = Math.max(0, Math.floor(ms));
    const milli = ms % 1000;
    const totalSeconds = Math.floor(ms / 1000);
    const s = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const m = totalMinutes % 60;
    const h = Math.floor(totalMinutes / 60);
    const pad = (n, w=2) => String(n).padStart(w, '0');
    return {
      h, m, s, milli,
      hhmmss: `${pad(h)}:${pad(m)}:${pad(s)}`,
      mmm: String(milli).padStart(3, '0')
    };
  }

  function render(ms) {
    const { hhmmss, mmm } = formatTime(ms);
    HHMMSS.textContent = hhmmss;
    MS.textContent = mmm;
  }

  function tick() {
    if (!running) return;
    if (mode === 'stopwatch') {
      const now = performance.now();
      const elapsed = (now - swStart) + swElapsed;
      render(elapsed);
    } else { // countdown
      const now = performance.now();
      const remaining = cdEnd - now;
      render(remaining);
      if (remaining <= 0) {
        stop();
        render(0);
        beep();
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    btnStart.textContent = 'Pause';
    btnStart.classList.remove('btn-start');
    btnStart.classList.add('btn-stop');

    if (mode === 'stopwatch') {
      swStart = performance.now();
    } else {
      // countdown
      const now = performance.now();
      cdEnd = now + (cdRemainingPaused || cdDuration);
      cdRemainingPaused = 0;
    }
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    btnStart.textContent = 'Start';
    btnStart.classList.remove('btn-stop');
    btnStart.classList.add('btn-start');
    cancelAnimationFrame(rafId);

    if (mode === 'stopwatch') {
      const now = performance.now();
      swElapsed += now - swStart;
    } else {
      const remaining = cdEnd - performance.now();
      cdRemainingPaused = Math.max(0, remaining);
    }
  }

  function clearAll() {
    if (mode === 'stopwatch') {
      swElapsed = 0;
      render(0);
    } else {
      cdRemainingPaused = 0;
      render(cdDuration);
    }
  }

  function switchMode(next) {
    if (mode === next) return;
    // pause first
    if (running) stop();
    mode = next;

    // toggle UI
    if (mode === 'stopwatch') {
      btnStopwatch.classList.add('active');
      btnCountdown.classList.remove('active');
      countdownSection.hidden = true;
      render(swElapsed);
    } else {
      btnStopwatch.classList.remove('active');
      btnCountdown.classList.add('active');
      countdownSection.hidden = false;
      if (cdDuration === 0) {
        // default 1 min
        cdDuration = 60_000;
        inputH.value = 0; inputM.value = 1; inputS.value = 0;
      }
      render(cdRemainingPaused || cdDuration);
    }
  }

  function setCountdownFromInputs() {
    const h = Math.max(0, Number(inputH.value || 0));
    const m = Math.max(0, Number(inputM.value || 0));
    const s = Math.max(0, Number(inputS.value || 0));
    cdDuration = ((h * 3600) + (m * 60) + s) * 1000;
    if (cdDuration <= 0) {
      alert('La duración debe ser mayor que 0.');
      return;
    }
    cdRemainingPaused = 0;
    render(cdDuration);
  }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.01);
      o.start();
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        o.stop(ctx.currentTime + 0.08);
        ctx.close();
      }, 300);
    } catch (e) {
      console.warn('No se pudo reproducir beep.', e);
    }
  }

  // Events
  btnStart.addEventListener('click', () => (running ? stop() : start()));
  btnClear.addEventListener('click', clearAll);
  btnStopwatch.addEventListener('click', () => switchMode('stopwatch'));
  btnCountdown.addEventListener('click', () => switchMode('countdown'));
  btnSet.addEventListener('click', setCountdownFromInputs);

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); running ? stop() : start(); }
    if (e.key.toLowerCase() === 'r') { e.preventDefault(); clearAll(); }
  });

  // Initial render
  render(0);
})();