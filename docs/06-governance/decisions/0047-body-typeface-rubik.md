---
title: "ADR-0047: The body typeface is Rubik"
slug: adr-0047-body-typeface-rubik
layer: adr
status: stable
lang: en
brandRules: [BR-05, BR-09]
tbd: []
related: [typography, adr-0046-display-typeface-titan-one, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0047: The body typeface is Rubik

## Context

TBD-02 left the body typeface open, or a confirmation that one family covers both display and body. ADR-0046 chose Titan One for headings, button labels, and badges, and limited it to those uses, so a separate body family is needed. The owner reviewed five candidates on a comparison page, each paired with Titan One on a paragraph, a caption, a form field, and a price table: Rubik, Figtree, Atkinson Hyperlegible, Nunito, and the system font stack. The page marked Rubik as the recommendation.

## Decision

The owner chose **Rubik** as the body typeface, in chat on 2026-10-18 ("A"). A 360 px audit followed before this record.

Rules from the audit:

- Rubik covers body text, captions, form fields, tables, and prices.
- Do not use the 300 weight. It looks thin on the pure-black base (BR-03). Regular (400), medium (500), and bold (700) are the weights in use.
- Captions are at least 13 px.
- Do not rely on Rubik to tell `0` from `O`, or `l` from `I`. Codes and identifiers need another treatment, set when such a component exists.

How it meets the selection criteria:

| # | Criterion | Result |
|---|---|---|
| 1 | Bold, retro display sans-serif close to the logo | Not applicable. It is not the display family (ADR-0046). Its slightly rounded corners pair well with Titan One. |
| 2 | Spanish diacritics | Met. Rendered in a browser test with no fallback glyphs: `áéíóú ÁÉÍÓÚ ñ Ñ ü Ü ¿ ¡`. |
| 3 | License covers web embedding | Met. SIL Open Font License, Version 1.1. Copyright 2015 The Rubik Project Authors (`https://github.com/googlefonts/rubik`). No Reserved Font Name is named. Source: `ofl/rubik/OFL.txt` in the `google/fonts` repository. |
| 4 | Defined email fallback | Pending. Most email clients ignore web fonts (R-05). The fallback stack shown on the comparison page was an example, and it is confirmed and recorded in `email-foundations.md` when that doc is updated. |
| 5 | Legible at body and caption sizes | Met at 14 and 16 px. The 12 px caption was small, so captions are at least 13 px. |

## Consequences

- TBD-02 is decided. The owner's choice is Rubik, subject to the rules above.
- The SPEC.md §2.4 row for TBD-02, the TBD-02 callouts in `typography.md`, and the tokens that name TBD-02 change in a later task, not in this ADR. Until then the placeholder stack stays, and `pnpm check:tbd` still counts TBD-02 as open.
- The email fallback stack stays open until confirmed.
- The font files are self-hosted from the Google Fonts repository under the OFL. A later task adds them, with the license text shipped alongside.
- TBD-03 (type scale) is a separate decision. It must respect the 14 px label minimum from ADR-0046 and the 13 px caption minimum here.
