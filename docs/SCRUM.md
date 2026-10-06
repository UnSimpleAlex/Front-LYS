# Scrum — Leña y Sabores

## 1. Objetivo

Este documento define únicamente la organización del trabajo utilizando Scrum.

Las reglas de Git, GitHub, ramas, commits, Pull Requests, Issues, releases y tags se encuentran en:

```text
GITHUB_WORKFLOW.md
```

La arquitectura del sistema se documentará posteriormente en un archivo independiente.

---

## 2. Elementos principales

La organización del proyecto podrá utilizar:

```text
Product Backlog
 ↓
Epics
 ↓
Historias de Usuario
 ↓
Tareas
 ↓
Sprint Backlog
 ↓
Sprint
 ↓
Incremento
```

---

## 3. Epics

Un Epic representa un conjunto amplio de funcionalidades relacionadas.

Ejemplos posibles para Leña y Sabores:

```text
EPIC-01 Autenticación y usuarios
EPIC-02 Catálogo y compras
EPIC-03 Gestión de pedidos
EPIC-04 Cocina
EPIC-05 Caja
EPIC-06 Administración y dashboard
```

Estos nombres son ejemplos y podrán modificarse durante la planificación real.

---

## 4. Historias de Usuario

Las Historias de Usuario deben expresar una necesidad desde el punto de vista del usuario.

Formato recomendado:

```text
Como [tipo de usuario],
quiero [acción o necesidad],
para [beneficio].
```

Ejemplo:

```text
HU-05

Como cliente,
quiero agregar productos al carrito,
para preparar mi pedido antes de confirmarlo.
```

---

## 5. Criterios de aceptación

Cada Historia de Usuario debe tener criterios de aceptación claros y verificables.

Ejemplo:

```text
- El usuario puede agregar un producto.
- Puede modificar la cantidad.
- Puede eliminar un producto.
- El total se recalcula correctamente.
- El carrito conserva la información esperada.
```

Una HU no debería considerarse terminada si sus criterios de aceptación no se cumplen.

---

## 6. Tareas

Cada Historia de Usuario puede dividirse en tareas técnicas más pequeñas.

Ejemplo:

```text
HU-05 Carrito de compras

Tareas:
- Diseñar interfaz del carrito.
- Implementar agregar producto.
- Implementar cambio de cantidad.
- Implementar eliminación.
- Implementar cálculo total.
- Integrar con backend.
- Crear pruebas.
```

Las tareas permiten dividir el trabajo sin convertir cada detalle en una Historia de Usuario independiente.

---

## 7. Sprints

Un Sprint agrupa un conjunto de trabajo comprometido para un periodo determinado.

Ejemplo conceptual:

```text
Sprint 1
├── HU-01
├── HU-02
└── HU-03

Sprint 2
├── HU-04
├── HU-05
└── HU-06
```

La numeración exacta y duración de cada Sprint se definirá durante la planificación del proyecto.

---

## 8. Sprint Backlog

El Sprint Backlog contiene las Historias de Usuario y tareas seleccionadas para el Sprint actual.

Debe permitir saber:

- qué se hará;
- quién trabaja en ello;
- estado;
- prioridad;
- criterios de aceptación;
- dependencias.

---

## 9. Estados recomendados

Ejemplo:

```text
Pendiente
En progreso
En revisión
En pruebas
Bloqueado
Finalizado
```

El equipo puede simplificar o modificar estos estados según sus necesidades.

---

## 10. Definition of Done

Una Historia de Usuario puede considerarse terminada cuando:

- cumple sus criterios de aceptación;
- frontend y backend necesarios están implementados;
- las pruebas relevantes pasan;
- no existen errores bloqueantes;
- los Pull Requests necesarios fueron revisados;
- los cambios fueron integrados;
- la documentación necesaria fue actualizada.

---

## 11. Relación con GitHub

Scrum y GitHub se relacionan, pero no deben mezclarse innecesariamente.

Ejemplo:

```text
EPIC-02
  ↓
HU-05 Carrito de compras
  ↓
Tareas técnicas
  ↓
trabajo en GitHub
  ↓
feature/carrito-compras
```

La rama puede llamarse simplemente:

```text
feature/carrito-compras
```

No es necesario incluir:

```text
sprint-02
hu-05
epic-02
```

dentro del nombre de la rama.

La relación con Sprint, Epic o HU puede mantenerse mediante:

- GitHub Issues;
- GitHub Projects;
- referencias en Pull Requests;
- documentación del Sprint;
- enlaces entre Issues y PRs.

---

## 12. Frontend y Backend dentro de una HU

Una Historia de Usuario puede requerir trabajo en ambos repositorios.

Ejemplo:

```text
HU-05 Carrito de compras
       │
       ├── Front-LYS
       │      └── feature/carrito-compras
       │
       └── Back-LyS
              └── feature/carrito-compras
```

La Historia de Usuario solo se considera terminada cuando todas las partes necesarias cumplen sus criterios de aceptación.

---

## 13. Trazabilidad recomendada

La trazabilidad puede mantenerse así:

```text
Epic
 ↓
Historia de Usuario
 ↓
Issue / tareas
 ↓
Pull Request
 ↓
Incremento
```

Ejemplo:

```text
EPIC-02 Catálogo y compras
 ↓
HU-05 Carrito de compras
 ↓
Issue #12
 ↓
PR Frontend #20
PR Backend #15
 ↓
HU completada
```

---

## 14. Separación de documentación

La documentación del proyecto se mantendrá dividida por responsabilidad.

Ejemplo:

```text
docs/
├── GITHUB_WORKFLOW.md
├── SCRUM.md
├── ARQUITECTURA.md
├── BASE_DATOS.md
├── API.md
└── ...
```

Cada archivo debe tratar un tema específico.

No se debe colocar toda la documentación del proyecto dentro de un único archivo.
