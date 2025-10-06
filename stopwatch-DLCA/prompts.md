Prompt (EN)

Role: You are a front-end UI engineer who writes clean, accessible, production-ready vanilla JS with modern, minimalist UX.
Task: Using ONLY the provided seed (index.html + script.js), create a Stopwatch and a Countdown that feel modern, focused, and easy to use. Do not use frameworks or build tools.

Constraints & Output

Keep HTML structure minimal and semantic; inject UI via JS where possible.

Use one CSS file styles.css (create it) with a clean, spacious layout; no UI libraries.

Use vanilla JavaScript in script.js. No external deps.

Keep IDs/classes stable and readable.

Must work perfectly on desktop and mobile.

Provide the exact code for index.html, styles.css, and script.js. No placeholders, no omitted parts.

At the end, include a short README section (as plain text) describing how to run and key UX choices.

Reference

Visual tone inspired by https://www.online-stopwatch.com/
 (and res/stopwatch.png), but do not copy. Deliver a cleaner, calmer, more modern layout.

Features (MVP+)

Tabs: Two tabs — Stopwatch and Countdown. Persist active tab in localStorage.

Stopwatch

Big time readout in HH:MM:SS.ms (ms to 2 digits).

Controls: Start / Pause / Lap / Reset.

Laps list with ordinal number and lap delta time; scrollable if long.

Keyboard: Space = Start/Pause, L = Lap, R = Reset (announce shortcuts in a tooltip or helper text).

Countdown

Time input via three number fields (HH, MM, SS) with validation; quick-set chips (e.g., 1, 5, 10 min).

Controls: Start / Pause / Reset.

Optional beep on finish (use simple <audio> with a short built-in tone or JS Audio API).

When finished: clear visual state + accessible live region announcement.

Precision & Performance

Use performance.now() with a drift-compensated loop (requestAnimationFrame or setTimeout with correction) for accurate timing; avoid cumulative drift.

Never lose elapsed time when window blurs; compute from timestamps instead of incrementing counters.

Accessibility (A11y)

WCAG-friendly color contrast.

Focus states, ARIA labels, role="tablist", role="tab", aria-selected, aria-controls.

Live region for status updates (e.g., “Countdown finished”).

Usability

Large, legible type; generous spacing; primary actions prominent.

Mobile: buttons reachable with thumb; inputs numeric with proper inputmode.

Persist last countdown value in localStorage.

Styling

Modern, minimalist: neutral palette, soft shadows, rounded corners (border-radius), smooth transitions.

Respect prefers-color-scheme; provide light/dark with CSS custom properties.

Quality

No layout shift when switching tabs.

Defensive input handling (clamp values, prevent NaN).

Code is modular and commented (small pure functions, no global leaks).

Seed
We start from this index.html (already provided):

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Timer and Countdown</title>
<link rel="stylesheet" href="styles.css" />
</head>
<body>
<h1>Timer and Countdown</h1>
<script src="script.js"></script>
</body>
</html>


Transform it minimally to host your UI (you may replace the <h1> with your app container).

Deliverables

Full contents of: index.html, styles.css, script.js.

Then a short README section explaining:

How timing drift is handled.

Keyboard shortcuts.

A11y choices (tabs roles, live regions).

What state is persisted.

Important

Use a chatbot (this one) to generate code; avoid IDE code assistants like Copilot.

If you reuse the reference, keep it as inspiration only; this should look cleaner and more modern.

Final (ES)

Rol: Eres un/a ingeniero/a de UI que escribe JS vanilla limpio y accesible, con UX minimalista y moderna.
Tarea: Partiendo solo del seed (index.html + script.js), crea un Cronómetro y una Cuenta atrás con enfoque en usabilidad, claridad y estética contemporánea. Sin frameworks.

Restricciones y Salida

HTML semántico y mínimo; inyecta UI con JS cuando convenga.

Un solo CSS styles.css con diseño limpio; nada de librerías UI.

JavaScript vanilla en script.js, sin dependencias externas.

IDs/clases legibles y estables.

Debe funcionar perfecto en desktop y móvil.

Entrega el código completo de index.html, styles.css y script.js (sin omisiones).

Al final, añade una sección README breve (texto plano) con cómo ejecutar y decisiones de UX.

Referencia

Inspiración visual: https://www.online-stopwatch.com/
 y res/stopwatch.png, sin copiar. Debe verse más limpio y moderno.

Funcionalidades (MVP+)

Pestañas: Cronómetro y Cuenta atrás. Persistir pestaña activa en localStorage.

Cronómetro

Lectura grande HH:MM:SS.ms (ms 2 dígitos).

Controles: Iniciar / Pausar / Vuelta / Reiniciar.

Lista de vueltas con número y delta; desplazable.

Teclado: Espacio = Iniciar/Pausar, L = Vuelta, R = Reiniciar (muestra ayuda/tooltip).

Cuenta atrás

Entrada de tiempo con tres campos numéricos (HH, MM, SS) + chips de atajo (1, 5, 10 min).

Controles: Iniciar / Pausar / Reiniciar.

Beep al finalizar (Audio simple).

Al terminar: estado visual claro + anuncio accesible (live region).

Precisión y Rendimiento

Usa performance.now() y bucle compensado (RAF o setTimeout con corrección) para evitar drift.

No pierdas tiempo al cambiar de pestaña/ventana; calcula por timestamps.

Accesibilidad

Contraste adecuado.

Estados de foco, role="tablist", role="tab", aria-selected, aria-controls.

Región en vivo para avisos (p.ej., “Cuenta atrás finalizada”).

Usabilidad

Tipografía grande, espaciado generoso; acciones primarias destacadas.

Móvil: inputs con inputmode numérico; botones cómodos para el pulgar.

Persistir último tiempo de cuenta atrás en localStorage.

Estilo

Minimalista moderno: paleta neutra, sombras suaves, bordes redondeados, transiciones sutiles.

Soporte prefers-color-scheme (claro/oscuro) con variables CSS.

Calidad

Sin saltos de layout al cambiar de pestaña.

Validación defensiva (clamp valores, evitar NaN).

Código modular y comentado.

Seed
Partimos de este index.html (ya dado):

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Timer and Countdown</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<h1>Timer and Countdown</h1>
<script src="script.js"></script>
</body>
</html>


Transforma lo mínimo necesario para montar tu UI (puedes reemplazar el <h1> por el contenedor de la app).

Entregables

Contenido completo de: index.html, styles.css, script.js.

Sección README breve explicando:

Cómo manejas el drift de tiempo.

Atajos de teclado.

Decisiones de accesibilidad (roles de tabs, live regions).

Qué estado persistes.

Importante

Usa un chatbot (este) para generar el código; no uses asistentes de IDE como Copilot.

La referencia es solo inspiración: la UI debe verse más limpia y actual.