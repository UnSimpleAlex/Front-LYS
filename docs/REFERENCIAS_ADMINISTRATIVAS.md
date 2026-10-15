# Referencias administrativas: PC, tablet y móvil

Rama: `feature/paneles-laterales`. PR: https://github.com/UnSimpleAlex/Front-LYS/pull/8.

La carpeta `LYS_Pantallas_Administrativas_PC_y_Movil` contiene 25 pares de referencias. La composición de PC se contrasta en 1672 × 941; la variante compacta de portátil también se comprueba en 1366 × 591, para evitar indicadores y navegación demasiado altos. La adaptación intermedia utiliza el ancho disponible y conserva texto y controles utilizables.

## Organización

- `OperationsPage`: navegación lateral compartida, encabezado móvil y cuenta mediante diálogo.
- `AdminSettings`: General, Horarios, Pedidos y Pagos. Los datos opcionales amplían el estado existente sin borrar configuraciones guardadas. Reducir mesas exige que las retiradas estén libres y sin consumos pendientes.
- `CashShiftPanel`: apertura con once denominaciones y cierre con conteo, diferencia, métodos y movimientos. No se incluye la moneda de cinco céntimos.
- Cocina: etapas del tablero, filas de pedidos entrantes, historial con productos y tiempos, gráfico por hora con preparación diferenciada, acciones de estado y filtros.
- Salón: indicadores propios de cada vista, catálogo compacto con desplazamiento interno, consumo en tabla y solicitud de cuenta.
- Delivery: estados reales, destino consultable en Google Maps y estimaciones únicamente cuando el pedido contiene esos datos. La muestra identifica al repartidor como demostración; no se inventa seguimiento GPS.

Los estilos de referencia entran por `operations-anchor-layout.css` y se dividen en capas ordenadas de base, configuración, caja/stock, cocina, salón, registros, flujos y densidad. Quedan limitados a los paneles internos. Las páginas públicas conservan sus estilos.

## Dimensiones y contenido

### Dashboard general: referencia específica

`operations-dashboard.css` limita los ajustes a `/administrador`: orden de navegación de la imagen, barra de 295 px en PC amplio, cuatro métricas con iconos, dos columnas para gráfica y productos y tabla de pedidos recientes. La versión móvil usa dos columnas de métricas, iconos propios de esa referencia, subtítulo corto, lista de productos con foto/categoría/cantidad/ingresos y cinco columnas resumidas para pedidos. Los controles de exportación y carga de muestra no se repiten en el dashboard; siguen disponibles en las páginas de gestión y en la cuenta del panel. No se añadió Tailwind porque esta implementación usa el CSS existente del proyecto.

Se reutilizan `Stats`, `Panel`, `LineChart`, `OperationsTable`, los iconos, las ventanas de pedido y el almacenamiento local. Las fechas, importes, fotos y estados proceden de los registros existentes; no se fijan los valores ilustrativos de las imágenes. La tipografía usa la familia disponible Arial/Helvetica. En tablet las columnas principales se apilan; en portátiles se conserva la densidad compacta solicitada previamente.

En PC amplio la barra lateral mide 266 px y los indicadores parten de 108 px. En portátiles se reduce la barra a 216 px, los elementos de navegación a 38 px y los indicadores a aproximadamente 88 px. En pantallas de menos de 700 px de alto, la navegación baja a 36 px y los indicadores parten de 84 px según su contenido. Esta escala reduce aproximadamente un 10 % los elementos de escritorio respecto de la versión anterior, sin reducir los objetivos táctiles de móvil.

El encabezado móvil sustituye la barra lateral. Las listas cambian de composición según el contenido: productos y promociones con fotografía, clientes y usuarios en registros compactos, historial de cocina con tiempos y consumo de mesa en tabla. En anchos mínimos se redistribuyen campos para que no dependan de palabras fragmentadas ni de desplazamiento horizontal de toda la página.

Las referencias usan cifras, fechas, fotos y nombres ilustrativos. La interfaz conserva el catálogo y los registros locales. Los totales proceden de esos registros; una cifra cero no se sustituye por una venta ficticia. Las fuentes y recursos corresponden a los disponibles en el proyecto.

## Verificación reproducible

El pulido de detalles usa directamente las imágenes suministradas como fuente visual: icono de documento para pedidos, mesa con sillas en el plano, bandera de entregas e iconos de gráfica y trofeo en los encabezados del dashboard. La gráfica incluye escala de importes y puntos delineados. Cobros agrupa método y comprobante en dos columnas de escritorio, muestra el estado en una etiqueta compacta y delimita las superficies de pendientes y detalle. En tablet y móvil estos grupos se apilan sin cambiar los datos ni los flujos de pago. La escala compacta solicitada prevalece sobre los tamaños absolutos de las imágenes.

`tests/reference-layout.spec.ts` recorre las 25 rutas en 1672 × 941, 1366 × 591, 768 × 1024, 390 × 844 y 240 × 900. Genera capturas ignoradas por Git en `.impeccable/review/anchor-correction/`. Comprueba además las dimensiones compactas del portátil, las siete filas de productos en PC, las cuatro pestañas de configuración, los tres indicadores de inventario y la modificación segura de la cantidad de mesas.

`tests/operations.spec.ts` conserva las pruebas de roles, pedidos, cobros, comprobantes, stock y once denominaciones entre 240 y 2560 px. La verificación de tamaños se complementa con inspección visual de las capturas; por sí sola no demuestra igualdad de píxeles con una imagen.

Comandos: `npm run typecheck`, `npm run lint`, `npm run build` y `npx playwright test --workers=2`.

La muestra se carga explícitamente desde la cuenta con «Cargar datos de demostración». Conserva datos existentes y renueva las fechas de los pedidos, pagos, comprobantes y turnos sintéticos al actualizarla. El almacenamiento sigue siendo local; los pagos y comprobantes son una simulación de frontend.
