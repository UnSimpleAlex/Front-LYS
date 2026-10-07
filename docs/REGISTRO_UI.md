# Registro de Leñas y Sabores

Ruta `/registro`, accesible desde «Regístrate» en el login. «Iniciar sesión» vuelve a `/`; atrás/adelante del navegador conserva la ruta. Se reutilizan AuthLayout, AuthField, useAuthRequest, iconos, controles, fondos Cloudinary y estilos del login.

Referencias: desktop 1920×1080 y móvil 1080×1920 suministrados. Se conserva el navbar compacto y botón rojo Pedir ahora ya aprobados. Tarjeta de hasta 620 px en escritorio y 560 px apilada, campos de 46 px, botones de 50 px y controles de contraseña de 44 px. La altura del formulario crece naturalmente con scroll. El lettering se aproxima a la referencia; los fondos compartidos difieren de los de las capturas de registro por petición expresa del usuario.

Cinco campos: nombres y apellidos, correo, celular, contraseña y confirmación. Validación al salir del campo o enviar; foco en el primer error, mensajes asociados mediante aria-describedby y contraste sin relleno rojo. Nombre admite letras Unicode y puntuación de nombres; se normalizan espacios al enviar. Celular admite formato internacional de 7–15 dígitos. Contraseña requerida y confirmación coincidente; no se imponen reglas de complejidad ni medidor arbitrario porque no existe política del backend documentada. Coincidencia con texto y borde verde sutil.

Términos sin marcar inicialmente, enlaces accesibles y avisos honestos de documentos oficiales pendientes. Registro y Google dependen de un adaptador sin almacenamiento ni envío de datos; no se simula una cuenta real. El hook compartido distingue pendiente, error, indisponibilidad y éxito según la respuesta, bloqueando envíos simultáneos. Las pruebas inyectan un servicio controlado para demostrar carga/error/éxito. La validación real y los documentos legales deben incorporarse al conectar el backend.

Entrada y feedback reutilizan CSS y reduced motion; sin nuevas dependencias. El texto semántico del título permanece en h1 y el lettering decorativo tiene alt vacío.

Validación: lint, typecheck y build aprobados; 46 pruebas aprobadas (27 de login/navegación y 19 de registro). Registro se verifica en 16 tamaños: 320×568, 360×640, 360×800, 375×667, 390×844, 412×915, 430×932, 480×900, 600×960, 768×1024, 820×1180, 1024×768, 1280×800, 1366×768, 1440×900 y 1920×1080. Capturas en test-results/ y revisión visual móvil/tablet/PC; sin overflow horizontal. Pruebas de formulario vacío, nombre/correo/celular/contraseña inválidos, coincidencia, términos, navegación, Google pendiente, carga, éxito, error, doble envío y reducción de movimiento. La carga de Cloudinary requiere red habilitada en el entorno de pruebas.

No se acredita autenticación real, todos los navegadores físicos ni capacidad de usuarios concurrentes.
