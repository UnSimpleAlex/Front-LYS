# Migraciones — Leña y Sabores

## Regla principal
La estructura de la base debe poder reconstruirse desde el repositorio.

- Cada migración representa un cambio identificable y revisable.
- Usar una convención ordenable, por ejemplo `001_init.sql`, `002_catalogos.sql`.
- No mezclar cambios no relacionados.
- Separar migraciones estructurales de seeds cuando sea posible.
- No editar el esquema de producción sin crear la migración correspondiente.

## Cambios destructivos
Para renombrar/eliminar campos con datos, preferir una transición compatible: crear nueva estructura → migrar datos → desplegar código compatible → verificar → retirar estructura antigua.

## Rollback
No toda migración puede revertirse automáticamente. Documentar cómo volver atrás o recuperar datos.

## InsForge
Antes de ejecutar comandos, consultar la documentación/skill oficial vigente de InsForge; no asumir que la CLI o sus comandos siguen iguales.
