# Flujo de trabajo Git y GitHub — Leña y Sabores

## 1. Objetivo

Este documento define únicamente las reglas de trabajo relacionadas con:

- Git;
- GitHub;
- ramas;
- commits;
- Pull Requests;
- Issues;
- releases;
- tags;
- versionado semántico.

La metodología Scrum se documentará por separado en `SCRUM.md`.

---

## 2. Repositorios del proyecto

El proyecto se divide en dos repositorios independientes:

### Frontend

```text
https://github.com/UnSimpleAlex/Front-LYS
```

### Backend

```text
https://github.com/UnSimpleAlex/Back-LyS
```

Cada repositorio mantiene de manera independiente:

- sus ramas;
- sus commits;
- sus Pull Requests;
- sus Issues;
- sus pruebas;
- sus releases;
- sus tags.

---

## 3. Ramas principales

El flujo base será:

```text
main
 ↓
dev
 ↓
feature/*
 ↓
dev
 ↓
release/vX.Y.Z
 ↓
main
 ↓
tag vX.Y.Z
```

---

## 4. Rama `main`

`main` representa la versión estable del proyecto.

Debe contener únicamente código:

- probado;
- revisado;
- estable;
- sin errores bloqueantes conocidos;
- listo para entrega o producción.

No se debe desarrollar directamente sobre `main`.

Los cambios deben ingresar mediante Pull Request.

---

## 5. Rama `dev`

`dev` es la rama de integración del desarrollo.

Desde `dev` se crean normalmente las ramas de funcionalidades y correcciones.

Ejemplo:

```text
main
 ↓
dev
 ├── feature/carrito-compras
 ├── feature/inicio-sesion
 ├── feature/gestion-pedidos
 └── fix/calculo-total
```

---

## 6. Ramas `feature/*`

Cada funcionalidad debe desarrollarse en una rama independiente.

Los nombres deben ser simples, breves y descriptivos.

Ejemplos:

```text
feature/inicio-sesion
feature/registro-usuarios
feature/carrito-compras
feature/gestion-pedidos
feature/metodos-pago
feature/dashboard-ventas
```

### Importante

Los nombres anteriores son ejemplos.

No se debe incluir obligatoriamente información de Sprint, Epic o Historia de Usuario dentro del nombre de la rama.

Por ejemplo:

```text
feature/carrito-compras
```

es preferible a:

```text
feature/sprint-02-hu-05-carrito-compras
```

La trazabilidad de Scrum se gestionará fuera del nombre de la rama.

---

## 7. Ramas `fix/*`

Se utilizan para corregir errores detectados durante el desarrollo.

Ejemplos:

```text
fix/calculo-total
fix/persistencia-carrito
fix/estado-pedido
```

Normalmente parten desde `dev` y regresan a `dev` mediante Pull Request.

---

## 8. Ramas `hotfix/*`

Se utilizan para errores críticos encontrados en una versión que ya está en `main`.

Ejemplo:

```text
hotfix/error-confirmacion-pago
```

Flujo:

```text
main
 ↓
hotfix/error-confirmacion-pago
 ├──→ main
 └──→ dev
```

La corrección debe llegar también a `dev` para evitar que el error reaparezca en futuras versiones.

---

## 9. Commits

Los commits deben ser:

- pequeños;
- atómicos;
- breves;
- claros;
- descriptivos;
- escritos en español.

No se debe juntar todo el desarrollo de una funcionalidad grande en un único commit si puede dividirse correctamente.

### Ejemplo recomendado

```text
feat: crea vista del carrito
feat: agrega cambio de cantidades
feat: agrega eliminación de productos
fix: corrige cálculo del total
test: agrega pruebas del carrito
```

### Ejemplo no recomendado

```text
feat: termina todo el carrito
```

si dentro de ese commit existen muchos cambios independientes.

---

## 10. Formato recomendado para commits

Se recomienda utilizar prefijos de Conventional Commits y mantener la descripción en español.

```text
feat: agrega registro de usuarios
fix: corrige cálculo del total
docs: actualiza documentación de pedidos
refactor: separa servicio de autenticación
test: agrega pruebas del carrito
chore: actualiza dependencias
```

Evitar mensajes como:

```text
cambios
avance
actualizacion
final
cosas nuevas
```

---

## 11. Pull Requests

Las integraciones deben realizarse mediante Pull Request.

Flujos habituales:

```text
feature/* → dev
fix/*     → dev
release/* → main
hotfix/*  → main
```

Un Pull Request debe explicar al menos:

```markdown
## Descripción

Qué se implementó o corrigió.

## Cambios realizados

- Cambio 1
- Cambio 2
- Cambio 3

## Cómo probar

1. Paso 1
2. Paso 2
3. Paso 3

## Issue relacionado

Closes #12
```

---

## 12. Cuándo aceptar un Pull Request

Un Pull Request puede aceptarse y mezclarse cuando:

- el código compile correctamente;
- las pruebas correspondientes hayan pasado;
- el lint haya pasado, si existe;
- el typecheck haya pasado, si existe;
- no existan conflictos pendientes;
- no existan errores bloqueantes;
- no existan comentarios importantes de revisión sin resolver;
- la funcionalidad cumpla el objetivo previsto.

Flujo:

```text
PR creado
 ↓
revisión
 ↓
pruebas
 ↓
¿hay errores?
 ├── Sí → corregir en la misma rama → volver a validar
 └── No → aceptar y hacer merge
```

No se debe aceptar un PR únicamente porque visualmente parece correcto.

---

## 13. Issues

Los Issues se utilizan para registrar y dar seguimiento a:

- errores;
- bugs;
- mejoras;
- tareas técnicas;
- incidencias;
- documentación pendiente.

La gestión de Historias de Usuario, Epics y Sprints se explicará en `SCRUM.md`.

---

## 14. Cómo reportar un error

Ejemplo de título:

```text
[BUG] El carrito pierde los productos al actualizar
```

Ejemplo de contenido:

```markdown
## Descripción

Explicar brevemente el problema.

## Pasos para reproducir

1. ...
2. ...
3. ...

## Resultado actual

Qué ocurre actualmente.

## Resultado esperado

Qué debería ocurrir.

## Evidencia

Captura, video, logs o mensaje de error.

## Entorno

- Repositorio:
- Rama:
- Navegador / sistema:
- Versión:

## Prioridad

Baja / Media / Alta / Crítica
```

---

## 15. Cómo resolver un Issue

Flujo recomendado:

```text
Issue
 ↓
crear rama fix/*
 ↓
corregir
 ↓
commits pequeños
 ↓
pruebas
 ↓
Pull Request
 ↓
revisión
 ↓
merge
 ↓
cerrar Issue
```

En el Pull Request se puede utilizar:

```text
Closes #12
```

GitHub cerrará el Issue automáticamente después del merge.

---

## 16. Documentar cómo se resolvió un error

Antes de cerrar el Issue, se recomienda dejar evidencia de la solución.

Ejemplo:

```markdown
## Solución aplicada

El problema ocurría porque el carrito solo se almacenaba en memoria.

### Cambios realizados

- Se agregó persistencia.
- Se restauran los productos al cargar.
- Se validó el cálculo del total.

### Validación

Se comprobó que el carrito conserve los productos después de actualizar.

Resuelto en PR #18.
```

---

## 17. Releases

Para preparar una versión se crea una rama temporal desde `dev`.

Ejemplos:

```text
release/v1.0.0
release/v1.1.0
release/v2.0.0
```

En esta rama se realizan principalmente:

- pruebas finales;
- correcciones menores;
- validaciones;
- ajustes de configuración;
- documentación de la versión.

No se deben agregar funcionalidades grandes nuevas.

Flujo:

```text
dev
 ↓
release/v1.0.0
 ↓
pruebas finales
 ↓
Pull Request
 ↓
main
 ↓
tag v1.0.0
```

---

## 18. Versionado semántico

Las versiones estables utilizarán Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Ejemplos:

```text
v1.0.0
v1.1.0
v1.1.1
v2.0.0
```

### MAJOR

Cambio mayor o incompatible.

```text
v1.5.0 → v2.0.0
```

### MINOR

Nueva funcionalidad compatible.

```text
v1.0.0 → v1.1.0
```

### PATCH

Corrección de errores compatible.

```text
v1.1.0 → v1.1.1
```

---

## 19. Tags

Una vez que el release haya sido validado e integrado en `main`, se crea el tag correspondiente.

Ejemplo:

```text
v1.0.0
```

El tag debe apuntar al commit estable que representa esa versión.

También se pueden utilizar versiones candidatas antes de una versión estable:

```text
v1.0.0-rc.1
v1.0.0-rc.2
```

---

## 20. Frontend y Backend

Frontend y backend trabajan en repositorios separados.

Si una funcionalidad requiere cambios en ambos, se puede utilizar el mismo nombre funcional en ambos repositorios.

Ejemplo:

```text
Front-LYS:
feature/carrito-compras

Back-LyS:
feature/carrito-compras
```

Esto facilita identificar que ambas ramas forman parte de la misma funcionalidad sin introducir información de Scrum en el nombre.

Cada repositorio tendrá:

- sus propios commits;
- su propio Pull Request;
- sus propias validaciones;
- su propio merge.

---

## 21. Resumen de ramas

| Rama | Uso |
|---|---|
| `main` | Código estable |
| `dev` | Integración del desarrollo |
| `feature/*` | Nueva funcionalidad |
| `fix/*` | Corrección durante desarrollo |
| `release/vX.Y.Z` | Preparación de una versión |
| `hotfix/*` | Corrección urgente sobre producción |

---

## 22. Flujo final

```text
main
 ↓
dev
 ↓
feature/nombre-funcionalidad
 ↓
commits pequeños
 ↓
Pull Request
 ↓
pruebas y revisión
 ↓
dev
 ↓
release/vX.Y.Z
 ↓
pruebas finales
 ↓
Pull Request
 ↓
main
 ↓
tag vX.Y.Z
```

Si se encuentra un error:

```text
Error
 ↓
Issue
 ↓
fix/nombre-error
 ↓
commits pequeños
 ↓
Pull Request
 ↓
pruebas
 ↓
merge
 ↓
documentar solución
 ↓
cerrar Issue
```
