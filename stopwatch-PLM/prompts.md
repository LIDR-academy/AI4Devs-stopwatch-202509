# CHATPGT con el modelo GPT-5

# Iteración 1

1. Comportate como un desarrollador de aplicaciones web experto en javascript y html.

2. Crea una aplicacion que por un aldo funcione como un cronometro y por otro funcione como un "cuentaregresiva", siguiendo estos criterios:

    Tecnicos:
    1. Separa el código HTML y JavaScript en index.html y script.js
    2. Use JS Vanilla
    3. Aplique los principios SOLID
    4. Implemente todos los registros necesarios en la consola
    5. Capture todas las posibles excepciones

    Esteticos/diseño de interfaz:
    1. Para CSS, use Tailwind
    2. Conviértalo en un sitio web responsivo
    3. Toma como plantilla las imagenes png que te iré adjuntando en los criterios funcionales.

    Criterios funcionales:
    1. Habra una opcion de menu prinicipal (referencia tomar la imagen: menuPrincipal.png) que te permita ingresar si el mismo actuara de "cronometro" o  de "cuenta regresiva".
    2. Al seleccionar "cronometro" te llevara a una pantalla como ("cronometro.png") donde la misma indicara el reloj con horas:minutos:segundos y las centesimas en letra mas pequeña debajo de los sgeundos.
    3. los botones serán "arrancar" y "limpiar", cuando el arrancar se presiona y comienza a contar, ese boton se transforma en pausar, frenando el tiempo, y a su vez el boton se transformara en "continuar", si se presiona sigue andando el tiempo desde donde se paró, si se presiona "limpiar", el cronometro arrancará de cero 00:00:00, tambien dispondremos de un boton volver que nos devolvera al menu prinicipal por si queremos utilziar la opcion de cuenta taras io lo que sea.
    4. La "cuenta Atras" (cuentaAtras.png) actuará de la siguiente amnera: se setea la hora, minuto y segundo que queremos que comience y cuando le damos arrancar, hace cuenta regresiva, hasta llegar a cero. Los botones numericos nos permiten setear el horario de arranque y  luego el "set" lo pone en modo listo para arranque, que nos mostrara el tiempo y 2 botones "arrabcar" y "limpiar". el arrancar empieza la cuenta regresiva (si se llega a cero el reloj titilará y empezará a sonar una alarma) el otro boton de "limpiar", aca resetea al horario de arranque. el de arrancar como en el cronometro se transforma en "continuar" y "pausar".

3. Pedime toda la información adicional que necesite antes de crearlo.

# Iteración 2: solucionar errores y refinar el diseño:

1. Los titulos de los botones en español
2. El back superior en el menu principal no deberia ir, porque no vuelve a ningun lado.
3. Timer Suite, el titulo, deberia cambairse a español.
4. El sonido cuando llega a cero es muy corto, debe seguir sonando hasta que tome otra opcion.

# Iteración 2: elimianr boton "volver" duplicado

1. El boton en la parte superior de volver funciona bien ahora, aparece en los submenues. pero sigue mostrandose el del pie. ese deberia elimianrse