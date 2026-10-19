---
'@vinsmokemau/cup-noobles-nuxt': patch
---

Put the layer's spacing on the Rhythm of 8 (ADR-0049). Every spacing that was a multiple of `--cn-space-base` now uses a named step: `--cn-space-lg` for the 24 px minimum size of controls, `--cn-space-md` for the media card padding, and `--cn-space-sm` for the gap between its tags. The gap between the media card title and its tags was 12 px, which is not a step; it is now `--cn-space-md` (16 px).
