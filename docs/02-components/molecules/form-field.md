---
title: Form field
slug: form-field
layer: component
level: molecule
source: nuxt-ui
nuxtUi: UFormField
status: draft
lang: en
brandRules: [BR-06, BR-13]
tokens: [formField]
demos: [states, playground]
tbd: [TBD-04, TBD-05, TBD-07]
related: [input, textarea, select, checkbox, forms, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Form field

## Purpose

The form field puts a control, its label, its help text, and its error message together and ties them to each other, so a screen reader reads the label and the message with the control. It is a themed Nuxt UI `UFormField`. It adds no visual design of its own beyond text colors, so a field looks like the control inside it ([Input](../atoms/input.md), [Textarea](../atoms/textarea.md), [Select](../atoms/select.md)). It serves the legible, high-contrast UI of BR-06.

## Anatomy

1. **label**: the visible name, a real `<label>` tied to the control with `for` and `id`.
2. **hint**: an optional short note on the same line as the label, such as "Opcional".
3. **description**: an optional sentence under the label that explains what the field is for.
4. **control**: the input, textarea, or select, passed to the default slot.
5. **help**: an optional note under the control that explains the format.
6. **error**: the message under the control when the value is not valid. It replaces the help text.

## Tokens and specs

<!-- cn:generated tokens="formField" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `formField.description.fg` | `--cn-form-field-description-fg` | `#90a1b9` | tbd (TBD-05) |
| `formField.error.fg` | `--cn-form-field-error-fg` | `#90a1b9` | tbd (TBD-07) |
| `formField.help.fg` | `--cn-form-field-help-fg` | `#90a1b9` | tbd (TBD-05) |
| `formField.label.fg` | `--cn-form-field-label-fg` | `#90a1b9` | tbd (TBD-04) |

<!-- /cn:generated -->

The form field tokens only color text. They reference semantic tokens (REQ-010 AC2) that follow placeholders (TBD-04, TBD-05, TBD-07), so every one is `tbd` until the owner supplies the colors. The control keeps its own tokens: see [Input](../atoms/input.md).

Contrast pairs declared for the form field (REQ-015):

<!-- cn:generated tokens="formField" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `formField.label.fg` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.default`, `formField.label.fg`, `placeholder.color.neutral`) |
| `formField.description.fg` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.muted`, `formField.description.fg`, `placeholder.color.neutral`) |
| `formField.help.fg` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.muted`, `formField.help.fg`, `placeholder.color.neutral`) |
| `formField.error.fg` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.feedback.error`, `formField.error.fg`, `placeholder.color.neutral`) |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.

Until the text and feedback colors are defined, the error is told apart by its message and its icon, not by color (WCAG 1.4.1).

## Variants

The form field has one look. Its `orientation` prop picks the layout:

| Orientation | Layout |
|---|---|
| `vertical` (default) | The label above the control, the help or error under it. |
| `horizontal` | The label beside the control. Use only where the width allows, never at 360 px. |

The `size` prop (`xs` to `xl`) changes the text size and is passed to the control.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The label, and the help text under the control. | `formField.label.fg`, `formField.help.fg` |
| `hover` | The control's outline turns pink. The field's text does not change. | `input.borderHover` |
| `focus-visible` | The control shows the yellow focus ring. | `input.focus.color` |
| `disabled` | The control is natively disabled and dimmed. The label stays readable. | none |
| `error` | The error message and its icon replace the help text. The control gets `aria-invalid="true"`. | `formField.error.fg`, `input.error.border` |

A field has no `active` state of its own. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Wrap every input, textarea, select, or other control that takes a value in a form field.
- Give every field a `label`. A placeholder is never the label (WCAG 3.3.2).
- Use `help` to say the format before the person types, and `error` to say what to fix after.
- Pass `name` when the field is inside a Nuxt UI form, so validation errors reach it.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never set `help` and `error` at once. The error replaces the help text, and the help id would point to nothing.
- Never pass the `error` slot while there is no error. Nuxt UI hides the help text whenever the slot exists, so give the slot with `v-if` on the error.
- Never use a field without a label, or hide the label with CSS.
- Never write the error as a placeholder or a color change alone.
- Never write a color literally in a field. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Write a visible label: "Correo electrónico". | Use only a placeholder as the label. |
| Say what to do in the error: "Escribe un correo con arroba, por ejemplo `nombre@ejemplo.mx`." | Write "Error" or "Campo inválido". |
| Put the icon inside the `error` slot, so the error is not color alone. | Show the error only by turning text a color. |
| Use `hint` for "Opcional". | Mark required fields with a color alone. |

## Accessibility

- The label is a `<label for>` tied to the control by an id that Nuxt UI generates. Clicking the label focuses the control.
- The control gets `aria-describedby` listing the ids of the hint, the description, the help, and the error that are set. A screen reader reads them after the control's name.
- In the error state the control has `aria-invalid="true"`. It is `false` otherwise.
- The error is shown by its message and its icon as well as by color (WCAG 1.4.1). The icon is `aria-hidden`.
- A required field shows an asterisk after the label. Set `required` on the control as well when the browser should enforce it.
- Text is 4.5:1 or more against the page where the colors are defined (REQ-015).

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the control and shows its focus ring. A disabled control is skipped. |
| Shift + Tab | Moves focus to the previous control. |
| Click on the label | Moves focus to the control. |

ARIA: the field adds no `role`. The control gets `aria-invalid` and `aria-describedby`.

## Content

- Write the label as a noun, in two to four words.
- Write the help as the format or an example, not an instruction.
- Write the error to say what to fix and how, in one sentence that ends with a period.

```copy es-MX
Correo electrónico
Lo usamos solo para avisarte.
Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.
```

```copy-bad es-MX
Email
Error
Campo inválido
```

## Responsive behavior

The field fills the width of its container and is the same at 360, 768, and 1280 px (A-09). Use the `vertical` orientation at 360 px. Long labels and messages wrap and never cause horizontal overflow (REQ-028 AC1).

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UFormField` |
| Props used | `label`, `help`, `error`, `description`, `hint`, `required`, `name`, `size`, `orientation` |
| Slots used | default, `error` (for the icon) |
| Theme | `ui.formField.slots` in `packages/nuxt/app.config.ts` and the `.cn-form-field__*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `formField.*` |
| Demos | `apps/showcase/demos/form-field/` |

```vue
<UFormField label="Correo electrónico" help="Lo usamos solo para avisarte.">
  <UInput type="email" placeholder="nombre@ejemplo.mx" />
</UFormField>
```

With an error, pass `error`, drop `help`, and render the `error` slot only for that case:

```vue
<UFormField label="Correo electrónico" :error="mensaje">
  <UInput type="email" />
  <template v-if="mensaje" #error="{ error }">
    <UIcon name="i-ph-x-circle-bold" /> {{ error }}
  </template>
</UFormField>
```

## Open items

> **TBD (TBD-04):** The body text color is not decided. The label reads a placeholder, not a brand value. Owner input needed: a hex.
>
> **TBD (TBD-05):** The neutral scale is not defined. The description, hint, and help text read a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-07):** The feedback colors are not defined. The error text reads the same placeholder as the other text, so today the error is told apart by its message and icon, not by color. Owner input needed: a hex set.
>
> **Draft:** The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UFormField` themed with token text colors, the five states, the component tokens, and the demos (T8.1) — awaiting owner approval of the placeholders
