---
title: Forms
slug: forms
layer: pattern
status: draft
lang: en
brandRules: [BR-06, BR-13]
demos: [composed]
tbd: [TBD-04, TBD-05, TBD-07]
related: [form-field, input, textarea, select, checkbox, button, alert, feedback, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Forms

## Purpose

A form asks a person for information and sends it. This pattern says how the system's parts come together in one: a single column of labelled fields, validation that explains itself, and a submit that says what happened. It builds only on the system's parts, so every form is legible and high-contrast (BR-06) and uses the same thick line work (BR-13). The parts are documented one by one, starting with [Form field](../02-components/molecules/form-field.md); this doc is about how they work together.

## Usage rules

### When to use

- Use a form whenever the person types, picks, or confirms values and then sends them as one action.
- Lay the fields out in one column, in the order the person thinks of the answers.
- Wrap every control in a [Form field](../02-components/molecules/form-field.md) with a visible label. Pass `name` to the field, so the form's validation reaches it.
- Say what is optional with the hint "Opcional", and mark what is required with `required`. Say the format in the `help` text before the person types.
- Group related controls under one label, with a [Radio group](../02-components/atoms/radio-group.md) or a set of [Checkboxes](../02-components/atoms/checkbox.md), instead of repeating the label.
- Validate when the person leaves a field and when they submit. Never show an error for a field the person has not reached yet.
- On a failed submit, do three things together: show one [Alert](../02-components/molecules/alert.md) at the top of the form that says how many fields need a fix, show the message under each field, and move focus to the first field with an error.
- Put the main action first, as a `primary` [Button](../02-components/atoms/button.md), and any other action after it as `ghost`. Use `loading` on the main action while the form is sent.
- Say the result. Replace the form with a success [Alert](../02-components/molecules/alert.md), or use a toast when the person stays on the page (see [Feedback](feedback.md)).

### When not to use

- Never use a placeholder as the label. It disappears when the person types (WCAG 3.3.2).
- Never show an error by color alone. The message and its icon carry it (WCAG 1.4.1).
- Never disable the submit button to stop people from sending an incomplete form. A disabled button gives no reason, so say what to fix instead.
- Never write "Error" or "Campo inválido" as a message. Say what to fix and how.
- Never put a long form in a [Modal](../02-components/organisms/modal.md). Use a page.
- Never lay fields out in several columns at 360 px. One column works at every width.
- Never ask for a value the form does not use.

## Do and don't

| Do | Don't |
|---|---|
| Label every field with a noun: "Correo electrónico". | Use only the placeholder `nombre@ejemplo.mx` as the label. |
| Tell the person what to fix: "Escribe un correo con arroba, por ejemplo `nombre@ejemplo.mx`." | Write "Error" or "Campo inválido". |
| Say how many fields need a fix in one alert: "Revisa 2 campos". | Show messages under the fields and nothing at the top. |
| Move focus to the first field with an error. | Leave focus on the submit button after a failed submit. |
| Name the submit with a verb and its object: "Enviar mensaje". | Name it "Aceptar" or "OK". |
| Keep the submit enabled, and explain what is missing. | Disable the submit until every field is valid. |

## Accessibility

- Every control has a real `<label>` tied to it by Nuxt UI, and an error sets `aria-invalid="true"` and is listed in `aria-describedby`. See [Form field](../02-components/molecules/form-field.md).
- The summary alert has `role="alert"`, so a screen reader reads it when it appears, without moving focus to it. Focus goes to the first field with an error, and the field's own message is read with it.
- Pass `autocomplete` on fields that ask for the person's own details, such as a name or an email (WCAG 1.3.5).
- Tab order follows the visual order, which is the DOM order. Nothing in a form sets a positive `tabindex`.
- Every control and every button is at least 24 × 24 px (REQ-028 AC2), and shows the yellow focus ring on `:focus-visible` (REQ-024).
- Text is 4.5:1 or more against the page, and borders are 3:1 or more, where the colors are defined (REQ-015).

Keyboard map:

| Key | Result |
|---|---|
| Tab | Moves focus to the next control or button, and shows the focus ring. |
| Shift + Tab | Moves focus to the previous one. |
| Enter in a text field | Submits the form. |
| Space on a checkbox | Turns it on or off. |
| Enter or Space on the select | Opens the list. Arrow keys move, Enter picks, Escape closes. |
| Enter or Space on a button | Activates it. |

ARIA: the form adds no `role` beyond `<form>`. The summary alert has `role="alert"`; a success message has `role="status"`.

## Content

- Write a label as a noun, in two to four words.
- Write an error as one sentence that says what to fix and how, and ends with a period.
- Write the summary as the count of fields to fix: "Revisa 1 campo", "Revisa 3 campos".
- Write buttons as verbs, with their object when it helps: "Enviar mensaje".
- Never put the person's blame in a message. Say "Escribe un correo con arroba", not "Escribiste mal el correo".

```copy es-MX
Nombre
Correo electrónico
Opcional
Revisa 2 campos
Corrige lo marcado y vuelve a enviar.
Escribe tu nombre.
Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.
Enviar mensaje
Mensaje enviado
```

```copy-bad es-MX
Error
Campo inválido
Escribiste mal el correo
Aceptar
```

## Responsive behavior

The form is one column at 360, 768, and 1280 px (A-09). Fields fill the width of the column, and the column has a maximum width so lines stay short on a wide screen. The buttons sit in a row and wrap to the next line when there is no room (ER-05). Nothing causes horizontal overflow (REQ-028 AC1).

## Code reference

| Item | Value |
|---|---|
| Nuxt UI components | `UForm`, `UFormField`, `UInput`, `UTextarea`, `USelect`, `UCheckbox`, `UAlert`, `UButton` |
| Props used on the form | `state`, `validate`, and the `submit` and `error` events |
| Props used on a field | `name`, `label`, `help`, `hint`, `required`, and the `error` slot while the field has an error |
| Composed demo | `apps/showcase/demos/forms/composed.vue` |

```vue
<UForm :state="state" :validate="validate" @submit="send" @error="focusFirstError">
  <UFormField name="email" label="Correo electrónico" required>
    <UInput v-model="state.email" type="email" autocomplete="email" />
  </UFormField>
  <UButton type="submit" label="Enviar mensaje" />
</UForm>
```

The composed demo is the whole pattern on neutral content: a message to an events team, with a failed submit, a success message, and focus moved to the first error.

## Open items

> **TBD (TBD-04):** The body text color is not decided. Labels read a placeholder, not a brand value. Owner input needed: a hex.
>
> **TBD (TBD-05):** The neutral scale is not defined. Help and hint text read a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-07):** The feedback colors are not defined. Error text and the summary alert read a placeholder, so today an error is told apart by its message and icon, not by color. Owner input needed: a hex set.
>
> **Draft:** The pattern's rules (one column, validate on leave and on submit, the summary alert, focus on the first error, never disable the submit) are approved (ADR-0031). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: the forms pattern and its composed demo (T9.1) — ADR-0031
