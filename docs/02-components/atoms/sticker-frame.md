---
title: Sticker frame
slug: sticker-frame
layer: component
level: atom
source: custom
component: CnStickerFrame
status: draft
lang: en
brandRules: [BR-13, BR-14]
tokens: [motif]
demos: [states, playground]
tbd: [TBD-05, TBD-10, TBD-11, TBD-18]
related: [sparkle, imagery-and-motifs, accessibility, brand-identity]
since: 0.1.0
updated: 2026-10-09
---

# Sticker frame

## Purpose

`CnStickerFrame` is the sticker-style border motif of the brand (BR-14): a frame that wraps a piece of content, such as a decorative image, so it looks like a sticker. It is decorative only. It is hidden from assistive technology, and nothing inside it can take focus (REQ-029). The border artwork has not been supplied (TBD-18), so today the frame is a plain outline with no artwork.

**Why custom:** Nuxt UI has no equivalent. It ships no decorative-border component, and the sticker border artwork is the owner's (BR-14), not something a Nuxt UI component can supply. `CnStickerFrame` composes no Nuxt UI component and holds no behavior.

## Anatomy

1. **frame**: the outlined box. It fits its content, never grows wider than its container, and clips what is wider than itself.
2. **content**: whatever the default slot holds. It is purely visual: the frame hides it from assistive technology and from the keyboard.

## Tokens and specs

<!-- cn:generated tokens="motif" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `motif.placeholder.bg` | `--cn-motif-placeholder-bg` | `#000000` | stable |
| `motif.placeholder.border` | `--cn-motif-placeholder-border` | `#90a1b9` | tbd (TBD-05, TBD-18) |
| `motif.placeholder.fg` | `--cn-motif-placeholder-fg` | `#90a1b9` | tbd (TBD-05, TBD-18) |

<!-- /cn:generated -->

The frame reads the placeholder outline (TBD-05), so it is `tbd` until the owner supplies the neutral scale and the artwork (TBD-18). It does not read `motif.placeholder.fg`: that token is the sparkle's note color. Its stroke width and corner radius are the tokens `border.width.motif` and `radius.motif` on the [Shape](../../01-foundations/shape.md) page, and they follow placeholders too (TBD-11, TBD-10). The padding is two base spacing units.

### Brand rules

> **BR-14:** Decorative motifs: sparkles and stars, sticker-style borders, a pink ramen cup with gamer details (the core brand icon), noodle-inspired curves and waves, a golden d20, chopsticks, and arcade-inspired shapes and dynamic lines.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

A frame is decoration, so no contrast pair is declared for it other than the outline against the page, which is reported as unverified while the neutral is a placeholder (REQ-015 AC4).

## Variants

The sticker frame has one look, and the artwork will set it (TBD-18). It has no props.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | An outlined box around its content. | `motif.placeholder.bg`, `motif.placeholder.border`, `border.width.motif`, `radius.motif` |

A sticker frame is decorative and not interactive, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. It does not animate. The state matrix on the component page shows it around short text, a long word, and content wider than the screen, and the state has a visual baseline.

## Usage rules

### When to use

- Use a frame around content that is purely visual, such as a decorative image or a heading ornament.
- Keep the content short and sized to fit: content wider than the frame is clipped, not scrolled.

### When not to use

- Never wrap anything the user needs to read, understand, or operate: a link, a button, a field, a price, a status. The frame hides its content from assistive technology and makes it unfocusable.
- Never wrap a thumbnail that needs alt text. Give it to `CnMediaCard` (REQ-025) instead.
- Never draw, recolor, or approximate the sticker border artwork. Only the owner's SVG replaces the placeholder (TBD-18).
- Never write a color, a width, or a radius literally in a frame. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Frame a decorative image that the page text already describes. | Frame a button or a link. It cannot take focus. |
| Keep the content narrower than the screen. | Rely on the frame to show content that is wider than the screen. It clips it. |
| Leave the frame hidden from screen readers. | Give the frame a label or a role. |

## Accessibility

- A frame renders with `aria-hidden="true"` and `inert`. `aria-hidden` hides it and its content from assistive technology (REQ-029 AC1). `inert` also makes everything inside unfocusable and unclickable, so a link or button put in the slot by mistake can never be a hidden focus stop.
- It holds no focusable element, adds no tab stop, and has no keyboard interaction.
- Text inside the frame cannot be selected, because `inert` blocks it. A frame is not the place for text the user may copy.
- The frame does not animate, so reduced motion changes nothing and nothing can flash (REQ-029 AC2, AC3).

Keyboard map: none. A frame takes no key.

ARIA: `aria-hidden="true"`. No role and no label. The `inert` attribute is not ARIA, and it hides the content from the focus order.

## Content

A frame holds no copy of its own. Whatever text sits inside arrives through the slot (A-11), and it is hidden from assistive technology, so it must repeat nothing the page needs.

```copy es-MX
¡Nuevo ingreso!
```

```copy-bad es-MX
Haz clic aquí
```

## Responsive behavior

At 360, 768, and 1280 px the frame fits its content, never grows wider than its container, and breaks long words, so it causes no horizontal overflow (REQ-028 AC1, ER-05, A-09). Content that is wider than the frame is clipped at its edge.

## Email notes

Not applicable. In email, a motif is a static image with an empty `alt` and never animates. See [Imagery and motifs](../../01-foundations/imagery-and-motifs.md) and [Email foundations](../../05-email/email-foundations.md).

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnStickerFrame` (`packages/nuxt/components/CnStickerFrame.vue`) |
| Theme | The `.cn-sticker-frame` rule in `packages/nuxt/assets/css/main.css` |
| Tokens | `motif.placeholder.bg`, `motif.placeholder.border`, `border.width.motif`, `radius.motif` |
| Demos | `apps/showcase/demos/sticker-frame/` |

| Slot | Notes |
|---|---|
| default | The content the frame wraps. Decorative only. |

The component has no props and no events.

```vue
<CnStickerFrame>
  <img src="…" alt="" />
</CnStickerFrame>
```

## Open items

> **TBD (TBD-18):** The sticker border artwork is not defined. The component shows a plain outline. Owner input needed: the SVG file.
>
> **TBD (TBD-05):** The neutral scale is not defined. The placeholder outline reads a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-10):** "Rounded" has no values. The placeholder radius follows a placeholder. Owner input needed: values.
>
> **TBD (TBD-11):** "Thick" has no values. The placeholder outline follows the placeholder stroke width. Owner input needed: values.
>
> **Draft:** The placeholder look (a plain outline) and the clipping and `inert` rules are drafts built from existing tokens, not an approved design. The doc stays a draft until the artwork and the placeholders above are supplied.

## Changelog

- 0.1.0 — First draft: `CnStickerFrame` as an outlined placeholder that wraps any slot content, hidden and inert, with the component tokens and the demos (T7.8) — awaiting the artwork (TBD-18) and the placeholders
