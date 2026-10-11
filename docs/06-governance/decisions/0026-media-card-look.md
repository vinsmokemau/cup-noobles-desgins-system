---
title: "ADR-0026: Media card look"
slug: adr-0026-media-card-look
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-12, BR-13]
tbd: []
related: [adr-0018-card-look, adr-0009-focus-indicator, media-card, card, badge]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0026: Media card look

## Context

The brand context describes the featured media card as a thumbnail, a title, and a tag badge (BR-12), and says cards have "a dark surface with neon highlights". ADR-0018 chose the look of the standard card. It does not say how a card that is a whole link looks on hover and on keyboard focus. T8.2 (`CnMediaCard`) needed that choice.

The owner compared three looks on a visual comparison page, on the pure-black page (BR-03), in the default, hover, and keyboard-focus states:

- A. The standard card's look. The outline stays pink, the title is underlined on hover, and focus shows the yellow ring around the whole card. It adds no color.
- B. The outline turns yellow on hover. Ring and outline become the same color when the card is hovered and focused together.
- C. A yellow outline at rest, to read as "featured". The focus ring and the outline are both yellow, and it needs its own meaning for yellow.

The recommendation was A. The owner chose A in chat on 2026-10-10 (T8.2 session). No `frontend-design` audit was run: option A uses only stable brand tokens that ADR-0018 and ADR-0009 already approved, and adds no new value.

## Decision

The values come from the owner in chat, 2026-10-10.

| Part | Look |
|---|---|
| Fill | The black page (`mediaCard.bg`, `color.bg.base`) |
| Outline | Brand pink, thick (`mediaCard.highlight`, BR-01) |
| Line between thumbnail and text | Brand pink (`mediaCard.divider`) |
| Glow | None |
| Hover and active | The title is underlined. No color changes, so no hover shade is needed (TBD-08) |
| Keyboard focus | The yellow focus ring around the whole card (`mediaCard.focus.*`, ADR-0009) |
| Tag badges | The `tag` badge: black label on brand yellow (ADR-0011) |

1. **One tab stop.** A linked card has exactly one focusable element, the title link. Its `::after` covers the card, so a click anywhere follows it. Its accessible name is the title (REQ-025 AC4).
2. **Thumbnail proportions.** The thumbnail keeps its own proportions and no aspect ratio is declared, because the photography and thumbnail standards are TBD-20. TBD-20 stays open.
3. **Thumbnail text alternative.** A thumbnail requires `alt`, or the explicit `decorative` flag (REQ-025 AC2).
4. **Surface.** There is no `color.surface.card`; it stays TBD-06 until OD-05 is decided.
5. **Not decided here.** The text color, the corner radius, and the stroke width stay placeholders (TBD-04, TBD-10, TBD-11).

## Consequences

- `media-card.json` holds `mediaCard.highlight`, `mediaCard.divider`, `mediaCard.bg`, and `mediaCard.focus.*` as `stable` tokens that reference semantic tokens.
- The doc stays `draft` while the placeholders and TBD-20 are open.
- Changing the look takes a new ADR that supersedes this one, and new visual baselines.
