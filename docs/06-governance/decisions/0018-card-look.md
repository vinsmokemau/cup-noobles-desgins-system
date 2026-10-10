---
title: "ADR-0018: Card look"
slug: adr-0018-card-look
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-03, BR-12, BR-13]
tbd: []
related: [adr-0013-text-field-look, adr-0006-placeholder-values, card, form-field]
since: 0.1.0
updated: 2026-10-09
---

# ADR-0018: Card look

## Context

The brand context says cards have "a dark surface with neon highlights" (BR-12) but does not say which highlight. No card surface color is defined (C-05, TBD-06), so a card on the pure-black page (BR-03) needs something to set it apart. T8.1 (FormField and Card) needed one look for the standard card.

The owner compared three looks on a visual comparison page, on the pure-black page with a button beside the content:

- A. A thick brand-pink outline with pink dividers and no glow. 8.37:1 against the page, and it uses only brand colors.
- B. A neutral outline with a pink top edge. It depends on the neutral scale (TBD-05).
- C. A pink outline with a neon glow. It depends on the glow values (TBD-12) and competes with the button's glow.

The owner chose A in chat on 2026-10-09 (T8.1 session). No `frontend-design` audit was run: option A uses only stable brand tokens and adds no new value.

## Decision

The standard card is drawn like this. The values come from the owner in chat, 2026-10-09.

| Part | Look |
|---|---|
| Fill | The black page (`card.bg`, `color.bg.base`) |
| Outline | Brand pink, thick (`card.highlight`, BR-01) |
| Dividers between parts | Brand pink (`card.divider`) |
| Glow | None |
| Surface | No `color.surface.card`; it stays TBD-06 until OD-05 is decided |

1. The text colors, the corner radius, and the stroke width are not part of this decision. They stay placeholders (TBD-04, TBD-05, TBD-10, TBD-11).
2. OD-05 stays open. Choosing a separate near-black card surface is a different decision and needs its own ADR.

## Consequences

- `card.json` holds `card.highlight` and `card.divider` as `stable` tokens that reference `color.brand.primary`.
- The doc stays `draft` while the placeholders are open.
- Changing the look takes a new ADR that supersedes this one, and new visual baselines.
