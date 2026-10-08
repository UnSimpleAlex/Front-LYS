# Entornos y Configuración — Leña y Sabores

## Entornos
Separar desarrollo, staging/pruebas y producción.

## Variables
Externalizar URL backend, claves públicas, feature flags y endpoints. Mantener `.env.example` sin secretos reales.

## Producción
No reutilizar credenciales de desarrollo. Tratar cualquier variable que llegue al bundle frontend como pública.

## Validación
Validar configuración al arrancar y fallar temprano si falta una variable obligatoria.

## InsForge
Cuando sea viable, usar entornos/branches de backend aislados para probar cambios. Antes de usar CLI o SDK consultar la documentación/skill oficial vigente.
