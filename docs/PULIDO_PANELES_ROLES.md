# Pulido visual de paneles por rol

Rama: `fix/fidelidad-paneles`, derivada de `feature/paneles-roles`.

Referencias: pantallas PC/18.png a PC/41.png facilitadas por el usuario. Se mantiene el fondo blanco, el logo existente, la navegación por roles y la simulación compartida mediante localStorage.

Cambios:
- Iconos específicos en navegación, indicadores, cabeceras, pestañas, estados y botones.
- Fotos de productos en pedidos e historiales, miniaturas de promociones e insumos y banners reutilizados.
- Barra superior, títulos, indicadores, tablas y controles con tamaños y espacios más cercanos a las capturas.
- Tarjetas de cocina diferenciadas por estado, progreso de preparación y filas compactas de completados.
- Gráficos verticales de historial y preparación por categoría, calculados desde los pedidos reales de la simulación.
- Cobro distribuido entre resumen del pedido y selección del pago; logos de Yape/Plin y QR de muestra identificados en configuración.
- Formulario de productos junto a los indicadores, campos agrupados y disponibilidad en rojo como la referencia.
- Plano de mesas con detalles de sillas; fotos del consumo y alertas de stock seleccionables. El formulario de insumos se abre al crear o editar y puede cerrarse; los cobros muestran ocho filas iniciales y permiten cargar las restantes.

Validación: lint, compilación TypeScript/Vite y pruebas operativas. La batería recorre las 24 rutas a 240, 390, 768, 1024 y 1920 píxeles, revisa desbordamientos, imágenes fallidas y errores de ejecución, y comprueba el flujo salón → cocina → entrega → caja → comprobante, permisos y sincronización entre pestañas. Las capturas se generan a 390, 768 y 1920 píxeles y se inspeccionan para los grupos de cocina, salón, caja y administración.

Limitaciones visuales: datos de ejemplo adaptados al catálogo actual; tipografía manuscrita aproximada con la fuente disponible; mesas y billetes recreados mediante CSS; avatares neutros. Recursos y origen de la imagen generada: `PANELES_ROLES_ASSETS.md`.


Resultados: batería completa de 194 pruebas aprobada; después de los últimos ajustes de legibilidad, 9 pruebas operativas aprobadas. Lint y compilación TypeScript/Vite aprobados.

## Corrección de navegación y controles responsive

Tras las capturas de botones cortados, se compactaron el navbar, los títulos, indicadores, paneles e imágenes de tablas. La navegación usa una fila en PC y un menú desplegable por debajo de 1280px, con cuenta y notificaciones accesibles. Se conserva el logo.

Las tablas ahora se adaptan al ancho de su propio panel: conservan las filas cuando caben y muestran tarjetas con etiquetas y acciones completas cuando falta espacio. Productos mantiene una tabla compacta desde 800px de panel, con acciones mediante iconos y nombres accesibles; el formulario ya no se estira a toda la altura del listado.

Validación de esta corrección: 24 rutas a 240, 390, 768, 1024, 1280, 1366, 1440 y 1920px. Además del ancho de la página, se comprueba que cada tabla y sus botones quepan completamente, así como la altura del navbar, sus nueve opciones y la navegación con el menú abierto. Se mantienen las pruebas del flujo de pedidos, permisos, persistencia e inventario.

Resultado final: 13 pruebas operativas aprobadas, incluido el menú completo en ocho resoluciones. Lint y compilación aprobados. Las capturas de móvil, tablet y PC se revisaron visualmente; las acciones no requieren desplazamiento horizontal dentro de las tablas.
