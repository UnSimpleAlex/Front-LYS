# Testing — Leña y Sabores

## Estrategia
Combinar pruebas unitarias, de componentes, integración, E2E, seguridad y carga según el riesgo.

## Principios
- Probar comportamiento, no detalles internos.
- Muchas pruebas rápidas y menos E2E costosas.
- Datos de prueba deterministas e independientes.
- No mockear tanto que la integración real nunca se pruebe.

## Frontend
Probar formularios, validaciones, carrito, loading/empty/error, permisos visuales, navegación, componentes críticos y responsive.

## Backend
Probar reglas de negocio, autorización, persistencia, transacciones, estados, idempotencia y errores.

## Base de datos
Probar constraints, migraciones, RLS, relaciones y concurrencia crítica.

## Casos mínimos
Camino correcto + entrada inválida + usuario sin permiso + recurso inexistente/conflicto.

## E2E prioritarios
Registro/login, catálogo/carrito, confirmar pedido, cocina, caja y dashboard.

## Regresión
Un bug importante debería producir una prueba que falle antes del fix y pase después.

## CI
No hacer merge si fallan las pruebas obligatorias. Corregir flaky tests; no normalizarlos.

## Cobertura
Usarla como señal, no como objetivo absoluto. Priorizar módulos de mayor riesgo.
