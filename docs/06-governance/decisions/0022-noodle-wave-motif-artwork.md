---
title: "ADR-0022: Noodle curves and waves motif artwork"
slug: adr-0022-noodle-wave-motif-artwork
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-05, BR-13, BR-14]
tbd: []
related: [adr-0020-chopsticks-motif-artwork, adr-0019-ramen-cup-motif-artwork, adr-0017-sparkle-motif-artwork, adr-0016-logo-assets-and-rules, imagery-and-motifs, brand-identity]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0022: Noodle curves and waves motif artwork

## Context

BR-14 lists "noodle-inspired curves and waves" as a decorative brand motif. No artwork existed for it (TBD-18, OD-08). ADR-0017 supplied the sparkle, ADR-0019 the ramen cup, ADR-0020 the chopsticks, and ADR-0021 the golden d20. The other motifs stayed open.

T7.14 followed the same route. The owner generated four candidates from a prompt that carried the brand rules and the three supplied logo files as style reference, and compared them on a visual comparison page, on the pure-black page (BR-03), at 96, 64, 40, and 24 px, beside the horizontal logo, and on a card at phone width:

- A, a pink and a yellow ribbon that loop and cross, with curled ends.
- B, one pink wave with a yellow stripe.
- C, a pink swirl with yellow strands and motion dashes.
- D, four stacked waves with curled ends, three pink and one yellow.

The owner chose D in chat on 2026-10-10, the recommended option. The recommendation rested on four points: D reads as waves and as noodles at a glance; it keeps the line weight, the glossy look, and the pink and yellow of the supplied logos; it is four separate shapes with no overlaps, so it traces cleanly to SVG; and it stays readable at 24 px, where C merges into one blob. A is heavier to trace, B reads as a single tube, and C reads as the letter "Q".

The generated image is a 1254 × 1254 PNG with a transparent background. Its pink and yellow are the generator's colours, not brand values.

No `frontend-design` audit was run: the decision adopts artwork the owner chose, and adds no colour and no size.

## Decision

The values come from the owner in chat, 2026-10-10.

1. **Artwork.** The noodle curves and waves are proposal D: four stacked waves with curled ends, three pink and one yellow.
2. **File.** The owner converts the chosen PNG to SVG, and the file is stored as `packages/nuxt/assets/brand/Noodle-Wave-CN.svg`, beside `Sparkle-CN.svg`, `Ramen-Cup-CN.svg`, `Chopsticks-CN.svg`, `D20-CN.svg`, and the three logos.
3. **Colours.** The traced artwork is recoloured to brand tokens: pink `#ef80ae` (`color.brand.pink`, BR-01), yellow `#fff488` (`color.brand.yellow`, BR-02), and black `#000000` for outlines (BR-03). The colours generated with the image are not brand values and are not kept.
4. **White glints.** The small shine marks on the waves stay white (`#ffffff`). The owner chose white in chat, 2026-10-10, over drawing them in pink (the ADR-0019 choice) or removing them (the ADR-0021 choice). This allows white only for those shine marks. It does not decide the body text colour (TBD-04), and it does not make white a brand colour.
5. **Transparent.** The SVG has no background shape or fill. It carries a `viewBox`, is cropped tight to the artwork, and has no raster `<image>`, no script, no external reference, and no text.
6. **Clean.** Specks outside the artwork in the generated PNG are dropped in the trace, and the file carries no editor metadata.
7. **Still decorative.** Any component that renders it follows REQ-029: `aria-hidden`, no label or role, and no focusable element.
8. The remaining motifs of BR-14 — the arcade shapes and the sticker border — are not part of this decision. TBD-18 stays open for them.

## Consequences

- T7.14 is done when the SVG is stored and reviewed. This ADR adds no component: no component renders the waves yet, and wiring them in is a later task.
- `imagery-and-motifs.md` and `brand-identity.md` name the supplied file for the noodle row and stay `draft` for the other motifs.
- OD-08 is decided for the logos (ADR-0016), the sparkle (ADR-0017), the ramen cup (ADR-0019), the chopsticks (ADR-0020), the d20 (ADR-0021), and now the noodle waves. It stays open for the rest of BR-14.
- Changing the artwork or its colours takes a new ADR that supersedes this one.
