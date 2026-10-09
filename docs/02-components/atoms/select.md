---
title: Select
slug: select
layer: component
level: atom
source: nuxt-ui
nuxtUi: USelect
status: draft
lang: en
brandRules: [BR-06, BR-10, BR-13]
tokens: [input]
demos: [states, playground]
tbd: [TBD-04, TBD-05, TBD-06, TBD-07, TBD-10, TBD-11]
related: [input, textarea, button, form-field, forms, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Select

## Purpose

The select lets a person choose one option from a short, fixed list. It is a themed Nuxt UI `USelect`, so the trigger, the list, and the keyboard behavior come from Nuxt UI and are not rebuilt here (ER-01, REQ-020 AC3). Its trigger has the same look and the same `input.*` tokens as the [input](input.md) and the [textarea](textarea.md). The look is a draft that awaits the owner's approval (see the input doc).

## Anatomy

1. **label**: the visible name of the field, a `<label>` tied to the trigger with `for` and `id`. The page supplies the text (A-11).
2. **trigger**: the button that shows the chosen option, or the placeholder, and a chevron.
3. **outline**: the border around the trigger. Its color is the state.
4. **list**: the popup of options, drawn by Nuxt UI in a portal. The option that the keyboard is on is drawn with a yellow ring.
5. **focus ring**: the yellow outline drawn outside the trigger on keyboard focus (REQ-024, ADR-0009).
6. **error message**: text under the trigger, linked with `aria-describedby`, that starts with an icon.

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

The select reads the shared text-field tokens `input.*`, `radius.input`, and `border.width.input`. The highlighted option reuses the focus tokens `input.focus.*`. Their sources, statuses, and the placeholders behind them are explained in the [input doc](input.md#tokens-and-specs).

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

The outline is the boundary of the trigger on the pure-black page (BR-03, BR-13, C-05). The list sits on the same black page color until the elevated surface is decided (TBD-06), and its boundary is Nuxt UI's neutral ring.

## Variants

The select has one brand look and no `variant` or `color` mapping. The `size` prop (`xs`, `sm`, `md`, `lg`, `xl`) changes the padding and text size. `items` holds the options as a list of text values.

| Brand look | Nuxt UI props | Outline | Fill |
|---|---|---|---|
| default | none | Neutral at rest, pink on hover | The black page |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | A neutral outline on the black page. | `input.border`, `input.bg`, `input.fg` |
| `hover` | The outline turns brand pink. | `input.borderHover` |
| `focus-visible` | A yellow ring outside the trigger. | `input.focus.color`, `input.focus.width`, `input.focus.offset`, `input.focus.style` |
| `disabled` | The trigger is disabled, cannot be focused, and Nuxt UI dims it. It ignores hover. | none |
| `error` | The outline takes the error color, `aria-invalid="true"` is set, and the error message sits under the trigger. | `input.error.border`, `input.error.fg` |

A select has no `active` state of its own: pressing it opens the list, which the keyboard map below covers. The state matrix shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a select to choose one option from a short list that the person knows.
- Give it a visible label tied to the trigger with `for` and `id`.
- Write a placeholder that tells the person to choose: "Elige una categoría".
- When no option is chosen and one is required, set `aria-invalid="true"` and link the message with `aria-describedby`.

### When not to use

- Never use a select for free text. Use [Input](input.md).
- Never use a select for two or three options the person should compare at once. Use a radio group (T7.5).
- Never hand-roll a list or a popup. Nuxt UI provides it (ER-01).
- Never remove the focus ring or replace it with a glow (REQ-024).
- Never write a color literally in a field. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Write a visible label: "Categoría". | Use only the placeholder as the label. |
| Say what to do in the error: "Elige una categoría de la lista." | Write "Error". |
| Link the error with `aria-describedby` and set `aria-invalid`. | Show the error only by turning the outline a color. |

## Accessibility

- The trigger is a native `<button>` with `role="combobox"`, `aria-expanded`, and `aria-haspopup="listbox"`. It is named by its `<label>`.
- The list has `role="listbox"` and each option has `role="option"`. Nuxt UI sets these roles and the focus movement, so the select adds no ARIA of its own.
- In the error state the trigger has `aria-invalid="true"` and `aria-describedby` pointing at the id of the error message (WCAG 3.3.1). A test proves the link (REQ-027).
- The error is shown by the message and its icon as well as by the outline color (WCAG 1.4.1).
- The focus ring shows on `:focus-visible` and not on a mouse press (REQ-024 AC2). After a choice the list returns focus to the trigger by script, and browsers may then treat that focus as keyboard focus and draw the ring. The ring is an outline, not the glow (REQ-024 AC1).
- The option the keyboard is on is drawn with the focus ring, because the highlight fill reads the page black (C-05).
- A disabled trigger is announced as unavailable and skipped by Tab.

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the trigger and shows the focus ring. A disabled select is skipped. |
| Enter or Space | Opens the list on the chosen option, or on the first. |
| Arrow Down or Arrow Up | Moves the highlight to the next or previous option. |
| Enter | Chooses the highlighted option and closes the list. |
| Escape | Closes the list without changing the choice and returns focus to the trigger. |

## Content

- Write the label as a noun: "Categoría", "País".
- Write the placeholder as an instruction to choose: "Elige una categoría".
- Write each option as a short noun phrase of one to three words, in the order a person expects.
- Write the error to say what to do, in one sentence that ends with a period.

```copy es-MX
Categoría
Elige una categoría
Juegos de mesa
Elige una categoría de la lista.
```

```copy-bad es-MX
Selecciona
Error
```

## Responsive behavior

The trigger fills the width of its container and is the same at 360, 768, and 1280 px (A-09). The list is as wide as the trigger and scrolls when it is taller than the space available, so it fits a 360 px screen. The focus ring reaches 6 px outside the trigger, so leave room around fields inside scrolling containers.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `USelect` |
| Props used | `id`, `items`, `placeholder`, `size`, `disabled`, `aria-invalid`, `aria-describedby` |
| Theme | `ui.select.slots.base` and `ui.select.slots.item` in `packages/nuxt/app.config.ts` and the `.cn-field` and `.cn-select-item` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `input.*`, `radius.input`, `border.width.input` |
| Demos | `apps/showcase/demos/select/` |

```vue
<label for="categoria">Categoría</label>
<USelect id="categoria" :items="['Cartas', 'Juegos de mesa']" placeholder="Elige una categoría" />
```

## Open items

> **TBD (TBD-04):** The chosen option's text reads the body text color placeholder. See the [input doc](input.md#open-items).
>
> **TBD (TBD-05):** The placeholder text and the outline at rest read the neutral placeholder. See the [input doc](input.md#open-items).
>
> **TBD (TBD-07):** The error outline and the error text read the feedback placeholder. See the [input doc](input.md#open-items).
>
> **TBD (TBD-10):** The corner radius follows the ADR-0006 placeholder. See the [input doc](input.md#open-items).
>
> **TBD (TBD-11):** The stroke width follows the ADR-0006 placeholder. See the [input doc](input.md#open-items).
>
> **TBD (TBD-06):** The list uses Nuxt UI's own ring and the page black as its surface, because the elevated surface color is not defined.
>
> **Draft:** While the list is open, Reka UI (under Nuxt UI) hides the rest of the page with `aria-hidden` and leaves the trigger focusable, so axe reports `aria-hidden-focus` on that open state. axe is clean in every state of the matrix, where the list is closed. This is the library's behavior, and the select does not change it.
>
> **Draft:** The look is the shared text-field draft and awaits owner approval.

## Changelog

- 0.1.0 — First draft: `USelect` themed with the shared text-field look, the five states, a visible keyboard highlight in the list, and the demos (T7.4) — awaiting owner approval
