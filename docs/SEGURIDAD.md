# Seguridad — Leña y Sabores

## Principios
Mínimo privilegio, defensa en profundidad, validación, secretos protegidos y auditoría.

## Nunca confiar solo en el frontend
Ocultar botones no autoriza operaciones. Validar permisos en backend/RLS. Precios, estados y operaciones críticas deben verificarse del lado confiable.

## Secretos
Nunca versionar contraseñas, claves administrativas, tokens privados, connection strings o secretos OAuth. Mantener `.env.example` sin valores reales. Todo `VITE_*` embebido en el bundle debe tratarse como público.

## Roles
Cliente, Mesera, Cocina, Caja y Administrador deben tener únicamente los permisos necesarios.

## RLS
Denegar por defecto cuando sea viable, permitir explícitamente y probar SELECT/INSERT/UPDATE/DELETE según corresponda.

## Riesgos web
- Evitar SQL dinámico concatenando input.
- Evitar `dangerouslySetInnerHTML` sin sanitización.
- Configurar CORS de forma restrictiva.
- Proteger CSRF según el mecanismo de sesión utilizado.
- Validar tipo, tamaño y permisos de archivos.
- Considerar CSP, HSTS, Referrer-Policy y protección contra clickjacking en producción.

## Datos y logs
No registrar passwords, tokens, cookies completas, datos completos de tarjetas ni secretos. Minimizar datos personales.

## Checklist de release
Sin secretos en Git; permisos/RLS revisados; inputs validados; roles probados; errores seguros; dependencias revisadas; logs limpios; archivos protegidos.
