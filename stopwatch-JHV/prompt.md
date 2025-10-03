# Prompt Cronómetro y Cuenta Atrás

## Rol
Actúa como una persona desarrolladora front-end senior especializada en interfaces accesibles y pulidas con HTML, CSS y JavaScript puro. Trabajas sobre un proyecto sin build steps, sin frameworks externos y debes entregar código listo para ejecutarse en el navegador.

## Contexto
- Proyecto base: parte de la carpeta `AI4Devs-stopwatch-202509/template/`. Copia su contenido a una nueva carpeta `stopwatch-JHV` y trabaja allí.
- Plantilla inicial: `index.html` enlaza a `styles.css` y `script.js`; ambos deben existir y contener toda la lógica/estilos necesarios.
- Referencia visual: usa `res/stopwatch.png` como guía principal. Usala para replicar proporciones, tipografía, colores y disposición inspiradas en la captura (cronómetro digital con contenedor central, display destacado y botones contrastados).
- Inspiración funcional: https://www.online-stopwatch.com/

## Objetivo
Diseñar e implementar una página de cronómetro y cuenta atrás responsive que ofrezca controles claros, estilos coherentes con la referencia y buen soporte de accesibilidad.

## Entregables
- Contenido completo de `index.html` incluido en la carpeta `stopwatch-JHV`.
- Contenido completo de `styles.css` con todos los estilos necesarios (no usar preprocesadores) en la carpeta `stopwatch-JHV`.
- Contenido completo de `script.js` con toda la lógica (no incrustar JS en el HTML) en la carpeta `stopwatch-JHV`.
- Breve guía de pruebas manuales y una sección “Prompts utilizados” que incluya textualmente este prompt para copiarlo en `prompts.md`.

## Requisitos funcionales
- Vista principal con título, cronómetro y cuenta atrás diferenciados en secciones.
- **Cronómetro**: mostrar tiempo con precisión de centésimas; botones `Iniciar`, `Pausar/Continuar` (toggle) y `Reiniciar`. Botones deben habilitarse/inhabilitarse según el estado. Mantener consistencia visual con la referencia.
- **Cuenta atrás**: permitir definir minutos y segundos (inputs numéricos o selectores), iniciar, pausar/continuar y reiniciar. Mostrar progreso restante. Al llegar a cero, detener el temporizador y mostrar un mensaje claro; opcionalmente reproducir una vibración/animación sutil sin depender de audio.
- Ambas funcionalidades deben compartir el mismo estilo visual y adaptarse a móvil/escritorio.
- Mostrar el estado actual (p.ej., “En marcha”, “Pausado”, “Completado”) en texto y atributos ARIA cuando corresponda.

## Requisitos de diseño y UX
- Layout centrado, con contenedor principal inspirado en `stopwatch.png`: fondo contrastado, display digital prominente, botones redondeados, sombras suaves y paleta similar (por ejemplo tonos azules/celestes sobre fondo oscuro).
- Tipografía legible tipo “Seven Segment” simulada con CSS o equivalente web-safe; si usas `@font-face`, debe ser un recurso local embebido como data URI o una alternativa sin dependencias externas.
- Estados hover/focus activos visibles; comportamiento coherente al reducir la ventana.
- Incluye un favicon inline simple (SVG embebido) si no implica dependencias externas.

## Requisitos técnicos
- HTML semántico (`lang="es"`, `<main>`, `<section>`, encabezados ordenados).
- JS modular en `script.js`, sin variables globales innecesarias; usa `requestAnimationFrame` o `setInterval` con corrección por marca temporal para precisión.
- Maneja diferencias de pestaña inactiva (ajusta cálculos para que el tiempo no se desincronice).
- No dependencias de terceros, ni CDN, ni frameworks CSS.
- CSS organizado con uso moderado de variables personalizadas para colores y espaciados.
- Comentarios sólo donde aclaren lógica no trivial (p.ej., ajuste de drift, accesibilidad).

## Accesibilidad y calidad
- Botones etiquetados con `aria-pressed` cuando corresponda, regiones vivas (`aria-live="polite"`) para el mensaje de finalización.
- Mantén orden lógico de tabulación; provee atajos de teclado sencillos (p.ej., espacio para iniciar/pausar) si no interfiere.
- Considera `prefers-reduced-motion`; usa animaciones opcionales suaves.
- Garantiza que el contraste de colores cumpla WCAG AA.
- No errores en consola; código formateado y consistente.

## Formato de la respuesta
1. Breve resumen de la solución (máx. 5 frases).
2. Código completo para cada archivo en bloques separados etiquetados (`index.html`, `styles.css`, `script.js`).
3. Lista concisa de pruebas manuales sugeridas (cronómetro, cuenta atrás, accesibilidad básica).
4. Sección “Prompts utilizados” que incluya este prompt (y cualquier otro usado) listo para copiar y pegar en `prompts.md`.

## Recordatorio de entrega en el repositorio
- El trabajo final debe residir en `AI4Devs-stopwatch-202509/stopwatch-JHV/`.
- Copia el contenido de la respuesta en los archivos correspondientes y registra el prompt en `prompts.md`.

---

## Pruebas manuales sugeridas
- Cronómetro: iniciar, pausar/continuar con botón y barra espaciadora, y reiniciar confirmando que vuelve a 00:00.00.
- Estados de botones: validar que los controles se habilitan/deshabilitan según el estado actual en ambas secciones.
- Cuenta atrás: configurar distintos tiempos, iniciar, pausar, reanudar y observar la barra de progreso y el mensaje al finalizar.
- Accesibilidad: comprobar enfoque visible, etiquetas ARIA actualizadas y comportamiento sin animaciones cuando `prefers-reduced-motion` está activo.
