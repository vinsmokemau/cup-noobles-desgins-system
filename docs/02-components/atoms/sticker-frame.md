---
title: Sticker frame
slug: sticker-frame
layer: component
level: atom
source: custom
component: CnStickerFrame
status: stable
lang: en
brandRules: [BR-13, BR-14]
tokens: []
demos: [states, playground]
tbd: []
related: [sparkle, imagery-and-motifs, accessibility, brand-identity]
since: 0.1.0
updated: 2026-10-10
---

# Sticker frame

## Purpose

`CnStickerFrame` is the sticker-style border motif of the brand (BR-14): a frame that wraps a piece of content, such as a decorative image, so it looks like a sticker. It shows the border artwork the owner chose, unmodified (ADR-0024). It is decorative only. It is hidden from assistive technology, and nothing inside it can take focus (REQ-029).

**Why custom:** Nuxt UI has no equivalent. It ships no decorative-border component, and the sticker border artwork is the owner's (BR-14), not something a Nuxt UI component can supply. `CnStickerFrame` composes no Nuxt UI component and holds no behavior.

## Anatomy

1. **artwork**: `Sticker-Border-CN.svg`, shown as an image that fills the frame. It is a yellow outer edge with notched corners, a pink inner band, and short white shine marks, all with black outlines, and it is transparent. It is never inlined as markup (ADR-0024).
2. **content**: whatever the default slot holds, centred in the empty centre of the artwork. It is purely visual: the frame hides it from assistive technology and from the keyboard.

## Tokens and specs

The sticker frame reads no token. Its colours are part of the artwork, which is filled with `color.brand.pink` (BR-01), `color.brand.yellow` (BR-02), and black (BR-03), plus white for the shine marks (ADR-0024). The artwork is never recoloured in code. The frame declares no stroke width, corner radius, or padding of its own: the line work is drawn in the file (BR-13).

Its shape comes from the file, not from the brand (ADR-0025):

| Measure | Value | Where it comes from |
|---|---|---|
| Ratio | `1415.74 : 885.87`, about 8:5 | The `viewBox` of `Sticker-Border-CN.svg` |
| Empty centre, from the left and right edges | 6.8% of the frame width | The band is about 96 `viewBox` units thick |
| Empty centre, from the top and bottom edges | 11% of the frame height | The same band |
| Width | The container's width, or `--sticker-frame-width` | A page chooses it |

### Brand rules

> **BR-14:** Decorative motifs: sparkles and stars, sticker-style borders, a pink ramen cup with gamer details (the core brand icon), noodle-inspired curves and waves, a golden d20, chopsticks, and arcade-inspired shapes and dynamic lines.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

A frame is decoration, so no contrast pair is declared for it (REQ-015 does not apply to decoration, WCAG 1.4.3). The frame sits on the pure-black page, which the files are made for (BR-03).

## Variants

The sticker frame has one look, set by the artwork. It has no props.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The artwork around its centred content. | None |

A sticker frame is decorative and not interactive, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. It does not animate. The state matrix on the component page shows it around short text, a long word, and content wider than the screen, and the state has a visual baseline.

## Usage rules

### When to use

- Use a frame around content that is purely visual, such as a decorative image or a heading ornament.
- Keep the content short and sized to fit the empty centre. Content larger than the centre is clipped at its edge, not scrolled and not scaled (ADR-0025).
- Set the width from the page with `--sticker-frame-width`. The height follows, because the frame keeps its ratio.

### When not to use

- Never wrap anything the user needs to read, understand, or operate: a link, a button, a field, a price, a status. The frame hides its content from assistive technology and makes it unfocusable.
- Never wrap a thumbnail that needs alt text. Give it to `CnMediaCard` (REQ-025) instead.
- Never recolour, rotate, stretch, crop, or redraw the artwork. `CnStickerFrame` renders the supplied file unmodified (ADR-0024).
- Never force the frame to another ratio to suit content. Choose content that fits, or do not frame it.
- Never write a color, a width, or a radius literally in a frame. It needs none (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Frame a decorative image that the page text already describes. | Frame a button or a link. It cannot take focus. |
| Keep the content inside the empty centre. | Rely on the frame to show content that is larger than the centre. It clips it. |
| Leave the frame hidden from screen readers. | Give the frame a label or a role. |
| Set the width with `--sticker-frame-width`. | Set a `height` on the frame. It breaks the ratio of the artwork. |

## Accessibility

- A frame renders with `aria-hidden="true"` and `inert`. `aria-hidden` hides it and its content from assistive technology (REQ-029 AC1). `inert` also makes everything inside unfocusable and unclickable, so a link or button put in the slot by mistake can never be a hidden focus stop.
- The artwork is an `<img>` with an empty `alt` and `aria-hidden="true"`, so assistive technology skips it.
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

At 360, 768, and 1280 px the frame is as wide as its container, or as wide as `--sticker-frame-width` allows, and never wider than its container. It keeps its ratio, so it shrinks as one piece and its band stays in proportion. Long words break, and content larger than the empty centre is clipped at its edge, so the frame causes no horizontal overflow (REQ-028 AC1, ER-05, A-09).

## Email notes

Not applicable. In email, a motif is a static image with an empty `alt` and never animates. See [Imagery and motifs](../../01-foundations/imagery-and-motifs.md) and [Email foundations](../../05-email/email-foundations.md).

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnStickerFrame` (`packages/nuxt/components/CnStickerFrame.vue`) |
| Asset | `packages/nuxt/assets/brand/Sticker-Border-CN.svg` |
| Theme | The `.cn-sticker-frame` rules in `packages/nuxt/assets/css/main.css` |
| Width | `--sticker-frame-width`, defaulting to the width of the container |
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

None. The artwork (ADR-0024) and the way it fits content (ADR-0025) are approved by the owner.

## Changelog

- 0.1.0 — First draft: `CnStickerFrame` as an outlined stand-in that wraps any slot content, hidden and inert, with the component tokens and the demos (T7.8)
- 0.1.0 — The supplied `Sticker-Border-CN.svg` replaces the stand-in as a fixed 8:5 frame with centred content, and its stand-in tokens are removed (T7.17) — ADR-0024, ADR-0025
