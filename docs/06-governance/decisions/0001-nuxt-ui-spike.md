---
title: "ADR-0001: Nuxt UI version, theming, and dark mode"
slug: adr-0001-nuxt-ui-spike
layer: adr
status: draft
lang: en
brandRules: [BR-01, BR-03]
tbd: [TBD-08, TBD-16]
related: []
since: 0.1.0
updated: 2026-09-24
---

# ADR-0001: Nuxt UI version, theming, and dark mode

## Context

SPEC.md §4.7 and §4.10 leave the Nuxt UI theme variable names, `app.config` keys, and component names to be confirmed against a pinned version. C-06 depends on whether color aliases need shade scales, and C-01 depends on whether Nuxt UI has header and footer components. REQ-020 (Option A) and REQ-031 (dark only) depend on these answers.

Task T0.1 built the smallest possible spike in `spikes/0001-nuxt-ui/`:

- `layer/` stands in for `packages/nuxt`. It registers `@nuxt/ui`, loads `layer/app/assets/css/main.css`, sets the color alias in `layer/app/app.config.ts`, and forces dark mode.
- The root app stands in for a consumer. Its `nuxt.config.ts` contains only `extends: ['./layer']` and renders one `UButton color="primary" variant="solid"`.
- `verify.mjs` starts the production SSR server (`.output/server/index.mjs`) and checks the server HTML. It then reads computed styles in Microsoft Edge through `playwright-core`, once with JavaScript disabled (server HTML only) and once hydrated.

Versions used by the spike: Node 24.19.0 (LTS, per A-03), pnpm 12.6.0, `nuxt` 4.5.2, `@nuxt/ui` 4.11.2, `tailwindcss` 4.3.3, and `playwright-core` 1.63.0.

## Decision

### 1. Pinned version and license

Pin `@nuxt/ui` to exactly **4.11.2**, which is licensed **MIT** (its `package.json` declares `"license": "MIT"`). It requires `nuxt >=4.1.0`; the spike used `nuxt` 4.5.2. Tailwind CSS v4 (4.3.3) is used through the `@tailwindcss/vite` plugin, which the Nuxt UI module adds itself. Any upgrade is its own task with a new ADR (R-01).

### 2. Theme variables and configuration keys

**Module options** (`nuxt.config.ts`, key `ui`): `prefix` (default `U`), `fonts` (default `true`, loads `@nuxt/fonts`), `colorMode` (default `true`, loads `@nuxtjs/color-mode`), `theme.colors` (the alias list; default `primary`, `secondary`, `success`, `info`, `warning`, `error`), `theme.transitions`, `theme.defaultVariants`, `theme.prefix`, `theme.unstyled`, and `prose`, `mdc`, `content`.

**App config** (`app.config.ts`, key `ui`):

- `ui.colors.<alias>` takes the *name* of a color scale, not a value. Defaults: `primary: 'green'`, `secondary: 'blue'`, `success: 'green'`, `info: 'blue'`, `warning: 'yellow'`, `error: 'red'`, `neutral: 'slate'`.
- `ui.<component>` overrides the component theme, using the keys `slots`, `variants`, `compoundVariants`, and `defaultVariants`. For example, `ui.button.slots.base` and the `compoundVariants` entry for `{ color: 'primary', variant: 'solid' }`. The generated defaults are in `.nuxt/ui/<component>.ts`.
- `ui.icons` sets the icon names that components use.

**CSS variables.** Nuxt UI puts all of these in `@layer theme`.

| Variable | Set by | Meaning |
|---|---|---|
| `--ui-color-<alias>-{50,100,200,300,400,500,600,700,800,900,950}` | The colors plugin, from `ui.colors` | `var(--color-<scale>-<shade>, <tailwind fallback>)` |
| `--ui-<alias>` (e.g. `--ui-primary`) | The colors plugin | Shade **500** under `:root`/`.light`, shade **400** under `.dark` |
| `--ui-text-dimmed`, `--ui-text-muted`, `--ui-text-toned`, `--ui-text`, `--ui-text-highlighted`, `--ui-text-inverted` | `@nuxt/ui` CSS | Text roles; in `.dark` they point at `--ui-color-neutral-*` |
| `--ui-bg`, `--ui-bg-muted`, `--ui-bg-elevated`, `--ui-bg-accented`, `--ui-bg-inverted` | `@nuxt/ui` CSS | Background roles; in `.dark`, `--ui-bg` is `--ui-color-neutral-900` |
| `--ui-border`, `--ui-border-muted`, `--ui-border-accented`, `--ui-border-inverted` | `@nuxt/ui` CSS | Border roles |
| `--ui-radius` | `@nuxt/ui` CSS | Base radius; Tailwind `--radius-xs` … `--radius-3xl` are multiples of it |
| `--ui-container`, `--ui-header-height` | `@nuxt/ui` CSS | Layout widths |

Tailwind utilities map to these variables. For example, `bg-primary` reads `--ui-primary`, `text-inverted` reads `--ui-text-inverted`, and `bg-default` reads `--ui-bg`. The solid primary button uses the classes `text-inverted bg-primary hover:bg-primary/75 … outline-primary/25 focus-visible:outline-3`.

**Pattern proven by the spike.** `main.css` imports `tailwindcss` and `@nuxt/ui`, defines `--cn-*` custom properties (standing in for `dist/css/tokens.css`), and declares a Tailwind scale inside `@theme static` whose steps are `var(--cn-*)`. `app.config.ts` then points the alias at that scale (`ui.colors.primary = 'cn-pink'`).

### 3. Color aliases require full shade scales (feeds C-06 and OD-04)

**Yes.** Each alias reads all 11 shades (`50` … `950`) of the scale it names. `--ui-<alias>` uses shade 500 in light mode and **400 in dark mode**, and component classes add opacity modifiers on top (for example `/75`, `/25`, `/10`). The spike follows the C-06 default: every step of `--color-cn-pink-*` is `var(--cn-color-brand-primary)`, the single BR-01 hex, which REQ-014 would mark `derived-pending`. No tint or shade was generated. TBD-08 and OD-04 stay open.

### 4. How dark mode is forced (REQ-031)

In the layer's `nuxt.config.ts`:

- `ui.colorMode: false`. This stops Nuxt UI from installing `@nuxtjs/color-mode`, so the `UColorModeButton`, `UColorModeSelect`, `UColorModeSwitch`, `UColorModeAvatar`, and `UColorModeImage` components are never registered. `useColorMode()` becomes a stub that returns `{ forced: true }`. There is no toggle and no stored preference.
- `app.head.htmlAttrs.class = 'dark'`. The server renders `<html class="dark">`, so the dark variables apply before any JavaScript runs and there is no flash.

Nuxt UI's CSS defines `@variant dark (&:where(.dark, .dark *))`, so the `.dark` class is all it needs.

### 5. Layers work under SSR

**Yes.** The production server HTML contains `<html class="dark">`, the themed button, and the colors `<style>` that maps `--ui-color-primary-*` to `--color-cn-pink-*`. The generated `ui.css` adds `@source` entries for both the app and `layer/app/`, so Tailwind scans classes used inside the layer.

`verify.mjs` result:

```text
PASS  SSR html has class="dark"
PASS  SSR html contains the layer-themed button
PASS  SSR html maps primary alias to cn-pink scale
PASS  No color-mode component rendered
PASS  button background = BR-01 pink (JS off, SSR only)  [rgb(239, 128, 174)]
PASS  <html> is dark (JS off)
PASS  button background = BR-01 pink (JS on, hydrated)  [rgb(239, 128, 174)]
PASS  <html> is dark (JS on)
```

### 6. Confirmed component names for §4.10

Every provisional name in §4.10 exists in `@nuxt/ui` 4.11.2 with the default `U` prefix: `UButton`, `ULink`, `UIcon`, `UBadge`, `UInput`, `UTextarea`, `USelect`, `UCheckbox`, `URadioGroup`, `USwitch`, `UProgress`, `USkeleton`, `USeparator`, `UFormField`, `UCard`, `UAlert`, `UToast`, `UTooltip`, `UTabs`, `UBreadcrumb`, `UPagination`, `UModal`, and `USlideover`.

Toasts are shown with the `useToast()` composable and need the app wrapped in `UApp`, which also provides the tooltip and overlay context. The spike wraps its root in `UApp`.

### 7. Header and footer components exist

**Yes.** `@nuxt/ui` 4.11.2 ships `UHeader` (`Header.vue`) and `UFooter` (`Footer.vue`, plus `UFooterColumns`) under the same MIT package. Following §4.10 and C-01, `site-header` and `site-footer` become `source: nuxt-ui`, implemented as themed `UHeader` and `UFooter`, not `CnSiteHeader` and `CnSiteFooter`. The custom `Cn*` set therefore shrinks to the logo, the decorative motifs, and the featured media card. Amending §4.10 and C-01 to match is the owner's call (SPEC.md §8).

## Consequences

- `packages/nuxt` copies the spike's pattern (T5.1): `main.css` imports `tokens.css` and declares `@theme static` scales that reference `--cn-*` variables, `app.config.ts` sets `ui.colors`, and `nuxt.config.ts` sets `ui.colorMode: false` plus `htmlAttrs.class = 'dark'`.
- Until OD-04 is decided, every alias scale is 11 copies of one brand hex. Opacity modifiers in Nuxt UI's default classes (`hover:bg-primary/75`, `bg-primary/10`, `outline-primary/25`) then produce translucent brand colors. Whether those defaults stay is decided in the button and focus work (T4.4, T7.2, TBD-16), not here.
- Nuxt UI's dark defaults point `--ui-bg` at neutral-900 and `--ui-text-inverted` at neutral-900. The layer must remap `--ui-bg` to `--cn-color-bg-base` (REQ-012) and `--ui-text-inverted` to black for labels on pink fills (§2.1 derived facts). Both are the pure black of BR-03, so no new value is needed.
- `ui.fonts: false` keeps `@nuxt/fonts` from fetching a default typeface until TBD-01 is resolved.
- The spike uses `playwright-core` with the locally installed Edge only to gather evidence. The real test stack (ER-06) is set up in P1. `spikes/` is deleted in T1.1.
- Revisit this ADR when upgrading `@nuxt/ui` past 4.11.2, or if `@nuxtjs/color-mode` becomes required by another module.
