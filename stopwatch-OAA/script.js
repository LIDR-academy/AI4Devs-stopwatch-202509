// Global state management
let currentScreen = 'landing';
let stopwatchInterval = null;
let countdownInterval = null;
let stopwatchTime = 0;
let countdownTime = 0;
let countdownSetTime = 0;
let isStopwatchRunning = false;
let isCountdownRunning = false;
let countdownInput = '';

// Screen navigation
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // Update header title based on screen
    updateHeaderTitle(screenId);
}

function updateHeaderTitle(screenId) {
    const headerTitle = document.getElementById('header-title');
    switch(screenId) {
        case 'landing-screen':
            headerTitle.textContent = 'Timer and Countdown';
            break;
        case 'stopwatch-screen':
            headerTitle.textContent = 'Stopwatch';
            break;
        case 'countdown-set-screen':
            headerTitle.textContent = 'Countdown - Set Time';
            break;
        case 'countdown-execute-screen':
            headerTitle.textContent = 'Countdown';
            break;
        default:
            headerTitle.textContent = 'Timer and Countdown';
    }
}

function goBack() {
    switch(currentScreen) {
        case 'stopwatch-screen':
        case 'countdown-set-screen':
        case 'countdown-execute-screen':
            showScreen('landing-screen');
            break;
        default:
            showScreen('landing-screen');
    }
}

// Landing screen navigation
function showStopwatch() {
    showScreen('stopwatch-screen');
    resetStopwatch();
}

function showCountdownSet() {
    showScreen('countdown-set-screen');
    resetCountdownSet();
}

// Stopwatch functionality
function resetStopwatch() {
    stopwatchTime = 0;
    isStopwatchRunning = false;
    updateStopwatchDisplay();
    document.getElementById('stopwatch-start').textContent = 'Start';
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

function toggleStopwatch() {
    if (isStopwatchRunning) {
        // Stop the stopwatch
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        isStopwatchRunning = false;
        document.getElementById('stopwatch-start').textContent = 'Start';
    } else {
        // Start the stopwatch
        isStopwatchRunning = true;
        document.getElementById('stopwatch-start').textContent = 'Stop';
        stopwatchInterval = setInterval(updateStopwatch, 10);
    }
}

function updateStopwatch() {
    stopwatchTime += 10; // Increment by 10ms
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const totalMs = stopwatchTime;
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = Math.floor((totalMs % 1000) / 10);

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const msString = milliseconds.toString().padStart(3, '0');

    document.getElementById('stopwatch-time').textContent = timeString;
    document.getElementById('stopwatch-ms').textContent = msString;
}

function clearStopwatch() {
    resetStopwatch();
}

// Countdown set functionality
function resetCountdownSet() {
    countdownInput = '';
    countdownSetTime = 0;
    updateCountdownSetDisplay();
}

function addDigit(digit) {
    if (countdownInput.length < 6) { // Max 6 digits (HHMMSS)
        countdownInput += digit;
        updateCountdownSetDisplay();
    }
}

function updateCountdownSetDisplay() {
    let displayTime = countdownInput.padStart(6, '0');
    const hours = displayTime.substring(0, 2);
    const minutes = displayTime.substring(2, 4);
    const seconds = displayTime.substring(4, 6);
    
    document.getElementById('countdown-set-time').textContent = `${hours}:${minutes}:${seconds}`;
}

function setCountdown() {
    if (countdownInput.length === 0) return;
    
    let displayTime = countdownInput.padStart(6, '0');
    const hours = parseInt(displayTime.substring(0, 2));
    const minutes = parseInt(displayTime.substring(2, 4));
    const seconds = parseInt(displayTime.substring(4, 6));
    
    countdownSetTime = hours * 3600000 + minutes * 60000 + seconds * 1000;
    countdownTime = countdownSetTime;
    
    showScreen('countdown-execute-screen');
    updateCountdownDisplay();
    resetCountdown();
}

function clearCountdownSet() {
    resetCountdownSet();
}

// Countdown execute functionality
function resetCountdown() {
    countdownTime = countdownSetTime;
    isCountdownRunning = false;
    updateCountdownDisplay();
    document.getElementById('countdown-start').textContent = 'Start';
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function toggleCountdown() {
    if (isCountdownRunning) {
        // Stop the countdown
        clearInterval(countdownInterval);
        countdownInterval = null;
        isCountdownRunning = false;
        document.getElementById('countdown-start').textContent = 'Start';
    } else {
        // Start the countdown
        if (countdownTime <= 0) {
            alert('Countdown time is up!');
            return;
        }
        isCountdownRunning = true;
        document.getElementById('countdown-start').textContent = 'Stop';
        countdownInterval = setInterval(updateCountdown, 10);
    }
}

function updateCountdown() {
    countdownTime -= 10; // Decrement by 10ms
    
    if (countdownTime <= 0) {
        countdownTime = 0;
        clearInterval(countdownInterval);
        countdownInterval = null;
        isCountdownRunning = false;
        document.getElementById('countdown-start').textContent = 'Start';
        alert('Time\'s up!');
    }
    
    updateCountdownDisplay();
}

function updateCountdownDisplay() {
    const totalMs = Math.max(0, countdownTime);
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = Math.floor((totalMs % 1000) / 10);

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const msString = milliseconds.toString().padStart(3, '0');

    document.getElementById('countdown-time').textContent = timeString;
    document.getElementById('countdown-ms').textContent = msString;
}

function clearCountdown() {
    resetCountdown();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state
    showScreen('landing-screen');
    
    // Add keyboard support for countdown set screen
    document.addEventListener('keydown', function(event) {
        if (currentScreen === 'countdown-set-screen') {
            if (event.key >= '0' && event.key <= '9') {
                addDigit(event.key);
            } else if (event.key === 'Enter') {
                setCountdown();
            } else if (event.key === 'Escape' || event.key === 'Backspace') {
                clearCountdownSet();
            }
        }
    });
});
