---
title: "ADR-0017: Sparkle motif artwork and size"
slug: adr-0017-sparkle-motif-artwork
layer: adr
status: stable
lang: en
brandRules: [BR-02, BR-03, BR-05, BR-13, BR-14]
tbd: []
related: [adr-0016-logo-assets-and-rules, adr-0006-placeholder-values, sparkle, sticker-frame, imagery-and-motifs]
since: 0.1.0
updated: 2026-10-09
---

# ADR-0017: Sparkle motif artwork and size

## Context

BR-14 lists "sparkles and stars" as a decorative brand motif. T7.8 built `CnSparkle` with a neutral outlined placeholder carrying the text "Motif pending (TBD-18)", because no artwork existed (TBD-18, OD-08).

The owner has no design tool and no illustrator, so the artwork was commissioned from an image generator. The owner generated four candidates from a prompt that carried the brand rules and the three supplied logo files as style reference, and compared them on a visual comparison page, on the pure-black page (BR-03), at 64, 32, 24, and 16 px and beside a heading:

- A, a single four-pointed sparkle in gold, matching the proportions of the sparkles already drawn inside the logo files.
- B, the same drawing in brand pink.
- C, a cluster of four sparkles in mixed sizes with one pink accent.
- D, the same drawing as A at a heavier weight, nearly square.

The owner chose A in chat on 2026-10-09, the recommended option. The recommendation rested on two points already settled elsewhere: pink is the colour of links and actions in this system, and ADR-0015 rejected a pink separator for that same reason; and a single sparkle lets a page compose its own cluster, while the cluster of option C bakes one arrangement in and turns to noise below about 32 px.

The generated image was a 1254 × 1254 PNG. It was traced to SVG, cropped tight to the artwork, and recoloured from the generated `#FEF173` to the brand token. The trace was checked by rendering it back and comparing it with the owner's PNG pixel by pixel: it differs by 0.34% of the shape, which is the anti-aliased edge. Four trace settings were compared; the one kept gives 14 segments in a single path at 875 bytes, and tightening it further added segments without improving the match.

No `frontend-design` audit was run: the decision adopts artwork the owner chose and adds no colour, and the one size rule is a ratio to existing type rather than a new value.

## Decision

The values come from the owner in chat, 2026-10-09.

1. **File.** `CnSparkle` renders `Sparkle-CN.svg` from `packages/nuxt/assets/brand/`, as an image (`<img>`), never edited or recoloured, and never inlined as markup in the page. The file is cropped tight to the artwork and carries a `viewBox` and no width or height, as the logo files do (ADR-0016). It is small enough that the bundler may serve it as a `data:` URI instead of a separate request; that is still an image, so the artwork's shapes stay out of the accessibility tree and its styles cannot collide with the page, which is what the rule protects.
2. **Colour.** The artwork is filled with `#fff488`, the value of `color.brand.yellow` (BR-02). The colour generated with the image is not a brand value and is not kept.
3. **Gold, not pink.** The sparkle is yellow because pink carries meaning in this system: it marks links and actions. A decoration that borrows that colour invites a click that does nothing (BR-05, and the same reasoning as ADR-0015).
4. **Size.** A sparkle is as tall as the text beside it: `height: 1em`. A page can override it with the `--sparkle-size` custom property for a larger decorative sparkle. No fixed pixel size is defined, so this adds no new value to the system.
5. **The fade.** With artwork in place the `animated` fade applies to the whole sparkle's opacity. The T7.8 placeholder faded only its outline, because fading the placeholder's note text dropped it to 2.61:1 and axe failed it; the artwork carries no text, so that constraint is gone. The fade still stops under `prefers-reduced-motion` (REQ-029 AC2).
6. **Still decorative.** REQ-029 AC1 is unchanged: the sparkle renders `aria-hidden`, carries no label or role, and holds no focusable element.
7. The six remaining motifs of BR-14 — the sticker border, the ramen cup, the noodle curves, the golden d20, the chopsticks, and the arcade shapes — are not part of this decision. TBD-18 stays open for them.

## Consequences

- The placeholder text, the `.cn-sparkle` placeholder rule, and the `motif.placeholder.fg` token are removed, along with that token's contrast pair, and the sparkle baselines are remade.
- `motif.placeholder.bg`, `motif.placeholder.border`, `border.width.motif`, and `radius.motif` stay, because `CnStickerFrame` still draws its placeholder outline from them while TBD-18 is open for the sticker border.
- `sparkle.md` states the artwork and the size rule, and stays `draft`: the fade duration still follows the TBD-14 placeholder, as `skeleton.md` does.
- `imagery-and-motifs.md` and `brand-identity.md` name the supplied file for the sparkle row and stay `draft` for the other six motifs.
- OD-08 is decided for the logos (ADR-0016) and now for the sparkle. It stays open for the rest of BR-14.
- Changing the artwork, the colour, or the size rule takes a new ADR that supersedes this one, and new visual baselines.
