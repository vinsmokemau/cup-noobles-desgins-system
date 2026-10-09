---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add `CnLogo` (T7.7, REQ-030, REQ-021, REQ-022), the first custom component of the Nuxt layer. It takes a `variant` (`icon`, `vertical`, or `horizontal`) and a required accessible `label`, or `decorative`. The logo files are not supplied yet (TBD-17), so all three variants render a neutral placeholder with the text "Logo asset pending (TBD-17)" and no artwork. The tokens package gains the component tokens `logo.placeholder.*` and the shape token `border.width.logo`. The placeholder outline and note color, and its stroke width, follow ADR-0006 placeholders (TBD-05, TBD-11).
