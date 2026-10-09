# CI/CD — Leña y Sabores

## Pull Request
Pipeline mínimo deseable: instalar dependencias → lint → typecheck si aplica → tests → build. Si un check obligatorio falla, no hacer merge.

## `main`
Después del merge se puede construir/desplegar, ejecutar smoke tests y publicar release/tag según el flujo GitHub.

## Reglas
- Instalación reproducible con lockfile.
- Secretos solo mediante mecanismos seguros del proveedor de CI.
- No imprimir secretos en logs.
- Validar cambios de alto riesgo en staging.
- No ejecutar migraciones destructivas automáticamente sin controles.
- Todo despliegue importante debe tener estrategia de rollback/recuperación.

CI/CD automatiza controles; no reemplaza revisión de arquitectura, seguridad o negocio.
