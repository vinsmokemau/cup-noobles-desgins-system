---
title: Separator
slug: separator
layer: component
level: atom
source: nuxt-ui
nuxtUi: USeparator
status: draft
lang: en
brandRules: [BR-06, BR-13]
tokens: [separator]
demos: [states, playground]
tbd: [TBD-05, TBD-11]
related: [progress, skeleton, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Separator

## Purpose

The separator is a line that splits two groups of content. It is a themed Nuxt UI `USeparator`, styled only through tokens (C-03). The line is neutral, so it stays quiet next to the pink links and buttons, where pink would read as an action. The brand context does not describe a divider, so the look in this doc is a draft built from existing tokens. The owner chose it from three options (ADR-0015).

## Anatomy

1. **line**: the stroke, drawn as a border on a block that spans the container.
2. **label** (optional): short text in the middle of the line. The page supplies it (A-11).

## Tokens and specs

<!-- cn:generated tokens="separator" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `separator.bg` | `--cn-separator-bg` | `#000000` | stable |
| `separator.color` | `--cn-separator-color` | `#90a1b9` | tbd (TBD-05) |

<!-- /cn:generated -->

The line color follows a placeholder (TBD-05) and the stroke width is the token `border.width.separator` on the shape page, which follows a placeholder too (TBD-11). Both are `tbd` until the owner supplies them.

Contrast pairs declared for the separator (REQ-015):

<!-- cn:generated tokens="separator" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `separator.color` (`#90a1b9`) | `separator.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.border.default`, `placeholder.color.neutral`, `separator.color`) |

<!-- /cn:generated -->

### Brand rules

> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

A separator is decoration for sighted users, so its line is held to the 3:1 rule for UI components. The neutral line is 7.98:1 against the black page with the placeholder grey, unverified (REQ-015 AC4).

## Variants

The separator has one brand look. Nuxt UI's `color` prop is not used: the theme sets the line color for every instance.

| Variant | Nuxt UI props | Result |
|---|---|---|
| horizontal | none | A line across the width of the container |
| vertical | `orientation="vertical"` | A line along the height of its parent, which needs a height |
| with a label | `label` | A line broken by short text |

The `size`, `type`, and `color` props of Nuxt UI do not change the line: the theme sets the width and color from tokens. A dashed or dotted line is not part of this system.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | A neutral line. | `separator.color`, `border.width.separator` |

A separator is not interactive, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. The state matrix on the component page shows the horizontal line, the line with a label, and the vertical line, and the state has a visual baseline.

## Usage rules

### When to use

- Use a separator to split two groups of content that belong to the same container, such as two sections of a settings list.
- Use the label when the line says something, such as "o" between two sign-in options.
- Mark a purely visual line `decorative`, so it is hidden from assistive technology.

### When not to use

- Never use a separator for spacing. Use space tokens.
- Never use a separator as a card outline or a frame. Those are outlines (BR-13).
- Never use a pink separator. Pink marks an action.
- Never write a color or a width literally in a separator. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Split two groups with one line. | Put a line between every pair of items. |
| Mark a purely visual line `decorative`. | Leave a visual line announced as a separator. |
| Give a vertical separator a parent with a height. | Place a vertical separator in a parent with no height. |

## Accessibility

- A separator without `decorative` has `role="separator"`. A vertical one also has `aria-orientation="vertical"`; a horizontal one is horizontal by default.
- A `decorative` separator has `role="none"` and is hidden from assistive technology.
- A separator is not focusable and has no keyboard interaction.
- The label is visible text, so it is read as content.

Keyboard map: not applicable, because the separator is not interactive. A Playwright test checks that Tab skips it.

ARIA: `role="separator"` and `aria-orientation` (vertical only), or `role="none"` when `decorative`, set by Reka UI.

## Content

- Keep the label to one or two words: "o".
- A separator holds no text unless the page passes a label.

```copy es-MX
o
Más opciones
```

```copy-bad es-MX
-----
O BIEN, SI PREFIERES OTRA OPCIÓN
```

## Responsive behavior

A horizontal separator fills the width of its container, so it is the same at 360, 768, and 1280 px (A-09).

## Email notes

Not applicable. A divider in email is an MJML component, described in [Email components](../../05-email/email-components.md).

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `USeparator` |
| Props used | `orientation`, `label`, `decorative` |
| Theme | `ui.separator.slots.border` and the orientation hooks in `packages/nuxt/app.config.ts` and the `.cn-separator*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `separator.*`, `border.width.separator` |
| Demos | `apps/showcase/demos/separator/` |

```vue
<USeparator />
```

## Open items

> **TBD (TBD-05):** The neutral scale is not defined. The line color reads a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-11):** "Thick" has no values. The line follows the placeholder stroke width. Owner input needed: values.
>
> **Draft:** The look (a neutral line) is approved (ADR-0015). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `USeparator` themed as a neutral line, the horizontal, vertical, and labeled variants, the component tokens, and the demos (T7.6) — look approved (ADR-0015), awaiting the placeholders
