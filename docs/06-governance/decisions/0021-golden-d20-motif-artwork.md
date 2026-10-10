---
title: "ADR-0021: Golden d20 motif artwork"
slug: adr-0021-golden-d20-motif-artwork
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-05, BR-13, BR-14]
tbd: []
related: [adr-0019-ramen-cup-motif-artwork, adr-0017-sparkle-motif-artwork, adr-0016-logo-assets-and-rules, imagery-and-motifs, brand-identity]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0021: Golden d20 motif artwork

## Context

BR-14 lists "a golden d20 die" as a decorative brand motif. No artwork existed for it (TBD-18, OD-08). ADR-0017 supplied the sparkle, ADR-0019 supplied the ramen cup, and the other five motifs stayed open.

T7.12 followed the same route as ADR-0019. The owner generated four candidates from a prompt that carried the brand rules and the three supplied logo files as style reference, and compared them on a visual comparison page, on the pure-black page (BR-03), at 64 and 32 px, beside the text, on an outlined badge, and beside the CN icon, the ramen cup, and the sparkle:

- A, a straight-on golden d20 with even black outlines and four white shine marks.
- B, the same view with one shine mark and outlines that thin to slivers at the left and right edges.
- C, a tilted die with three motion bars, one of them pink.
- D, a straight-on die with one pink stripe on a face and thin side outlines.

The owner chose A in chat on 2026-10-10, the recommended option. The recommendation rested on three points: A is the only proposal whose outlines are even all around (BR-13); it is symmetric, so it sits straight beside text and beside the ramen cup; and it keeps its detail at 32 px, where the motion bars of C thin out.

The generated image is a 1254 × 1254 PNG with a transparent background. Its yellow (about `#fff27a`) is the generator's colour, a little deeper than the brand yellow, and it is not a brand value. Its shine marks are white. White is not a defined brand value (TBD-04 is open), and a yellow mark cannot show on a yellow face, so the marks needed a decision of their own. The owner chose, in chat on 2026-10-10, to remove them (option N) over drawing them in brand pink (P, the recommended option) or keeping them white (W).

No `frontend-design` audit was run: the decision adopts artwork the owner chose, and adds no colour and no size.

## Decision

The values come from the owner in chat, 2026-10-10.

1. **Artwork.** The golden d20 is proposal A: the straight-on die with even black outlines.
2. **File.** The owner converts the chosen PNG to SVG, and the file is stored as `packages/nuxt/assets/brand/D20-CN.svg`, beside the ramen cup, `Sparkle-CN.svg`, and the three logos.
3. **Colours.** The traced artwork is recoloured to brand tokens: yellow `#fff488` (`color.brand.yellow`, BR-02) for the die and black `#000000` for outlines (BR-03). The colours generated with the image are not brand values and are not kept.
4. **No shine marks.** The four white shine marks of the generated image are not part of the artwork. The die is flat gold with black outlines. No white is introduced, because the body text colour (TBD-04) is still open, and no pink is added.
5. **Transparent.** The SVG has no background shape or fill. It carries a `viewBox`, is cropped tight to the artwork, and has no raster `<image>`, no script, no external reference, and no text.
6. **Clean.** The stray specks around the outer yellow edge of the generated PNG are dropped in the trace, and the file carries no editor metadata.
7. **Correction.** The owner's first trace kept the generator's colours, the four white shine marks, and the editor metadata. At the owner's request in chat, 2026-10-10, Claude corrected the file to this decision: the four mark areas are filled with `#fff488` (with a 3-unit `#fff488` stroke to close hairline seams), every other yellow is `#fff488`, the near-black is `#000000`, and the metadata, the style block, and the ids are removed. No outline was redrawn.
8. **Still decorative.** Any component that renders it follows REQ-029: `aria-hidden`, no label or role, and no focusable element.
9. The four remaining motifs of BR-14 — the noodle curves, the chopsticks, the arcade shapes, and the sticker border — are not part of this decision. TBD-18 stays open for them.

## Consequences

- T7.12 is done when the SVG is stored and reviewed. This ADR adds no component: no component renders the d20 yet, and wiring it in is a later task.
- `imagery-and-motifs.md` and `brand-identity.md` name the supplied file for the d20 row and stay `draft` for the other four motifs.
- OD-08 is decided for the logos (ADR-0016), the sparkle (ADR-0017), the ramen cup (ADR-0019), and now the d20. It stays open for the rest of BR-14.
- Changing the artwork or its colours takes a new ADR that supersedes this one.
