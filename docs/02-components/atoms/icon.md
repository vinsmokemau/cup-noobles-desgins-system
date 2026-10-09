---
title: Icon
slug: icon
layer: component
level: atom
source: nuxt-ui
nuxtUi: UIcon
status: draft
lang: en
brandRules: [BR-06, BR-13]
demos: [states, playground]
tbd: []
related: [iconography, button, link, badge]
since: 0.1.0
updated: 2026-10-09
---

# Icon

## Purpose

The icon is a small glyph that supports a label or marks a status, such as the arrow in a button or the star in a badge. It follows the thick, clean, high-contrast line work of BR-13 and must stay legible on black (BR-06). It is a Nuxt UI `UIcon`, which draws an Iconify icon. The icon set is Phosphor Bold, chosen by the owner (ADR-0012). The doc fixes how an icon behaves: how it gets its color and size, and how it is named for assistive technology. The set itself is described in [Iconography](../../01-foundations/iconography.md).

## Anatomy

1. **glyph**: the drawn shape, one icon of the Phosphor Bold set.
2. **box**: the square the glyph sits in. Its size comes from the size classes of the parent component, or from a size class on the icon.

An icon has no component tokens. It takes its color from the text around it (`currentColor`), so it follows the label of the component that holds it: black on a pink or yellow fill, pink or the body text color on the page. No icon size token exists. Nuxt UI components set the size of the icons they hold, and a standalone icon takes a size class. If a size token is needed, it is added with the owner's approval ([Iconography](../../01-foundations/iconography.md)).

## Tokens and specs

Not applicable.

## Variants

The icon has no brand variants. It has two roles, which change how it is announced:

| Role | How it is written | Announced as |
|---|---|---|
| Decorative | `UIcon` alone, next to a visible label | Nothing; `UIcon` sets `aria-hidden="true"` itself |
| Meaningful | `UIcon` inside a wrapper with `role="img"` and `aria-label` | An image with that name |

The glyphs come from Phosphor Bold, the set the owner chose (ADR-0012). Icon names look like i-ph-star-bold. Every icon that a Nuxt UI component uses by itself, such as the close, chevron, and loading icons, is set to its Phosphor Bold glyph in ui.icons, so no component shows an icon from another set.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The glyph in the color it inherits. | none |

An icon is not interactive, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. To make an icon clickable, put it in a [Button](button.md) or a [Link](link.md), which give it a name and a focus ring.

## Usage rules

### When to use

- Use an icon to support a visible label, or to mark a status that the text also states.
- Leave an icon that sits next to its label as it is: `UIcon` already hides itself from assistive technology.
- Give an icon that carries a meaning on its own a wrapper with `role="img"` and an `aria-label`. Putting them on `UIcon` does not work, because it stays hidden.
- Let the color follow the text. Use black for an icon on a pink or yellow fill, the same as a label (SPEC.md §2.1).
- Keep every icon from Phosphor Bold, the approved set (ADR-0012). Use the old weight only.

### When not to use

- Never mix in an icon from another set, or from another Phosphor weight. Only the owner changes the set (ADR-0012).
- Never make an icon the only way to convey a meaning when a word fits.
- Never use a white or yellow icon on a pink fill, or a white icon on a yellow fill.
- Never use the logo or a motif as a UI icon; they are `CnLogo` and the motif components.
- Never write a size or a color literally on an icon. Use the size classes of the parent and the inherited color (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Name an icon that carries a meaning, on a wrapper (`labeled.example.vue`). | Leave a meaningful icon without a name (`unlabeled.example.vue`). |
| Leave the icon beside a visible label as it is. | Add a second label that repeats the visible one. |
| Keep every icon from one set. | Mix icons from two sets because one has a glyph the other lacks. |

## Accessibility

- `UIcon` renders with `aria-hidden="true"`, so assistive technology skips it. A test proves it.
- A meaningful icon is wrapped in an element with `role="img"` and an `aria-label`. Nuxt UI keeps `aria-hidden="true"` on the icon itself, so the name must go on the wrapper. An icon that is the only content of a control is named on the control (`aria-label` on the button or link), and the icon stays hidden.
- An icon is not focusable and has no keyboard interaction.
- The color follows the text, so it meets the contrast pairs of the component that holds it (REQ-015). A glyph is a graphic object, which needs 3:1 against its background (WCAG 1.4.11).
- Nothing in an icon animates, except the loading spinner of the button, which stops under `prefers-reduced-motion: reduce` (REQ-029 AC2).

Keyboard map: the icon has no keyboard interaction.

## Content

An icon holds no text of its own. The `aria-label` of a meaningful icon names what it shows, in one to three words, in sentence case.

```copy es-MX
Advertencia
Favoritos
Buscar
```

```copy-bad es-MX
Icono de advertencia
Imagen
```

Do not write "icono" or "imagen" in the label; the role already says it.

## Responsive behavior

The icon keeps its size at 360, 768, and 1280 px (A-09). It scales with the size class of the component that holds it, not with the viewport.

## Email notes

Icons are not used as inline SVG in email, because many clients block it. An email that needs an icon uses an image with `alt` text, or leaves the icon out. This is described in [Email components](../../05-email/email-components.md).

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UIcon` |
| Props used | `name` (an Iconify name, for example `i-ph-star-bold`), `class` for the size. Nuxt UI sets `aria-hidden="true"`. |
| Theme | None. The icon inherits `currentColor`. |
| Tokens | None |
| Demos | `apps/showcase/demos/icon/` |

```vue
<UIcon name="i-ph-star-bold" class="size-5" />
```

A meaningful icon:

```vue
<span role="img" aria-label="Advertencia"><UIcon name="i-ph-warning-bold" class="size-6" /></span>
```

## Open items

> **Draft:** The brand context names no icon sizes. The size classes in the demos are examples. This awaits owner approval.

## Changelog

- 0.1.0 — First draft: `UIcon` as an inherited-color glyph, the decorative and meaningful roles, and the demos (T7.3) — awaiting the icon set (OD-09) and owner approval
- 0.1.0 — The icon set is Phosphor Bold, approved by the owner (option C); TBD-19 is resolved and `ui.icons` points to it — ADR-0012
