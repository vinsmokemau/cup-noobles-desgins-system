---
title: "ADR-0053: Card and overlay surfaces are pure black"
slug: adr-0053-card-surface-pure-black
layer: adr
status: stable
lang: en
brandRules: [BR-03, BR-12, BR-13]
tbd: []
related: [color, adr-0006-placeholder-values, adr-0032-text-neutral-feedback-stroke-motion-values, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0053: Card and overlay surfaces are pure black

## Context

TBD-06 left the card and elevated surface colours open (`color.surface.card` and `color.surface.elevated`). BR-12 gives cards a "dark surface", while BR-03 says the base "must stay pure black, not dark gray" (C-05). Until now cards rendered on `color.bg.base`, separated by a thick outline (BR-13). The owner reviewed three options on a comparison page, each shown on a content card, a media card, and a modal on its dimming layer: pure black with an outline only (OD-05 option a), a near-black neutral, and a plum-black. Contrast was computed for every text and outline pair. The page marked the near-black neutral as the recommendation.

## Decision

The owner chose **pure black, separated by an outline only** in chat on 2026-10-18 ("A"). This is OD-05 option (a).

- `color.surface.card` is `color.bg.base`, which resolves to `#000000`.
- `color.surface.elevated` is `color.bg.base`, which resolves to `#000000`.
- A card or overlay is set apart from the page by its 3 px outline (ADR-0032), never by a different fill.

Computed contrast on these surfaces equals contrast on the page: body text 19.26:1, muted text 11.18:1, the pink outline 8.37:1, and the yellow focus ring 18.55:1. Every pair passes its minimum (4.5:1 for text, 3:1 for the outline and ring).

This choice follows BR-03 and records a value for an open item. It is not a new brand value from the brand context.

## Consequences

- TBD-06 and OD-05 are decided. C-05 is resolved: the "dark surface" of BR-12 is the pure-black page, and the outline carries the separation.
- The SPEC.md §2.4 row for TBD-06, the OD-05 and C-05 rows, the TBD-06 callouts in `color.md` and the component docs, and the tokens that name TBD-06 (`color.surface.card`, `color.surface.elevated`) change in a later task, not in this ADR. Until then the placeholders stay, and `pnpm check:tbd` still counts TBD-06 as open.
- A card needs no tonal lift to be readable, so its outline must always be present. A card or overlay without its outline has no boundary at all.
- An overlay, such as a modal, is separated from the page by its outline only. The overlay and z-index scale (TBD-15) must give every overlay a clear outline, and the owner judges the dimming layer on that basis. The dimming layer still dims the cards and text behind an overlay, but it cannot lift an overlay out of a black page.
- The text colours (ADR-0032) are unchanged.
