# Pantalla de carga

RouteLoading es el fallback compartido de Suspense para Inicio, Carta y registro. Sigue la referencia codex-clipboard-d439f25e-c71c-4219-a363-ed4963018330.png: logo grande existente, fondo peruano gris tenue, pollo ilustrado sobre asador horizontal fijo, vapor, flechas y «Preparando tu experiencia…» con ornamento rojo.

El pollo usa un recorte transparente generado con image_gen y un giro CSS corto de 3.6 segundos, con aceleración y desaceleración suaves. Se limita a ±14° en el eje horizontal y ±2° de inclinación para conservar el volumen aparente y evitar el aplanamiento del giro completo. Es una simulación ilustrada sobre un plano 2D, no un modelo volumétrico 3D. Eje y sombra permanecen fijos. Se retiraron los pollos transparentes laterales; tres puntos rojos animados aparecen encima del mensaje, con pulso escalonado de 1.2 segundos. Movimiento reducido los mantiene fijos. Sólo se animan transform y opacity. Los fondos de tablet/móvil muestran los extremos originales con máscaras suaves sin estirar la imagen.

La escena aparece sólo si la carga supera 180 ms, mediante un temporizador con limpieza al desmontar. El contenido real se muestra inmediatamente cuando está listo; no hay duración mínima forzada. role=status anuncia la carga; adornos e imágenes de pollo se ocultan a lectores de pantalla. Movimiento reducido deja el pollo fijo y oculta el vapor.

Vista previa sólo en desarrollo: /carta?preview=carga mantiene la pantalla de carga y ofrece un enlace para volver a la ruta sin el parámetro. import.meta.env.DEV excluye esta vista del build de producción.

Assets finales en public/images/loading/chicken.webp (900×507, alpha) y background.webp (1672×941). Se generaron dos imágenes por separado con la herramienta integrada image_gen; el logo se reutilizó. Fuentes y prompts completos en CARGA_ASSETS_GENERADOS.json. Conversión a WebP: 122 KB para pollo y 46 KB para fondo; las fuentes PNG permanecen conservadas en sus rutas originales.

Validación: seis pruebas de carga aprobadas, incluyendo giro continuo, movimiento reducido, tamaños 390/768/1672 px, Inicio, registro y retorno desde la vista previa. Lint, TypeScript y build aprobados. Capturas PC, tablet y móvil revisadas.

Ajuste de movimiento: siete pruebas de carga aprobadas, incluida una comprobación de que la altura visible del pollo conserva al menos el 90% durante todo el ciclo. Se revisaron ambas posiciones extremas.

En PC, el contenedor raíz de carga ocupa 100dvh. La escena usa el espacio restante bajo el navbar y ajusta sus dimensiones al alto disponible, sin ocultar el scroll de las páginas normales.
