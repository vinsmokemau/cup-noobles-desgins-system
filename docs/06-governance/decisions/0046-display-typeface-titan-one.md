---
title: "ADR-0046: The display typeface is Titan One"
slug: adr-0046-display-typeface-titan-one
layer: adr
status: stable
lang: en
brandRules: [BR-05, BR-07, BR-09]
tbd: []
related: [typography, adr-0006-placeholder-values, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0046: The display typeface is Titan One

## Context

TBD-01 left the display typeface open: its family, license, and web and email availability. It must match BR-07 (a bold, retro display sans-serif, similar in feel to the logo) and meet the five selection criteria in `typography.md`. The owner reviewed five candidates on a comparison page, each set next to the horizontal logo: Rammetto One, Titan One, Dela Gothic One, Bowlby One, and Bagel Fat One. The page marked Rammetto One as the recommendation. A 360 px audit of Rammetto One and Titan One followed, using the same test content.

## Decision

The owner chose **Titan One** as the display typeface, in chat on 2026-10-18 ("B with the suggested ADR rules"). Rammetto One was the recommendation and the close alternative. The owner preferred Titan One's more compact headings on small screens.

Rules, as approved:

- Use Titan One only for H1 to H3, button labels, and badges.
- Button and badge labels are at least 14 px. The minimum size of headings is set with the type scale (TBD-03).
- Do not use it for body text, captions, form fields, tables, or prices. Those use the body typeface (TBD-02).
- Headings use sentence case, never all caps (BR-05).
- Titan One has one weight. Hierarchy comes from size and color, not weight.

How it meets the selection criteria:

| # | Criterion | Result |
|---|---|---|
| 1 | Bold, retro display sans-serif close to the logo | Met. Reviewed next to the logo; it is very close, and rounder than the logo. The audit flagged a childish risk (BR-05), handled by the usage rules above. |
| 2 | Spanish diacritics | Met. Rendered in a browser test with no fallback glyphs: `áéíóú ÁÉÍÓÚ ñ Ñ ü Ü ¿ ¡`. |
| 3 | License covers web embedding | Met. SIL Open Font License, Version 1.1. Copyright (c) 2011, Rodrigo Fuenzalida, with Reserved Font Name "Titan". Source: `ofl/titanone/OFL.txt` in the `google/fonts` repository. The license allows use, embedding, and redistribution of the font files with this software, provided the Reserved Font Name is not used for a modified version. |
| 4 | Defined email fallback | Pending. Most email clients ignore web fonts (R-05). The fallback stack is an example until the owner confirms it, and it is recorded in `email-foundations.md` when that doc is updated. |
| 5 | Legible at body and caption sizes | Not applicable. It is not a body family. The audit found it crowded at 12 to 14 px, which the usage rules reflect. |

## Consequences

- TBD-01 is decided. The owner's choice is Titan One, subject to the rules above.
- The SPEC.md §2.4 row for TBD-01, the TBD-01 callouts in `typography.md`, and the tokens that name TBD-01 (`font.family.display`, `font.h1.family`, `font.h2.family`, `font.h3.family`, and the shared `placeholder.font.family.sans`) change in a later task, not in this ADR. Until then the placeholder stack stays, and `pnpm check:tbd` still counts TBD-01 as open.
- The email fallback stack stays open until confirmed, as criterion 4 says.
- The font files are self-hosted from the Google Fonts repository under the OFL. A later task adds them, with the license text shipped alongside.
- TBD-02 (body typeface) and TBD-03 (type scale) are separate decisions. The type scale must respect the 14 px label minimum.
