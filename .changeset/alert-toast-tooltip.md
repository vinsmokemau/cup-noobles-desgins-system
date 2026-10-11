---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the alert, the toast, and the tooltip (T8.3, REQ-020, REQ-026, REQ-027). The tokens package gains the component tokens `alert.*`, `toast.*`, and `tooltip.*` (the fill, the feedback color of each of the four types, the text colors, and the focus ring), plus `radius.*` and `border.width.*` for each. The Nuxt layer themes `UAlert`, `UToast`, and `UTooltip` with one look chosen by the owner (ADR-0027): the black page, a thick outline and an icon in the feedback color, and, for the tooltip, a brand pink outline, with no glow. The toast's countdown bar is hidden, and the open and close animations stop under reduced motion. The feedback colors, text colors, radius, and stroke width still follow ADR-0006 placeholders (TBD-04, TBD-05, TBD-07, TBD-10, TBD-11).
