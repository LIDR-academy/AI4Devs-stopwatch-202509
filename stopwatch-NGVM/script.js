let mainBtn = document.getElementById("mainBtn");
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

mainBtn.addEventListener("click", () => {
  if (!isRunning && mainBtn.textContent === "Start") {
    // Start
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;
    mainBtn.textContent = "Pause";
    mainBtn.className = "pause";
  } else if (isRunning && mainBtn.textContent === "Pause") {
    // Pause
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime;
    isRunning = false;
    mainBtn.textContent = "Continue";
    mainBtn.className = "continue";
  } else if (!isRunning && mainBtn.textContent === "Continue") {
    // Continue
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;
    mainBtn.textContent = "Pause";
    mainBtn.className = "pause";
  }
});

clearBtn.addEventListener("click", () => {
  // Reset
  clearInterval(timerInterval);
  isRunning = false;
  elapsedTime = 0;
  timeDisplay.textContent = "00:00:00";
  msDisplay.textContent = "000";
  mainBtn.textContent = "Start";
  mainBtn.className = "start";
});
