/* Timer & Countdown
   Vanilla JS, accessible, drift-compensated timing with performance.now()
   Author: (you)
*/
(() => {
    "use strict";
  
    // ---------- Utilities ----------
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
    const pad2 = (n) => String(Math.floor(Math.abs(n))).padStart(2, "0");
    const pad3 = (n) => String(Math.floor(Math.abs(n))).padStart(3, "0");
    const msToParts = (ms) => {
      const s = Math.floor(ms / 1000);
      const hh = Math.floor(s / 3600);
      const mm = Math.floor((s % 3600) / 60);
      const ss = s % 60;
      const centi = Math.floor((ms % 1000) / 10);
      return { hh, mm, ss, centi };
    };
    const formatStopwatch = (ms) => {
      const { hh, mm, ss, centi } = msToParts(ms);
      return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}.<span class="ms">${pad2(centi)}</span>`;
    };
    const formatLapDelta = (ms) => {
      const { hh, mm, ss, centi } = msToParts(ms);
      return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}.${pad2(centi)}`;
    };
    const formatCountdown = (ms) => {
      const negative = ms < 0;
      const abs = Math.max(0, Math.abs(ms));
      const { hh, mm, ss } = msToParts(abs);
      return `${negative ? "-" : ""}${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
    };
    const announce = (msg) => {
      const live = $("#live");
      if (!live) return;
      live.textContent = ""; // reset for repeated announcements
      // small timeout ensures change is detected by AT
      setTimeout(() => (live.textContent = msg), 10);
    };
    const vibrate = (pattern) => {
      if (navigator.vibrate) navigator.vibrate(pattern);
    };
  
    // Persistence keys
    const LS_KEYS = {
      ACTIVE_TAB: "timer.activeTab",
      COUNTDOWN_INPUT: "timer.countdown.input" // {h,m,s}
    };
  
    // ---------- UI Injection ----------
    const app = $("#app");
    app.innerHTML = `
      <div class="card">
        <div class="tabs" role="tablist" aria-label="Timer Tabs">
          <button id="tab-stopwatch" class="tab" role="tab" aria-selected="true" aria-controls="panel-stopwatch">Stopwatch</button>
          <button id="tab-countdown" class="tab" role="tab" aria-selected="false" aria-controls="panel-countdown">Countdown</button>
        </div>
  
        <div class="panels">
          <!-- Stopwatch Panel -->
          <section id="panel-stopwatch" class="panel" role="tabpanel" aria-labelledby="tab-stopwatch" aria-hidden="false">
            <div id="sw-readout" class="readout" aria-live="off">00:00:00.<span class="ms">00</span></div>
            <div class="controls">
              <button id="sw-start" class="button primary span-2" aria-label="Start stopwatch">Start</button>
              <button id="sw-lap" class="button accent" aria-label="Add lap" disabled>Lap</button>
              <button id="sw-pause" class="button" aria-label="Pause stopwatch" style="display:none;">Pause</button>
              <button id="sw-reset" class="button" aria-label="Reset stopwatch" disabled>Reset</button>
            </div>
            <p class="helper">
              <span class="kb">
                <span class="kbd">Space</span> Start/Pause
                <span class="kbd">L</span> Lap
                <span class="kbd">R</span> Reset
              </span>
            </p>
            <div class="laps" aria-live="off">
              <div class="laps-header"><span>Laps</span><span id="sw-total" aria-label="Total elapsed">Total: 00:00:00.00</span></div>
              <div id="lap-list" class="lap-list" aria-label="Lap list"></div>
            </div>
          </section>
  
          <!-- Countdown Panel -->
          <section id="panel-countdown" class="panel" role="tabpanel" aria-labelledby="tab-countdown" aria-hidden="true">
            <div class="input-row" aria-label="Countdown time input">
              <input id="cd-h" class="time-input" type="text" inputmode="numeric" pattern="[0-9]*" aria-label="Hours" placeholder="HH" autocomplete="off" />
              <span class="sep">:</span>
              <input id="cd-m" class="time-input" type="text" inputmode="numeric" pattern="[0-9]*" aria-label="Minutes" placeholder="MM" autocomplete="off" />
              <span class="sep">:</span>
              <input id="cd-s" class="time-input" type="text" inputmode="numeric" pattern="[0-9]*" aria-label="Seconds" placeholder="SS" autocomplete="off" />
            </div>
            <div class="quick-chips" aria-label="Quick set">
              <button class="chip" data-min="1">1 min</button>
              <button class="chip" data-min="5">5 min</button>
              <button class="chip" data-min="10">10 min</button>
              <button class="chip" data-min="15">15 min</button>
            </div>
            <div id="cd-readout" class="readout" aria-live="off">00:00:00</div>
            <div class="controls">
              <button id="cd-start" class="button primary span-2" aria-label="Start countdown">Start</button>
              <button id="cd-pause" class="button" aria-label="Pause countdown" style="display:none;">Pause</button>
              <button id="cd-reset" class="button" aria-label="Reset countdown">Reset</button>
              <button id="cd-beep" class="button" aria-pressed="true" aria-label="Toggle beep on finish">Beep: On</button>
            </div>
          </section>
        </div>
      </div>
    `;
  
    // ---------- Tabs ----------
    const tabs = {
      btns: [$("#tab-stopwatch"), $("#tab-countdown")],
      panels: {
        stopwatch: $("#panel-stopwatch"),
        countdown: $("#panel-countdown")
      }
    };
  
    const setActiveTab = (name) => {
      const map = { stopwatch: 0, countdown: 1 };
      const idx = map[name] ?? 0;
      tabs.btns.forEach((b, i) => {
        const selected = i === idx;
        b.setAttribute("aria-selected", String(selected));
      });
      Object.entries(tabs.panels).forEach(([key, el]) => {
        el.setAttribute("aria-hidden", String(key !== name));
      });
      localStorage.setItem(LS_KEYS.ACTIVE_TAB, name);
    };
  
    const savedTab = localStorage.getItem(LS_KEYS.ACTIVE_TAB);
    setActiveTab(savedTab === "countdown" ? "countdown" : "stopwatch");
  
    tabs.btns[0].addEventListener("click", () => setActiveTab("stopwatch"));
    tabs.btns[1].addEventListener("click", () => setActiveTab("countdown"));
  
    // ---------- Stopwatch ----------
    const sw = {
      readout: $("#sw-readout"),
      totalEl: $("#sw-total"),
      startBtn: $("#sw-start"),
      pauseBtn: $("#sw-pause"),
      lapBtn: $("#sw-lap"),
      resetBtn: $("#sw-reset"),
      lapList: $("#lap-list"),
      running: false,
      startPerf: 0,
      elapsedBefore: 0,
      laps: [],
      rafId: null
    };
  
    const updateStopwatchUI = (ms) => {
      sw.readout.innerHTML = formatStopwatch(ms);
      sw.totalEl.textContent = "Total: " + formatLapDelta(ms);
    };
  
    const renderLaps = () => {
      sw.lapList.innerHTML = "";
      let last = 0;
      sw.laps.forEach((t, i) => {
        const delta = t - last;
        last = t;
        const item = document.createElement("div");
        item.className = "lap-item";
        item.innerHTML = `
          <span>#${i + 1}</span>
          <strong>${formatLapDelta(delta)}</strong>
          <span>${formatLapDelta(t)}</span>
        `;
        sw.lapList.prepend(item); // newest on top
      });
    };
  
    const computeElapsed = () => sw.elapsedBefore + (sw.running ? performance.now() - sw.startPerf : 0);
  
    const tickStopwatch = () => {
      updateStopwatchUI(computeElapsed());
      sw.rafId = requestAnimationFrame(tickStopwatch);
    };
  
    const startStopwatch = () => {
      if (sw.running) return;
      sw.running = true;
      sw.startPerf = performance.now();
      sw.startBtn.style.display = "none";
      sw.pauseBtn.style.display = "";
      sw.lapBtn.disabled = false;
      sw.resetBtn.disabled = false;
      tickStopwatch();
    };
  
    const pauseStopwatch = () => {
      if (!sw.running) return;
      sw.running = false;
      sw.elapsedBefore = computeElapsed();
      cancelAnimationFrame(sw.rafId);
      sw.startBtn.textContent = "Resume";
      sw.startBtn.style.display = "";
      sw.pauseBtn.style.display = "none";
    };
  
    const resetStopwatch = () => {
      sw.running = false;
      cancelAnimationFrame(sw.rafId);
      sw.elapsedBefore = 0;
      sw.laps = [];
      updateStopwatchUI(0);
      renderLaps();
      sw.startBtn.textContent = "Start";
      sw.startBtn.style.display = "";
      sw.pauseBtn.style.display = "none";
      sw.lapBtn.disabled = true;
      sw.resetBtn.disabled = true;
    };
  
    const lapStopwatch = () => {
      const t = computeElapsed();
      sw.laps.push(t);
      renderLaps();
    };
  
    sw.startBtn.addEventListener("click", startStopwatch);
    sw.pauseBtn.addEventListener("click", pauseStopwatch);
    sw.resetBtn.addEventListener("click", resetStopwatch);
    sw.lapBtn.addEventListener("click", lapStopwatch);
  
    // Keyboard shortcuts for Stopwatch only when its tab is active
    document.addEventListener("keydown", (e) => {
      const active = localStorage.getItem(LS_KEYS.ACTIVE_TAB) || "stopwatch";
      if (active !== "stopwatch") return;
      if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        sw.running ? pauseStopwatch() : startStopwatch();
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        if (!sw.lapBtn.disabled) lapStopwatch();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        if (!sw.resetBtn.disabled) resetStopwatch();
      }
    });
  
    // ---------- Countdown ----------
    const cd = {
      h: $("#cd-h"),
      m: $("#cd-m"),
      s: $("#cd-s"),
      readout: $("#cd-readout"),
      startBtn: $("#cd-start"),
      pauseBtn: $("#cd-pause"),
      resetBtn: $("#cd-reset"),
      beepBtn: $("#cd-beep"),
      chips: $$(".chip"),
      running: false,
      endPerf: 0,
      remainingAtPause: 0,
      baseDuration: 0,
      rafId: null,
      beepOn: true,
      finishedOnce: false
    };
  
    // restore saved input
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEYS.COUNTDOWN_INPUT) || "{}");
      if (Number.isInteger(saved.h)) cd.h.value = pad2(saved.h);
      if (Number.isInteger(saved.m)) cd.m.value = pad2(saved.m);
      if (Number.isInteger(saved.s)) cd.s.value = pad2(saved.s);
    } catch {}
  
    const saveCountdownInput = () => {
      const h = parseInt(cd.h.value || "0", 10) || 0;
      const m = parseInt(cd.m.value || "0", 10) || 0;
      const s = parseInt(cd.s.value || "0", 10) || 0;
      localStorage.setItem(LS_KEYS.COUNTDOWN_INPUT, JSON.stringify({ h, m, s }));
    };
  
    const sanitizeInput = (el, max) => {
      const numbers = (el.value || "").replace(/[^\d]/g, "");
      let n = parseInt(numbers || "0", 10);
      n = clamp(n, 0, max);
      el.value = pad2(isNaN(n) ? 0 : n);
    };
  
    const getInputDurationMs = () => {
      const h = clamp(parseInt(cd.h.value || "0", 10) || 0, 0, 99);
      const m = clamp(parseInt(cd.m.value || "0", 10) || 0, 0, 59);
      const s = clamp(parseInt(cd.s.value || "0", 10) || 0, 0, 59);
      return ((h * 3600) + (m * 60) + s) * 1000;
    };
  
    const setReadout = (ms) => {
      cd.readout.innerHTML = formatCountdown(ms);
    };
  
    const computeRemaining = () => {
      if (!cd.running) return cd.remainingAtPause;
      return cd.endPerf - performance.now();
    };
  
    const tickCountdown = () => {
      const remaining = computeRemaining();
      setReadout(remaining);
      if (remaining <= 0) {
        finishCountdown();
        return;
      }
      cd.rafId = requestAnimationFrame(tickCountdown);
    };
  
    const startCountdown = () => {
      // If not running, compute base duration from inputs (only on first start after reset)
      if (!cd.running) {
        if (cd.baseDuration === 0) cd.baseDuration = getInputDurationMs();
        if (cd.baseDuration <= 0) {
          // friendly clamp: default 1 min if zero
          cd.baseDuration = 60_000;
          cd.h.value = "00"; cd.m.value = "01"; cd.s.value = "00";
          saveCountdownInput();
        }
        const now = performance.now();
        const remaining = cd.remainingAtPause > 0 ? cd.remainingAtPause : cd.baseDuration;
        cd.endPerf = now + remaining;
        cd.running = true;
        cd.startBtn.style.display = "none";
        cd.pauseBtn.style.display = "";
        cd.finishedOnce = false;
        tickCountdown();
      }
    };
  
    const pauseCountdown = () => {
      if (!cd.running) return;
      cd.running = false;
      cd.remainingAtPause = Math.max(0, cd.endPerf - performance.now());
      cancelAnimationFrame(cd.rafId);
      cd.startBtn.textContent = "Resume";
      cd.startBtn.style.display = "";
      cd.pauseBtn.style.display = "none";
    };
  
    const resetCountdown = () => {
      cd.running = false;
      cancelAnimationFrame(cd.rafId);
      cd.remainingAtPause = 0;
      cd.baseDuration = 0;
      cd.startBtn.textContent = "Start";
      cd.startBtn.style.display = "";
      cd.pauseBtn.style.display = "none";
      setReadout(getInputDurationMs());
      cd.readout.parentElement.classList.remove("finished");
    };
  
    const finishCountdown = () => {
      cancelAnimationFrame(cd.rafId);
      cd.running = false;
      cd.remainingAtPause = 0;
      setReadout(0);
      cd.startBtn.textContent = "Start";
      cd.startBtn.style.display = "";
      cd.pauseBtn.style.display = "none";
      // Visual + a11y feedback
      cd.readout.parentElement.classList.add("finished");
      announce("Countdown finished.");
      vibrate([120, 80, 120]);
      if (cd.beepOn && !cd.finishedOnce) {
        cd.finishedOnce = true;
        playBeep();
      }
    };
  
    // WebAudio beep (short, unobtrusive)
    let audioCtx = null;
    const playBeep = () => {
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const ctx = audioCtx;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 880; // A5
        g.gain.value = 0.001; // start quiet to avoid pop
        o.connect(g).connect(ctx.destination);
        const now = ctx.currentTime;
        g.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
        o.start(now);
        // short envelope
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        o.stop(now + 0.4);
      } catch {
        // Fallback: do nothing if not allowed
      }
    };
  
    // Inputs events
    [cd.h, cd.m, cd.s].forEach((el, idx) => {
      const max = idx === 0 ? 99 : 59;
      el.addEventListener("input", () => {
        // only numeric; delay sanitize for better UX
        el.value = el.value.replace(/[^\d]/g, "");
      });
      el.addEventListener("blur", () => {
        sanitizeInput(el, max);
        saveCountdownInput();
        if (!cd.running) setReadout(getInputDurationMs());
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          const v = clamp(parseInt(el.value || "0", 10) || 0, 0, max);
          const next = e.key === "ArrowUp" ? clamp(v + 1, 0, max) : clamp(v - 1, 0, max);
          el.value = pad2(next);
          saveCountdownInput();
          if (!cd.running) setReadout(getInputDurationMs());
        }
      });
    });
  
    // Quick chips
    cd.chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const min = parseInt(chip.dataset.min, 10) || 1;
        const total = min * 60;
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        cd.h.value = pad2(h);
        cd.m.value = pad2(m);
        cd.s.value = pad2(s);
        saveCountdownInput();
        resetCountdown(); // ensure clean state & readout update
        setReadout(getInputDurationMs());
      });
    });
  
    // Buttons
    cd.startBtn.addEventListener("click", startCountdown);
    cd.pauseBtn.addEventListener("click", pauseCountdown);
    cd.resetBtn.addEventListener("click", resetCountdown);
    cd.beepBtn.addEventListener("click", () => {
      cd.beepOn = !cd.beepOn;
      cd.beepBtn.setAttribute("aria-pressed", String(cd.beepOn));
      cd.beepBtn.textContent = `Beep: ${cd.beepOn ? "On" : "Off"}`;
    });
  
    // Initialize countdown readout with current inputs
    setReadout(getInputDurationMs());
  
    // When switching to Countdown tab, make sure readout matches inputs (no layout shift)
    tabs.btns[1].addEventListener("click", () => {
      if (!cd.running) setReadout(getInputDurationMs());
    });
  
    // Prevent scroll on space triggering page scroll when focused on body
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && document.activeElement === document.body) {
        e.preventDefault();
      }
    });
  
    // Expose nothing globally
  })();
  