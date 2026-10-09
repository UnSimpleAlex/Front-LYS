# Navbar compartido

Todas las páginas implementadas utilizan la presentación de Carta: mismo logo, altura, tipografía, colores, controles y adaptación a cada resolución. Header es la única fuente de la estructura y las reglas de carta.css se cargan desde main.tsx para evitar diferencias al abrir una ruta directamente.

Carta y Promociones conectan el buscador a su catálogo y el carrito a su selección. SharedHeader conecta Inicio, login y registro al mismo carrito persistido. Buscar desde estas páginas abre Carta y conserva el término en el parámetro buscar; en pantallas pequeñas, el acceso de búsqueda abre el campo de Carta.

El enlace activo depende de la página. Login y registro no activan Inicio. La navegación inferior de Carta y Promociones se conserva.

Validación: comparación de altura, logo, fondo y tamaño de letras en las cinco rutas entre 240 y 1920 px; búsqueda desde Inicio y recuperación del carrito desde login; regresión de Carta, Promociones, Inicio y formularios responsive.
