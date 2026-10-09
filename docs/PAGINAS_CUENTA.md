# Páginas institucionales y Mi cuenta

Rutas: `/nosotros`, `/locales`, `/contacto`, `/mi-cuenta` y subrutas `pedidos`, `direcciones`, `datos`, `metodos-pago`, `notificaciones`, `favoritos`.

## Recursos y datos públicos

Se conservan DM Sans y Caveat. Tras la nueva instrucción del propietario se generaron diez imágenes (nueve activas y una variante) para reproducir los fondos, escenas de la historia, fachada conceptual e ilustración de Mi cuenta de las referencias. Se optimizaron a WebP en `public/images/information/`. La fachada se identifica como ilustración referencial, no como fotografía real del restaurante. Los textos siguen siendo HTML editable. Ver `IMAGENES_INSTITUCIONALES.md` para prompts y archivos.

Los datos proporcionados por el propietario están centralizados en `src/features/information/business.ts`: C. Turístico Los Palomares Mz. D Lt. 5, frente a la Planta Eléctrica San Benito, Carabayllo; 947 540 597; ventas@lenasysabores.store; 12 m. a 11 p. m. No se inventaron días de atención ni enlaces a redes sociales.

El mapa de Locales/Contacto muestra la zona y una búsqueda de Los Palomares en OpenStreetMap. No coloca un marcador de restaurante sin coordenadas confirmadas. La ubicación exacta queda pendiente. La selección de domicilios reutiliza Leaflet, sugerencias Photon y ubicación actual opcional.

El footer de Inicio se comparte desde `App` en todas las páginas públicas, checkout y Mi cuenta. Login y registro no muestran footer. La navegación móvil de cada sección se conserva.

## Comportamiento frontend

Contacto valida el formulario y prepara enlaces `mailto:`/WhatsApp. El cliente confirma el envío en su aplicación; no se afirma que se haya enviado un mensaje desde el sitio.

Mi cuenta se identifica como demostración, porque la autenticación actual continúa sin backend. Perfil, direcciones, método preferido y preferencias se guardan en `sessionStorage`, solo en la pestaña; se pueden restablecer. No se solicita contraseña ni se guardan tarjetas/CVV/códigos de pago. Los favoritos y el carrito reutilizan el almacenamiento existente del catálogo. El perfil, la dirección principal y el método preferido precargan checkout; las demás direcciones también aparecen como opciones.

El historial recupera los comprobantes de checkout en la pestaña, valida su estructura y reconstruye los productos desde el catálogo. Se conservan hasta 50 comprobantes de demostración. Pedidos y notificaciones ilustrativos se activan con una opción explícita, sin mezclarse con el historial real de la demostración. Filtros, detalles, repetir pedido, CRUD de direcciones y preferencias funcionan localmente. No existen envíos de notificaciones, seguimiento operativo ni cobros reales.

## Verificación

`tests/information-account.spec.ts` cubre rutas a 240, 280, 320, 390, 768, 1024, 1440 y 1920 px; datos de ejemplo explícitos; imágenes; errores del navegador; formularios; enlaces de contacto; persistencia en la pestaña; CRUD; precarga de checkout; favoritos/carrito; filtros/detalles/repetir pedidos; avisos leídos y preferencias.

Los mapas/sugerencias se interceptan en pruebas para no depender de los servicios públicos. Las capturas de PC/tablet/móvil se guardan en `test-results/` (ignorado por Git).

Nosotros ordena en móvil (hasta 580 px) el título, la foto del local con el pollo y después los párrafos. En PC y tablet conserva el texto a la izquierda y la foto a la derecha. A partir de 1024 px, el bloque principal ocupa al menos la altura visible menos el header de 64 px, de modo que misión, visión y valores aparecen al hacer scroll; el contenido puede crecer sin recortes. Conserva la imagen PNG seleccionada por el propietario (about-restaurant-selected.png), con transparencia. El título usa about-title.png, lettering transparente generado según la referencia y con texto alternativo dentro del h1. Debajo se incorporó la nueva referencia de Misión, Visión y Valores: tres columnas abiertas con textos HTML, iconos rojos y fondo derivado de la última referencia de montañas y leña (principles-background-v2.png). Se retiraron el título general, las tarjetas y los adornos inferiores; las columnas se separan mediante líneas finas. Se redujeron espacios, iconos y tipografía para disminuir la altura de la sección. En móvil se apilan las columnas y los separadores son horizontales. La línea de tiempo anterior y su botón permanecen retirados; se conserva el footer global.
