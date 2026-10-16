# Testing — Leña y Sabores

## Estrategia
Combinar pruebas unitarias, de componentes, integración, E2E, seguridad y carga según el riesgo.

## Principios
- Probar comportamiento, no detalles internos.
- Muchas pruebas rápidas y menos E2E costosas.
- Datos de prueba deterministas e independientes.
- No mockear tanto que la integración real nunca se pruebe.

## Frontend
Probar formularios, validaciones, carrito, loading/empty/error, permisos visuales, navegación, componentes críticos y responsive.

## Backend
Probar reglas de negocio, autorización, persistencia, transacciones, estados, idempotencia y errores.

## Base de datos
Probar constraints, migraciones, RLS, relaciones y concurrencia crítica.

## Casos mínimos
Camino correcto + entrada inválida + usuario sin permiso + recurso inexistente/conflicto.

## E2E prioritarios
Registro/login, catálogo/carrito, confirmar pedido, cocina, caja y dashboard.

## Regresión
Un bug importante debería producir una prueba que falle antes del fix y pase después.

## CI
No hacer merge si fallan las pruebas obligatorias. Corregir flaky tests; no normalizarlos.

## Cobertura
Usarla como señal, no como objetivo absoluto. Priorizar módulos de mayor riesgo.

## Paneles conectados
La suite operations.spec.ts verifica el recorrido salón/cocina/caja, restricciones de rol, persistencia, stock, caja digital y 24 pantallas en cinco resoluciones. Ver [guía de verificación](PANELES_ROLES_LOCAL.md).


## Referencias de cocina: pedidos, historial y control de tiempos
Las tres vistas se verifican entre 240 y 2560 px, incluyendo móvil (390 px), tablet (768 px) y PC (1672 px). La prueba comprueba ausencia de desbordes y errores, imágenes cargadas, búsqueda, aceptación de pedidos, rango de fechas y exportación CSV.

Con el rol cocina o administrador, «Cargar muestra de cocina» añade 23 pedidos al almacenamiento `lys-operations-v1`, sin sustituir los existentes. Incluye cinco nuevos, tres en preparación, dos listos, uno en camino, diez entregados y dos cancelados. La muestra persiste al recargar y no se puede duplicar desde el botón. Son datos de demostración locales; no representan ventas reales.

Los indicadores, gráficos y alertas se calculan a partir de los pedidos guardados. Los listos y los pedidos en camino no se consideran retrasos de preparación. En móvil y tablet las tablas se convierten en tarjetas y las columnas laterales se apilan.


## Pulido de las 25 referencias administrativas

La comprobación de paneles recorre las 25 rutas entre 240 y 2560 px (incluye 390, 768, 1024, 1280, 1366, 1440 y 1920). Valida desbordamientos de página y tablas, imágenes y límites de los botones. Las comprobaciones de cocina incluyen el ancla de PC de 1672 px, las tres etapas y sus filtros. Estos son tamaños de navegador emulados; no sustituyen una prueba física en cada dispositivo.

administrative-reference.spec.ts verifica cifras cero sin rellenos ficticios, cambio real de página, filtro por fecha, edición persistente del pedido existente, estados de delivery, mapa sin carga automática de direcciones e importe exacto con céntimos en caja. Las otras suites conservan flujo por roles, once denominaciones, modales, foco y formularios de producto.

La muestra general también añade hasta ocho clientes ficticios con correo @preview.example y acceso local Demo2026!, sin sustituir cuentas existentes. Su historial se vincula únicamente a pedidos sintéticos de cocina por nombre, conservando los identificadores de los pedidos para poder actualizar la muestra.

## Composición y altura de las referencias administrativas

Ver [Referencias administrativas](REFERENCIAS_ADMINISTRATIVAS.md). La prueba `reference-layout.spec.ts` añade capturas de las 25 vistas en cinco combinaciones de ancho y alto, incluida 1366 × 591. También verifica límites de altura del menú y los indicadores, composición de configuración/inventario y modificación persistente y segura de las mesas. No sustituye la comparación visual con las imágenes.

## Mi cuenta: referencias PC y móvil

`tests/account-reference.spec.ts` valida acceso directo sin exponer credenciales, primer nombre del navbar, ocho vistas, barrido de 280–3840 px, persistencia de perfil/foto y referencias de tarjeta, búsqueda, favoritos, avisos leídos y diálogos de baja altura. Ver [alcance, cobertura y límites](MI_CUENTA_REFERENCIA.md). `PLAYWRIGHT_EXECUTABLE_PATH` permite ejecutar con Chromium instalado sin cambiar el canal Edge por defecto.

## Auditoría integral de los paneles

Ver [informe de auditoría administrativa](AUDITORIA_ADMINISTRATIVA.md): 25 rutas, barrido de 280 a 3840 px, formularios en pantallas bajas, teclado, controles táctiles y cobertura/limitaciones documentadas.

## Interacciones operativas

Ver [interacciones operativas verificadas](INTERACCIONES_OPERATIVAS.md): filtros, selección, edición, exportaciones reales, comprobantes, configuración y persistencia. Las pruebas pueden aislarse con `LYS_TEST_PORT`; la caché Vite es local a cada copia.

### Apertura, cierre y etiquetas compactas

Las pruebas de interacciones cubren verificación obligatoria del efectivo, apertura persistente tras recarga, prevención de apertura duplicada, conteo por denominaciones, uso del fondo inicial en cierre, diferencias y exportación del resumen. En apertura el total se calcula desde las denominaciones, sin campo manual ni observaciones. La lista tiene desplazamiento interno y encabezado fijo. En cierre se conservan las observaciones y el ingreso manual del efectivo contado.

Las vistas de apertura y cierre reproducen únicamente el contenido de las referencias; conservan la navegación existente. Se mantienen todas las denominaciones, observaciones y exportaciones. La auditoría responsive cubrió 221 anchos de 280–3840 px por vista, además de delivery, Nuevo pedido y Mesas; incluye capturas de 390, 768 y 1366 px. Se verificaron por separado los límites del precio y del botón de agregar, y la lectura completa de «Solicita cuenta» en seis anchos con ese estado activo. Esta cobertura corresponde a Chromium emulado, no a dispositivos físicos.
