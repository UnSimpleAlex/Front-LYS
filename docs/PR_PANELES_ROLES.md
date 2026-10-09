# PR: Paneles conectados por rol con almacenamiento local

Base: feature/paginas-cuenta
Rama: feature/paneles-roles

Se incorporan las 24 pantallas de cocina, salón, caja y administración, además del recorrido de delivery. Registro y login mantienen una sesión local; el navbar muestra Iniciar Session al visitante y el nombre al ingresar. Productos, promociones, pedidos, mesas, cobros y comprobantes comparten estado con carta, carrito y cuenta del cliente.

Se reutiliza el logo existente, se aplica fondo blanco y se adapta la composición para móvil, tablet y PC. Los datos de ejemplo se cargan explícitamente y los indicadores se calculan sobre el estado local.

Validación: lint, typecheck/build; 193 pruebas verificadas mediante ejecución general y repetición de las comprobaciones actualizadas, incluyendo las 24 rutas a 240/390/768/1024/1920 px, recorrido salón → cocina → entrega → caja, stock, duplicados de pago, sesiones, permisos y sincronización entre pestañas.

Alcance: simulación por navegador con localStorage, pagos y comprobantes sin valor tributario. OAuth, correo, SUNAT y autorización del servidor requieren integración posterior. Excel exporta CSV; PDF utiliza impresión del navegador.

La rama depende de feature/paginas-cuenta para conservar las páginas públicas existentes. Integrar la base antes de continuar el flujo a dev.

Estado de publicación: pendiente. Git rechazó el push con HTTP 403: Permission to UnSimpleAlex/Front-LYS.git denied to HuamaniAlexander. La rama y sus seis commits están guardados localmente; este archivo contiene el texto listo para crear el PR cuando la cuenta tenga acceso de escritura. No se creó un PR remoto ni se modificaron credenciales.

