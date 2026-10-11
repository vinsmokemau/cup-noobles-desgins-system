---
title: Feedback
slug: feedback
layer: pattern
status: draft
lang: en
brandRules: [BR-06, BR-13]
demos: [composed]
tbd: []
related: [alert, toast, modal, form-field, forms, loading, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Feedback

## Purpose

Feedback is how the system tells people that something changed, worked, needs care, or failed. This pattern says which of four kinds to use, a toast, an inline alert, a banner, or a dialog, and what each one must do for the person. All four stay legible and high-contrast (BR-06) with the same thick outline (BR-13), and none of them depends on color alone.

## Usage rules

### When to use

Choose the kind by how long the message must stay and whether the person must answer:

| Kind | Part | Stays? | Needs an answer? | Use it for |
|---|---|---|---|---|
| Toast | [Toast](../02-components/molecules/toast.md) | No, it goes away by itself | No | The result of an action that just finished: "Cambios guardados". |
| Inline | [Alert](../02-components/molecules/alert.md) | Yes | No | A message about one block of content, placed next to it. |
| Banner | [Alert](../02-components/molecules/alert.md) at the top of the page | Yes, until it is closed | No | A message about the whole page or the whole service. |
| Dialog | [Modal](../02-components/organisms/modal.md) | Yes | Yes | A decision that must be made before going on. |

- Give every message a short title that says what happened, and add a description that says what to do next when the title alone does not.
- Give each type its own icon: info, success, warning, and error. The icon and the title carry the type, never the color alone (WCAG 1.4.1).
- Give every close button an accessible name from the page.
- Keep a toast that has an action, or that reports a failure, open until it is closed (`duration: 0`), so a timer never takes it away before the person can use it (WCAG 2.2.1).
- Say the cause and the next step in an error: what failed, and what the person can do.
- Show one message per event. Group several lines of one type in one description.
- Put an error about one field under that field, with [Form field](../02-components/molecules/form-field.md), and see [Forms](forms.md) for the summary.

### When not to use

- Never use a toast for the only record of something the person must act on. It goes away.
- Never use a dialog for a message that needs no answer. Use an alert or a toast.
- Never open a dialog from another dialog.
- Never stack several banners or several alerts of one type.
- Never rely on the feedback color alone to say how severe something is. The icon and the title say it too.
- Never write "Error", "Listo", or "Algo salió mal" as a title.
- Never use feedback to say that content is loading. Use [Loading](loading.md).

## Do and don't

| Do | Don't |
|---|---|
| Say what happened and what to do: "No pudimos guardar. Revisa tu conexión e inténtalo de nuevo." | Write "Error" or "Algo salió mal". |
| Keep a failed action's toast open until it is closed. | Let an error vanish after a few seconds. |
| Use a dialog only for a decision: "Borrar borrador" with "Borrar" and "Cancelar". | Use a dialog to say "Cambios guardados". |
| Place an inline alert next to the content it is about. | Put every message in a toast. |
| Label the close button: "Cerrar aviso". | Leave an icon-only close button without a name. |

## Accessibility

- A toast is announced by a live region without moving focus. An alert that the page adds after an action needs `role="alert"` (urgent) or `role="status"` (polite) to be announced; one that is in the page when it loads is not announced. See [Alert](../02-components/molecules/alert.md) and [Toast](../02-components/molecules/toast.md).
- A dialog moves focus into itself, traps it there, closes on Escape, returns focus to the control that opened it, and hides the page behind it from assistive technology. See [Modal](../02-components/organisms/modal.md).
- The type is told by the icon and the title, not by color (WCAG 1.4.1). The icon is decoration and is hidden from assistive technology.
- Close buttons are at least 24 × 24 px (REQ-028 AC2) and show the yellow focus ring on `:focus-visible` (REQ-024).
- A message that needs the person's attention does not disappear on a timer (WCAG 2.2.1).
- Text is 4.5:1 or more against its fill, and the outline is 3:1 or more against the page (REQ-015).

Keyboard map:

| Key | Result |
|---|---|
| Tab | Moves focus to the close button and the actions of an alert, or into a dialog. |
| F8 | Moves focus to the toast viewport. |
| Escape | Closes the focused toast, or the dialog. |
| Enter or Space on a button | Activates it, including a close button. |

ARIA: `role="alert"` or `role="status"` on an alert the page adds; a toast's live region and a dialog's `role="dialog"` come from Nuxt UI.

## Content

- Write the title as a short sentence that says what happened, and do not end a one-clause title with a period.
- Write the description as one or two sentences that say what to do next, and end each with a period.
- Write dialog actions as verbs: "Borrar" and "Cancelar", not "Sí" and "No".
- Do not use exclamation marks or capital letters for emphasis.

```copy es-MX
Cambios guardados
Tu perfil ya está actualizado.
No pudimos guardar
Revisa tu conexión e inténtalo de nuevo.
Mantenimiento el sábado
Borrar borrador
No podrás recuperarlo después.
```

```copy-bad es-MX
¡¡Listo!!
ERROR
Algo salió mal
¿Está seguro de que desea continuar con la operación solicitada?
```

## Responsive behavior

An alert or a banner fills the width of its container and wraps its text at 360, 768, and 1280 px (A-09). Below `sm` the toaster is the viewport width minus two rem, and from `sm` up it sits in the bottom-right corner. A dialog is the viewport width minus one rem on each side, up to a maximum width, and a tall body scrolls inside it. Nothing causes horizontal overflow (REQ-028 AC1).

## Code reference

| Item | Value |
|---|---|
| Nuxt UI components | `UAlert`, `UToaster` with `useToast()`, `UModal`, `UButton` |
| Toast | `useToast().add({ title, description, color, icon, close })` |
| Banner | `UAlert` with `role="status"` and `close`, at the top of the page region |
| Composed demo | `apps/showcase/demos/feedback/composed.vue` |

```vue
<UAlert
  role="status"
  color="info"
  variant="outline"
  icon="i-ph-info-bold"
  title="Mantenimiento el sábado"
  :close="{ 'aria-label': 'Cerrar aviso' }"
/>
```

The system has no separate banner component. A banner is an alert placed at the top of the page region, with `role="status"` and a close button. The composed demo shows all four kinds on neutral content: a profile page of a community app.

## Open items

> **Draft:** The choice among the four kinds, and the banner as an alert at the top of the page, are approved (ADR-0031). No value in it is open any more, so the doc stays a draft only until the owner approves it as stable.

## Changelog

- 0.1.0 — First draft: the feedback pattern, with toast, inline, banner, and dialog, and its composed demo (T9.1) — ADR-0031
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
