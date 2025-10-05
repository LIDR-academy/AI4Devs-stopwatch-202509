# Prompts Used

## Chatbot: [Claude IA]

## Prompt 1 (Initial):
Create a stopwatch and countdown timer web application with the following requirements:

FUNCTIONALITY:
- Stopwatch mode: counter that counts up from 00:00:00
- Countdown mode: counter that counts down from a set time
- Controls: Start/Stop, Reset, and mode switcher
- Time format: HH:MM:SS (hours:minutes:seconds) with milliseconds
- Accurate timing mechanism

DESIGN:
- Large, centered time display
- Clear and accessible buttons
- Clean, minimalist interface inspired by https://www.online-stopwatch.com/
- Dark background with bright digital-style numbers
- Fully responsive (mobile and desktop)

TECHNICAL REQUIREMENTS:
- Pure HTML5, CSS3, and vanilla JavaScript (no frameworks)
- Separate files: index.html, styles.css, and script.js
- Modern CSS with flexbox/grid
- Clean, well-commented code

BEST PRACTICES:
- Semantic HTML5 elements
- Accessible (ARIA labels, keyboard navigation)
- Performance optimized (efficient timer mechanism using requestAnimationFrame or setInterval)
- Code organization: modular functions with single responsibility
- Defensive programming: input validation and edge case handling

SECURITY:
- No eval() or unsafe code execution
- Sanitize any user inputs
- Content Security Policy compatible

OBSERVABILITY & ERROR HANDLING:
- Console logging for debugging (initialization, state changes)
- Try-catch blocks for critical operations
- User-friendly error messages
- Graceful degradation if features fail

Please generate complete, production-ready code for all three files.

## Prompt 2 (Fix Style):
I want the styles of the stopwatch to be more in line with the styles on the page https://www.online-stopwatch.com/.

## Promt 3 (Fix Funtionality)
I need to make the following functional adjustments:
1. Rename the Rest button to Clear.
2. When the Start button is clicked, it should change its name to Pause, not Stop.
3. When the Pause button is clicked, a blue button with the name Continue should appear instead of Start.
4. Only when Rest is clicked should the Continue button turn green again and say Start.

