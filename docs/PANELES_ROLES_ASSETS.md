# Recursos visuales de los paneles

- Logo: reutilizado sin cambios de `/images/logo.webp`.
- Fotografías de platos: catálogo existente; no se generan nuevos logotipos ni se reemplazan fotos de productos.
- `public/images/information/salon-floor-v1.png`: fondo generado mediante la herramienta integrada image_gen; plano cenital del salón con suelo de piedra, madera, plantas y luces cálidas. Los muebles, números y estados interactivos se componen en la interfaz y no forman parte de la foto.
- Fuente del archivo generado: `C:/Users/Usuario/.codex/generated_images/01a1123c-68b9-7732-9a73-76911a2414bc/exec-5c6b7274-2864-4042-844a-559cd8393497.png`.
- Dirección visual empleada: “Photorealistic orthographic overhead restaurant floor plan backdrop. Rustic Peruvian chicken and grill restaurant, warm dark timber borders, light gray stone floor, lush plants around perimeter, warm ceiling lighting. Open center, no tables, no chairs, no text, no letters, no signage, no logos. Landscape layout.”

Tipografía de encabezados de cocina: Knewave existente en `/fonts/Knewave.ttf`. Los títulos de operación usan texto accesible, sin insertar capturas completas como páginas. Las referencias se adaptan a datos reales de la simulación y al fondo blanco solicitado.

## Pulido de fidelidad de las referencias PC/18–41

- `public/images/operations/inventory-ingredients-v1.png`: una tira transparente con pollo crudo, papas, carbón y salsa BBQ. Se presenta mediante posiciones CSS; la imagen conserva el archivo original. Generada con la herramienta integrada image_gen, sin texto ni logotipos nuevos.
- Fuente: `C:/Users/Usuario/.codex/generated_images/01a1123c-68b9-7732-9a73-76911a2414bc/exec-d9f39eb6-9124-494e-8c8c-c0553c370c07.png`.
- Prompt: “Create ONE clean horizontal photographic asset strip with TRANSPARENT background, aspect ratio exactly 4:1. Four equally sized isolated object groups centered in four equal square cells from left to right: (1) a fresh raw whole plucked chicken lying naturally, pale pink skin, supermarket ingredient photography; (2) a small heap of five unpeeled golden brown Peruvian potatoes; (3) a small heap of black hardwood charcoal chunks; (4) a small glass bottle of dark reddish brown barbecue sauce with plain dark red label WITHOUT any text and black cap. Product ingredient cutout photography, realistic texture, soft studio lighting, front three-quarter view, subtle small contact shadows only, no floor, no decorative items. Each group fits completely inside its own equal fourth of the strip, with generous transparent spacing. No lettering, no logos, no watermark, no interface. Match the stock ingredient thumbnail style of a Peruvian restaurant inventory dashboard. Do not include cooked food or food plates.”
- Resultado de la herramienta: 2172 × 724 píxeles; la distribución de los cuatro objetos se adapta a ese tamaño real.
- Banners: reutilizan `public/images/home/pollo-640.webp`. Fotos de tablas y barras: catálogo existente.
- Métodos de pago: `public/images/checkout/yape.webp`, `plin.webp` y los QR de muestra existentes. Los QR de muestra se identifican como tales; al subir un QR propio se muestra ese archivo.
- Iconos: vectores decorativos con `aria-hidden`, específicos para cocina, pedidos, caja, productos, notificaciones y acciones. Los textos y nombres accesibles de los botones se conservan.
- Avatares: icono neutro; no se presentan fotografías ficticias como fotos de los usuarios.

La fidelidad sigue siendo una adaptación de las referencias: se conserva el fondo blanco solicitado y las cifras provienen de localStorage. La fuente Knewave, el mobiliario interactivo del plano y los billetes estilizados son aproximaciones; no se afirma reproducción exacta de esos recursos de las capturas.
