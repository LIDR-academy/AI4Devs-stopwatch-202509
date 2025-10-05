# Prompt Application Stopwatch. 
### Modelo: ChatGPT

## Solicitando Meta-Prompt
Como experto Prompt engineer, creame un prompt para un experto de apliaciones WEB, con conocimientos de html, css y JS.
Para realizar un cronometro, este tendra dos botones, uno realizara una pausa del tiempo y el otro para limpiar. Mandare un interfaz de usuario como ejemplo de diseño.
Utiliza las mejores practicas y pideme los datos necesario para crear el prompt.

## Resultado
Perfecto ✅
Antes de construir el **prompt experto** (es decir, el texto que luego podrás usar para que otro modelo o asistente genere el código del cronómetro web), necesito recopilar algunos datos clave para que quede **preciso, profesional y reutilizable**.

Primero te explico brevemente la estructura ideal del prompt y luego te pido la información que necesito.

---

### 💡 Estructura recomendada de un *prompt experto* para desarrollo web:

1. **Rol del modelo:** define que actuará como un *experto en desarrollo web frontend* (HTML, CSS, JS).
2. **Objetivo:** describe qué se va a construir (ej. un cronómetro funcional con botones específicos).
3. **Detalles técnicos:** especifica tecnologías, estilo, comportamiento, restricciones y mejores prácticas.
4. **Referencia visual o UI:** indica si habrá un diseño base que debe replicar.
5. **Formato de entrega:** pide el código organizado o separado por secciones.
6. **Criterios de calidad:** claridad, compatibilidad, buenas prácticas, semántica, y eficiencia.

---

### 🔍 Para que te cree el *prompt perfecto*, necesito saber:

1. **Formato de salida:**
   ¿Quieres que el prompt genere **un único archivo HTML con CSS y JS embebidos**, o **tres archivos separados (index.html, styles.css, script.js)**?

2. **Estilo visual:**
   ¿El diseño será **minimalista**, **moderno tipo material**, **retro**, **deportivo**, etc.?
   *(Puedes subir una imagen de ejemplo del diseño que mencionaste).*

3. **Tipo de cronómetro:**
   ¿Debe medir solo segundos, o minutos y segundos (MM:SS), o también milisegundos (MM:SS:MS)?

4. **Comportamiento de los botones:**

   * ¿El botón de pausa debe también reanudar el cronómetro (toggle), o serán dos botones distintos (Pausar / Reanudar)?
   * ¿El botón de limpiar debe reiniciar el tiempo a 00:00 o también detenerlo?

5. **Ubicación o estructura de los botones:**
   ¿Deseas que estén debajo del cronómetro, alineados al centro, o en los costados?

6. **Restricciones o requisitos adicionales:**
   Ejemplo:

   * “Sin usar librerías externas”
   * “Debe ser responsive”
   * “Compatible con navegadores modernos”
   * “Usar Flexbox / Grid / Tailwind / Bootstrap”
   * “Usar solo vanilla JS”

7. **Idioma y estilo de comentarios del código:**
   ¿Quieres que los comentarios estén en español o en inglés?
   ¿Deseas que el prompt le pida al modelo explicar brevemente cada sección del código?

---

Cuando me compartas estos datos (y el ejemplo de interfaz si lo tienes), te generaré el **prompt experto completo**, optimizado para que puedas usarlo directamente con cualquier modelo (como GPT-5, Claude, o Gemini) y obtener un resultado profesional.

¿Te gustaría que el prompt final esté enfocado en **enseñar paso a paso** cómo construir el cronómetro (educativo) o en **entregar directamente el código listo para producción**?

## Respuesta a las preguntas
1. Tres Archivos separados.
2. Se subira el imagen como diseño.
3. Sera en HH:MM:SS:MS.
4. Un boton realizara tres funciones: Start, Pausa, Continuar y el otro solo limpiar que debe reiniciar el tiempo a 00:00:00:00.
5. los botones estaran debajo del cronometro y alineados al centro.
6. Sin usar Librerias Externas.
7. Comentarios en español y no es necesario que le explique al modelo. 
8. Prompt Optimizado para que se pueda utilizar en GPT-5 y obtener un resultdo profesional.
9. El prompt fianl es para entregar directamente el codigo listo para produccion.

### Extras por feedback de los resultados: 
* Dame el prompt en ingles.
* Los milisegundos que se encuentren debajo de HH:MM:SS.
* Dame los archivos para copiar y pegarlos a mi entorno.
* **Se adjunto el archivo del diseño**

## Resultado:
🧠 Final Expert Prompt (in English)

Prompt:
You are an expert in professional web application development, specialized in HTML, CSS, and JavaScript.
Your task is to create a fully functional stopwatch web app that follows the exact specifications below.

🎯 Objective

Build a stopwatch that displays time in HH:MM:SS:MS format.
The design reference is provided as an image (uploaded by the user).

🧩 Technical Requirements

The project must be separated into three files:

index.html

styles.css

script.js

The stopwatch display should show hours, minutes, seconds, and milliseconds, with the milliseconds placed below the HH:MM:SS line.

There must be two buttons below the display, aligned to the center:

Button 1 (green): performs three functions — Start, Pause, and Continue — cycling through these states when clicked.

Button 2 (red): Clear, which resets the stopwatch to 00:00:00:000.

The stopwatch design must closely follow the uploaded image reference.

Do not use any external libraries or frameworks (only Vanilla HTML, CSS, and JS).

Include clear Spanish comments inside the code to explain the logic and structure.

The final code should be ready for production, well-structured, and semantically correct.

All elements should be centered, responsive, and visually balanced as shown in the provided design.

The interface should have smooth transitions and professional styling — clean borders, readable typography, and good spacing.

🧱 Deliverables

Provide three code blocks, one for each file (index.html, styles.css, and script.js) so that I can copy and paste them directly into my environment.

Ensure the stopwatch starts from 00:00:00:000, updates every millisecond, can be paused and resumed accurately, and resets properly when “Clear” is pressed.

Generate the code now.