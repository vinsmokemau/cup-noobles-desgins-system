---
title: "ADR-0016: Logo assets, clear space, and minimum size"
slug: adr-0016-logo-assets-and-rules
layer: adr
status: stable
lang: en
brandRules: [BR-03, BR-16]
tbd: []
related: [adr-0006-placeholder-values, logo, brand-identity]
since: 0.1.0
updated: 2026-10-09
---

# ADR-0016: Logo assets, clear space, and minimum size

## Context

REQ-030 AC3 says that `CnLogo` renders the supplied logo SVGs unmodified and applies the clear-space and minimum-size rules from `brand-identity.md`. T7.7 built `CnLogo` with a neutral placeholder because the files and the rules did not exist (TBD-17, OD-08).

The owner supplied the three SVG files on 2026-10-09: the circular "CN" icon, the vertical "Cup Noobles" lockup, and the horizontal "Cup Noobles" wordmark (BR-16). The first export had a light-grey rectangle baked into each file, which would show as a grey box on the pure-black page (BR-03). The owner re-exported all three with a transparent background, cropped tight to the artwork. The files are in `packages/nuxt/assets/brand/`.

The owner had no clear-space or minimum-size rules. The owner compared three options for each on a visual comparison page, with the real logos on a black page:

- Clear space: A, 10% of the logo height; B, 25%; C, 50%.
- Minimum size: A, icon 32 px, vertical 64 px, horizontal 24 px; B, icon 64 px, vertical 80 px, horizontal 36 px; C, icon 96 px, vertical 128 px, horizontal 56 px. The page measured the lettering height ("CN", "CUP NOOBLES") against a legibility test of 10 px. Option A failed it for all three logos, and B and C passed.

The owner chose B for both in chat on 2026-10-09, the recommended option in each case. No `frontend-design` audit was run: the choice sets two numbers and adds no color, shape, or motion.

## Decision

The values come from the owner in chat, 2026-10-09.

1. **Files.** `CnLogo` renders `Icon-CN.svg` for `icon`, `LogoVertical-CN.svg` for `vertical`, and `LogoHorizontal-CN.svg` for `horizontal`, from `packages/nuxt/assets/brand/`. They are rendered as image files and never edited, recolored, or inlined (REQ-030 AC3). The three files reuse the same internal class names, so inlining them would let their styles overwrite each other.
2. **Clear space.** The clear space is 25% of the logo's height on every side, measured from the edge of the file. The files are cropped tight to the artwork, so the file edge is the artwork edge.
3. **Minimum size.** The minimum height is 64 px for the icon, 80 px for the vertical lockup, and 36 px for the horizontal wordmark.
4. The rules are tokens: `logo.rule.clearSpace` and `logo.rule.minHeight.*` hold the values, and the semantic and component tiers reference them (REQ-010).
5. The placeholder from T7.7 is removed, because TBD-17 is resolved. The decorative-or-labelled rule of REQ-030 AC1 stays.
6. The motif artwork (TBD-18) is not part of this decision. It stays open.

## Consequences

- TBD-17 is resolved. Every callout and token that named it is removed, and the logo doc and the brand identity doc state the rules.
- The `logo.placeholder.*` and `border.width.logo` tokens, the placeholder rule, and the placeholder text are removed, and the visual baselines are remade.
- `CnLogo` has a minimum height per variant. A page can make a logo larger through the `--logo-height` custom property, and cannot make it smaller than the minimum.
- OD-08 is decided for the logos. It stays open for the motifs (TBD-18), which gate `CnSparkle` and the motif docs.
- Changing a file or a rule takes a new ADR that supersedes this one, and new visual baselines.
