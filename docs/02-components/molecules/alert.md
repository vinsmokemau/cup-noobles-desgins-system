---
title: Alert
slug: alert
layer: component
level: molecule
source: nuxt-ui
nuxtUi: UAlert
status: draft
lang: en
brandRules: [BR-06, BR-13]
tokens: [alert, radius.alert, border.width.alert]
demos: [states, playground]
tbd: [TBD-10]
related: [toast, tooltip, card, form-field, button, accessibility, color]
since: 0.1.0
updated: 2026-10-11
---

# Alert

## Purpose

The alert is an inline message that stays on the page until the person closes it or the page removes it. It tells people something changed, worked, needs care, or failed. It is a themed Nuxt UI `UAlert`, styled only through tokens (C-03). It serves the high-contrast, legible UI of BR-06 and the thick line work of BR-13. For a brief message that goes away by itself, use [Toast](toast.md).

## Anatomy

1. **container**: the framed block, with the page's black fill and a thick outline in the feedback color.
2. **icon**: a glyph that names the type, drawn in the feedback color. It is decoration: the title carries the meaning.
3. **title**: the short statement of what happened.
4. **description**: an optional sentence that explains it or says what to do.
5. **actions**: optional buttons under the description.
6. **close**: an optional icon button that dismisses the alert.

## Tokens and specs

<!-- cn:generated tokens="alert radius.alert border.width.alert" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `alert.bg` | `--cn-alert-bg` | `#000000` | stable |
| `alert.error.color` | `--cn-alert-error-color` | `#ff5c5c` | stable |
| `alert.fg` | `--cn-alert-fg` | `#f5f5f5` | stable |
| `alert.fgMuted` | `--cn-alert-fg-muted` | `#bdbdbd` | stable |
| `alert.focus.color` | `--cn-alert-focus-color` | `#fff488` | stable |
| `alert.focus.offset` | `--cn-alert-focus-offset` | `3px` | stable |
| `alert.focus.style` | `--cn-alert-focus-style` | `solid` | stable |
| `alert.focus.width` | `--cn-alert-focus-width` | `3px` | stable |
| `alert.info.color` | `--cn-alert-info-color` | `#5cc8ff` | stable |
| `alert.success.color` | `--cn-alert-success-color` | `#34d399` | stable |
| `alert.warning.color` | `--cn-alert-warning-color` | `#ff9f43` | stable |
| `border.width.alert` | `--cn-border-width-alert` | `3px` | stable |
| `radius.alert` | `--cn-radius-alert` | `0.375rem` | tbd (TBD-10) |

<!-- /cn:generated -->

The alert tokens reference semantic tokens only (REQ-010 AC2). The radius follows a placeholder (TBD-10), so it is `tbd` until the owner supplies it. The four feedback colors, the text colors, and the stroke width are `stable` (ADR-0032). The fill and the focus ring are `stable` too: black, and the yellow focus ring (ADR-0009).

Contrast pairs declared for the alert (REQ-015):

<!-- cn:generated tokens="alert" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `alert.fg` (`#f5f5f5`) | `alert.bg` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `alert.fgMuted` (`#bdbdbd`) | `alert.bg` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `alert.success.color` (`#34d399`) | `alert.bg` (`#000000`) | ui | 10.92:1 | 3.00:1 | pass |
| `alert.info.color` (`#5cc8ff`) | `alert.bg` (`#000000`) | ui | 11.16:1 | 3.00:1 | pass |
| `alert.warning.color` (`#ff9f43`) | `alert.bg` (`#000000`) | ui | 10.29:1 | 3.00:1 | pass |
| `alert.error.color` (`#ff5c5c`) | `alert.bg` (`#000000`) | ui | 6.94:1 | 3.00:1 | pass |
| `alert.focus.color` (`#fff488`) | `alert.bg` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

Each type has its own feedback color (ADR-0032), and the types are also told apart by their icon and their title, never by color alone (WCAG 1.4.1). The look was chosen by the owner (ADR-0027).

## Variants

The alert has one look. Its type is the Nuxt UI `color` prop, and the icon follows the type:

| Type | Nuxt UI props | Icon | Use for |
|---|---|---|---|
| `info` (default) | `color="info"` | `i-ph-info-bold` | Something the person should know. |
| `success` | `color="success"` | `i-ph-check-circle-bold` | An action worked. |
| `warning` | `color="warning"` | `i-ph-warning-bold` | Something needs care before it becomes a problem. |
| `error` | `color="error"` | `i-ph-x-circle-bold` | An action failed, or something blocks the person. |

Nuxt UI's `variant` prop (`solid`, `outline`, `soft`, `subtle`) has no effect on the look: the theme replaces the fill and the ring that each variant draws. Pass `variant="outline"` so the markup says what the page shows. Do not use the `primary`, `secondary`, or `neutral` colors for feedback.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The informational type: black fill, outline and icon in the info color. | `alert.bg`, `alert.info.color`, `border.width.alert`, `radius.alert` |
| `success` | The outline and the icon take the success color. | `alert.success.color` |
| `warning` | The outline and the icon take the warning color. | `alert.warning.color` |
| `error` | The outline and the icon take the error color. | `alert.error.color` |
| `focus-visible` | The close button shows the yellow focus ring. | `alert.focus.*` |

An alert is not a control, so it has no hover, active, or disabled state. Its close button keeps its text color on hover. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use an alert for a message that belongs to the content around it and should stay visible, such as a form-level error or a notice at the top of a page.
- Always give the alert a `title`. Add a `description` when the title alone does not say what to do.
- Always give the alert an `icon` that matches its type.
- Pass `close` only when the person can do something about the message, or when it should not block the page for long.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never use an alert for a message that should disappear by itself. Use [Toast](toast.md).
- Never show an error for one field in an alert. Use the error of [Form field](form-field.md).
- Never stack more than one alert of the same type. Group the lines in one description.
- Never rely on the outline color alone to say the type.
- Never write a color, radius, or width literally on an alert. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Say what happened and what to do: "No pudimos guardar. Revisa tu conexión e inténtalo de nuevo." | Write "Error" or "Algo salió mal". |
| Give each type its own icon. | Use the same icon for every type. |
| Keep the title to a short sentence. | Put a paragraph in the title. |
| Label the close button: "Cerrar aviso". | Leave the close button without a name. |

## Accessibility

- The alert is a static region of the page. It is not announced when it is rendered with the page. When the page adds one after an action, set `role="alert"` (assertive) or `role="status"` (polite) on it, or use [Toast](toast.md), which is a live region.
- The icon is decoration and is hidden from assistive technology. The type is carried by the title and the description.
- The close button needs an accessible name. Nuxt UI supplies one from its locale, and the demos pass an es-MX label.
- The close button is at least 24 × 24 px (REQ-028 AC2) and shows the yellow focus ring on `:focus-visible` (REQ-024), 18.55:1 against the black fill.
- Text is 4.5:1 or more against the fill, and the outline is 3:1 or more against the page (REQ-015).
- Nothing in the alert moves, so there is no animation to stop (REQ-029 AC2).

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the close button, then to the actions, and shows the focus ring. |
| Shift + Tab | Moves focus to the previous control. |
| Enter or Space on the close button | Closes the alert. |

ARIA: `UAlert` adds no `role`. The close button is a `<button>` with an `aria-label`.

## Content

- Write the title as a short sentence that says what happened, ending without a period when it is one clause.
- Write the description as one or two sentences that say what to do next. End each with a period.
- Do not use exclamation marks or capital letters for emphasis.

```copy es-MX
Cambios guardados
Tu perfil ya está actualizado.
No pudimos guardar
Revisa tu conexión e inténtalo de nuevo.
```

```copy-bad es-MX
¡ERROR!
Algo salió mal
```

## Responsive behavior

The alert fills the width of its container and wraps its text at 360, 768, and 1280 px (A-09). Long titles and descriptions break inside it and never cause horizontal overflow (REQ-028 AC1). Actions wrap below the text in the `vertical` orientation, which is the default; do not use `horizontal` at 360 px.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UAlert` |
| Props used | `color`, `variant`, `icon`, `title`, `description`, `close`, `actions` |
| Slots used | none |
| Theme | `ui.alert` in `packages/nuxt/app.config.ts` and the `.cn-alert*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `alert.*`, `radius.alert`, `border.width.alert` |
| Demos | `apps/showcase/demos/alert/` |

```vue
<UAlert
  color="error"
  variant="outline"
  icon="i-ph-x-circle-bold"
  title="No pudimos guardar"
  description="Revisa tu conexión e inténtalo de nuevo."
  :close="{ 'aria-label': 'Cerrar aviso' }"
/>
```

## Open items

> **TBD (TBD-10):** "Rounded" has no values. The corner radius follows the ADR-0006 placeholder. Owner input needed: values.
>
> **Draft:** The look of the alert (a black fill with a thick outline and an icon in the feedback color) is approved (ADR-0027). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UAlert` themed with the outline look, the four feedback types, the component tokens, and the demos (T8.3) — ADR-0027
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
