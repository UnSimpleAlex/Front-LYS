# Observabilidad y Logging — Leña y Sabores

## Objetivo
Poder responder qué falló, cuándo, dónde, a quién afectó y por qué.

## Señales
Logs, métricas, trazas cuando sean necesarias y eventos de negocio.

## Logs estructurados
Incluir contexto útil como request/correlation id, módulo, acción, resultado y duración. No imprimir objetos completos sin necesidad.

## Nunca registrar
Contraseñas, tokens, cookies completas, claves privadas, secretos o datos de tarjeta.

## Niveles
Usar `debug`, `info`, `warn`, `error` de forma coherente.

## Alertas
Crear alertas accionables: aumento de errores, latencia extrema, fallo de proceso crítico o capacidad cerca del límite. Evitar alert fatigue.

## Producción
No depender de `console.log` dispersos como estrategia de observabilidad.
