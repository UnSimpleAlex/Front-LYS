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

Propuesta simplificada según el adjunto codex-clipboard-ebd36303-4883-4ab3-a977-ad87a4db785e.png: Volver tiene su recompensa, frase breve, CTA Quiero ser parte y tres credenciales visibles juntas (Chispa crema, Brasa roja al frente y Fuego negra/dorada). Se eliminan selector, estados y explicaciones extensas. Cada rango tiene una sola frase; se conserva aviso breve de próximamente y CTA a /registro. Credenciales HTML/CSS con logo original WebP, títulos DM Sans y acento Caveat, las mismas familias del resto de la web; no se generan fotografías. Los rangos y beneficios se presentan como propuesta pendiente de reglas e integración, sin umbrales ni descuentos concretos. Responsive en dos columnas para tablet/PC y apilado en móvil.

Pedir ahora y Quiero ser parte comparten el rojo #ed0000. Las credenciales se elevan, amplían 10%, enderezan y pasan al frente con un destello al hover o foco de teclado; transición de 380 ms. Touch conserva la composición y reduced motion desactiva desplazamiento/destello.

La segunda diapositiva usa el fondo limpio adjunto codex-clipboard-6b777f19-da2a-4f14-89e7-3fc6bc04330a.png, optimizado en WebP 1080/2172. Copia: Comparte el fuego / de nuestra cocina; descripción y CTA Descubre combos según la referencia. Conserva Knewave y los controles del carrusel. En móvil el texto ocupa la parte superior y la fotografía la parte inferior para conservar legibilidad.

Actualización del carrusel 2: fondo codex-clipboard-2b6ab9ea-3f76-4cb7-b7c9-bc1bf564fa67.png (2508×627), WebP 1080/2172. El título se aísla en title-compartir.webp (1400×468, alpha) con ImageGen integrado desde la referencia; texto alternativo semántico en el h1. Prompt y origen en INICIO_ASSETS_GENERADOS.json.

Los banners 1 y 2 comparten las mismas reglas de altura en todos los breakpoints, sin saltos al cambiar de diapositiva. Lettering del segundo ajustado con ImageGen al rojo vivo del primero. Prueba de igualdad de altura a 320, 390, 768, 1440 y 1920 px.

El lettering del segundo carrusel usa un filtro SVG sRGB que lleva su rojo dominante (250,2,1) a (211,1,0), #D30100, según el adjunto codex-clipboard-555edd8d-0f0a-4f08-97a2-fda218df301e.png. Conserva alpha, negro y geometría, sin regenerar ni alterar la imagen original.

Transición refinada: fundido de 600 ms con fondo saliente opaco debajo para evitar destellos, easing de desaceleración; texto sale en 150 ms y entra en 450 ms con desplazamiento de 12 px; botones entran discretamente en 400 ms. Precarga y decodificación de fondos y lettering; reduced motion anula duraciones, retrasos y desplazamientos.

Descripciones del carrusel en Caveat 600, como el lema del login. Acciones persistentes ancladas a una posición común, sin animación vertical; primera acción mantiene coordenadas X/Y en las tres diapositivas. Nueva transición horizontal direccional de 700 ms con ease-in-out; texto acompaña con 24 px y fundido discreto. Pruebas verifican posición idéntica de botones en 320/390/768/1440/1920 px.

Descripciones seleccionables (pointer-events auto), con salto editorial antes de y la tradición de siempre en PC/tablet. Fondo móvil del segundo banner adaptado con ImageGen: hero-compartir-mobile.webp, montañas y motivos continuos detrás del lettering, parrilla abajo. Zoom de 2.5% y fundido de 850 ms reemplazan el desplazamiento horizontal; acciones conservan posición. Validación de solapamiento y selección en 14 anchos de 320 a 2560 px, sin prometer cobertura de todos los dispositivos posibles.

Fondo PC del carrusel 2 reemplazado por codex-clipboard-76e2dbc1-4c1f-4c6a-8f5e-e93ee004c464.png (2508×627), optimizado a WebP 1080/2172. La fuente móvil dedicada, lettering y acciones se conservan.

Distribución del segundo banner alineada con el primero: fondo PC recompuesto en proporción 3:1 para conservar la textura izquierda y fondo dedicado a tablet (651–1100 px) con alimentos moderados a la derecha. Versiones adaptadas con ImageGen, prompts y origen registrados en INICIO_ASSETS_GENERADOS.json. Ambos títulos comparten un espacio de proporción 1400/519, anchos de copia y descripción; la descripción del segundo ocupa dos líneas en PC/tablet. Se eliminan ampliaciones particulares del título y descripción en móvil. Botones, altura y tono rojo se conservan. Capturas revisadas en 390/768/1024/1366 px; pruebas de posición de descripción, botones y fuente tablet, además de los 14 anchos de 320 a 2560 px.

Ajuste de escala solicitado: productos del segundo banner ampliados 22% en móvil y 24% en tablet mediante transform con origen inferior derecho. El encuadre PC no cambia. Comparación visual de ambos banners a 390/768/1024 px y comprobación PC a 1366 px; descripción y botones conservan sus posiciones.

Alineación entre los dos primeros banners: lettering con altura común y ancho proporcional, sin deformación. La descripción se centra en una fila flexible entre el título y las acciones, con espacios superior/inferior iguales. Segundo texto en tres líneas hasta 1100 px. Se reemplazan los fondos móvil/tablet con adaptaciones ImageGen de la composición original del primer banner, cambiando pollo por parrilla en su misma ubicación y conservando acompañamientos; se eliminan los zooms particulares de 22/24%. PC conserva su fondo. Pruebas verifican centrado con tolerancia inferior a 1 px, tres líneas, altura de lettering y acciones fijas; capturas revisadas en 320/390/768/1024/1366 px.
