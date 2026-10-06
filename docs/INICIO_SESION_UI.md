# Pantalla de inicio de sesión

## Implementación

React + TypeScript + Vite, sin biblioteca de componentes ni motor de animación adicional. `Header` contiene navegación desktop/móvil; `SignInPage` coordina el fondo, bienvenida y `SignInCard`. Tokens y responsive se centralizan en `src/styles/`.

La UI permanece separada del acceso a datos: `SignInCard → useSignIn → AuthService`. El adaptador actual devuelve disponibilidad futura; no autentica, transmite, registra ni persiste contraseñas. La preferencia «Recordarme» se entrega al servicio, pero no crea una sesión local. Registro, recuperación y navegación a secciones pendientes abren avisos accesibles.

## Referencias y geometría

- Desktop: cabecera de 64 px (60 px en layout apilado), tarjeta de hasta 520 px de ancho a la derecha; altura definida por contenido.
- Móvil original: 1080 × 1920; logo, pedido y menú en la cabecera, bienvenida y fotografía arriba, tarjeta abajo.
- Se apila el contenido hasta 900 px de ancho y en viewports verticales hasta 1150 px. La navegación cambia a menú hasta 1250 px para evitar colisiones.
- Las dimensiones intermedias son fluidas. En pantallas estrechas se conservan inputs y botones utilizables; el formulario puede ocupar más altura que la referencia escalada.

El título es lettering raster con texto semántico en el `h1`; no se renderiza la captura completa como interfaz. El formulario y la navegación son HTML/React interactivo.

## Validación

Se capturaron pantallas a 360 × 800, 390 × 844, 430 × 932, 768 × 1024, 1024 × 768, 1080 × 1920, 1280 × 800, 1440 × 900, 1672 × 941 y 1920 × 1080. Se compararon visualmente las referencias desktop/móvil y las capturas de tablet y escritorio intermedio.

Las pruebas de navegador revisan carga de imágenes y fuentes, ausencia de overflow horizontal y errores de consola, composición apilada/doble columna, validación del formulario, visibilidad de contraseña, checkbox, ausencia de credenciales almacenadas, menú, Escape y restauración de foco de diálogos.

Comprobaciones: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`. Evidencia en `docs/visual/`; las nuevas ejecuciones guardan capturas en `test-results/` (ignorado por Git).

## Diferencias y límites

- Los fondos y el logo suministrados difieren de los que aparecen en las capturas de diseño; se reutilizan los assets entregados y se atenúa el decorado superior con CSS.
- El lettering fue aislado/recreado mediante ImageGen desde la referencia y mantiene pequeñas diferencias de trazos y proporciones.
- DM Sans es una aproximación para la tipografía de interfaz; no se identificó la familia exacta del diseño.
- No hay integración InsForge, OAuth real, catálogo, pedidos ni creación/recuperación de cuentas en esta entrega.
- Las pruebas no acreditan capacidad de usuarios concurrentes ni incluyen auditoría completa de accesibilidad.

## Pulido responsive e interacción

- El contenedor principal usa flex y `100dvh`; se elimina la altura mínima fija de 825 px. Solo se recorta el contenedor decorativo del fondo, nunca los controles. Móviles conservan scroll vertical natural.
- Tarjeta apilada con máximo de 560 px. Labels visibles, inputs de 54 px, contenido de 16 px, acciones secundarias de 13–14 px y control del ojo de 44 × 44 px. Errores asociados con `aria-describedby` y foco en el primer campo inválido.
- Campos con estados normal, hover, focus, filled, error y disabled. Botones con elevación de 2 px, presión a .98 y retorno suave. Indicador de carga durante operaciones reales; el hook evita envíos simultáneos y distingue disponibilidad pendiente, fallo y éxito.
- SVG de trazo 1.8, entrada de tarjeta de 8 px/300 ms y transiciones de ojo/check. CSS propio, sin nuevas dependencias. `prefers-reduced-motion` deshabilita animaciones y transiciones; la carga mantiene su texto.
- 20 pruebas aprobadas: 15 resoluciones (320, 360, 375, 390, 412, 430, 480, 768, 1024, 1080, 1280, 1366, 1440, 1672 y 1920 px) y 5 escenarios de autenticación/teclado, con servicio de prueba para carga, error y éxito. Sin errores de consola. Lint, typecheck y build aprobados.
- Evidencia actual: `visual/login-pulido-320.jpg` y `visual/login-pulido-1366.jpg`. Los PNG anteriores conservan evidencia de la primera versión. No se ha probado autenticación real ni todos los navegadores móviles físicos.

### Ajuste de navbar, bienvenida y escala tipográfica

Navbar con línea inferior cálida y sombra tenue; botón «Mi pedido» con carrito SVG. La bienvenida elimina desplazamientos laterales del párrafo y no tiene fondo propio; el título se limita a 550 px en escritorio para ubicar el párrafo dentro de la zona clara de la imagen. Su ancho se limita a la columna y se verifica en las 15 resoluciones.

Escala actual DM Sans: título 28–32 px/peso 650, labels 14 px/peso 600, campos 16 px, acciones secundarias 14 px y botones 16–17 px. Inputs de 46 px y botones principales de 50 px de altura; se conserva el control de contraseña de 44 px. Las capturas de esta revisión se generan en `test-results/`; los JPG anteriores corresponden al pulido previo.

### Controles compactos y frase manuscrita

Mi pedido: botón visible de 36 px con área de interacción ampliada a 44 px. Casilla visible Recordarme: 16 px, dentro de label de 44 px. La frase usa Caveat 600, centrada bajo el título (20–28 px apilado y 24–30 px en escritorio), sin fondo propio. Se mantiene DM Sans en el formulario.

### Corrección de posición de la frase

El párrafo mantiene Caveat y se limita a 340 px en escritorio para centrarlo en la zona izquierda clara, sin alcanzar la bolsa. En composición apilada su ancho máximo es 60vw/340px, alineado a la izquierda, sin margen superior, con escala de 19–26 px. No tiene fondo propio.

### Alineación común en móvil, tablet y PC

Título y frase comparten un contenedor de ancho fluido: hasta 550 px en escritorio y 66vw/600px en composición apilada. El párrafo se alinea con el borde visible del lettering mediante un margen interior proporcional del 3%; ambas líneas conservan el mismo inicio. Caveat 600 adapta su tamaño al ancho de ese contenedor (18–28 px). No se añade fondo al texto.

En composición apilada se reservan 40 px antes del fondo fotográfico para separar la frase del asa de la bolsa incluso a 320 px. El contenedor de bienvenida tiene ancho explícito para evitar que la contención de tamaño reduzca su ancho en flex.

Validación actual: 22 pruebas aprobadas, con 17 resoluciones de 320 a 1920 px, incluyendo tablets verticales de 820 y 912 px. Las pruebas verifican que las dos líneas no se dividan, compartan borde izquierdo y permanezcan dentro del ancho del título, además de los controles y overflow. Capturas revisadas en móvil estrecho, móvil, tablets y escritorio. Lint, typecheck y build aprobados. Las capturas anteriores en docs/visual corresponden a versiones previas; la evidencia actual se genera en test-results/.
