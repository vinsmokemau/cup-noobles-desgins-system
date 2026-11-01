---
title: "ADR-0063: The email header uses the horizontal wordmark as a PNG"
slug: adr-0063-email-raster-logo
layer: adr
status: stable
lang: en
brandRules: [BR-03, BR-16]
tbd: []
related: [adr-0016-logo-assets-and-rules, adr-0041-email-components-approved, email-components, email-foundations, logo]
since: 0.1.0
updated: 2026-10-31
---

# ADR-0063: The email header uses the horizontal wordmark as a PNG

## Context

The `{{ logo_url }}` slot of the email header needs a raster image, because most email clients do not render SVG, and the system shipped SVG only. The e-commerce repository asked for the file (DSR-05). The owner supplied three logo SVGs (ADR-0016): the horizontal wordmark, the vertical wordmark, and the icon. The header renders the horizontal wordmark at `logo.rule.minHeight.horizontal` (36 px high).

## Decision

The owner chose in chat on 2026-10-28 to let Claude pick one of the three logos, and approved the task. Claude picked the **horizontal wordmark**, `packages/nuxt/assets/brand/LogoHorizontal-CN.svg`, because it is the logo the header already renders at that height, and the vertical wordmark and the icon have other minimum sizes.

1. **The PNG is the SVG, converted.** No artwork is drawn and no color is changed. The conversion renders the SVG in Chromium on a transparent background.
2. **It is 232 x 72 px**, twice the display size of 116 x 36 px, so it stays sharp on high-density screens. The height is twice `logo.rule.minHeight.horizontal`, and the width follows the SVG's aspect ratio.
3. **It lives in `packages/email/assets/logo-horizontal.png`** and ships in the package through `files`. `pnpm --filter @vinsmokemau/cup-noobles-email build:logo` regenerates it from the SVG.
4. **The sending project hosts it** at a public HTTPS address and passes that address as `{{ logo_url }}`. The package does not host it.

## Consequences

- No brand value and no token is added.
- A change to the SVG needs `build:logo` to run again, and the test of the PNG's size against the SVG's aspect ratio fails until it does.
- The images-off rules of `email-foundations.md` already cover the logo's text fallback, so that doc does not change.
