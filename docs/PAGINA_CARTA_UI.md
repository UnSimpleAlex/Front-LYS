# Carta — propuesta de catálogo y referencias visuales

Ruta `/carta`, enlazada desde el navbar, el banner y las especialidades de Inicio. Referencias: `codex-clipboard-f38182db-24ff-49aa-be41-37c3860c29d1.png` (PC) y `codex-clipboard-f00fb68c-d8b5-4c63-87f1-77c510b7a42b.png` (móvil).

## Catálogo

96 productos propuestos: 12 en cada una de las ocho categorías Pollo a la brasa, Parrillas, Combos, Chaufas, Saltados, Acompañamientos, Bebidas y Salsas. Se reúnen las categorías de ambas referencias sin incluir postres. Nombres, ingredientes, tamaños, precios y etiquetas son contenido de demostración editable en `src/features/carta/catalog.json`; no constituyen una carta comercial aprobada.

Cada producto tiene una fotografía generada independiente según su descripción. El banner tiene fondos PC/móvil sin texto y dos versiones del título sobre transparencia. Ocho miniaturas recortadas con transparencia identifican las categorías en móvil: 108 imágenes finales en total. Se reutilizan logo y fuentes existentes. Origen y prompts: `CARTA_ASSETS_GENERADOS.json`, herramienta integrada `image_gen`. Los WebP finales viven en `public/images/carta/`; las fuentes PNG se conservan en las rutas registradas. `scripts/optimize_carta_assets.py` optimiza los archivos sin modificar las fuentes. Las bebidas conservan el encuadre completo para no cortar botellas y jarras.

## Interacciones

Búsqueda por nombre e ingredientes sin distinguir tildes, filtros de categoría y porción, orden por popularidad/precio/nuevos, selección de promociones y favoritos. Se muestran inicialmente doce productos; Ver más añade doce sin cambiar filtros. La tarjeta abre un detalle con descripción completa, también en móvil.

Carrito local con cantidades, total y persistencia en `localStorage`. Favoritos persistentes. La selección se valida al leerla y se limita a 99 unidades por producto. No se envían pedidos ni se cobran importes: el carrito indica que la confirmación estará disponible próximamente. UI separada de servicios futuros de catálogo/pedidos.

## Responsive

Cuatro columnas en PC, tres en tablet; móvil compacto con tres columnas desde 360 px y dos en anchos menores para legibilidad. Categorías desplazables horizontalmente, búsqueda accesible desde el navbar, filtros compactos y navegación inferior fija con espacio para el área segura. El header compartido conserva su altura y marca Carta como activa. Los diálogos usan scroll interno, foco nativo y Escape.

## Validación

Las 16 comprobaciones de Carta cubren catálogo, entrega de las 108 imágenes como WebP, filtros, búsqueda, favoritos, detalle, cantidades, persistencia y composición a 240/320/360/390/430/650/768/1024/1280/1440/1672/1920/2560 px. Se revisaron capturas de PC, móvil y tablet; se corrigieron recortes del banner, desbordes en anchos pequeños y descripciones estrechas en tablet. También se ejecutan las pruebas existentes de Inicio, acceso, registro y teléfono, además de lint, TypeScript y build. No se afirma cobertura de todos los dispositivos posibles.

Resultado: 109 pruebas de Playwright aprobadas, lint sin errores y build con comprobación TypeScript aprobado.

## Integración Git

Rama `feature/carta` basada en la versión de Inicio del PR #2. Su PR debe revisarse sobre esa rama hasta que Inicio se integre en `dev`; no mezclar `dev` ni `main` durante esta implementación.
