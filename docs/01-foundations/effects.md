---
title: Effects
slug: effects
layer: foundation
status: draft
lang: en
brandRules: [BR-06, BR-10, BR-13]
tokens: [effect, z, focus]
tbd: [TBD-12, TBD-15, TBD-16]
related: [shape, color, accessibility, motion, button]
since: 0.1.0
updated: 2026-09-27
---

# Effects

## Purpose

This doc defines the Cup Noobles effects: the neon glow, elevation, stacking order (z-index), and the focus indicator. It implements the glow in BR-10 and keeps it compatible with BR-06 ("high-contrast, vibrant, and legible") and BR-13. It also states REQ-024: the focus indicator is never the glow alone. The glow parameters (TBD-12), the elevation and z-index scales (TBD-15), and the focus style (TBD-16) are not defined yet, so every effect token holds an ADR-0006 placeholder that is not a brand value.

## Tokens and specs

<!-- cn:generated tokens="effect z focus" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `effect.elevation.overlay` | `--cn-effect-elevation-overlay` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | tbd (TBD-15) |
| `effect.glow.default` | `--cn-effect-glow-default` | `none` | tbd (TBD-12) |
| `effect.glow.interactive` | `--cn-effect-glow-interactive` | `none` | tbd (TBD-12) |
| `effect.shadow.overlay` | `--cn-effect-shadow-overlay` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | tbd (TBD-15) |
| `effect.zIndex.overlay` | `--cn-effect-z-index-overlay` | `auto` | tbd (TBD-15) |
| `effect.zIndex.toast` | `--cn-effect-z-index-toast` | `100` | tbd (TBD-15) |
| `focus.ring.color` | `--cn-focus-ring-color` | `#90a1b9` | tbd (TBD-16) |
| `focus.ring.offset` | `--cn-focus-ring-offset` | `0` | tbd (TBD-16) |
| `focus.ring.style` | `--cn-focus-ring-style` | `solid` | tbd (TBD-16) |
| `focus.ring.width` | `--cn-focus-ring-width` | `3px` | tbd (TBD-16) |
| `z.overlay` | `--cn-z-overlay` | `auto` | tbd (TBD-15) |
| `z.toast` | `--cn-z-toast` | `100` | tbd (TBD-15) |

<!-- /cn:generated -->

Every row above is `tbd`. The glow placeholder is `none`, because Nuxt UI's button has no glow; the elevation, z-index, and focus placeholders come from Nuxt UI and Tailwind defaults (ADR-0006). **None of them is a brand value**, and none may be copied into another project. They exist only so the tokens build and the showcase renders.

The primitive tokens (`effect.glow.default`, `effect.shadow.overlay`, `z.*`) hold the raw values. The semantic tokens (`effect.glow.interactive`, `effect.elevation.*`, `effect.zIndex.*`, `focus.ring.*`) give them roles. Components and apps use the semantic tokens only. The component tokens, such as `effect.glow.button` (REQ-023 AC2), are added by that component's task.

### Brand rules

> **BR-10:** Buttons have rounded corners, a subtle neon glow, and a thick outline stroke.
>
> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The rounded corners and the outline stroke in BR-10 are covered in [Shape](shape.md).

### Glow

BR-10 gives buttons "a subtle neon glow". Its blur, spread, opacity, and the color used in each state are TBD-12. A disabled button has no glow (REQ-023 AC5).

> **Draft:** Glow applies to component edges only, such as the outline of a button or a card. It is never applied to body text or captions, as a text shadow or otherwise. A neon glow on a pure-black base causes halation that hurts text legibility, which would conflict with BR-06 (R-04). This rule awaits owner approval.

### Elevation and stacking

| Token | Role |
|---|---|
| `effect.elevation.overlay` | The shadow of overlays such as a modal or slideover. |
| `effect.zIndex.overlay` | The stacking order of overlays. |
| `effect.zIndex.toast` | The stacking order of toasts, above overlays. |

The elevation and z-index scales are TBD-15. On a pure-black base (BR-03) a dark shadow is barely visible, so overlays also rely on their outline (BR-13) to separate from the page. How elevation is expressed is part of TBD-15.

### Focus

REQ-024 AC1: every interactive component shows a focus-visible indicator that is **not the glow alone**. It uses the `focus.ring.*` tokens (color, width, offset, and style) and has at least 3:1 contrast against adjacent colors. REQ-024 AC2: focus appears for keyboard focus (`:focus-visible`), never on a mouse click alone.

The focus style is TBD-16. The focus color is the neutral placeholder, not Nuxt UI's default translucent pink outline, because that would derive a new color from BR-01 without approval (ADR-0006, C-06).

The contrast pairs declared for the focus color are generated below. They are `unverified` until TBD-16 is resolved (REQ-015 AC4).

<!-- cn:generated tokens="focus" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `focus.ring.color` (`#90a1b9`) | `color.bg.base` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `focus.ring.color`, `placeholder.color.neutral`) |
| `focus.ring.color` (`#90a1b9`) | `color.brand.primary` (`#ef80ae`) | ui | 1.05:1 | 3.00:1 | unverified (tbd: `focus.ring.color`, `placeholder.color.neutral`) |

<!-- /cn:generated -->

## Usage rules

### When to use

- Use `effect.glow.*` tokens for the neon glow on interactive elements such as buttons (BR-10).
- Use `focus.ring.*` tokens for the focus indicator of every interactive component, shown on `:focus-visible` (REQ-024).
- Use `effect.elevation.*` and `effect.zIndex.*` tokens for overlays and toasts.
- Reference effects only through `--cn-effect-*`, `--cn-z-*`, and `--cn-focus-*` variables or token imports. Never write a shadow, glow, or z-index literally in a component, the showcase, or an app (REQ-016).

### When not to use

- Never use the glow as the only focus indicator, and never show focus on a mouse click alone (REQ-024).
- Never give a disabled button a glow (REQ-023 AC5).
- Never make up glow, elevation, z-index, or focus values. They are TBD-12, TBD-15, and TBD-16, and only the owner can supply them.
- Never treat the ADR-0006 placeholders as brand values, and never copy them into another project.
- Never derive a focus or glow color from a brand color, for example a translucent pink, without an approved ADR (C-06).

## Do and don't

| Do | Don't |
|---|---|
| Show a `focus.ring.*` outline on keyboard focus, in addition to any glow. | Make the glow brighter on focus and call that the focus indicator. |
| Keep the glow on a button's edge. | Put a glow on a paragraph or a caption (draft rule, R-04). |
| Remove the glow from a disabled button. | Keep the glow on a disabled button so it still looks "on brand". |
| Stack overlays with `effect.zIndex.*`. | Type a z-index number into a component. |

## Accessibility

- The target is WCAG 2.2 level AA (A-10).
- The focus indicator is always visible on keyboard focus, uses `focus.ring.*`, and is never the glow alone (REQ-024 AC1). It has at least 3:1 contrast against adjacent colors (WCAG 1.4.11). The focus contrast pairs are declared in `tokens/contrast-pairs.json` and checked by `check-contrast`.
- Focus appears on `:focus-visible` only (REQ-024 AC2). Every interactive component has a Playwright keyboard test for it.
- The glow is decorative. It never carries meaning or state on its own.
- Glow stays off body text so text remains legible on black (BR-06, draft rule for R-04).
- An animated glow stops, or reduces to a non-moving state, under `prefers-reduced-motion: reduce`, and never flashes more than 3 times per second (REQ-029). Motion values are in [Motion](motion.md).

## Responsive behavior

Effects do not change between viewports. The same tokens apply at 360, 768, and 1280 px (A-09), and at every breakpoint once TBD-13 is resolved. The focus indicator must stay fully visible at 360 px (ER-05), including inside scrolling containers.

## Email notes

`box-shadow` is widely unsupported in email clients (R-05), so the glow and elevation are not relied on in email. Email has no keyboard focus styling to define. Email templates use the resolved literals from `dist/email/email-tokens.json`, injected at build time (REQ-013, §4.9); the fallbacks are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/effect.json` | The glow and the overlay shadow, both `tbd` (TBD-12, TBD-15). |
| `tokens/primitive/z.json` | The z-index values, `tbd` (TBD-15). |
| `tokens/semantic/effect.json` | The roles: `effect.glow.interactive`, `effect.elevation.overlay`, and `effect.zIndex.*`. |
| `tokens/semantic/focus.json` | The focus indicator: `focus.ring.color`, `width`, `offset`, and `style`, all `tbd` (TBD-16). |
| `@vinsmokemau/cup-noobles-tokens`, `dist/css/tokens.css` | The CSS custom properties, such as `--cn-focus-ring-color` (REQ-017). |

```css
.example {
  box-shadow: var(--cn-effect-glow-interactive);
}

.example:focus-visible {
  outline-color: var(--cn-focus-ring-color);
  outline-width: var(--cn-focus-ring-width);
  outline-style: var(--cn-focus-ring-style);
  outline-offset: var(--cn-focus-ring-offset);
}
```

## Open items

> **TBD (TBD-12):** Neon glow parameters are not defined: blur, spread, opacity, and which color is used per state ("subtle" in BR-10). `effect.glow.default` and `effect.glow.interactive` hold the ADR-0006 placeholder `none`. Owner input needed: values.
>
> **TBD (TBD-15):** The elevation and z-index scales are not defined. `effect.shadow.overlay`, `effect.elevation.overlay`, `z.*`, and `effect.zIndex.*` hold ADR-0006 placeholders. Owner input needed: values.
>
> **TBD (TBD-16):** The focus indicator style is not defined: color, width, offset, and line style. It must differ from the glow (REQ-024). `focus.ring.*` holds ADR-0006 placeholders. Owner input needed: a decision.

## Changelog

- 0.1.0 — First draft: BR-10 glow, BR-06 and BR-13, the glow, elevation, z-index, and focus groups, the REQ-024 focus rule, a draft rule for R-04, and TBD-12, TBD-15, and TBD-16 (T4.4) — awaiting owner approval
