// index.js
(() => {
    const hh = document.getElementById("hh");
    const mm = document.getElementById("mm");
    const ss = document.getElementById("ss");
    const ms = document.getElementById("ms");
  
    const startBtn = document.getElementById("startBtn");
    const clearBtn = document.getElementById("clearBtn");
    const screen = document.getElementById("screen");
  
    let isRunning = false;
    let rafId = null;
  
    // Tiempo acumulado en milisegundos cuando está pausado/detenido
    let elapsed = 0;
  
    // Marca de inicio relativa para restar al performance.now()
    let startTime = 0;
  
    function pad2(n) {
      return String(n).padStart(2, "0");
    }
  
    function pad3(n) {
      return String(n).padStart(3, "0");
    }
  
    function formatAndRender(totalMs) {
      const total = Math.max(0, Math.floor(totalMs));
      const millis = total % 1000;
  
      const totalSeconds = Math.floor(total / 1000);
      const seconds = totalSeconds % 60;
  
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
  
      const hours = Math.floor(totalMinutes / 60);
  
      hh.textContent = pad2(hours);
      mm.textContent = pad2(minutes);
      ss.textContent = pad2(seconds);
      ms.textContent = pad3(millis);
    }
  
    function step() {
      const now = performance.now();
      const total = now - startTime + elapsed;
      formatAndRender(total);
      rafId = requestAnimationFrame(step);
    }
  
    function start() {
      if (isRunning) return;
      isRunning = true;
      startBtn.textContent = "Pause";
      startBtn.setAttribute("aria-pressed", "true");
  
      // Arranca desde el punto donde quedó acumulado
      startTime = performance.now();
      rafId = requestAnimationFrame(step);
    }
  
    function pause() {
      if (!isRunning) return;
      isRunning = false;
      startBtn.textContent = "Resume";
      startBtn.setAttribute("aria-pressed", "false");
  
      cancelAnimationFrame(rafId);
      // Suma lo transcurrido desde el último start
      elapsed = (performance.now() - startTime) + elapsed;
    }
  
    function resume() {
      // Reusa start() pero conservando elapsed
      start();
    }
  
    function clear() {
      isRunning = false;
      cancelAnimationFrame(rafId);
      elapsed = 0;
      startTime = 0;
      formatAndRender(0);
      startBtn.textContent = "Start";
      startBtn.setAttribute("aria-pressed", "false");
    }
  
    // Alterna según estado: Start/Pause/Resume
    startBtn.addEventListener("click", () => {
      if (!isRunning && elapsed === 0) {
        start();
      } else if (isRunning) {
        pause();
      } else {
        // pausado con elapsed > 0
        resume();
      }
    });
  
    clearBtn.addEventListener("click", clear);
  
    // Soporte de teclado: Espacio = start/pause/resume, Escape = clear
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        startBtn.click();
      } else if (e.code === "Escape") {
        e.preventDefault();
        clearBtn.click();
      }
    });
  
    // Inicializa la visual
    formatAndRender(0);
  
    // Mejora accesibilidad: anuncia cambios grandes en el tiempo
    const announceEvery = 1000; // ms
    let lastAnnounce = 0;
    const observerStep = () => {
      if (isRunning) {
        const now = performance.now();
        if (now - lastAnnounce >= announceEvery) {
          screen.setAttribute("aria-label", `Tiempo ${hh.textContent}:${mm.textContent}:${ss.textContent}.${ms.textContent}`);
          lastAnnounce = now;
        }
      }
      requestAnimationFrame(observerStep);
    };
    requestAnimationFrame(observerStep);
  })();
  