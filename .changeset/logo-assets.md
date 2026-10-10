---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

`CnLogo` renders the supplied brand logos (T7.9, REQ-030 AC3, ADR-0016). The three SVG files (the CN icon, the vertical lockup, and the horizontal wordmark) are in the Nuxt layer's `assets/brand/`, and `CnLogo` shows them unmodified as image files. The clear space is 25% of the logo height on every side, and the minimum heights are 64 px (icon), 80 px (vertical), and 36 px (horizontal). The tokens package gains `logo.rule.*`, `layout.logo.*`, and the component tokens `logo.clearSpace` and `logo.minHeight.*`, and loses the placeholder tokens `logo.placeholder.*` and `border.width.logo`. A page makes a logo larger with the `--logo-height` custom property. The "Logo asset pending (TBD-17)" placeholder is removed, and TBD-17 is resolved.
