"use strict";

/**
 * Utility Functions
 */
class TimeUtils {
    static pad(num, size) {
        try {
            let s = "000" + num;
            return s.substr(s.length - size);
        } catch (e) {
            console.error("Error in pad:", e);
            return "000";
        }
    }

    static msToParts(ms) {
        try {
            ms = Math.max(0, ms);
            const hours = Math.floor(ms / 3600000);
            const minutes = Math.floor((ms % 3600000) / 60000);
            const seconds = Math.floor((ms % 60000) / 1000);
            const millis = Math.floor(ms % 1000);
            return { hours, minutes, seconds, millis };
        } catch (e) {
            console.error("Error in msToParts:", e);
            return { hours: 0, minutes: 0, seconds: 0, millis: 0 };
        }
    }

    static partsToMs({ hours, minutes, seconds, millis }) {
        try {
            return (
                (parseInt(hours) || 0) * 3600000 +
                (parseInt(minutes) || 0) * 60000 +
                (parseInt(seconds) || 0) * 1000 +
                (parseInt(millis) || 0)
            );
        } catch (e) {
            console.error("Error in partsToMs:", e);
            return 0;
        }
    }
}

/**
 * SOLID: UI Renderer (Single Responsibility)
 */
class UIRenderer {
    /**
     * Render initial home screen
     */
    static homeScreen() {
        try {
            return `
                <div class="flex flex-col items-center w-full">
                    <button id="sw-btn" class="sw-btn-main mb-6 w-[320px] h-[70px] text-[2.2rem] font-bold rounded-sw border-3 border-sw-black bg-sw-green hover:bg-sw-green-d text-black transition-all" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">Stopwatch</button>
                    <button id="cd-btn" class="sw-btn-main w-[320px] h-[70px] text-[2.2rem] font-bold rounded-sw border-3 border-sw-black bg-sw-red hover:bg-sw-red-d text-black transition-all" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">Countdown</button>
                </div>
            `;
        } catch (e) {
            console.error("Error rendering homeScreen:", e);
            return "";
        }
    }

    /**
     * Render display box for both stopwatch and countdown
     */
    static displayBox({ hours, minutes, seconds, millis }) {
        try {
            return `
                <div class="mx-auto w-full max-w-[900px] bg-sw-light border-3 border-sw-black rounded-sw py-2 px-6 flex flex-col items-center shadow"
                     style="min-height: 150px; box-sizing: border-box;">
                    <div class="flex flex-row items-end justify-center w-full">
                        <span class="text-[7rem] leading-[1] tracking-tight font-bold text-black select-none" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">
                            ${TimeUtils.pad(hours,2)}:${TimeUtils.pad(minutes,2)}:${TimeUtils.pad(seconds,2)}
                        </span>
                        <span class="ml-2 mb-2 text-[2.5rem] font-normal text-black select-none" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">${TimeUtils.pad(millis,3)}</span>
                    </div>
                </div>
            `;
        } catch (e) {
            console.error("Error rendering displayBox:", e);
            return "";
        }
    }

    /**
     * Render main control buttons (stopwatch/countdown running)
     */
    static controls({ leftText, rightText }) {
        try {
            return `
                <div class="flex flex-row justify-center w-full mt-7 gap-8">
                    <button id="left-btn" class="sw-btn-main w-[320px] h-[70px] text-[2.25rem] font-bold rounded-sw border-3 border-sw-black bg-sw-green hover:bg-sw-green-d text-black transition-all" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">${leftText}</button>
                    <button id="right-btn" class="sw-btn-main w-[320px] h-[70px] text-[2.25rem] font-bold rounded-sw border-3 border-sw-black bg-sw-red hover:bg-sw-red-d text-black transition-all" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">${rightText}</button>
                </div>
            `;
        } catch (e) {
            console.error("Error rendering controls:", e);
            return "";
        }
    }

    /**
     * Render numeric keypad for countdown input
     */
    static numericKeypad() {
        try {
            // Numbers in calculator layout: [1,2,3],[4,5,6],[7,8,9],[0]
            let rows = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ];
            let html = `<div class="flex flex-col gap-3 items-center mt-7 w-full">
                ${rows
                    .map(
                        row =>
                            `<div class="flex flex-row gap-6 justify-center w-full">
                                ${row
                                    .map(
                                        num =>
                                            `<button class="sw-btn-num w-[100px] h-[65px] text-[2.5rem] font-bold rounded-sw border-3 border-sw-black bg-white hover:bg-sw-light text-black transition-all" data-num="${num}" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">${num}</button>`
                                    )
                                    .join("")}
                            </div>`
                    )
                    .join("")}
                <div class="flex flex-row gap-6 justify-center w-full">
                    <button class="sw-btn-num w-[100px] h-[65px] text-[2.5rem] font-bold rounded-sw border-3 border-sw-black bg-white hover:bg-sw-light text-black transition-all" data-num="0" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">0</button>
                </div>
            </div>`;
            return html;
        } catch (e) {
            console.error("Error rendering numericKeypad:", e);
            return "";
        }
    }

    /**
     * Render Set/Clear buttons for countdown input
     */
    static setClearControls() {
        try {
            return `
                <div class="flex flex-row justify-center w-full mt-7 gap-8">
                    <button id="set-btn" class="sw-btn-main w-[320px] h-[70px] text-[2.25rem] font-bold rounded-sw border-3 border-sw-black bg-sw-green hover:bg-sw-green-d text-black transition-all" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">Set</button>
                    <button id="clear-btn" class="sw-btn-main w-[320px] h-[70px] text-[2.25rem] font-bold rounded-sw border-3 border-sw-black bg-sw-red hover:bg-sw-red-d text-black transition-all" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">Clear</button>
                </div>
            `;
        } catch (e) {
            console.error("Error rendering setClearControls:", e);
            return "";
        }
    }

    /**
     * Render back button
     */
    static backButton() {
        try {
            return `
                <div class="flex w-full mt-7">
                    <button id="back-btn" class="ml-0 bg-white border-3 border-sw-black text-black text-[1.4rem] font-semibold rounded-sw px-7 py-2 hover:bg-sw-light transition-all shadow-sm" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">Back</button>
                </div>
            `;
        } catch (e) {
            console.error("Error rendering backButton:", e);
            return "";
        }
    }
}

/**
 * State Management (Open/Closed Principle)
 */
class AppState {
    constructor() {
        this.screen = "home"; // "home" | "stopwatch" | "countdown-input" | "countdown"
        this.stopwatchTime = 0;
        this.stopwatchState = "start"; // "start" | "running" | "paused"
        this.countdownInput = [];
        this.countdownSetMs = 0;
        this.countdownTime = 0;
        this.countdownState = "start"; // "start" | "running" | "paused"
        this.countdownStarted = false;
    }
    resetStopwatch() {
        this.stopwatchTime = 0;
        this.stopwatchState = "start";
    }
    resetCountdownInput() {
        this.countdownInput = [];
        this.countdownSetMs = 0;
        this.countdownTime = 0;
        this.countdownState = "start";
        this.countdownStarted = false;
    }
    setCountdownFromInput() {
        try {
            // Parse input array to ms (digits right to left: sssmmhh)
            // Only 6 digits: hhmmss
            let arr = this.countdownInput.slice();
            while (arr.length < 6) arr.unshift(0);
            let [h1, h2, m1, m2, s1, s2] = arr;
            let hours = h1 * 10 + h2;
            let minutes = m1 * 10 + m2;
            let seconds = s1 * 10 + s2;
            // Normalize if necessary (e.g., 70 seconds -> 1 min 10 sec)
            let totalSeconds = hours * 3600 + minutes * 60 + seconds;
            if (totalSeconds > 359999) totalSeconds = 359999; // Max 99:59:59
            hours = Math.floor(totalSeconds / 3600);
            minutes = Math.floor((totalSeconds % 3600) / 60);
            seconds = totalSeconds % 60;
            this.countdownSetMs = TimeUtils.partsToMs({ hours, minutes, seconds, millis: 0 });
            this.countdownTime = this.countdownSetMs;
        } catch (e) {
            console.error("Error setting countdown from input:", e);
            this.countdownSetMs = 0;
            this.countdownTime = 0;
        }
    }
}

/**
 * Stopwatch Logic (Liskov Substitution, Interface Segregation)
 */
class Stopwatch {
    constructor(onTick, onStateChange) {
        this.onTick = onTick;
        this.onStateChange = onStateChange;
        this.interval = null;
        this.state = "start";
        this.time = 0;
        this.lastTick = null;
    }
    start(time = 0) {
        if (this.interval) return;
        this.time = time;
        this.lastTick = performance.now();
        this.state = "running";
        this._tick();
        this.interval = setInterval(() => this._tick(), 10);
        this._notifyState();
        console.log("Stopwatch started.");
    }
    pause() {
        if (!this.interval) return;
        clearInterval(this.interval);
        this.interval = null;
        this.state = "paused";
        this._notifyState();
        console.log("Stopwatch paused.");
    }
    resume() {
        if (this.interval) return;
        this.lastTick = performance.now();
        this.state = "running";
        this.interval = setInterval(() => this._tick(), 10);
        this._notifyState();
        console.log("Stopwatch resumed.");
    }
    clear() {
        clearInterval(this.interval);
        this.interval = null;
        this.state = "start";
        this.time = 0;
        this._notifyTick();
        this._notifyState();
        console.log("Stopwatch cleared.");
    }
    _tick() {
        try {
            let now = performance.now();
            let dt = now - this.lastTick;
            this.lastTick = now;
            this.time += dt;
            this._notifyTick();
        } catch (e) {
            console.error("Stopwatch tick error:", e);
        }
    }
    _notifyTick() {
        if (typeof this.onTick === "function") this.onTick(this.time);
    }
    _notifyState() {
        if (typeof this.onStateChange === "function") this.onStateChange(this.state);
    }
}

/**
 * Countdown Timer (Liskov Substitution, Interface Segregation)
 */
class Countdown {
    constructor(onTick, onStateChange) {
        this.onTick = onTick;
        this.onStateChange = onStateChange;
        this.interval = null;
        this.state = "start";
        this.time = 0;
        this.initTime = 0;
        this.lastTick = null;
    }
    setTime(ms) {
        this.time = ms;
        this.initTime = ms;
        this._notifyTick();
    }
    start() {
        if (this.interval) return;
        if (this.time <= 0) return;
        this.lastTick = performance.now();
        this.state = "running";
        this.interval = setInterval(() => this._tick(), 10);
        this._notifyState();
        console.log("Countdown started.");
    }
    pause() {
        if (!this.interval) return;
        clearInterval(this.interval);
        this.interval = null;
        this.state = "paused";
        this._notifyState();
        console.log("Countdown paused.");
    }
    resume() {
        if (this.interval) return;
        this.lastTick = performance.now();
        this.state = "running";
        this.interval = setInterval(() => this._tick(), 10);
        this._notifyState();
        console.log("Countdown resumed.");
    }
    clear() {
        clearInterval(this.interval);
        this.interval = null;
        this.state = "start";
        this.time = this.initTime;
        this._notifyTick();
        this._notifyState();
        console.log("Countdown cleared.");
    }
    _tick() {
        try {
            let now = performance.now();
            let dt = now - this.lastTick;
            this.lastTick = now;
            this.time -= dt;
            if (this.time <= 0) {
                this.time = 0;
                this._notifyTick();
                this.stop();
                return;
            }
            this._notifyTick();
        } catch (e) {
            console.error("Countdown tick error:", e);
        }
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.state = "start";
        this._notifyState();
        console.log("Countdown finished.");
    }
    _notifyTick() {
        if (typeof this.onTick === "function") this.onTick(this.time);
    }
    _notifyState() {
        if (typeof this.onStateChange === "function") this.onStateChange(this.state);
    }
}

/**
 * Main App Controller (Dependency Inversion)
 */
class StopwatchCountdownApp {
    constructor(root) {
        this.root = root;
        this.state = new AppState();
        this.stopwatch = null;
        this.countdown = null;
        this.render();
    }

    render() {
        try {
            switch (this.state.screen) {
                case "home":
                    this.root.innerHTML = UIRenderer.homeScreen();
                    this._bindHome();
                    break;
                case "stopwatch":
                    this._renderStopwatch();
                    break;
                case "countdown-input":
                    this._renderCountdownInput();
                    break;
                case "countdown":
                    this._renderCountdown();
                    break;
            }
        } catch (e) {
            console.error("Error rendering app:", e);
        }
    }

    // ------------- Home Screen
    _bindHome() {
        try {
            document.getElementById("sw-btn").onclick = () => {
                this.state.resetStopwatch();
                this.state.screen = "stopwatch";
                this.render();
            };
            document.getElementById("cd-btn").onclick = () => {
                this.state.resetCountdownInput();
                this.state.screen = "countdown-input";
                this.render();
            };
        } catch (e) {
            console.error("Error binding home:", e);
        }
    }

    // ------------- Stopwatch Screen
    _renderStopwatch() {
        try {
            const display = UIRenderer.displayBox(TimeUtils.msToParts(this.state.stopwatchTime));
            let leftText = "Start";
            if (this.state.stopwatchState === "running") leftText = "Pause";
            else if (this.state.stopwatchState === "paused") leftText = "Continue";
            const controls = UIRenderer.controls({ leftText, rightText: "Clear" });
            const back = UIRenderer.backButton();

            this.root.innerHTML = `
                <div class="flex flex-col items-center w-full">
                    ${display}
                    ${controls}
                    ${back}
                </div>
            `;

            // Logic
            if (!this.stopwatch)
                this.stopwatch = new Stopwatch(
                    ms => {
                        this.state.stopwatchTime = ms;
                        this._updateStopwatchDisplay();
                    },
                    st => {
                        this.state.stopwatchState = st;
                        this._updateStopwatchControls();
                    }
                );

            this._updateStopwatchDisplay();
            this._updateStopwatchControls();
            this._bindStopwatch();
        } catch (e) {
            console.error("Error rendering stopwatch:", e);
        }
    }
    _updateStopwatchDisplay() {
        try {
            const box = this.root.querySelector(".bg-sw-light");
            if (box) {
                const { hours, minutes, seconds, millis } = TimeUtils.msToParts(this.state.stopwatchTime);
                box.innerHTML = `
                    <div class="flex flex-row items-end justify-center w-full">
                        <span class="text-[7rem] leading-[1] tracking-tight font-bold text-black select-none" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">
                            ${TimeUtils.pad(hours,2)}:${TimeUtils.pad(minutes,2)}:${TimeUtils.pad(seconds,2)}
                        </span>
                        <span class="ml-2 mb-2 text-[2.5rem] font-normal text-black select-none" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">${TimeUtils.pad(millis,3)}</span>
                    </div>
                `;
            }
        } catch (e) {
            console.error("Error updating stopwatch display:", e);
        }
    }
    _updateStopwatchControls() {
        try {
            const leftBtn = this.root.querySelector("#left-btn");
            if (!leftBtn) return;
            if (this.state.stopwatchState === "start") leftBtn.textContent = "Start";
            else if (this.state.stopwatchState === "running") leftBtn.textContent = "Pause";
            else if (this.state.stopwatchState === "paused") leftBtn.textContent = "Continue";
        } catch (e) {
            console.error("Error updating stopwatch controls:", e);
        }
    }
    _bindStopwatch() {
        try {
            const leftBtn = this.root.querySelector("#left-btn");
            const rightBtn = this.root.querySelector("#right-btn");
            const backBtn = this.root.querySelector("#back-btn");

            leftBtn.onclick = () => {
                if (this.state.stopwatchState === "start") this.stopwatch.start(0);
                else if (this.state.stopwatchState === "running") this.stopwatch.pause();
                else if (this.state.stopwatchState === "paused") this.stopwatch.resume();
            };
            rightBtn.onclick = () => {
                this.stopwatch.clear();
            };
            backBtn.onclick = () => {
                this.stopwatch.clear();
                this.state.screen = "home";
                this.render();
            };
        } catch (e) {
            console.error("Error binding stopwatch controls:", e);
        }
    }

    // ------------- Countdown Input Screen
    _renderCountdownInput() {
        try {
            const { hours, minutes, seconds } = this._countdownInputParts();
            const display = UIRenderer.displayBox({ hours, minutes, seconds, millis: 0 });
            const keypad = UIRenderer.numericKeypad();
            const setClear = UIRenderer.setClearControls();
            const back = UIRenderer.backButton();

            this.root.innerHTML = `
                <div class="flex flex-col items-center w-full">
                    ${display}
                    ${keypad}
                    ${setClear}
                    ${back}
                </div>
            `;
            this._bindCountdownInput();
        } catch (e) {
            console.error("Error rendering countdown input:", e);
        }
    }
    _countdownInputParts() {
        try {
            // Input array: right to left: s s m m h h
            let arr = this.state.countdownInput.slice();
            while (arr.length < 6) arr.unshift(0);
            let [h1, h2, m1, m2, s1, s2] = arr;
            let hours = h1 * 10 + h2;
            let minutes = m1 * 10 + m2;
            let seconds = s1 * 10 + s2;
            // Normalize seconds to minutes and minutes to hours if > 59
            if (seconds > 59) {
                minutes += Math.floor(seconds / 60);
                seconds = seconds % 60;
            }
            if (minutes > 59) {
                hours += Math.floor(minutes / 60);
                minutes = minutes % 60;
            }
            if (hours > 99) {
                hours = 99;
                minutes = 59;
                seconds = 59;
            }
            return { hours, minutes, seconds };
        } catch (e) {
            console.error("Error parsing countdown input parts:", e);
            return { hours: 0, minutes: 0, seconds: 0 };
        }
    }
    _bindCountdownInput() {
        try {
            const numBtns = this.root.querySelectorAll(".sw-btn-num");
            const setBtn = this.root.querySelector("#set-btn");
            const clearBtn = this.root.querySelector("#clear-btn");
            const backBtn = this.root.querySelector("#back-btn");

            numBtns.forEach(btn => {
                btn.onclick = () => {
                    if (this.state.countdownInput.length < 6) {
                        this.state.countdownInput.push(Number(btn.dataset.num));
                        // Compose ms and check max (99:59:59)
                        this.state.setCountdownFromInput();
                        if (this.state.countdownSetMs > 359999000) {
                            this.state.countdownInput = [9,9,5,9,5,9];
                            this.state.setCountdownFromInput();
                        }
                        this._renderCountdownInput();
                    }
                };
            });
            setBtn.onclick = () => {
                // If no time entered, default to 10 seconds
                if (this.state.countdownInput.length === 0 || this.state.countdownSetMs === 0) {
                    this.state.countdownInput = [0,0,0,0,1,0];
                    this.state.setCountdownFromInput();
                }
                this.state.countdownTime = this.state.countdownSetMs;
                this.state.countdownStarted = false;
                this.state.countdownState = "start";
                this.state.screen = "countdown";
                this.render();
            };
            clearBtn.onclick = () => {
                this.state.resetCountdownInput();
                this._renderCountdownInput();
            };
            backBtn.onclick = () => {
                this.state.resetCountdownInput();
                this.state.screen = "home";
                this.render();
            };
        } catch (e) {
            console.error("Error binding countdown input:", e);
        }
    }

    // ------------- Countdown Run Screen
    _renderCountdown() {
        try {
            const display = UIRenderer.displayBox(TimeUtils.msToParts(this.state.countdownTime));
            let leftText = "Start";
            if (this.state.countdownState === "running") leftText = "Pause";
            else if (this.state.countdownState === "paused") leftText = "Continue";
            const controls = UIRenderer.controls({ leftText, rightText: "Clear" });
            const back = UIRenderer.backButton();

            this.root.innerHTML = `
                <div class="flex flex-col items-center w-full">
                    ${display}
                    ${controls}
                    ${back}
                </div>
            `;

            // Logic
            if (!this.countdown)
                this.countdown = new Countdown(
                    ms => {
                        this.state.countdownTime = ms;
                        this._updateCountdownDisplay();
                    },
                    st => {
                        this.state.countdownState = st;
                        this._updateCountdownControls();
                        if (st === "start" && this.state.countdownTime === 0) {
                            // Timer finished
                            this.countdown.clear();
                        }
                    }
                );
            this.countdown.setTime(this.state.countdownTime);
            this._updateCountdownDisplay();
            this._updateCountdownControls();
            this._bindCountdown();
        } catch (e) {
            console.error("Error rendering countdown:", e);
        }
    }
    _updateCountdownDisplay() {
        try {
            const box = this.root.querySelector(".bg-sw-light");
            if (box) {
                const { hours, minutes, seconds, millis } = TimeUtils.msToParts(this.state.countdownTime);
                box.innerHTML = `
                    <div class="flex flex-row items-end justify-center w-full">
                        <span class="text-[7rem] leading-[1] tracking-tight font-bold text-black select-none" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">
                            ${TimeUtils.pad(hours,2)}:${TimeUtils.pad(minutes,2)}:${TimeUtils.pad(seconds,2)}
                        </span>
                        <span class="ml-2 mb-2 text-[2.5rem] font-normal text-black select-none" style="font-family: Arial Rounded MT Bold, Arial, sans-serif;">${TimeUtils.pad(millis,3)}</span>
                    </div>
                `;
            }
        } catch (e) {
            console.error("Error updating countdown display:", e);
        }
    }
    _updateCountdownControls() {
        try {
            const leftBtn = this.root.querySelector("#left-btn");
            if (!leftBtn) return;
            if (this.state.countdownState === "start") leftBtn.textContent = "Start";
            else if (this.state.countdownState === "running") leftBtn.textContent = "Pause";
            else if (this.state.countdownState === "paused") leftBtn.textContent = "Continue";
        } catch (e) {
            console.error("Error updating countdown controls:", e);
        }
    }
    _bindCountdown() {
        try {
            const leftBtn = this.root.querySelector("#left-btn");
            const rightBtn = this.root.querySelector("#right-btn");
            const backBtn = this.root.querySelector("#back-btn");

            leftBtn.onclick = () => {
                if (this.state.countdownState === "start") this.countdown.start();
                else if (this.state.countdownState === "running") this.countdown.pause();
                else if (this.state.countdownState === "paused") this.countdown.resume();
            };
            rightBtn.onclick = () => {
                this.countdown.clear();
            };
            backBtn.onclick = () => {
                this.countdown.clear();
                this.state.resetCountdownInput();
                this.state.screen = "home";
                this.render();
            };
        } catch (e) {
            console.error("Error binding countdown controls:", e);
        }
    }
}

// --- Initialize App
window.addEventListener("DOMContentLoaded", () => {
    try {
        new StopwatchCountdownApp(document.getElementById("app"));
        console.log("App initialized.");
    } catch (e) {
        console.error("Error initializing app:", e);
    }
});