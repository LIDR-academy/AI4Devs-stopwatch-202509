// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const clearBtn = document.getElementById('clearBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');

// Timer State Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCounter = 1;

// Format time into MM:SS:MS
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(ms).padStart(2, '0')}`;
}

// Update the timer display
function updateDisplay() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    timerDisplay.textContent = formatTime(elapsedTime);
}

// Start the timer
function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10);
        isRunning = true;
        
        // Update button states
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        clearBtn.disabled = false;
        lapBtn.disabled = false;
        pauseBtn.textContent = 'Pause';
    }
}

// Pause the timer
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        
        // Update button states
        startBtn.disabled = true;
        pauseBtn.textContent = 'Resume';
        lapBtn.disabled = true;
    }
}

// Resume the timer (same as start but called from stop button)
function resumeTimer() {
    if (!isRunning && elapsedTime > 0) {
        startTimer();
    }
}

// Clear/Reset the timer
function clearTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    lapCounter = 1;
    
    // Reset display
    timerDisplay.textContent = '00:00:00';
    
    // Clear laps
    lapsList.innerHTML = '';
    
    // Reset button states - Clear becomes disabled after reset
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    clearBtn.disabled = true;
    lapBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
}

// Record a lap time
function recordLap() {
    if (isRunning) {
        const lapTime = formatTime(elapsedTime);
        const lapItem = document.createElement('li');
        
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapCounter}</span>
            <span class="lap-time">${lapTime}</span>
        `;
        
        // Insert at the beginning of the list
        lapsList.insertBefore(lapItem, lapsList.firstChild);
        
        lapCounter++;
    }
}

// Handle Pause/Resume button click
function handlePauseResumeClick() {
    if (isRunning) {
        pauseTimer();
    } else if (elapsedTime > 0) {
        resumeTimer();
    }
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', handlePauseResumeClick);
clearBtn.addEventListener('click', clearTimer);
lapBtn.addEventListener('click', recordLap);

// Initialize display
timerDisplay.textContent = '00:00:00';