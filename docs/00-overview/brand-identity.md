---
title: Brand identity
slug: brand-identity
layer: overview
status: draft
lang: en
brandRules: [BR-14, BR-16]
tbd: [TBD-18]
related: [logo, sparkle, sticker-frame, imagery-and-motifs, principles]
since: 0.1.0
updated: 2026-10-09
---

# Brand identity

## Purpose

This doc lists the Cup Noobles brand assets (BR-16) and the decorative motifs (BR-14), and it sets the rules for showing them. Its clear-space and minimum-size rules are what `CnLogo` applies to the supplied logo files (REQ-030 AC3, ADR-0016). The motif artwork has not been supplied yet (TBD-18).

## Usage rules

### Brand assets

> **BR-16:** The brand assets are a circular "CN" icon, a vertical "Cup Noobles" lockup, and a horizontal "Cup Noobles" wordmark. The asset files have not been supplied yet (TBD-17).

| Asset | Described in BR-16 as | `CnLogo` variant (REQ-030 AC1) | File |
|---|---|---|---|
| Icon | A circular "CN" icon | `icon` | `Icon-CN.svg` |
| Vertical lockup | A vertical "Cup Noobles" lockup | `vertical` | `LogoVertical-CN.svg` |
| Horizontal wordmark | A horizontal "Cup Noobles" wordmark | `horizontal` | `LogoHorizontal-CN.svg` |

- Render every brand asset through `CnLogo` (see [Logo](../02-components/atoms/logo.md)). Pass the `variant`, and either an accessible label or `decorative` (REQ-030 AC1).
- The owner supplied the SVG files, and they live in `packages/nuxt/assets/brand/`. `CnLogo` renders them unmodified, as image files (REQ-030 AC3, ADR-0016).

### Clear space and minimum size

The owner chose these rules (ADR-0016). They apply to all three logos.

<!-- cn:generated tokens="logo" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `logo.clearSpace` | `--cn-logo-clear-space` | `0.25` | stable |
| `logo.minHeight.horizontal` | `--cn-logo-min-height-horizontal` | `36px` | stable |
| `logo.minHeight.icon` | `--cn-logo-min-height-icon` | `64px` | stable |
| `logo.minHeight.vertical` | `--cn-logo-min-height-vertical` | `80px` | stable |
| `logo.rule.clearSpace` | `--cn-logo-rule-clear-space` | `0.25` | stable |
| `logo.rule.minHeight.horizontal` | `--cn-logo-rule-min-height-horizontal` | `36px` | stable |
| `logo.rule.minHeight.icon` | `--cn-logo-rule-min-height-icon` | `64px` | stable |
| `logo.rule.minHeight.vertical` | `--cn-logo-rule-min-height-vertical` | `80px` | stable |

<!-- /cn:generated -->

- **Clear space:** keep an empty margin of 25% of the logo's height on every side. Measure it from the edge of the file, which is cropped tight to the artwork. Nothing else, such as text, a button, or the edge of a photo, enters it.
- **Minimum size:** show the icon at 64 px tall or more, the vertical lockup at 80 px or more, and the horizontal wordmark at 36 px or more. Below these, the lettering in the logo is smaller than about 10 px.
- Put a logo on the pure-black page (BR-03). The files have a transparent background and are made for black.

### Decorative motifs

> **BR-14:** Decorative motifs: sparkles and stars, sticker-style borders, a pink ramen cup with gamer details (the core brand icon), noodle-inspired curves and waves, a golden d20, chopsticks, and arcade-inspired shapes and dynamic lines.

| Motif (BR-14) | Rendered by |
|---|---|
| Sparkles and stars | `CnSparkle` (see [Sparkle](../02-components/atoms/sparkle.md)) |
| Sticker-style borders | `CnStickerFrame` (see [Sticker frame](../02-components/atoms/sticker-frame.md)) |
| A pink ramen cup with gamer details (the core brand icon) | Motif artwork (TBD-18) |
| Noodle-inspired curves and waves | Motif artwork (TBD-18) |
| A golden d20 | Motif artwork (TBD-18) |
| Chopsticks | Motif artwork (TBD-18) |
| Arcade-inspired shapes and dynamic lines | Motif artwork (TBD-18) |

- Motifs are decorative only. They carry no meaning, render with `aria-hidden="true"`, and contain no focusable element (REQ-029 AC1).
- A motif that animates stops, or reduces to a non-moving state, under `prefers-reduced-motion: reduce`, and never flashes more than 3 times per second (REQ-029 AC2, AC3).
- [Imagery and motifs](../01-foundations/imagery-and-motifs.md) holds the full motif rules.

> **TBD (TBD-18):** The motif artwork is not defined. Owner input needed: the SVG files for the motifs in BR-14.

### When to use

- Use `CnLogo` wherever the brand must be identified, such as the site header.
- Use motifs to add brand character around content.

### When not to use

- Never draw, recreate, recolor, crop, stretch, or approximate a logo. Only the supplied files are allowed (REQ-030 AC3).
- Never use a motif to carry meaning, such as a status or an action. Use a component that is built for it, and text.
- Never edit a supplied asset file. `CnLogo` renders the SVGs unmodified (REQ-030 AC3).

## Open items

> **TBD (TBD-18):** Motif artwork as SVG. Owner input needed.

## Changelog

- 0.1.0 — First draft: brand assets from BR-16, motifs from BR-14, and the `CnLogo` rules from REQ-030 (T4.1) — awaiting owner approval
- 0.1.0 — The logo files, the clear space, and the minimum sizes are supplied by the owner; TBD-17 is resolved (T7.9) — ADR-0016
