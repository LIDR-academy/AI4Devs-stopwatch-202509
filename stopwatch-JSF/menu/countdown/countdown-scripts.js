// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const inputSection = document.getElementById('inputSection');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const clearBtn = document.getElementById('clearBtn');

// Timer State Variables
let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isRunning = false;

// Format time into HH:MM:SS
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update the timer display
function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);
}

// Countdown tick function
function countdownTick() {
    if (remainingSeconds > 0) {
        remainingSeconds--;
        updateDisplay();
    } else {
        // Countdown finished
        clearInterval(timerInterval);
        isRunning = false;
        
        // Show alert
        alert("Done! Do whatever you need to do");
        
        // Reset to initial state
        clearTimer();
    }
}

// Start the countdown
function startTimer() {
    // Get input values
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    // Calculate total seconds
    totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    // Validate input
    if (totalSeconds <= 0) {
        alert("Please enter a valid time");
        return;
    }
    
    if (!isRunning) {
        // If starting fresh, set remaining seconds
        if (remainingSeconds === 0) {
            remainingSeconds = totalSeconds;
            updateDisplay();
        }
        
        // Hide input section
        inputSection.style.display = 'none';
        
        // Start countdown
        timerInterval = setInterval(countdownTick, 1000);
        isRunning = true;
        
        // Update button states
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        clearBtn.disabled = false;
        pauseBtn.textContent = 'Pause';
    }
}

// Pause the countdown
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        
        // Update button states
        startBtn.disabled = true;
        pauseBtn.textContent = 'Resume';
    }
}

// Resume the countdown
function resumeTimer() {
    if (!isRunning && remainingSeconds > 0) {
        timerInterval = setInterval(countdownTick, 1000);
        isRunning = true;
        
        // Update button states
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        pauseBtn.textContent = 'Pause';
    }
}

// Clear/Reset the countdown
function clearTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    totalSeconds = 0;
    remainingSeconds = 0;
    
    // Reset display
    timerDisplay.textContent = '00:00:00';
    
    // Reset inputs
    hoursInput.value = '00';
    minutesInput.value = '00';
    secondsInput.value = '00';
    
    // Show input section
    inputSection.style.display = 'block';
    
    // Reset button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    clearBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
}

// Handle Pause/Resume button click
function handlePauseResumeClick() {
    if (isRunning) {
        pauseTimer();
    } else if (remainingSeconds > 0) {
        resumeTimer();
    }
}

// Click-to-select: Select all content when clicking on input
function selectAllOnClick(e) {
    e.target.select();
}

hoursInput.addEventListener('click', selectAllOnClick);
minutesInput.addEventListener('click', selectAllOnClick);
secondsInput.addEventListener('click', selectAllOnClick);

// Also select all on focus (when tabbing between fields)
hoursInput.addEventListener('focus', selectAllOnClick);
minutesInput.addEventListener('focus', selectAllOnClick);
secondsInput.addEventListener('focus', selectAllOnClick);

// Validate and restrict input for hours (00-23)
function handleHoursInput(e) {
    let value = e.target.value;
    
    // Only allow digits
    value = value.replace(/[^0-9]/g, '');
    
    // If first digit is entered
    if (value.length === 1) {
        const firstDigit = parseInt(value);
        // First digit can only be 0, 1, or 2
        if (firstDigit > 2) {
            value = '';
        }
    }
    
    // If two digits are entered
    if (value.length === 2) {
        const numValue = parseInt(value);
        // Hours must be 00-23
        if (numValue > 23) {
            value = value.substring(0, 1);
        }
    }
    
    e.target.value = value;
}

// Validate and restrict input for minutes/seconds (00-59)
function handleMinutesSecondsInput(e) {
    let value = e.target.value;
    
    // Only allow digits
    value = value.replace(/[^0-9]/g, '');
    
    // If first digit is entered
    if (value.length === 1) {
        const firstDigit = parseInt(value);
        // First digit can only be 0-5
        if (firstDigit > 5) {
            value = '';
        }
    }
    
    // If two digits are entered
    if (value.length === 2) {
        const numValue = parseInt(value);
        // Must be 00-59
        if (numValue > 59) {
            value = value.substring(0, 1);
        }
    }
    
    e.target.value = value;
}

// Format input to always show 2 digits
function formatInputValue(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (value === '') {
        value = '00';
    } else if (value.length === 1) {
        value = '0' + value;
    }
    input.value = value;
}

// Add input event listeners with restrictions
hoursInput.addEventListener('input', handleHoursInput);
minutesInput.addEventListener('input', handleMinutesSecondsInput);
secondsInput.addEventListener('input', handleMinutesSecondsInput);

// Format on blur (when user leaves the field)
hoursInput.addEventListener('blur', () => formatInputValue(hoursInput));
minutesInput.addEventListener('blur', () => formatInputValue(minutesInput));
secondsInput.addEventListener('blur', () => formatInputValue(secondsInput));

// Prevent non-numeric key presses
function preventNonNumeric(e) {
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
}

hoursInput.addEventListener('keypress', preventNonNumeric);
minutesInput.addEventListener('keypress', preventNonNumeric);
secondsInput.addEventListener('keypress', preventNonNumeric);

// Validate input values
function validateInput(input, max) {
    let value = parseInt(input.value) || 0;
    if (value < 0) value = 0;
    if (value > max) value = max;
    input.value = value;
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', handlePauseResumeClick);
clearBtn.addEventListener('click', clearTimer);

// Initialize display
timerDisplay.textContent = '00:00:00';