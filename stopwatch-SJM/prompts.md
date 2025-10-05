Chatbot used: ChatGPT (GPT-5 model)

# 🧠 Prompt — Stopwatch + Countdown Web App

Act as a **Senior Front-End Engineer** specialized in **modern UI design** and **web development using pure HTML, CSS, and JavaScript**, with solid experience in creating clean, accessible, and responsive interfaces and following **SOLID principles**.

Your task is to generate a fully functional **Stopwatch and Countdown web application**, inspired by the design of [https://www.online-stopwatch.com/](https://www.online-stopwatch.com/), but with a **modern visual style**.

---

## 🎯 Objective

Create a fully functional, visually appealing, and responsive **Stopwatch + Countdown** application, running from the files `index.html`, `style.css`, and `script.js` **without any external dependencies or frameworks**.
The generated code must be **well-structured, reusable, and maintainable**.

---

## 🧩 INTERFACE REQUIREMENTS

* The design should be inspired by [https://www.online-stopwatch.com/](https://www.online-stopwatch.com/).
* A large, centered display showing the time in `00:00:00` format, using a **digital clock-like font** (e.g., `monospace` or “digital-7”).
* Large, centered, and clearly visible buttons with the following actions:

  * **Start**
  * **Pause**
  * **Reset**
  * **Switch Mode** (to toggle between Stopwatch and Countdown modes)
* In **Countdown mode**, include a field or selector to set the initial time.
* Display an alert or visual animation when reaching `0`.
* Always display time in the format `hh:mm:ss`.

**Example layout (visual reference):**

```
 ----------------------------
|        00:05:32            |
| [ Start ] [ Pause ] [ Reset ] |
| [ Switch to Countdown ]     |
 ----------------------------
```

---

## 🎨 STYLE REQUIREMENTS

* Use a **modern color palette**.
* **Translucent backgrounds with blur** (glassmorphism effect).
* **Subtle 3D button effects** and smooth transitions when pressed.
* **Soft shadows** to create visual depth.
* **Smooth and elegant gradients**.
* **Responsive design**, centered both vertically and horizontally, adapting to mobile and desktop.
* **Smooth transitions** on hover and state changes.

---

## ⚙️ FUNCTIONALITY REQUIREMENTS

* **Stopwatch:**

  * Start, pause, and reset functionality.
  * Display elapsed time in `hh:mm:ss` format.

* **Countdown:**

  * Allow the user to set the initial time.
  * Start, pause, and reset functionality.
  * Display a message or play a sound when time reaches zero.

* **General behavior:**

  * Allow switching between modes without reloading the page.
  * Validate user inputs (e.g., prevent negative times).
  * Ensure only one active timer interval at a time.

**Suggested functions:**

```js
function startTimer() { ... }
function pauseTimer() { ... }
function resetTimer() { ... }
function updateDisplay() { ... }
function switchMode() { ... }
```

---

## 🧱 STRUCTURE REQUIREMENTS

* Use the existing `index.html` file as the base.
* Implement all logic in `script.js`.
* Define styles in a separate `style.css` file.
---

## 🧠 GOOD PRACTICES & ARCHITECTURE

* Clean, readable, and well-commented code.
* Follow front-end best practices: **separation of concerns** and **modularity**.
* Apply **SOLID principles** adapted to JavaScript:
  * Each function should have a **single responsibility**.
  * Design **generic and reusable** functions.
  * Keep functions **small and specific**, with minimal dependencies.
  * **Separate logic from the DOM** (e.g., keep timer logic independent from UI manipulation).
* Include **English docstrings/comments** describing each function’s purpose.
* Handle errors or unexpected behavior with clear console messages.
* Maintain consistency in variable and function naming.

---

## 💻 CODE REQUIREMENTS

* Follow all best practices and principles above.
* Maintain a consistent, professional coding style.
* Document every function with a short comment in **English** describing its responsibility.
