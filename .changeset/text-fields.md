---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the input, the textarea, and the select (T7.4, REQ-020). The tokens package gains the shared text-field component tokens `input.*` (the fill, text, placeholder, outline, hover outline, error outline and text, and the focus ring), `radius.input`, and `border.width.input`. The Nuxt layer themes `UInput`, `UTextarea`, and `USelect` with one look: a neutral outline that turns pink on hover, the error color when the control has `aria-invalid="true"`, and a yellow focus ring that is an outline. The select list draws its keyboard-active option with the focus ring. The text, placeholder, outline, and error colors, the radius, and the stroke width still follow ADR-0006 placeholders (TBD-04, TBD-05, TBD-07, TBD-10, TBD-11).
