---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the form field and the standard card (T8.1, REQ-020, REQ-025). The tokens package gains the card component tokens `card.*` (the fill, the pink highlight outline, the dividers, and the text colors), `radius.card`, and `border.width.card`, and the form field tokens `formField.*` (the label, description, help, and error text colors). The Nuxt layer themes `UCard` with one look chosen by the owner (ADR-0018): the black page, a thick brand-pink outline, pink dividers between header, body, and footer, and no glow. The card does not read `color.surface.card` (C-05, TBD-06). `UFormField` is themed with token text colors, and Nuxt UI ties its label, help, and error to the control. The text colors, the radius, and the stroke width still follow ADR-0006 placeholders (TBD-04, TBD-05, TBD-07, TBD-10, TBD-11).
