/**
 * Stopwatch and Countdown Timer Application
 * Production-ready implementation with best practices
 */

// Application State
const state = {
    mode: 'stopwatch', // 'stopwatch' or 'countdown'
    isRunning: false,
    isPaused: false,
    startTime: 0,
    elapsedTime: 0,
    countdownDuration: 0,
    animationId: null
};

// DOM Elements
const elements = {
    stopwatchTab: null,
    countdownTab: null,
    timeDisplay: null,
    millisecondsDisplay: null,
    countdownInput: null,
    startStopBtn: null,
    resetBtn: null,
    errorMessage: null,
    hoursInput: null,
    minutesInput: null,
    secondsInput: null
};

/**
 * Initialize the application
 */
function init() {
    try {
        console.log('[Init] Initializing Stopwatch Application');
        
        // Cache DOM elements
        cacheElements();
        
        // Attach event listeners
        attachEventListeners();
        
        // Set initial state
        updateDisplay();
        
        console.log('[Init] Application initialized successfully');
    } catch (error) {
        console.error('[Init] Initialization failed:', error);
        showError('Failed to initialize application. Please refresh the page.');
    }
}

/**
 * Cache DOM elements for performance
 */
function cacheElements() {
    elements.stopwatchTab = document.getElementById('stopwatchTab');
    elements.countdownTab = document.getElementById('countdownTab');
    elements.timeDisplay = document.getElementById('timeDisplay');
    elements.millisecondsDisplay = document.getElementById('millisecondsDisplay');
    elements.countdownInput = document.getElementById('countdownInput');
    elements.startStopBtn = document.getElementById('startStopBtn');
    elements.resetBtn = document.getElementById('resetBtn');
    elements.errorMessage = document.getElementById('errorMessage');
    elements.hoursInput = document.getElementById('hours');
    elements.minutesInput = document.getElementById('minutes');
    elements.secondsInput = document.getElementById('seconds');
    
    // Validate all elements exist
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            throw new Error(`Required element not found: ${key}`);
        }
    }
}

/**
 * Attach event listeners to interactive elements
 */
function attachEventListeners() {
    // Mode switcher
    elements.stopwatchTab.addEventListener('click', () => switchMode('stopwatch'));
    elements.countdownTab.addEventListener('click', () => switchMode('countdown'));
    
    // Control buttons
    elements.startStopBtn.addEventListener('click', toggleStartStop);
    elements.resetBtn.addEventListener('click', reset);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // Input validation
    [elements.hoursInput, elements.minutesInput, elements.secondsInput].forEach(input => {
        input.addEventListener('input', validateInput);
        input.addEventListener('blur', normalizeInput);
    });
}

/**
 * Handle keyboard shortcuts for accessibility
 */
function handleKeyboard(e) {
    try {
        // Space bar: Start/Stop
        if (e.code === 'Space' && !isInputFocused()) {
            e.preventDefault();
            toggleStartStop();
        }
        // R key: Reset
        else if (e.key.toLowerCase() === 'r' && !isInputFocused()) {
            e.preventDefault();
            reset();
        }
        // Tab 1: Stopwatch mode
        else if (e.key === '1' && !isInputFocused()) {
            e.preventDefault();
            switchMode('stopwatch');
        }
        // Tab 2: Countdown mode
        else if (e.key === '2' && !isInputFocused()) {
            e.preventDefault();
            switchMode('countdown');
        }
    } catch (error) {
        console.error('[Keyboard] Error handling keyboard event:', error);
    }
}

/**
 * Check if an input field is focused
 */
function isInputFocused() {
    return document.activeElement.tagName === 'INPUT';
}

/**
 * Switch between stopwatch and countdown modes
 */
function switchMode(mode) {
    try {
        console.log(`[Mode] Switching to ${mode} mode`);
        
        if (state.isRunning) {
            stop();
        }
        
        state.mode = mode;
        state.elapsedTime = 0;
        
        // Update UI
        if (mode === 'stopwatch') {
            elements.stopwatchTab.classList.add('active');
            elements.countdownTab.classList.remove('active');
            elements.stopwatchTab.setAttribute('aria-selected', 'true');
            elements.countdownTab.setAttribute('aria-selected', 'false');
            elements.countdownInput.classList.add('hidden');
        } else {
            elements.countdownTab.classList.add('active');
            elements.stopwatchTab.classList.remove('active');
            elements.countdownTab.setAttribute('aria-selected', 'true');
            elements.stopwatchTab.setAttribute('aria-selected', 'false');
            elements.countdownInput.classList.remove('hidden');
        }
        
        updateDisplay();
        hideError();
    } catch (error) {
        console.error('[Mode] Error switching mode:', error);
        showError('Failed to switch mode. Please try again.');
    }
}

/**
 * Toggle start/stop state
 */
function toggleStartStop() {
    try {
        if (state.isRunning) {
            pause();
        } else {
            start();
        }
    } catch (error) {
        console.error('[Control] Error toggling start/stop:', error);
        showError('An error occurred. Please try again.');
    }
}

/**
 * Start the timer
 */
function start() {
    try {
        console.log('[Control] Starting timer');
        
        if (state.mode === 'countdown' && !state.isPaused) {
            const duration = getCountdownDuration();
            if (duration <= 0) {
                showError('Please set a valid countdown time greater than zero.');
                return;
            }
            state.countdownDuration = duration;
            if (state.elapsedTime === 0) {
                state.elapsedTime = duration;
            }
        }
        
        state.isRunning = true;
        state.isPaused = false;
        state.startTime = Date.now() - (state.mode === 'stopwatch' ? state.elapsedTime : 0);
        
        // Update button UI
        elements.startStopBtn.textContent = 'Pause';
        elements.startStopBtn.classList.remove('continue');
        elements.startStopBtn.classList.add('pause');
        elements.startStopBtn.setAttribute('aria-label', 'Pause timer');
        
        // Disable inputs during countdown
        if (state.mode === 'countdown') {
            setInputsDisabled(true);
        }
        
        // Start animation loop
        state.animationId = requestAnimationFrame(updateTimer);
        
        hideError();
    } catch (error) {
        console.error('[Control] Error starting timer:', error);
        showError('Failed to start timer. Please try again.');
    }
}

/**
 * Pause the timer
 */
function pause() {
    try {
        console.log('[Control] Pausing timer');
        
        state.isRunning = false;
        state.isPaused = true;
        
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
            state.animationId = null;
        }
        
        // Update button UI to show Continue
        elements.startStopBtn.textContent = 'Continue';
        elements.startStopBtn.classList.remove('pause');
        elements.startStopBtn.classList.add('continue');
        elements.startStopBtn.setAttribute('aria-label', 'Continue timer');
    } catch (error) {
        console.error('[Control] Error pausing timer:', error);
        showError('An error occurred while pausing the timer.');
    }
}

/**
 * Stop the timer (kept for compatibility)
 */
function stop() {
    pause();
}

/**
 * Reset the timer
 */
function reset() {
    try {
        console.log('[Control] Clearing timer');
        
        state.isRunning = false;
        state.isPaused = false;
        
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
            state.animationId = null;
        }
        
        state.elapsedTime = 0;
        state.countdownDuration = 0;
        
        // Reset button UI to Start (green)
        elements.startStopBtn.textContent = 'Start';
        elements.startStopBtn.classList.remove('pause', 'continue');
        elements.startStopBtn.setAttribute('aria-label', 'Start timer');
        
        // Enable inputs
        if (state.mode === 'countdown') {
            setInputsDisabled(false);
        }
        
        updateDisplay();
        hideError();
    } catch (error) {
        console.error('[Control] Error clearing timer:', error);
        showError('Failed to clear timer.');
    }
}

/**
 * Update timer on each animation frame
 */
function updateTimer() {
    try {
        if (!state.isRunning) return;
        
        if (state.mode === 'stopwatch') {
            state.elapsedTime = Date.now() - state.startTime;
        } else {
            const elapsed = Date.now() - state.startTime;
            state.elapsedTime = Math.max(0, state.countdownDuration - elapsed);
            
            // Check if countdown finished
            if (state.elapsedTime <= 0) {
                state.elapsedTime = 0;
                updateDisplay();
                pause();
                playNotification();
                console.log('[Timer] Countdown completed');
                return;
            }
        }
        
        updateDisplay();
        state.animationId = requestAnimationFrame(updateTimer);
    } catch (error) {
        console.error('[Timer] Error updating timer:', error);
        stop();
        showError('Timer error occurred. Please reset and try again.');
    }
}

/**
 * Update the display with current time
 */
function updateDisplay() {
    try {
        const time = formatTime(state.elapsedTime);
        elements.timeDisplay.textContent = time.main;
        elements.millisecondsDisplay.textContent = time.milliseconds;
    } catch (error) {
        console.error('[Display] Error updating display:', error);
    }
}

/**
 * Format milliseconds to time string
 */
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000));
    
    return {
        main: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
        milliseconds: `.${pad(milliseconds, 3)}`
    };
}

/**
 * Pad number with leading zeros
 */
function pad(num, length = 2) {
    return String(num).padStart(length, '0');
}

/**
 * Get countdown duration from inputs in milliseconds
 */
function getCountdownDuration() {
    try {
        const hours = parseInt(elements.hoursInput.value) || 0;
        const minutes = parseInt(elements.minutesInput.value) || 0;
        const seconds = parseInt(elements.secondsInput.value) || 0;
        
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    } catch (error) {
        console.error('[Input] Error getting countdown duration:', error);
        return 0;
    }
}

/**
 * Validate input values
 */
function validateInput(e) {
    try {
        const input = e.target;
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        
        // Remove non-numeric characters
        input.value = input.value.replace(/[^0-9]/g, '');
        
        // Enforce limits
        if (value < min) input.value = min;
        if (value > max) input.value = max;
    } catch (error) {
        console.error('[Input] Error validating input:', error);
    }
}

/**
 * Normalize input on blur
 */
function normalizeInput(e) {
    try {
        const input = e.target;
        if (input.value === '') {
            input.value = '0';
        }
    } catch (error) {
        console.error('[Input] Error normalizing input:', error);
    }
}

/**
 * Enable/disable countdown inputs
 */
function setInputsDisabled(disabled) {
    elements.hoursInput.disabled = disabled;
    elements.minutesInput.disabled = disabled;
    elements.secondsInput.disabled = disabled;
}

/**
 * Play notification sound (visual feedback for countdown end)
 */
function playNotification() {
    try {
        // Visual notification - flash the display
        elements.timeDisplay.style.animation = 'flash 0.5s ease-in-out 3';
        setTimeout(() => {
            elements.timeDisplay.style.animation = '';
        }, 1500);
    } catch (error) {
        console.error('[Notification] Error playing notification:', error);
    }
}

/**
 * Show error message
 */
function showError(message) {
    try {
        elements.errorMessage.textContent = message;
        elements.errorMessage.classList.remove('hidden');
        console.warn('[Error] Displayed error:', message);
    } catch (error) {
        console.error('[Error] Failed to show error message:', error);
    }
}

/**
 * Hide error message
 */
function hideError() {
    elements.errorMessage.classList.add('hidden');
    elements.errorMessage.textContent = '';
}

// Add flash animation for countdown completion
const style = document.createElement('style');
style.textContent = `
    @keyframes flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
`;
document.head.appendChild(style);

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}