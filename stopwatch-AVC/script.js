// High-precision stopwatch + countdown implementation
// Author: assistant (follows user's design plan)

// Utility formatting
function pad(num, size = 2) {
  return String(num).padStart(size, '0');
}
function padMs(ms) {
  return String(ms).padStart(3, '0');
}

// Stopwatch class
class Stopwatch {
  constructor() {
    this.reset();
  }
  start() {
    if (this.running) return;
    this.startTs = performance.now();
    this.running = true;
  }
  stop() {
    if (!this.running) return;
    this.accumulated += performance.now() - this.startTs;
    this.startTs = null;
    this.running = false;
  }
  reset() {
    this.startTs = null;
    this.accumulated = 0;
    this.running = false;
  }
  getElapsedMs() {
    if (this.running) {
      return this.accumulated + (performance.now() - this.startTs);
    } else {
      return this.accumulated;
    }
  }
}

// Countdown class
class Countdown {
  constructor() {
    this.reset();
    this.onFinish = null;
  }
  set(ms) {
    this.total = Math.max(0, Math.floor(ms));
    this.reset(); // reset running state
  }
  start() {
    if (this.running || this.total <= 0) return;
    this.target = performance.now() + this.remaining;
    this.running = true;
  }
  pause() {
    if (!this.running) return;
    this.remaining = Math.max(0, this.target - performance.now());
    this.running = false;
    this.target = null;
  }
  reset() {
    this.running = false;
    this.target = null;
    this.remaining = this.total || 0;
  }
  getRemainingMs() {
    if (this.running) {
      return Math.max(0, Math.round(this.target - performance.now()));
    } else {
      return Math.max(0, Math.round(this.remaining));
    }
  }
}

// UI Controller
(function () {
  // Elements
  const timeMain = document.getElementById('time-main');
  const msSpan = document.getElementById('ms');
  const startBtn = document.getElementById('startBtn');
  const clearBtn = document.getElementById('clearBtn');
  const announcer = document.getElementById('sr-announcer');

  // Countdown elements
  const cdDetails = document.getElementById('cd-details');
  const cdForm = document.getElementById('cd-form');
  const cdMin = document.getElementById('cd-min');
  const cdSec = document.getElementById('cd-sec');
  const cdStart = document.getElementById('cd-start');
  const cdPause = document.getElementById('cd-pause');
  const cdReset = document.getElementById('cd-reset');

  // Audio beep (simple WebAudio beep if no src)
  const beepAudio = document.getElementById('beep-snd');
  let audioCtx = null;
  function playBeep(duration = 300, freq = 880, vol = 0.1) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = vol;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration / 1000);
      setTimeout(() => {
        try { o.stop(); } catch (e) {}
      }, duration + 20);
    } catch (e) {
      // fallback: try <audio> element if provided source
      if (beepAudio && beepAudio.play) beepAudio.play().catch(()=>{});
    }
  }

  // Instances
  const sw = new Stopwatch();
  const cd = new Countdown();

  // rAF loop
  let rafId = null;
  function render() {
    const elapsed = Math.max(0, Math.floor(sw.getElapsedMs()));
    const hh = Math.floor(elapsed / 3600000);
    const mm = Math.floor((elapsed % 3600000) / 60000);
    const ss = Math.floor((elapsed % 60000) / 1000);
    const ms = elapsed % 1000;
    timeMain.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
    msSpan.textContent = padMs(ms);

    // countdown visible behavior: if countdown is running show it in the UI (replace display temporarily)
    if (cd.running || cd.getRemainingMs() < (cd.total || 0)) {
      const rem = cd.getRemainingMs();
      const ch = Math.floor(rem / 3600000);
      const cm = Math.floor((rem % 3600000) / 60000);
      const cs = Math.floor((rem % 60000) / 1000);
      const cms = rem % 1000;
      // show countdown by prefixing a star (or you could add a separate area)
      timeMain.textContent = `${pad(ch)}:${pad(cm)}:${pad(cs)}`;
      msSpan.textContent = padMs(cms);

      if (rem === 0 && cd.running) {
        cd.running = false;
        announce('Countdown finished');
        flashFinish();
        playBeep(800, 720, 0.16);
        if (typeof cd.onFinish === 'function') cd.onFinish();
      }
    }

    rafId = requestAnimationFrame(render);
  }

  function startRendering() {
    if (!rafId) rafId = requestAnimationFrame(render);
  }
  function stopRendering() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Announcer
  function announce(msg) {
    announcer.textContent = msg;
    // clear after a bit to allow reuse
    setTimeout(() => { announcer.textContent = ''; }, 2000);
  }

  // Visual flash on finish
  function flashFinish() {
    const display = document.getElementById('display');
    display.animate([
      { boxShadow: '0 0 0 0 rgba(0,0,0,0.05)' },
      { boxShadow: '0 0 24px 6px rgba(255,150,0,0.6)' },
      { boxShadow: '0 0 0 0 rgba(0,0,0,0.05)' }
    ], { duration: 900 });
  }

  // Button handlers
  startBtn.addEventListener('click', () => {
    if (!sw.running) {
      sw.start();
      startBtn.textContent = 'Stop';
      startBtn.setAttribute('aria-pressed', 'true');
      announce('Stopwatch started');
    } else {
      sw.stop();
      startBtn.textContent = 'Start';
      startBtn.setAttribute('aria-pressed', 'false');
      announce('Stopwatch stopped');
    }
    startRendering();
  });

  clearBtn.addEventListener('click', () => {
    sw.reset();
    startBtn.textContent = 'Start';
    startBtn.setAttribute('aria-pressed', 'false');
    // reset display
    timeMain.textContent = '00:00:00';
    msSpan.textContent = '000';
    announce('Stopwatch reset');
  });

  // Keyboard shortcuts: Space = toggle start/stop, R = reset
  window.addEventListener('keydown', (ev) => {
    // don't intercept while typing in inputs
    const tag = document.activeElement && document.activeElement.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') {
      // allow 'r' in input if user is typing numbers, so ignore shortcuts
      return;
    }
    if (ev.code === 'Space') {
      ev.preventDefault();
      startBtn.click();
    } else if (ev.key.toLowerCase() === 'r') {
      ev.preventDefault();
      clearBtn.click();
    }
  });

  // Countdown control wiring
  function readCountdownInputs() {
    const m = Math.max(0, Number(cdMin.value) || 0);
    let s = Math.max(0, Number(cdSec.value) || 0);
    if (s > 59) {
      m += Math.floor(s / 60);
      s = s % 60;
    }
    return (m * 60000) + (s * 1000);
  }

  cdStart.addEventListener('click', () => {
    const totalMs = readCountdownInputs();
    if (totalMs <= 0) {
      announce('Set a value greater than zero');
      return;
    }
    cd.set(totalMs);
    cd.start();
    announce('Countdown started');
    // ensure the details panel is open
    cdDetails.open = true;
    startRendering();
  });

  cdPause.addEventListener('click', () => {
    if (cd.running) {
      cd.pause();
      announce('Countdown paused');
    } else {
      // resume if there's remaining time
      if (cd.getRemainingMs() > 0) {
        cd.start();
        announce('Countdown resumed');
      }
    }
  });

  cdReset.addEventListener('click', () => {
    cd.reset();
    announce('Countdown reset');
    // reflect reset in the display (it will show stopwatch elapsed or zeros)
  });

  // Accessibility: prevent space on buttons from scrolling page
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.code === 'Space') e.preventDefault();
    });
  });

  // Start the render loop (idle, but keeps UI responsive)
  startRendering();

  // Expose for debugging (optional)
  window._sw = sw;
  window._cd = cd;
})();
