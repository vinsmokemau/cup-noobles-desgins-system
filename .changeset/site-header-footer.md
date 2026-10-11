---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the site header and the site footer (T8.6, REQ-020, REQ-022, REQ-028, REQ-061). The tokens package gains the component tokens `siteHeader.*` and `siteFooter.*` (the black fill, the pink line, and the text color) and `border.width.siteHeader` and `border.width.siteFooter`. The Nuxt layer themes `UHeader` and `UFooter` with one look chosen by the owner (ADR-0030): an opaque black bar with a thick brand-pink line under the header and above the footer, and no glow. Both are slot-based and hold no domain content. With `mode="slideover"`, the header moves its navigation into Nuxt UI's slideover on a narrow screen, which takes the overlay look (ADR-0029). The text colors and the stroke widths still follow ADR-0006 placeholders (TBD-04, TBD-11). The showcase adopts both.
