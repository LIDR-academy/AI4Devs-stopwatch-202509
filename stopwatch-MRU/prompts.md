# USER PROMPT 1

**Role:** Expert front-end developer using html, css and javascript

**Goal:** Generate the complete, self-contained code for a highly functional web application that seamlessly combines a **Stopwatch** and a **Countdown Timer** into a single interface.

**Ouputs, Constraints & Files:**

* The entire solution must be delivered in **two files only**: `index.html` and `script.js`
* All HTML structure, CSS styling, and a single `<script>` tag referencing `script.js` must be contained within `index.html`.
* All application logic, state management, and DOM manipulation must be contained within `script.js`.
* **STRICTLY NO** external libraries, frameworks, or CSS preprocessors.

**References for Design:**

* Attached image: "stopwatch.png"
* Website example: [https://www.online-stopwatch.com/](https://www.online-stopwatch.com/)
* The interface must be **responsive** and intuitively arrange controls below the main time display

## USER PROMPT 2

**Role:** Expert front-end developer using html, css and javascript

**Goal:** Update web application **Stopwatch** and a **Countdown Timer** with the Required Functionality

**Required Functionality:**

* **Stopwatch Mode:**
  * Functions: **Start** (green colour), **Pause** (green colour), **Continue** (blue colour), **Clear** (red colour) (all of them are buttons).
    * At the beginning, show **Start**, **Clear** and hide **Pause**, **Continue**
    * If **Start** is pressed, the count starts, this button hides and **Pause** is shown
    * When **Pause** is pressed, the count stops, this button hides, and **Continue** is shown
    * When **Continue** is pressed, the count continues, this button hides and **Pause** is shown
    * When **Clear** is pressed, the count stops and restarts to 0 and **Start** is shown
  * Display Format: **HH:MM:SS.ms** (Hours:Minutes:Seconds.Milliseconds).
    * The milliseconds display is shown below the count display, aligned to the right side (font size less than the count display)

* **Countdown Timer Mode:**
  * Input: A user-friendly interface (e.g., separate input fields or a modal) for setting the target time in **Hours**, **Minutes**, and **Seconds**.
  * Functions: **Start** (green colour), **Pause** (green colour), **Continue** (blue colour), **Clear** (red colour) (all of them are buttons).
    * At the beginning, show **Start**, **Clear** and hide **Pause**, **Continue**
    * If **Start** is pressed, the countdown starts, this button hides, and **Pause** is shown
    * When **Pause** is pressed, the countdown stops, this button hides, and **Continue** is shown
    * When **Continue** is pressed, the countdown continues, this button hides and **Pause** is shown
    * When **Clear** is pressed, the countdown stops and restarts to 0 and **Start** is shown
  * Alarm/Completion: When the time reaches **00:00:00**, the display must flash and show a clear message like "**TIME UP!**"
  * Display Format: **HH:MM:SS**
    * The milliseconds display is shown below the countdown display, aligned to the right side (font size less than the countdown display)

**Design Context:**

* Follow the attached image design "stopwatch.png" and this website example: [https://www.online-stopwatch.com/](https://www.online-stopwatch.com/)
