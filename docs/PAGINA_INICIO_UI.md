# Página de Inicio

Ruta `/`; login en `/iniciar-sesion`, registro en `/registro`. El historial y los formularios conservan su comportamiento. La rama `feature/pagina-inicio` parte de `dev` e incorpora la base de `feature/inicio-sesion` (PR #1 aún abierto), sin modificar `dev` ni `main`.

## Referencias y composición

Referencias suministradas: desktop `3.png` + `4.png`, móvil `Movil/1.png` + `Movil/2.png`, como una sola página continua. Navbar, carrusel, servicios, especialidades, promociones, app, motivos para elegirnos y footer. Componentes en `src/features/home`, coordinados por `HomePage`.

Se usan los fondos y fotografías adjuntos, con WebP y tamaños 640/1080; hero 1080/2172. El fondo móvil y el lettering principal se recrearon con la herramienta integrada ImageGen. Se preservó alpha en el título. Las fotografías suministradas tienen diferencias respecto de las incluidas en los mockups; se priorizan los recursos originales autorizados (incluido el fondo amarillo del Dúo). El teléfono se construye como un mockup HTML/CSS usando logo e imagen reales. Caveat aproxima la escritura de los títulos secundarios y Knewave la de los otros slides, ambas con licencia OFL; Impact/Arial Narrow aproxima los títulos condensados.

## Interacciones

Carrusel manual con 3 diapositivas: flechas, indicadores, teclado y deslizamiento táctil. Sin rotación automática. Motion controla transiciones y estados de botones/tarjetas; `MotionConfig` respeta reducción de movimiento y se anula la duración del carrusel cuando corresponde. Menú móvil/tablet con Escape y animación discreta. Navegación Inicio/Promociones/Nosotros/Contacto desplaza a las secciones.

Carta, pedidos, locales, enlaces sociales y descargas de app muestran avisos de disponibilidad pendiente. No se simulan pedidos ni enlaces externos sin URL oficial. Los importes y datos de contacto son los de la referencia, pendientes de confirmación comercial; no hay checkout ni llamadas telefónicas habilitadas. La app todavía no está publicada. No se añaden servicios ni integración de backend.

## Rendimiento y accesibilidad

Home y registro cargan en módulos separados. Build: entrada ~359 kB / 114 kB gzip, Home ~18 kB / 6 kB gzip, registro ~224 kB / 61 kB gzip. Hero prioritario y resto de fotos lazy. Todos los recursos Home son locales y los nuevos WebP suman ~1.7 MB entre variantes (el navegador selecciona las necesarias). Texto accesible acompaña el lettering; foco visible, controles semánticos y estados anunciados.

## Validación

Lint, typecheck y build. Suite de 88 casos: 71 regresiones de auth y 17 de Home. Home verificado a 320×568, 360×800, 375×812, 390×844, 412×915, 430×932, 480×900, 768×1024, 1024×768, 1280×800, 1366×768, 1440×900 y 1920×1080: carga de imágenes, sin desbordamiento, consola sin errores de ejecución, carrusel, navegación y reduced motion. Comparación visual de capturas con las referencias; evidencias en `docs/visual/inicio-390.jpg`, `inicio-768.jpg`, `inicio-1920.jpg`.
