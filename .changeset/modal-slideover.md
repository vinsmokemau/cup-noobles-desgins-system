---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the modal and the slideover (T8.5, REQ-020, REQ-026, REQ-027). The tokens package gains the component tokens `overlay.*` (the fill, the pink highlight outline, the dividers, the black backdrop and its amount, the shadow, the stacking order, and the text colors), `radius.overlay`, and `border.width.overlay`, plus the semantic token `effect.scrim.opacity` and its primitive `effect.opacity.scrim`. The Nuxt layer themes `UModal` and `USlideover` with one look chosen by the owner (ADR-0029): a dimmed black backdrop, and a black panel with a thick brand-pink outline, pink dividers, and no glow. The behavior is Nuxt UI's: focus is trapped and restored, Escape closes, and the page behind is hidden from assistive technology and cannot be reached or clicked. The opening movement stops under reduced motion. The backdrop amount (0.75, Nuxt UI's default), the text colors, the radius, the stroke width, the shadow, and the stacking order still follow ADR-0006 placeholders (TBD-04, TBD-05, TBD-10, TBD-11, TBD-15).
