---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the link, the icon, and the badge (T7.3, REQ-020). The tokens package gains the component tokens `link.*` (the text colors and the focus ring), `badge.*` (the fill, label, and outline of the `primary`, `outline`, and `tag` variants), `radius.badge`, and `border.width.badge`. The Nuxt layer themes `ULink` (pink, always underlined, with a yellow focus ring) and `UBadge` for the three brand variants (`color="primary" variant="solid"`, `color="primary" variant="outline"`, and `color="secondary" variant="solid"`, the tag badge of BR-12). `UIcon` needs no theme: it inherits the text color. The badge radius and stroke width still follow ADR-0006 placeholders (TBD-10, TBD-11), and the icon set is still open (TBD-19, OD-09).
