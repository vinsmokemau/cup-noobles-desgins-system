---
title: Textarea
slug: textarea
layer: component
level: atom
source: nuxt-ui
nuxtUi: UTextarea
status: draft
lang: en
brandRules: [BR-06, BR-10, BR-13]
tokens: [input]
demos: [states, playground]
tbd: [TBD-04, TBD-05, TBD-07, TBD-10, TBD-11]
related: [input, select, button, form-field, forms, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Textarea

## Purpose

The textarea is a multi-line text field: the place where a person writes a longer answer such as a comment or a message. It is a themed Nuxt UI `UTextarea`. It has the same look and the same `input.*` tokens as the [input](input.md) and the [select](select.md), so the three always match. The look comes from the owner (ADR-0013).

## Anatomy

1. **label**: the visible name of the field, a `<label>` tied to the control with `for` and `id`. The page supplies the text (A-11).
2. **control**: the `<textarea>` element, with the typed text or the placeholder.
3. **outline**: the border around the control. Its color is the state.
4. **focus ring**: the yellow outline drawn outside the control on focus (REQ-024, ADR-0009).
5. **error message**: text under the control, linked with `aria-describedby`, that starts with an icon.

## Tokens and specs

<!-- cn:generated tokens="input" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `input.bg` | `--cn-input-bg` | `#000000` | stable |
| `input.border` | `--cn-input-border` | `#90a1b9` | tbd (TBD-05) |
| `input.borderHover` | `--cn-input-border-hover` | `#ef80ae` | stable |
| `input.error.border` | `--cn-input-error-border` | `#90a1b9` | tbd (TBD-07) |
| `input.error.fg` | `--cn-input-error-fg` | `#90a1b9` | tbd (TBD-07) |
| `input.fg` | `--cn-input-fg` | `#90a1b9` | tbd (TBD-04) |
| `input.focus.color` | `--cn-input-focus-color` | `#fff488` | stable |
| `input.focus.offset` | `--cn-input-focus-offset` | `3px` | stable |
| `input.focus.style` | `--cn-input-focus-style` | `solid` | stable |
| `input.focus.width` | `--cn-input-focus-width` | `3px` | stable |
| `input.placeholder` | `--cn-input-placeholder` | `#90a1b9` | tbd (TBD-05) |

<!-- /cn:generated -->

The textarea reads the shared text-field tokens `input.*`, `radius.input`, and `border.width.input`. Their sources, statuses, and the placeholders behind them are explained in the [input doc](input.md#tokens-and-specs).

Contrast pairs declared for the text fields (REQ-015):

<!-- cn:generated tokens="input" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `input.fg` (`#90a1b9`) | `input.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.default`, `input.fg`, `placeholder.color.neutral`) |
| `input.placeholder` (`#90a1b9`) | `input.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.muted`, `input.placeholder`, `placeholder.color.neutral`) |
| `input.border` (`#90a1b9`) | `input.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.border.default`, `input.border`, `placeholder.color.neutral`) |
| `input.borderHover` (`#ef80ae`) | `input.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `input.error.border` (`#90a1b9`) | `input.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.feedback.error`, `input.error.border`, `placeholder.color.neutral`) |
| `input.error.fg` (`#90a1b9`) | `input.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.feedback.error`, `input.error.fg`, `placeholder.color.neutral`) |
| `input.focus.color` (`#fff488`) | `input.bg` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.

The outline is the boundary of the field on the pure-black page (BR-03, BR-13, C-05).

## Variants

The textarea has one brand look and no `variant` or `color` mapping. The `size` prop (`xs`, `sm`, `md`, `lg`, `xl`) changes the padding and text size, `rows` sets the starting height, and `autoresize` makes the field grow with its text.

| Brand look | Nuxt UI props | Outline | Fill |
|---|---|---|---|
| default | none | Neutral at rest, pink on hover | The black page |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | A neutral outline on the black page. | `input.border`, `input.bg`, `input.fg` |
| `hover` | The outline turns brand pink. | `input.borderHover` |
| `focus-visible` | A yellow ring outside the field. | `input.focus.color`, `input.focus.width`, `input.focus.offset`, `input.focus.style` |
| `disabled` | The field is natively disabled, cannot be focused, and Nuxt UI dims it. It ignores hover. | none |
| `error` | The outline takes the error color, `aria-invalid="true"` is set, and the error message sits under the field. | `input.error.border`, `input.error.fg` |

A text field has no `active` state of its own: pressing it focuses it, and `focus-visible` covers that. The state matrix shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a textarea for an answer of more than one line, such as a comment or a message.
- Give it a visible label tied to it with `for` and `id`.
- When the value is not valid, set `aria-invalid="true"` and link the message with `aria-describedby`.
- Pass the label, placeholder, and message as text from the page (A-11).

### When not to use

- Never use a textarea for a short, single-line answer. Use [Input](input.md).
- Never use the placeholder instead of a label.
- Never remove the focus ring or replace it with a glow (REQ-024).
- Never write a color literally in a field. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Write a visible label: "Comentarios del pedido". | Use only a placeholder as the label. |
| Say what to fix: "Escribe al menos 10 caracteres." | Write "Error". |
| Link the error with `aria-describedby` and set `aria-invalid`. | Show the error only by turning the outline a color. |

## Accessibility

- The control is a native `<textarea>`, named by its `<label>`.
- In the error state the control has `aria-invalid="true"` and `aria-describedby` pointing at the id of the error message (WCAG 3.3.1). A test proves the link (REQ-027).
- The error is shown by the message and its icon as well as by the outline color (WCAG 1.4.1).
- The focus ring shows on `:focus-visible`, which browsers also match for a text field on a mouse click (see the input doc). The ring is an outline, not the glow (REQ-024 AC1).
- A disabled textarea is natively disabled: it is announced as unavailable and skipped by Tab.
- Tab leaves the field. The textarea never traps focus.

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the textarea and shows the focus ring. A disabled textarea is skipped. |
| Enter | Starts a new line. |
| Any character | Types into the textarea. |
| Shift + Tab | Moves focus to the previous control. |

ARIA: no `role` is added to a native textarea. The error state adds `aria-invalid="true"` and `aria-describedby`.

## Content

- Write the label as a noun phrase: "Comentarios del pedido", "Mensaje".
- Write the placeholder as a prompt for what to write: "Cuéntanos qué necesitas".
- Write the error to say what to fix, in one sentence that ends with a period.

```copy es-MX
Comentarios del pedido
Cuéntanos qué necesitas
Escribe al menos 10 caracteres.
```

```copy-bad es-MX
Comentarios
Error
```

## Responsive behavior

The textarea fills the width of its container and is the same at 360, 768, and 1280 px (A-09). The focus ring reaches 6 px outside the field, so leave room around fields inside scrolling containers.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UTextarea` |
| Props used | `id`, `rows`, `placeholder`, `size`, `disabled`, `aria-invalid`, `aria-describedby` |
| Theme | `ui.textarea.slots.base` in `packages/nuxt/app.config.ts` and the `.cn-field` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `input.*`, `radius.input`, `border.width.input` |
| Demos | `apps/showcase/demos/textarea/` |

```vue
<label for="comentarios">Comentarios del pedido</label>
<UTextarea id="comentarios" :rows="3" placeholder="Cuéntanos qué necesitas" />
```

## Open items

> **TBD (TBD-04):** The typed text reads the body text color placeholder. See the [input doc](input.md#open-items).
>
> **TBD (TBD-05):** The placeholder text and the outline at rest read the neutral placeholder. See the [input doc](input.md#open-items).
>
> **TBD (TBD-07):** The error outline and the error text read the feedback placeholder. See the [input doc](input.md#open-items).
>
> **TBD (TBD-10):** The corner radius follows the ADR-0006 placeholder. See the [input doc](input.md#open-items).
>
> **TBD (TBD-11):** The stroke width follows the ADR-0006 placeholder. See the [input doc](input.md#open-items).
>
> **Draft:** The look of the fields (a neutral outline that turns pink on hover, with the yellow focus ring) is approved (ADR-0013). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UTextarea` themed with the shared text-field look, the five states, and the demos (T7.4) — awaiting owner approval of the placeholders
