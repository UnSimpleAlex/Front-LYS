# AGENTS.md — Leña y Sabores

## Antes de trabajar
1. Leer este archivo.
2. Identificar el tipo de tarea.
3. Leer únicamente los documentos relevantes de `docs/`.
4. Revisar rama, estado de Git y diff antes de modificar.
5. Para operaciones específicas de InsForge, consultar su skill/documentación oficial vigente; no asumir CLI/SDK desactualizados.

## Qué leer
- Git/ramas/commits/PR/Issues/releases: `docs/GITHUB_WORKFLOW.md`
- Scrum/Sprint/Epic/HU/tareas: `docs/SCRUM.md`
- Arquitectura React + InsForge: `docs/ARQUITECTURA.md`
- Tablas/índices/RLS/datos: `docs/BASE_DATOS.md` + `docs/MIGRACIONES.md`
- API/services/realtime/integraciones: `docs/API.md`
- Auth/roles/secretos/RLS: `docs/SEGURIDAD.md`
- Vulnerabilidades: `docs/VULNERABILIDADES.md` + `docs/SEGURIDAD.md`
- Pruebas: `docs/TESTING.md`
- Performance/5k-10k concurrentes: `docs/RENDIMIENTO_ESCALABILIDAD.md` + `docs/OBSERVABILIDAD.md`
- Logs/incidentes: `docs/OBSERVABILIDAD.md` + `docs/INCIDENTES.md`
- Variables/ambientes: `docs/ENTORNOS_CONFIGURACION.md`
- CI: `docs/CI_CD.md`
- Backup: `docs/BACKUP_RECUPERACION.md`
- Dependencias: `docs/DEPENDENCIAS.md`
- Convenciones/comentarios: `docs/CONVENCIONES_CODIGO.md`
- Datos personales: `docs/DATOS_PRIVACIDAD.md`
- Deploy: `docs/DESPLIEGUE.md` + `docs/GITHUB_WORKFLOW.md`
- UI/accesibilidad: `docs/ACCESIBILIDAD_UI.md`

## Reglas permanentes
- `main` estable; `dev` integración.
- Ramas simples como `feature/carrito-compras` y `fix/calculo-total`.
- Commits pequeños, atómicos, breves y en español.
- Pull Request para integrar; no merge con errores, conflictos o checks obligatorios fallidos.
- Releases con SemVer y tags.
- No exponer secretos ni confiar solo en validaciones frontend.
- Comentarios breves solo cuando aportan contexto importante, especialmente el porqué.
- Evitar duplicación, archivos gigantes y lógica de acceso a datos dispersa.
- Diseñar para escalar, pero no afirmar capacidad de miles de usuarios sin pruebas.

## Antes de finalizar
Revisar diff, ejecutar tests/lint/typecheck/build disponibles, revisar seguridad y rendimiento, respetar alcance, actualizar documentación y PR. No afirmar que funciona si no fue validado.

## Repositorio actual: Front-LYS
Frontend React. Priorizar UI, componentes, responsive, accesibilidad y services desacoplados de mocks/InsForge. Durante la etapa frontend no acoplar componentes directamente a la implementación final.

## Skills del repositorio
Consultar `docs/AGENTES_SKILLS.md` para elegir la skill según la tarea. Las skills locales están en `.agents/skills/`.
- UI/UX y pulido: `ui-ux-pro-max`, `impeccable`.
- Referencias de imágenes: `image-to-ui-reference`.
- Criterio de movimiento: `motion-design`; implementación con Motion: `motion`.
- Animación avanzada: `gsap-core`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-plugins`, `gsap-performance`, `gsap-utils`; `gsap-frameworks` solo para frameworks distintos de React.
- Componentes y efectos: `magic-ui`, `aceternity-ui`.
Los agentes auxiliares de Impeccable están en `.agents/skills/impeccable/agents/`; aplicarlos únicamente cuando el flujo de esa skill lo requiera.
