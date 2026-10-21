---
'@vinsmokemau/cup-noobles-tokens': patch
'@vinsmokemau/cup-noobles-nuxt': patch
'@vinsmokemau/cup-noobles-email': patch
---

Fix a type error in `CnMediaCard` that failed `nuxt typecheck` in a consumer app (TS2352 on the image `error` handler). The layer is now type-checked before each release. No runtime, token, value, or style changes.
