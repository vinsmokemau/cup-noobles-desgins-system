---
title: Sparkle
slug: sparkle
layer: component
level: atom
source: custom
component: CnSparkle
status: draft
lang: en
brandRules: [BR-13, BR-14]
tokens: [motif]
demos: [states, playground]
tbd: [TBD-05, TBD-10, TBD-11, TBD-14, TBD-18]
related: [sticker-frame, imagery-and-motifs, motion, accessibility, brand-identity]
since: 0.1.0
updated: 2026-10-09
---

# Sparkle

## Purpose

`CnSparkle` is the sparkles-and-stars motif of the brand (BR-14): a small decoration that gives the UI its arcade character. It is decorative only. It carries no meaning, is hidden from assistive technology, and holds nothing focusable (REQ-029). The artwork has not been supplied (TBD-18), so today the component renders a plain outlined placeholder with a note, never an invented sparkle.

**Why custom:** Nuxt UI has no equivalent. It ships no decorative-motif component, and the sparkle artwork is the owner's (BR-14), not something a Nuxt UI component can supply. `CnSparkle` composes no Nuxt UI component and holds no behavior beyond an optional slow fade.

## Anatomy

1. **placeholder**: the outlined box that stands in for the sparkle artwork. It carries the note "Motif pending (TBD-18)". It is replaced by the supplied SVG, unmodified, once the artwork arrives.

## Tokens and specs

<!-- cn:generated tokens="motif" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `motif.placeholder.bg` | `--cn-motif-placeholder-bg` | `#000000` | stable |
| `motif.placeholder.border` | `--cn-motif-placeholder-border` | `#90a1b9` | tbd (TBD-05, TBD-18) |
| `motif.placeholder.fg` | `--cn-motif-placeholder-fg` | `#90a1b9` | tbd (TBD-05, TBD-18) |

<!-- /cn:generated -->

The outline and the note read the neutral placeholder (TBD-05), so they are `tbd` until the owner supplies the neutral scale and the artwork (TBD-18). The stroke width and the corner radius are the tokens `border.width.motif` and `radius.motif` on the [Shape](../../01-foundations/shape.md) page, and they follow placeholders too (TBD-11, TBD-10). The fade lasts ten base motion durations, and the base duration is a placeholder (TBD-14). The depth of the fade, half strength, matches the skeleton ([Skeleton](skeleton.md)); the note is not faded, so its contrast never drops.

### Brand rules

> **BR-14:** Decorative motifs: sparkles and stars, sticker-style borders, a pink ramen cup with gamer details (the core brand icon), noodle-inspired curves and waves, a golden d20, chopsticks, and arcade-inspired shapes and dynamic lines.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

A motif is decoration, so no contrast pair is declared for the artwork. The placeholder note is text, and its pair is declared and reported as unverified while the neutral is a placeholder (REQ-015 AC4).

## Variants

The sparkle has one look, and the artwork will set it (TBD-18). One prop changes its motion.

| Prop | Effect |
|---|---|
| `animated` | Off by default. When set, the outline of the sparkle fades slowly to half strength and back, and the fade stops under reduced motion. The note stays at full contrast. |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | A still outlined placeholder. | `motif.placeholder.bg`, `motif.placeholder.border`, `motif.placeholder.fg`, `border.width.motif`, `radius.motif` |
| `animated` | The same placeholder, fading slowly. The fade is off under `prefers-reduced-motion: reduce`. | The same tokens, plus the base motion duration |

A sparkle is decorative and not interactive, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. The state matrix on the component page shows both states, and each has a visual baseline. The baseline of `animated` is still, because screenshots freeze animations.

## Usage rules

### When to use

- Use a sparkle beside content to add brand character, such as next to a heading.
- Keep it decorative: the page must read the same without it.
- Set `animated` only where a slow fade helps the mood, and only once per view area, so the UI does not read as childish (BR-05).

### When not to use

- Never use a sparkle to carry meaning, such as "new", a rating, or a status. Use a badge with text.
- Never give a sparkle a label, a role, a click handler, or a tab stop.
- Never draw, recolor, or approximate the sparkle artwork. Only the owner's SVG replaces the placeholder (TBD-18).
- Never place a sparkle over text or a control, or where it lowers their contrast (BR-06).
- Never flash a sparkle more than 3 times per second (WCAG 2.3.1).

## Do and don't

| Do | Don't |
|---|---|
| Put a sparkle beside a heading as decoration. | Use a sparkle to mark "new" items. |
| Leave the sparkle hidden from screen readers. | Add an `aria-label` to a sparkle. |
| Let the fade stop under reduced motion. | Keep a sparkle twinkling when the user asked for reduced motion. |

## Accessibility

- A sparkle renders with `aria-hidden="true"`, no `role`, and no label, so assistive technology skips it (REQ-029 AC1).
- It holds no focusable element and adds no tab stop. It has no keyboard interaction.
- The placeholder note is text inside a hidden element, so a screen reader never reads it.
- Under `prefers-reduced-motion: reduce` the fade is switched off, and the outline stays at full strength (REQ-029 AC2). A Playwright test emulates reduced motion and checks it.
- A full fade cycle lasts ten base durations, much slower than 3 flashes a second (REQ-029 AC3, WCAG 2.3.1). The flash check is manual (`manual:` flash frequency needs visual review); the slow cycle keeps it far under the limit.

Keyboard map: none. A sparkle takes no key.

ARIA: `aria-hidden="true"`. No role and no label.

## Content

A sparkle holds no copy of its own. The placeholder note is a build marker for the missing artwork (TBD-18), not UI text, and it goes away when the artwork arrives. Never add a label to a sparkle.

## Responsive behavior

At 360, 768, and 1280 px the sparkle keeps its size and never grows wider than its container (A-09, ER-05). Its note wraps if it must, so the sparkle causes no horizontal overflow (REQ-028 AC1). The artwork will set a fixed size (TBD-18).

## Email notes

Not applicable. In email, a motif is a static image with an empty `alt` and never animates. See [Imagery and motifs](../../01-foundations/imagery-and-motifs.md) and [Email foundations](../../05-email/email-foundations.md).

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnSparkle` (`packages/nuxt/components/CnSparkle.vue`) |
| Theme | The `.cn-sparkle` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `motif.placeholder.*`, `border.width.motif`, `radius.motif` |
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

> **TBD (TBD-18):** The sparkle artwork is not defined. The component shows an outlined placeholder. Owner input needed: the SVG file.
>
> **TBD (TBD-05):** The neutral scale is not defined. The placeholder outline and note read a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-10):** "Rounded" has no values. The placeholder radius follows a placeholder. Owner input needed: values.
>
> **TBD (TBD-11):** "Thick" has no values. The placeholder outline follows the placeholder stroke width. Owner input needed: values.
>
> **TBD (TBD-14):** Motion durations are not defined. The fade length follows a placeholder. Owner input needed: values.
>
> **Draft:** The placeholder look (an outline with a note) and the optional fade are drafts built from existing tokens, not an approved design. The doc stays a draft until the artwork and the placeholders above are supplied.

## Changelog

- 0.1.0 — First draft: `CnSparkle` as an outlined placeholder with an optional slow fade that stops under reduced motion, the component tokens, and the demos (T7.8) — awaiting the artwork (TBD-18) and the placeholders
