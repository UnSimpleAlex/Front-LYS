# Arquitectura del sistema — Leña y Sabores

## 1. Propósito

Este documento define exclusivamente las decisiones y reglas de **arquitectura técnica** del proyecto Leña y Sabores.

No reemplaza:

- `GITHUB_WORKFLOW.md`, que define Git, GitHub, ramas, commits, Pull Requests, Issues, releases y tags.
- `SCRUM.md`, que define Sprints, Epics, Historias de Usuario, tareas y criterios de aceptación.

La arquitectura debe mantenerse separada de la metodología de trabajo.

---

# 2. Objetivos de arquitectura

El sistema debe construirse pensando desde el inicio en:

- mantenibilidad;
- separación de responsabilidades;
- escalabilidad;
- rendimiento;
- seguridad;
- legibilidad;
- facilidad de pruebas;
- facilidad de integración;
- capacidad de crecimiento;
- facilidad para que nuevos desarrolladores o agentes comprendan el proyecto.

La arquitectura debe evitar soluciones que funcionen únicamente para una demostración pequeña si luego obligarán a rehacer gran parte del sistema.

---

# 3. Tecnologías principales

## Frontend

```text
React
```

El repositorio de frontend será:

```text
https://github.com/UnSimpleAlex/Front-LYS
```

Durante la primera etapa este repositorio estará dedicado al desarrollo del frontend.

## Backend e integración

El backend utilizará:

```text
InsForge
```

El repositorio será:

```text
https://github.com/UnSimpleAlex/Back-LyS
```

InsForge será la plataforma backend para los servicios que correspondan, como base de datos, autenticación, almacenamiento, funciones backend y otras capacidades disponibles en la plataforma.

Antes de implementar o modificar integración específica con InsForge, el agente debe consultar la documentación y el skill oficial vigente de InsForge, ya que su CLI, SDK y estructura pueden evolucionar.

---

# 4. Estrategia de desarrollo por etapas

El proyecto se desarrollará en dos etapas principales.

---

## ETAPA 1 — Frontend independiente

Primero se desarrollará el frontend en:

```text
Front-LYS
```

En esta etapa:

- el proyecto será principalmente React;
- se construirá la interfaz;
- se implementarán vistas y componentes;
- se desarrollarán los flujos de navegación;
- se validará responsive;
- se implementarán estados visuales;
- se podrán utilizar datos simulados o adaptadores temporales;
- no se acoplarán los componentes visuales directamente a InsForge.

Objetivo:

```text
Frontend funcional y validado visualmente
sin depender todavía de la implementación final del backend.
```

---

# 5. Preparar el frontend para la integración futura

Aunque inicialmente el frontend trabaje con datos simulados, debe diseñarse desde el inicio para que posteriormente pueda cambiarse la fuente de datos sin reescribir toda la interfaz.

## Regla importante

Los componentes React no deberían contener directamente toda la lógica de acceso a datos.

Evitar:

```text
Componente
 ├── interfaz
 ├── consulta directa
 ├── transformación de datos
 ├── lógica de negocio
 └── persistencia
```

Preferir:

```text
Componente
   ↓
Hook / caso de uso
   ↓
Servicio
   ↓
Fuente de datos
```

Durante la etapa inicial:

```text
React
 ↓
Service
 ↓
Mock / datos simulados
```

Durante la integración:

```text
React
 ↓
Service
 ↓
InsForge
```

De esta forma la interfaz cambia lo menos posible.

---

# 6. Organización recomendada del frontend

La estructura exacta puede adaptarse al proyecto, pero se recomienda una organización modular por responsabilidad.

Ejemplo:

```text
src/
├── app/
├── pages/
├── features/
├── components/
├── layouts/
├── hooks/
├── services/
├── lib/
├── routes/
├── store/
├── assets/
├── styles/
├── utils/
└── types/
```

## `app/`

Configuración principal de la aplicación.

## `pages/`

Pantallas o rutas principales.

## `features/`

Funcionalidades organizadas por dominio.

Ejemplo:

```text
features/
├── auth/
├── catalogo/
├── carrito/
├── pedidos/
├── cocina/
├── caja/
└── dashboard/
```

Cada feature puede contener únicamente los elementos que necesita.

Ejemplo:

```text
features/carrito/
├── components/
├── hooks/
├── services/
├── utils/
└── index.js
```

La estructura no debe hacerse excesivamente profunda si no aporta valor.

## `components/`

Componentes reutilizables y genéricos.

Ejemplo:

```text
Button
Modal
Input
Card
Spinner
EmptyState
```

## `services/`

Capa encargada de comunicarse con fuentes externas.

Ejemplo conceptual:

```text
services/
├── authService
├── productService
├── orderService
└── paymentService
```

## `hooks/`

Lógica reutilizable específica de React.

## `lib/`

Configuraciones o clientes de librerías externas.

En la etapa de integración podría contener, por ejemplo, la inicialización controlada del cliente de InsForge.

## `utils/`

Funciones puras y utilidades genéricas.

---

# 7. Principio de componentes pequeños

Los componentes deben tener una responsabilidad clara.

Evitar componentes gigantes que manejen:

- interfaz;
- validaciones;
- consultas;
- estados;
- transformación de datos;
- reglas de negocio;
- navegación;

todo dentro del mismo archivo.

Cuando un componente crezca demasiado, evaluar separarlo.

No dividir por dividir.

La modularización debe mejorar:

- legibilidad;
- reutilización;
- pruebas;
- mantenimiento.

---

# 8. ETAPA 2 — Integración con InsForge

Cuando el frontend haya alcanzado un punto estable, se realizará una copia controlada hacia:

```text
Back-LyS
```

A partir de ese momento, `Back-LyS` funcionará en la práctica como el **repositorio de integración full-stack**, aunque conserve ese nombre.

El flujo será:

```text
Front-LYS
      ↓
frontend estable
      ↓
validación
      ↓
versión/tag estable
      ↓
copia controlada
      ↓
Back-LyS
      ↓
integración con InsForge
      ↓
aplicación full-stack
```

---

# 9. Regla para evitar dos fuentes de verdad

Copiar el frontend entre repositorios puede provocar que existan dos versiones diferentes del mismo código.

Por esta razón se aplicará la siguiente regla:

## Antes de la integración

```text
Front-LYS = fuente principal del frontend
```

## Después del traspaso estable

```text
Back-LyS = fuente principal de la aplicación integrada
```

`Front-LYS` podrá mantenerse como:

- referencia de la etapa frontend;
- historial del diseño;
- prototipo funcional;
- base visual.

Pero no deberían desarrollarse simultáneamente dos versiones independientes del mismo frontend sin una estrategia explícita de sincronización.

---

# 10. Copia controlada del frontend

No se debe copiar una versión arbitraria o incompleta.

Antes del traspaso:

1. comprobar que el frontend construye correctamente;
2. ejecutar las pruebas disponibles;
3. revisar errores;
4. cerrar o documentar pendientes importantes;
5. realizar el Pull Request correspondiente;
6. integrar la versión estable;
7. crear el tag o punto de referencia correspondiente;
8. copiar esa versión al repositorio de integración.

Esto permitirá identificar exactamente qué versión del frontend se utilizó como base.

---

# 11. Integración sin reescribir la interfaz

Una buena arquitectura debe permitir que gran parte de la integración consista en sustituir implementaciones.

Ejemplo:

```text
ANTES

UI
 ↓
orderService
 ↓
Mock / LocalStorage
```

Luego:

```text
DESPUÉS

UI
 ↓
orderService
 ↓
InsForge
```

La vista de pedidos no debería necesitar ser reescrita completamente solo porque cambió el origen de los datos.

---

# 12. Responsabilidad de InsForge

La integración backend deberá centralizar responsabilidades como:

- persistencia de datos;
- autenticación;
- autorización;
- base de datos;
- almacenamiento;
- funciones backend;
- procesos que no deban confiarse al navegador;
- tiempo real cuando exista una necesidad real;
- operaciones privilegiadas.

No toda acción necesita una función backend personalizada.

Las operaciones simples pueden utilizar las capacidades seguras del SDK/plataforma cuando corresponda.

Las operaciones sensibles o con reglas de negocio importantes deben ejecutarse del lado backend o bajo controles de autorización adecuados.

---

# 13. Acceso a InsForge desde React

Evitar utilizar el SDK de InsForge disperso en decenas de componentes.

Preferir:

```text
components
    ↓
hooks / features
    ↓
services
    ↓
cliente InsForge
```

Ejemplo conceptual:

```text
src/
├── lib/
│   └── insforgeClient
└── services/
    ├── authService
    ├── productService
    └── orderService
```

Esto facilita:

- cambiar implementaciones;
- hacer pruebas;
- controlar errores;
- agregar cache;
- agregar métricas;
- evitar duplicar consultas.

---

# 14. Seguridad

La seguridad debe tratarse desde el inicio.

## Nunca incluir en frontend

- secretos;
- claves administrativas;
- credenciales privadas;
- contraseñas de base de datos;
- tokens con privilegios elevados.

Todo secreto debe mantenerse fuera del código fuente.

Utilizar:

```text
.env
```

para valores locales cuando corresponda y proporcionar:

```text
.env.example
```

sin secretos reales.

---

# 15. Autorización y acceso a datos

Nunca asumir que ocultar un botón en React protege una operación.

Ejemplo incorrecto:

```text
si el usuario no es administrador
→ ocultar botón
```

Esto es solamente una protección visual.

La autorización real debe estar protegida también en el backend y/o mediante las políticas de acceso a datos correspondientes.

Aplicar:

- principio de mínimo privilegio;
- políticas de acceso por usuario/rol;
- validación del lado servidor;
- RLS cuando corresponda;
- validación de entradas;
- separación entre operaciones públicas y privilegiadas.

---

# 16. Escalabilidad

El sistema debe diseñarse con la intención de soportar inicialmente cargas del orden de:

```text
5 000 a 10 000 usuarios conectados simultáneamente
```

y permitir crecer más si la infraestructura y la capacidad contratada lo permiten.

## Importante

La arquitectura por sí sola **no garantiza** soportar 5 000, 10 000 o más usuarios concurrentes.

La capacidad real debe comprobarse mediante:

- pruebas de carga;
- métricas;
- profiling;
- monitoreo;
- análisis de consultas;
- capacidad real de la infraestructura;
- límites y configuración vigente de InsForge.

El objetivo será:

```text
Diseñar para escalar
+
medir antes de afirmar capacidad.
```

---

# 17. Principios de rendimiento del frontend

El frontend debe evitar trabajo innecesario.

Aplicar cuando corresponda:

- carga diferida de rutas;
- code splitting;
- lazy loading;
- optimización de imágenes;
- formatos modernos de imágenes;
- evitar bundles innecesariamente grandes;
- cargar únicamente los datos necesarios;
- paginar listas extensas;
- evitar renders innecesarios;
- evitar dependencias pesadas sin justificación;
- cachear datos cuando tenga sentido;
- reutilizar componentes;
- virtualizar listas realmente grandes cuando sea necesario.

No aplicar optimizaciones complejas sin medir primero si son necesarias.

---

# 18. Consultas y transferencia de datos

No solicitar miles de registros si el usuario solamente necesita visualizar veinte.

Preferir:

```text
paginación
filtros
búsqueda en backend
ordenamiento en backend
selección de campos necesarios
```

Evitar:

```text
descargar toda la tabla
 ↓
filtrar todo en el navegador
```

cuando la cantidad de datos pueda crecer considerablemente.

---

# 19. Optimización de base de datos

La base de datos debe diseñarse pensando en crecimiento.

Aplicar:

- claves primarias correctas;
- claves foráneas cuando correspondan;
- índices en columnas utilizadas frecuentemente para búsqueda, filtrado, relaciones u ordenamiento;
- constraints de integridad;
- tipos de datos adecuados;
- paginación;
- consultas específicas;
- transacciones cortas;
- evitar consultas N+1;
- evitar `SELECT *` cuando no sea necesario.

No agregar índices indiscriminadamente.

Cada índice también tiene costo de almacenamiento y escritura.

---

# 20. Reglas de negocio

Las reglas críticas no deben depender únicamente del frontend.

Ejemplos:

- cálculo definitivo de un pago;
- autorización de operaciones;
- modificación de estados sensibles;
- generación de correlativos;
- validaciones de inventario;
- cierre de caja;
- operaciones administrativas.

La interfaz puede validar para mejorar la experiencia del usuario, pero el backend debe volver a validar las reglas importantes.

---

# 21. Concurrencia

Cuando múltiples usuarios puedan modificar los mismos datos, considerar:

- transacciones;
- restricciones de base de datos;
- operaciones idempotentes;
- estados válidos;
- prevención de doble procesamiento;
- validación de cambios concurrentes.

Ejemplo:

Dos cajeros no deberían poder confirmar de manera inconsistente el mismo pago.

---

# 22. Tiempo real

El tiempo real debe utilizarse únicamente donde genere valor.

Ejemplos razonables:

```text
nuevo pedido → cocina
cambio de estado → mesera/cliente
pago confirmado → actualización de caja
```

No convertir toda la aplicación en tiempo real si una consulta normal es suficiente.

Cada suscripción permanente consume recursos y aumenta la complejidad.

---

# 23. Almacenamiento de archivos

Los archivos no deberían almacenarse directamente dentro de la base de datos salvo una necesidad justificada.

Utilizar almacenamiento de objetos/archivos para:

- imágenes;
- comprobantes;
- documentos;
- recursos multimedia.

En la base de datos se guarda la referencia y los metadatos necesarios.

---

# 24. Manejo de errores

Toda operación externa puede fallar.

La aplicación debe contemplar:

```text
loading
success
empty
error
retry
```

No mostrar errores técnicos internos directamente al usuario final.

Registrar información suficiente para diagnóstico sin exponer:

- secretos;
- tokens;
- contraseñas;
- información sensible.

---

# 25. Observabilidad

Un sistema pensado para miles de usuarios necesita poder ser observado.

Se debe poder identificar:

- errores;
- latencia;
- consultas lentas;
- endpoints o funciones problemáticas;
- tasas de error;
- consumo de recursos;
- operaciones críticas.

La solución concreta de observabilidad podrá definirse posteriormente según las herramientas disponibles.

---

# 26. Pruebas de carga

Antes de afirmar que el sistema soporta miles de usuarios concurrentes, realizar pruebas controladas.

Herramientas posibles:

```text
k6
Artillery
```

Las pruebas deben simular flujos reales, no solamente golpear una URL vacía.

Ejemplos:

```text
login
 ↓
consultar catálogo
 ↓
agregar productos
 ↓
crear pedido
 ↓
actualizar estado
```

Medir:

- tiempo de respuesta;
- percentiles;
- errores;
- throughput;
- consumo de recursos;
- comportamiento de la base de datos.

Nunca realizar pruebas de carga agresivas sobre producción sin autorización y planificación.

---

# 27. Cache

Utilizar cache únicamente cuando aporte valor.

Posibles niveles:

```text
navegador
 ↓
cliente
 ↓
CDN
 ↓
backend
 ↓
datos
```

No cachear información sensible o altamente dinámica sin una estrategia clara de invalidación.

---

# 28. Diseño stateless cuando sea posible

La lógica backend debe evitar depender de memoria local de una única instancia para información que deba sobrevivir o compartirse.

Preferir almacenar estado persistente en servicios adecuados.

Esto facilita que múltiples instancias puedan atender solicitudes sin depender de una única máquina.

---

# 29. Código limpio

Aplicar:

- nombres claros;
- funciones pequeñas;
- responsabilidades definidas;
- evitar duplicación;
- evitar archivos gigantes;
- evitar lógica compleja dentro de componentes;
- eliminar código muerto;
- no dejar `console.log` de depuración innecesarios;
- no dejar TODO sin contexto;
- mantener dependencias actualizadas de forma controlada.

---

# 30. Comentarios en el código

No es necesario comentar cada línea.

Los comentarios deben explicar principalmente:

```text
POR QUÉ
```

y no repetir simplemente:

```text
QUÉ
```

ya expresa el código.

## Comentar cuando sea importante

- regla de negocio no evidente;
- decisión arquitectónica;
- workaround;
- comportamiento extraño de una librería;
- lógica compleja;
- decisión de seguridad;
- optimización de rendimiento;
- motivo de una validación poco obvia.

Ejemplo útil:

```js
// Evita procesar dos veces el mismo pago cuando el proveedor reintenta la solicitud.
```

Ejemplo innecesario:

```js
// Incrementa contador en uno.
contador++;
```

Los comentarios deben ser:

- breves;
- claros;
- actuales;
- fáciles de entender.

Un comentario desactualizado es peor que no tener comentario.

---

# 31. Funciones y métodos

Preferir funciones que:

- hagan una cosa;
- tengan nombres descriptivos;
- reciban solo los parámetros necesarios;
- tengan efectos secundarios controlados.

Evitar funciones extremadamente largas.

Si una función necesita demasiadas explicaciones para entenderse, evaluar si debería dividirse.

---

# 32. Validación

Validar los datos en los límites del sistema.

Frontend:

```text
validación para experiencia de usuario
```

Backend:

```text
validación para seguridad e integridad
```

Nunca confiar únicamente en validaciones realizadas en React.

---

# 33. Dependencias

Antes de instalar una nueva dependencia:

1. verificar si realmente es necesaria;
2. comprobar mantenimiento;
3. revisar tamaño e impacto;
4. evitar duplicar herramientas existentes;
5. analizar riesgos de seguridad;
6. utilizar una versión compatible.

No instalar librerías para resolver problemas triviales que pueden solucionarse claramente con el stack existente.

---

# 34. Compatibilidad y desacoplamiento

Los componentes de interfaz no deben conocer detalles innecesarios de la base de datos.

Evitar:

```text
Componente React
 ↓
estructura exacta de tabla
 ↓
consulta específica
```

Preferir:

```text
Componente
 ↓
modelo de aplicación
 ↓
servicio
 ↓
adaptador InsForge
 ↓
base de datos
```

Esto permite cambiar la implementación interna con menor impacto.

---

# 35. Evolución del proyecto

La arquitectura no debe considerarse inmutable.

Puede evolucionar cuando:

- aumente la complejidad;
- aparezcan nuevos requisitos;
- las métricas demuestren un cuello de botella;
- InsForge incorpore nuevas capacidades;
- exista una razón técnica documentada.

No realizar migraciones arquitectónicas grandes únicamente por moda.

---

# 36. Regla para optimización

Seguir este orden:

```text
hacerlo correcto
 ↓
hacerlo medible
 ↓
identificar cuello de botella
 ↓
optimizar
 ↓
volver a medir
```

Evitar optimización prematura que complique innecesariamente el código.

---

# 37. Separación de documentación

La documentación deberá mantenerse por responsabilidad.

Ejemplo:

```text
docs/
├── GITHUB_WORKFLOW.md
├── SCRUM.md
├── ARQUITECTURA.md
├── BASE_DATOS.md
├── API.md
├── SEGURIDAD.md
└── ...
```

No agregar toda la documentación del proyecto dentro de `AGENTS.md`.

`AGENTS.md` debe servir principalmente como conjunto de reglas e índice para que el agente sepa qué documentación leer.

---

# 38. Flujo arquitectónico resumido

```text
ETAPA 1

Front-LYS
     ↓
React
     ↓
componentes
     ↓
features
     ↓
services
     ↓
mocks / datos simulados
     ↓
frontend estable
```

Luego:

```text
ETAPA 2

Frontend estable
     ↓
copia controlada
     ↓
Back-LyS
     ↓
React integrado
     ↓
services
     ↓
InsForge
     ↓
Auth + DB + Storage + Functions + servicios necesarios
     ↓
aplicación full-stack
```

---

# 39. Objetivo final

El resultado debe ser un sistema donde:

```text
UI
 ↓
lógica de presentación
 ↓
casos de uso / hooks
 ↓
servicios
 ↓
adaptadores
 ↓
InsForge
 ↓
datos
```

con:

- responsabilidades claras;
- seguridad por capas;
- consultas eficientes;
- frontend desacoplado;
- backend preparado para crecer;
- código comprensible;
- comentarios útiles;
- pruebas;
- métricas;
- capacidad de optimización futura.

---

# 40. Principio final

La prioridad no será únicamente:

```text
"que funcione"
```

sino:

```text
que funcione
+
que sea mantenible
+
que pueda medirse
+
que pueda optimizarse
+
que pueda escalar
+
que sea seguro
+
que otro desarrollador pueda entenderlo
```

El objetivo de 5 000 a 10 000 usuarios concurrentes debe tratarse como un **requisito de diseño y de validación**, no como una promesa automática de capacidad.
