---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-email': minor
---

Add `CnSkipLink` and `CnMain`, a skip-to-content link for keyboard and screen-reader users (WCAG 2.4.1, DSR-14). `CnSkipLink` renders a real `<a href="#main">` with a required `label` (the app writes the text) and a `target` (the id of the main region, `main` by default). It is hidden above the top edge of the page until it receives keyboard focus, then shown above the header as a pink button with black text, the yellow focus ring of ADR-0009, and a height of at least 44 px; it needs no JavaScript. `CnMain` renders `<main id="main" tabindex="-1">` so that activating the link moves keyboard focus to the content; its `id` prop matches the link's `target`. An app puts `<CnSkipLink label="…" />` first in its layout and uses `<CnMain>` for the main region of every page. New tokens `skipLink.*` (all references to existing tokens), a new doc `docs/02-components/atoms/skip-link.md`, ADR-0072, and a new step in `using-the-system.md`.
