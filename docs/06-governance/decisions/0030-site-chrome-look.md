---
title: "ADR-0030: Site header and footer look"
slug: adr-0030-site-chrome-look
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-03, BR-13, BR-15]
tbd: []
related: [adr-0009-focus-indicator, adr-0010-button-variants, adr-0011-link-and-badge-looks, adr-0018-card-look, adr-0029-overlay-look, site-header, site-footer]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0030: Site header and footer look

## Context

The brand context says nothing about a bar at the top or bottom of a page. It says line work is thick, clean, and high-contrast (BR-13). No earlier ADR defines a header or a footer. T8.6 (Site header and footer) needed one look for both bars, on the pure-black page (BR-03).

The owner compared three options on a visual comparison page, wide and at 360 px:

- A. A thick brand-pink line under the header and above the footer. It is the line that cards (ADR-0018) and panels (ADR-0029) already use. Pink on black is 8.37:1, and it uses only brand colors.
- B. A thin neutral grey line. It is quiet, but it is thin, which goes against BR-13, and it needs the neutral scale (TBD-05).
- C. A thick brand-yellow line. Yellow on black is 18.55:1, but the focus ring is yellow (ADR-0009), so a keyboard user would see a ring that looks like the bar. Yellow beside pink is 2.22:1.

The owner chose A in chat on 2026-10-10 (T8.6 session). No `frontend-design` audit was run: option A uses only stable brand tokens and the look already approved in ADR-0018 and ADR-0029.

## Decision

The values come from the owner in chat, 2026-10-10.

| Part | Look |
|---|---|
| Header fill | The black page, fully opaque (`siteHeader.bg`, `color.bg.base`) |
| Header line | A thick brand-pink line under the bar (`siteHeader.line`, BR-01) |
| Footer fill | The black page (`siteFooter.bg`, `color.bg.base`) |
| Footer line | A thick brand-pink line above the bar (`siteFooter.line`, BR-01) |
| Glow | None. The glow belongs to buttons (BR-10) |
| Keyboard focus | The yellow focus ring from ADR-0009 |

1. **The bars have no brand look of their own for their contents.** Links read ADR-0011 (pink, underlined), buttons read ADR-0010, and the mobile navigation panel is the slideover look of ADR-0029.
2. **The header is opaque.** Nuxt UI draws the header at 75% over a blur. The theme replaces it with the solid black fill, so the page content that scrolls under it never shows through.
3. **The behavior is Nuxt UI's.** `UHeader` keeps its sticky position and its mobile menu. With `mode="slideover"`, the menu is a `USlideover`: focus is trapped and restored, Escape closes it, and the page behind is hidden from assistive technology. Nothing is re-implemented (ER-01, REQ-020 AC3).
4. **Not decided here.** The text colors and the stroke width stay placeholders (TBD-04, TBD-05, TBD-11).

## Consequences

- `site-header.json` and `site-footer.json` hold `siteHeader.*` and `siteFooter.*`. The fills and lines are `stable` tokens that reference semantic tokens, and the text colors and stroke widths are `tbd`.
- `site-header.md` and `site-footer.md` stay `draft` while the placeholders are open.
- Changing the look takes a new ADR that supersedes this one, and new visual baselines.
