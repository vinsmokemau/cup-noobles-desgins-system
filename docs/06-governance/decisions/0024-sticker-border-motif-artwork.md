---
title: "ADR-0024: Sticker border motif artwork"
slug: adr-0024-sticker-border-motif-artwork
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-05, BR-13, BR-14]
tbd: []
related: [adr-0023-arcade-lines-motif-artwork, adr-0022-noodle-wave-motif-artwork, adr-0021-golden-d20-motif-artwork, adr-0020-chopsticks-motif-artwork, adr-0019-ramen-cup-motif-artwork, adr-0017-sparkle-motif-artwork, adr-0016-logo-assets-and-rules, imagery-and-motifs, brand-identity]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0024: Sticker border motif artwork

## Context

BR-14 lists "sticker-style borders" as a decorative brand motif. No artwork existed for it (TBD-18, OD-08). ADR-0017 supplied the sparkle, ADR-0019 the ramen cup, ADR-0020 the chopsticks, ADR-0021 the golden d20, ADR-0022 the noodle waves, and ADR-0023 the arcade shapes and dynamic lines. The sticker border was the last motif open.

T7.16 followed the same route. The owner generated four candidates from a prompt that carried the brand rules and the three supplied logo files as style reference, and compared them on a visual comparison page, on the pure-black page (BR-03), around sample content, on a card at phone width, and at 320, 160, and 96 px:

- A, a yellow outer edge with notched corners, a pink inner band, and short white shine marks, with black outlines.
- B, a plain pink rounded band with black outlines and no yellow edge.
- C, a yellow rounded band with one corner peeled back to show pink.
- D, a pink outer band and a yellow inner band, both with notched corners, and a small yellow dot in each corner.

The owner chose A in chat on 2026-10-10, the recommended option. The recommendation rested on four points: A is the closest to the supplied logos, with the yellow sticker edge, the pink, and the same thick black line weight; the notched corners read as a die-cut sticker without drawing a new object; the centre stays fully free; and B has no yellow edge, C's peeled corner pushes into the content area, and D's thin bands crowd at small sizes.

The generated image is a 1448 × 1086 PNG with a transparent background and an empty centre. Its pink (about `#fa5b99`) and yellow (about `#fff050`) are the generator's colours, not brand values.

No `frontend-design` audit was run: the decision adopts artwork the owner chose, and adds no colour and no size.

## Decision

The values come from the owner in chat, 2026-10-10.

1. **Artwork.** The sticker border is proposal A: a yellow outer edge with notched corners, a pink inner band, and the short white shine marks, with black outlines and an empty centre.
2. **File.** The owner converts the chosen PNG to SVG, and the file is stored as `packages/nuxt/assets/brand/Sticker-Border-CN.svg`, beside `Sparkle-CN.svg`, `Ramen-Cup-CN.svg`, `Chopsticks-CN.svg`, `D20-CN.svg`, `Noodle-Wave-CN.svg`, `Arcade-Lines-CN.svg`, and the three logos.
3. **Colours.** The traced artwork is recoloured to brand tokens: pink `#ef80ae` (`color.brand.pink`, BR-01), yellow `#fff488` (`color.brand.yellow`, BR-02), and black `#000000` for outlines (BR-03). The colours generated with the image are not brand values and are not kept.
4. **One pink, one yellow.** Every pink area is `#ef80ae` and every yellow area is `#fff488`. The brand defines no tints (TBD-08), so any depth comes from the black outlines only.
5. **White shine marks.** The short shine marks on the yellow edge stay white (`#ffffff`). The owner chose white in chat, 2026-10-10, over drawing them in yellow or removing them. This allows white only for those shine marks. It does not decide the body text colour (TBD-04), and it does not make white a brand colour.
6. **Transparent, empty centre.** The SVG has no background shape or fill, and nothing inside the frame. It carries a `viewBox`, and has no raster `<image>`, no script, no external reference, and no text.
7. **Clean.** The file carries no editor metadata, no `id`, and no style block: each path carries its own fill. The owner asked Claude to make these cleanups in chat, 2026-10-10, after the review found the editor metadata (with a content-credentials link), 15 generator and tracer colours, two grey tones, a style block, and about 40 stray sliver shapes. The cleanup mapped every colour to the four brand values, merged each run of same-colour fragments into one path, closed the hairline gaps between them, and dropped the sub-pixel specks. It did not change the shapes: the cleaned file differs from the traced one by under 1% of its pixels, all at edges.
8. **Fixed ratio.** The supplied SVG is a frame of about 8:5 (`viewBox` 1415.74 × 885.87), cropped tight to the artwork. A component that uses it fits content inside the empty centre and does not stretch the frame to another ratio. Wiring it into `CnStickerFrame` is a later task.
9. **Still decorative.** Any component that renders it follows REQ-029: `aria-hidden`, no label or role, and no focusable element.
10. **All seven artworks supplied.** With this artwork, every motif of BR-14 has its file: the sparkle, the ramen cup, the chopsticks, the golden d20, the noodle waves, the arcade shapes and dynamic lines, and the sticker border. TBD-18 stays open only for the placeholder look that `CnStickerFrame` still draws until it renders this file.

## Consequences

- T7.16 is done when the SVG is stored and reviewed. This ADR adds no component: no component renders the sticker border yet, and wiring it in is a later task.
- `imagery-and-motifs.md`, `brand-identity.md`, and `sticker-frame.md` name the supplied file. They stay `draft`: `CnStickerFrame` still shows a plain outline, and its placeholder tokens (TBD-05, TBD-10, TBD-11) are unchanged.
- TBD-18 is not marked resolved. Resolving it means wiring the file into `CnStickerFrame` and replacing the `motif.*` placeholder tokens, which T7.16 does not do. That is a later task.
- OD-08 is decided for the logos (ADR-0016), the sparkle (ADR-0017), the ramen cup (ADR-0019), the chopsticks (ADR-0020), the d20 (ADR-0021), the noodle waves (ADR-0022), the arcade lines (ADR-0023), and now the sticker border.
- Changing the artwork or its colours takes a new ADR that supersedes this one.
