# Página de Inicio

Ruta `/`; login en `/iniciar-sesion`, registro en `/registro`. El historial y los formularios conservan su comportamiento. La rama `feature/pagina-inicio` parte de `dev` e incorpora la base de `feature/inicio-sesion` (PR #1 aún abierto), sin modificar `dev` ni `main`.

## Referencias y composición

Referencias suministradas: desktop `3.png` + `4.png`, móvil `Movil/1.png` + `Movil/2.png`, como una sola página continua. Navbar, carrusel, servicios, especialidades, promociones, membresía y footer. Componentes en `src/features/home`, coordinados por `HomePage`.

Se usan los fondos y fotografías adjuntos, con WebP y tamaños 640/1080; hero 1080/2172. El fondo móvil y el lettering principal se recrearon con la herramienta integrada ImageGen. Se preservó alpha en el título. Las fotografías suministradas tienen diferencias respecto de las incluidas en los mockups; se priorizan los recursos originales autorizados (incluido el fondo amarillo del Dúo). Caveat aproxima la escritura de los títulos secundarios y Knewave la de los otros slides, ambas con licencia OFL; Impact/Arial Narrow aproxima los títulos condensados.

La sección «Por qué elegirnos» fue eliminada por solicitud del usuario; el bloque de membresía conecta directamente con el footer. Nosotros muestra el aviso de disponibilidad pendiente.

## Interacciones

Especialidades y promociones tienen fondo blanco. El footer utiliza iconos SVG de Facebook, Instagram, TikTok y YouTube, con tamaño uniforme y nombres accesibles.

Carrusel manual con 3 diapositivas: flechas, indicadores, teclado y deslizamiento táctil. Sin rotación automática. Motion controla transiciones y estados de botones/tarjetas; `MotionConfig` respeta reducción de movimiento y se anula la duración del carrusel cuando corresponde. Menú móvil/tablet con Escape y animación discreta. Navegación Inicio/Promociones/Contacto desplaza a las secciones.

Carta, pedidos, locales y enlaces sociales muestran avisos de disponibilidad pendiente. No se simulan pedidos ni enlaces externos sin URL oficial. Los importes y datos de contacto son los de la referencia, pendientes de confirmación comercial; no hay checkout ni llamadas telefónicas habilitadas. No se ofrecerá una app; el anuncio y las descargas fueron reemplazados por la propuesta de membresía. No se añaden servicios ni integración de backend.

## Rendimiento y accesibilidad

Home y registro cargan en módulos separados. Build: entrada ~359 kB / 114 kB gzip, Home ~18 kB / 6 kB gzip, registro ~224 kB / 61 kB gzip. Hero prioritario y resto de fotos lazy. Todos los recursos Home son locales y los nuevos WebP suman ~1.7 MB entre variantes (el navegador selecciona las necesarias). Texto accesible acompaña el lettering; foco visible, controles semánticos y estados anunciados.

## Validación

Promo Familiar usa la imagen roja de 1916×821 suministrada (confirmada con el adjunto `codex-clipboard-518fd0ed-ba2e-4624-bf49-c7767ee524b9.png`), igual en proporción a Parrillera y Dúo. Las tres tarjetas comparten altura incluso cuando se apilan: las filas uniformes y el estiramiento explícito evitan que una línea adicional de texto cambie el tamaño. Las pruebas responsive verifican igualdad de alturas y contenido sin recortes.

Lint, typecheck y build. Suite de 89 casos: 71 regresiones de auth y 18 de Home. Home verificado a 320×568, 360×800, 375×812, 390×844, 412×915, 430×932, 480×900, 768×1024, 1024×768, 1280×800, 1366×768, 1440×900 y 1920×1080: carga de imágenes, sin desbordamiento, consola sin errores de ejecución, carrusel, navegación y reduced motion. Comparación visual de capturas con las referencias, incluyendo corrección de CTA y flechas de tarjetas a 320–375 px; evidencias históricas del diseño inicial en `docs/visual/inicio-320.jpg`, `inicio-390.jpg`, `inicio-768.jpg`, `inicio-1920.jpg`.

## Círculo de la Brasa

Propuesta de afiliación con rangos Chispa, Brasa y Fuego: los pedidos acercan al siguiente rango. Credencial construida con HTML/CSS con logo original, tres selectores accesibles y cambio de color/contenido; no requiere una fotografía ni una imagen generada. CTA Quiero ser parte abre /registro con retorno por historial. Se indica membresía próximamente; no se simula afiliación real ni progreso de una cuenta. Nombres de rangos propuestos; requisitos, conteo de pedidos, beneficios y condiciones pendientes de aprobación y backend. La sección conserva la marca roja/blanca y Caveat, se apila en móvil y ocupa dos columnas en tablet/PC. Se eliminó el código y estilos exclusivos de la antigua app.
