# Procedencia de assets de inicio de sesión

## Recursos del usuario

`public/images/register-lettering.webp`: lettering de registro recreado con ImageGen sobre transparencia (2020×778, convertido a WebP calidad 90). Texto exacto: «Únete al» negro / «sabor de casa» rojo, trazos anchos de pincel, subrayado rojo y tres rayos rojos. Se generó únicamente el título, sin fondo, fotografía ni formulario, aproximando el estilo de las referencias 2.png y Movil/4.png. Los fondos de registro son los mismos Cloudinary del login.

- Fondo PC activo en Cloudinary: https://res.cloudinary.com/y08rn1qr/image/upload/v1791327573/b4146a7f-588e-484e-bdea-040ffa4a6796.png. `public/images/hero-desktop.webp` conserva el recurso local anterior.
- Fondo móvil activo en Cloudinary: https://res.cloudinary.com/y08rn1qr/image/upload/v1791327513/dae531a5-70f8-4f49-aff5-1ea88aaac133.png. `public/images/hero-mobile.webp` conserva el recurso local anterior.
- `public/images/logo.webp`: logo suministrado, 2048 × 682, con transparencia.

Se convirtió el formato a WebP para reducir la transferencia, conservando la composición. No se generó una fotografía nueva. Los archivos PNG originales copiados localmente están ignorados por Git.

## Lettering

`public/images/welcome-lettering.webp` (2172 × 724, alpha) deriva de la referencia desktop mediante la herramienta integrada ImageGen. Se conservó la transparencia y se convirtió a WebP sin pérdida. El archivo PNG generado se conserva localmente y en la salida original de ImageGen.

Prompt utilizado:

> Use case: background-extraction. Asset type: transparent website headline graphic. EDIT TARGET: the supplied screenshot. Extract ONLY the large two-line brush lettering in the upper left, with its red accent rays and red brush underline. Exact text line 1: "Bienvenido" in BLACK. Exact text line 2: "al sabor de casa" in DEEP RED. Preserve the screenshot's exact chunky dry-brush glyph silhouettes, irregular ink edges, baseline, spacing, proportions and black/red colors as closely as possible; do not redesign or substitute smooth connected calligraphy. Include the three red accent strokes to right of Bienvenido and the red brush underline under second line. Remove EVERYTHING else: navbar, logo, mountains, food, bag, supporting paragraph, form, shadows. Output genuine transparent alpha around lettering and in all letter counters. Wide compact landscape canvas around 3:1 aspect, lettering fills canvas with small clear margins, no checkerboard painted, no white background, no extra text. This is ONLY an isolated lettering asset, NOT a whole UI screenshot.

## Tipografía

DM Sans se aloja en `public/fonts/DM-Sans.ttf`, procedente del [repositorio oficial Google Fonts](https://github.com/google/fonts/tree/main/ofl/dmsans), con su licencia SIL OFL en `DM-Sans-OFL.txt`.

Se buscaron y compararon [Brusher](https://www.dafont.com/es/brusher.font), [Knewave](https://www.dafont.com/es/knewave.font), [Edo SZ](https://www.dafont.com/es/edo-sz.font) y [Levi Brush](https://www.dafont.com/es/levibrush.font) en DaFont. Ninguna reprodujo el lettering lo bastante cerca; no se incluyen sus archivos en la aplicación. El título usa el recurso gráfico acompañado de texto accesible.

## Tipografía manuscrita de bienvenida

Caveat variable (400–700), desde https://github.com/google/fonts/tree/main/ofl/caveat, alojada localmente en public/fonts/Caveat.ttf. Licencia SIL OFL 1.1 conservada en Caveat-OFL.txt. Se utiliza solo para la frase del banner. Smile Moon se descartó por decisión del usuario al requerir licencia comercial; no se incorpora al repositorio.
