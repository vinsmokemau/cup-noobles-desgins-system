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
tbd: [TBD-04, TBD-05, TBD-07, TBD-10, TBD-11]
related: [toast, tooltip, card, form-field, button, accessibility, color]
since: 0.1.0
updated: 2026-10-10
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
| `alert.error.color` | `--cn-alert-error-color` | `#90a1b9` | tbd (TBD-07) |
| `alert.fg` | `--cn-alert-fg` | `#90a1b9` | tbd (TBD-04) |
| `alert.fgMuted` | `--cn-alert-fg-muted` | `#90a1b9` | tbd (TBD-05) |
| `alert.focus.color` | `--cn-alert-focus-color` | `#fff488` | stable |
| `alert.focus.offset` | `--cn-alert-focus-offset` | `3px` | stable |
| `alert.focus.style` | `--cn-alert-focus-style` | `solid` | stable |
| `alert.focus.width` | `--cn-alert-focus-width` | `3px` | stable |
| `alert.info.color` | `--cn-alert-info-color` | `#90a1b9` | tbd (TBD-07) |
| `alert.success.color` | `--cn-alert-success-color` | `#90a1b9` | tbd (TBD-07) |
| `alert.warning.color` | `--cn-alert-warning-color` | `#90a1b9` | tbd (TBD-07) |
| `border.width.alert` | `--cn-border-width-alert` | `1px` | tbd (TBD-11) |
| `radius.alert` | `--cn-radius-alert` | `0.375rem` | tbd (TBD-10) |

<!-- /cn:generated -->

The alert tokens reference semantic tokens only (REQ-010 AC2). The four feedback colors, the text colors, the radius, and the stroke width follow placeholders (TBD-04, TBD-05, TBD-07, TBD-10, TBD-11), so every one is `tbd` until the owner supplies the values. The fill and the focus ring are `stable`: black, and the yellow focus ring (ADR-0009).

Contrast pairs declared for the alert (REQ-015):

<!-- cn:generated tokens="alert" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `alert.fg` (`#90a1b9`) | `alert.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `alert.fg`, `color.text.default`, `placeholder.color.neutral`) |
| `alert.fgMuted` (`#90a1b9`) | `alert.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `alert.fgMuted`, `color.text.muted`, `placeholder.color.neutral`) |
| `alert.success.color` (`#90a1b9`) | `alert.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `alert.success.color`, `color.feedback.success`, `placeholder.color.neutral`) |
| `alert.info.color` (`#90a1b9`) | `alert.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `alert.info.color`, `color.feedback.info`, `placeholder.color.neutral`) |
| `alert.warning.color` (`#90a1b9`) | `alert.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `alert.warning.color`, `color.feedback.warning`, `placeholder.color.neutral`) |
| `alert.error.color` (`#90a1b9`) | `alert.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `alert.error.color`, `color.feedback.error`, `placeholder.color.neutral`) |
| `alert.focus.color` (`#fff488`) | `alert.bg` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

Today the four feedback colors are one neutral placeholder (TBD-07), so the types look alike. They are told apart by their icon and their title, never by color alone (WCAG 1.4.1). The look was chosen by the owner (ADR-0027).

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
- Text is 4.5:1 or more against the fill, and the outline is 3:1 or more against the page, where the colors are defined (REQ-015). Until then the pairs are reported as unverified.
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

> **TBD (TBD-04):** The body text color is not decided. The alert text reads a placeholder, not a brand value. Owner input needed: a hex.
>
> **TBD (TBD-05):** The neutral scale is not defined. The description text reads a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-07):** The feedback colors are not defined. The outline and icon of all four types read the same placeholder, so today the types are told apart by their icon and title. Owner input needed: a hex set.
>
> **TBD (TBD-10):** "Rounded" has no values. The corner radius follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-11):** "Thick" has no values. The stroke width follows the ADR-0006 placeholder. Owner input needed: values.
>
> **Draft:** The look of the alert (a black fill with a thick outline and an icon in the feedback color) is approved (ADR-0027). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UAlert` themed with the outline look, the four feedback types, the component tokens, and the demos (T8.3) — ADR-0027
