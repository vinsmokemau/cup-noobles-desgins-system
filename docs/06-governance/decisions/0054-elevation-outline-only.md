---
title: "ADR-0054: Overlays lift with an outline only"
slug: adr-0054-elevation-outline-only
layer: adr
status: stable
lang: en
brandRules: [BR-03, BR-13]
tbd: []
related: [effects, adr-0006-placeholder-values, adr-0029-overlay-look, adr-0053-card-surface-pure-black, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0054: Overlays lift with an outline only

## Context

TBD-15 left the elevation and z-index scale open. The overlay shadow, the dimming layer's strength, and the stacking numbers hold ADR-0006 placeholders taken from Nuxt UI and Tailwind (a dark drop shadow, a dimming amount of 0.75, and `auto` for the overlay). ADR-0053 made card and overlay surfaces pure black, so a dark drop shadow would be invisible. The owner reviewed three options on a comparison page, each shown on a modal and a toast over a dimmed black page: outline only, a sticker shadow, and a neon halo. Contrast behind the dimming layer was computed for each. The page marked the sticker shadow as the recommendation.

## Decision

The owner chose **Outline only** in chat on 2026-10-18 ("A"). A check of the comparison page followed before this record.

| Token role | Value |
|---|---|
| Overlay shadow (`effect.shadow.overlay`) | none |
| Overlay elevation (`effect.elevation.overlay`) | none |
| Dimming layer (`effect.opacity.scrim`, `effect.scrim.opacity`, `overlay.scrimOpacity`) | 0.85 (black at 85%) |
| Overlay stacking order (`z.overlay`, `effect.zIndex.overlay`, `overlay.z`) | 50 |
| Toast stacking order (`z.toast`, `effect.zIndex.toast`) | 100 |

An overlay is lifted off the page by its 3 px outline alone (ADR-0053) and by the dimming layer. A toast always sits above an overlay. The stacking numbers 50 and 100 were the examples on the comparison page, and the owner did not ask for others.

Computed at 85% dimming: light body text behind an overlay is 1.37:1 against black, and pink outlines behind it are 1.18:1. The overlay's yellow outline is 18.55:1 against black, so its boundary is always visible.

These values are the owner's choice for an open item. They are not brand values from the brand context.

## Consequences

- TBD-15 is decided. The owner's choice is Outline only, with the values above.
- The SPEC.md §2.4 row for TBD-15, the TBD-15 callouts in `effects.md` and the overlay component docs, and the tokens that name TBD-15 (the `z.*`, `effect.zIndex.*`, `effect.shadow.overlay`, `effect.elevation.overlay`, scrim, and `overlay.*` tokens, and their `placeholder.*` sources) change in a later task, not in this ADR. Until then the placeholders stay, and `pnpm check:tbd` still counts TBD-15 as open. The `none` values may need a way to write "no shadow" in the token file, which the later task settles.
- ADR-0029 recorded the modal and slideover look with the shadow and dimming amount as TBD-15 placeholders. The later task updates those two values to the ones here.
- Every overlay must keep its outline. An overlay without it has no edge against the black page.
- Notes from the audit for the component tasks, not decided here: at 85% the page behind an overlay is nearly invisible, which gives little context, and a toast above a modal should not cover the modal's actions, since the toast's pink outline meets the modal's yellow one.
- There is no shadow in the system, so a shadow value never needs to be written in a component (REQ-016).
