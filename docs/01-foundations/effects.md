---
title: Effects
slug: effects
layer: foundation
status: stable
lang: en
brandRules: [BR-06, BR-10, BR-13]
tokens: [effect, z, focus]
tbd: []
related: [shape, color, accessibility, motion, button]
since: 0.1.0
updated: 2026-10-18
---

# Effects

## Purpose

This doc defines the Cup Noobles effects: the neon glow, elevation, stacking order (z-index), and the focus indicator. It implements the glow in BR-10 and keeps it compatible with BR-06 ("high-contrast, vibrant, and legible") and BR-13. It also states REQ-024: the focus indicator is never the glow alone. The owner defined the focus indicator (ADR-0009), the glow (ADR-0051, ADR-0052), and the elevation and z-index scales (ADR-0054).

## Tokens and specs

<!-- cn:generated tokens="effect z focus" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `effect.elevation.overlay` | `--cn-effect-elevation-overlay` | `none` | stable |
| `effect.glow.button` | `--cn-effect-glow-button` | `0px 0px 12px 1px rgba(239, 128, 174, 0.6)` | stable |
| `effect.glow.default` | `--cn-effect-glow-default` | `0px 0px 12px 1px rgba(239, 128, 174, 0.6)` | stable |
| `effect.glow.interactive` | `--cn-effect-glow-interactive` | `0px 0px 12px 1px rgba(239, 128, 174, 0.6)` | stable |
| `effect.glow.interactiveHover` | `--cn-effect-glow-interactive-hover` | `0px 0px 20px 2px rgba(239, 128, 174, 0.8509803921568627)` | stable |
| `effect.glow.pink.hover` | `--cn-effect-glow-pink-hover` | `0px 0px 20px 2px rgba(239, 128, 174, 0.8509803921568627)` | stable |
| `effect.glow.pink.rest` | `--cn-effect-glow-pink-rest` | `0px 0px 12px 1px rgba(239, 128, 174, 0.6)` | stable |
| `effect.glow.secondary` | `--cn-effect-glow-secondary` | `0px 0px 12px 1px rgba(255, 244, 136, 0.6)` | stable |
| `effect.glow.secondaryHover` | `--cn-effect-glow-secondary-hover` | `0px 0px 20px 2px rgba(255, 244, 136, 0.8509803921568627)` | stable |
| `effect.glow.yellow.hover` | `--cn-effect-glow-yellow-hover` | `0px 0px 20px 2px rgba(255, 244, 136, 0.8509803921568627)` | stable |
| `effect.glow.yellow.rest` | `--cn-effect-glow-yellow-rest` | `0px 0px 12px 1px rgba(255, 244, 136, 0.6)` | stable |
| `effect.opacity.scrim` | `--cn-effect-opacity-scrim` | `0.85` | stable |
| `effect.scrim.opacity` | `--cn-effect-scrim-opacity` | `0.85` | stable |
| `effect.shadow.overlay` | `--cn-effect-shadow-overlay` | `none` | stable |
| `effect.zIndex.overlay` | `--cn-effect-z-index-overlay` | `50` | stable |
| `effect.zIndex.toast` | `--cn-effect-z-index-toast` | `100` | stable |
| `focus.offset.default` | `--cn-focus-offset-default` | `3px` | stable |
| `focus.ring.color` | `--cn-focus-ring-color` | `#fff488` | stable |
| `focus.ring.offset` | `--cn-focus-ring-offset` | `3px` | stable |
| `focus.ring.style` | `--cn-focus-ring-style` | `solid` | stable |
| `focus.ring.width` | `--cn-focus-ring-width` | `3px` | stable |
| `focus.style.default` | `--cn-focus-style-default` | `solid` | stable |
| `focus.width.default` | `--cn-focus-width-default` | `3px` | stable |
| `z.overlay` | `--cn-z-overlay` | `50` | stable |
| `z.toast` | `--cn-z-toast` | `100` | stable |

<!-- /cn:generated -->

Every row is `stable`. The glow values are the owner's choice, Neon tube (ADR-0051). The overlay shadow, the dimming amount, and the stacking numbers are the owner's choice, Outline only (ADR-0054). The focus ring is ADR-0009. None of these is a brand value from the brand context; each is a value the owner chose for an open item.

The primitive tokens (`effect.glow.pink.*`, `effect.glow.yellow.*`, `effect.shadow.overlay`, `effect.opacity.scrim`, `z.*`, `focus.width.default`, `focus.offset.default`, `focus.style.default`) hold the raw values. The semantic tokens (`effect.glow.interactive`, `effect.glow.secondary`, `effect.elevation.*`, `effect.scrim.opacity`, `effect.zIndex.*`, `focus.ring.*`) give them roles. Components and apps use the semantic tokens only. The component tokens are added by each component's task. The button's glow is `effect.glow.button` and the per-variant `button.*.glow` tokens (REQ-023 AC2, see [Button](../02-components/atoms/button.md)).

### Brand rules

> **BR-10:** Buttons have rounded corners, a subtle neon glow, and a thick outline stroke.
>
> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The rounded corners and the outline stroke in BR-10 are covered in [Shape](shape.md).

### Glow

BR-10 gives buttons "a subtle neon glow". The owner chose **Neon tube** (ADR-0051):

| State | Glow |
|---|---|
| Default (rest) | blur 12 px, spread 1 px, opacity 60% |
| Hover | blur 20 px, spread 2 px, opacity 85% |
| Pressed | the hover glow (proposed by T13.2; ADR-0051 did not decide it) |
| Loading | the rest glow, because a loading button is busy, not unavailable |
| Keyboard focus | the rest glow, plus the separate focus ring (ADR-0009) |
| Disabled | none (REQ-023 AC5) |

The glow color is the exact brand color of the element, with only its opacity set: `color.brand.pink` around pink elements and `color.brand.yellow` around yellow ones. The tokens `color.glow.pink.*` and `color.glow.yellow.*` hold those two translucent colors. ADR-0051 approves the translucent use of the two brand colors for the glow and for nothing else (C-06). Hover opacity is written as the alpha byte `d9`, which is 85.1%.

> **Rule (ADR-0052):** Glow applies to component edges only, such as the outline of a button or a card. It is never applied to body text, captions, or any other text, as a text shadow or otherwise. A neon glow on a pure-black base causes halation that hurts text legibility, which would conflict with BR-06 (R-04). A change to this rule needs a new ADR.

Measured at hover, the strongest state, light body text beside the glow keeps at least 9.9:1 and grey caption text at least 5.0:1, 4 px from the button edge, against a 4.5:1 minimum (ADR-0051).

### Elevation and stacking

| Token | Role |
|---|---|
| `effect.elevation.overlay` | The shadow of overlays such as a modal or slideover. |
| `effect.zIndex.overlay` | The stacking order of overlays. |
| `effect.zIndex.toast` | The stacking order of toasts, above overlays. |

The owner chose **Outline only** (ADR-0054). On a pure-black base (BR-03) a dark shadow is invisible, and card and overlay surfaces are the same black (ADR-0053), so an overlay is lifted off the page by its 3 px outline and by the dimming layer.

| Token role | Value |
|---|---|
| Overlay shadow (`effect.shadow.overlay`, `effect.elevation.overlay`) | none |
| Dimming layer (`effect.opacity.scrim`, `effect.scrim.opacity`, `overlay.scrimOpacity`) | 0.85, black at 85% |
| Overlay stacking order (`z.overlay`, `effect.zIndex.overlay`) | 50 |
| Toast stacking order (`z.toast`, `effect.zIndex.toast`) | 100 |

A toast always sits above an overlay. There is no shadow in the system, so a shadow value never needs to be written in a component (REQ-016). Every overlay must keep its outline: without it the overlay has no edge against the black page. At 85% the page behind an overlay is nearly invisible, and a toast above a modal should not cover the modal's actions.

### Focus

REQ-024 AC1: every interactive component shows a focus-visible indicator that is **not the glow alone**. It uses the `focus.ring.*` tokens (color, width, offset, and style) and has at least 3:1 contrast against adjacent colors. REQ-024 AC2: focus appears for keyboard focus (`:focus-visible`), never on a mouse click alone.

The focus indicator is a solid brand-yellow ring (BR-02), 3 px wide, drawn 3 px outside the component (ADR-0009). The gap shows the container behind the component, so on the pure-black page the ring only ever touches black, at 18.55:1. It never touches a pink or yellow fill: yellow on pink is a forbidden pair (SPEC.md §2.1), and yellow on yellow has no contrast. The ring is yellow, not Nuxt UI's default translucent pink outline, so it stays distinct from a pink glow (REQ-024) and derives no new color from BR-01 (C-06).

A focusable component on a container that is not black needs its own check, because the gap then shows that container's color. The contrast pairs declared for the focus color are generated below. `color.surface.card` is the same black as the page (ADR-0053), so its pair passes as well.

<!-- cn:generated tokens="focus" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `focus.ring.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `focus.ring.color` (`#fff488`) | `color.surface.card` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

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
- Never make up glow, elevation, or z-index values. They are set by ADR-0051 and ADR-0054, and a change needs a new ADR. Never change the focus values without a new ADR (ADR-0009).
- Never put a glow on text, or add a shadow to an overlay (ADR-0052, ADR-0054).
- Never set the focus offset to `0` or draw the ring inside a component: the gap is what keeps yellow off the pink and yellow fills.
- Never derive a translucent brand color for anything except the glow tokens of ADR-0051 (C-06).

## Do and don't

| Do | Don't |
|---|---|
| Show a `focus.ring.*` outline on keyboard focus, in addition to any glow. | Make the glow brighter on focus and call that the focus indicator. |
| Keep the glow on a button's edge. | Put a glow on a paragraph or a caption (ADR-0052). |
| Remove the glow from a disabled button. | Keep the glow on a disabled button so it still looks "on brand". |
| Stack overlays with `effect.zIndex.*`. | Type a z-index number into a component. |

## Accessibility

- The target is WCAG 2.2 level AA (A-10).
- The focus indicator is always visible on keyboard focus, uses `focus.ring.*`, and is never the glow alone (REQ-024 AC1). It has at least 3:1 contrast against adjacent colors (WCAG 1.4.11). The focus contrast pairs are declared in `tokens/contrast-pairs.json` and checked by `check-contrast`.
- Focus appears on `:focus-visible` only (REQ-024 AC2). Every interactive component has a Playwright keyboard test for it.
- The glow is decorative. It never carries meaning or state on its own.
- Glow stays off body text so text remains legible on black (BR-06, ADR-0052).
- An animated glow stops, or reduces to a non-moving state, under `prefers-reduced-motion: reduce`, and never flashes more than 3 times per second (REQ-029). Motion values are in [Motion](motion.md).

## Responsive behavior

Effects do not change between viewports. The same tokens apply at 360, 768, and 1280 px (A-09), and at every breakpoint once TBD-13 is resolved. The focus indicator must stay fully visible at 360 px (ER-05), including inside scrolling containers.

## Email notes

`box-shadow` is widely unsupported in email clients (R-05), so the glow and elevation are not relied on in email. Email has no keyboard focus styling to define. Email templates use the resolved literals from `dist/email/email-tokens.json`, injected at build time (REQ-013, §4.9); the fallbacks are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/effect.json` | The glow, the overlay shadow, and the dimming amount, `stable` (ADR-0051, ADR-0054). |
| `tokens/primitive/z.json` | The z-index values, `stable` (ADR-0054). |
| `tokens/semantic/effect.json` | The roles: `effect.glow.interactive`, `effect.glow.secondary`, `effect.elevation.overlay`, `effect.scrim.opacity`, and `effect.zIndex.*`. |
| `tokens/primitive/focus.json` | The focus ring width, offset, and line style, `stable` (ADR-0009). |
| `tokens/semantic/focus.json` | The focus indicator: `focus.ring.color`, `width`, `offset`, and `style`, all `stable` (ADR-0009). |
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

Not applicable.

## Changelog

- 0.1.0 — First draft: BR-10 glow, BR-06 and BR-13, the glow, elevation, z-index, and focus groups, the REQ-024 focus rule, a draft rule for R-04, and TBD-12, TBD-15, and TBD-16 (T4.4) — awaiting owner approval
- 0.1.0 — Focus indicator defined by the owner: a solid yellow ring, 3 px wide, with a 3 px gap (ADR-0009, TBD-16 resolved)
- 0.1.0 — Neon tube, Outline only, and the edges-only glow rule are set by the owner, and the placeholders for them are gone. The doc moves to stable — ADR-0051, ADR-0052, ADR-0054
