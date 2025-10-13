# Prompt: Cronómetro Simple Accesible

Construye una página web **minimalista** de cronómetro (sin sonido, sin temas y sin registro de vueltas), usando **HTML semántico**, **CSS modular** y **JavaScript moderno (ES Modules)**.

## Requisitos funcionales
- Controles: **Iniciar/Pausar** y **Reiniciar**.
- Atajos de teclado: `Espacio` (Iniciar/Pausar) y `R` (Reiniciar).

## Requisitos técnicos
- Precisión con `performance.now()` y `requestAnimationFrame`.
- Estructura de archivos:
  ```
  index.html
  assets/
    css/styles.css
    js/
      stopwatch.js
      main.js
  ```

## Accesibilidad (WCAG AA)
- Navegación completa por teclado.
- `aria-live="polite"` en el marcador de tiempo (`<output role="status">`).
- `:focus-visible` para resaltar elementos enfocados.
- Contraste de color suficiente en botones y textos.
