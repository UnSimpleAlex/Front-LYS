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
