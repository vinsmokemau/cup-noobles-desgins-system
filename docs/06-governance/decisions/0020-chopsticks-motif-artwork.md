---
title: "ADR-0020: Chopsticks motif artwork"
slug: adr-0020-chopsticks-motif-artwork
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-05, BR-13, BR-14]
tbd: []
related: [adr-0019-ramen-cup-motif-artwork, adr-0017-sparkle-motif-artwork, adr-0016-logo-assets-and-rules, imagery-and-motifs, brand-identity]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0020: Chopsticks motif artwork

## Context

BR-14 lists "chopsticks" as a decorative brand motif. No artwork existed for it (TBD-18, OD-08). ADR-0017 supplied the sparkle and ADR-0019 the ramen cup, and left the other motifs open.

T7.13 followed the same route as ADR-0019. The owner generated four candidates from a prompt that carried the brand rules and the three supplied logo files as style reference, and compared them on a visual comparison page, on the pure-black page (BR-03), at 96, 64, 40, and 24 px, beside the horizontal logo, and on a card at phone width:

- A, a glossy pink pair with yellow bands and a yellow sticker edge, the most detailed.
- B, one pink and one yellow stick crossed in an X, with two curved accents at the sides.
- C, a simple pink pair with yellow bands and a yellow sticker edge, on a diagonal.
- D, a plain yellow pair with black outlines, no pink and no sticker edge.

The owner chose C in chat on 2026-10-10, the recommended option. The recommendation rested on four points: C reads at once as a pair of chopsticks; it keeps the line weight, the sticker edge, and the pink and yellow of the supplied logos; its few flat shapes trace cleanly to SVG; and A is heavier to trace, B has stray shapes and specks, and D has no pink or sticker edge, so its black outline disappears on black.

The generated image is a 1254 × 1254 PNG with a transparent background. Its pink (about `#fb60a0`) and yellow (about `#f8f068`) are the generator's colours, not brand values.

No `frontend-design` audit was run: the decision adopts artwork the owner chose, and adds no colour and no size.

## Decision

The values come from the owner in chat, 2026-10-10.

1. **Artwork.** The chopsticks are proposal C: the pink pair with yellow bands and the yellow sticker edge.
2. **File.** The owner converts the chosen PNG to SVG, and the file is stored as `packages/nuxt/assets/brand/Chopsticks-CN.svg`, beside `Sparkle-CN.svg`, `Ramen-Cup-CN.svg`, and the three logos.
3. **Colours.** The traced artwork is recoloured to brand tokens: pink `#ef80ae` (`color.brand.pink`, BR-01), yellow `#fff488` (`color.brand.yellow`, BR-02), and black `#000000` for outlines (BR-03). The colours generated with the image are not brand values and are not kept.
4. **Transparent.** The SVG has no background shape or fill. It carries a `viewBox`, is cropped tight to the artwork, and has no raster `<image>`, no script, no external reference, and no text.
5. **Clean.** Stray specks outside the artwork in the generated PNG are dropped in the trace, and the file carries no editor metadata.
6. **White glints.** The small shine marks on the handle tops stay white (`#ffffff`). The owner chose white in chat, 2026-10-10, over drawing them in yellow (the ADR-0019 choice) or removing them. This allows white only for those shine marks. It does not decide the body text colour (TBD-04), and it does not make white a brand colour.
7. **Still decorative.** Any component that renders it follows REQ-029: `aria-hidden`, no label or role, and no focusable element.
8. The remaining motifs of BR-14 — the noodle curves, the golden d20, the arcade shapes, and the sticker border — are not part of this decision. TBD-18 stays open for them.

## Consequences

- T7.13 is done when the SVG is stored and reviewed. This ADR adds no component: no component renders the chopsticks yet, and wiring them in is a later task.
- `imagery-and-motifs.md` and `brand-identity.md` name the supplied file for the chopsticks row and stay `draft` for the other motifs.
- OD-08 is decided for the logos (ADR-0016), the sparkle (ADR-0017), the ramen cup (ADR-0019), and now the chopsticks. It stays open for the rest of BR-14.
- Changing the artwork or its colours takes a new ADR that supersedes this one.
