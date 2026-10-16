# Interacciones operativas verificadas

Fecha: 15 de octubre de 2026.

## Ubicación del trabajo

Rama local: `fix/interacciones-operativas`, creada desde `f4fcf96`.
Copia aislada: `G:/UTP/UnSimpleAlex/LYS_v2/Front-LYS-interacciones`.

Durante la tarea se restauraron archivos en la copia principal mientras otro agente la utilizaba. El usuario autorizó recuperar y continuar. Las correcciones se recuperaron en esta copia para no sobrescribir las ediciones del otro agente. No se realizó push, merge ni modificación de sus archivos.

Playwright permite elegir un puerto mediante `LYS_TEST_PORT`. Con un puerto explícito inicia su propio servidor, evitando reutilizar por error el servidor de otra copia. Para reutilizar una vista previa ya verificada se debe indicar también `LYS_TEST_REUSE=1`. Vite utiliza `.vite-cache/` dentro de cada copia, ignorada por Git, para no compartir la caché entre servidores.

## Correcciones realizadas

| Área | Problema corregido | Comportamiento |
| --- | --- | --- |
| Exportación CSV | Se perdían signos iniciales y se alteraban importes negativos | Los números conservan su signo; los textos con inicio de fórmula se exportan como texto sin quitar caracteres; se conservan comillas, UTF-8 con BOM y separador `;` |
| Productos | Exportar ignoraba productos seleccionados | Exporta la selección cuando existe, dentro del resultado filtrado; sin selección exporta todos los resultados |
| Usuarios y promociones | La selección y la página anterior podían persistir al cambiar filtros | Cambiar búsqueda, tipo/rol o estado reinicia la selección y la paginación |
| Inventario | Casillas sin estado ni acción asociada | Selección individual y de todos los resultados conectada a la exportación; borrar un insumo retira su selección |
| Inventario | Exportación y búsqueda no coincidían con filtros visibles | Categoría, nombre/categoría y estado filtran tabla y archivo conjuntamente; se indica cuando no hay resultados |
| Proveedores | Buscar no filtraba proveedores y Exportar descargaba insumos | Busca nombre, correo o teléfono y genera `proveedores.csv`; el filtro de categoría de insumos queda deshabilitado en esta vista |
| Movimientos de stock | El botón superior siempre apuntaba al primer insumo | La ventana permite elegir el insumo; respeta la validación de entradas/salidas y conserva el movimiento al recargar; se deshabilita cuando no existen insumos |
| Pedidos | Buscar desde otra página o conservar una selección anterior podía ocultar resultados/exportar vacío | La búsqueda y los filtros reinician página y selección; la paginación se limita al resultado actual |
| Pedidos y caja | Comparaciones de fechas UTC podían excluir registros del día mostrado | El filtro usa la fecha local de la misma forma que las fechas visibles; probado con un pago a las 02:00 UTC del día siguiente |
| Pagos y comprobantes | Exportar incluía registros ocultos por los filtros | El listado y el archivo usan la misma colección filtrada; un resultado vacío genera solo encabezados y un mensaje visible |
| Cobros | El tipo de comprobante elegido no iniciaba su emisión | Se puede elegir «Emitir después» o un tipo; al cobrar con un tipo explícito se abre la ventana compartida para completarlo, conservando la validación de RUC |
| Cobros | Un método desactivado podía quedar seleccionado internamente | Se utiliza un método habilitado; sin métodos activos se informa y se deshabilita el cobro |
| Cobros | Un identificador seleccionado podía mantener en pantalla un pedido ya pagado | La selección de cobro se limita a pedidos pendientes; se conserva la protección existente contra cobro duplicado |
| Impresión | La ventana no tenía título identificable | La ventana contiene título, idioma, datos del comprobante y acción nativa de impresión |
| Salón | La búsqueda de mesas no aceptaba una entrada natural con espacios | Acepta `Mesa 5`, `M5` o el número, sin importar espacios al inicio/final |
| Delivery | «Por recoger» incluía pedidos en camino | Cada pestaña corresponde a su estado; al iniciar/completar una entrega se selecciona su nueva pestaña y los cambios persisten |

Se mantuvieron los servicios locales, las restricciones de rol, las validaciones financieras existentes y el diseño actual. No se añadieron dependencias ni se migraron estilos.

## Cobertura funcional

La inspección estática recorrió 322 declaraciones de controles en los componentes operativos; no quedaron campos de entrada sin `onChange`, `readOnly` o `disabled`. Ese recuento describe declaraciones de código, no el número de controles generados ni una prueba exhaustiva de todas sus combinaciones.

La revisión de conexiones de los controles abarcó las áreas siguientes. Los recorridos ejecutados se especifican en las suites y resultados de abajo; esta lista no representa una ejecución de todas las combinaciones posibles:

- Administración: navegación, búsqueda, filtros, paginación, selección, detalles, creación/edición de productos, imágenes, vista previa, disponibilidad, promociones/eliminación, clientes/usuarios, roles, inventario, movimientos, proveedores, reportes, configuración, guardar/cancelar y persistencia.
- Cocina: aceptación, preparación, listo, detalle, búsqueda, origen/estado, filtros, orden, historial, periodo, alertas y exportación.
- Salón: plano/lista, zonas/estado, búsqueda y selección de mesa, pedido/borrador, cantidades, envío a cocina, solicitud e impresión de cuenta.
- Caja: apertura con verificación, efectivo por denominación, cobro, importe exacto/cambio, métodos habilitados, factura con validación de RUC, impresión, comprobantes, historial, filtros, exportación y cierre.
- Delivery: origen del pedido, pestañas, búsqueda, detalle, ruta/mapa bajo acción explícita y transiciones listo → en camino → entregado.
- Componentes compartidos: ventanas, foco, Escape, menú móvil, títulos y restricciones de acceso.

### Descargas comprobadas

Se descargó y leyó el archivo real de estos once destinos:

| Destino | Archivo |
| --- | --- |
| Productos | `productos.csv` |
| Promociones | `promociones.csv` |
| Clientes | `clientes.csv` |
| Usuarios | `usuarios.csv` |
| Pedidos | `pedidos.csv` |
| Reportes | `reporte.csv` |
| Inventario | `inventario.csv` |
| Historial de caja | `pagos.csv` |
| Comprobantes | `comprobantes.csv` |
| Historial de cocina | `historial-cocina.csv` |
| Cierre de caja | `resumen-caja.csv` |

Además se comprobó `proveedores.csv`, selección/exportación, archivos vacíos con encabezados, coincidencia de filtros, comillas y conservación de números negativos. Son CSV reales; no se presentan como archivos XLSX ni PDF.

## Verificación ejecutada

| Verificación | Resultado |
| --- | --- |
| Casos distintos con resultado aprobado | **84** entre las ejecuciones administrativas y la comprobación adicional de pedidos |
| Nuevas pruebas funcionales | **25**: descargas reales, filtros, selección, proveedores, movimientos, comprobantes/RUC/impresión, configuración, usuarios, promociones, salón, delivery y paginación |
| Ejecución funcional final con servidor verificado | **28/28 aprobadas**, salida 0 (25 nuevas + 3 regresiones administrativas) |
| Barrido responsive | **25 rutas × 221 anchuras = 5525 combinaciones**, de 280 a 3840 px, sin desbordamientos de página ni errores de ejecución |
| Pruebas compartidas previas | Recorridos por roles, edición, archivos, efectivo, navegación móvil, ventanas, foco y geometría/capturas de 25 páginas con resultado aprobado |
| TypeScript, lint y build finales | Aprobados |

El conjunto amplio registró 83 casos aprobados. Su proceso quedó esperando la terminación del servidor temporal y se interrumpió después de finalizar los casos. La comprobación adicional de pedidos también pasó con su barrido y regresión dirigida. Para cerrar la validación se ejecutaron de nuevo los 25 casos funcionales y las tres regresiones administrativas contra el servidor aislado verificado: 28 aprobados y proceso terminado correctamente. La cifra de 84 es un recuento de casos distintos, no de repeticiones.

La vista previa quedó abierta en `http://localhost:5187/administrador/inventario`, con cuenta administrativa y muestra local de datos. El servidor principal en 5173 pertenece a la otra copia.

Comando de regresión administrativa:

```powershell
$env:LYS_TEST_PORT='5188'
npx playwright test tests/operations-interactions.spec.ts tests/operations.spec.ts tests/workspace.spec.ts tests/administrative-reference.spec.ts tests/products-reference.spec.ts tests/reference-layout.spec.ts tests/dashboard-reference.spec.ts tests/admin-audit.spec.ts tests/admin-states-audit.spec.ts --workers=2 --output=test-results/validacion-operativa
```

Los datos se preparan en contextos de navegador aislados, no en la sesión personal del usuario. Los informes JSON/capturas se guardan en `.impeccable/review/` y las trazas de fallos en `test-results/`, ignorados por Git.

## Commits locales

- `60f6366`: aislamiento de puerto y caché entre copias de trabajo.
- `a989dfc`: CSV, importes, fechas y selección de productos.
- `0ffdb0c`: filtros, selección, proveedores y movimientos administrativos.
- `08a0502`: filtros/exportaciones de caja, métodos activos y emisión elegida al cobrar.
- `98c7e5d`: búsqueda de mesas y estados de delivery.
- `b1e0029`: pruebas funcionales con descargas reales y persistencia.
- `8c9ba48`: reutilización explícita de una vista previa verificada para pruebas.
- `aa0aea3`: reinicio de página/selección al filtrar pedidos y prueba de regresión.

## Límites reales

La implementación conserva la etapa frontend con almacenamiento local del proyecto. No conecta pagos reales ni emisión tributaria remota. La impresión se verificó preparando y abriendo la ventana de impresión, sin enviar documentos a una impresora física. Las rutas de mapas y llamada usan los servicios/aplicaciones externos correspondientes.

Las pruebas se ejecutan en Edge/Chromium emulado; no certifican todos los dispositivos físicos, navegadores o combinaciones posibles de datos. La suite pública dependiente de imágenes externas no forma parte de esta regresión administrativa.

La rama aislada aún no está integrada en la copia principal donde trabaja el otro agente. Las diferencias se pueden revisar mediante Git antes de integrarlas; no se cambió de rama ni se descartó trabajo ajeno en la copia principal.

## Ajustes posteriores solicitados

- Productos: categoría, disponibilidad y sucursal se aplican inmediatamente; «Limpiar filtros» restablece búsqueda y selecciones. Las pruebas ya no pulsan «Filtrar» en productos.
- Promociones: imagen de 96 × 56 px, acciones sin fondo y eliminación con confirmación en lugar de duplicación; eliminación persistente y protegida por rol administrativo.
- Usuarios: etiquetas de rol compactas, acciones sin fondo y estado compacto manteniendo texto legible y área de interacción.
- Filtros Estado/Tipo: indicador centrado verticalmente.
- Avisos compartidos: toast flotante, descartable, con cierre automático de éxito tras 4,5 segundos; los errores permanecen para poder leerlos.
- Verificación dirigida: productos, promociones y usuarios sin desbordamientos entre 280 y 3840 px (221 anchuras por página); capturas PC, tablet y móvil revisadas. Regresión funcional de creación, edición, exportación, cancelación/eliminación y persistencia; comprobación de cierre automático del aviso.
## Integración en Mi cuenta

El 16 de octubre de 2026 el usuario autorizó integrar `fix/interacciones-operativas` en `feature/mi-cuenta-referencia`. Se conservaron las vistas de Mi cuenta, los iconos nuevos de cuenta y la preparación automática de credenciales locales sin mostrar accesos de prueba en login. La configuración de pruebas admite tanto puertos aislados como un ejecutable Chromium explícito. Las pruebas operativas se adaptaron al inicio de sesión actual, conservando sus verificaciones. Las notas anteriores sobre la separación de ramas describen la situación previa a esta integración.
Validación de la integración: 32/32 pruebas aprobadas (25 interacciones operativas y 7 de Mi cuenta, incluido el barrido de ocho secciones entre 280 y 3840 px), TypeScript, lint y build aprobados. Sin publicación al remoto.
