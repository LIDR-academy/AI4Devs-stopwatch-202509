# Prompts used

Chatbot used: ChatGPT GPT-5.5 Thinking.

## Prompt 1 - User request

Role: software expert, UX/UI, software architect, cybersecurity, frontend/backend. Build a stopwatch for `https://github.com/LIDR-academy/AI4Devs-stopwatch-202509` in folder `stopwatch-JMB`, using the attached image and `https://www.online-stopwatch.com/` as visual reference. Include code, prompts used and chat. Use OWASP, SOLID, TDD and C4. Ask necessary questions. Keep the answer simple, short and specific.

## Prompt 2 - Implementation prompt

Create a dependency-free static HTML/CSS/JavaScript stopwatch and countdown using the repository seed `index.html` + `script.js`. Match the provided image: large rounded light display, black border, huge `HH:MM:SS`, small milliseconds, green Start button and red Clear button. Add countdown mode with validated numeric inputs. Use accessible controls, keyboard support, responsive CSS and a restrictive Content Security Policy. Separate timing logic from UI logic. Add Node tests for the pure timing logic. Add documentation for OWASP, SOLID, TDD and C4.

## Final PR comment prompt

Generated with ChatGPT GPT-5.5 Thinking using the prompt above. The solution creates `stopwatch-JMB` with a static stopwatch/countdown, reference-style UI, no dependencies, core unit tests, `prompts.md`, `chat.md`, and `c4.md`.
