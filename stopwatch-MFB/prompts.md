# prompts.md (Premium Classic)

**Chatbot:** ChatGPT (GPT-5 Thinking)  
**Entrega:** stopwatch-CTS-premium

## Prompt 1 — Estilo Premium Clásico
> “Quiero una versión *Premium Clásico* del cronómetro + cuenta regresiva, fiel al diseño de online-stopwatch: display LED azul claro con borde grueso y esquinas muy redondeadas; números negros enormes y milisegundos como subíndice. Botones gigantes brillantes: Start (verde), Pause (amarillo), Clear (rojo), con borde oscuro y efecto ‘glossy’. Distribución centrada, responsive, accesible. Sin frameworks, solo HTML/CSS/JS.”

## Prompt 2 — Precisión y sonido
> “Stopwatch con `performance.now()` y `requestAnimationFrame` para minimizar deriva. Countdown con `Date.now()` + `endAt` para tolerar lag. Añadir beep al finalizar usando **WebAudio API** (oscillator) y parpadeo del display.”

## Prompt 3 — Entregables
> “Entrégame `index.html`, `style.css`, `script.js` y este `prompts.md`. Etiquetas en inglés (Start/Pause/Clear). Incluir presets de 30s, 1m, 5m. Botón de Fullscreen.”
