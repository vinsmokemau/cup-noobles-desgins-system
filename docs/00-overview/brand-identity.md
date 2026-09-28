---
title: Brand identity
slug: brand-identity
layer: overview
status: draft
lang: en
brandRules: [BR-14, BR-16]
tbd: [TBD-17, TBD-18]
related: [logo, sparkle, sticker-frame, imagery-and-motifs, principles]
since: 0.1.0
updated: 2026-09-27
---

# Brand identity

## Purpose

This doc lists the Cup Noobles brand assets (BR-16) and the decorative motifs (BR-14), and it sets the rules for showing them. Its clear-space and minimum-size rules are what `CnLogo` applies once the asset files arrive (REQ-030 AC3). The asset files, the clear-space and minimum-size rules, and the motif artwork have not been supplied yet (TBD-17, TBD-18).

## Usage rules

### Brand assets

> **BR-16:** The brand assets are a circular "CN" icon, a vertical "Cup Noobles" lockup, and a horizontal "Cup Noobles" wordmark. The asset files have not been supplied yet (TBD-17).

| Asset | Described in BR-16 as | `CnLogo` variant (REQ-030 AC1) | File |
|---|---|---|---|
| Icon | A circular "CN" icon | `icon` | Not supplied (TBD-17) |
| Vertical lockup | A vertical "Cup Noobles" lockup | `vertical` | Not supplied (TBD-17) |
| Horizontal wordmark | A horizontal "Cup Noobles" wordmark | `horizontal` | Not supplied (TBD-17) |

- Render every brand asset through `CnLogo` (see [Logo](../02-components/atoms/logo.md)). Pass the `variant`, and either an accessible label or `decorative` (REQ-030 AC1).
- While TBD-17 is open, `CnLogo` renders a neutral placeholder that shows the text "Logo asset pending (TBD-17)" (REQ-030 AC2).
- Once the owner supplies the SVG files, they live in `packages/nuxt/assets/brand/`, and `CnLogo` renders them unmodified (REQ-030 AC3).

### Clear space and minimum size

> **TBD (TBD-17):** The logo files, and the clear-space and minimum-size rules for each of the three assets, are not defined. Owner input needed: the SVG files and the rules.

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

- Never draw, recreate, recolor, or approximate a logo. Until the files arrive, the placeholder is the only allowed rendering (REQ-030 AC2).
- Never use a motif to carry meaning, such as a status or an action. Use a component that is built for it, and text.
- Never edit a supplied asset file. `CnLogo` renders the SVGs unmodified (REQ-030 AC3).

## Open items

> **TBD (TBD-17):** Logo SVG files, clear space, and minimum size for the icon, the vertical lockup, and the horizontal wordmark. Owner input needed.
>
> **TBD (TBD-18):** Motif artwork as SVG. Owner input needed.

## Changelog

- 0.1.0 — First draft: brand assets from BR-16, motifs from BR-14, and the `CnLogo` rules from REQ-030 (T4.1) — awaiting owner approval
