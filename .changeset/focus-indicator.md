---
'@vinsmokemau/cup-noobles-tokens': minor
---

Resolve TBD-16 (ADR-0009). The focus indicator is now a solid brand-yellow ring, 3 px wide, with a 3 px gap: `focus.ring.color` references `color.brand.yellow`, and `focus.ring.width`, `focus.ring.offset`, and `focus.ring.style` reference the new stable primitives `focus.width.default`, `focus.offset.default`, and `focus.style.default`. `--cn-focus-ring-color` changes from the neutral placeholder to `#fff488`, and `--cn-focus-ring-offset` changes from `0` to `3px`. The unused `placeholder.focus.*` tokens are removed.
