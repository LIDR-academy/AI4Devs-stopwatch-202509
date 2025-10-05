// IIFE to encapsulate code and avoid polluting the global scope
(function() {
    'use strict';

    //================================================================
    // 1. DOM ELEMENT SELECTION
    //================================================================
    
    // Main interface elements
    const appChoice = document.getElementById('appChoice');
    const selectStopwatchBtn = document.getElementById('selectStopwatchBtn');
    const selectCountdownBtn = document.getElementById('selectCountdownBtn');
    const backButtons = document.querySelectorAll('.timer__back-btn');

    // Timer containers
    const stopwatchContainer = document.getElementById('stopwatch');
    const countdownContainer = document.getElementById('countdown');

    // Stopwatch elements
    const stopwatchDisplay = document.getElementById('stopwatchDisplay');
    const stopwatchStartStopBtn = document.getElementById('stopwatchStartStopBtn');
    const stopwatchResetBtn = document.getElementById('stopwatchResetBtn');
    const stopwatchLapBtn = document.getElementById('stopwatchLapBtn');
    const lapsList = document.getElementById('lapsList');

    // Countdown elements
    const countdownDisplay = document.getElementById('countdownDisplay');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const countdownStartStopBtn = document.getElementById('countdownStartStopBtn');
    const countdownResetBtn = document.getElementById('countdownResetBtn');
    const countdownInputs = document.getElementById('countdownInputs');


    //================================================================
    // 2. UI NAVIGATION LOGIC
    //================================================================

    function showStopwatch() {
        appChoice.classList.add('hidden');
        countdownContainer.classList.add('hidden');
        stopwatchContainer.classList.remove('hidden');
    }

    function showCountdown() {
        appChoice.classList.add('hidden');
        stopwatchContainer.classList.add('hidden');
        countdownContainer.classList.remove('hidden');
    }

    function showChoiceScreen() {
        // Reset timers before going back to prevent them running in the background
        resetStopwatch();
        resetCountdown();
        stopwatchContainer.classList.add('hidden');
        countdownContainer.classList.add('hidden');
        appChoice.classList.remove('hidden');
    }


    //================================================================
    // 3. STOPWATCH LOGIC & STATE
    //================================================================

    let stopwatchState = {
        startTime: 0,
        elapsedTime: 0,
        timerInterval: null,
        isRunning: false,
        lapCounter: 0
    };

    /**
     * Formats milliseconds into HH:MM:SS.ms format.
     * @param {number} time - Time in milliseconds.
     * @returns {string} Formatted time string.
     */
    function formatStopwatchTime(time) {
        const date = new Date(time);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    /** Updates the stopwatch display based on elapsed time. */
    function updateStopwatchDisplay() {
        const currentTime = Date.now();
        const newElapsedTime = currentTime - stopwatchState.startTime + stopwatchState.elapsedTime;
        stopwatchDisplay.textContent = formatStopwatchTime(newElapsedTime);
    }

    /** Handles starting and stopping the stopwatch. */
    function handleStopwatchStartStop() {
        if (stopwatchState.isRunning) {
            // Stop the watch
            clearInterval(stopwatchState.timerInterval);
            stopwatchState.elapsedTime += Date.now() - stopwatchState.startTime;
            stopwatchState.isRunning = false;
            stopwatchStartStopBtn.textContent = 'Start';
            stopwatchStartStopBtn.dataset.action = 'start';
            stopwatchLapBtn.disabled = true;
        } else {
            // Start the watch
            stopwatchState.startTime = Date.now();
            stopwatchState.isRunning = true;
            stopwatchState.timerInterval = setInterval(updateStopwatchDisplay, 10); // Update every 10ms for accuracy
            stopwatchStartStopBtn.textContent = 'Stop';
            stopwatchStartStopBtn.dataset.action = 'stop';
            stopwatchResetBtn.disabled = false;
            stopwatchLapBtn.disabled = false;
        }
    }

    /** Resets the stopwatch to its initial state. */
    function resetStopwatch() {
        clearInterval(stopwatchState.timerInterval);
        stopwatchState = { ...stopwatchState, startTime: 0, elapsedTime: 0, isRunning: false, lapCounter: 0 };
        stopwatchDisplay.textContent = '00:00:00.000';
        stopwatchStartStopBtn.textContent = 'Start';
        stopwatchStartStopBtn.dataset.action = 'start';
        stopwatchResetBtn.disabled = true;
        stopwatchLapBtn.disabled = true;
        lapsList.innerHTML = '';
    }
    
    /** Records and displays a lap time. */
    function recordLap() {
        if (!stopwatchState.isRunning) return;
        const lapTime = stopwatchDisplay.textContent;
        stopwatchState.lapCounter++;
        const lapItem = document.createElement('li');
        lapItem.className = 'laps__item';
        lapItem.innerHTML = `<span>Lap ${stopwatchState.lapCounter}</span><span>${lapTime}</span>`;
        lapsList.prepend(lapItem); // Add new laps to the top
    }

    //================================================================
    // 4. COUNTDOWN LOGIC & STATE
    //================================================================

    let countdownState = {
        totalSeconds: 0,
        timeRemaining: 0,
        timerInterval: null,
        isRunning: false
    };
    
    /**
     * Formats seconds into HH:MM:SS format.
     * @param {number} totalSeconds - Time in seconds.
     * @returns {string} Formatted time string.
     */
    function formatCountdownTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /** Updates the countdown display. */
    function updateCountdownDisplay() {
        countdownState.timeRemaining--;
        countdownDisplay.textContent = formatCountdownTime(countdownState.timeRemaining);

        if (countdownState.timeRemaining <= 0) {
            clearInterval(countdownState.timerInterval);
            countdownState.isRunning = false;
            countdownDisplay.classList.add('timer__display--finished');
            countdownStartStopBtn.textContent = 'Start';
            countdownStartStopBtn.dataset.action = 'start';
            countdownInputs.style.visibility = 'visible';
        }
    }

    /** Handles starting and stopping the countdown. */
    function handleCountdownStartStop() {
        if (countdownState.isRunning) {
            // Pause the countdown
            clearInterval(countdownState.timerInterval);
            countdownState.isRunning = false;
            countdownStartStopBtn.textContent = 'Start';
            countdownStartStopBtn.dataset.action = 'start';
        } else {
            // Start or resume the countdown
            if (countdownState.timeRemaining <= 0) { // If starting from scratch
                const h = parseInt(hoursInput.value) || 0;
                const m = parseInt(minutesInput.value) || 0;
                const s = parseInt(secondsInput.value) || 0;
                countdownState.totalSeconds = h * 3600 + m * 60 + s;
                countdownState.timeRemaining = countdownState.totalSeconds;
            }

            if (countdownState.timeRemaining > 0) {
                countdownState.isRunning = true;
                countdownState.timerInterval = setInterval(updateCountdownDisplay, 1000);
                countdownStartStopBtn.textContent = 'Stop';
                countdownStartStopBtn.dataset.action = 'stop';
                countdownInputs.style.visibility = 'hidden';
                countdownDisplay.classList.remove('timer__display--finished');
            }
        }
    }

    /** Resets the countdown timer. */
    function resetCountdown() {
        clearInterval(countdownState.timerInterval);
        countdownState.isRunning = false;
        countdownState.timeRemaining = countdownState.totalSeconds; // Reset to last set time
        countdownDisplay.textContent = formatCountdownTime(countdownState.timeRemaining);
        countdownStartStopBtn.textContent = 'Start';
        countdownStartStopBtn.dataset.action = 'start';
        countdownDisplay.classList.remove('timer__display--finished');
        countdownInputs.style.visibility = 'visible';
    }

    /** Updates display when input values change. */
    function handleInputChange() {
        if (countdownState.isRunning) return;
        const h = parseInt(hoursInput.value) || 0;
        const m = parseInt(minutesInput.value) || 0;
        const s = parseInt(secondsInput.value) || 0;
        countdownState.totalSeconds = h * 3600 + m * 60 + s;
        countdownDisplay.textContent = formatCountdownTime(countdownState.totalSeconds);
    }
    
    //================================================================
    // 5. EVENT LISTENERS
    //================================================================

    // Navigation listeners
    selectStopwatchBtn.addEventListener('click', showStopwatch);
    selectCountdownBtn.addEventListener('click', showCountdown);
    backButtons.forEach(button => button.addEventListener('click', showChoiceScreen));

    // Stopwatch listeners
    stopwatchStartStopBtn.addEventListener('click', handleStopwatchStartStop);
    stopwatchResetBtn.addEventListener('click', resetStopwatch);
    stopwatchLapBtn.addEventListener('click', recordLap);

    // Countdown listeners
    countdownStartStopBtn.addEventListener('click', handleCountdownStartStop);
    countdownResetBtn.addEventListener('click', resetCountdown);
    [hoursInput, minutesInput, secondsInput].forEach(input => {
        input.addEventListener('change', handleInputChange);
    });

    // Initial setup
    handleInputChange(); // Set initial countdown display value

})();