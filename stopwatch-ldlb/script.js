const MAX_MINUTES = 59;
const MAX_SECONDS = 59;
const MIN_VALUE = 0;

let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;
let laps = [];

const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const stopwatchStartBtn = document.getElementById('stopwatchStart');
const stopwatchPauseBtn = document.getElementById('stopwatchPause');
const stopwatchResetBtn = document.getElementById('stopwatchReset');
const stopwatchLapBtn = document.getElementById('stopwatchLap');
const lapsContainer = document.getElementById('lapsContainer');

function formatTime(milliseconds) {
	const ms = Math.floor((milliseconds % 1000) / 10);
	const seconds = Math.floor((milliseconds / 1000) % 60);
	const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
	const hours = Math.floor(milliseconds / (1000 * 60 * 60));

	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(ms)}`;
}

function pad(num) {
	return num.toString().padStart(2, '0');
}

function updateStopwatchDisplay() {
	stopwatchDisplay.textContent = formatTime(stopwatchTime);
}

function startStopwatch() {
	if (!stopwatchRunning) {
		stopwatchRunning = true;
		const startTime = Date.now() - stopwatchTime;

		stopwatchInterval = setInterval(() => {
			stopwatchTime = Date.now() - startTime;
			updateStopwatchDisplay();
		}, 10);

		stopwatchStartBtn.disabled = true;
		stopwatchPauseBtn.disabled = false;
		stopwatchLapBtn.disabled = false;
	}
}

function pauseStopwatch() {
	if (stopwatchRunning) {
		stopwatchRunning = false;
		clearInterval(stopwatchInterval);
		stopwatchStartBtn.disabled = false;
		stopwatchPauseBtn.disabled = true;
	}
}

function resetStopwatch() {
	stopwatchRunning = false;
	clearInterval(stopwatchInterval);
	stopwatchTime = 0;
	laps = [];
	updateStopwatchDisplay();
	renderLaps();

	stopwatchStartBtn.disabled = false;
	stopwatchPauseBtn.disabled = true;
	stopwatchLapBtn.disabled = true;
}

function recordLap() {
	if (stopwatchRunning) {
		laps.push(stopwatchTime);
		renderLaps();
	}
}

function renderLaps() {
	lapsContainer.textContent = '';

	if (laps.length === 0) {
		return;
	}

	const title = document.createElement('h3');
	title.className = 'subtitle is-6 mt-4';
	title.textContent = 'Laps:';
	lapsContainer.appendChild(title);

	laps.forEach((lapTime, index) => {
		const lapDiv = document.createElement('div');
		lapDiv.className = 'lap-item';

		const lapLabel = document.createElement('span');
		const lapLabelStrong = document.createElement('strong');
		lapLabelStrong.textContent = `Lap ${index + 1}`;
		lapLabel.appendChild(lapLabelStrong);

		const lapValue = document.createElement('span');
		lapValue.textContent = formatTime(lapTime);

		lapDiv.appendChild(lapLabel);
		lapDiv.appendChild(lapValue);
		lapsContainer.appendChild(lapDiv);
	});
}

stopwatchStartBtn.addEventListener('click', startStopwatch);
stopwatchPauseBtn.addEventListener('click', pauseStopwatch);
stopwatchResetBtn.addEventListener('click', resetStopwatch);
stopwatchLapBtn.addEventListener('click', recordLap);

let countdownInterval = null;
let countdownTime = 0;
let countdownRunning = false;
let countdownInitialTime = 0;
let audioContext = null;

const countdownDisplay = document.getElementById('countdownDisplay');
const countdownStartBtn = document.getElementById('countdownStart');
const countdownPauseBtn = document.getElementById('countdownPause');
const countdownResetBtn = document.getElementById('countdownReset');
const countdownMinutesInput = document.getElementById('countdownMinutes');
const countdownSecondsInput = document.getElementById('countdownSeconds');
const minutesUpBtn = document.getElementById('minutesUp');
const minutesDownBtn = document.getElementById('minutesDown');
const secondsUpBtn = document.getElementById('secondsUp');
const secondsDownBtn = document.getElementById('secondsDown');
const alertMessage = document.getElementById('alertMessage');
const closeAlertBtn = document.getElementById('closeAlert');

function validateAndFormatInput(value, max) {
	let num = parseInt(value, 10);

	if (isNaN(num) || num < MIN_VALUE) {
		num = MIN_VALUE;
	} else if (num > max) {
		num = max;
	}

	return num;
}

function updateInputValue(input, value) {
	input.value = pad(value);
}

function handleMinutesInput() {
	const value = validateAndFormatInput(countdownMinutesInput.value, MAX_MINUTES);
	updateInputValue(countdownMinutesInput, value);
}

function handleSecondsInput() {
	const value = validateAndFormatInput(countdownSecondsInput.value, MAX_SECONDS);
	updateInputValue(countdownSecondsInput, value);
}

function incrementMinutes() {
	const current = parseInt(countdownMinutesInput.value, 10) || 0;
	const newValue = current >= MAX_MINUTES ? MIN_VALUE : current + 1;
	updateInputValue(countdownMinutesInput, newValue);
}

function decrementMinutes() {
	const current = parseInt(countdownMinutesInput.value, 10) || 0;
	const newValue = current <= MIN_VALUE ? MAX_MINUTES : current - 1;
	updateInputValue(countdownMinutesInput, newValue);
}

function incrementSeconds() {
	const current = parseInt(countdownSecondsInput.value, 10) || 0;
	const newValue = current >= MAX_SECONDS ? MIN_VALUE : current + 1;
	updateInputValue(countdownSecondsInput, newValue);
}

function decrementSeconds() {
	const current = parseInt(countdownSecondsInput.value, 10) || 0;
	const newValue = current <= MIN_VALUE ? MAX_SECONDS : current - 1;
	updateInputValue(countdownSecondsInput, newValue);
}

function updateCountdownDisplay() {
	countdownDisplay.textContent = formatTime(Math.max(0, countdownTime));
}

function getCountdownInputValue() {
	const minutes = parseInt(countdownMinutesInput.value, 10) || 0;
	const seconds = parseInt(countdownSecondsInput.value, 10) || 0;
	return minutes * 60 * 1000 + seconds * 1000;
}

function startCountdown() {
	if (!countdownRunning) {
		if (countdownTime === 0) {
			countdownInitialTime = getCountdownInputValue();
			countdownTime = countdownInitialTime;

			if (countdownTime <= 0) {
				alert('Please set a time greater than 0!');
				return;
			}
		}

		countdownRunning = true;
		const startTime = Date.now();
		const endTime = startTime + countdownTime;

		countdownInterval = setInterval(() => {
			countdownTime = endTime - Date.now();

			if (countdownTime <= 0) {
				countdownTime = 0;
				updateCountdownDisplay();
				stopCountdown();
				showAlert();
				playBeep();
			} else {
				updateCountdownDisplay();
			}
		}, 10);

		countdownStartBtn.disabled = true;
		countdownPauseBtn.disabled = false;
		countdownMinutesInput.disabled = true;
		countdownSecondsInput.disabled = true;
		minutesUpBtn.disabled = true;
		minutesDownBtn.disabled = true;
		secondsUpBtn.disabled = true;
		secondsDownBtn.disabled = true;
	}
}

function pauseCountdown() {
	if (countdownRunning) {
		countdownRunning = false;
		clearInterval(countdownInterval);
		countdownStartBtn.disabled = false;
		countdownPauseBtn.disabled = true;
	}
}

function resetCountdown() {
	countdownRunning = false;
	clearInterval(countdownInterval);
	countdownTime = 0;
	countdownInitialTime = 0;
	updateCountdownDisplay();
	hideAlert();

	countdownStartBtn.disabled = false;
	countdownPauseBtn.disabled = true;
	countdownMinutesInput.disabled = false;
	countdownSecondsInput.disabled = false;
	minutesUpBtn.disabled = false;
	minutesDownBtn.disabled = false;
	secondsUpBtn.disabled = false;
	secondsDownBtn.disabled = false;
}

function stopCountdown() {
	countdownRunning = false;
	clearInterval(countdownInterval);
	countdownStartBtn.disabled = false;
	countdownPauseBtn.disabled = true;
}

function showAlert() {
	alertMessage.classList.add('active');
}

function hideAlert() {
	alertMessage.classList.remove('active');
}

function initAudioContext() {
	if (!audioContext) {
		const AudioContextClass = window.AudioContext || window.webkitAudioContext;
		if (AudioContextClass) {
			audioContext = new AudioContextClass();
		}
	}
	return audioContext;
}

function playBeep() {
	try {
		const context = initAudioContext();
		if (!context) {
			return;
		}

		const oscillator = context.createOscillator();
		const gainNode = context.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(context.destination);

		oscillator.frequency.value = 800;
		oscillator.type = 'sine';

		gainNode.gain.setValueAtTime(0.3, context.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

		oscillator.start(context.currentTime);
		oscillator.stop(context.currentTime + 0.5);
	} catch (error) {
		console.error('Audio playback failed:', error);
	}
}

countdownStartBtn.addEventListener('click', startCountdown);
countdownPauseBtn.addEventListener('click', pauseCountdown);
countdownResetBtn.addEventListener('click', resetCountdown);
closeAlertBtn.addEventListener('click', hideAlert);

countdownMinutesInput.addEventListener('blur', handleMinutesInput);
countdownSecondsInput.addEventListener('blur', handleSecondsInput);
countdownMinutesInput.addEventListener('input', () => {
	countdownMinutesInput.value = countdownMinutesInput.value.replace(/[^0-9]/g, '');
});
countdownSecondsInput.addEventListener('input', () => {
	countdownSecondsInput.value = countdownSecondsInput.value.replace(/[^0-9]/g, '');
});

minutesUpBtn.addEventListener('click', incrementMinutes);
minutesDownBtn.addEventListener('click', decrementMinutes);
secondsUpBtn.addEventListener('click', incrementSeconds);
secondsDownBtn.addEventListener('click', decrementSeconds);

updateStopwatchDisplay();
updateCountdownDisplay();
updateInputValue(countdownMinutesInput, 1);
updateInputValue(countdownSecondsInput, 0);
