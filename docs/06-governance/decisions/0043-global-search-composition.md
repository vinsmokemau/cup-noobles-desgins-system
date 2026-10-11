---
title: "ADR-0043: The global search is UContentSearch with its own palette and a prerendered data file"
slug: adr-0043-global-search-composition
layer: adr
status: draft
lang: en
brandRules: []
tbd: []
related: [adr-0002-nuxt-content-spike, adr-0029-overlay-look]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0043: The global search is UContentSearch with its own palette and a prerendered data file

## Context

ADR-0002 section 5 chose Nuxt UI's `UContentSearch`, fed by `queryCollectionSearchSections` prerendered to JSON, with token paths and component names as extra `groups`. It listed three things that the search task (T11.1, REQ-056) had to prove, because the spike never rendered the component: the section ids use Content paths and need mapping to the section 4.6 routes, the color-mode command must stay off (REQ-031), and the component itself must render.

T11.1 built it and found four more things:

1. **The route mapping and the color-mode command are as ADR-0002 expected.** A section id is `<content path>#<heading id>`, and `docs/01-foundations/color.md` is served at `/foundations/color`. `color-mode` is a prop, so it is off.
2. **Nuxt UI matches any word of a query.** `UContentSearch` sets `useTokenSearch: true`, so "zzqx-no-such-thing" matches every "no" in "Iconography". A query that looks like nothing in the docs should say "No result".
3. **The listbox has no accessible name, and the scrolling list has no keyboard access.** axe reports `aria-input-field-name` on the listbox and `scrollable-region-focusable` on the results list. `UContentSearch` forwards no attributes to its palette, and the palette has no prop for either.
4. **The keyboard-active result is invisible.** Nuxt UI fills it with `bg-elevated`, which this theme maps to the page black (the select list has the same problem, and T7.4 answered it with a focus ring), and tints a matched word with `bg-primary/15`, a shade of the brand pink that is not a token (C-06).

## Decision

- **The modal and the shortcut are `UContentSearch`.** `UContentSearchButton` in the header opens the same state. The palette inside the modal is a `UCommandPalette` given through the component's `content` slot, which is the markup `UContentSearch` renders by default, with the groups of the showcase and two attributes added.
- **The data is a file, read on first open.** `server/routes/search-sections.json.ts` is prerendered to `/search-sections.json`. It holds the frontmatter of each doc (title, layer, component names) and one row per heading with its anchor, without the section text. Token paths come from `tokens.flat.json`, loaded with the file. A page that is never searched loads neither.
- **Three groups, in a fixed order.** Pages (every doc, found by its title or its component name, such as `UButton` or `CnMediaCard`), Sections (every heading below the page title, linked to its anchor), and Tokens (every token path, linked to its row on `/tokens`). With nothing typed, only the pages are listed.
- **A query has to look like the whole name.** `useTokenSearch` is off, so the threshold of 0.1 and `ignoreLocation` apply to the query as typed. Each group shows at most 20 rows.
- **The listbox is named "Search results" and is the scrolling, focusable part.** `SiteSearch.vue` sets `aria-label` and `tabindex="0"` on it while the search is open, and moves the scrolling from the inner list to the listbox with `ui` classes. The inner list stays `role="presentation"`, which a listbox allows only while it is not focusable.
- **The layer themes the palette with parts that exist.** `commandPalette.slots.item` is `cn-select-item`, so the active result shows the select list's focus ring (T7.4). A matched word is bold and underlined, with no fill. No color, radius, or width is added.

## Consequences

- Nothing here introduces a brand value. The panel is the modal of ADR-0029, the focus ring is the one the select list uses, and every other value is a Nuxt UI semantic class that already maps to a token.
- `shims.d.ts` declares the Nitro auto-imports that the server route uses, as it already does for `queryCollection`, because the root typecheck runs without `.nuxt/`.
- `/search-sections.json` is a build output next to the pages and is not one of the doc routes. The route count test and the link crawl are unchanged.
- The two attributes are set from the page and not by a prop. If a later Nuxt UI release names the listbox or makes the list focusable itself, `dressPalette` in `SiteSearch.vue` can go.
- Screen readers read the result rows as "Components > Button UButton", because the row template puts a space between its three parts. Nuxt UI's own row joins them without one.
- This ADR is `draft` until the owner has seen it. It changes no decision of ADR-0002, and it settles the three items that ADR left to T11.1.
