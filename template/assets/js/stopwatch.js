// Cronómetro preciso y simple con performance.now() y requestAnimationFrame
export class Stopwatch {
  constructor({ onTick } = {}) {
    this._onTick = typeof onTick === 'function' ? onTick : () => {};
    this._startTs = 0;      // perf.now en el último inicio
    this._baseElapsed = 0;  // acumulado cuando está pausado
    this._rafId = null;
    this._running = false;
  }

  get isRunning() { return this._running; }

  // Tiempo total transcurrido en ms
  elapsed() {
    if (!this._running) return this._baseElapsed;
    return this._baseElapsed + (performance.now() - this._startTs);
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._startTs = performance.now();
    const loop = () => {
      this._onTick(this.elapsed());
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  pause() {
    if (!this._running) return;
    this._running = false;
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
    this._baseElapsed += performance.now() - this._startTs;
  }

  reset() {
    this._running = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;
    this._startTs = 0;
    this._baseElapsed = 0;
    this._onTick(0);
  }
}

// Utilidad: formatea ms -> HH:MM:SS.mmm
export function formatTime(ms) {
  const totalMs = Math.max(0, Math.floor(ms));
  const milli = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  const pad2 = (n) => String(n).padStart(2, '0');
  const pad3 = (n) => String(n).padStart(3, '0');
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}.${pad3(milli)}`;
}
