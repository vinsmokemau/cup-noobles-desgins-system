---
title: "ADR-0048: The type scale is Balanced"
slug: adr-0048-type-scale-balanced
layer: adr
status: stable
lang: en
brandRules: [BR-08, BR-09]
tbd: []
related: [typography, adr-0046-display-typeface-titan-one, adr-0047-body-typeface-rubik, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0048: The type scale is Balanced

## Context

TBD-03 left the type scale open: sizes, line heights, weights, and letter spacing for H1, H2, H3, body, and caption (BR-08). ADR-0046 fixed Titan One for headings, with a 14 px minimum for button and badge labels, and ADR-0047 fixed Rubik for body text, with a 13 px minimum for captions and no 300 weight. The owner reviewed three scales on a comparison page at 360, 768, and 1280 px: Compact, Balanced, and Bold. Text fit was measured in a browser at 360 px. The page marked Balanced as the recommendation.

## Decision

The owner chose **Balanced** in chat on 2026-10-18 ("B"). A check at 1280 px followed before this record.

| Level | Size | Line height | Weight | Letter spacing |
|---|---|---|---|---|
| H1 | 2.5rem (40 px) | 2.75rem (44 px) | 400 | 0 |
| H2 | 1.875rem (30 px) | 2.125rem (34 px) | 400 | 0 |
| H3 | 1.375rem (22 px) | 1.625rem (26 px) | 400 | 0 |
| Body | 1rem (16 px) | 1.625rem (26 px) | 400 | 0 |
| Caption | 0.8125rem (13 px) | 1.125rem (18 px) | 400 | 0 |

These values are the owner's choice for an open item. They are not brand values from the brand context. Weight 400 at every level follows from Titan One having one weight (ADR-0046) and from ruling out Rubik 300 (ADR-0047). Sizes are in rem, so text follows the user's browser setting.

Measured at 360 px (content width 328 px): the sample H1 "Noche de torneo en Cup Noobles" wraps to three lines, and the 13-letter word "Inscripciones" fits. The 15-letter "Extraordinarios" and the 17-letter "Responsabilidades" overflow the width.

## Consequences

- TBD-03 is decided. The owner's choice is Balanced, with the values above.
- The SPEC.md §2.4 row for TBD-03, the TBD-03 callouts in `typography.md`, and the 56 tokens that name TBD-03 (including the `placeholder.font.*` tokens) change in a later task, not in this ADR. Until then the placeholders stay, and `pnpm check:tbd` still counts TBD-03 as open.
- **Open follow-up, not decided here:** words longer than about 13 letters overflow headings at 360 px. Headings are never scaled down to fit (`typography.md`). The remedy under consideration is hyphenation (`hyphens: auto` with a Spanish language setting). It is not tested and not approved. The later task that applies the scale must test it or bring the owner another option.
- The scale is one set of sizes at every viewport. A scale that shrinks headings on small screens was not offered, because it needs a rule change and new tokens.
- The gaps between levels are set by the spacing scale (TBD-09).
