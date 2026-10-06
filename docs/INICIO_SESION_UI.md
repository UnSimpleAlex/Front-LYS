# Pantalla de inicio de sesión

## Implementación

React + TypeScript + Vite, sin biblioteca de componentes ni motor de animación adicional. `Header` contiene navegación desktop/móvil; `SignInPage` coordina el fondo, bienvenida y `SignInCard`. Tokens y responsive se centralizan en `src/styles/`.

La UI permanece separada del acceso a datos: `SignInCard → useSignIn → AuthService`. El adaptador actual devuelve disponibilidad futura; no autentica, transmite, registra ni persiste contraseñas. La preferencia «Recordarme» se entrega al servicio, pero no crea una sesión local. Registro, recuperación y navegación a secciones pendientes abren avisos accesibles.

## Referencias y geometría

- Desktop: cabecera de 88 px, tarjeta de hasta 520 px de ancho a la derecha; altura definida por contenido.
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
