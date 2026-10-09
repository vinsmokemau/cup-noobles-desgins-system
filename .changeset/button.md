---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the button (T7.2, REQ-023). The tokens package gains the component tokens `radius.button`, `border.width.button`, `effect.glow.button`, and `button.*` (the primary, secondary, and ghost fills, labels, and outlines, and the focus ring), the semantic tokens `radius.interactive` and `border.width.interactive`, and the derived-pending hover and pressed fills `color.brand.primaryHover`, `primaryActive`, `secondaryHover`, and `secondaryActive`. The Nuxt layer themes `UButton` for the three brand variants (`color="primary" variant="solid"`, `color="secondary" variant="solid"`, and `color="primary" variant="ghost"`), with rounded corners, a thick outline, a glow that a disabled button does not have, and a yellow focus ring that is an outline, not the glow. The radius, stroke width, and glow still follow ADR-0006 placeholders (TBD-10, TBD-11, TBD-12).
