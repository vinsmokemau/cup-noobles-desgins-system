---
title: Loading
slug: loading
layer: pattern
status: draft
lang: en
brandRules: [BR-06, BR-13]
demos: [composed]
tbd: [TBD-05, TBD-11, TBD-14]
related: [skeleton, progress, button, feedback, accessibility, motion]
since: 0.1.0
updated: 2026-10-11
---

# Loading

## Purpose

Loading is what people see while they wait. This pattern says which part to use for which wait: a skeleton while content loads, the spinner of a button while an action runs, and a progress bar while a task with a known amount advances. Each one tells people that the page is working, keeps the layout from jumping, and stays legible and high-contrast (BR-06).

## Usage rules

### When to use

Choose the part by what is being waited for:

| Wait | Part | Use it when |
|---|---|---|
| Content is loading | [Skeleton](../02-components/atoms/skeleton.md) | The layout of the content is known, such as a card or a list. |
| An action is running | The `loading` state of a [Button](../02-components/atoms/button.md) | The person pressed a button and the result is on its way. |
| A task advances | [Progress](../02-components/atoms/progress.md) | The amount done is known, such as an upload. Use the indeterminate bar when it is not. |

- Match each skeleton shape to the content it replaces, so the page does not jump when the content arrives.
- Name a group of skeleton shapes once, with a label from the page: "Cargando perfil".
- Keep the label of a loading button, and let the spinner show the wait. Set `aria-busy="true"` with it.
- Give every progress bar a visible label and the same text as its accessible name.
- Replace the placeholder with the content as soon as it is ready, or with an error message when it failed (see [Feedback](feedback.md)).
- The system has no standalone spinner. The button's loading state is the spinner.

### When not to use

- Never leave a skeleton, a spinner, or an indeterminate bar on screen with no end. After a failure, show an error that says what to do.
- Never use a skeleton for a task whose progress is known. Use a progress bar.
- Never use a skeleton as decoration or as an empty state. See [Empty states](empty-states.md).
- Never replace a button's label with "Cargando...". Keep the label and show the spinner.
- Never fake a progress value that does not follow the work.
- Never block the whole page for a wait that only concerns one block.

## Do and don't

| Do | Don't |
|---|---|
| Show shapes that match the content: a circle and two lines for a profile. | Show a generic gray block for everything. |
| Name the group once: "Cargando perfil". | Let every shape announce its own label. |
| Keep the button's label while it loads: "Guardar cambios". | Swap the label for "Cargando...". |
| Name the task: "Subiendo portada". | Show a bar with no name. |
| Use the indeterminate bar when the amount is unknown. | Show 90% and stay there. |

## Accessibility

- A group of skeleton shapes is one `role="status"` element with `aria-busy="true"` and one es-MX `aria-label`, and each shape is `aria-hidden="true"`, so the wait is announced once. See [Skeleton](../02-components/atoms/skeleton.md).
- A loading button is natively disabled while it runs, and `aria-busy="true"` announces the state. The spinner is hidden from assistive technology. See [Button](../02-components/atoms/button.md).
- A progress bar is a `role="progressbar"`. An indeterminate bar has no `aria-valuenow`, which tells assistive technology that the amount is unknown. See [Progress](../02-components/atoms/progress.md).
- None of these is focusable, except the button, which is skipped by Tab while it loads.
- Under `prefers-reduced-motion: reduce` the skeleton does not fade, the spinner stops, and the indeterminate bar stops moving (REQ-029 AC2). Nothing flashes (WCAG 2.3.1).
- Text is 4.5:1 or more against the page where the colors are defined (REQ-015).

Keyboard map: not applicable, because the loading parts are not interactive. The only control, the loading button, is skipped by Tab while it runs.

ARIA: `role="status"`, `aria-busy`, and `aria-label` on a skeleton group; `aria-busy` on a loading button; `role="progressbar"` with `aria-label` on a bar.

## Content

- Write the label of a skeleton group as what is loading, in a few words, in sentence case: "Cargando perfil".
- Write the label of a progress bar as the task: "Subiendo portada". When it finishes, say so: "Portada subida".
- Keep the button's own label while it loads.

```copy es-MX
Cargando perfil
Cargando imagen
Subiendo portada
Procesando imagen
Guardar cambios
```

```copy-bad es-MX
Cargando...
Por favor espera
Espera un momento por favor...
```

## Responsive behavior

Skeleton shapes and progress bars fill the width of their container, so the layout is the same at 360, 768, and 1280 px (A-09). A skeleton layout that places shapes side by side must wrap them to one column at 360 px (ER-05). A loading button keeps its size. Nothing causes horizontal overflow (REQ-028 AC1).

## Code reference

| Item | Value |
|---|---|
| Nuxt UI components | `USkeleton`, `UButton` (`loading`), `UProgress` |
| Skeleton group | an element with `role="status"`, `aria-busy="true"`, and `aria-label`, and `aria-hidden="true"` on each `USkeleton` |
| Composed demo | `apps/showcase/demos/loading/composed.vue` |

```vue
<div role="status" aria-busy="true" aria-label="Cargando perfil">
  <USkeleton as="span" aria-hidden="true" class="block h-4 w-full" />
</div>
<UButton label="Guardar cambios" :loading="saving" :aria-busy="saving ? 'true' : undefined" />
<UProgress :model-value="62" :get-value-label="() => 'Subiendo portada'" />
```

The composed demo shows all three on neutral content: a profile page of a community app, with the skeleton beside the finished content.

## Open items

> **TBD (TBD-05):** The neutral scale is not defined. The skeleton and progress outlines read a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-11):** "Thick" has no values. The skeleton and progress stroke widths follow the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-14):** Motion durations and easing are not defined. The skeleton's fade and the indeterminate bar follow the ADR-0006 placeholder. Owner input needed: values.
>
> **Draft:** The choice of part by wait, and the rule that the button's spinner is the system's spinner, are composed from the component docs. The brand context does not describe them, and the owner has not approved them. The doc stays a draft until the owner does and the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: the loading pattern, with skeleton, spinner, and progress, and its composed demo (T9.1) — awaiting owner approval
