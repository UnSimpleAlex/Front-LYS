# Pantalla de carga

RouteLoading es el fallback compartido de Suspense para Inicio, Carta y registro. Muestra el logo existente, fondo peruano gris tenue y tres puntos rojos grandes centrados, con pulso escalonado de 1.2 segundos. El mensaje «Preparando tu experiencia…» usa Caveat 600 como el subtítulo de Carta, con tamaño responsive entre 30 y 48 px. Se retiraron pollo, asador, vapor, flechas y su CSS exclusivo.

La escena aparece sólo si la carga supera 180 ms, mediante un temporizador con limpieza al desmontar. El contenido real se muestra inmediatamente cuando está listo; no hay duración mínima forzada. role=status anuncia la carga; puntos y canvas son decorativos. Movimiento reducido detiene el pulso.

En PC, el contenedor ocupa 100dvh y usa el espacio restante bajo el navbar sin generar scroll. La composición distribuye logo y mensaje alrededor de los puntos centrales con una cuadrícula simétrica. En tablet/móvil el fondo muestra los extremos originales con máscaras suaves.

LoadingEmbers dibuja brasas rojizas al mover el mouse: apagado en 1.1 segundos, máximo 90 partículas, dibujo sólo mientras hay partículas vivas, observación de tamaño y limpieza al desmontar. Desactivado para movimiento reducido y dispositivos sin puntero preciso.

Vista previa sólo en desarrollo: /carta?preview=carga mantiene la pantalla visible y ofrece un enlace para volver. import.meta.env.DEV excluye esta vista del build de producción.

Fondo generado en public/images/loading/background.webp (1672×941). Fuentes y prompts en CARGA_ASSETS_GENERADOS.json; el antiguo recorte del pollo se conserva como asset sin uso.
