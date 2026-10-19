---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-email': minor
---

Apply the shape and spacing decisions. The spacing scale is the Rhythm of 8: a 4 px base and seven steps above it, `space.sm` to `space.xxxxl` (ADR-0049). The corner radius is Chunky: `radius.sm`, `radius.md`, and `radius.lg` are 8, 12, and 20 px (ADR-0050), and components read them through the `radius.compact`, `radius.interactive`, and `radius.container` roles. Buttons, text fields, pagination, alerts, and toasts are 12 px, badges, checkboxes, and tooltips are 8 px, and cards, media cards, and overlay panels are 20 px. Email components take their padding from the scale in place of `space.base`. The ADR-0006 placeholder file is gone.

The shape, spacing, badge, and three email docs are stable.
