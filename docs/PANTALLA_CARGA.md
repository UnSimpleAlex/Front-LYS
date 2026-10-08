# Pantalla de carga

RouteLoading es el fallback compartido de Suspense para Inicio, Carta y registro. Usa logo existente, llama SVG sobre brasa oscura, arco rojo en movimiento, chispas y el mensaje «Encendiendo el sabor…». No muestra porcentajes inventados.

La escena aparece sólo si la carga supera 180 ms, mediante un temporizador con limpieza al desmontar. El contenido real se muestra inmediatamente cuando está listo; no hay duración mínima forzada. El estado se anuncia con role=status y los adornos se ocultan a lectores de pantalla. Las animaciones se desactivan con movimiento reducido.

CSS independiente cargado con App, sin esperar los estilos de las páginas lazy. Se retiró el fallback textual y su regla antigua de home.css. Responsive de PC, tablet y celular.

Validación: cinco pruebas de carga aprobadas (390/768/1672 px, movimiento reducido, Inicio y registro), más las 18 pruebas existentes de Carta. Lint, TypeScript y build aprobados. Se revisaron capturas de PC y celular con carga demorada deliberadamente durante la verificación.
