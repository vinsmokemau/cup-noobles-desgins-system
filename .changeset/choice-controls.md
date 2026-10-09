---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the checkbox, the radio group, and the switch (T7.5, REQ-020). The tokens package gains the shared component tokens `choice.*` (the fill, the outline, the hover outline, the checked fill, outline, and mark, and the focus ring), `radius.choice`, and `border.width.choice`. The Nuxt layer themes `UCheckbox`, `URadioGroup`, and `USwitch` with one look: an outlined control on the black page whose outline turns pink on hover, a pink fill with a black mark when checked, and a yellow focus ring that is an outline. Each control is at least 24 px square. The outline color, the radius, and the stroke width still follow ADR-0006 placeholders (TBD-05, TBD-10, TBD-11).
