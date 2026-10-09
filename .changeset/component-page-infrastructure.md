---
'@vinsmokemau/cup-noobles-tokens': patch
---

Add the component page infrastructure to the showcase (REQ-055, REQ-026 AC2, AC3): a demo registry driven by the `demos` frontmatter, the state matrix, playground (reading `controls.ts`), and code block with copy, a viewport frame that shows the isolated `/_demo/[slug]/[demo]` route in an iframe at 360, 768, or 1280 px, and a helper that asserts a visual baseline for every state.
