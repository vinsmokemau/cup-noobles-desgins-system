---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-email': minor
---

Add the number formatting rule for identifiers and quantities to `formatting.md`. An identifier (a year, a figure number, an edition number, a code) is shown as plain text with no grouping, and a quantity uses `Intl.NumberFormat('es-MX')`. The consumer decides per attribute, and no component changes.
