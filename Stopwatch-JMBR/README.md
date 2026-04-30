# stopwatch-JMB

Static stopwatch and countdown built from the AI4Devs seed.

## Run

Open `index.html` in a browser.

## Test

```bash
npm test
```

No external dependencies are required.

## Scope

- Stopwatch: start, pause, resume, clear.
- Countdown: set hours/minutes/seconds, start, pause, resume, clear.
- UI inspired by the provided stopwatch reference: large display, green Start, red Clear.
- Accessible labels, keyboard-friendly controls, responsive layout.

## Engineering notes

- **OWASP:** no `eval`, no third-party scripts, restrictive CSP, numeric input validation, DOM updates via `textContent`.
- **SOLID:** timer engines, formatter and UI controller are separated.
- **TDD:** core timing behavior is covered with Node tests before browser integration.
- **C4:** see `c4.md` for context/container/component decisions.
