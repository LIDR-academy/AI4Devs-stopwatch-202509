Chatboot Utilizado:
El código fue generado utilizando GPT 4.1

Prompts Utilizados:
Se detallan los prompts utilizados en orden cronológico para llegar a la solución final.

prompt 1:
Sos un desarrollador fullstack senior. Crea una interfaz de usuario que permita usar un cronometro.
siguiendo estos criterios de aceptación: 

Criterios técnicos:
1- Separe el código html y javascript en index.html y script.js.
2- Utilice JS Vanilla.
3- Aplique los principios SOLID.
4- Implemente todos los registros necesarios en la consola.
5- Detecte todas las excepciones posibles.
6- Para CSS, utilice tailwind.
7- Haga que sea un sitio web adaptable.

Criterios de interfaz de usuario:
1- considera como diseño del cronometro y botones la imagen adjunta.
2- el estado inicial es cronometro en cero, boton izquierdo en "start" y boton derecho en "clear"

Criterios funcionales:
1- estados del boton izquierdo: "start", "pause", "continue"
2- estado "start" cronometro esta en cero y se activa
3- estado "pause" se detiene el cronometro
4- estado "continue" el cronometro se vuelve a activar.
6- al pulsar el boton "clear" el coronometro vuelve a cero.


prompt 2:
el cronometro creado anteriormente va a ser usado como un cronometro de cuenta atraz.
el estado inicial es un tiempo inicial seleccionado, boton izquierdo en "start" y el boton derecho en "clear"

crea una interfaz de usuario para setear el tiempo inicial para la cuenta atraz.

Criterios de interfaz de usuario:
1- display de reloj antes generado.
2- un boton "set", un boton "clear" y 10 botones del 0 al 9

Criterios funcionales:
1- al presionar los numeros se va rellenando el display de tiempo.
2- al presionar el boton "clear" el display de tiempo vuelve a cero.
2- al presionar el boton "set" aparece el cronometro antes generado con un tiempo inicial.
3- si no se setea ningun tiempo y se presiona el boton "set" aparece el cronometro antes generado con un tiempo inicial de 10 segundos.

prompt 3:
Sos un desarrollador fullstack senior. Crea una interfaz de usuario que permita usar un cronometro.
siguiendo estos criterios de aceptación: 

Criterios técnicos:
1- Separe el código html y javascript en index.html y script.js.
2- Utilice JS Vanilla.
3- Aplique los principios SOLID.
4- Implemente todos los registros necesarios en la consola.
5- Detecte todas las excepciones posibles.
6- Para CSS, utilice tailwind.
7- Haga que sea un sitio web response.

Criterios de interfaz de usuario:
1- considera como diseño del cronometro, botones y estilos en general los aplicados en la imagen adjunta.
2- el estado inicial del cronometro es 00:00:00, boton izquierdo en "start" y boton derecho en "clear"

Criterios funcionales:
1- estados del boton izquierdo: "start", "pause", "continue".
2- estado "start" cronometro se activa.
3- estado "pause" cronometro se detiene.
4- estado "continue" cronometro se vuelve a activar.
6- al pulsar el boton "clear" el cronometro vuelve a 00:00:00.

Crea una interfaz de usuario para ingreasr el tiempo inicial y mostrar un cronometro de cuenta atraz.

Criterios de interfaz de usuario:
1- considera como diseño del cronometro, botones y estilos en general los aplicados en la imagen adjunta.
1- display de reloj en cero con formato 00:00:00.
2- un boton "set", un boton "clear" y 10 botones del 0 al 9

Criterios funcionales:
1- al presionar los numeros se va rellenando el display de tiempo con horas:minutos:segundos.
2- al presionar el boton "clear" el display de tiempo vuelve a 00:00:00
2- al presionar el boton "set" desaparece "set", "clear" y los 10 botones numericos y aparece el cronometro antes generado con el display seteado con el tiempo inicial ingresado y el boton izquierdo en "start".
3- si no se ingresa ningun tiempo y se presiona el boton "set" aparece el cronometro antes generado con el display seteado con un tiempo igual a 10 segundos y el boton izquierdo en "start".
4- si los segundos ingresados es mayor a 60 convertir a minutos, ejemplo 00:00:90 = 00:01:30.
5- si los minutos ingresados es mayor a 60 convertir a horas, ejemplo 00:90:00 = 01:30:00
6- para el caso de cronometro de cuenta atraz al presionar "clear" el display debe setearse con el tiempo inicial ingresado y el boton izquierdo quedar en "start"

Crea una pagina web con dos botones "stopwatch" y "countdown".

Criterios de interfaz de usuario:
1- considera como diseño de botones y estilos en general los aplicados en la imagen adjunta.

Criterios funcionales:
1- al presionar "stopwatch" muestra el cronometro normal
2- al presionar "countdown" muestra la interfaz de ingreso de tiempo.
3- la interfaz de cronometro normal debe tener un boton "back" que dirija a la interfaz donde se muestran los botones "stopwatch" y "countdown".
4- la interfaz de ingreso de tiempo deben tener un boton "back" que permita volver a la interfaz donde se muestran los botones "stopwatch" y "countdown"

Pregúntame toda la información adicional que necesites antes de construirlo.

ChatGPT preguntas extra:

Antes de construir, necesito aclarar algunos puntos para asegurarme de cumplir exactamente tus expectativas:

1.Fuente y tamaño de los números en el display:

¿Quieres que utilice una fuente específica (por ejemplo, Arial Black, Impact, etc.) o alguna instrucción sobre el grosor/tamaño de los dígitos del display? ¿Quieres que el color y el borde del display sean exactamente como en la imagen (fondo azul claro, bordes oscuros)?

2.Botones:

¿Deseas que los botones tengan un gradiente como en la imagen o un color plano?
¿La tipografía de los botones debe ser igual a la del display o estándar?
¿El tamaño y el “border-radius” de los botones deben ser iguales al ejemplo visual?

3.Responsive:

¿Debo pensar en una visualización especialmente adaptada para móvil (botones más grandes, display más compacto, etc.), o solo asegurarme que se vea bien en cualquier ancho de pantalla?

4.Cronómetro y cuenta atrás:

¿El cronómetro debe mostrar milisegundos (como el “000” pequeño en la imagen) o basta con horas:minutos:segundos?
En cuenta atrás, ¿debe sonar algún sonido o mostrar alguna animación al llegar a cero, o simplemente detenerse?
¿Hay algún límite máximo de tiempo que se pueda ingresar (por ejemplo, impedir ingresar más de 99:59:59)?

5.Accesibilidad y feedback:

¿Quieres feedback en pantalla además de la consola? Por ejemplo, mensajes de error si se intenta hacer algo inválido, o solo basta con los logs en consola.

6.Idiomas:

¿Toda la UI debe estar en inglés (“Start”, “Clear”, “Back”…) o en español (“Iniciar”, “Borrar”, “Volver”…)?

Respuestas dadas a ChatGPT:
1. Fuente y tamaño de los números en el display:
toma como referencia la imagen adjunta.

2.Botones:
toma como referencia la imagen adjunta.

3.Responsive:
que se vea bien en cualquier ancho de pantalla.

4.Cronómetro y cuenta atrás:
4.1: mostrar como en la imagen.
4.2: solo detenerse.
4.3: considera esa restriccion.

5.Accesibilidad y feedback:
no

6.idiomas:
todo en ingles.

luego de considerar estos puntos avanza con la implementacion.

Luego de la implementacion surgieron errores de estilos para lo cual se agrega este prompt:

prompt 4:
1- toma el rectangulo que contiene el cronometro como ancho maximo.
2- asegura que horas:minutos:segundos  y los milisegundos queden dentro del rectangulo definido antes.
2- debajo y centrado respecto de su ancho coloca numeros y botones "set", "clear" segun el caso.
3- debajo de los elementos del punto anterior coloca el boton "back" en el extremo izquierdo.
4- aplica estilos al boton "back".

prompt 5:
genera un un archivo prompt final para la aplicacion considerando el prompt inicial, la información adicional que consideraste necesaria y los puntos a corregir finales.


prompt 6:
Crea una aplicación web Stopwatch & Countdown con las siguientes especificaciones:

---

**Criterios técnicos:**
1. Separa el código HTML y JavaScript en archivos `index.html` y `script.js`.
2. Usa JavaScript Vanilla.
3. Aplica principios SOLID en la arquitectura del JS.
4. Implementa todos los registros necesarios en la consola.
5. Maneja todas las excepciones posibles.
6. Usa Tailwind CSS para los estilos.
7. El sitio debe ser responsive y verse correctamente en web.

---

**Criterios de interfaz de usuario:**
1. El diseño del cronómetro, botones y estilos generales debe seguir fielmente la imagen adjunta:  
   - El rectángulo que contiene el cronómetro define el ancho máximo del componente y alinea el resto de elementos.
   - Las cifras de horas:minutos:segundos y los milisegundos deben estar completamente dentro del rectángulo, centrados y nunca sobresalir.
   - Debajo y centrado respecto del rectángulo, se ubican los botones numéricos y los botones "set" y "clear" (según corresponda).
   - Debajo de los elementos anteriores, coloca el botón "back" alineado al extremo izquierdo del rectángulo.
   - Aplica estilos al botón "back": fondo blanco, borde negro, padding, hover, texto negro y redondeado, inspirados en el diseño general.
2. La fuente, tamaño, colores, bordes y radio de los botones y del display deben coincidir con la imagen adjunta.
3. El cronómetro debe iniciar en 00:00:00 (milisegundos en 000), el botón izquierdo en "Start", el derecho en "Clear".
4. Todo el texto de la interfaz debe estar en inglés.

---

**Criterios funcionales:**

*Stopwatch:*
- El botón izquierdo alterna entre "Start", "Pause" y "Continue".
- "Start" activa el cronómetro.
- "Pause" lo detiene.
- "Continue" lo vuelve a reanudar.
- Al presionar "Clear", el cronómetro vuelve a 00:00:00 y el estado del botón izquierdo es "Start".

*Cuenta atrás (Countdown):*
- Interfaz inicial para ingresar el tiempo muestra display en 00:00:00, botones del 0 al 9, "Set" y "Clear" centrados bajo el rectángulo.
- Al presionar los números, el tiempo se ingresa en el display con formato horas:minutos:segundos, rellenando de derecha a izquierda.
- Si los segundos ingresados superan 59, se convierten a minutos automáticamente; igual con los minutos a horas.
- No se puede ingresar un valor mayor a 99:59:59.
- Al presionar "Clear" el display vuelve a 00:00:00.
- Al presionar "Set", si no se ingresó ningún tiempo, el valor predeterminado es 10 segundos. Luego, desaparecen los botones numéricos y "Set"/"Clear" y aparece el cronómetro de cuenta atrás con el tiempo inicial cargado y el botón izquierdo en "Start".
- En modo cuenta atrás, al presionar "Clear", el display se resetea al tiempo inicial ingresado y el botón izquierdo vuelve a "Start".
- El cronómetro de cuenta atrás se detiene automáticamente al llegar a cero (sin animaciones ni sonidos).

*Navegación:*
- Página principal con dos botones: "Stopwatch" y "Countdown" (diseño y colores según la imagen).
- Al presionar "Stopwatch" se muestra el cronómetro normal.
- Al presionar "Countdown" se muestra la interfaz de ingreso de tiempo.
- Tanto en la interfaz de cronómetro como en la de ingreso de tiempo, debe haber un botón "back" alineado a la izquierda bajo el resto de los controles, que regresa a la pantalla principal.

---

**Extras:**
- No es necesario feedback en pantalla ni mensajes de error visibles para el usuario, solo logs en consola.
- Usa únicamente inglés en la interfaz.

---

**Referencia de diseño:**  
Seguir exactamente el layout, colores, proporciones, tipografías y estilos mostrados en la imagen de ejemplo adjunta.

---

**Resumen:**  
La aplicación debe ser visualmente idéntica a la imagen de referencia, cumplir con todos los flujos y restricciones funcionales y técnicos detallados arriba, y tener una estructura de código limpia y mantenible aplicando principios SOLID.
