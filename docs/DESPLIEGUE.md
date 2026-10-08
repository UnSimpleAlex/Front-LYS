# Despliegue — Leña y Sabores

## Principio
Todo despliegue debe ser reproducible.

## Pre-deploy
PR aprobado, tests/build correctos, configuración y secretos verificados, migraciones revisadas y backup si corresponde.

## Deploy
Registrar versión/tag, commit, fecha y migraciones aplicadas.

## Post-deploy
Smoke tests: carga de app, login, flujo crítico, conexión backend y revisión de errores.

## Rollback
Definir cómo volver a una versión anterior o recuperar datos.

No considerar terminado el despliegue hasta validar el entorno real.
