---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Set the breakpoints and the container width (ADR-0035, TBD-13). The values keep Tailwind's five steps (640, 768, 1024, 1280, and 1536 px) and a 1280 px container, so no layout changes. reakpoint.* and layout.container.max are now stable, the tokens package gains the primitive container.max, and the placeholder.breakpoint.* and placeholder.container.max tokens are removed.
