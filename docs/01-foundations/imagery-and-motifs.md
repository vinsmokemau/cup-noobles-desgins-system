---
title: Imagery and motifs
slug: imagery-and-motifs
layer: foundation
status: draft
lang: en
brandRules: [BR-04, BR-05, BR-12, BR-13, BR-14]
tbd: [TBD-18, TBD-20]
related: [brand-identity, sparkle, sticker-frame, media-card, motion, iconography]
since: 0.1.0
updated: 2026-09-28
---

# Imagery and motifs

## Purpose

This doc defines the images in Cup Noobles UI: the decorative motifs of BR-14, and the photography and thumbnails shown in content such as the featured media card (BR-12). Motifs give the UI its geek, gaming, and arcade character (BR-04) and are decorative only: they never carry meaning (REQ-029). The motif artwork (TBD-18) and the photography and thumbnail standards (TBD-20) are not defined yet.

## Tokens and specs

Not applicable.

## Usage rules

### Brand rules

> **BR-14:** Decorative motifs: sparkles and stars, sticker-style borders, a pink ramen cup with gamer details (the core brand icon), noodle-inspired curves and waves, a golden d20, chopsticks, and arcade-inspired shapes and dynamic lines.
>
> **BR-04:** The aesthetic is geek, gaming, anime, TCG, and board game culture, with a retro-arcade, neon, "sticker mascot logo" style.
>
> **BR-05:** The brand is premium, fun, and energetic. It is **never childish or generic.**
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.
>
> **BR-12:** Cards have a dark surface with neon highlights. There are two card types: a standard content card, and a featured media card (thumbnail, title, and tag badge).

### Motifs

| Motif (BR-14) | Rendered by | Artwork |
|---|---|---|
| Sparkles and stars | `CnSparkle` (see [Sparkle](../02-components/atoms/sparkle.md)) | TBD-18 |
| Sticker-style borders | `CnStickerFrame` (see [Sticker frame](../02-components/atoms/sticker-frame.md)) | TBD-18 |
| A pink ramen cup with gamer details (the core brand icon) | Motif SVG | TBD-18 |
| Noodle-inspired curves and waves | Motif SVG | TBD-18 |
| A golden d20 | Motif SVG | TBD-18 |
| Chopsticks | Motif SVG | TBD-18 |
| Arcade-inspired shapes and dynamic lines | Motif SVG | TBD-18 |

The artwork is supplied by the owner as SVG files and lives in `packages/nuxt/assets/brand/` (§4.1). BR-13 applies to it: "thick, clean, and high-contrast" line work. Until the files arrive, no motif is drawn, traced, or approximated. How `CnSparkle` and `CnStickerFrame` render in the meantime is decided in their task (T7.8).

### Motifs are decorative only

These rules come from REQ-029 and apply to every motif, animated or not.

1. **No meaning.** A motif never marks a status, an action, a category, or anything else the user needs to understand. `CnSparkle`, `CnStickerFrame`, and every motif SVG render with `aria-hidden="true"` and contain no focusable element (REQ-029 AC1).
2. **Reduced motion.** A motif that animates stops, or reduces to a non-moving state, under `prefers-reduced-motion: reduce` (REQ-029 AC2).
3. **Flash limit.** Nothing flashes more than 3 times per second (REQ-029 AC3, WCAG SC 2.3.1).

Motion values are in [Motion](motion.md), and the brand assets are in [Brand identity](../00-overview/brand-identity.md).

### Photography and thumbnails

The featured media card has a thumbnail (BR-12), rendered by `CnMediaCard` (see [Media card](../02-components/molecules/media-card.md)). The standards for photography and thumbnails are TBD-20, the same open item as decision D11 in the e-commerce plan. They include what images show, their style, and their aspect ratios and crops.

Whatever TBD-20 defines, every thumbnail has `alt` text, or is explicitly marked `decorative` (REQ-025 AC2). The alt text arrives through a prop, never hardcoded (A-11).

### When to use

- Use motifs around content to add brand character, such as a sparkle beside a heading or a sticker frame around a featured image.
- Use only the motif components and the owner's SVG files.
- Give every thumbnail meaningful alt text, or mark it `decorative` when the card title already says everything the image shows.

### When not to use

- Never use a motif to carry meaning, such as a status, a rating, or a button. Use a component built for it, and text.
- Never draw, trace, recolor, or approximate a motif. The artwork is TBD-18, and only the owner can supply it.
- Never let a motif cover, crowd, or reduce the contrast of text or a control. The UI stays legible (BR-06).
- Never use motifs so densely that the UI reads as childish or generic (BR-05).
- Never set photography or thumbnail rules on your own. They are TBD-20.

## Do and don't

| Do | Don't |
|---|---|
| Put a sparkle beside a heading as decoration, hidden from screen readers. | Use a sparkle to mark "new" items. Use a badge with text. |
| Show a still sparkle under reduced motion. | Keep a sparkle twinkling when the user asked for reduced motion. |
| Give a thumbnail alt text that says what the image shows. | Give every thumbnail the same generic alt text. |
| Leave a motif out until the owner's SVG arrives. | Draw a ramen cup in the brand's style to fill the gap. |

## Accessibility

- The target is WCAG 2.2 level AA (A-10).
- **Decorative motifs.** Motifs render with `aria-hidden="true"` and no focusable element (REQ-029 AC1), so screen readers and keyboard users never meet them.
- **Reduced motion and flashing.** Animated motifs stop or become static under `prefers-reduced-motion: reduce` (REQ-029 AC2), checked by Playwright with reduced motion emulated. Nothing flashes more than 3 times per second (REQ-029 AC3). That check is manual, because flash frequency needs visual review; it is done once per animated component.
- **Images.** Every thumbnail has alt text, or an explicit `decorative` flag (REQ-025 AC2).
- **Legibility.** A motif placed behind or beside text must not lower that text's contrast below the minimums in [Color](color.md) (REQ-015).
- The full rules are in [Accessibility](accessibility.md).

## Responsive behavior

Motifs and thumbnails never cause horizontal overflow at 360, 768, or 1280 px (REQ-028 AC1, A-09). A motif that does not fit next to content at 360 px (ER-05) must not push the content aside. How thumbnails crop at each width is part of TBD-20.

## Email notes

In email, a motif is a static image, never animated, and marked as decorative with an empty `alt`. Images may be blocked by the email client, so no content depends on an image. Images-off behavior is defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `packages/nuxt/assets/brand/` | The motif SVG files, once supplied (TBD-18). |
| `CnSparkle`, `CnStickerFrame` | The motif components (T7.8). Documented in [Sparkle](../02-components/atoms/sparkle.md) and [Sticker frame](../02-components/atoms/sticker-frame.md). |
| `CnMediaCard` | The featured media card with its thumbnail (T8.2). Documented in [Media card](../02-components/molecules/media-card.md). |

```vue
<!-- A motif is decorative: aria-hidden, with no focusable element (REQ-029 AC1). -->
<CnSparkle />

<!-- A thumbnail needs alt text, or the decorative flag (REQ-025 AC2). -->
<CnMediaCard :title="title" :src="src" :alt="alt" />
```

## Open items

> **TBD (TBD-18):** The motif artwork for BR-14 is not defined. Owner input needed: the SVG files.
>
> **TBD (TBD-20):** Photography and thumbnail standards are not defined: subject, style, aspect ratios, and crops. This is the same open item as decision D11 in the e-commerce plan. Owner input needed: guidelines.

## Changelog

- 0.1.0 — First draft: BR-04, BR-05, BR-12, BR-13, and BR-14, the motif list, the REQ-029 decorative-only, reduced-motion, and flash-limit rules, thumbnail alt text (REQ-025 AC2), and TBD-18 and TBD-20 (T4.6) — awaiting owner approval
