// script.js
// Cronómetro preciso usando performance.now() y requestAnimationFrame
// Comentarios en español explicando la lógica

// Elementos del DOM
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const msEl = document.getElementById('milliseconds');

const toggleBtn = document.getElementById('toggleBtn');
const clearBtn = document.getElementById('clearBtn');

/*
 Estado y variables de tiempo
 - running: indica si el cronómetro está en ejecución.
 - startTime: timestamp (performance.now) cuando se inició la sesión actual.
 - elapsedBefore: tiempo (ms) acumulado de sesiones previas (si se pausó y reanudó).
 - rafId: id del requestAnimationFrame para poder cancelarlo.
*/
let running = false;
let startTime = 0;
let elapsedBefore = 0;
let rafId = null;

/**
 * formatea un número con ceros a la izquierda
 * @param {number} value - valor numérico
 * @param {number} length - longitud deseada (ej: 2 para "04", 3 para "005")
 * @returns {string}
 */
function pad(value, length) {
  return String(value).padStart(length, '0');
}

/**
 * Devuelve el tiempo transcurrido total en milisegundos
 * Si está corriendo: (now - startTime) + elapsedBefore
 * Si está detenido: elapsedBefore
 */
function getElapsed() {
  if (running) {
    return (performance.now() - startTime) + elapsedBefore;
  }
  return elapsedBefore;
}

/**
 * Actualiza la UI con el tiempo calculado.
 * Convierte ms totales a HH:MM:SS y milisegundos (3 dígitos).
 */
function updateDisplay() {
  const elapsed = getElapsed();

  // horas, minutos, segundos y milisegundos
  const totalMs = Math.floor(elapsed);
  const ms = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  hoursEl.textContent = pad(hours, 2);
  minutesEl.textContent = pad(minutes, 2);
  secondsEl.textContent = pad(seconds, 2);
  msEl.textContent = pad(ms, 3);
}

/**
 * Loop principal cuando el cronómetro está en marcha.
 * Se usa requestAnimationFrame para UI fluida y performance.now para precisión.
 */
function tick() {
  updateDisplay();
  // Guardamos rafId para poder detener el loop
  rafId = requestAnimationFrame(tick);
}

/**
 * Inicia o reanuda el cronómetro.
 * - Si ya está corriendo, no hace nada.
 * - Si no está corriendo, fija startTime y comienza el loop.
 */
function start() {
  if (running) return;
  // marcar inicio con performance.now (preciso)
  startTime = performance.now();
  running = true;
  toggleBtn.textContent = 'Pause';
  toggleBtn.setAttribute('aria-pressed', 'true');
  // iniciar animación
  rafId = requestAnimationFrame(tick);
}

/**
 * Pausa el cronómetro.
 * - Calcula el tiempo acumulado y detiene el loop.
 */
function pause() {
  if (!running) return;
  // calcular elapsed acumulado
  elapsedBefore = getElapsed();
  running = false;
  toggleBtn.textContent = 'Continue';
  toggleBtn.setAttribute('aria-pressed', 'false');
  // detener requestAnimationFrame
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  updateDisplay(); // última actualización para asegurar precisión
}

/**
 * Reinicia el cronómetro a cero y lo detiene.
 */
function clearAll() {
  // detener si está corriendo
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  running = false;
  startTime = 0;
  elapsedBefore = 0;
  toggleBtn.textContent = 'Start';
  toggleBtn.setAttribute('aria-pressed', 'false');
  // actualizar la UI a ceros
  updateDisplay();
}

/**
 * Función que alterna entre Start / Pause / Continue
 * - Si estaba detenido y elapsedBefore === 0 => Start
 * - Si estaba corriendo => Pause
 * - Si estaba detenido y elapsedBefore > 0 => Continue
 */
function toggle() {
  if (!running && elapsedBefore === 0) {
    // Inicio limpio
    start();
    return;
  }
  if (running) {
    // Si está corriendo -> pausar
    pause();
    return;
  }
  // Si está detenido pero hay tiempo -> continuar
  if (!running && elapsedBefore > 0) {
    start();
  }
}

/* ---------- Event listeners ---------- */
toggleBtn.addEventListener('click', toggle);
clearBtn.addEventListener('click', clearAll);

/* Soporte teclado (Enter/Espacio) para los botones por accesibilidad */
toggleBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggle();
  }
});
clearBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    clearAll();
  }
});

/* Inicializa el display en 00:00:00:000 al cargar la página */
document.addEventListener('DOMContentLoaded', () => {
  clearAll();
});
