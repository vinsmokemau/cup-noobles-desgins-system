---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the featured media card `CnMediaCard` (T8.2, REQ-020, REQ-021, REQ-022, REQ-025). The tokens package gains the component tokens `mediaCard.*` (the fill, the pink highlight outline, the line under the thumbnail, the title color, and the focus ring), `radius.mediaCard`, and `border.width.mediaCard`. The Nuxt layer gains `CnMediaCard`: a thumbnail that needs `alt` or `decorative`, a title, tag badges, and an optional link. A linked card is one link with exactly one tab stop, and its accessible name is its title. It has the standard card's look (ADR-0026): the black page, a thick brand-pink outline, no glow, an underlined title on hover, and the yellow focus ring around the whole card. The thumbnail keeps its own proportions until the photography standards are decided (TBD-20). The title color, the radius, and the stroke width still follow ADR-0006 placeholders (TBD-04, TBD-10, TBD-11).
