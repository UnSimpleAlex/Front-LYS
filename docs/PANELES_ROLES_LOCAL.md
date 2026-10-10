# Paneles por rol y almacenamiento local

Implementación de las referencias PC/18.png a PC/41.png. Fondo de página blanco, logo original `/images/logo.webp` y componentes adaptables a móvil, tablet y escritorio. Los indicadores se calculan con datos locales: los números de las referencias no se presentan como ventas reales.

## Acceso y recorrido

1. Abrir `/iniciar-sesion`, desplegar **Accesos de prueba por rol** y pulsar **Preparar cuentas de prueba**.
2. Usar cualquiera de los correos siguientes con contraseña `Demo2026!`: `administrador@demo.local`, `mesera@demo.local`, `cocina@demo.local`, `caja@demo.local`, `delivery@demo.local`.
3. Administración puede cargar pedidos ficticios mediante **Cargar pedidos de ejemplo**. Se activan explícitamente, no generan cobros ni ventas.
4. Salón selecciona mesa, agrega productos y envía a cocina (o guarda borrador). Cocina acepta y marca listo. Salón entrega; delivery inicia y completa entregas de su canal.
5. Caja abre turno, cobra pedidos, calcula vuelto, emite comprobante local y cierra contando el efectivo. Los pagos digitales no incrementan el efectivo físico. Reembolsos solo durante el turno abierto.
6. Clientes registrados compran desde carta/carrito y ven los mismos pedidos y estados en su cuenta. Registro público siempre crea un cliente. Administración crea personal y asigna roles.

El navbar público muestra **Iniciar Session** sin sesión y el nombre al ingresar. Al cambiar de rol se utiliza la misma sesión del navegador. Para probar distintos usuarios simultáneamente usar perfiles o contextos de navegador separados; las pestañas del mismo origen comparten sesión.

## Correspondencia de pantallas

| Referencia | Ruta | Pantalla |
|---|---|---|
| 18 | /cocina | Panel Kanban |
| 19 | /cocina/pedidos | Pedidos entrantes |
| 20 | /cocina/historial | Historial de pedidos |
| 21 | /cocina/tiempos | Control de tiempos |
| 22 | /mesera | Dashboard de salón |
| 23 | /mesera/mesas | Gestión de mesas |
| 24 | /mesera/nuevo-pedido | Crear nuevo pedido |
| 25 | /mesera/pedidos | Pedidos de salón |
| 26 | /mesera/cierre-mesa | Cierre de mesa |
| 27 | /caja/cobros | Cobros |
| 28 | /caja | Dashboard de caja |
| 29 | /caja/apertura | Apertura de caja |
| 30 | /caja/cierre | Cierre de caja |
| 31 | /caja/comprobantes | Comprobantes |
| 32 | /caja/historial | Historial de pagos |
| 33 | /administrador | Dashboard general |
| 34 | /administrador/productos | Gestión de productos |
| 35 | /administrador/promociones | Gestión de promociones |
| 36 | /administrador/usuarios | Gestión de usuarios |
| 37 | /administrador/inventario | Inventario y proveedores |
| 38 | /administrador/configuracion | Configuración del sistema |
| 39 | /administrador/clientes | Gestión de clientes |
| 40 | /administrador/pedidos | Gestión de pedidos |
| 41 | /administrador/reportes | Reportes y analítica |

`/delivery` completa el recorrido de reparto. Administración puede acceder a todos los paneles; los demás roles reciben acceso restringido fuera de sus rutas.

## Datos compartidos

- `lys-users-v1`: cuentas, rol, estado activo, salt y hash de contraseña PBKDF2/SHA-256 (100 000 iteraciones). No se almacena la contraseña en texto plano.
- `lys-session-v1`: ID de cuenta activa.
- `lys-operations-v1`: productos, pedidos, mesas, cobros, comprobantes, turnos, insumos, movimientos, promociones, proveedores y configuración.
- `lys-account-<id>`: perfil, direcciones, preferencias y avisos leídos de cada cliente.
- `lys-carta-favorites-<id>`: favoritos separados por cuenta; `guest` para visitantes.
- `lys-checkout-draft-<id>`: datos de entrega, sin tarjeta, CVV ni códigos de aprobación.
- Recibos locales e historial de checkout utilizan claves por cuenta. El carrito mantiene el comportamiento persistente del catálogo existente.

Los servicios publican cambios React y escuchan `storage` para reflejarlos entre pestañas. Los pedidos conservan una copia de nombre/precio al crearse, para que editar el catálogo no altere cuentas ya registradas. El stock de productos disminuye al enviar pedidos, se comprueba al enviar borradores y se recupera al cancelar. Los insumos tienen movimientos explícitos; no existe todavía una receta que descuente ingredientes automáticamente.

Los productos administrados actualizan carta y carrito. Las ofertas creadas actualizan promociones públicas; los cupones respetan fecha, estado y límite de uso. Las campañas ilustradas originales permanecen como catálogo de referencia y no equivalen a promociones nuevas creadas en el panel.

Los formularios suben JPG/PNG/WebP hasta 5 MB y preparan una imagen de hasta 800 px para guardarla localmente. Guardar muchos archivos puede agotar la cuota del navegador; las operaciones muestran el error y no anuncian éxito si falla el guardado central.

## Alcance de esta etapa

Es una aplicación local funcional, sin servidor de autenticación ni sincronización entre equipos. Las comprobaciones de rol del frontend no protegen frente a alguien que manipule localStorage. Para producción se requieren autenticación y permisos del servidor/RLS, validación de operaciones y transacciones del backend.

Los pagos, comprobantes, facturas y QR son demostraciones locales; no hay integración bancaria, SUNAT, OAuth de Google, envío de correo ni recuperación remota de contraseña. La contraseña se cambia desde el perfil con la anterior. Los impuestos configurados son datos informativos y no representan un cálculo tributario certificado. Los comprobantes imprimen **Sin valor tributario**. La exportación para Excel es CSV y la exportación PDF abre la impresión del navegador para guardar en PDF.

## Verificación y Git

`npm run lint`, `npm run build` (incluye typecheck), `npm run test`. `tests/operations.spec.ts` cubre el recorrido entre roles, duplicados de pago, cierre de caja, permisos, persistencia, stock agregado, caja digital y sincronización entre pestañas. Recorre las 24 rutas a 240, 390, 768, 1024 y 1920 px, verifica desbordes e imágenes rotas y guarda capturas de móvil/escritorio en `test-results/` (ignorado).

Rama: `feature/paneles-roles`, creada sobre `feature/paginas-cuenta` para conservar las pantallas públicas existentes. El PR de esta funcionalidad se compara contra esa rama; después de integrar la base debe seguir el flujo hacia `dev`. No se modifican `main`, releases ni credenciales GitHub.

## Resultado de validación

Lint y build correctos. La suite completa ejecutó 193 pruebas: 190 pasaron inicialmente y tres comprobaciones del flujo anterior se actualizaron. El mapa/checkout y las 24 pantallas se verificaron de nuevo en una ejecución de 61 pruebas; las dos pruebas pendientes de navegación se repitieron y pasaron. Se inspeccionaron capturas de escritorio y móvil para cocina, administración, salón y caja. Las exportaciones son locales; no se probó integración bancaria ni backend porque esta etapa usa localStorage.


## Pulido de controles y referencias (octubre de 2026)

- Alertas de inventario: nombre y existencias ocupan una fila completa; estado y acción se sitúan debajo para evitar palabras partidas entre imagen, badge y flecha.
- Cargas JPG/PNG/WebP: botón nativo de selección estilizado, foco visible y nombre del archivo, sin alterar la validación existente.
- Formularios y métodos de pago: botones sin estiramiento vertical, interruptores de 26 px con área de interacción extendida y tarjetas de altura natural. Textos secundarios con mayor contraste.
- Caja: etapas numeradas, resumen con iconos, total con indicador de coincidencia e imágenes de 200, 100, 50, 20 y 10 soles y monedas. Las miniaturas WebP decorativas se extraen de la referencia proporcionada; no son reproducciones de alta resolución. El desglose conserva cantidades de billetes e importe total de monedas, y excluye pagos digitales del efectivo físico.
- La suite recorre 25 rutas incluyendo delivery a 240, 390, 768, 1024, 1280, 1366, 1440, 1920 y 2560 px. Se comprueban además las cinco pestañas de configuración, ancho legible de alertas, interruptores, cargas e imágenes de caja. Móvil utiliza scroll natural y acciones de al menos 44 px donde corresponde.


### Imágenes y conteo por pieza de moneda

Los cinco billetes usan las imágenes individuales proporcionadas por el usuario, recortadas sin márgenes negros y optimizadas a WebP. Se separan las siete monedas del montaje: 5, 10, 20 y 50 céntimos, y 1, 2 y 5 soles. En apertura y cierre se ingresa la cantidad entera de cada denominación; el total se suma en céntimos enteros para evitar errores de coma flotante. Esta sección sustituye el campo anterior de importe global de monedas y las miniaturas extraídas de la maqueta.
