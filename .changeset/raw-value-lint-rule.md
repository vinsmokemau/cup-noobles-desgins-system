---
'@vinsmokemau/cup-noobles-nuxt': minor
---

Ship the raw-value lint rule (REQ-016) in the layer, so a consuming app runs the same check as this repository. Import the plugin from `@vinsmokemau/cup-noobles-nuxt/eslint/index.js` and turn on `cn/no-raw-values`. The rule fails on color literals and on `px`, `rem`, or `ms` numbers in styles. No token changes.
