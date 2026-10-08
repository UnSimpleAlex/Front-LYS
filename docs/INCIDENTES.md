# Gestión de Incidentes — Leña y Sabores

## Incidente
Evento de producción que degrada disponibilidad, seguridad, integridad u operación crítica.

## Prioridades
P1 crítica, P2 alta, P3 media, P4 baja.

## Flujo
Detectar → confirmar → contener → comunicar → corregir → verificar → post-mortem.

Ejemplos P1: sistema inaccesible, corrupción activa de datos, vulnerabilidad crítica explotada o pagos incorrectos generalizados.

Conservar logs, timestamps, versión y evidencias. Para corrección urgente seguir `hotfix/*`.

## Post-mortem
Línea de tiempo, causa raíz, impacto, solución y acciones preventivas. El objetivo es mejorar el sistema, no buscar culpables.
