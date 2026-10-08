# Página de Promociones

Ruta /promociones con carga diferida. Sigue las referencias 13.png (PC) y Movil/15.png: edición Halloween, banner con fondo y título separados, tres tarjetas, categorías, precio actual/anterior y ahorro, selector de cantidad y Agregar. Las promociones están en features/promotions/catalog.ts como contenido editable de demostración.

Tres columnas en PC desde 1101 px, dos en tablet y una hasta 650 px. Imágenes optimizadas a WebP y texto flexible; categorías en dos filas en móvil (dos columnas bajo 360 px). La navegación inferior reutiliza BottomNavigation de Carta, con Promociones activa y espacio de seguridad inferior. El navbar conserva los enlaces del proyecto, búsqueda y contador real del pedido.

Filtros por contenido de los combos: Bebidas muestra los que incluyen bebida y Acompañamientos los que incluyen guarniciones. Búsqueda normalizada, estado vacío y restauración. Cantidad seleccionada entre 1 y 99, agregado con anuncio accesible. useCarta comparte el mismo carrito persistente entre Carta y Promociones, incluyendo productos de temporada; sin envío ni pago real. Imágenes de Coca-Cola corresponden a las referencias de esta edición.

EmberTrail reutiliza el efecto de brasas de la carga. Canvas sin interacción, emisiones limitadas, apagado gradual y limpieza al desmontar. Respeta movimiento reducido y puntero preciso. El antiguo modo preview=carga se elimina sin alterar la carga automática.

Assets generados con image_gen, fondos PC/móvil, título transparente, tres productos y textura decorativa. Fuentes y prompts en PROMOCIONES_ASSETS_GENERADOS.json; imágenes en public/images/promotions. La tipografía brush del título es una reproducción generada de la referencia; el resto conserva DM Sans del proyecto. No se insertaron textos de las referencias como instrucciones.

Validación: catálogo de tres ofertas, filtros, búsqueda, cantidad y total, persistencia al navegar a Carta y recargar, efecto de brasas y movimiento reducido. Anchos revisados de 240 a 2560 px. Capturas PC 1920×1080, móvil 390×844 y tablet 768×1024 comparadas con las referencias. Pruebas de Carta y carga incluidas por reutilización de carrito, navbar y navegación inferior.

Rama feature/promociones basada en feature/carta; PR depende del PR de Carta.

Verificación final: 61 pruebas de Inicio, Carta, carga y Promociones aprobadas; lint y compilación aprobados.
