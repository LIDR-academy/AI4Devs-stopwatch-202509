let startBtn = document.getElementById("startBtn");
let clearBtn = document.getElementById("clearBtn");
let timeDisplay = document.getElementById("time");
let msDisplay = document.getElementById("milliseconds");

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  let seconds = String(totalSeconds % 60).padStart(2, "0");
  let milliseconds = String(ms % 1000).padStart(3, "0");
  return { hours, minutes, seconds, milliseconds };
}

function updateDisplay() {
  let currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  let { hours, minutes, seconds, milliseconds } = formatTime(elapsedTime);
  timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  msDisplay.textContent = milliseconds;
}

startBtn.addEventListener("click", () => {
  if (!isRunning && startBtn.textContent === "Start") {
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;
    startBtn.textContent = "Pause";
    startBtn.className = "pause";
  } else if (isRunning && startBtn.textContent === "Pause") {
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime;
    isRunning = false;
    startBtn.textContent = "Continue";
    startBtn.className = "continue"; // 🔵 ahora se queda azul
  } else if (!isRunning && startBtn.textContent === "Continue") {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;
    startBtn.textContent = "Pause";
    startBtn.className = "pause";
  }
});

clearBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  isRunning = false;
  elapsedTime = 0;
  timeDisplay.textContent = "00:00:00";
  msDisplay.textContent = "000";
  startBtn.textContent = "Start";
  startBtn.className = ""; // se limpia la clase
});
