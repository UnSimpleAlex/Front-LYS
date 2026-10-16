# Mi cuenta: referencias PC y móvil

## Alcance

Implementación de las ocho parejas del archivo `LYS_Mi_Cuenta_PC_y_Movil.zip`: Inicio, Mis pedidos, Mis direcciones, Mis datos, Métodos de pago, Notificaciones, Favoritos y Cerrar sesión.

Se mantiene React 19 + TypeScript + Vite y el CSS del proyecto. No se instala Tailwind ni se añaden dependencias de aplicación. El menú lateral se convierte en un selector accesible hasta 900 px. Se reutilizan catálogo, carrito, pedidos operativos, sesión y almacenamiento por usuario. Las cifras y los estados no se copian de las imágenes: se calculan con datos de la cuenta. Una cuenta nueva comienza vacía.

## Componentes

- `AccountPage`: composición, rutas y confirmación de cierre de sesión.
- `AccountNavigation`, `accountSections`: perfil lateral, selector móvil y navegación compartida.
- `AccountDashboard`: indicadores, pedido activo con progreso, dirección, pedidos recientes y favoritos.
- `OrderList`: búsqueda, filtros con contadores, detalles, seguimiento y repetición de pedidos.
- `AccountAddresses`, `AddressLocation`: crear, editar, eliminar, elegir principal y enlace al punto guardado.
- `AccountProfileForm`, `profilePhoto`: nombre, apellidos, foto optimizada a 200 px, cancelación, contraseña y datos opcionales.
- `AccountPayments`: preferencias y referencias de tarjetas (marca, últimos cuatro dígitos, titular y vencimiento; sin PAN completo, CVV ni códigos).
- `AccountNotifications`, `AccountFavorites`: preferencias, avisos leídos, categorías y acciones sobre el catálogo.

`account.css` concentra el diseño. Se retiran reglas antiguas de cuenta de `information-reference.css` para evitar cambios según el orden de navegación. Se conservan los demás estilos públicos y los estilos de paneles.

## Acceso y navbar

Las cuentas locales se documentan en `README.md`; el login las prepara al ingresar con su correo conocido. Se elimina `DemoAccess`. No se borran ni restablecen cuentas ya existentes. `displayFirstName` muestra el primer nombre en PC y móvil y elimina el prefijo `Demo` de cuentas antiguas. Se agrega `cliente@demo.local` para revisar Mi cuenta directamente.

## Validación ejecutada

- TypeScript, ESLint sin advertencias y compilación de producción.
- 25 pruebas seleccionadas de cuenta, autenticación, navbar, persistencia, checkout y operaciones. Se corrigieron dos selectores de prueba desactualizados y se repitieron los casos afectados hasta pasar.
- Ocho secciones en 188 anchos: 280–3840 px en pasos de 20 px, más bordes de breakpoints y el ancla de PC de 1672 px. Total: 1,504 comprobaciones sin desbordamiento horizontal ni errores de JavaScript.
- Capturas de las ocho vistas a 1672 × 941 y 390 × 844; inspección visual de composición, tarjetas, formularios y confirmación de salida.
- Diálogos a 280 × 480, 390 × 700, 844 × 390 y 1366 × 591: límites de pantalla, scroll, Escape y restauración del foco.
- Persistencia de perfil/foto, direcciones, preferencia y referencias de tarjeta; filtros, detalle, carrito, favoritos y notificaciones leídas.
- Recorrido compartido salón → cocina → entrega → caja → comprobante y restricciones de roles.

Las pruebas están en `tests/account-reference.spec.ts` y las suites existentes actualizadas. Para un navegador distinto de Edge se admite `PLAYWRIGHT_EXECUTABLE_PATH=/ruta/al/navegador npm test -- tests/account-reference.spec.ts`. No se afirma haber ejecutado la suite completa ni probado dispositivos físicos o todas las combinaciones de zoom y altura.

## Límites de esta etapa

Autenticación y datos continúan siendo locales. El mapa de las tarjetas de dirección es un esquema, no cartografía real; el enlace abre las coordenadas guardadas y el editor conserva el mapa existente. Se reutilizan fotos y precios del catálogo actual, distintos de algunos ejemplos de las referencias. Las tarjetas guardadas son referencias visuales sin procesamiento bancario; las preferencias de correo aún no envían mensajes. No se indica verificación del correo sin un servicio que la compruebe.

## Traslado a UnSimpleAlex/Front-LYS

La rama `feature/mi-cuenta-referencia` parte de `feature/paneles-laterales` (`6f6b484`), que contiene el frontend completo. `main` y `dev` solo tienen el README en este repositorio; por eso el PR se dirige a la rama de desarrollo con la aplicación, sin incorporar todo el historial a `dev` como parte de esta tarea.

Se preservan los archivos propios de la base (App, administración, diálogos y tablas operativas, AGENTS y documentación previa). Se adapta la preparación de las pruebas operativas al login sin botones de demostración.

Se repiten sobre esta base build, TypeScript, ESLint y ocho casos de Playwright: las siete pruebas nuevas de cuenta, incluido el barrido de 1,504 combinaciones de ancho/sección, y el flujo compartido de salón, cocina, entrega y caja. La validación original de 25 casos corresponde a la implementación previa; no se atribuye aquí una nueva ejecución completa de esas 25 pruebas.
