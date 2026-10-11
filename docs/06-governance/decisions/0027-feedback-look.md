---
title: "ADR-0027: Feedback look"
slug: adr-0027-feedback-look
layer: adr
status: stable
lang: en
brandRules: [BR-03, BR-06, BR-13]
tbd: []
related: [adr-0018-card-look, adr-0006-placeholder-values, alert, toast, tooltip]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0027: Feedback look

## Context

The brand context does not say how feedback messages look. The feedback colors are not defined (TBD-07), so success, warning, error, and info are one neutral placeholder today. T8.3 (Alert, Toast, and Tooltip) needed one look for the three components.

The owner compared three complete kits on a visual comparison page, on the pure-black page:

- A. Alert and toast with a black fill, a thick outline and an icon in the feedback color, and normal text. Tooltip a black bubble with a pink outline.
- B. Alert and toast with the same pink frame as the card, and only the icon in the feedback color. Tooltip as in A. It cannot be told apart from a card.
- C. Alert and toast as solid fills in the feedback color with black text, and the tooltip a pink fill with black text. Its contrast depends on colors that are not defined, and a filled block competes with the primary button.

The owner chose A in chat on 2026-10-10 (T8.3 session). No `frontend-design` audit was run: option A uses only stable brand tokens for its fill and its tooltip outline, and the feedback colors stay placeholders.

## Decision

The three components are drawn like this. The look comes from the owner in chat, 2026-10-10.

| Part | Look |
|---|---|
| Alert and toast fill | The black page (`alert.bg`, `toast.bg`, `color.bg.base`) |
| Alert and toast outline | Thick, in the feedback color of the type (`alert.<type>.color`, `toast.<type>.color`) |
| Icon | The same feedback color |
| Text | The body and muted text colors (`alert.fg`, `alert.fgMuted`) |
| Tooltip | Black bubble, brand pink outline (`tooltip.bg`, `tooltip.border`, BR-01) |
| Glow, shadow | None |
| Focus ring | Yellow, from the focus tokens (ADR-0009), on the toast and on the close buttons |

1. The four types are `info`, `success`, `warning`, and `error`. The type is always told by its icon and its title as well as by color (WCAG 1.4.1).
2. The feedback colors, the text colors, the corner radius, and the stroke width are not part of this decision. They stay placeholders (TBD-04, TBD-05, TBD-07, TBD-10, TBD-11).
3. A toast with an action stays open until it is closed. The toaster's position, stacking, duration, and animation stay Nuxt UI defaults until TBD-14 and TBD-15 are decided. Open and close animations stop under `prefers-reduced-motion: reduce`.

## Consequences

- `alert.json`, `toast.json`, and `tooltip.json` hold the tokens. The fills and the tooltip outline are `stable`; the rest are `tbd` and follow the ADR-0006 placeholders.
- The docs stay `draft` while the placeholders are open.
- When TBD-07 is decided, the four types take their colors with no component change, and the contrast pairs are verified then.
- Changing the look takes a new ADR that supersedes this one, and new visual baselines.
