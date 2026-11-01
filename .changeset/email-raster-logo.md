---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-email': minor
---

Add the PNG logo for the email header: `assets/logo-horizontal.png` in the email package, 232 x 72 px on a transparent background, converted from `LogoHorizontal-CN.svg` and shown at 116 x 36 px. The sending project hosts it and passes its address as `{{ logo_url }}`. `pnpm --filter @vinsmokemau/cup-noobles-email build:logo` regenerates it.
