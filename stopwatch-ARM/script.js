// Utility functions
class TimeUtils {
	static formatTime(milliseconds) {
		const hours = Math.floor(milliseconds / 3600000);
		const minutes = Math.floor((milliseconds % 3600000) / 60000);
		const seconds = Math.floor((milliseconds % 60000) / 1000);
		const ms = Math.floor((milliseconds % 1000) / 10);

		return `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms
			.toString()
			.padStart(3, '0')}`;
	}

	static formatDisplayTime(milliseconds) {
		const hours = Math.floor(milliseconds / 3600000);
		const minutes = Math.floor((milliseconds % 3600000) / 60000);
		const seconds = Math.floor((milliseconds % 60000) / 1000);
		const ms = Math.floor((milliseconds % 1000) / 10);

		return {
			mainTime: `${hours.toString().padStart(2, '0')}:${minutes
				.toString()
				.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
			milliseconds: ms.toString().padStart(3, '0'),
		};
	}
}

// Base Timer class with common functionality
class BaseTimer {
	constructor(displayId, startBtnId, clearBtnId, logId) {
		this.timerInterval = null;
		this.isRunning = false;
		this.isPaused = false;
		this.pauseLog = [];

		// DOM elements
		this.display = document.getElementById(displayId);
		this.startBtn = document.getElementById(startBtnId);
		this.clearBtn = document.getElementById(clearBtnId);
		this.logContainer = document.getElementById(logId);

		this.init();
	}

	init() {
		this.startBtn.addEventListener('click', () => this.toggle());
		this.clearBtn.addEventListener('click', () => this.clear());
		this.initializeDisplay();
		this.updateLog();
	}

	initializeDisplay() {
		// Initialize display with 00:00:00
		const timeData = TimeUtils.formatDisplayTime(0);
		const mainTime = this.display.querySelector('.main-time');
		const msDisplay = this.display.querySelector('.milliseconds');

		if (mainTime) mainTime.textContent = timeData.mainTime;
		if (msDisplay) msDisplay.textContent = timeData.milliseconds;
	}

	toggle() {
		if (!this.isRunning && !this.isPaused) {
			this.start();
		} else if (this.isRunning) {
			this.pause();
		} else if (this.isPaused) {
			this.resume();
		}
	}

	start() {
		this.timerInterval = setInterval(() => this.updateDisplay(), 10);
		this.isRunning = true;
		this.isPaused = false;
		this.updateButton('Pause', 'btn-pause');
	}

	pause() {
		clearInterval(this.timerInterval);
		this.isRunning = false;
		this.isPaused = true;
		this.updateButton('Resume', 'btn-resume');
		this.addPauseLog();
	}

	resume() {
		this.timerInterval = setInterval(() => this.updateDisplay(), 10);
		this.isRunning = true;
		this.isPaused = false;
		this.updateButton('Pause', 'btn-pause');
	}

	clear() {
		clearInterval(this.timerInterval);
		this.isRunning = false;
		this.isPaused = false;
		this.pauseLog = [];
		this.updateButton('Start', 'btn-start');
		this.updateDisplay();
		this.updateLog();
	}

	updateButton(text, className) {
		this.startBtn.textContent = text;
		this.startBtn.className = `btn ${className}`;
	}

	addPauseLog() {
		const pauseTime = this.getCurrentTime();
		const timestamp = new Date().toLocaleTimeString();
		this.pauseLog.push({
			time: pauseTime,
			timestamp: timestamp,
		});
		this.updateLog();
	}

	updateLog() {
		if (this.pauseLog.length === 0) {
			this.logContainer.innerHTML =
				'<p class="log-empty">No pauses recorded yet</p>';
			return;
		}

		this.logContainer.innerHTML = this.pauseLog
			.map((entry, index) => {
				const timeStr = TimeUtils.formatTime(entry.time);
				return `
				<div class="log-entry">
					<span class="log-time">Pause ${index + 1}: ${timeStr}</span>
					<span class="log-timestamp">${entry.timestamp}</span>
				</div>
			`;
			})
			.join('');
	}

	// Abstract methods to be implemented by subclasses
	getCurrentTime() {
		throw new Error('getCurrentTime must be implemented by subclass');
	}

	updateDisplay() {
		throw new Error('updateDisplay must be implemented by subclass');
	}
}

// Tab functionality
class TabManager {
	constructor() {
		this.tabButtons = document.querySelectorAll('.tab-btn');
		this.tabPanels = document.querySelectorAll('.tab-panel');
		this.timers = {}; // Will store timer instances
		this.init();
	}

	init() {
		this.tabButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const targetTab = button.getAttribute('data-tab');
				this.switchTab(targetTab);
			});
		});
	}

	// Method to register timer instances
	registerTimer(timerType, timerInstance) {
		this.timers[timerType] = timerInstance;
	}

	switchTab(targetTab) {
		// Pause any active timers before switching
		this.pauseActiveTimers();

		// Remove active class from all buttons and panels
		this.tabButtons.forEach((btn) => btn.classList.remove('active'));
		this.tabPanels.forEach((panel) => panel.classList.remove('active'));

		// Add active class to clicked button
		const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
		activeButton.classList.add('active');

		// Add active class to corresponding panel
		const activePanel = document.getElementById(`${targetTab}-tab`);
		activePanel.classList.add('active');
	}

	pauseActiveTimers() {
		// Pause stopwatch if running
		if (this.timers.stopwatch && this.timers.stopwatch.isRunning) {
			this.timers.stopwatch.pause();
		}

		// Pause countdown if running
		if (this.timers.countdown && this.timers.countdown.isRunning) {
			this.timers.countdown.pause();
		}
	}
}

// Stopwatch functionality
class Stopwatch extends BaseTimer {
	constructor() {
		super(
			'stopwatch-display',
			'stopwatch-start',
			'stopwatch-clear',
			'stopwatch-log'
		);
		this.startTime = 0;
		this.elapsedTime = 0;
	}

	getCurrentTime() {
		return this.elapsedTime;
	}

	updateDisplay() {
		if (this.isRunning) {
			this.elapsedTime = Date.now() - this.startTime;
		}

		const timeData = TimeUtils.formatDisplayTime(this.elapsedTime);
		const mainTime = document.querySelector('#stopwatch-display .main-time');
		const msDisplay = document.querySelector(
			'#stopwatch-display .milliseconds'
		);

		mainTime.textContent = timeData.mainTime;
		msDisplay.textContent = timeData.milliseconds;
	}

	start() {
		this.startTime = Date.now() - this.elapsedTime;
		super.start();
	}

	resume() {
		this.startTime = Date.now() - this.elapsedTime;
		super.resume();
	}

	clear() {
		this.elapsedTime = 0;
		super.clear();
	}
}

// Countdown functionality
class Countdown extends BaseTimer {
	constructor() {
		super(
			'countdown-display',
			'countdown-start',
			'countdown-clear',
			'countdown-log'
		);
		this.totalTime = 0;
		this.remainingTime = 0;
		this.startTime = 0;
		this.isCompleted = false;

		// Additional DOM elements
		this.completionMessage = document.getElementById('countdown-completion');
		this.validationMessage = document.getElementById('countdown-validation');
		this.hoursInput = document.getElementById('hours');
		this.minutesInput = document.getElementById('minutes');
		this.secondsInput = document.getElementById('seconds');

		this.addInputValidation();
		this.startBtn.disabled = false; // Initially enabled
	}

	getCurrentTime() {
		return this.remainingTime;
	}

	updateDisplay() {
		if (this.isRunning) {
			this.remainingTime = this.totalTime - (Date.now() - this.startTime);

			if (this.remainingTime <= 0) {
				this.remainingTime = 0;
				this.complete();
				return;
			}
		}

		const timeData = TimeUtils.formatDisplayTime(this.remainingTime);
		const mainTime = document.querySelector('#countdown-display .main-time');
		const msDisplay = document.querySelector(
			'#countdown-display .milliseconds'
		);

		mainTime.textContent = timeData.mainTime;
		msDisplay.textContent = timeData.milliseconds;
	}

	addInputValidation() {
		const inputs = [this.hoursInput, this.minutesInput, this.secondsInput];

		inputs.forEach((input) => {
			input.addEventListener('input', () => this.validateInput(input));
			input.addEventListener('blur', () => this.validateInput(input));
		});
	}

	validateInput(input) {
		const value = parseInt(input.value) || 0;
		const max = input.id === 'hours' ? 23 : 59;

		if (value < 0) {
			input.value = 0;
		} else if (value > max) {
			input.value = max;
		}

		// Hide validation message when user starts typing
		this.hideValidationMessage();
	}

	toggle() {
		if (!this.isRunning && !this.isPaused && !this.isCompleted) {
			if (this.validateAndSetTime()) {
				this.start();
			}
		} else if (this.isRunning) {
			this.pause();
		} else if (this.isPaused) {
			this.resume();
		}
	}

	validateAndSetTime() {
		const hours = parseInt(this.hoursInput.value) || 0;
		const minutes = parseInt(this.minutesInput.value) || 0;
		const seconds = parseInt(this.secondsInput.value) || 0;

		if (hours === 0 && minutes === 0 && seconds === 0) {
			this.showValidationMessage();
			return false;
		}

		this.totalTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
		this.remainingTime = this.totalTime;
		this.hideValidationMessage();
		return true;
	}

	showValidationMessage() {
		this.validationMessage.style.display = 'block';
	}

	hideValidationMessage() {
		this.validationMessage.style.display = 'none';
	}

	start() {
		this.startTime = Date.now();
		this.isCompleted = false;
		this.hideCompletionMessage();
		super.start();
	}

	resume() {
		this.startTime = Date.now() - (this.totalTime - this.remainingTime);
		super.resume();
	}

	complete() {
		clearInterval(this.timerInterval);
		this.isRunning = false;
		this.isPaused = false;
		this.isCompleted = true;
		this.updateButton('Start', 'btn-start');
		this.showCompletionMessage();
	}

	showCompletionMessage() {
		this.completionMessage.style.display = 'block';
	}

	hideCompletionMessage() {
		this.completionMessage.style.display = 'none';
	}

	clear() {
		this.totalTime = 0;
		this.remainingTime = 0;
		this.isCompleted = false;
		this.hoursInput.value = 0;
		this.minutesInput.value = 0;
		this.secondsInput.value = 0;
		this.hideCompletionMessage();
		this.hideValidationMessage();
		this.startBtn.disabled = false; // Enable the button
		this.updateButton('Start', 'btn-start'); // Reset to green start button
		this.initializeDisplay(); // Reset display to 00:00:00
		super.clear();
	}
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
	const tabManager = new TabManager();
	const stopwatch = new Stopwatch();
	const countdown = new Countdown();

	// Register timers with tab manager
	tabManager.registerTimer('stopwatch', stopwatch);
	tabManager.registerTimer('countdown', countdown);
});
