---
title: "ADR-0019: Ramen cup motif artwork"
slug: adr-0019-ramen-cup-motif-artwork
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-05, BR-13, BR-14]
tbd: []
related: [adr-0017-sparkle-motif-artwork, adr-0016-logo-assets-and-rules, imagery-and-motifs, brand-identity]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0019: Ramen cup motif artwork

## Context

BR-14 lists "a pink ramen cup with gamer details" as a decorative brand motif, and calls it the core brand icon. No artwork existed for it (TBD-18, OD-08). ADR-0017 supplied the sparkle and left the other six motifs open.

T7.11 followed the same route as ADR-0017. The owner generated four candidates from a prompt that carried the brand rules and the three supplied logo files as style reference, and compared them on a visual comparison page, on the pure-black page (BR-03), at 96, 64, 40, and 24 px, beside the horizontal logo, and on a card at phone width:

- A, a pink cup with a peeled lid and tall yellow noodles, and a game controller leaning on its side.
- B, a simple cup with a half-open lid and a yellow pixel heart on the front.
- C, a tilted cup with a joystick in the noodles and small motion marks.
- D, a cup wearing a gaming headset with a microphone.

The owner chose A in chat on 2026-10-10, the recommended option. The recommendation rested on four points: A is the only proposal that reads at once as a ramen cup and as a gaming object; it keeps the line weight, the sticker halo, and the pink and yellow of the supplied logos; it stays recognisable at 40 px; and C and D hide the cup behind the gamer detail. B was named as the fallback for sizes of 24 px and below.

The generated image is a 1254 × 1254 PNG with a transparent background. Measured from the file, about 96% of its opaque pixels sit close to pink, yellow, or black. Its pink (about `#fb69a4`) and yellow (about `#fcf271`) are the generator's colours, not brand values.

No `frontend-design` audit was run: the decision adopts artwork the owner chose, and adds no colour and no size.

## Decision

The values come from the owner in chat, 2026-10-10.

1. **Artwork.** The ramen cup is proposal A: the pink cup with the controller beside it.
2. **File.** The owner converts the chosen PNG to SVG, and the file is stored as `packages/nuxt/assets/brand/Ramen-Cup-CN.svg`, beside `Sparkle-CN.svg` and the three logos.
3. **Colours.** The traced artwork is recoloured to brand tokens: pink `#ef80ae` (`color.brand.pink`, BR-01), yellow `#fff488` (`color.brand.yellow`, BR-02), and black `#000000` for outlines (BR-03). The colours generated with the image are not brand values and are not kept.
4. **Transparent.** The SVG has no background shape or fill. It carries a `viewBox`, is cropped tight to the artwork, and has no raster `<image>`, no script, no external reference, and no text.
5. **Clean.** The stray specks outside the artwork in the generated PNG are dropped in the trace, and the file carries no editor metadata.
6. **Glints.** The two small shine marks on the cup, generated in white, are drawn in `#fff488`. No white is introduced, because the body text colour (TBD-04) is still open. The owner chose yellow in chat, 2026-10-10, over removing them.
7. **Still decorative.** Any component that renders it follows REQ-029: `aria-hidden`, no label or role, and no focusable element.
8. The five remaining motifs of BR-14 — the noodle curves, the golden d20, the chopsticks, the arcade shapes, and the sticker border — are not part of this decision. TBD-18 stays open for them.

## Consequences

- T7.11 is done when the SVG is stored and reviewed. This ADR adds no component: no component renders the ramen cup yet, and wiring it in is a later task.
- `imagery-and-motifs.md` and `brand-identity.md` name the supplied file for the ramen cup row and stay `draft` for the other five motifs.
- OD-08 is decided for the logos (ADR-0016), the sparkle (ADR-0017), and now the ramen cup. It stays open for the rest of BR-14.
- Changing the artwork or its colours takes a new ADR that supersedes this one.
