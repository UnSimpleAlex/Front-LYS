# Front-LYS

Repositorio de Leña y Sabores: https://github.com/UnSimpleAlex/Front-LYS

- [Instrucciones de agentes](AGENTS.md)
- [Índice de documentación](docs/INDEX.md)
- [Catálogo de agentes y skills](docs/AGENTES_SKILLS.md)

Las skills del proyecto se encuentran en .agents/skills/.

## Ejecutar el frontend

Requiere Node.js 22.12 o posterior.

```sh
npm ci
npm run dev
```

Abrir `http://127.0.0.1:5173`. La pantalla reproduce las referencias de inicio de sesión en desktop y móvil. El acceso, registro, recuperación, pedidos y demás secciones muestran su disponibilidad futura; no se simula una sesión autenticada.

```sh
npm run lint
npm run typecheck
npm run build
npm test
```

Las pruebas usan Microsoft Edge instalado. En un equipo sin Edge, ejecutar `npx playwright install msedge` o cambiar `channel` en `playwright.config.ts` por el navegador disponible.

Ver [implementación y comparación visual](docs/INICIO_SESION_UI.md) y [procedencia de assets](docs/ASSETS_UI.md).
