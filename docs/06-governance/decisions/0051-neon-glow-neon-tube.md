---
title: "ADR-0051: The neon glow is Neon tube"
slug: adr-0051-neon-glow-neon-tube
layer: adr
status: stable
lang: en
brandRules: [BR-02, BR-06, BR-10]
tbd: []
related: [effects, adr-0006-placeholder-values, adr-0009-focus-indicator, adr-0050-corner-radius-chunky, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0051: The neon glow is Neon tube

## Context

TBD-12 left the neon glow parameters open: blur, spread, opacity, and the colour used per state. BR-10 asks for "a subtle neon glow" on buttons, and BR-06 for a high-contrast, legible UI. The glow tokens (`effect.glow.default`, `effect.glow.interactive`, `effect.glow.button`) hold the ADR-0006 placeholder `none`. The docs also say never to derive a translucent brand colour for a glow without an approved ADR (C-06). The owner reviewed three options on a comparison page, each shown on a button in four states, a card, and text 8 px from a button: Whisper, Neon tube, and Arcade sign. Text contrast near the glow was measured in a browser. The page marked Neon tube as the recommendation.

## Decision

The owner chose **Neon tube** in chat on 2026-10-18 ("B").

| State | Glow |
|---|---|
| Default (rest) | blur 12 px, spread 1 px, opacity 60% |
| Hover | blur 20 px, spread 2 px, opacity 85% |
| Keyboard focus | the rest glow, plus the separate focus ring from ADR-0009 |
| Disabled | none (REQ-023 AC5) |

The glow colour is the exact brand colour of the element, with only its opacity set by this decision: `color.brand.pink` around pink elements and `color.brand.yellow` around yellow ones. This approves the translucent use of those two colours for the glow, and for nothing else (C-06).

Measured at hover, the strongest state, the background under the glow gives light body text at least 9.9:1 and grey caption text at least 5.0:1 at 4 px from the button edge, against a 4.5:1 minimum.

These values are the owner's choice for an open item. They are not brand values from the brand context.

## Consequences

- TBD-12 is decided. The owner's choice is Neon tube, with the values above.
- The SPEC.md §2.4 row for TBD-12, the TBD-12 callouts in `effects.md` and `button.md`, and the tokens that name TBD-12 (`effect.glow.default`, `effect.glow.interactive`, `effect.glow.button`, and `placeholder.effect.glow`) change in a later task, not in this ADR. Until then the placeholder stays, and `pnpm check:tbd` still counts TBD-12 as open.
- The draft rule in `effects.md` ("glow applies to component edges only and never to text", R-04) is **not approved here**. The owner has not answered it, so it stays a draft callout until the owner decides.
- Active and loading states were not shown on the comparison page. They are not decided here. The later task proposes values, and the owner is asked if the case is unclear.
- The focus indicator is unchanged (ADR-0009). Email does not use glow (R-05).
