# Instrucción permanente — React + TypeScript + Vite, Tailwind CSS, fidelidad visual y responsividad exhaustiva

## 1. Contexto tecnológico

El frontend del proyecto **Leña y Sabores** está desarrollado con:

- React para la construcción de interfaces.
- TypeScript para el tipado y la lógica de programación.
- Vite como herramienta de desarrollo y compilación.
- Un sistema de estilos existente que debes identificar antes de realizar modificaciones.

Debes conservar **React + TypeScript + Vite** como base tecnológica.

Puedes utilizar, incorporar o ampliar **Tailwind CSS** cuando aporte ventajas reales en responsividad, reutilización, consistencia visual o mantenibilidad.

No realices migraciones innecesarias ni sustituyas tecnologías que cumplen funciones diferentes.

## 2. Auditoría inicial obligatoria

Antes de implementar cualquier cambio:

1. Examina el `package.json` y el gestor de paquetes utilizado.
2. Inspecciona la configuración de Vite.
3. Identifica si Tailwind CSS está instalado y qué versión utiliza.
4. Revisa cómo están organizados los estilos actuales.
5. Identifica componentes `.tsx`, archivos `.css`, CSS Modules y estilos inline.
6. Revisa si existe un sistema de diseño, variables CSS, componentes reutilizables o librerías de interfaz.
7. Determina qué modificaciones son realmente necesarias.
8. Comprueba el estado de Git y los cambios locales pendientes.

**No instales Tailwind automáticamente sin analizar primero el proyecto.**

## 3. Incorporación condicional de Tailwind CSS

Aplica los siguientes criterios.

### Caso A: Tailwind CSS ya está instalado

- Reutiliza su configuración existente.
- Respeta las versiones y convenciones actuales.
- Aprovecha las clases utilitarias y funcionalidades disponibles.
- Evita duplicar estilos que ya pueden resolverse con Tailwind.
- No actualices de versión salvo que resulte necesario para la tarea y sea compatible con el proyecto.

### Caso B: Tailwind CSS no está instalado

Evalúa si incorporarlo mejoraría significativamente:

- La implementación responsive.
- La fidelidad respecto a las imágenes de referencia.
- La consistencia entre componentes.
- La reutilización de estilos.
- La organización y mantenibilidad del frontend.

Si existe una justificación técnica clara, puedes instalarlo e integrarlo.

En ese caso:

1. Identifica las versiones reales de Vite y las dependencias existentes.
2. Selecciona una versión de Tailwind compatible.
3. Sigue el procedimiento de instalación correspondiente a esa versión.
4. Configura correctamente su integración con Vite.
5. Conserva TypeScript y la arquitectura existente.
6. Verifica el funcionamiento de los estilos actuales.
7. Evita conflictos con CSS global, resets y librerías existentes.
8. Comprueba que el proyecto compile y funcione correctamente.

No asumas que todas las versiones de Tailwind utilizan la misma configuración.

Si los estilos actuales permiten implementar las secciones con buena calidad y mantenibilidad, puedes conservarlos.

**La elección debe basarse en criterios técnicos y no en instalar tecnologías por instalarlas.**

## 4. Migración progresiva de estilos existentes a Tailwind

Cuando resulte conveniente, puedes migrar los estilos de componentes React existentes hacia Tailwind CSS.

### Reglas de migración

- Conserva los archivos `.tsx` y su tipado TypeScript.
- No conviertas archivos `.ts` de lógica a CSS ni reemplaces TypeScript.
- Migra únicamente los estilos que aporten una mejora real.
- Sustituye progresivamente clases CSS personalizadas por utilidades Tailwind cuando corresponda.
- Mantén los componentes funcionales y sus propiedades.
- Conserva hooks, eventos, validaciones, estados y servicios.
- No alteres la lógica de negocio durante una migración de estilos.
- No elimines archivos CSS hasta verificar que ya no se utilizan.
- Evita migrar toda la aplicación innecesariamente.
- Permite la convivencia temporal de Tailwind y los estilos existentes cuando sea apropiado.

### Ejemplo conceptual

Antes:

```tsx
import "./ProductoCard.css";

export function ProductoCard() {
  return (
    <button className="producto-boton">
      Ver producto
    </button>
  );
}
```

Después:

```tsx
export function ProductoCard() {
  return (
    <button
      className="
        rounded-lg
        bg-red-700
        px-4 py-2
        font-medium
        text-white
        transition-colors
        hover:bg-red-800
        focus-visible:outline-2
        focus-visible:outline-offset-2
      "
    >
      Ver producto
    </button>
  );
}
```

Es un ejemplo ilustrativo. En el proyecto real debes respetar los colores exactos, el diseño y los componentes existentes.

## 5. Fidelidad visual a las imágenes

Cuando proporcione imágenes de referencia, utiliza la skill:

`[$image-to-ui-reference](C:\Users\Usuario\.codex\skills\image-to-ui-reference\SKILL.md)`

Debes reproducir las interfaces con la máxima fidelidad visual posible.

Presta especial atención a:

- Colores, tipografías y tamaños.
- Márgenes, paddings y espaciados.
- Alineaciones y posicionamiento.
- Iconos y botones.
- Bordes, sombras y radios.
- Dimensiones y proporciones.
- Distribución de tarjetas, formularios, tablas y menús.

Implementa primero las referencias de PC y móvil y posteriormente adapta el diseño a tablets y resoluciones intermedias.

No rediseñes, simplifiques ni modifiques arbitrariamente las referencias.

Mantén la identidad visual de Leña y Sabores, especialmente los colores rojo, blanco y negro.

## 6. Responsividad completa y obligatoria

Todas las interfaces deben funcionar correctamente en:

- Smartphones Android y iPhone.
- Móviles pequeños, medianos y grandes.
- Tablets verticales y horizontales.
- Laptops y computadoras de escritorio.
- Monitores ultrawide y 4K.
- Resoluciones intermedias y poco habituales.
- Diferentes alturas, relaciones de aspecto y niveles de zoom.

### Reglas técnicas

- Utiliza Flexbox, CSS Grid y medidas fluidas.
- Aprovecha las utilidades responsive de Tailwind cuando esté integrado.
- No dependas exclusivamente de breakpoints predeterminados.
- Utiliza `minmax()`, `clamp()`, `min-width`, `max-width` y consultas de contenedor cuando corresponda.
- Evita dimensiones rígidas que provoquen errores.
- No ocultes funcionalidades importantes para solucionar problemas responsive.
- Asegura que modales, tablas, menús, formularios y tarjetas se adapten correctamente.

El diseño debe mantener una apariencia profesional y funcional independientemente del ancho y alto disponible.

## 7. Pruebas automatizadas de resoluciones

Utiliza Playwright o las herramientas de navegador disponibles.

**No te limites a probar algunos tamaños populares.**

Realiza barridos automatizados con estas características:

1. Evalúa anchuras desde 280 px hasta 3840 px.
2. Utiliza incrementos de 10 a 20 px cuando sea viable.
3. Prueba diferentes alturas de pantalla representativas.
4. Comprueba orientaciones vertical y horizontal.
5. Evalúa anchuras inmediatamente anteriores y posteriores a cada breakpoint.
6. Incluye resoluciones intermedias y no convencionales.
7. Comprueba diferentes escalas de texto y zoom cuando las herramientas lo permitan.
8. Realiza pruebas adicionales en los intervalos donde se detecten problemas.

Evita generar capturas innecesarias para cada resolución. Utiliza comprobaciones automatizadas en los barridos completos y capturas visuales representativas.

Para optimizar las pruebas:

- Ejecuta primero un barrido amplio.
- Identifica los intervalos problemáticos.
- Realiza comprobaciones más detalladas dentro de esos intervalos.
- Corrige los errores.
- Repite las pruebas para descartar regresiones.

El objetivo es obtener la máxima cobertura práctica, sin afirmar que se han probado literalmente todas las combinaciones posibles.

## 8. Validación de iconos, textos y botones

### Iconos

- No deben aparecer iconos raros, deformados, pixelados o cortados.
- Evita emojis como sustitutos de iconos profesionales.
- Reutiliza las librerías de iconos existentes.
- Verifica alineación, tamaño, color y consistencia.
- Comprueba que ningún icono desaparezca o se desplace al cambiar de resolución.

### Textos

- Todos los textos deben ser legibles.
- No permitas palabras cortadas ni superpuestas.
- Evita tamaños de fuente demasiado pequeños.
- Garantiza contraste y espaciado adecuados.
- Comprueba textos largos y contenido dinámico.
- No ocultes información importante mediante truncamientos innecesarios.

### Botones

- Todos deben estar correctamente posicionados.
- Verifica dimensiones, alineación y espaciados.
- Centra adecuadamente textos e iconos.
- Comprueba áreas táctiles en dispositivos móviles.
- Verifica estados hover, focus, active, disabled y loading cuando corresponda.
- Asegura que sigan funcionando después de las adaptaciones responsive.

### Distribución

- No debe existir scroll horizontal inesperado.
- No deben aparecer componentes superpuestos.
- Evita elementos fuera de pantalla.
- Comprueba menús, tablas, tarjetas, modales y barras laterales.
- Verifica que la disposición siga siendo intuitiva en diferentes tamaños.

## 9. Funcionalidad y persistencia

Mantén todas las funcionalidades existentes.

- Conserva estados, hooks, eventos, servicios y validaciones.
- Respeta las integraciones reales con APIs y backend.
- Utiliza datos ficticios únicamente cuando sean necesarios para pruebas.
- Emplea `localStorage` cuando sea adecuado para conservar estados o datos de prueba.
- No dupliques datos semilla en cada recarga.
- No almacenes información sensible en `localStorage`.
- Evita sustituir funcionalidades reales por simulaciones.

Si migras un componente a Tailwind, su comportamiento debe mantenerse.

## 10. Corrección iterativa de errores

Cuando detectes un problema:

1. Identifica la resolución afectada.
2. Localiza el componente responsable.
3. Investiga la causa raíz.
4. Corrige el diseño o la estructura.
5. Vuelve a ejecutar las pruebas.
6. Verifica resoluciones cercanas.
7. Comprueba que otros componentes no se hayan visto afectados.
8. Repite hasta resolver los problemas identificados.

Evita parches CSS que solucionen una resolución y rompan otras.

Prioriza soluciones estructurales, limpias y mantenibles.

## 11. Buenas prácticas de React y TypeScript

- Mantén componentes funcionales y reutilizables.
- Respeta el tipado TypeScript.
- Evita utilizar `any` innecesariamente.
- Conserva las interfaces y tipos existentes.
- Respeta la estructura de rutas y carpetas.
- No dupliques lógica ni componentes.
- Evita dependencias innecesarias.
- Mantén una buena accesibilidad.
- Evita problemas de rendimiento y renderizados innecesarios.
- Conserva la compatibilidad con Vite y las demás dependencias del proyecto.

Tailwind debe mejorar el sistema de estilos sin perjudicar la arquitectura React + TypeScript.

## 12. Gestión de Git y commits atómicos

Antes de comenzar:

- Revisa la rama activa.
- Inspecciona los commits recientes.
- Comprueba cambios locales pendientes.
- Identifica archivos modificados por otros agentes, incluido Antigravity.
- No sobrescribas ni reviertas trabajo ajeno.

Durante el desarrollo:

- Realiza commits pequeños y atómicos.
- Utiliza mensajes descriptivos en español.
- Separa instalación, configuración, migración visual y correcciones cuando sean cambios independientes.
- Agrega al staging únicamente los cambios correspondientes a tu trabajo.
- No utilices `git add .` indiscriminadamente.
- Evita operaciones destructivas.
- No realices push ni merges automáticamente.

## 13. Validación antes de finalizar

Debes verificar:

1. Que el proyecto compile correctamente.
2. Que no existan errores de TypeScript.
3. Que Vite funcione correctamente.
4. Que Tailwind esté integrado correctamente, si se utilizó.
5. Que los estilos anteriores sigan funcionando.
6. Que los componentes migrados mantengan su comportamiento.
7. Que no existan errores relevantes de consola.
8. Que las interfaces sean responsive en las resoluciones evaluadas.
9. Que los iconos, textos y botones estén correctamente visualizados.
10. Que no existan regresiones funcionales.

Ejecuta los scripts de lint, pruebas y build disponibles en el proyecto.

## 14. Informe final obligatorio

Al finalizar, informa:

- Si Tailwind ya estaba instalado o si fue necesario incorporarlo.
- Qué versión se utilizó y cómo se integró con Vite.
- Qué componentes React se modificaron.
- Qué estilos se migraron a Tailwind.
- Qué archivos CSS se conservaron o eliminaron.
- Qué mejoras responsive se implementaron.
- Qué resoluciones se probaron realmente.
- Qué errores se detectaron y corrigieron.
- Qué pruebas se ejecutaron y sus resultados.
- Qué commits atómicos se realizaron.
- Qué limitaciones o problemas quedaron pendientes.

No afirmes haber ejecutado pruebas que no se realizaron.

---

## 15. Regla permanente e innegociable

**A partir de ahora, aplica estas instrucciones a todas las páginas, secciones y componentes que desarrolles o modifiques.**

Quiero que priorices:

1. Máxima fidelidad visual.
2. Responsividad exhaustiva.
3. Correcta visualización de iconos.
4. Legibilidad completa de textos.
5. Posicionamiento correcto de botones.
6. Funcionalidad y accesibilidad.
7. Arquitectura React + TypeScript mantenible.
8. Uso de Tailwind CSS cuando realmente aporte valor.
9. Pruebas automatizadas y correcciones iterativas.
10. Commits atómicos y seguros.

**No instales Tailwind por obligación ni migres componentes sin justificación. Analiza, decide e implementa la solución que mejor se adapte al proyecto.**

No quiero tener que señalar constantemente errores responsive, iconos incorrectos, textos ilegibles o botones desalineados.

Debes anticipar, detectar, probar y corregir estos problemas antes de finalizar cada tarea.

**Resultado esperado: una aplicación React + TypeScript + Vite profesional, escalable, visualmente consistente, completamente adaptativa y con Tailwind CSS integrado de forma coherente cuando resulte conveniente.**

Respeta siempre el alcance de la tarea actual. No realices una migración completa de la aplicación ni modifiques secciones ajenas sin necesidad.