## Model used: Germini 2.5 Pro

---

## Prompts

### Prompt 1

Use what you’ve learned about prompt engineering to create a stopwatch and countdown.

Reference: https://www.online-stopwatch.com/ (see res/stopwatch.png for design reference)

Do it using the seed index.html + script.js + style.css

Use a chatbot, like ChatGPT or Gemini, not a code assistant in an IDE like Copilot.

- Employ a structured naming convention like **BEM (Block__Element--Modifier)** for class names to ensure styles are predictable and scalable.

Tip: if it allows image analysis, you can upload it to easily obtain a design similar to the reference.

To submit the exercise, make a pull request that includes not only the generated code but also, crucially, the prompt used in the file prompts.md. Also, add the prompt in the comment.

To submit, make a pull request that includes a folder copied from the template, with the name stopwatch-initials (e.g., stopwatch-ARM). It should include not only the generated code but also, crucially, the prompt used and the chatbot used in prompts.md. If you’ve used more than one prompt until reaching a suitable solution, add them all in order. Also, include the final prompt in the pull request comment.

Based on the above text. Create a prompt for an AI agent to build a web page, taking into account the role of an expert FrontEnd Developer with experience in JSVanilla, HTML, and CSS, using SOLID principles and all the best practices of a good developer.

## **Result**

Act as an expert FrontEnd Developer with 10+ years of experience specializing in high-performance, accessible, and maintainable web applications using Vanilla JavaScript (ES6+), HTML5, and CSS3. You follow SOLID principles and modern development best practices religiously.

Your task is to create a fully functional, single-page web application featuring both a stopwatch and a countdown timer. The final output must be delivered as three separate, complete code files: index.html, style.css, and script.js.

---

### **Functional Requirements**
You will implement two main features:

**Stopwatch**

- **Display:** A large digital display showing the elapsed time in `HH:MM:SS.ms` format `(e.g., 00:01:23.456)`.

- **Controls:**

    - **Start:** Begins the timer from zero. This button's text should change to **"Stop"**.

    - **Stop:** Pauses the timer at the current elapsed time. This button's text should change back to **"Start"**.

    - **Lap:** When the timer is running, this button records the current time as a **"lap"** without pausing the main timer. The lap times should be displayed in a list below the main timer.

    - **Reset:** Stops the timer (if running) and resets the display to `00:00:00.000.` This also clears all recorded lap times.

- **State Logic:** The buttons must be context-aware. For example, the "Lap" button should only be active while the stopwatch is running, and the "Reset" button should only be active after the timer has started at least once.

**Countdown**

- **User Input:** Provide three input fields for the user to set the desired countdown time: **Hours, Minutes, and Seconds**.

- **Display:** A large digital display showing the remaining time.

- **Controls:**

    - **Start:** Begins the countdown from the set time.

    - **Stop/Pause:** Pauses the countdown.

    - **Reset:** Stops the countdown and resets the display to the last set time or to zero.

- **Completion Alert:** When the countdown reaches `00:00:00`, the display should visually indicate completion (e.g., **by flashing or changing color**).

---

### **Design and UI/UX Requirements**

The visual design should be clean, modern, and heavily inspired by the user interface at `online-stopwatch.com`.

- **Theme:** A light minimals theme.

- **Layout:** The main timer display should be prominent and centrally located, possibly within a circular motif. Controls should be large, circular buttons placed intuitively around or below the display.

- **Color Scheme:** Use color to signify button actions:

    - **Green** for primary positive actions (Start, Lap).

    - **Red** for stopping/pausing actions.

    - **Gray** or a neutral color for secondary actions (Reset).

- **Typography:** Use a clear, legible monospace or digital-style font for the timer display.

- **Responsiveness:** The entire application must be fully responsive and function flawlessly on both desktop and mobile viewports.

---

### **Technical & Code Quality Requirements**

This is critical. Your implementation must reflect your role as an expert developer.

**HTML** (`index.html`)
- Use semantic HTML5 tags (`<main>, <section>, <button>`, etc.).

- Ensure the document is accessible (A11Y). Use proper ARIA attributes where necessary and associate `<label>` elements with all form inputs.

**CSS** (`style.css`)
- **Use CSS variables** at the `:root` level for managing the color palette, fonts, and key spacing values.

- Employ a structured naming convention like **BEM (Block__Element--Modifier)** for class names to ensure styles are predictable and scalable.

- Implement a **mobile-first** approach for responsiveness, using `min-width` media queries to add complexity for larger screens.

- Add subtle transitions for button states and hover effects for a smoother user experience.

**JavaScript** (`script.js`)
- Write clean, modular, and modern **Vanilla JavaScript (ES6+)**. No jQuery or other external libraries.

- Strictly adhere to the **Single Responsibility Principle** (from SOLID). Create distinct functions/modules for:

    - Handling the state of the timers (e.g., `isRunning`, `startTime`, `elapsedTime`).

    - Updating the DOM (e.g., a function `updateDisplay()`).

    - Handling user input and event listeners.

- **Avoid global scope pollution**. Encapsulate your entire script within an IIFE (Immediately Invoked Function Expression) or use ES6 modules.

- For the stopwatch, ensure accuracy by calculating the delta between `Date.now()` on start and on each frame update, rather than simply incrementing a variable in a `setInterval`. This prevents timer drift.

- Ensure your code is well-commented, explaining the purpose of complex functions and state management logic.

---

### Prompt 2

Modify with palette colors

`--battleship-gray: #8f9491ff;
--rose-quartz: #bca3acff;
--thistle: #e5cedcff;
--magnolia: #f3eaf4ff;
--lavender-blush: #eadde1ff;`

**Response**

As an expert FrontEnd Developer, I've created the requested stopwatch and countdown application.

The implementation adheres to all the specified best practices: a semantic and accessible HTML structure, a BEM-structured and responsive CSS file using the provided color palette, and clean, modular, and well-commented Vanilla JavaScript that follows the Single Responsibility Principle and ensures timer accuracy.

---

### Prompt 3

I would like to make some changes to the main interface:
1. At the start, it should allow you to choose one or the other.
2. Once chosen, render the selected one and place it in the centre.
3. There should be a button to return to the start.

**Response**

Here are the updated files with the requested changes to the main interface.

I've introduced a selection screen that appears first. Once you choose a tool, it's displayed centrally, and a "Back" button is available to return to the selection screen.