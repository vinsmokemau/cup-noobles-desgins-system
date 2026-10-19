---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-email': minor
---

Apply the color and effects decisions. Card and overlay surfaces are the pure-black page, and the pink and yellow scales have a lighter tone for hover and a darker tone for pressed (ADR-0053, ADR-0055). Buttons glow in Neon tube, pink around pink and ghost buttons and yellow around secondary ones, stronger on hover, and never on text (ADR-0051, ADR-0052). Overlays have no shadow, a black backdrop at 85%, and stacking orders of 50 for overlays and 100 for toasts (ADR-0054). A ghost button hovers with the glow only. The layer removes Nuxt UI's partial-opacity color classes from its themes, so no translucent brand color is drawn except the glow. `effects.md` is stable.
