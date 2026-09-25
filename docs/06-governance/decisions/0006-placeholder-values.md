---
title: "ADR-0006: Placeholder values for TBD tokens"
slug: adr-0006-placeholder-values
layer: adr
status: draft
lang: en
brandRules: []
tbd: [TBD-01, TBD-02, TBD-03, TBD-04, TBD-05, TBD-06, TBD-07, TBD-09, TBD-10, TBD-11, TBD-12, TBD-13, TBD-14, TBD-15, TBD-16]
related: [adr-0001-nuxt-ui-spike, adr-0003-style-dictionary-dtcg-spike, adr-0004-mjml-email-spike, adr-0005-baseline-assumptions-and-conflicts]
since: 0.1.0
updated: 2026-09-25
---

# ADR-0006: Placeholder values for TBD tokens

## Context

SPEC.md §2.4 lists the brand values that no source defines (TBD-01 to TBD-21). The token pipeline, the Nuxt UI theme, and the email build still need *some* value for each token so they can build and render. SPEC.md §4.4 sets the rule:

> `_placeholder.json` holds one set of deliberately non-brand placeholder values, and every one of them has status `tbd`. Colors use a single neutral placeholder. Dimensions use the Nuxt UI default the component would have anyway. These placeholder values are recorded in ADR-0006 (T0.5) and are never described as brand values.

Risk R-11 is that placeholders get mistaken for brand values and copied into other projects. This ADR lists every placeholder value explicitly, with its source, so T3.2 can write `tokens/primitive/_placeholder.json` from this table and nothing else.

Sources used:

- **Nuxt UI 4.11.2** and **Tailwind CSS 4.3.3**, the versions pinned in ADR-0001, read from `spikes/0001-nuxt-ui/` (`@nuxt/ui` theme definitions and `dist/runtime/index.css`, Tailwind `theme.css`, and the spike's built CSS).
- **The owner in chat, 2026-09-25**, for the single neutral color: Nuxt UI's default neutral scale (`slate`), shade 400. SPEC.md §4.4 names no color value, so the owner chose it.

TBD-08 (brand tints and shades) has no placeholder here. C-06 covers it: every Nuxt UI alias shade is the single brand hex with status `derived-pending` (ADR-0001 §3, ADR-0005). TBD-17 to TBD-21 are artwork, icon, imagery, and voice items, not token values. REQ-030 AC2 and the TBD callouts cover them.

## Decision

### 1. Policy

1. Every value in the table in section 2 is **not a brand value**. It exists only so the system can build while the TBD item is open.
2. T3.2 writes exactly these values into `tokens/primitive/_placeholder.json`, at the paths given. Every placeholder token has `$extensions.cn.status: "tbd"`, and its `$description` starts with `Placeholder, not a brand value.` and names the TBD IDs it stands in for.
3. A TBD token in any other primitive group references one of these placeholders. It never holds a raw copy of the value.
4. No doc, showcase page, changelog, or package README may describe a placeholder as a brand value. The showcase shows a hatched overlay and a `TBD-NN` badge on every preview that uses one (REQ-054 AC4).
5. A placeholder value changes only through a new ADR that supersedes this one. Resolving a TBD item does **not** edit a placeholder: the owner supplies the brand value, a new ADR records it, the token stops referencing the placeholder and becomes `stable`, and SPEC.md §2.4 marks the row resolved (SPEC.md §4.4). A placeholder that no token references any more is deleted.
6. T3.2 may choose the DTCG `$type` of each placeholder may split a composite value into DTCG parts, and may rename a path segment that fails the REQ-017 AC2 naming pattern (for example `2xl`). It may not change a value.

### 2. Placeholder values

Every row below is labeled **not a brand value**.

#### Color (the single neutral placeholder)

| Path in `_placeholder.json` | Value | Source | Stands in for | Label |
|---|---|---|---|---|
| `placeholder.color.neutral` | `#90a1b9` | Tailwind 4.3.3 `--color-slate-400: oklch(70.4% 0.04 256.788)`, converted to 8-bit sRGB hex. `slate` is Nuxt UI's default `neutral` alias (ADR-0001 §2). Chosen by the owner in chat, 2026-09-25. | TBD-04 (`color.text.default`), TBD-05 (`color.neutral.*`), TBD-06 (`color.surface.*`), TBD-07 (`color.feedback.*`), TBD-16 (focus indicator color) | not a brand value |

The value is stored as hex, not OKLCH, because the email output resolves to literals for email clients (REQ-013 AC1, §4.9).

Measured with the WCAG 2.x relative-luminance formula, for information only: `#90a1b9` on `#000000` is 7.98:1, and `#ffffff` on `#90a1b9` is 2.63:1. Under REQ-015 AC4, any pair that uses this placeholder is reported as "unverified", not as passing.

C-05 still applies: until OD-05 is decided, cards render on `color.bg.base` (`#000000`), not on `color.surface.card`. The surface token references this placeholder only so the token exists and builds.

#### Typography

| Path in `_placeholder.json` | Value | Source | Stands in for | Label |
|---|---|---|---|---|
| `placeholder.font.family.sans` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | Tailwind 4.3.3 `--font-sans`, which Nuxt UI uses when `ui.fonts: false` (ADR-0001 Consequences) | TBD-01 (`font.family.display`), TBD-02 (`font.family.body`) | not a brand value |
| `placeholder.font.size.h1` | `2.25rem` | Nuxt UI prose `h1`: `text-4xl` | TBD-03 | not a brand value |
| `placeholder.font.lineHeight.h1` | `2.5rem` | Tailwind `--text-4xl--line-height: calc(2.5 / 2.25)` at 2.25rem | TBD-03 | not a brand value |
| `placeholder.font.weight.h1` | `700` | Nuxt UI prose `h1`: `font-bold` | TBD-03 | not a brand value |
| `placeholder.font.size.h2` | `1.5rem` | Nuxt UI prose `h2`: `text-2xl` | TBD-03 | not a brand value |
| `placeholder.font.lineHeight.h2` | `2rem` | Tailwind `--text-2xl--line-height: calc(2 / 1.5)` at 1.5rem | TBD-03 | not a brand value |
| `placeholder.font.weight.h2` | `700` | Nuxt UI prose `h2`: `font-bold` | TBD-03 | not a brand value |
| `placeholder.font.size.h3` | `1.25rem` | Nuxt UI prose `h3`: `text-xl` | TBD-03 | not a brand value |
| `placeholder.font.lineHeight.h3` | `1.75rem` | Tailwind `--text-xl--line-height: calc(1.75 / 1.25)` at 1.25rem | TBD-03 | not a brand value |
| `placeholder.font.weight.h3` | `700` | Nuxt UI prose `h3`: `font-bold` | TBD-03 | not a brand value |
| `placeholder.font.size.body` | `1rem` | Tailwind `--text-base`; Nuxt UI prose `p` sets no size | TBD-03 | not a brand value |
| `placeholder.font.lineHeight.body` | `1.75rem` | Nuxt UI prose `p`: `leading-7` (7 × `--spacing` 0.25rem) | TBD-03 | not a brand value |
| `placeholder.font.weight.body` | `400` | Tailwind `--font-weight-normal`; Nuxt UI prose `p` sets no weight | TBD-03 | not a brand value |
| `placeholder.font.size.caption` | `0.875rem` | Tailwind `--text-sm`, which Nuxt UI uses for description slots (for example `description: "… text-muted text-sm"`) | TBD-03 | not a brand value |
| `placeholder.font.lineHeight.caption` | `1.25rem` | Tailwind `--text-sm--line-height: calc(1.25 / 0.875)` at 0.875rem | TBD-03 | not a brand value |
| `placeholder.font.weight.caption` | `400` | Tailwind `--font-weight-normal`; the description slots set no weight | TBD-03 | not a brand value |
| `placeholder.font.letterSpacing` | `0em` | Tailwind `--tracking-normal`; Nuxt UI prose `h1` to `h3` and `p` set no tracking | TBD-03 | not a brand value |

#### Spacing, shape, and line work

| Path in `_placeholder.json` | Value | Source | Stands in for | Label |
|---|---|---|---|---|
| `placeholder.space.base` | `0.25rem` | Tailwind `--spacing` (the base unit of every Nuxt UI padding and gap class) | TBD-09 (`space.*`) | not a brand value |
| `placeholder.radius.sm` | `0.25rem` | Nuxt UI `--ui-radius`; `--radius-sm: var(--ui-radius)`, used by `UTooltip` (`rounded-sm`) | TBD-10 (`radius.*`) | not a brand value |
| `placeholder.radius.md` | `0.375rem` | Nuxt UI `--radius-md: calc(var(--ui-radius) * 1.5)`, used by `UButton` and `UInput` (`rounded-md`) | TBD-10 | not a brand value |
| `placeholder.radius.lg` | `0.5rem` | Nuxt UI `--radius-lg: calc(var(--ui-radius) * 2)`, used by `UCard` and `UModal` (`rounded-lg`) | TBD-10 | not a brand value |
| `placeholder.border.width` | `1px` | Nuxt UI outlines use Tailwind `ring`, which is `calc(1px + var(--tw-ring-offset-width))` with a zero offset | TBD-11 (`border.width.*`) | not a brand value |

#### Effects, elevation, and layering

| Path in `_placeholder.json` | Value | Source | Stands in for | Label |
|---|---|---|---|---|
| `placeholder.effect.glow` | `none` | Nuxt UI's `UButton` theme has no shadow or glow class | TBD-12 (`effect.glow.*`) | not a brand value |
| `placeholder.elevation.overlay` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Tailwind `--shadow-lg`, used by `UModal` and `USlideover` (`shadow-lg`) | TBD-15 (`elevation.*`) | not a brand value |
| `placeholder.z.overlay` | `auto` | Nuxt UI sets no z-index on `UModal` or `USlideover`; they stack by portal order | TBD-15 (`z.*`) | not a brand value |
| `placeholder.z.toast` | `100` | Nuxt UI toaster viewport: `z-[100]` | TBD-15 (`z.*`) | not a brand value |

#### Focus

| Path in `_placeholder.json` | Value | Source | Stands in for | Label |
|---|---|---|---|---|
| `placeholder.focus.width` | `3px` | Nuxt UI `UButton`: `focus-visible:outline-3` | TBD-16 (`focus.*`) | not a brand value |
| `placeholder.focus.offset` | `0` | Nuxt UI base CSS: `a:focus-visible { outline-offset: 0 }`; `UButton` sets no offset | TBD-16 | not a brand value |
| `placeholder.focus.style` | `solid` | Tailwind `outline-3` sets `outline-style: solid` by default | TBD-16 | not a brand value |

The focus color is `placeholder.color.neutral`. Nuxt UI's own default is `outline-primary/25`, a translucent tint of the brand pink. Using it would derive a new color from BR-01, which C-06 does not allow without approval, and §4.4 says colors use the single neutral placeholder.

#### Motion

| Path in `_placeholder.json` | Value | Source | Stands in for | Label |
|---|---|---|---|---|
| `placeholder.motion.duration` | `150ms` | Tailwind `--default-transition-duration`, used by Nuxt UI `transition-colors` | TBD-14 (`motion.*`) | not a brand value |
| `placeholder.motion.easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Tailwind `--default-transition-timing-function` | TBD-14 | not a brand value |

#### Breakpoints and containers

| Path in `_placeholder.json` | Value | Source | Stands in for | Label |
|---|---|---|---|---|
| `placeholder.breakpoint.sm` | `40rem` | Tailwind `--breakpoint-sm` | TBD-13 (`breakpoint.*`) | not a brand value |
| `placeholder.breakpoint.md` | `48rem` | Tailwind `--breakpoint-md` | TBD-13 | not a brand value |
| `placeholder.breakpoint.lg` | `64rem` | Tailwind `--breakpoint-lg` | TBD-13 | not a brand value |
| `placeholder.breakpoint.xl` | `80rem` | Tailwind `--breakpoint-xl` | TBD-13 | not a brand value |
| `placeholder.breakpoint.2xl` | `96rem` | Tailwind `--breakpoint-2xl` | TBD-13 | not a brand value |
| `placeholder.container.max` | `80rem` | Nuxt UI `--ui-container` | TBD-13 (container widths) | not a brand value |

The 360 px minimum layout width is fixed by ER-05 and is not a placeholder. The test viewports stay at 360, 768, and 1280 px (A-09).

## Consequences

- T3.2 has a complete, sourced list for `_placeholder.json`, and `check:tbd` can list every TBD-03 to TBD-16 token as referencing one of these paths.
- Because the dimension placeholders equal the Nuxt UI 4.11.2 defaults, the themed components look like stock Nuxt UI apart from the three brand colors. The TBD overlays in the showcase make clear that this is unfinished, not a design choice.
- The email build (T10.x) resolves these placeholders to literals through `email-tokens.json`, which replaces the MJML defaults noted in ADR-0004. Whether `rem` values need converting to `px` for email clients is left to the email tasks; it does not change any value here.
- Upgrading Nuxt UI or Tailwind (a new ADR, R-01) does not change these values automatically. The upgrade ADR states whether the placeholders follow the new defaults.
- Revisit this ADR whenever the owner resolves a TBD item, to delete placeholders that no token references any more.
