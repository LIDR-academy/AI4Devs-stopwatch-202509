USANDO ChatGPT 5

Necesito preparar un prompt para chatgpt para que genera una pagina web sencilla que tendran un stop-watch como la imagen te de adjunto. La pagina no debe tener ninguna dependecia a librerias javascript y no debe contener estilos css inline. La pagina se debe estructurar de la siguiente forma: 1. index.html donde estara el codigo html 2. index.js donde estara el codigo JS que manejara el stop-watch 3. styles.css que tendra los estilos necesarios para que se vea la pagina como la imagen que te adjunto

#PROMPT GENERADO POR ChatGPT

# Prompt para generar página web del cronómetro

Quiero que generes una página web sencilla con un cronómetro (stop-watch) que imite este diseño: pantalla grande con borde redondeado, fondo lila muy claro, dígitos negros gruesos con horas:minutos:segundos y milisegundos pequeños “000” a la derecha; debajo, dos botones grandes: **Start** (verde) y **Clear** (rojo). Nada de dependencias externas.

## Requisitos duros
1. **Sin librerías JS** (nada de React, jQuery, etc.). Solo **vanilla JS**.
2. **Sin CSS inline** ni `<style>` en el HTML. Todo el estilo en `styles.css`.
3. **Tres archivos**:  
   - `index.html` (estructura HTML mínima y semántica)  
   - `index.js` (lógica del cronómetro)  
   - `styles.css` (estilos para replicar la apariencia)  
4. **Formato de tiempo** en pantalla: `HH:MM:SS` y, a la derecha, milisegundos a 3 dígitos (`000`) más pequeños y alineados a la línea base.  
5. **Botones**:  
   - Izquierda: **Start**. Debe alternar a **Pause** cuando esté corriendo y a **Resume** cuando esté pausado.  
   - Derecha: **Clear**. Reinicia a `00:00:00.000` y deja el estado en detenido con el botón mostrando **Start**.  
6. **Precisión**: usa `performance.now()` y un bucle con `requestAnimationFrame` (no `setInterval`) para calcular el tiempo transcurrido (maneja pausas reanudables con un acumulador `elapsed`).  
7. **Accesibilidad**:  
   - Botones con `aria-pressed`/`aria-label` adecuados.  
   - El visor del tiempo con `role="timer"` y `aria-live="polite"`.  
   - Soporta teclado: `Space` = Start/Pause/Resume, `Escape` = Clear.  
8. **Responsivo**: que escale bien en móvil y desktop.  
9. **Fuentes**: usa stack del sistema y `font-variant-numeric: tabular-nums;` para alinear dígitos. No cargues fuentes externas.  
10. **Código limpio**: comentarios breves explicando partes clave; nombres de clases y funciones claros.

## Guía visual (approx)
- Pantalla del cronómetro: fondo lila muy claro (`#E9ECFF` aprox.), borde grueso y redondeado, padding amplio; dígitos enormes, negros, peso alto.  
- Milisegundos “000” más pequeños, alineados al borde inferior derecho de la pantalla.  
- Botones grandes, con esquinas muy redondeadas, ligera sombra y **gradient** suave:  
  - Start: verde (de `#77EB63` a `#38C03A` aprox.).  
  - Clear: rojo (de `#F04234` a `#C9261F` aprox.).  
- Sin imágenes ni íconos externos.

## Estructura y comportamiento del JS
- Estado: `isRunning`, `startTime`, `elapsed`.  
- Al pulsar Start: si está detenido, fija `startTime = performance.now() - elapsed`, arranca el loop y cambia texto a **Pause**.  
- Al pulsar Pause: detén el loop, actualiza `elapsed`, cambia a **Resume**.  
- Al pulsar Resume: igual que Start, pero mantiene `elapsed`.  
- Al pulsar Clear: cancela loop, `elapsed = 0`, muestra `00:00:00.000`, botón queda **Start**.  
- Formateo: horas/minutos/segundos con 2 dígitos; milisegundos con `padStart(3,'0')`.  
- Eventos de teclado: `keydown` para Space/Escape, con `preventDefault()` cuando corresponda.  
- No uses `Date` para contar; solo diferencias de `performance.now()`.

## Salida solicitada
Responde **únicamente** con **tres** bloques de código, en este orden, cada uno etiquetado con el nombre del archivo:

```html
<!-- index.html -->
```

```css
/* styles.css */
```

```javascript
// index.js
```

No incluyas explicaciones adicionales fuera de los bloques.∫