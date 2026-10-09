# Agentes y skills de Leña y Sabores

## Repositorios oficiales
- Frontend: https://github.com/UnSimpleAlex/Front-LYS
- Integración/backend: https://github.com/UnSimpleAlex/Back-LyS

Cada repositorio tiene su `AGENTS.md`, documentación en `docs/` y skills en `.agents/skills/`. Las copias de documentación común deben actualizarse en ambos repositorios cuando cambien las decisiones compartidas.

## Front-LYS
| Origen | Skills locales |
|---|---|
| https://github.com/motiondivision/ai-kit | motion |
| https://github.com/LottieFiles/motion-design-skill | motion-design |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | ui-ux-pro-max |
| https://github.com/pbakaus/impeccable | impeccable |
| https://github.com/greensock/gsap-skills | gsap-core, gsap-frameworks, gsap-performance, gsap-plugins, gsap-react, gsap-scrolltrigger, gsap-timeline, gsap-utils |
| https://github.com/magicuidesign/magicui | magic-ui |
| https://github.com/TerminalSkills/skills | aceternity-ui (selección del catálogo para efectos visuales) |
| Skill propia migrada del proyecto | image-to-ui-reference |

Impeccable incluye cuatro definiciones de agentes en `.agents/skills/impeccable/agents/`: `impeccable_asset_producer`, `impeccable_finish_reviewer`, `impeccable_documenter` e `impeccable_manual_edit_applier`. El archivo `openai.yaml` contiene metadatos de interfaz de la skill. Su presencia no implica que estén activos ni registrados globalmente como agentes.

## Back-LyS
Skills copiadas completas desde la instalación local existente: `insforge`, `insforge-cli`, `insforge-debug`, `insforge-integrations`. No se atribuye un repositorio de origen sin verificarlo. Consultar sus respectivos `SKILL.md` y recursos incluidos.

## Uso
Leer primero `AGENTS.md` y después únicamente la documentación y skills relevantes. Las 15 skills visuales también tienen una copia personal en `C:/Users/Usuario/.codex/skills` para invocación con `$`. Las copias personales y del proyecto son independientes; actualizar ambas cuando corresponda.
