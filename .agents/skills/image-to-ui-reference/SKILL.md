---
name: image-to-ui-reference
description: Reproduce interfaces from desktop and mobile reference images with high visual fidelity in React, infer responsive behavior for intermediate resolutions, preserve colors, typography, spacing, images and hierarchy, and visually verify the result before completion.
---

# Image to UI Reference

## Purpose

Use this skill when the user provides one or more reference images showing how a page, component, section, or application screen should look and wants the implementation to reproduce that reference as faithfully as possible.

This skill is optimized for:

- React frontends;
- desktop + mobile reference pairs;
- responsive interpolation between reference sizes;
- high visual fidelity;
- maintainable production code;
- visual QA before completion.

This skill does **not** redesign the reference unless the user explicitly asks for improvements.

---

## Core rule

The reference image is the visual specification.

Do not reinterpret:

- layout;
- hierarchy;
- colors;
- spacing;
- visible typography;
- image placement;
- component proportions;
- alignment;
- border radius;
- shadows;
- density;
- navigation structure.

When the reference is clear, prefer fidelity over personal design preference.

---

## Required inputs

Ideal input:

```text
1 desktop reference image
+
1 mobile reference image
```

Optional:

- logo;
- product images;
- icons;
- font names/files;
- SVG assets;
- exact viewport sizes;
- existing React project.

Reuse existing project assets before creating replacements.

---

## Workflow

Follow this order:

```text
inspect references
↓
extract design system
↓
measure layout
↓
identify responsive differences
↓
inspect existing code/assets
↓
plan components
↓
implement structure
↓
implement styling
↓
implement responsive interpolation
↓
implement motion if present/requested
↓
run application
↓
capture screenshots
↓
compare against references
↓
adjust
↓
verify intermediate resolutions
↓
finish
```

Do not jump directly from screenshot to one giant component.

---

## 1. Analyze desktop and mobile together

Identify:

- viewport/aspect ratio;
- navbar/header height;
- content max-width;
- columns;
- section order;
- grids;
- gaps;
- alignment;
- typography;
- colors;
- borders;
- radii;
- shadows;
- image crop;
- icons;
- navigation;
- fixed/sticky elements.

Compare desktop and mobile before coding.

---

## 2. Derive a visual spec

Internally estimate the important geometry.

Example:

```text
Desktop
- navbar: ~88 px
- max content width: ~1280 px
- hero: 54/46 columns
- card radius: ~20 px
- section spacing: ~96 px

Mobile
- navbar: ~64 px
- hero: one column
- horizontal padding: ~20 px
- section spacing: ~56 px
```

Treat estimates as approximations unless exact values are provided.

---

## 3. Extract design tokens

Reuse or define tokens for:

```text
colors
spacing
font sizes
font weights
line heights
radii
shadows
container widths
motion timing
```

Prefer CSS variables or the project's existing token system.

Avoid scattering repeated magic values.

---

## 4. Colors

Match the reference closely.

Do not automatically:

- brighten;
- mute;
- warm;
- cool;
- add gradients;
- add extra accents.

If official project brand colors clearly match the reference, reuse them.

---

## 5. Typography

Match:

- family;
- weight;
- size;
- line height;
- letter spacing;
- text transform;
- paragraph width.

If the exact font is unavailable:

1. inspect project assets;
2. inspect existing dependencies/fonts;
3. use the nearest appropriate fallback;
4. report the approximation briefly.

Do not silently substitute a distinctive typeface with a generic default.

---

## 6. Images and assets

For each image determine:

```text
aspect ratio
object-fit
object-position
crop
radius
shadow
container size
```

Do not distort images.

Use original assets when available.

---

## 7. Layout

Prefer:

```text
CSS Grid
Flexbox
clamp()
min()
max()
aspect-ratio
container queries when useful
```

Do not reproduce normal page flow using hundreds of absolute coordinates.

Absolute positioning is acceptable for decorative or overlapping elements.

---

## 8. Component structure

Split by meaningful regions.

Example:

```text
Page
├── Navbar
├── Hero
├── Promotions
├── FeaturedProducts
├── Benefits
└── Footer
```

Avoid both extremes:

- one giant page component;
- excessive components for trivial fragments.

---

## 9. Responsive interpolation

Desktop and mobile references are **anchor states**.

Implement a coherent continuum:

```text
mobile reference
↓
small tablet
↓
tablet
↓
small desktop
↓
desktop reference
```

Do not hardcode only two screenshots.

---

## 10. Breakpoints

Choose breakpoints when content actually needs to change, not only from generic defaults.

Validate representative widths:

```text
360
390
430
768
1024
1280
1440
1920
```

Not every width needs a media query.

Prefer fluid sizing where appropriate.

---

## 11. Responsive inference

Examples:

### Desktop two columns → mobile one column

Implement a natural collapse point based on content width.

### Desktop navigation → mobile hamburger

Preserve the mobile behavior.

### Element missing on mobile

Determine whether it is:

- hidden;
- moved;
- collapsed;
- converted to carousel;
- converted to drawer.

Choose the simplest behavior consistent with both references.

Do not remove content just to simplify implementation.

---

## 12. Intermediate widths

Check for:

- awkward wrapping;
- crushed cards;
- oversized empty space;
- bad image crops;
- navigation collisions;
- overflowing buttons;
- inconsistent grids;
- horizontal scrolling.

The result must look intentionally responsive, not merely shrunk.

---

## 13. Project rules

When present, read before implementation:

```text
AGENTS.md
docs/ARQUITECTURA.md
docs/ACCESIBILIDAD_UI.md
docs/RENDIMIENTO_ESCALABILIDAD.md
docs/CONVENCIONES_CODIGO.md
```

Do not break established architecture for pixel matching.

---

## 14. React

For React:

- reuse routing;
- reuse shared components;
- preserve data/state flow;
- avoid unnecessary dependencies;
- separate UI from data access;
- keep components readable.

Do not rewrite unrelated logic.

---

## 15. Motion

If the reference is static, do not invent excessive motion.

When motion is requested:

```text
Motion → normal UI animations
View Transitions → page-to-page continuity
GSAP ScrollTrigger → advanced scroll choreography
```

If corresponding skills are installed, consult them.

Reference fidelity remains the priority.

---

## 16. App-like feel

When the user wants mobile-app-quality interactions, prioritize:

- press states;
- springs;
- shared layout transitions;
- smooth drawers;
- bottom sheets;
- modal continuity;
- polished loading transitions;
- reduced-motion support.

Avoid animation that causes layout jank.

---

## 17. Accessibility

Maintain:

- semantic HTML;
- visible focus;
- keyboard access;
- labels;
- readable contrast;
- usable tap targets;
- reduced motion.

If exact reproduction creates a serious accessibility problem, preserve the visual intent with the smallest necessary correction.

---

## 18. Performance

Avoid:

- huge unoptimized images;
- unnecessary animation engines;
- excessive DOM;
- layout thrashing;
- expensive raw scroll listeners;
- large dependencies for trivial effects.

Prefer `transform` and `opacity` for animation when possible.

---

## 19. Visual QA is mandatory

Do not finish by only reading source code.

Run the app and capture screenshots.

At minimum validate:

```text
desktop reference viewport
mobile reference viewport
```

Also validate intermediate sizes.

---

## 20. Comparison loop

Use:

```text
render
↓
capture
↓
compare
↓
identify biggest mismatch
↓
correct
↓
repeat
```

Fix mismatches in this order:

```text
1. overall geometry
2. section dimensions
3. typography
4. spacing
5. image sizing/crop
6. colors
7. borders/shadows
8. micro-details
```

Do not perfect tiny details while the global geometry is wrong.

---

## 21. Fidelity without brittle code

The result must be:

```text
visually faithful
+
responsive
+
maintainable
```

If it only matches one viewport and breaks nearby, it is not complete.

---

## 22. Do not redesign

Unless explicitly requested, do not:

- add sections;
- change images;
- change copy;
- change colors;
- modernize layout;
- introduce gradients;
- add glassmorphism;
- alter radius;
- invent cards;
- rearrange content.

This skill is for reproduction, not reinterpretation.

---

## 23. Ambiguity

When references leave gaps:

1. preserve what is certain;
2. infer the simplest responsive rule consistent with both;
3. prefer existing project conventions;
4. avoid creative additions.

Ask only when ambiguity materially changes the intended design and cannot be resolved safely.

---

## 24. Shared components

For multiple screens, extract shared visual systems first:

```text
navbar
buttons
inputs
cards
spacing
typography
colors
```

Do not duplicate identical styles page by page.

---

## 25. Priority when references conflict

Use:

```text
latest explicit user instruction
↓
latest provided reference
↓
desktop/mobile pair
↓
existing project design system
↓
reasonable inference
```

---

## 26. Verification checklist

### Fidelity

- [ ] overall composition matches
- [ ] colors match
- [ ] typography matches
- [ ] spacing matches
- [ ] image proportions match
- [ ] alignment matches
- [ ] radii match
- [ ] shadows/borders match

### Responsive

- [ ] desktop reference validated
- [ ] mobile reference validated
- [ ] tablet validated
- [ ] intermediate desktop validated
- [ ] no horizontal overflow
- [ ] no broken wrapping

### Code

- [ ] maintainable components
- [ ] no unnecessary absolute positioning
- [ ] no giant monolithic page file
- [ ] architecture respected
- [ ] no unnecessary dependencies

### Quality

- [ ] build passes
- [ ] lint passes if configured
- [ ] relevant tests pass
- [ ] no new critical console errors
- [ ] reduced motion respected where needed

---

## 27. Completion report

When finished, state briefly:

- what was implemented;
- reference viewport sizes validated;
- unavoidable visual approximations;
- files changed.

Do not claim exact parity unless visual comparison was actually performed.

---

## Recommended companion skills

Works well with:

```text
motion
motion-design
gsap
ui-ux-pro-max
impeccable
```

Those skills help with design/motion quality.

This skill remains the authority for **reference fidelity and responsive reconstruction**.
