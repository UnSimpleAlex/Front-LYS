---
name: Leñas y Sabores — Internal Operations
description: A compact white workspace for connected restaurant tasks by role.
colors:
  primary: "#ed0017"
  workspace: "#ffffff"
  sidebar: "#ffffff"
  sidebar-hover: "#f6f8fb"
  sidebar-text: "#18243b"
  ink: "#10172b"
  heading-ink: "#101216"
  muted: "#62718c"
  line: "#e4e9f1"
  field-line: "#bfc6cf"
  neutral-surface: "#f5f6f7"
  focus: "#2267c2"
  status-green: "#08643e"
  status-amber: "#805600"
  status-blue: "#175d9a"
  status-red: "#b51225"
typography:
  headline:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "clamp(1.6rem, 2.2vw, 2.25rem)"
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.35
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "14px"
  field:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: ".875rem"
    lineHeight: 1.4
  navigation:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: ".875rem"
    fontWeight: 500
  label:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: ".75rem"
  metric:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "1.65rem"
    lineHeight: 1.2
rounded:
  badge: "5px"
  control: "6px"
  summary: "8px"
  panel: "10px"
  dialog: "12px"
spacing:
  tight: "8px"
  compact: "12px"
  standard: "16px"
  panel: "18px"
  section: "20px"
  heading: "24px"
  workspace-inline: "28px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.workspace}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-secondary:
    backgroundColor: "{colors.workspace}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  input:
    backgroundColor: "{colors.workspace}"
    textColor: "{colors.ink}"
    typography: "{typography.field}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  navigation-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.workspace}"
    rounded: "{rounded.control}"
    padding: "12px"
  status-green:
    backgroundColor: "{colors.workspace}"
    textColor: "{colors.status-green}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "4px 7px"
  summary:
    backgroundColor: "{colors.workspace}"
    rounded: "{rounded.summary}"
    padding: "16px"
  panel:
    backgroundColor: "{colors.workspace}"
    rounded: "{rounded.panel}"
    padding: "18px"
  dialog:
    backgroundColor: "{colors.workspace}"
    textColor: "{colors.ink}"
    rounded: "{rounded.dialog}"
    width: "min(620px, calc(100vw - 32px))"
---

# Design System: Leñas y Sabores — Internal Operations

## Overview

**Creative North Star: "Operate workspace"**

Operate workspace makes pending restaurant work visible and actionable. A white navigation rail anchors white, compact work surfaces; concise titles, summaries and lists place task context ahead of decoration.

This system applies only to internal administration, kitchen, floor, cash and delivery screens. PRODUCT.md supplies the durable requirements: sidebar navigation, white backgrounds, no textures or decorative copy, readable controls and modal editors. Public pages retain their own system. The interaction sequence is choose an area, inspect work and status, act in a modal, receive feedback and retain context.

**Key Characteristics:**

- White work surfaces with neutral borders.
- White navigation with a pale red active item, red indicator and red primary actions.
- One practical sans-serif and consistent SVG line icons.
- Compact summaries, semantic lists and viewport-safe modal editors.

## Colors

The palette combines white navigation, white task surfaces, vivid red actions and readable state labels. Frontmatter holds the normative values extracted from the finished source.

### Primary

- **Operational Red:** Primary action fill, active area navigation, selected table borders and urgency.
- **Focus Blue:** Keyboard outline, distinct from primary action color.
- **State Green / Amber / Blue / Red:** Readable labels and subtle tinted backgrounds for completion, pending work, progress and problems.

### Neutral

- **White Sidebar / Neutral Hover / Navy Sidebar Text:** Rail, navigation hover and inactive labels.
- **Workspace White:** Content, panels, inputs, summaries and modal body.
- **Ink / Heading Ink / Muted:** Main content, inherited strong/heading text and supporting text.
- **Neutral Line / Field Line:** Structural dividers and field borders.
- **Neutral Surface:** Quiet grouping for totals, order notes and kitchen columns.

**The Action Accent Rule.** Reserve the primary red for primary actions, active navigation, selection and urgent states; keep ordinary surfaces white.

**The Status With Words Rule.** Pair status color with a readable state label; use labeled green, amber, blue and red badges with subtle backgrounds.

## Typography

**Body and Heading Font:** DM Sans, with Arial and sans-serif fallbacks. One practical family carries the internal interface.

### Hierarchy

- **Headline:** Page title, shrinking to (1.5rem) at the mobile breakpoint.
- **Title:** Panel heading; modal headings use (1.2rem).
- **Body:** Task content; concise page descriptions use (.9375rem).
- **Field / Navigation:** Editable values and area labels.
- **Label:** State badges and compact mobile summary labels.
- **Metric:** Desktop summary value; mobile values use (1.25rem) and remain on one line.

**The One Working Voice Rule.** Use DM Sans for internal headings and controls. No display typography, ornamental headings or decorative copy.

## Layout

The fixed desktop rail is (280px), narrowing to (200px) at viewport widths up to (1100px). The white workspace begins alongside it; desktop notifications are accessible through the account dialog, leaving the page title and main action at the top. Content is capped at (1920px), with default padding (24px 28px 40px), (20px) on narrower desktops and (24px 30px 48px) from (1600px).

At (900px) and below, the rail becomes a native modal drawer (min(320px, 90vw)), full viewport height. The menu comes first in the toolbar, before notifications and account. At (540px), content uses (18px 12px 32px), panels use (14px), and summary cards use two columns with hidden icons and compact values. Only below (300px) do summaries become one column. Use the actual final cascade, rather than earlier superseded breakpoints.

Desktop summaries normally use four columns; five-summary groups use five columns and reduce to three at (1200px), then two on mobile. Task lists use semantic tables with headings that become visible cell labels in card layouts. Responsive layout also considers list width and column count. The waiter recent-order table retains compact table form from (1100px). Kitchen columns become two across at intermediate desktop sizes; incoming kitchen auxiliary summaries move below the list at (1500px) and stack at (700px).

Detail and editing dialogs have a maximum height of (calc(100dvh - 32px)); a sticky header keeps the close action available. Generic forms use two columns from (700px) and one on smaller screens. Product dialogs use up to (1180px), with image and publication controls on the left and editable fields on the right; their layout collapses to one column at (900px). On exceptionally narrow viewports (340px and below), dialog width leaves a (16px) total horizontal gutter.

**The Retained Context Rule.** Open detail and edit work in a modal over the current list; close back to the launching control and preserve the area context.

## Elevation & Depth

**The Flat Work Surface Rule.** Panels and summaries have neutral borders and no shadow; depth belongs to the modal and its blocking backdrop.

The modal uses a diffuse structural shadow (0 20px 80px #0004), a neutral border and backdrop (#11182799). Native modal behavior supplies the top layer; the background cannot receive keyboard interaction. Focus uses a blue (3px) outline with (3px) offset.

## Shapes

Modest rounded corners distinguish compact status badges, controls, summary cards, panels and dialogs. Borders are normally (1px); selected salon table cards use a red (2px) border. The navigation drawer has square outer edges. Status dots remain circular; they supplement written labels. SVG line icons share a consistent vocabulary; button icons are (19px).

## Components

### Buttons

Primary buttons use red and white; secondary actions use white with a neutral border. Shared controls have minimum height (38px), padding (8px 12px) and radius (6px); content can wrap. Buttons inherit the operational font and use weight (600). Shared hover changes the border to the legacy interaction red (#ed0017); rail hover uses a light neutral fill. Disabled actions use opacity (.5) and a not-allowed cursor. Switches are intentionally smaller specialized controls (44px by 24px).

### Chips

Status badges use subtle semantic backgrounds, radius (20px) and padding (5px 10px), with explicit words. Completion and paid states are green; pending or reserved states amber; ready and travelling states blue; errors and low stock red.

### Cards / Containers

Panels are white, flat, neutral-bordered and rounded (10px), padded (18px); summaries use radius (8px), padding (16px) and gap (14px) between icon and value group. Mobile summaries are at least (76px) tall and padded (12px). Kitchen tickets use radius (6px), padding (12px), with compact headings. Salon table cards use a simple flat rectangle; ornamental chairs are suppressed.

### Inputs / Fields

Fields are white with neutral strokes, radius (6px), padding (10px 12px) and readable muted placeholders. Labels remain present; native form semantics support validation. Modal validation feedback is a red outlined message with an alert role.

### Navigation

The white rail uses line icons, left-aligned labels, a (12px) item gap and a pale red active fill with a red left indicator. Account access remains at the bottom of the desktop rail. Mobile navigation is a labeled native dialog, with readable ink on white and the same red active state.

### Modal Editor and Feedback

Native dialogs have a labeled title, explicit close button, Escape handling, body scroll lock and focus restoration to the initiating control. Editors keep the underlying list context. Success and error feedback use white backgrounds and green or red outlines. Reduced-motion preferences disable operational animation and transitions.

**The Readable Control Rule.** Keep labels, units and currency readable; wrap content and adapt lists before reducing essential control text.

## Do's and Don'ts

### Do:

- **Do** keep internal workspace backgrounds white and navigation white.
- **Do** use red for active navigation and primary actions, with labeled semantic statuses.
- **Do** keep summaries compact, controls labeled, keyboard focus visible and modal editors within the viewport.
- **Do** preserve product imagery and payment imagery when they identify real task content.
- **Do** retain semantic table headings when rows adapt into labeled cards.

### Don't:

- **Don't** add textures, decorative panel fills, display fonts or unnecessary decoration to internal screens.
- **Don't** move edit forms into a permanent side column.
- **Don't** truncate essential labels, values or currency units.
- **Don't** communicate status by color alone.
- **Don't** extend this internal design system into public pages.


## Product reference workflows

Products show seven rows per page, real counts, search by name or SKU, category/availability/branch filters, filtered CSV export and selection actions. Desktop tables retain compact cells from 1200px; narrower lists become labeled cards. Descriptions are summaries; full copy remains available in the detail modal.

Details have description, ingredients, commercial information and last-update tabs. Editing supports gallery uploads (5 MB limit), SKU, stock, branch, preparation time, ingredients, observations and channel metadata. Existing products remain compatible with optional metadata. Preview retains the unsaved form. Deactivation is reversible and requires an explicit confirmation; existing orders and payments remain intact. No monthly trends or unrecorded update dates are invented.

## Reference polish

The desktop sidebar expands to 295px from 1450px, with larger navigation icons and an account avatar. Product tables use 14px text, category-specific icons, a bulk state selector, applied category/availability/branch filters and arrow pagination. The detail dialog opens on ingredients, with icon-led facts and grouped preparation/gallery cards. The editor includes an accessible availability switch, image removal, currency/time affixes and an available last-update timestamp. Deactivation keeps the same reversible behavior with a richer summary and explicit explanation.

Compact density: sidebar entries use 44px minimum height and 22px icons. Desktop summary cards use 40px icons, 12px vertical padding and 26px values; product summaries switch to two columns at 1200px. The primary creation button uses a single circled-plus SVG and a 44px minimum height. Short desktop screens scroll the navigation inside the sidebar while keeping the account accessible.
