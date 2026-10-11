---
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-tokens': minor
---

`CnStickerFrame` renders the supplied `Sticker-Border-CN.svg` unmodified, as an image file, around its slot content (T7.17, REQ-029, ADR-0024, ADR-0025). The frame is now a fixed 8:5 shape that is as wide as its container, or as wide as `--sticker-frame-width` when a page sets one, with the content centred in the empty centre; content larger than the centre is clipped at its edge. It is still `aria-hidden` and `inert`. The plain outline is gone, and with it the tokens `motif.placeholder.bg`, `motif.placeholder.border`, `border.width.motif`, and `radius.motif` and their contrast pair, so a consuming app that read any of those variables must stop. TBD-18 is resolved.
