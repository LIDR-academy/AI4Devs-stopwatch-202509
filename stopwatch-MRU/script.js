// State management
let mode = 'stopwatch';
let isRunning = false;
let startTime = 0;
let currentTime = 0;
let intervalId = null;
let countdownDuration = 0;

// DOM Elements
const display = document.querySelector('.display');
const timeDisplay = document.querySelector('.display .time');
const millisecondsDisplay = document.querySelector('.display .milliseconds');
const modeButtons = document.querySelectorAll('.mode-btn');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const continueBtn = document.getElementById('continueBtn');
const clearBtn = document.getElementById('clearBtn');
const countdownInput = document.querySelector('.countdown-input');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

// Event Listeners
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setMode(btn.dataset.mode);
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
continueBtn.addEventListener('click', continueTimer);
clearBtn.addEventListener('click', clearTimer);

// Timer functions
function startTimer() {
    if (isRunning) return;

    if (mode === 'countdown') {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        
        countdownDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;
        if (countdownDuration <= 0) return;
        
        currentTime = countdownDuration;
        display.classList.remove('time-up');
    }

    isRunning = true;
    startTime = Date.now() - (mode === 'stopwatch' ? currentTime : (countdownDuration - currentTime));
    
    intervalId = setInterval(() => {
        if (mode === 'stopwatch') {
            currentTime = Date.now() - startTime;
            updateDisplay(currentTime);
        } else {
            const timeLeft = Math.max(0, countdownDuration - (Date.now() - startTime));
            if (timeLeft === 0 && currentTime !== 0) {
                pauseTimer();
                currentTime = 0;
                updateDisplay(0);
                display.classList.add('time-up');
                return;
            }
            currentTime = timeLeft;
            updateDisplay(timeLeft);
        }
    }, 50);

    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    continueBtn.style.display = 'none';
}

function pauseTimer() {
    clearInterval(intervalId);
    isRunning = false;
    
    pauseBtn.style.display = 'none';
    continueBtn.style.display = 'inline-block';
}

function continueTimer() {
    if (!isRunning) {
        startTime = Date.now() - (mode === 'stopwatch' ? currentTime : (countdownDuration - currentTime));
        isRunning = true;

        intervalId = setInterval(() => {
            if (mode === 'stopwatch') {
                currentTime = Date.now() - startTime;
                updateDisplay(currentTime);
            } else {
                const timeLeft = Math.max(0, countdownDuration - (Date.now() - startTime));
                if (timeLeft === 0 && currentTime !== 0) {
                    pauseTimer();
                    currentTime = 0;
                    updateDisplay(0);
                    display.classList.add('time-up');
                    return;
                }
                currentTime = timeLeft;
                updateDisplay(timeLeft);
            }
        }, 50);

        continueBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
    }
}

function clearTimer() {
    clearInterval(intervalId);
    isRunning = false;
    currentTime = 0;
    updateDisplay(0);
    display.classList.remove('time-up');
    
    if (mode === 'countdown') {
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';
    }
    
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    continueBtn.style.display = 'none';
}

function setMode(newMode) {
    mode = newMode;
    clearTimer();
    countdownInput.classList.toggle('visible', mode === 'countdown');
}

function updateDisplay(time) {
    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((time % 1000) / 10);

    timeDisplay.textContent = `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
    millisecondsDisplay.textContent = padNumber(milliseconds);
}

function padNumber(num) {
    return num.toString().padStart(2, '0');
}

// Initialize
pauseBtn.style.display = 'none';
continueBtn.style.display = 'none';
