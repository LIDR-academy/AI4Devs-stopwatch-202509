import { Stopwatch, formatTime } from './stopwatch.js';

// Elementos UI
const display = document.getElementById('display');
const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');

// Instancia del cronómetro
const sw = new Stopwatch({
  onTick: (ms) => {
    display.value = display.textContent = formatTime(ms);
  }
});

// Estado inicial del display
display.value = display.textContent = formatTime(0);
updateStartPauseLabel();

// Eventos UI
startPauseBtn.addEventListener('click', toggleStartPause);
resetBtn.addEventListener('click', () => {
  sw.reset();
  startPauseBtn.dataset.state = 'stopped';
  updateStartPauseLabel();
  resetBtn.disabled = true;
  startPauseBtn.focus();
});

function toggleStartPause() {
  const running = sw.isRunning;
  if (!running) {
    sw.start();
    startPauseBtn.dataset.state = 'running';
    resetBtn.disabled = false;
  } else {
    sw.pause();
    startPauseBtn.dataset.state = 'paused';
  }
  updateStartPauseLabel();
}

function updateStartPauseLabel() {
  const state = startPauseBtn.dataset.state;
  const startSpan = startPauseBtn.querySelector('[data-start]');
  const pauseSpan = startPauseBtn.querySelector('[data-pause]');
  if (state === 'running') {
    startSpan.classList.add('hidden');
    pauseSpan.classList.remove('hidden');
    startPauseBtn.setAttribute('aria-label', 'Pausar cronómetro');
  } else {
    startSpan.classList.remove('hidden');
    pauseSpan.classList.add('hidden');
    startPauseBtn.setAttribute('aria-label', 'Iniciar cronómetro');
  }
}

// Atajos de teclado
document.addEventListener('keydown', (e) => {
  const tag = (e.target && e.target.tagName) || '';
  const isTypingContext = tag === 'INPUT' || tag === 'TEXTAREA' || e.isComposing;
  if (isTypingContext) return;

  if (e.code === 'Space') { // Iniciar/Pausar
    e.preventDefault();
    toggleStartPause();
  }
  if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey && !e.altKey) { // Reiniciar
    e.preventDefault();
    resetBtn.click();
  }
});

// Pausa opcional al perder visibilidad (ahorro CPU)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && sw.isRunning) {
    sw.pause();
    startPauseBtn.dataset.state = 'paused';
    updateStartPauseLabel();
  }
});
