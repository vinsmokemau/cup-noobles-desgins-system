---
title: "ADR-0012: Icon set"
slug: adr-0012-icon-set
layer: adr
status: stable
lang: en
brandRules: [BR-06, BR-13]
tbd: []
related: [adr-0011-link-and-badge-looks, icon, iconography]
since: 0.1.0
updated: 2026-10-09
---

# ADR-0012: Icon set

## Context

BR-13 asks for thick, clean, high-contrast line work in all UI, but the brand context names no icon set (TBD-19, decision OD-09). [Iconography](../../01-foundations/iconography.md) sets four criteria: a stroke style consistent with BR-13, rendering through `UIcon`, a license that covers the published packages and the public showcase, and coverage of every icon Nuxt UI uses.

The owner compared four Iconify collections as real glyphs on the pure-black page (BR-03), alone and on a pink button, a ghost button, and the yellow tag badge:

- A. Lucide, ISC, lines about 2 px at 24 px. It is Nuxt UI's default.
- B. Tabler, MIT, lines about 2 px at 24 px.
- C. Phosphor Bold, MIT, lines about 2.25 px at 24 px, with rounded ends. It is the heaviest of the four.
- D. Heroicons Outline, MIT, lines about 1.5 px at 24 px. It is the thinnest.

The owner chose C in chat on 2026-10-09 (T7.3 session).

## Decision

The icon set is Phosphor Bold, the `ph` Iconify collection with the `bold` weight. The values come from the owner in chat, 2026-10-09.

| Criterion | How Phosphor Bold meets it |
|---|---|
| Stroke style (BR-13) | The heaviest of the four candidates, with rounded ends. The owner judged it on the black page. |
| Renders through `UIcon` | Icon names look like `i-ph-star-bold`. The data comes from the `@iconify-json/ph` package, pinned at 1.2.2 in `packages/nuxt`. |
| License | MIT, which covers the published packages and the public showcase. |
| Covers Nuxt UI's icons | `ui.icons` in `packages/nuxt/app.config.ts` sets every icon name Nuxt UI 4.11.2 defines to a Phosphor Bold glyph. |

1. Only the `bold` weight is used. Another Phosphor weight is a different set for this decision.
2. Icons keep the color of the text next to them, and no icon size token exists (see [Icon](../../02-components/atoms/icon.md)).

## Consequences

- TBD-19 and OD-09 are resolved. SPEC.md §2.4 and §7.2 say so (spec version 1.16).
- The Nuxt layer gains one runtime dependency, `@iconify-json/ph`. The tokens package is unchanged.
- The showcase and the demos use Phosphor Bold glyphs, and the visual baselines that show icons are regenerated.
- The doc `icon.md` still has a draft callout about icon sizes, so it stays `draft`.
- A change of icon set takes a new ADR that supersedes this one.
