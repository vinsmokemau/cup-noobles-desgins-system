---
title: Color
slug: color
layer: foundation
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-06]
tokens: [color]
tbd: []
related: [accessibility, effects, typography, card, button]
since: 0.1.0
updated: 2026-10-18
---

# Color

## Purpose

This doc defines the Cup Noobles color palette: the three brand colors and their roles, the pure-black page base, and the contrast rules that keep the UI legible. It implements BR-01, BR-02, and BR-03, and supports BR-06 ("high-contrast, vibrant, and legible"). The text, neutral, and feedback colors come from the owner (ADR-0032), the surface colors from ADR-0053, and the shades from ADR-0055.

## Tokens and specs

<!-- cn:generated tokens="color" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `color.bg.base` | `--cn-color-bg-base` | `#000000` | stable |
| `color.border.default` | `--cn-color-border-default` | `#8c8c8c` | stable |
| `color.border.divider` | `--cn-color-border-divider` | `#3a3a3a` | stable |
| `color.brand.black` | `--cn-color-brand-black` | `#000000` | stable |
| `color.brand.pink` | `--cn-color-brand-pink` | `#ef80ae` | stable |
| `color.brand.pink-100` | `--cn-color-brand-pink-100` | `#fea0c5` | stable |
| `color.brand.pink-200` | `--cn-color-brand-pink-200` | `#fea0c5` | stable |
| `color.brand.pink-300` | `--cn-color-brand-pink-300` | `#fea0c5` | stable |
| `color.brand.pink-400` | `--cn-color-brand-pink-400` | `#ef80ae` | stable |
| `color.brand.pink-50` | `--cn-color-brand-pink-50` | `#fea0c5` | stable |
| `color.brand.pink-500` | `--cn-color-brand-pink-500` | `#d06c96` | stable |
| `color.brand.pink-600` | `--cn-color-brand-pink-600` | `#d06c96` | stable |
| `color.brand.pink-700` | `--cn-color-brand-pink-700` | `#d06c96` | stable |
| `color.brand.pink-800` | `--cn-color-brand-pink-800` | `#d06c96` | stable |
| `color.brand.pink-900` | `--cn-color-brand-pink-900` | `#d06c96` | stable |
| `color.brand.pink-950` | `--cn-color-brand-pink-950` | `#d06c96` | stable |
| `color.brand.primary` | `--cn-color-brand-primary` | `#ef80ae` | stable |
| `color.brand.primaryActive` | `--cn-color-brand-primary-active` | `#d06c96` | stable |
| `color.brand.primaryHover` | `--cn-color-brand-primary-hover` | `#fea0c5` | stable |
| `color.brand.secondary` | `--cn-color-brand-secondary` | `#fff488` | stable |
| `color.brand.secondaryActive` | `--cn-color-brand-secondary-active` | `#dacf6d` | stable |
| `color.brand.secondaryHover` | `--cn-color-brand-secondary-hover` | `#fff7a3` | stable |
| `color.brand.yellow` | `--cn-color-brand-yellow` | `#fff488` | stable |
| `color.brand.yellow-100` | `--cn-color-brand-yellow-100` | `#fff7a3` | stable |
| `color.brand.yellow-200` | `--cn-color-brand-yellow-200` | `#fff7a3` | stable |
| `color.brand.yellow-300` | `--cn-color-brand-yellow-300` | `#fff7a3` | stable |
| `color.brand.yellow-400` | `--cn-color-brand-yellow-400` | `#fff488` | stable |
| `color.brand.yellow-50` | `--cn-color-brand-yellow-50` | `#fff7a3` | stable |
| `color.brand.yellow-500` | `--cn-color-brand-yellow-500` | `#dacf6d` | stable |
| `color.brand.yellow-600` | `--cn-color-brand-yellow-600` | `#dacf6d` | stable |
| `color.brand.yellow-700` | `--cn-color-brand-yellow-700` | `#dacf6d` | stable |
| `color.brand.yellow-800` | `--cn-color-brand-yellow-800` | `#dacf6d` | stable |
| `color.brand.yellow-900` | `--cn-color-brand-yellow-900` | `#dacf6d` | stable |
| `color.brand.yellow-950` | `--cn-color-brand-yellow-950` | `#dacf6d` | stable |
| `color.feedback.error` | `--cn-color-feedback-error` | `#ff5c5c` | stable |
| `color.feedback.info` | `--cn-color-feedback-info` | `#5cc8ff` | stable |
| `color.feedback.success` | `--cn-color-feedback-success` | `#34d399` | stable |
| `color.feedback.warning` | `--cn-color-feedback-warning` | `#ff9f43` | stable |
| `color.glow.pink.hover` | `--cn-color-glow-pink-hover` | `rgba(239, 128, 174, 0.8509803921568627)` | stable |
| `color.glow.pink.rest` | `--cn-color-glow-pink-rest` | `rgba(239, 128, 174, 0.6)` | stable |
| `color.glow.yellow.hover` | `--cn-color-glow-yellow-hover` | `rgba(255, 244, 136, 0.8509803921568627)` | stable |
| `color.glow.yellow.rest` | `--cn-color-glow-yellow-rest` | `rgba(255, 244, 136, 0.6)` | stable |
| `color.neutral.grey-dark` | `--cn-color-neutral-grey-dark` | `#5c5c5c` | stable |
| `color.neutral.grey-deep` | `--cn-color-neutral-grey-deep` | `#3a3a3a` | stable |
| `color.neutral.grey-light` | `--cn-color-neutral-grey-light` | `#bdbdbd` | stable |
| `color.neutral.grey-mid` | `--cn-color-neutral-grey-mid` | `#8c8c8c` | stable |
| `color.neutral.white-soft` | `--cn-color-neutral-white-soft` | `#f5f5f5` | stable |
| `color.signal.blue` | `--cn-color-signal-blue` | `#5cc8ff` | stable |
| `color.signal.green` | `--cn-color-signal-green` | `#34d399` | stable |
| `color.signal.orange` | `--cn-color-signal-orange` | `#ff9f43` | stable |
| `color.signal.red` | `--cn-color-signal-red` | `#ff5c5c` | stable |
| `color.surface.card` | `--cn-color-surface-card` | `#000000` | stable |
| `color.surface.elevated` | `--cn-color-surface-elevated` | `#000000` | stable |
| `color.text.default` | `--cn-color-text-default` | `#f5f5f5` | stable |
| `color.text.disabled` | `--cn-color-text-disabled` | `#5c5c5c` | stable |
| `color.text.inverted` | `--cn-color-text-inverted` | `#000000` | stable |
| `color.text.muted` | `--cn-color-text-muted` | `#bdbdbd` | stable |

<!-- /cn:generated -->

The exact brand values are the `stable` rows above: `color.brand.pink` (BR-01), `color.brand.yellow` (BR-02), and `color.brand.black` (BR-03), with the semantic roles `color.brand.primary`, `color.brand.secondary`, and `color.bg.base` that reference them, in that order (REQ-011). Four more colors are derived from the brand pink and yellow and approved by the owner (ADR-0055); they are not in the brand context, and they are the only ones. The glow colors, `color.glow.*`, are the two brand colors at 60% and 85% opacity (ADR-0051).

### Brand colors and their roles

| Color | Source | Primitive token | Semantic role | Role |
|---|---|---|---|---|
| Pink | BR-01 | `color.brand.pink` | `color.brand.primary` | The "protagonist color" that "dominates the visual identity" (BR-01). |
| Yellow | BR-02 | `color.brand.yellow` | `color.brand.secondary` | A "luminous, premium accent" (BR-02). |
| Black | BR-03 | `color.brand.black` | `color.bg.base`, `color.text.inverted` | The base and background (BR-03), and the label color on pink or yellow fills. |

### The pure-black rule

BR-03 says the tertiary color is pure black, used for the base and background, and it "must stay pure black, not dark gray." So `color.bg.base` resolves to exactly the BR-03 black (REQ-012 AC1), and the page `<body>` background computes to `rgb(0, 0, 0)` in the showcase and in the consumer fixture (REQ-012 AC2).

### Contrast

The block below is generated from `tokens/contrast-pairs.json` and `tokens/contrast-forbidden.json`, and it is the same report `check-contrast` prints (REQ-015). A pair that involves a `tbd` token is `unverified`, never `pass` (REQ-015 AC4). No declared pair uses a `tbd` token, so none is unverified.

<!-- cn:generated tokens="color" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `color.text.default` (`#f5f5f5`) | `color.bg.base` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `color.text.muted` (`#bdbdbd`) | `color.bg.base` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `color.brand.primary` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `color.brand.primary` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `color.brand.secondary` (`#fff488`) | `color.bg.base` (`#000000`) | text | 18.55:1 | 4.50:1 | pass |
| `color.brand.secondary` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `color.text.inverted` (`#000000`) | `color.brand.primary` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `color.text.inverted` (`#000000`) | `color.brand.secondary` (`#fff488`) | text | 18.55:1 | 4.50:1 | pass |
| `color.text.inverted` (`#000000`) | `color.brand.primaryHover` (`#fea0c5`) | text | 11.05:1 | 4.50:1 | pass |
| `color.text.inverted` (`#000000`) | `color.brand.primaryActive` (`#d06c96`) | text | 6.27:1 | 4.50:1 | pass |
| `color.text.inverted` (`#000000`) | `color.brand.secondaryHover` (`#fff7a3`) | text | 19.09:1 | 4.50:1 | pass |
| `color.text.inverted` (`#000000`) | `color.brand.secondaryActive` (`#dacf6d`) | text | 13.13:1 | 4.50:1 | pass |
| `color.border.default` (`#8c8c8c`) | `color.bg.base` (`#000000`) | ui | 6.25:1 | 3.00:1 | pass |
| `color.brand.primaryHover` (`#fea0c5`) | `color.bg.base` (`#000000`) | ui | 11.05:1 | 3.00:1 | pass |
| `color.brand.primaryActive` (`#d06c96`) | `color.bg.base` (`#000000`) | ui | 6.27:1 | 3.00:1 | pass |
| `color.brand.secondaryHover` (`#fff7a3`) | `color.bg.base` (`#000000`) | ui | 19.09:1 | 3.00:1 | pass |
| `color.brand.secondaryActive` (`#dacf6d`) | `color.bg.base` (`#000000`) | ui | 13.13:1 | 3.00:1 | pass |
| `color.brand.secondary` (`#fff488`) | `color.surface.elevated` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `color.brand.primary` (`#ef80ae`) | `color.surface.elevated` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `color.text.disabled` (`#5c5c5c`) | `color.bg.base` (`#000000`) | ui | 3.14:1 | 3.00:1 | pass |
| `color.text.default` (`#f5f5f5`) | `color.surface.card` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `color.text.muted` (`#bdbdbd`) | `color.surface.card` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `color.brand.primary` (`#ef80ae`) | `color.surface.card` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `color.text.default` (`#f5f5f5`) | `color.surface.elevated` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `color.text.muted` (`#bdbdbd`) | `color.surface.elevated` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `color.feedback.success` (`#34d399`) | `color.bg.base` (`#000000`) | text | 10.92:1 | 4.50:1 | pass |
| `color.feedback.warning` (`#ff9f43`) | `color.bg.base` (`#000000`) | text | 10.29:1 | 4.50:1 | pass |
| `color.feedback.error` (`#ff5c5c`) | `color.bg.base` (`#000000`) | text | 6.94:1 | 4.50:1 | pass |
| `color.feedback.info` (`#5cc8ff`) | `color.bg.base` (`#000000`) | text | 11.16:1 | 4.50:1 | pass |
| `focus.ring.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `focus.ring.color` (`#fff488`) | `color.surface.card` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `button.primary.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `button.secondary.border` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `button.ghost.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `button.ghost.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `button.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `link.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `link.fgHover` (`#fea0c5`) | `color.bg.base` (`#000000`) | text | 11.05:1 | 4.50:1 | pass |
| `link.fgActive` (`#d06c96`) | `color.bg.base` (`#000000`) | text | 6.27:1 | 4.50:1 | pass |
| `link.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `badge.primary.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `badge.outline.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `badge.outline.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `badge.tag.border` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `formField.label.fg` (`#f5f5f5`) | `color.bg.base` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `formField.description.fg` (`#bdbdbd`) | `color.bg.base` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `formField.help.fg` (`#bdbdbd`) | `color.bg.base` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `formField.error.fg` (`#ff5c5c`) | `color.bg.base` (`#000000`) | text | 6.94:1 | 4.50:1 | pass |
| `tabs.fg` (`#bdbdbd`) | `color.bg.base` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `tabs.fgHover` (`#f5f5f5`) | `color.bg.base` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `tabs.active.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `tabs.active.indicator` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `tabs.rule` (`#8c8c8c`) | `color.bg.base` (`#000000`) | ui | 6.25:1 | 3.00:1 | pass |
| `tabs.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `breadcrumb.link.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `breadcrumb.link.fgHover` (`#fea0c5`) | `color.bg.base` (`#000000`) | text | 11.05:1 | 4.50:1 | pass |
| `breadcrumb.current.fg` (`#f5f5f5`) | `color.bg.base` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `breadcrumb.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `pagination.item.fg` (`#f5f5f5`) | `color.bg.base` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `pagination.item.border` (`#8c8c8c`) | `color.bg.base` (`#000000`) | ui | 6.25:1 | 3.00:1 | pass |
| `pagination.item.borderHover` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `pagination.current.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `pagination.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `#ffffff` | `color.brand.pink` (`#ef80ae`) | — | 2.51:1 | — | forbidden |
| `color.brand.yellow` (`#fff488`) | `color.brand.pink` (`#ef80ae`) | — | 2.22:1 | — | forbidden |
| `color.brand.pink` (`#ef80ae`) | `color.brand.yellow` (`#fff488`) | — | 2.22:1 | — | forbidden |
| `#ffffff` | `color.brand.yellow` (`#fff488`) | — | 1.13:1 | — | forbidden |

<!-- /cn:generated -->

These are the derived facts from SPEC.md §2.1, measured with the WCAG 2.x relative-luminance formula:

| Pair | Ratio | Result |
|---|---|---|
| Pink on black | 8.37:1 | Passes for text and for UI components |
| Yellow on black | 18.55:1 | Passes for text and for UI components |
| Black text on a pink fill | 8.37:1 | Passes. **Labels on primary-filled buttons must be black.** |
| Black text on a yellow fill | 18.55:1 | Passes |
| White text on a pink fill | 2.51:1 | **Fails.** Never allowed as text. |
| Yellow on pink (either direction) | 2.22:1 | **Fails.** Never allowed as text, and never as the only boundary between two UI regions. |
| White on yellow | 1.13:1 | **Fails** |

The three failing combinations are the forbidden pairs in `tokens/contrast-forbidden.json`. `check-contrast` fails the build if any declared pair combines them (REQ-015 AC3).

### Card surfaces (C-05)

BR-12 gives cards a "dark surface", but BR-03 keeps the base pure black, "not dark gray". The owner resolved this in favor of BR-03 (ADR-0053, OD-05 option a): `color.surface.card` and `color.surface.elevated` are `color.bg.base`, which is pure black (BR-03). The "dark surface" of BR-12 is the pure-black page, and the thick outline (BR-13) carries the separation. A card or overlay without its outline has no boundary at all, so the outline is always present.

Computed contrast on these surfaces equals contrast on the page: body text 19.26:1, muted text 11.18:1, the pink outline 8.37:1, and the yellow focus ring 18.55:1.

### Shades and tints (C-06)

BR-01 and BR-02 give one value per color. Nuxt UI's color aliases read a full scale of 11 shades, `50` to `950` (ADR-0001 §3). The owner chose the **minimal derived** scale (ADR-0055, OD-04 option b): for each brand color, two extra tones are derived, keeping the hue and changing only lightness in the OKLCH color space.

| Steps | Pink tokens | Yellow tokens | Used for |
|---|---|---|---|
| 50, 100, 200, 300 | `color.brand.pink-50` to `pink-300` | `color.brand.yellow-50` to `yellow-300` | The lighter tone: hover |
| 400 | `color.brand.pink-400` (`color.brand.pink`) | `color.brand.yellow-400` (`color.brand.yellow`) | The brand color itself, and Nuxt UI's dark-mode primary |
| 500, 600, 700, 800, 900, 950 | `color.brand.pink-500` to `pink-950` | `color.brand.yellow-500` to `yellow-950` | The darker tone: pressed |

The hex values of every step are in the generated table above.

The semantic roles are `color.brand.primaryHover` (pink 300), `color.brand.primaryActive` (pink 600), `color.brand.secondaryHover` (yellow 300), and `color.brand.secondaryActive` (yellow 600). Black labels on the fills: pink 8.37:1 at rest, 11.05:1 on hover, and 6.27:1 pressed; yellow 18.55:1 at rest, 19.09:1 on hover, and 13.13:1 pressed. The pressed pink against the black page is 6.27:1 (3:1 needed). The yellow hover tone is very close to the rest yellow, so the glow carries the hover state (ADR-0051).

These four hex values are the owner's approved output of the lightness method, not values from the brand context. They are the only colors derived from a brand color. Nothing else is, and the forbidden pairs (white on pink, yellow on pink, white on yellow) stay forbidden at every step. Steps 50 to 300 are identical, and so are steps 500 to 950; that is acceptable in a dark-only system (A-02) that uses only a few steps.

Nuxt UI's default classes that use partial opacity, for example `hover:bg-primary/75`, produce translucent brand colors. The owner did not approve them, so the layer removes them: at build time it strips every partial-opacity color class from Nuxt UI's generated themes (`packages/nuxt/utils/partial-opacity.ts`), and the `.cn-*` rules set the hover, pressed, and focus colors from the tokens above. The only translucent use of a brand color is the glow (ADR-0051).

## Usage rules

### When to use

- Use `color.bg.base` for every page background. It is the pure black from BR-03.
- Use `color.brand.primary` (pink) as the protagonist color: the main action, key highlights, and the neon accents that carry the identity (BR-01).
- Use `color.brand.secondary` (yellow) as the luminous, premium accent, more sparingly than pink (BR-02).
- Use `color.text.inverted` (black) for every label on a pink or yellow fill. Labels on primary-filled buttons must be black (SPEC.md §2.1).
- Separate a card or an overlay from the page with its outline. Do not use a fill (ADR-0053).
- Reference color only through `--cn-color-*` variables or token imports. Never write a color literal in a component, the showcase, or an app (REQ-016).
- Before using a new foreground and background combination, add it to `tokens/contrast-pairs.json` so `check-contrast` verifies it (REQ-015 AC1).

### When not to use

- Never use a dark gray, or any color other than `color.bg.base`, as the page background (BR-03).
- Never put white text on a pink fill (2.51:1) or on a yellow fill (1.13:1).
- Never put yellow on pink or pink on yellow as text, and never use them as the only boundary between two UI regions (2.22:1).
- Never make up a tint, shade, neutral, surface, text, or feedback color. The text, neutral, and feedback colors are in ADR-0032, the surfaces in ADR-0053, and the shades in ADR-0055. A new one needs a new ADR.
- Never use a translucent brand color, such as `bg-primary/75`, outside the glow (C-06, ADR-0051).
- Never use color as the only way to convey meaning. Pair it with text or an icon.

## Do and don't

| Do | Don't |
|---|---|
| Use black labels on a pink primary button. | Use white labels on a pink primary button. |
| Keep the page background pure black. | Lighten the background to a dark gray to make cards stand out. |
| Set a card apart from the page with a thick outline (C-05). | Fill a card with a gray that no token defines. |
| Use yellow as an accent on black. | Use yellow text or a yellow border on a pink fill. |
| Use the lighter pink tone for hover and the darker one for pressed (ADR-0055). | Pick a "close enough" shade of pink for hover or pressed states. |

## Accessibility

- The target is WCAG 2.2 level AA (A-10). The minimum ratios are 4.5:1 for `text`, 3:1 for `large-text`, and 3:1 for `ui` (REQ-015 AC2).
- Every intended pair is declared in `tokens/contrast-pairs.json`, and `check-contrast` runs in `pnpm test`. A pair below its minimum, or one that uses a forbidden combination, fails the build (REQ-015).
- Both brand colors pass on black for text and for UI components: pink at 8.37:1 and yellow at 18.55:1.
- A pair that uses a `tbd` token is reported as `unverified`, never as passing (REQ-015 AC4). The surface colors are decided, so every declared pair is verified.
- Color is never the only signal. States such as error or selected also change text, an icon, or a shape.
- The focus indicator must be distinguishable from the glow (REQ-024). It is brand yellow, separated from the component by a gap, so it never touches a pink or yellow fill (ADR-0009); see [Effects](effects.md).

## Responsive behavior

Color does not change between viewports. The same tokens apply at 360, 768, and 1280 px, and at every breakpoint token (ADR-0035). There is no light theme and no color-mode toggle (A-02).

## Email notes

Email clients do not support `var()`, so email templates use the resolved literals from `dist/email/email-tokens.json`, injected at build time with `$cn(color.brand.primary)` (REQ-013, §4.9). Email clients may alter colors, for example by inverting a dark background in dark mode (R-05). The email fallbacks are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/color.json` | The three brand colors (REQ-011 AC1). |
| `tokens/semantic/color.json` | The color roles: brand, background, text, border, surface, and feedback. |
| `tokens/contrast-pairs.json` and `tokens/contrast-forbidden.json` | The declared pairs and the forbidden combinations (REQ-015). |
| `@vinsmokemau/cup-noobles-tokens`, `dist/css/tokens.css` | The CSS custom properties, such as `--cn-color-brand-primary` (REQ-017). |
| `packages/nuxt/assets/css/main.css` and `app.config.ts` | Map Nuxt UI's color aliases and theme variables to the `--cn-*` variables (§4.7, ADR-0001). |
| `packages/nuxt/utils/partial-opacity.ts` and `nuxt.config.ts` | Remove Nuxt UI's partial-opacity color classes from its themes (C-06, ADR-0055). |

```css
.example {
  background: var(--cn-color-brand-primary);
  color: var(--cn-color-text-inverted);
}
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: brand colors and roles from BR-01 to BR-03, the pure-black rule, contrast facts and forbidden pairs from SPEC.md §2.1, C-05, and C-06 (T4.2) — awaiting owner approval
- 0.1.0 — The focus color is brand yellow with a gap, and its contrast pairs are regenerated (ADR-0009, TBD-16 resolved)
- 0.1.0 — The 22 `derived-pending` shade tokens exist, and the Nuxt layer's `primary` and `secondary` aliases read them (T5.1, C-06)
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
- 0.1.0 — Pure-black card and overlay surfaces, and the minimal derived brand shades, are set by the owner, and the placeholders for them are gone. No TBD item is left in the doc — ADR-0053, ADR-0055
- 0.1.0 — The doc moves to stable on the owner's approval, and the wording about unverified pairs and TBD-13 is brought up to date. No value or rule changes — ADR-0059
