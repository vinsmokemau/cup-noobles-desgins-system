---
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-tokens': minor
---

Add the `@vinsmokemau/cup-noobles-nuxt` layer. It registers Nuxt UI 4.11.2, forces dark mode (no color-mode module or toggle), loads the token CSS, and maps Nuxt UI's color aliases and theme variables to `--cn-*` variables. The tokens package exports `@vinsmokemau/cup-noobles-tokens/tokens.css` and adds 22 `derived-pending` shade tokens (`color.brand.pink-50` to `-950`, `color.brand.yellow-50` to `-950`), each repeating its single brand color until OD-04 is decided (C-06, TBD-08).
