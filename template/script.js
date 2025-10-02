// script.js
// Stopwatch & Countdown - SOLID principles applied

// Utility: Format time
class TimeFormatter {
    static format(ms) {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      const milliseconds = String(ms % 1000).padStart(3, "0");
      return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
  }
  
  // Base Timer class (SRP: one responsibility → time tracking)
  class Timer {
    constructor(displayElement) {
      this.displayElement = displayElement;
      this.interval = null;
      this.startTime = 0;
      this.elapsed = 0;
    }
  
    start() {
      try {
        if (this.interval) throw new Error("Timer already running");
        console.log("▶ Timer started");
        this.startTime = Date.now() - this.elapsed;
        this.interval = setInterval(() => this.update(), 10);
      } catch (err) {
        console.error("Start error:", err.message);
      }
    }
  
    pause() {
      try {
        if (!this.interval) throw new Error("Timer not running");
        console.log("⏸ Timer paused");
        clearInterval(this.interval);
        this.interval = null;
      } catch (err) {
        console.error("Pause error:", err.message);
      }
    }
  
    reset() {
      console.log("⏹ Timer reset");
      clearInterval(this.interval);
      this.interval = null;
      this.startTime = 0;
      this.elapsed = 0;
      this.render(0);
    }
  
    update() {
      this.elapsed = Date.now() - this.startTime;
      this.render(this.elapsed);
    }
  
    render(ms) {
      this.displayElement.textContent = TimeFormatter.format(ms);
    }
  }
  
  // Countdown class (OCP: extension without modifying Timer)
  class CountdownTimer extends Timer {
    constructor(displayElement, duration) {
      super(displayElement);
      this.duration = duration * 1000; // convert to ms
    }
  
    update() {
      const remaining = this.duration - (Date.now() - this.startTime);
      if (remaining <= 0) {
        console.log("⏰ Countdown finished");
        clearInterval(this.interval);
        this.interval = null;
        this.render(0);
      } else {
        this.render(remaining);
      }
    }
  }
  
  // Dependency Inversion: App depends on abstractions (Timer) not concrete classes
  class TimerApp {
    constructor() {
      this.displayElement = document.getElementById("timeDisplay");
      this.currentTimer = new Timer(this.displayElement);
      this.initEvents();
    }
  
    initEvents() {
      document.getElementById("startBtn").addEventListener("click", () => this.start());
      document.getElementById("pauseBtn").addEventListener("click", () => this.pause());
      document.getElementById("resetBtn").addEventListener("click", () => this.reset());
      document.getElementById("countdownBtn").addEventListener("click", () => this.startCountdown());
    }
  
    start() {
      this.currentTimer.start();
    }
  
    pause() {
      this.currentTimer.pause();
    }
  
    reset() {
      this.currentTimer.reset();
    }
  
    startCountdown() {
      try {
        const seconds = parseInt(document.getElementById("countdownInput").value, 10);
        if (isNaN(seconds) || seconds <= 0) throw new Error("Invalid countdown time");
        console.log(`⏳ Countdown started for ${seconds} seconds`);
        this.currentTimer.reset();
        this.currentTimer = new CountdownTimer(this.displayElement, seconds);
        this.currentTimer.start();
      } catch (err) {
        console.error("Countdown error:", err.message);
      }
    }
  }
  
  // Bootstrap app
  document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Timer App Initialized");
    new TimerApp();
  });
  
