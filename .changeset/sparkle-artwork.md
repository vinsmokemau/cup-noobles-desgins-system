---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

`CnSparkle` now renders the supplied sparkle artwork (T7.10, REQ-029, ADR-0017). The owner chose the motif from four candidates, and it ships as `Sparkle-CN.svg`, filled with `color.brand.yellow` and rendered as an image file that is never edited, recoloured, or inlined. A sparkle is as tall as the text beside it, and a page can resize it with the `--sparkle-size` custom property, so the component introduces no size of its own. The `animated` fade now applies to the whole sparkle rather than the placeholder outline, and still stops under reduced motion. The TBD-18 placeholder text, its rule, and the `motif.placeholder.fg` token are removed, along with that token's contrast pair. `CnStickerFrame` is unchanged and keeps its placeholder outline: the sticker border artwork is still open (TBD-18).
