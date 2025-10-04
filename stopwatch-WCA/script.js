let startTime = 0;
let elapsedTime = 0;
let running = false;
let timerInterval;

const timeDisplay = document.getElementById("time");
const msDisplay = document.getElementById("ms");
const startBtn = document.getElementById("start");
const clearBtn = document.getElementById("clear");

startBtn.addEventListener("click", () => {
  if (!running) {
    running = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 10);
    startBtn.textContent = "Stop";
  } else {
    running = false;
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime;
    startBtn.textContent = "Start";
  }
});

clearBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  running = false;
  elapsedTime = 0;
  startTime = 0;
  timeDisplay.textContent = "00:00:00";
  msDisplay.textContent = "000";
  startBtn.textContent = "Start";
});

function updateTime() {
  elapsedTime = Date.now() - startTime;

  let hours = Math.floor(elapsedTime / 3600000);
  let minutes = Math.floor((elapsedTime % 3600000) / 60000);
  let seconds = Math.floor((elapsedTime % 60000) / 1000);
  let milliseconds = elapsedTime % 1000;

  timeDisplay.textContent = 
    `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  msDisplay.textContent = `${milliseconds.toString().padStart(3, '0')}`;
}

function pad(unit) {
  return unit.toString().padStart(2, '0');
}
