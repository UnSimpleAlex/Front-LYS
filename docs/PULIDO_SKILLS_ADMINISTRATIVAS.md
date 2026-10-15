# Skills y pulido de los paneles

## Instalación personal

Instaladas en `C:/Users/Usuario/.codex/skills` mediante el instalador de Codex:

- `taste-skill`, `redesign-skill` e `image-to-code-skill`: https://github.com/Leonxlnx/taste-skill
- `web-design-guidelines`: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
- `playwright-cli`: https://github.com/microsoft/playwright-cli/tree/main/skills/playwright-cli

Playwright CLI se instaló desde el paquete oficial `@playwright/cli`; versión comprobada: 0.1.22. El ejecutable personal está en `C:/Users/Usuario/AppData/Roaming/npm/playwright-cli.cmd`. Las nuevas skills se descubren en el próximo turno de Codex; sus instrucciones se leyeron directamente para esta revisión.

`awesome-design-md` no contiene una skill. Su colección se conserva en `C:/Users/Usuario/.codex/references/awesome-design-md`. Se consultaron los documentos de SAP y Linear para separar superficies, roles tipográficos y estados, conservando el blanco y rojo de Leñas y Sabores. No se copió la identidad visual de esas marcas al proyecto.

Las instalaciones personales no son dependencias de producción y no se incluyen en el repositorio. Los cambios de interfaz funcionan sin tener estas herramientas instaladas.

## Revisión aplicada

- `src/styles/operations-anchor-foundation.css`: las notas de indicadores y cuenta tenían poco contraste. La capa de pulido usa un tono secundario más legible.
- `src/styles/operations-anchor-polish.css`: cifras tabulares para métricas e importes; foco visible, estados de acción y filas, contención del desplazamiento en ventanas y navegación, estados vacíos y placeholders legibles. No cambia la escala compacta ni las páginas públicas.
- `src/features/operations/AdminSettings.tsx`: nombres de campos y autocompletado apropiado para datos del negocio.

Taste principal declara que no está destinado a dashboards. La skill de revisión de proyectos y las guías de Vercel sí se aplican aquí. Las recomendaciones de ampliar títulos, añadir texturas, sustituir modales o generar nuevas imágenes se subordinan a las decisiones explícitas del usuario: referencias suministradas, fondo blanco, escala compacta y edición mediante ventanas. Se conservan los recursos reales y los flujos locales.

## Validación

Compilación TypeScript/producción y lint; recorrido visual de 25 rutas en cinco resoluciones con `tests/reference-layout.spec.ts`, más el flujo de ventanas y navegación de `tests/workspace.spec.ts`. Las capturas se guardan fuera del historial en `.impeccable/review/anchor-correction/`.
