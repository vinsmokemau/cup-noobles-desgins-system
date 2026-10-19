---
title: Toast
slug: toast
layer: component
level: molecule
source: nuxt-ui
nuxtUi: UToast
status: stable
lang: en
brandRules: [BR-06, BR-13]
tokens: [toast, radius.toast, border.width.toast]
demos: [states, playground]
tbd: []
related: [alert, tooltip, button, accessibility, motion, color]
since: 0.1.0
updated: 2026-10-19
---

# Toast

## Purpose

The toast is a brief message that appears over the page after an action and goes away by itself, such as "Cambios guardados". It is a themed Nuxt UI `UToast`, shown by Nuxt UI's toaster and opened with `useToast().add()`. It is announced by a live region, so a screen reader reads it without moving focus. It serves the high-contrast, legible UI of BR-06 and the thick line work of BR-13. For a message that stays in the page, use [Alert](alert.md).

## Anatomy

1. **container**: the framed block, with the page's black fill and a thick outline in the feedback color.
2. **icon**: a glyph that names the type, drawn in the feedback color. It is decoration: the title carries the meaning.
3. **title**: the short statement of what happened.
4. **description**: an optional sentence that explains it.
5. **actions**: optional buttons under the description.
6. **close**: an icon button that dismisses the toast.
7. **viewport**: the corner of the page where the toaster stacks toasts. It is a landmark region.

## Tokens and specs

<!-- cn:generated tokens="toast radius.toast border.width.toast" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.toast` | `--cn-border-width-toast` | `3px` | stable |
| `radius.toast` | `--cn-radius-toast` | `0.75rem` | stable |
| `toast.bg` | `--cn-toast-bg` | `#000000` | stable |
| `toast.error.color` | `--cn-toast-error-color` | `#ff5c5c` | stable |
| `toast.fg` | `--cn-toast-fg` | `#f5f5f5` | stable |
| `toast.fgMuted` | `--cn-toast-fg-muted` | `#bdbdbd` | stable |
| `toast.focus.color` | `--cn-toast-focus-color` | `#fff488` | stable |
| `toast.focus.offset` | `--cn-toast-focus-offset` | `3px` | stable |
| `toast.focus.style` | `--cn-toast-focus-style` | `solid` | stable |
| `toast.focus.width` | `--cn-toast-focus-width` | `3px` | stable |
| `toast.info.color` | `--cn-toast-info-color` | `#5cc8ff` | stable |
| `toast.success.color` | `--cn-toast-success-color` | `#34d399` | stable |
| `toast.warning.color` | `--cn-toast-warning-color` | `#ff9f43` | stable |

<!-- /cn:generated -->

The toast tokens mirror the alert's, because the two share one look (ADR-0027). They reference semantic tokens only (REQ-010 AC2). The radius is `stable`: the toast uses the medium radius step, the same as the alert (ADR-0050; the step is assigned by T13.3). The four feedback colors, the text colors, and the stroke width are `stable` (ADR-0032). The fill and the focus ring are `stable`.

Contrast pairs declared for the toast (REQ-015):

<!-- cn:generated tokens="toast" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `toast.fg` (`#f5f5f5`) | `toast.bg` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `toast.fgMuted` (`#bdbdbd`) | `toast.bg` (`#000000`) | text | 11.18:1 | 4.50:1 | pass |
| `toast.success.color` (`#34d399`) | `toast.bg` (`#000000`) | ui | 10.92:1 | 3.00:1 | pass |
| `toast.info.color` (`#5cc8ff`) | `toast.bg` (`#000000`) | ui | 11.16:1 | 3.00:1 | pass |
| `toast.warning.color` (`#ff9f43`) | `toast.bg` (`#000000`) | ui | 10.29:1 | 3.00:1 | pass |
| `toast.error.color` (`#ff5c5c`) | `toast.bg` (`#000000`) | ui | 6.94:1 | 3.00:1 | pass |
| `toast.focus.color` (`#fff488`) | `toast.bg` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

Each type has its own feedback color (ADR-0032), and the types are also told apart by their icon and their title, never by color alone (WCAG 1.4.1). The toast has no glow and no shadow (ADR-0027).

## Variants

The toast has one look. Its type is the Nuxt UI `color` prop, as in the [Alert](alert.md):

| Type | Nuxt UI props | Icon |
|---|---|---|
| `info` (default) | `color: 'info'` | `i-ph-info-bold` |
| `success` | `color: 'success'` | `i-ph-check-circle-bold` |
| `warning` | `color: 'warning'` | `i-ph-warning-bold` |
| `error` | `color: 'error'` | `i-ph-x-circle-bold` |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The informational type: black fill, outline and icon in the info color. | `toast.bg`, `toast.info.color`, `border.width.toast`, `radius.toast` |
| `success` | The outline and the icon take the success color. | `toast.success.color` |
| `warning` | The outline and the icon take the warning color. | `toast.warning.color` |
| `error` | The outline and the icon take the error color. | `toast.error.color` |
| `focus-visible` | The toast, or its close button, shows the yellow focus ring. | `toast.focus.*` |

A toast is not a control, so it has no hover, active, or disabled state. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a toast to confirm an action that finished, or to report a result that does not need a decision.
- Open it with `useToast().add({ title, description, color, icon })`. Keep the title to a short sentence.
- Give a toast with an action `duration: 0`, so it stays until it is closed (WCAG 2.2.1). A timer can take the toast away before the person reaches the action.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never use a toast for the only record of something the person must act on. Use [Alert](alert.md), which stays.
- Never put information in a toast that is not available anywhere else, because it goes away.
- Never open several toasts for one action.
- Never open a toast while a [Modal](../organisms/modal.md) or [Slideover](../organisms/slideover.md) is open. The toast sits above the overlay in the bottom-right corner and can cover the actions of the dialog (ADR-0054, ADR-0060).
- Never rely on the outline color alone to say the type.
- Never write a color, radius, or width literally on a toast. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Say what happened: "Cambios guardados". | Write "Éxito" or "Listo". |
| Keep a failed action's toast open until it is closed. | Let an error vanish after five seconds. |
| Give each type its own icon. | Use the same icon for every type. |
| Open one toast per action. | Open a toast for every field that changed. |

## Accessibility

- The toast is announced by a live region (Reka UI's toast announcer): it is read by a screen reader without moving focus. The viewport is a region labelled "Notifications".
- The icon is decoration and is hidden from assistive technology. The type is carried by the title and the description.
- The close button has an accessible name. Nuxt UI supplies one from its locale, and the demos pass an es-MX label.
- The close button is at least 24 × 24 px (REQ-028 AC2). The toast and the close button show the yellow focus ring on `:focus-visible` (REQ-024), 18.55:1 against the black fill.
- Pressing F8 moves focus to the viewport, and Tab moves from the page to the toasts in order. Pressing Escape on a toast closes it.
- Reka UI's two focus-proxy spans, which are `aria-hidden` and focusable, fail axe's aria-hidden-focus rule, so the theme hides them. Each toast is focusable by itself and the viewport is at the end of the page, so Tab order is unchanged.
- The countdown bar that Nuxt UI draws is hidden: it moves by itself and says nothing a screen reader can use.
- Under `prefers-reduced-motion: reduce` the slide-in and slide-out animations are removed (REQ-029 AC2).
- Text is 4.5:1 or more against the fill, and the outline is 3:1 or more against the page (REQ-015).

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| F8 | Moves focus to the toast viewport. |
| Tab | Moves focus from the page to the toast, then to its action and its close button. |
| Escape | Closes the focused toast. |
| Enter or Space on the close button | Closes the toast. |

ARIA: Reka UI renders the announcement as a visually hidden element with `role="alert"` and `aria-live` (`assertive` for a foreground toast, `polite` for a background one), and the viewport as a `region` labelled "Notifications (F8)". The close button is a `<button>` with an `aria-label`.

## Content

- Write the title as a short sentence that says what happened.
- Write the description, when there is one, as a single sentence that ends with a period.
- Name the action with a verb: "Deshacer".

```copy es-MX
Cambios guardados
Tu perfil ya está actualizado.
Deshacer
```

```copy-bad es-MX
¡¡Listo!!
Haz clic aquí para cerrar
```

## Responsive behavior

The toaster is `calc(100% - 2rem)` wide below `sm`, and fixed in the bottom-right corner above it (Nuxt UI default). Its stacking order is `z.toast`, 100, above every overlay, which sit at 50 (ADR-0054). At 360 px a toast wraps its text inside the viewport and never causes horizontal overflow (REQ-028 AC1). Toasts stack and collapse behind the front one.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UToast`, shown by `UToaster` (included in `UApp`) |
| Opened with | `useToast().add({ title, description, color, icon, close, actions, duration })` |
| Theme | `ui.toast` and `ui.toaster` in `packages/nuxt/app.config.ts` and the `.cn-toast*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `toast.*`, `radius.toast`, `border.width.toast` |
| Demos | `apps/showcase/demos/toast/` |

```ts
const toast = useToast()
toast.add({
  color: 'success',
  icon: 'i-ph-check-circle-bold',
  title: 'Cambios guardados',
  description: 'Tu perfil ya está actualizado.',
  close: { 'aria-label': 'Cerrar aviso' },
})
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: `UToast` themed with the outline look, the four feedback types, the component tokens, and the demos (T8.3) — ADR-0027
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
- 0.1.0 — Approved as stable by the owner, with every point of the draft callouts decided. No value or rule changes — ADR-0060
