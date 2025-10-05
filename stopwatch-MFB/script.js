// Premium Classic logic with accurate timing and a beep using WebAudio
const pad = (n, s = 2) => String(n).padStart(s, "0");

/* BEEP utility (WebAudio) */
function makeBeep() {
  let ctx;
  return () => {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.36);
    } catch (e) {
      /* ignore */
    }
  };
}
const beep = makeBeep();

/* ============= STOPWATCH ============= */
(function () {
  const main = document.getElementById("sw-main");
  const msEl = document.getElementById("sw-ms");
  const startBtn = document.getElementById("sw-start");
  const pauseBtn = document.getElementById("sw-pause");
  const clearBtn = document.getElementById("sw-clear");
  const lapBtn = document.getElementById("sw-lap");
  const laps = document.getElementById("sw-laps");

  let running = false,
    startAt = 0,
    acc = 0,
    raf;

  const fmt = (t) => {
    const ms = Math.floor(t % 1000);
    const total = Math.floor(t / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return { h, m, s, ms };
  };

  function render(t) {
    const { h, m, s, ms } = fmt(t);
    main.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    msEl.textContent = pad(ms, 3);
  }

  function tick() {
    const now = performance.now();
    render(acc + (now - startAt));
    raf = requestAnimationFrame(tick);
  }

  startBtn.addEventListener("click", () => {
    if (running) return;
    running = true;
    startAt = performance.now();
    raf = requestAnimationFrame(tick);
  });

  pauseBtn.addEventListener("click", () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    acc += performance.now() - startAt;
  });

  clearBtn.addEventListener("click", () => {
    running = false;
    cancelAnimationFrame(raf);
    acc = 0;
    render(0);
    laps.innerHTML = "";
  });

  lapBtn.addEventListener("click", () => {
    const t = running ? acc + (performance.now() - startAt) : acc;
    const li = document.createElement("li");
    const idx = laps.children.length + 1;
    const { h, m, s, ms } = fmt(t);
    li.innerHTML = `<span>Lap ${idx}</span><strong>${pad(h)}:${pad(m)}:${pad(
      s
    )}.${pad(ms, 3)}</strong>`;
    laps.prepend(li);
  });

  render(0);
})();

/* ============= COUNTDOWN ============= */
(function () {
  const main = document.getElementById("cd-main");
  const msEl = document.getElementById("cd-ms");
  const btnStart = document.getElementById("cd-start");
  const btnPause = document.getElementById("cd-pause");
  const btnClear = document.getElementById("cd-clear");
  const btnSet = document.getElementById("cd-set");
  const minI = document.getElementById("cd-min");
  const secI = document.getElementById("cd-sec");
  const display = document.getElementById("cd-display");
  const presets = document.querySelectorAll(".preset");

  let duration = 60000; // ms
  let endAt = 0;
  let running = false;
  let raf;

  const render = (ms) => {
    ms = Math.max(0, ms | 0);
    const whole = Math.floor(ms / 1000);
    const h = Math.floor(whole / 3600);
    const m = Math.floor((whole % 3600) / 60);
    const s = whole % 60;
    main.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    msEl.textContent = pad(ms % 1000, 3);
  };

  function tick() {
    const left = endAt - Date.now();
    if (left <= 0) {
      running = false;
      render(0);
      display.classList.add("blink");
      beep();
      return;
    }
    render(left);
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    display.classList.remove("blink");
    endAt = Date.now() + duration;
    running = true;
    raf = requestAnimationFrame(tick);
  }

  function pause() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    duration = Math.max(0, endAt - Date.now());
  }
  function clear() {
    running = false;
    cancelAnimationFrame(raf);
    display.classList.remove("blink");
    render(
      (parseInt(minI.value || 0) * 60 +
        Math.min(59, parseInt(secI.value || 0))) *
        1000
    );
    duration =
      (parseInt(minI.value || 0) * 60 +
        Math.min(59, parseInt(secI.value || 0))) *
      1000;
  }

  btnSet.addEventListener("click", clear);
  btnStart.addEventListener("click", start);
  btnPause.addEventListener("click", pause);

  btnClear.addEventListener("click", () => {
    running = false;
    cancelAnimationFrame(raf);
    duration = 0;
    endAt = 0;
    display.classList.remove("blink");
    render(0);
  });

  presets.forEach((p) =>
    p.addEventListener("click", () => {
      const sec = parseInt(p.dataset.sec, 10);
      minI.value = Math.floor(sec / 60);
      secI.value = sec % 60;
      duration = sec * 1000;
      display.classList.remove("blink");
      render(duration);
    })
  );

  // initial render
  render(duration);
})();

/* ============= Fullscreen ============= */
(function () {
  const btn = document.getElementById("btn-fullscreen");
  btn.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  });
})();
