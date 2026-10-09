---
'@vinsmokemau/cup-noobles-tokens': patch
---

Show a swatch for every color token on the showcase's `/foundations/color` page (REQ-054 AC1, AC4). Each swatch carries its contrast ratio against `color.bg.base` and a pass or fail badge. The ratio comes from the same math as `check-contrast`, now in `scripts/contrast.ts`. A `tbd` token shows a hatched overlay and its TBD id, and a `derived-pending` token shows its status badge.
