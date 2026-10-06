# Pantalla de inicio de sesión

## Implementación

React + TypeScript + Vite, sin biblioteca de componentes ni motor de animación adicional. `Header` contiene navegación desktop/móvil; `SignInPage` coordina el fondo, bienvenida y `SignInCard`. Tokens y responsive se centralizan en `src/styles/`.

La UI permanece separada del acceso a datos: `SignInCard → useSignIn → AuthService`. El adaptador actual devuelve disponibilidad futura; no autentica, transmite, registra ni persiste contraseñas. La preferencia «Recordarme» se entrega al servicio, pero no crea una sesión local. Registro, recuperación y navegación a secciones pendientes abren avisos accesibles.

## Referencias y geometría

- Desktop: 1672 × 941; cabecera de 116 px, tarjeta de aproximadamente 590 × 690 px a la derecha.
- Móvil original: 1080 × 1920; logo, pedido y menú en la cabecera, bienvenida y fotografía arriba, tarjeta abajo.
- Se apila el contenido hasta 900 px de ancho y en viewports verticales hasta 1150 px. La navegación cambia a menú hasta 1150 px para evitar colisiones.
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
