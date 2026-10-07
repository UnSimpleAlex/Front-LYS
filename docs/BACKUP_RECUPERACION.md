# Backup y Recuperación — Leña y Sabores

## Principio
Un backup solo sirve si puede restaurarse.

## Alcance
Base de datos, archivos críticos, funciones/configuración reproducible, migraciones y datos necesarios para recuperación.

## Conceptos
- RPO: pérdida máxima tolerable de datos.
- RTO: tiempo objetivo máximo de recuperación.

## Reglas
- Utilizar capacidades vigentes de backup de InsForge cuando correspondan.
- Probar restauraciones periódicamente.
- Verificar recuperación antes de migraciones destructivas/importaciones masivas.
- Restringir acceso a backups.
- Definir retención y eliminación segura.

Registrar cada restauración: motivo, punto restaurado, resultado y pérdida de datos si existió.
