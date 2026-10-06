# Convenciones de Código — Leña y Sabores

## Objetivo
Código fácil de leer por otra persona o agente.

- Nombres descriptivos; evitar `tmp`, `data2`, `func1` salvo contextos obvios.
- Funciones pequeñas y con responsabilidad clara.
- Componentes React centrados en presentación/coordinación; extraer lógica compleja a hooks/services.
- Eliminar código muerto; Git ya conserva historial.
- Un TODO debe explicar contexto, no solo “arreglar”.
- Usar formatter/linter común.
- No silenciar errores sin razón.
- Reutilizar sin crear abstracciones prematuras.

## Comentarios
No comentar cada línea. Comentar decisiones, reglas no evidentes, workarounds, seguridad, rendimiento y lógica compleja. Explicar principalmente el **porqué**.
