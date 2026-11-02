---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-email': minor
---

Add image attributes to `CnMediaCard` and `CnImageGallery`. Every picture now has `width="4"` and `height="3"`, the ratio of the 4:3 frame, so a grid no longer shifts while it loads. `CnMediaCard` loads its picture lazily, and a new `priority` prop marks a card above the fold: it loads at once with `fetchpriority="high"`. `CnImageGallery` loads the opening picture at once and the others lazily, and takes the same `priority` prop. The frame, the fit, and the look do not change.
