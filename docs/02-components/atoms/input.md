---
title: Input
slug: input
layer: component
level: atom
source: nuxt-ui
nuxtUi: UInput
status: stable
lang: en
brandRules: [BR-06, BR-10, BR-13]
tokens: [input]
demos: [states, playground]
tbd: []
related: [textarea, select, button, form-field, forms, accessibility]
since: 0.1.0
updated: 2026-10-19
---

# Input

## Purpose

The input is a single-line text field: the place where a person types a short answer such as a name, an e-mail address, or a search. It is a themed Nuxt UI `UInput`, styled only through tokens (C-03). It sits on the pure-black page (BR-03) and is separated from it by an outline (BR-13, C-05). The brand context does not describe a form field, so the look in this doc comes from the owner (ADR-0013). The [textarea](textarea.md) and the [select](select.md) share this look and these tokens.

## Anatomy

1. **label**: the visible name of the field, a `<label>` tied to the control with `for` and `id`. The input never holds copy (A-11), so the page supplies it. [FormField](../molecules/form-field.md) wires it for an app.
2. **control**: the `<input>` element, with the typed text or the placeholder.
3. **outline**: the border drawn around the control. Its color is the state: neutral at rest, pink on hover, and the error color when the value is not valid.
4. **focus ring**: the yellow outline drawn outside the control on focus (REQ-024, ADR-0009).
5. **error message**: text under the control that says what is wrong. It is linked to the control with `aria-describedby` and starts with an icon, so the error is not shown by color alone.

## Tokens and specs

<!-- cn:generated tokens="input" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `input.bg` | `--cn-input-bg` | `#000000` | stable |
| `input.border` | `--cn-input-border` | `#8c8c8c` | stable |
| `input.borderHover` | `--cn-input-border-hover` | `#ef80ae` | stable |
| `input.error.border` | `--cn-input-error-border` | `#ff5c5c` | stable |
| `input.error.fg` | `--cn-input-error-fg` | `#ff5c5c` | stable |
| `input.fg` | `--cn-input-fg` | `#f5f5f5` | stable |
| `input.focus.color` | `--cn-input-focus-color` | `#fff488` | stable |
| `input.focus.offset` | `--cn-input-focus-offset` | `3px` | stable |
| `input.focus.style` | `--cn-input-focus-style` | `solid` | stable |
| `input.focus.width` | `--cn-input-focus-width` | `3px` | stable |
| `input.placeholder` | `--cn-input-placeholder` | `#bdbdbd` | stable |

<!-- /cn:generated -->

The text-field tokens are shared by the input, the textarea, and the select, so the three always match. The component tokens only reference semantic tokens (REQ-010 AC2). The corner radius is `stable`: the text fields use the medium radius step (ADR-0050). The text, placeholder, outline, and error colors and the stroke width are `stable` (ADR-0032), and so are the fill, the hover outline, and the focus tokens.

Contrast pairs declared for the text fields (REQ-015):

<!-- cn:generated tokens="input" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `input.fg` (`#f5f5f5`) | `input.bg` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `input.placeholder` (`#bdbdbd`) | `input.bg` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `input.border` (`#8c8c8c`) | `input.bg` (`#000000`) | ui | 6.25:1 | 3.00:1 | pass |
| `input.borderHover` (`#ef80ae`) | `input.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `input.error.border` (`#ff5c5c`) | `input.bg` (`#000000`) | ui | 6.94:1 | 3.00:1 | pass |
| `input.error.fg` (`#ff5c5c`) | `input.bg` (`#000000`) | text | 6.94:1 | 4.50:1 | pass |
| `input.focus.color` (`#fff488`) | `input.bg` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The outline is the field's boundary, because there is no surface color yet (C-05). The stroke width is 3 px (ADR-0032). Pink on black is 8.37:1 and the yellow focus ring is 18.55:1 (SPEC.md §2.1).

## Variants

The input has one brand look. Nuxt UI's `variant` and `color` props are not used: the theme sets the look through the `.cn-field` hook class, so there is nothing to map.

| Brand look | Nuxt UI props | Outline | Fill |
|---|---|---|---|
| default | none | Neutral at rest, pink on hover | The black page |

The `size` prop (`xs`, `sm`, `md`, `lg`, `xl`) changes the padding and the text size. Use the `type` prop for the kind of value: `text`, `email`, `password`, `search`, `tel`, `url`, or `number`.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | A neutral outline on the black page. | `input.border`, `input.bg`, `input.fg` |
| `hover` | The outline turns brand pink. | `input.borderHover` |
| `focus-visible` | A yellow ring outside the field. | `input.focus.color`, `input.focus.width`, `input.focus.offset`, `input.focus.style` |
| `disabled` | The field is natively disabled, cannot be focused, and Nuxt UI dims it. It ignores hover. | none |
| `error` | The outline takes the error color, `aria-invalid="true"` is set, and the error message sits under the field. | `input.error.border`, `input.error.fg` |

A text field has no `active` state of its own: pressing it focuses it, and `focus-visible` covers that. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use an input for a short, single-line answer.
- Give every input a visible label tied to it with `for` and `id`. A placeholder is never the label (WCAG 3.3.2).
- Set the `type` that matches the value, so the keyboard and the browser's check fit it.
- When the value is not valid, set `aria-invalid="true"` and link the message with `aria-describedby`.
- Pass the label, placeholder, and message as text from the page. The component never holds copy (A-11).

### When not to use

- Never use an input for several lines. Use [Textarea](textarea.md).
- Never use an input to pick from a fixed list. Use [Select](select.md).
- Never use the placeholder instead of a label, and never put the error text in the placeholder.
- Never remove the focus ring or replace it with a glow (REQ-024).
- Never write a color literally in a field. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Write a visible label above the field: "Correo electrónico". | Use only a placeholder as the label. |
| Say what to do in the error: "Escribe un correo con arroba, por ejemplo `nombre@ejemplo.mx`." | Write "Error" or "Campo inválido". |
| Link the error with `aria-describedby` and set `aria-invalid`. | Show the error only by turning the outline a color. |
| Keep the field at least 24 px tall (REQ-028 AC2). | Shrink a field below its touch target. |

## Accessibility

- The control is a native `<input>`. It is named by its `<label>`, and the placeholder is only a hint.
- In the error state the control has `aria-invalid="true"` and `aria-describedby` pointing at the id of the error message, so a screen reader reads the message with the field (WCAG 3.3.1). A test proves the link (REQ-027).
- The error is shown by the message and its icon as well as by the outline color (WCAG 1.4.1).
- The focus ring shows on `:focus-visible`. Browsers match `:focus-visible` for a text field on a mouse click too, because the person is about to type; this is native behavior and the ring is not drawn for other controls on a click (REQ-024 AC2). The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1).
- A disabled input is natively disabled: it is announced as unavailable and skipped by Tab.
- Placeholder text is 4.5:1 or more against the fill (REQ-015).

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the input and shows the focus ring. A disabled input is skipped. |
| Shift + Tab | Moves focus to the previous control. |
| Any character | Types into the input. |

ARIA: no `role` is added to a native input. The error state adds `aria-invalid="true"` and `aria-describedby`.

## Content

- Write the label as a noun, in two to four words: "Correo electrónico", "Nombre completo".
- Write the placeholder as an example of the value, not as an instruction: `nombre@ejemplo.mx`.
- Write the error to say what to fix and how, in one sentence that ends with a period.

```copy es-MX
Correo electrónico
nombre@ejemplo.mx
Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.
```

```copy-bad es-MX
Email
Error
Campo inválido
```

## Responsive behavior

The input fills the width of its container and is the same at 360, 768, and 1280 px (A-09). Stack fields in one column at 360 px. The focus ring reaches 6 px outside the field, so leave room around fields inside scrolling containers.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UInput` |
| Props used | `id`, `type`, `placeholder`, `size`, `disabled`, `aria-invalid`, `aria-describedby` |
| Theme | `ui.input.slots.base` in `packages/nuxt/app.config.ts` and the `.cn-field` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `input.*`, `radius.input`, `border.width.input` |
| Demos | `apps/showcase/demos/input/` |

```vue
<label for="correo">Correo electrónico</label>
<UInput id="correo" type="email" placeholder="nombre@ejemplo.mx" />
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: `UInput` themed with the shared text-field look, the five states, the component tokens, and the demos (T7.4) — awaiting owner approval of the placeholders
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
- 0.1.0 — Approved as stable by the owner, with every point of the draft callouts decided. No value or rule changes — ADR-0060
