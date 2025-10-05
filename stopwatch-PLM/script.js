/* eslint-disable no-console */
(function () {
  "use strict";

  // ===== Utilidades
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const msToParts = (totalMs) => {
    const ms = Math.max(0, totalMs);
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor(ms % 1000);
    return { hours, minutes, seconds, centi };
  };
  const fmt2 = (n) => n.toString().padStart(2, "0");
  const fmt3 = (n) => n.toString().padStart(3, "0");
  const select = (id) => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Elemento #${id} no encontrado`);
    return el;
  };

  // ===== Observador de ticks
  class TickEmitter {
    constructor() { this._subs = new Set(); }
    onTick(cb) { this._subs.add(cb); return () => this._subs.delete(cb); }
    _emit(ms) {
      for (const cb of this._subs) {
        try { cb(ms); } catch (e) { console.error("TickEmitter cb", e); }
      }
    }
  }

  // ===== Cronómetro
  class Stopwatch extends TickEmitter {
    constructor() {
      super();
      this._running = false;
      this._accum = 0; this._last = 0; this._raf = null;
    }
    start() {
      if (this._running) return;
      console.info("[Cronómetro] arrancar");
      this._running = true;
      this._accum = 0; this._last = performance.now();
      this._loop();
    }
    pause() {
      if (!this._running) return;
      console.info("[Cronómetro] pausar");
      this._running = false; cancelAnimationFrame(this._raf);
      const now = performance.now(); this._accum += now - this._last;
    }
    resume() {
      if (this._running) return;
      console.info("[Cronómetro] continuar");
      this._running = true; this._last = performance.now();
      this._loop();
    }
    clear() {
      console.info("[Cronómetro] limpiar");
      this._running = false; cancelAnimationFrame(this._raf);
      this._accum = 0; this._last = 0; this._emit(0);
    }
    nowMs() {
      if (!this._running) return Math.floor(this._accum);
      const now = performance.now(); return Math.floor(this._accum + (now - this._last));
    }
    _loop() {
      const step = () => {
        if (!this._running) return;
        this._emit(this.nowMs());
        this._raf = requestAnimationFrame(step);
      };
      this._raf = requestAnimationFrame(step);
    }
  }

  // ===== Cuenta regresiva
  class Countdown extends TickEmitter {
    constructor() {
      super();
      this._running = false;
      this._targetMs = 0; this._remainingMs = 0;
      this._last = 0; this._raf = null; this._onFinish = null;
    }
    setDuration(ms) {
      if (ms <= 0) throw new Error("La duración debe ser mayor a 0");
      this._targetMs = Math.floor(ms);
      this._remainingMs = this._targetMs;
      console.info("[CuentaRegresiva] fijar duración:", this._targetMs, "ms");
      this._emit(this._remainingMs);
    }
    onFinish(cb) { this._onFinish = cb; }
    start() {
      if (this._running || this._targetMs <= 0) return;
      console.info("[CuentaRegresiva] arrancar");
      this._running = true; this._last = performance.now(); this._loop();
    }
    pause() {
      if (!this._running) return;
      console.info("[CuentaRegresiva] pausar");
      this._running = false; cancelAnimationFrame(this._raf);
      const now = performance.now();
      this._remainingMs = Math.max(0, this._remainingMs - (now - this._last));
    }
    resume() {
      if (this._running || this._remainingMs <= 0) return;
      console.info("[CuentaRegresiva] continuar");
      this._running = true; this._last = performance.now(); this._loop();
    }
    clearToTarget() {
      console.info("[CuentaRegresiva] limpiar a valor fijado");
      this._running = false; cancelAnimationFrame(this._raf);
      this._remainingMs = this._targetMs; this._emit(this._remainingMs);
    }
    nowMs() { return Math.max(0, Math.floor(this._remainingMs)); }
    _loop() {
      const step = () => {
        if (!this._running) return;
        const now = performance.now();
        const delta = now - this._last; this._last = now;
        this._remainingMs = Math.max(0, this._remainingMs - delta);
        this._emit(this._remainingMs);
        if (this._remainingMs <= 0) {
          this._running = false; cancelAnimationFrame(this._raf);
          console.info("[CuentaRegresiva] terminó");
          if (typeof this._onFinish === "function") { try { this._onFinish(); } catch (e) { console.error(e); } }
          return;
        }
        this._raf = requestAnimationFrame(step);
      };
      this._raf = requestAnimationFrame(step);
    }
  }

  // ===== Alarma en bucle hasta detener
  class Beeper {
    constructor() { this.ctx = null; this.timer = null; this.active = false; }
    _ensure() {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    _burst() {
      // tres tonos cortos
      const pattern = [440, 660, 880];
      const now = this.ctx.currentTime;
      pattern.forEach((freq, i) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.frequency.value = freq; o.connect(g); g.connect(this.ctx.destination);
        const t0 = now + i * 0.25;
        o.start(t0); g.gain.setValueAtTime(0.001, t0);
        g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.02);
        o.stop(t0 + 0.22); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      });
    }
    startLoop() {
      try {
        if (this.active) return;
        this._ensure(); this.active = true;
        this._burst();
        this.timer = setInterval(() => this._burst(), 800); // sigue sonando
      } catch (e) { console.warn("[Beeper] no se pudo iniciar", e); }
    }
    stop() {
      if (!this.active) return;
      this.active = false;
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      if (this.ctx) { try { this.ctx.close(); } catch {} finally { this.ctx = null; } }
      console.info("[Beeper] detenido");
    }
  }

  // ===== Router de vistas
  class ViewRouter {
    constructor(beeper) {
      this.beeper = beeper;
      this.views = {
        menu: document.getElementById("viewMenu"),
        stopwatch: document.getElementById("viewStopwatch"),
        "countdown-setup": document.getElementById("viewCountdownSetup"),
        "countdown-run": document.getElementById("viewCountdownRun"),
      };
      this.btnBack = document.getElementById("btnBack");
      this.current = "menu";
      document.querySelectorAll("[data-nav]").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          this.go(a.dataset.nav);
        });
      });
    }
    go(name) {
      try {
        console.info("[Router] ir a:", name);
        Object.entries(this.views).forEach(([k, el]) => el.classList.toggle("hidden", k !== name));
        this.current = name;
        // Back visible sólo fuera del menú
        this.btnBack.classList.toggle("hidden", name === "menu");
        this.btnBack.onclick = (e) => {
          e.preventDefault();
          if (name === "countdown-run") this.go("countdown-setup");
          else this.go("menu");
        };
        // al cambiar de vista, si estaba sonando, lo detenemos (acción del usuario)
        this.beeper.stop();
      } catch (err) { console.error("[Router] error al navegar:", err); }
    }
  }

  // ===== Render de tiempo
  const renderHMS = (elHms, elCenti, ms) => {
    try {
      const { hours, minutes, seconds, centi } = msToParts(ms);
      elHms.textContent = `${fmt2(hours)}:${fmt2(minutes)}:${fmt2(seconds)}`;
      elCenti.textContent = fmt3(centi);
    } catch (e) { console.error("renderHMS", e); }
  };

  // ===== App principal
  class App {
    constructor() {
      this.beeper = new Beeper();
      this.router = new ViewRouter(this.beeper);

      // Cronómetro
      this.sw = new Stopwatch();
      this.sw.onTick((ms) => renderHMS(select("swHMS"), select("swCenti"), ms));
      this._swState = "idle"; // idle | running | paused

      // Cuenta regresiva
      this.cd = new Countdown();
      this.cd.onTick((ms) => renderHMS(select("cdHMS"), select("cdCenti"), ms));
      this.cd.onFinish(() => this._onCountdownFinish());
      this._cdState = "idle";

      // UI
      this._bindMenu();
      this._bindStopwatch();
      this._bindCountdownSetup();
      this._bindCountdownRun();

      // Estado del keypad (HHMMSS)
      this._cdDigits = ["0","0","0","0","0","0"];
      this._refreshCountdownPreview();
    }

    // --- Menú
    _bindMenu() {
      select("goStopwatch").addEventListener("click", () => this.router.go("stopwatch"));
      select("goCountdown").addEventListener("click", () => this.router.go("countdown-setup"));
    }

    // --- Cronómetro
    _bindStopwatch() {
      select("swPrimary").addEventListener("click", () => {
        this.beeper.stop(); // cualquier acción detiene alarma si estuviera sonando
        this._toggleStopwatch();
      });
      select("swClear").addEventListener("click", () => {
        try { this.beeper.stop(); this.sw.clear(); this._swState = "idle"; this._updateSwPrimary(); }
        catch (e) { console.error("[Cronómetro] limpiar", e); }
      });
    }
    _toggleStopwatch() {
      try {
        if (this._swState === "idle") { this.sw.start(); this._swState = "running"; }
        else if (this._swState === "running") { this.sw.pause(); this._swState = "paused"; }
        else { this.sw.resume(); this._swState = "running"; }
        this._updateSwPrimary();
      } catch (e) { console.error("[Cronómetro] toggle", e); }
    }
    _updateSwPrimary() {
      const btn = select("swPrimary");
      if (this._swState === "idle") {
        btn.textContent = "Arrancar";
        btn.classList.remove("bg-yellow-500","hover:bg-yellow-600");
        btn.classList.add("bg-green-500","hover:bg-green-600");
      } else if (this._swState === "running") {
        btn.textContent = "Pausar";
        btn.classList.remove("bg-green-500","hover:bg-green-600");
        btn.classList.add("bg-yellow-500","hover:bg-yellow-600");
      } else {
        btn.textContent = "Continuar";
        btn.classList.remove("bg-green-500","hover:bg-green-600");
        btn.classList.add("bg-yellow-500","hover:bg-yellow-600");
      }
    }

    // --- Cuenta regresiva (configurar)
    _bindCountdownSetup() {
      document.querySelectorAll(".kp").forEach((b) =>
        b.addEventListener("click", () => {
          try {
            const d = String(b.dataset.kp);
            this._cdDigits.shift(); this._cdDigits.push(d);
            this._refreshCountdownPreview();
          } catch (e) { console.error("[CuentaRegresiva] keypad", e); }
        })
      );
      select("cdSetupClear").addEventListener("click", () => {
        try { this.beeper.stop(); this._cdDigits = ["0","0","0","0","0","0"]; this._refreshCountdownPreview(); }
        catch (e) { console.error("[CuentaRegresiva] limpiar setup", e); }
      });
      select("cdSet").addEventListener("click", () => {
        try {
          const [h1,h2,m1,m2,s1,s2] = this._cdDigits.map(Number);
          const H = clamp(h1*10 + h2, 0, 99);
          const M = clamp(m1*10 + m2, 0, 59);
          const S = clamp(s1*10 + s2, 0, 59);
          const total = ((H*3600) + (M*60) + S) * 1000;
          if (total <= 0) { alert("Ingrese un tiempo mayor a 00:00:00"); return; }
          this.cd.setDuration(total);
          this._cdState = "idle"; this._updateCdPrimary();
          select("cdHMS").classList.remove("blink"); select("cdCenti").classList.remove("blink");
          this.router.go("countdown-run");
        } catch (e) { console.error("[CuentaRegresiva] fijar", e); }
      });
    }
    _refreshCountdownPreview() {
      try {
        const [h1,h2,m1,m2,s1,s2] = this._cdDigits;
        select("cdHMSPreview").textContent = `${h1}${h2}:${m1}${m2}:${s1}${s2}`;
      } catch (e) { console.error("[CuentaRegresiva] preview", e); }
    }

    // --- Cuenta regresiva (correr)
    _bindCountdownRun() {
      select("cdPrimary").addEventListener("click", () => {
        this.beeper.stop();
        this._toggleCountdown();
      });
      select("cdRunClear").addEventListener("click", () => {
        try {
          this.beeper.stop();
          this.cd.clearToTarget(); this._cdState = "idle"; this._updateCdPrimary();
          select("cdHMS").classList.remove("blink"); select("cdCenti").classList.remove("blink");
        } catch (e) { console.error("[CuentaRegresiva] limpiar", e); }
      });
    }
    _toggleCountdown() {
      try {
        if (this._cdState === "idle") { this.cd.start(); this._cdState = "running"; }
        else if (this._cdState === "running") { this.cd.pause(); this._cdState = "paused"; }
        else { this.cd.resume(); this._cdState = "running"; }
        this._updateCdPrimary();
      } catch (e) { console.error("[CuentaRegresiva] toggle", e); }
    }
    _updateCdPrimary() {
      const btn = select("cdPrimary");
      if (this._cdState === "idle") {
        btn.textContent = "Arrancar";
        btn.classList.remove("bg-yellow-500","hover:bg-yellow-600");
        btn.classList.add("bg-green-500","hover:bg-green-600");
      } else if (this._cdState === "running") {
        btn.textContent = "Pausar";
        btn.classList.remove("bg-green-500","hover:bg-green-600");
        btn.classList.add("bg-yellow-500","hover:bg-yellow-600");
      } else {
        btn.textContent = "Continuar";
        btn.classList.remove("bg-green-500","hover:bg-green-600");
        btn.classList.add("bg-yellow-500","hover:bg-yellow-600");
      }
    }
    _onCountdownFinish() {
      try {
        select("cdHMS").classList.add("blink"); select("cdCenti").classList.add("blink");
        this.beeper.startLoop(); // suena hasta que el usuario haga algo
        this._cdState = "idle"; this._updateCdPrimary();
      } catch (e) { console.error("[CuentaRegresiva] finish", e); }
    }
  }

  // Boot
  try { window.addEventListener("DOMContentLoaded", () => new App()); }
  catch (e) { console.error("[App] inicio", e); }
})();
