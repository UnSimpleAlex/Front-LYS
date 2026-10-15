# Auditoría integral del panel administrativo

Fecha: 15 de octubre de 2026. Rama: `feature/paneles-laterales`.

## Alcance y método

Se inspeccionaron el frontend, dependencias, estilos, componentes compartidos, rutas, restricciones por rol y cambios locales. Se mantuvieron React + TypeScript + Vite, CSS nativo y los SVG existentes. No se añadieron dependencias, módulos ni cambios de permisos o reglas de negocio.

Las pruebas usan cuentas locales y datos de demostración en contextos de navegador aislados. No modifican el almacenamiento del navegador personal del usuario ni servicios externos. Se conservaron fuera de estos commits los cambios previos de `AGENTS.md` y `docs/INSTRUCCIONES_UI_PERMANENTES.md`.

## Rutas comprobadas

Cada ruta tuvo el barrido automatizado completo y capturas de móvil, tablet y escritorio:

| Área | Rutas |
| --- | --- |
| Administración (9) | `/administrador`, `/administrador/productos`, `/administrador/promociones`, `/administrador/clientes`, `/administrador/usuarios`, `/administrador/pedidos`, `/administrador/reportes`, `/administrador/inventario`, `/administrador/configuracion` |
| Cocina (4) | `/cocina`, `/cocina/pedidos`, `/cocina/historial`, `/cocina/tiempos` |
| Salón (5) | `/mesera`, `/mesera/mesas`, `/mesera/nuevo-pedido`, `/mesera/pedidos`, `/mesera/cierre-mesa` |
| Caja (6) | `/caja`, `/caja/cobros`, `/caja/comprobantes`, `/caja/apertura`, `/caja/cierre`, `/caja/historial` |
| Delivery (1) | `/delivery` |

No hay un módulo independiente de categorías ni de repartidores con ruta propia. Se revisaron sus controles dentro de los módulos existentes; no se inventaron páginas.

## Problemas encontrados y correcciones

### Prioridad alta

- **Tablas que ensanchaban toda la página:** promociones entre 1100 y 1140 px; dashboard, cobros e historial de caja entre 1100 y 1200 px. Las columnas mantenían su ancho mínimo fuera del panel. El contenedor compartido permite ahora desplazamiento horizontal local, conserva toda la información y queda limitado a su panel. Cuando necesita desplazamiento recibe nombre accesible, foco de teclado e indicador de foco. Se probó desplazamiento con flecha derecha.
- **Indicadores de caja comprimidos:** a 341 px, tres columnas dejaban solo unos 31 px para el texto del indicador. Las cuadrículas móviles ahora distribuyen las tarjetas según un ancho mínimo disponible, sin reducir la fuente para encajarlas.
- **Recorrido de foco en inventario:** Tab podía salir del contenido de la ventana. El diálogo compartido cierra el recorrido entre el primer y el último control. Escape y devolución del foco al botón de apertura conservan su comportamiento. Se verificó también la vista previa anidada del producto.

### Prioridad media

- **Acciones pequeñas:** botones de ver/editar/eliminar de 20–23 px, identificadores de pedidos de cocina de 20 px y botones de añadir productos de 22 px. Las acciones compactas revisadas pasan a 32 px en móvil; las acciones de tablas/productos y el cierre del diálogo disponen de 44 px con puntero táctil. Las pruebas táctiles específicas comprobaron clientes y usuarios.
- **Textos demasiado pequeños:** se encontraron fuentes de 9–10 px en tablas del dashboard, salón y cierre de mesa, y botones de tiempos de cocina. Se elevaron los textos y etiquetas revisados a 11–12 px como mínimo según su jerarquía, con mejor interlineado. Los textos secundarios usan un gris más oscuro. No se achicaron las fuentes para esconder desbordamientos.
- **Datos de contacto y encabezados partidos:** la cuadrícula móvil de usuarios/clientes reservaba demasiado espacio a las acciones y comprimía nombres/correos. El nombre ocupa ahora una fila completa. En cierre de mesa se mantiene «Cantidad» en una línea y se desplaza la tabla dentro de su panel. Se corrigió también «1 usuarios» por «1 usuario» en los resúmenes de roles.
- **Ventanas en pantallas bajas:** límites basados en `dvh`, campos contenidos, títulos que pueden envolver y acciones con salto de línea. Se comprobó el acceso por teclado y desplazamiento al contenido de formularios de producto, promoción, usuario, cliente e insumo.

### Prioridad baja y consistencia

- Las pestañas administrativas heredaban el título de iniciar sesión. Cada ruta presenta ahora su título real; las páginas públicas conservan sus títulos.
- Se conservaron los SVG y los colores semánticos de las acciones. En las muestras automatizadas no se detectaron botones de icono sin nombre accesible, campos sin etiqueta ni imágenes rotas. Esta comprobación no equivale a certificar todos los iconos mediante un lector de pantalla.
- Dos pruebas antiguas buscaban un botón de datos de ejemplo retirado del dashboard. Ahora utilizan la acción real del menú de cuenta. Las comprobaciones siguen rechazando desbordamiento de página y admiten únicamente tablas desplazables con acceso por teclado.

## Cobertura responsive ejecutada

- **221 anchuras por ruta, 25 rutas: 5525 combinaciones de página y viewport en el barrido final.**
- Serie de 280 a 3840 px, cada 20 px, más los tamaños anterior/exacto/posterior de 320, 340, 360, 390, 430, 540, 600, 768, 900, 1024, 1100, 1280, 1366, 1440, 1500, 1672, 1920 y 2560 px. Se eliminan duplicados.
- Alturas del barrido: 568 px para anchuras inferiores a 600; 768 px entre 600 y 1099; 1080 px desde 1100.
- **75 capturas adicionales:** las 25 rutas en 390×844, 768×1024 y 1366×591. Se revisaron composiciones de móvil, tablet y escritorio mediante hojas de contacto y capturas de detalle.
- **30 combinaciones de ventanas:** cinco formularios en 280×568, 390×500, 844×390, 768×1024, 1366×591 y 1920×1080. Incluyen orientación horizontal y escritorio de poca altura.
- Estados adicionales: búsqueda sin resultados, validación obligatoria, nombre extenso en vista previa, menú móvil abierto/cierre con Escape, tabla desplazable por teclado, controles táctiles, texto al 200% y escala CSS de 1,25 en cocina.
- La regresión existente cubre recorrido salón → cocina → entrega → caja → comprobante, persistencia, restricciones de rol, edición, filtros, paginación, efectivo con céntimos y las once denominaciones, además de las páginas públicas.

El diagnóstico registra límites de página, errores de ejecución, botones menores de 24 px, textos visibles menores de 11 px, nombres accesibles e imágenes. Los textos ocultos visualmente con fuente cero se excluyen del indicador de legibilidad; su nombre accesible se comprueba por separado.

## Archivos modificados

| Archivo | Responsabilidad |
| --- | --- |
| `src/features/operations/AdminManagers.tsx` | Concordancia singular/plural del resumen de usuarios |
| `src/styles/operations-audit.css` | Contención, distribución móvil, legibilidad, controles y límites de ventanas |
| `src/features/operations/OperationsTable.tsx` | Región desplazable accesible según el ancho real, observador con limpieza |
| `src/features/operations/OperationsDialog.tsx` | Ciclo de Tab dentro del diálogo |
| `src/features/operations/OperationsPage.tsx` | Carga de estilos y título por ruta |
| `src/app/App.tsx` | Evitar que el título público sobrescriba el administrativo |
| `tests/admin-audit.spec.ts` | Barrido, diagnósticos y capturas de las 25 rutas |
| `tests/admin-states-audit.spec.ts` | Formularios, foco, contenido extenso, estado vacío, tacto y escala |
| `tests/operations.spec.ts` | Preparación mediante el menú real y verificación de tablas desplazables |

## Evidencia y reproducción

Los artefactos locales se guardan en directorios ignorados para evitar commits de binarios y datos sintéticos:

- `.impeccable/review/audit-integral-baseline/`: 25 diagnósticos y 75 capturas anteriores a las correcciones.
- `.impeccable/review/audit-integral/`: 25 diagnósticos y 75 capturas posteriores.
- `.impeccable/review/audit-estados/`: capturas de formularios en móvil y escritorio.
- `test-results/audit-verificado/`, `test-results/audit-estados-final/`, `test-results/audit-regression/`: resultados y trazas de las respectivas ejecuciones.

```powershell
npm run typecheck
npm run lint
npm run build
npx playwright test tests/admin-audit.spec.ts --workers=2 --output=test-results/audit-verificado
npx playwright test tests/admin-states-audit.spec.ts --workers=2 --output=test-results/audit-estados-final
npm test -- --workers=2
```

No ejecutar procesos simultáneos con el mismo directorio de resultados. El servidor Vite debe estar disponible en 127.0.0.1:5173 o iniciarse mediante la configuración de Playwright.

## Resultados finales

| Comprobación | Resultado real |
| --- | --- |
| TypeScript, lint y build | Aprobados tras las correcciones |
| Auditoría integral nueva | 25/25 pruebas: 5525 combinaciones, sin desbordamiento de página, errores de ejecución, controles menores de 24 px, textos visibles menores de 11 px en los selectores inspeccionados, campos/botones sin nombre ni imágenes rotas |
| Estados administrativos | 9/9 casos con resultado final aprobado; cinco formularios × seis tamaños, foco, vacío, validación, contenido largo, tacto, títulos, desplazamiento y encabezados |
| Regresión existente: primera ejecución completa | 201 aprobados, 25 fallidos de 226 |
| Cinco fallos administrativos de esa regresión | Corregidos y repetidos: 3/3 barridos móviles y 2/2 casos de controles/cocina aprobados |
| Veinte fallos públicos restantes | Agotaron la espera de la imagen remota del acceso en Cloudinary; no se consideran aprobados |

En total, **240 casos distintos tienen resultado final aprobado y 20 permanecen fallidos por la espera del recurso externo**. Esta cifra reúne ejecuciones completas y repeticiones dirigidas; no describe una sola ejecución totalmente verde. No se contabilizan repetidamente los casos que se volvieron a ejecutar.

Los cinco fallos corregidos de la regresión eran: selección del botón de cuenta de escritorio oculto en tres anchuras móviles; expectativa rígida de interruptor de 24 px incompatible con el área ampliada; e identificador de pedido de una muestra antigua. Se usan ahora el botón de cuenta visible, el tamaño mínimo accesible y un pedido real de la muestra cargada.

Tras el último ajuste visual, se repitieron los barridos de clientes, usuarios y cierre de mesa, además de los nueve estados. Dos lanzamientos de Edge agotaron su tiempo en un intento concurrente; la repetición secuencial aprobó esos casos. Las trazas de los intentos fallidos se conservan: no se ocultaron ni se eliminaron para presentar un resultado verde.

Las imágenes públicas de acceso se configuran en `src/components/AuthLayout.tsx`; son recursos externos preexistentes. `docs/REGISTRO_UI.md` ya documenta que su comprobación necesita red. Se verificó que la imagen remota permanecía sin completar mientras el logo y el lettering locales estaban cargados. No se sustituyeron imágenes públicas ni se alteraron esas pruebas para ocultar la limitación.

Commits locales de la auditoría:

- `6c347f8`: contención, accesibilidad, ventanas, controles y títulos administrativos.
- `86a1df6`: barrido de las 25 rutas y estados administrativos, actualización de pruebas antiguas.
- `5133b9e`: nombres completos, encabezados móviles y concordancia del resumen de roles.
- El commit que añade este informe contiene también el enlace de `docs/TESTING.md`; su hash puede consultarse con `git log -1 -- docs/AUDITORIA_ADMINISTRATIVA.md`.

## Límites y pendientes

- Pendiente externo: volver a ejecutar las veinte pruebas públicas de imágenes de acceso cuando Cloudinary responda en el entorno. No se afirma que la suite completa esté aprobada.
- Las comprobaciones se ejecutaron en Chromium mediante Microsoft Edge, con viewports emulados. No se probaron dispositivos físicos, Safari ni Firefox.
- La escala de texto y el zoom CSS son aproximaciones; no equivalen al zoom nativo del navegador, al teclado virtual de todos los sistemas ni a pruebas de tecnologías de asistencia.
- Se probaron cinco formularios de creación y estados concretos, no todas las permutaciones posibles de cada ventana y cada permiso.
- La revisión de contraste fue visual y de colores concretos; no es una certificación WCAG. La ausencia de desbordamiento global no garantiza por sí sola ausencia de toda colisión interna; se complementó con capturas y pruebas funcionales.
- Se usaron datos y autenticación locales. No se verificaron integraciones de producción, latencias reales ni errores de un backend remoto.
- Los estados de carga/éxito/error de autenticación y fallos del proveedor de direcciones están cubiertos por la regresión existente; no se simuló una carga remota en cada módulo local administrativo.
- Se conserva la estructura de capas CSS actual. Su consolidación futura puede reducir especificidad y tamaño, pero una migración general queda fuera de esta auditoría.
- No se realizó push, merge ni publicación. Los cambios previos ajenos permanecen sin incluir en los commits de auditoría.
