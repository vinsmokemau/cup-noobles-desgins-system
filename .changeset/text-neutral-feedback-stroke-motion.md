---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Set the text, neutral, feedback, stroke, and motion values (ADR-0032, TBD-04, TBD-05, TBD-07, TBD-11, TBD-14). The tokens package gains `color.neutral.*`, `color.signal.*`, the semantic roles `color.text.disabled` and `color.border.divider`, and `motion.duration.fast`, `slow`, and `shimmer`. `color.text.default`, `color.text.muted`, `color.border.default`, `color.feedback.*`, `border.width.default` (3 px), `motion.duration.default` (180 ms), and `motion.easing.default` are now stable values, and the placeholders for stroke and motion are removed. The Nuxt layer reads the neutral roles for Nuxt UI's neutral scale, and the skeleton and sparkle fades and every Tailwind transition read the motion tokens.
