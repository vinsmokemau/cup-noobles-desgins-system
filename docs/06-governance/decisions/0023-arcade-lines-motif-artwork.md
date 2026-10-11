---
title: "ADR-0023: Arcade shapes and dynamic lines motif artwork"
slug: adr-0023-arcade-lines-motif-artwork
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-05, BR-13, BR-14]
tbd: []
related: [adr-0022-noodle-wave-motif-artwork, adr-0020-chopsticks-motif-artwork, adr-0019-ramen-cup-motif-artwork, adr-0017-sparkle-motif-artwork, adr-0016-logo-assets-and-rules, imagery-and-motifs, brand-identity]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0023: Arcade shapes and dynamic lines motif artwork

## Context

BR-14 lists "arcade-inspired shapes and dynamic lines" as a decorative brand motif. No artwork existed for it (TBD-18, OD-08). ADR-0017 supplied the sparkle, ADR-0019 the ramen cup, ADR-0020 the chopsticks, ADR-0021 the golden d20, and ADR-0022 the noodle waves. The sticker border stayed open.

T7.15 followed the same route. The owner generated four candidates from a prompt that carried the brand rules and the three supplied logo files as style reference, and compared them on a visual comparison page, on the pure-black page (BR-03), at 96, 64, 40, and 24 px, beside the horizontal logo, and on a card at phone width:

- A, a pink cross (a d-pad), a yellow round button, and a pink square button, with three yellow speed lines and a yellow sticker edge.
- B, a yellow lightning bolt, a tilted pink square, and a pink chevron, with thick black outlines and no sticker edge.
- C, two large chevrons, a yellow square key with three trailing bars, and a pixel zig-zag, with a yellow sticker edge.
- D, a pink rounded block with a square window, a pink ball, a yellow bolt, a yellow cross, chevron lines, and a pixel step.

The owner chose A in chat on 2026-10-10, the recommended option. The recommendation rested on four points: A reads as arcade and gamer at once; it keeps the line weight, the yellow sticker edge, and the pink and yellow of the supplied logos; it is a few large shapes, so it traces cleanly to SVG; and B has no sticker edge, so its outline disappears on black, C's pink is far from the brand pink, and D has seven shapes and stray specks.

The generated image is a 1254 × 1254 PNG with a transparent background. Its pink (about `#fa67a0`) and yellow (about `#fbf15c`) are the generator's colours, not brand values.

No `frontend-design` audit was run: the decision adopts artwork the owner chose, and adds no colour and no size.

## Decision

The values come from the owner in chat, 2026-10-10.

1. **Artwork.** The arcade shapes and dynamic lines are proposal A: the pink cross, the yellow round button, the pink square button, and the three yellow speed lines, with the yellow sticker edge.
2. **File.** The owner converts the chosen PNG to SVG, and the file is stored as `packages/nuxt/assets/brand/Arcade-Lines-CN.svg`, beside `Sparkle-CN.svg`, `Ramen-Cup-CN.svg`, `Chopsticks-CN.svg`, `D20-CN.svg`, `Noodle-Wave-CN.svg`, and the three logos.
3. **Colours.** The traced artwork is recoloured to brand tokens: pink `#ef80ae` (`color.brand.pink`, BR-01), yellow `#fff488` (`color.brand.yellow`, BR-02), and black `#000000` for outlines (BR-03). The colours generated with the image are not brand values and are not kept.
4. **One pink.** The generator drew the pink in four shades, a lighter face and darker sides. The brand defines one pink and no tints (TBD-08), so every pink area is `#ef80ae`, and the depth comes from the black outlines only. A shaded look would need a tint decision under TBD-08.
5. **White glints.** The small shine marks on the cross and the two buttons stay white (`#ffffff`). The owner chose white in chat, 2026-10-10, over drawing them in yellow (the ADR-0019 choice) or removing them (the ADR-0021 choice). This allows white only for those shine marks. It does not decide the body text colour (TBD-04), and it does not make white a brand colour.
6. **Transparent.** The SVG has no background shape or fill. It carries a `viewBox`, and has no raster `<image>`, no script, no external reference, and no text.
7. **Clean.** Specks outside the artwork in the generated PNG are dropped in the trace, and the file carries no editor metadata, no `id`, and no style block: each path carries its own fill. The owner asked Claude to make these cleanups in chat, 2026-10-10, after the review found the editor metadata, the generator colours, and four stray sliver paths. The shapes were not changed.
8. **Still decorative.** Any component that renders it follows REQ-029: `aria-hidden`, no label or role, and no focusable element.
9. The remaining motif of BR-14, the sticker border, is not part of this decision. TBD-18 stays open for it.

## Consequences

- T7.15 is done when the SVG is stored and reviewed. This ADR adds no component: no component renders the arcade lines yet, and wiring them in is a later task.
- `imagery-and-motifs.md` and `brand-identity.md` name the supplied file for the arcade row and stay `draft` for the sticker border.
- OD-08 is decided for the logos (ADR-0016), the sparkle (ADR-0017), the ramen cup (ADR-0019), the chopsticks (ADR-0020), the d20 (ADR-0021), the noodle waves (ADR-0022), and now the arcade lines. It stays open for the sticker border.
- Changing the artwork or its colours takes a new ADR that supersedes this one.
