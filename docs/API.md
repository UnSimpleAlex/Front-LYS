# API e Integraciones — Leña y Sabores

## Flujo recomendado
`Componente React → hook/caso de uso → service → adapter/SDK → InsForge`.

No dispersar llamadas directas a InsForge en decenas de componentes.

## Servicios
Organizar por dominio: `authService`, `productService`, `orderService`, `paymentService`, etc. Los componentes no deben depender innecesariamente de la estructura exacta de tablas.

## Contratos
Definir entrada, salida, errores, permisos y campos opcionales. Normalizar errores (`VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL_ERROR`).

## Reglas
- Validar entradas también en backend.
- Implementar paginación, filtros y límites.
- Aplicar timeouts a integraciones externas.
- Reintentar solo errores transitorios y con backoff.
- Proteger operaciones sensibles con idempotencia.
- Aplicar rate limiting a login, OTP, recuperación y endpoints costosos cuando sea necesario.
- No enviar secretos administrativos al navegador.

## Realtime
Usarlo solo donde aporte valor: nuevo pedido en cocina, cambio de estado, confirmación de caja. No convertir toda la app en realtime.

## Webhooks
Verificar origen/firma cuando exista, soportar reintentos, usar idempotencia y registrar resultados sin secretos.

## Definition of Done
Contrato claro, validaciones, permisos, errores controlados, pruebas, logging suficiente, documentación y ausencia de secretos.
