# Rendimiento y Escalabilidad — Leña y Sabores

## Objetivo
Diseñar para cargas del orden de 5 000–10 000 usuarios concurrentes y permitir crecer más si la infraestructura lo soporta. Esto es un objetivo, no una garantía.

## Regla
Medir → identificar cuello de botella → optimizar → volver a medir.

## Frontend
Lazy loading, code splitting, imágenes optimizadas, bundles controlados, paginación, cache justificada, evitar renders innecesarios y virtualizar listas realmente grandes.

## Backend y datos
Evitar trabajo bloqueante, respuestas enormes, consultas repetidas y transacciones largas. Revisar índices, locks, conexiones, N+1 y paginación.

## Realtime
No crear suscripciones globales innecesarias. Suscribirse solo a eventos relevantes y liberar recursos al salir.

## Pruebas de carga
Herramientas posibles: k6 o Artillery. Simular flujos reales: login → catálogo → carrito → pedido. Medir p50/p95/p99 cuando aporte valor, throughput, error rate y consumo de recursos.

## Escalado
Preferir servicios stateless cuando sea posible. No guardar estado crítico solo en memoria de una instancia.

## Regla final
Nunca afirmar “soporta 10 000 usuarios” sin evidencia reproducible de una prueba equivalente y sin considerar límites vigentes de InsForge/infraestructura.
