# Base de Datos — Leña y Sabores

## Propósito
La base de datos se implementará sobre PostgreSQL mediante InsForge. Debe priorizar integridad, rendimiento, seguridad, escalabilidad y trazabilidad.

## Reglas
- Usar nombres claros y consistentes, preferentemente `snake_case`.
- Toda tabla de dominio debe tener una PK clara.
- Utilizar FK cuando exista relación real entre entidades.
- Definir conscientemente `RESTRICT`, `CASCADE` o `SET NULL`; no usar cascadas por comodidad.
- Aplicar `NOT NULL`, `UNIQUE`, `CHECK` y defaults cuando protejan integridad.
- No usar `float` para dinero; usar decimal exacto.
- Guardar fechas con una estrategia uniforme y convertir zona horaria en presentación.
- Evitar estados libres como `Pagado`, `pagado`, `PAGADO`; normalizarlos.

## Consultas e índices
- Evitar `SELECT *` si no se necesitan todas las columnas.
- Evitar N+1, consultas repetidas y traer miles de registros al frontend.
- Usar paginación para pedidos, usuarios, historial y ventas.
- Crear índices según consultas reales, no indiscriminadamente.
- Analizar planes de ejecución antes de optimizaciones grandes.

## Transacciones y concurrencia
Usar transacciones cuando varias operaciones deban ser atómicas, por ejemplo crear pedido + detalle + estado inicial. Diseñar para concurrencia: dos cajeros no deben poder cobrar inconsistentemente el mismo pedido. Considerar constraints, idempotencia y validación de estados.

## Historial y auditoría
No sobrescribir información histórica importante. Para procesos sensibles registrar quién, qué, cuándo y resultado, sin almacenar secretos.

## RLS y permisos
Cuando se use RLS, aplicar mínimo privilegio, probar cada rol y validar acceso positivo y negativo. La seguridad debe mantenerse aunque alguien invoque la API directamente.

## Migraciones
Todo cambio estructural debe existir como migración reproducible. No modificar producción manualmente sin reflejarlo en el repositorio. Probar primero fuera de producción y definir recuperación para cambios de riesgo.

## Seeds
Usar solo catálogos y datos ficticios/controlados. Nunca secretos ni datos personales reales.

## Definition of Done
Un cambio de BD requiere migración, pruebas, constraints correctos, revisión de permisos/RLS, consultas principales verificadas, evaluación de índices y documentación actualizada.
