---
title: Sparkle
slug: sparkle
layer: component
level: atom
source: custom
component: CnSparkle
status: draft
lang: en
brandRules: [BR-02, BR-05, BR-13, BR-14]
tokens: [motion.duration]
demos: [states, playground]
tbd: [TBD-14]
related: [sticker-frame, imagery-and-motifs, motion, accessibility, brand-identity]
since: 0.1.0
updated: 2026-10-09
---

# Sparkle

## Purpose

`CnSparkle` is the sparkles-and-stars motif of the brand (BR-14): a small decoration that gives the UI its arcade character. It shows the sparkle artwork the owner chose, unmodified (ADR-0017). It is decorative only: it carries no meaning, is hidden from assistive technology, and holds nothing focusable (REQ-029).

**Why custom:** Nuxt UI has no equivalent. It ships no decorative-motif component, and the sparkle artwork is the owner's (BR-14), not something a Nuxt UI component can supply. `CnSparkle` composes no Nuxt UI component and holds no behavior beyond an optional slow fade.

## Anatomy

1. **artwork**: `Sparkle-CN.svg`, shown as an image. It is cropped tight to the artwork, so the edge of the image is the edge of the sparkle. The file is small, so the bundler may serve it as a `data:` URI rather than a separate request; it is an image either way, and never inlined as markup (ADR-0017).

## Tokens and specs

<!-- cn:generated tokens="motion.duration" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `motion.duration.default` | `--cn-motion-duration-default` | `150ms` | tbd (TBD-14) |

<!-- /cn:generated -->

The sparkle has no colour or size tokens of its own. Its colour is part of the artwork: the file is filled with `color.brand.yellow` (BR-02), and the artwork is never recoloured in code. Its height is the font size of the text beside it, so it follows the type scale rather than introducing a size of its own (ADR-0017). Only the `animated` fade reads a token, the base motion duration, which still follows a placeholder (TBD-14).

### Brand rules

> **BR-14:** Decorative motifs: sparkles and stars, sticker-style borders, a pink ramen cup with gamer details (the core brand icon), noodle-inspired curves and waves, a golden d20, chopsticks, and arcade-inspired shapes and dynamic lines.

The artwork is filled with the brand's secondary colour (BR-02); its value is on the [Color](../../01-foundations/color.md) page, where every token value is generated. The sparkle is yellow, not pink, because pink marks links and actions in this system; a decoration in that colour invites a click that does nothing (ADR-0017). A motif is decoration, so no contrast pair is declared for it (REQ-015 does not apply to decoration, WCAG 1.4.3).

## Variants

The sparkle has one look, set by the artwork. One prop changes its motion.

| Prop | Effect |
|---|---|
| `animated` | Off by default. When set, the sparkle fades slowly between full and half opacity, and the fade stops under reduced motion. |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | A still sparkle, as tall as the text beside it. | None |
| `animated` | The same sparkle, fading slowly. The fade is off under `prefers-reduced-motion: reduce`. | The base motion duration |

A sparkle is decorative and not interactive, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. The state matrix on the component page shows both states, and each has a visual baseline. The baseline of `animated` is still, because screenshots freeze animations.

## Usage rules

### When to use

- Use a sparkle beside content to add brand character, such as next to a heading.
- Keep it decorative: the page must read the same without it.
- Place several sparkles to build a cluster, which is how they appear in the brand artwork. Vary their size with `--sparkle-size`.
- Set `animated` only where a slow fade helps the mood, and only once per view area, so the UI does not read as childish (BR-05).

### When not to use

- Never use a sparkle to carry meaning, such as "new", a rating, or a status. Use a badge with text.
- Never give a sparkle a label, a role, a click handler, or a tab stop.
- Never recolour, rotate, stretch, or redraw the artwork. `CnSparkle` renders the supplied file unmodified (ADR-0017).
- Never place a sparkle over text or a control, or where it lowers their contrast (BR-06).
- Never flash a sparkle more than 3 times per second (WCAG 2.3.1).

## Do and don't

| Do | Don't |
|---|---|
| Put a sparkle beside a heading as decoration. | Use a sparkle to mark "new" items. |
| Leave the sparkle hidden from screen readers. | Add an `aria-label` to a sparkle. |
| Build a cluster from several sparkles at different sizes. | Stretch one sparkle out of its proportions. |
| Let the fade stop under reduced motion. | Keep a sparkle twinkling when the user asked for reduced motion. |

## Accessibility

- A sparkle is an `<img>` with an empty `alt` and `aria-hidden="true"`, no `role` and no label, so assistive technology skips it (REQ-029 AC1).
- It holds no focusable element and adds no tab stop. It has no keyboard interaction.
- The SVG is shown as an image, so its inner shapes are not exposed to assistive technology.
- Under `prefers-reduced-motion: reduce` the fade is switched off and the sparkle stays at full opacity (REQ-029 AC2). A Playwright test emulates reduced motion and checks it.
- A full fade cycle lasts ten base durations, much slower than 3 flashes a second (REQ-029 AC3, WCAG 2.3.1). The flash check is manual (`manual:` flash frequency needs visual review); the slow cycle keeps it far under the limit.

Keyboard map: none. A sparkle takes no key.

ARIA: `alt=""` and `aria-hidden="true"`. No role and no label.

## Content

A sparkle holds no copy of its own, and it never carries text. Never add a label to a sparkle: it is decoration, and a screen reader must not meet it.

## Responsive behavior

At 360, 768, and 1280 px the sparkle is as tall as the text beside it, so it scales with the type and never grows wider than its container (A-09, ER-05). It causes no horizontal overflow (REQ-028 AC1). A page that enlarges a sparkle with `--sparkle-size` keeps it inside its container.

## Email notes

Not applicable. In email, a motif is a static image with an empty `alt` and never animates. See [Imagery and motifs](../../01-foundations/imagery-and-motifs.md) and [Email foundations](../../05-email/email-foundations.md).

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnSparkle` (`packages/nuxt/components/CnSparkle.vue`) |
| Asset | `packages/nuxt/assets/brand/Sparkle-CN.svg` |
| Theme | The `.cn-sparkle` rules in `packages/nuxt/assets/css/main.css` |
| Size | `--sparkle-size`, defaulting to the font size of the text beside it |
| Demos | `apps/showcase/demos/sparkle/` |

| Prop | Type | Notes |
|---|---|---|
| `animated` | `boolean` | Fades the sparkle slowly. Off by default. Off under reduced motion. |

The component has no slots and no events.

```vue
<CnSparkle />
<CnSparkle animated />
```

## Open items

> **TBD (TBD-14):** Motion durations are not defined. The fade length follows a placeholder, not a brand value. Owner input needed: values.
>
> **Draft:** The artwork and the size rule are approved (ADR-0017). The doc stays a draft until the fade duration in the TBD callout above is replaced.

## Changelog

- 0.1.0 — First draft: `CnSparkle` as an outlined placeholder with an optional slow fade that stops under reduced motion, the component tokens, and the demos (T7.8) — awaiting the artwork (TBD-18) and the placeholders
- 0.1.0 — The supplied `Sparkle-CN.svg` replaces the placeholder, sized to the text beside it, and the fade now applies to the whole sparkle (T7.10) — ADR-0017
