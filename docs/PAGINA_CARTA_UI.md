# Carta — propuesta de catálogo y referencias visuales

Ruta `/carta`, enlazada desde el navbar, el banner y las especialidades de Inicio. Referencias: `codex-clipboard-f38182db-24ff-49aa-be41-37c3860c29d1.png` (PC) y `codex-clipboard-f00fb68c-d8b5-4c63-87f1-77c510b7a42b.png` (móvil).

## Catálogo

96 productos propuestos: 12 en cada una de las ocho categorías Pollo a la brasa, Parrillas, Combos, Chaufas, Saltados, Acompañamientos, Bebidas y Salsas. Se reúnen las categorías de ambas referencias sin incluir postres. Nombres, ingredientes, tamaños, precios y etiquetas son contenido de demostración editable en `src/features/carta/catalog.json`; no constituyen una carta comercial aprobada.

Cada producto tiene una fotografía generada independiente según su descripción. El banner tiene fondos PC/móvil sin texto y dos versiones del título sobre transparencia. Ocho miniaturas recortadas con transparencia identifican las categorías en móvil: 108 imágenes finales en total. Se reutilizan logo y fuentes existentes. El subtítulo del banner usa Caveat con peso 600 y altura de línea 1.15, igual que las descripciones del carrusel de Inicio, manteniendo los tamaños responsive de Carta. Origen y prompts: `CARTA_ASSETS_GENERADOS.json`, herramienta integrada `image_gen`. Los WebP finales viven en `public/images/carta/`; las fuentes PNG se conservan en las rutas registradas. `scripts/optimize_carta_assets.py` optimiza los archivos sin modificar las fuentes. Las bebidas conservan el encuadre completo para no cortar botellas y jarras. Su fotografía se extiende en los laterales y se funde con el encuadre central mediante una máscara suave, sin franjas de color plano. Las capas reutilizan el mismo archivo y la caché del navegador.

## Interacciones

Búsqueda por nombre e ingredientes sin distinguir tildes, filtros de categoría y porción, orden por popularidad/precio/nuevos, selección de promociones y favoritos. Se muestran inicialmente doce productos; Ver más añade doce sin cambiar filtros. La tarjeta abre un detalle con descripción completa, también en móvil. Precio y Agregar comparten una fila al pie de la tarjeta; el cuerpo flexible absorbe las diferencias de longitud del texto, de modo que ambos quedan alineados entre tarjetas de la misma fila y entre sí.

Carrito local con cantidades, total y persistencia en `localStorage`. Favoritos persistentes. FavoriteButton es un componente React controlado por selected y onToggle, con un botón nativo y aria-pressed. El corazón confirma la selección con el vaivén de 500 ms del ejemplo aportado de Uiverse.io (SalladShooter); al quitarlo vuelve al contorno en 200 ms. Usa el icono y el estilo de las tarjetas existentes, sin checkbox oculto, IDs duplicados ni estilos globales del ejemplo. La animación se dispara sólo al pulsar, no al restaurar favoritos, y respeta movimiento reducido. El icono de Pollo a la brasa representa un pollo asado sobre una fuente. La selección se valida al leerla y se limita a 99 unidades por producto. No se envían pedidos ni se cobran importes: el carrito indica que la confirmación estará disponible próximamente. UI separada de servicios futuros de catálogo/pedidos.

## Responsive

Cuatro columnas en PC, tres en tablet; móvil compacto con tres columnas desde 360 px y dos en anchos menores para legibilidad. Categorías compactas desplazables horizontalmente sin barra visible, con flechas en ambos extremos cuando hay contenido fuera de vista (desactivadas al llegar al límite). Se conserva el gesto táctil y el acceso por teclado. Ordenar por usa un desplegable con iconos, descripciones y selección marcada; admite flechas, Inicio/Fin, Enter, Escape y cierre al hacer clic fuera. Búsqueda accesible desde el navbar, filtros compactos y navegación inferior fija con espacio para el área segura. El header compartido conserva su altura y marca Carta como activa. Los diálogos usan scroll interno, foco nativo y Escape.

## Validación

Las 17 comprobaciones de Carta cubren catálogo, entrega de las 108 imágenes como WebP, filtros, búsqueda, favoritos, detalle, cantidades, persistencia y composición a 240/320/360/390/430/650/768/1024/1280/1440/1672/1920/2560 px. Se revisaron capturas de PC, móvil y tablet; se corrigieron recortes del banner, desbordes en anchos pequeños y descripciones estrechas en tablet. También se ejecutan las pruebas existentes de Inicio, acceso, registro y teléfono, además de lint, TypeScript y build. No se afirma cobertura de todos los dispositivos posibles.

Validación general anterior: 110 pruebas de Playwright aprobadas. Para el ajuste de alineación se ejecutaron las 17 pruebas de Carta, con mediciones de precio y botón por fila en 13 resoluciones; todas aprobadas. Lint sin errores y build con comprobación TypeScript aprobado.

## Integración Git

Rama `feature/carta` basada en la versión de Inicio del PR #2. Su PR debe revisarse sobre esa rama hasta que Inicio se integre en `dev`; no mezclar `dev` ni `main` durante esta implementación.
