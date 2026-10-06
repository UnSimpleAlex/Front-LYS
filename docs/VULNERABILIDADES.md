# Gestión de Vulnerabilidades — Leña y Sabores

## Clasificación
Crítica, Alta, Media y Baja según explotabilidad, impacto, exposición y privilegios necesarios.

## Flujo
Detección → contención → clasificación → reproducción segura → corrección → pruebas → revisión → despliegue → verificación → documentación.

## Casos sensibles
Bypass de autenticación, elevación de privilegios, acceso a datos ajenos, RLS incorrecto, secretos expuestos, SQL injection, manipulación de pagos o acceso administrativo no autorizado.

## Reglas
- No publicar detalles explotables en un Issue público si existe riesgo real.
- Rotar secretos si hubo exposición.
- Corregir causa raíz, no solo el síntoma.
- Crear prueba de regresión cuando sea razonable.
- Revisar variantes equivalentes del fallo.
- Para producción crítica usar un hotfix, evitando nombres que revelen detalles peligrosos.

## Dependencias
Confirmar si la versión está afectada, si la ruta es alcanzable, actualizar a una versión corregida y ejecutar pruebas.

## Post-mortem
Para incidentes graves registrar qué ocurrió, impacto, causa raíz, detección, corrección y acciones preventivas.
