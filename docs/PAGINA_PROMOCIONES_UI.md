# Página de Promociones



Ruta /promociones con carga diferida. Sigue las referencias 13.png (PC) y Movil/15.png: edición Halloween, banner con fondo y título separados, 15 tarjetas, categorías, precio actual/anterior y ahorro, selector de cantidad y Agregar. Las promociones están en features/promotions/catalog.ts como contenido editable de demostración.



Tres columnas en PC desde 1101 px, dos en tablet y una hasta 650 px. Imágenes optimizadas a WebP y texto flexible; categorías en dos filas en móvil (dos columnas bajo 360 px). La navegación inferior reutiliza BottomNavigation de Carta, con Promociones activa y espacio de seguridad inferior. El navbar conserva los enlaces del proyecto, búsqueda y contador real del pedido.



Cada categoría cuenta con al menos tres ofertas propias: 6 combos, 4 familiares, 3 individuales, 3 bebidas y 3 acompañamientos. Las doce ofertas nuevas reutilizan fotos y descripciones de los productos correspondientes de Carta. Búsqueda normalizada, estado vacío y restauración. Cantidad seleccionada entre 1 y 99, agregado con anuncio accesible. useCarta comparte el mismo carrito persistente entre Carta y Promociones, incluyendo productos de temporada; sin envío ni pago real. Imágenes de Coca-Cola corresponden a las referencias de esta edición.



EmberTrail reutiliza el efecto de brasas de la carga. Canvas sin interacción, emisiones limitadas, apagado gradual y limpieza al desmontar. Respeta movimiento reducido y puntero preciso. El antiguo modo preview=carga se elimina sin alterar la carga automática.



Assets generados con image_gen, fondos PC/móvil, título transparente, tres productos y textura decorativa. Fuentes y prompts en PROMOCIONES_ASSETS_GENERADOS.json; imágenes en public/images/promotions. La tipografía brush del título es una reproducción generada de la referencia; el resto conserva DM Sans del proyecto. No se insertaron textos de las referencias como instrucciones.



Validación: catálogo de 15 ofertas, filtros, búsqueda, cantidad y total, persistencia al navegar a Carta y recargar, efecto de brasas y movimiento reducido. Anchos revisados de 240 a 2560 px. Capturas PC 1920×1080, móvil 390×844 y tablet 768×1024 comparadas con las referencias. Pruebas de Carta y carga incluidas por reutilización de carrito, navbar y navegación inferior.



Rama feature/promociones basada en feature/carta; PR depende del PR de Carta.



Verificación final: 61 pruebas de Inicio, Carta, carga y Promociones aprobadas; lint y compilación aprobados.



Ajuste visual: fondo blanco con los mismos motivos laterales, banner PC/móvil con zona crema ampliada y pollo desplazado a la derecha; contorno naranja animado en hover y foco, con movimiento reducido respetado. Prompts de las tres ediciones en PROMOCIONES_AJUSTES_ASSETS.json.

Validacion de la ampliacion: 34 pruebas de Carta y Promociones aprobadas (incluidas categorias y contorno naranja), lint y build aprobados.


## Dimensiones y presentación compartidas con Carta

El banner usa la altura de Carta (clamp de 180 a 360 px en escritorio; relación 2.55 y altura mínima de 150 px en móvil). Las categorías reutilizan CartaCategories con los mismos colores, medidas, imágenes móviles y flechas de desplazamiento.

La lista muestra seis promociones al principio. Ver más productos agrega otras seis, hasta completar las quince; cambiar categoría o búsqueda reinicia la lista. Las bebidas usan una sola imagen que cubre todo el ancho, sin duplicado desenfocado. Los motivos del fondo conservan su diseño con opacidad de 8%, sobre blanco.

Se reducen los precios promocionales manteniendo los precios anteriores: familiar 64.90 (ahorro 25), parrilla 49.90 (ahorro 20) y dúo 34.90 (ahorro 18). El carrito utiliza los mismos precios del catálogo.

Validación: pruebas de paginación, filtros, carrito y comparación de dimensiones con Carta, además de responsive de 240 a 2560 px; lint y build correctos.
