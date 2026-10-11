---
title: Toast
slug: toast
layer: component
level: molecule
source: nuxt-ui
nuxtUi: UToast
status: draft
lang: en
brandRules: [BR-06, BR-13]
tokens: [toast, radius.toast, border.width.toast]
demos: [states, playground]
tbd: [TBD-04, TBD-05, TBD-07, TBD-10, TBD-11, TBD-14, TBD-15]
related: [alert, tooltip, button, accessibility, motion, color]
since: 0.1.0
updated: 2026-10-10
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
| `border.width.toast` | `--cn-border-width-toast` | `1px` | tbd (TBD-11) |
| `radius.toast` | `--cn-radius-toast` | `0.375rem` | tbd (TBD-10) |
| `toast.bg` | `--cn-toast-bg` | `#000000` | stable |
| `toast.error.color` | `--cn-toast-error-color` | `#90a1b9` | tbd (TBD-07) |
| `toast.fg` | `--cn-toast-fg` | `#90a1b9` | tbd (TBD-04) |
| `toast.fgMuted` | `--cn-toast-fg-muted` | `#90a1b9` | tbd (TBD-05) |
| `toast.focus.color` | `--cn-toast-focus-color` | `#fff488` | stable |
| `toast.focus.offset` | `--cn-toast-focus-offset` | `3px` | stable |
| `toast.focus.style` | `--cn-toast-focus-style` | `solid` | stable |
| `toast.focus.width` | `--cn-toast-focus-width` | `3px` | stable |
| `toast.info.color` | `--cn-toast-info-color` | `#90a1b9` | tbd (TBD-07) |
| `toast.success.color` | `--cn-toast-success-color` | `#90a1b9` | tbd (TBD-07) |
| `toast.warning.color` | `--cn-toast-warning-color` | `#90a1b9` | tbd (TBD-07) |

<!-- /cn:generated -->

The toast tokens mirror the alert's, because the two share one look (ADR-0027). They reference semantic tokens only (REQ-010 AC2). The four feedback colors, the text colors, the radius, and the stroke width follow placeholders, so every one is `tbd` until the owner supplies the values. The fill and the focus ring are `stable`.

Contrast pairs declared for the toast (REQ-015):

<!-- cn:generated tokens="toast" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `toast.fg` (`#90a1b9`) | `toast.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.default`, `placeholder.color.neutral`, `toast.fg`) |
| `toast.fgMuted` (`#90a1b9`) | `toast.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.muted`, `placeholder.color.neutral`, `toast.fgMuted`) |
| `toast.success.color` (`#90a1b9`) | `toast.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.feedback.success`, `placeholder.color.neutral`, `toast.success.color`) |
| `toast.info.color` (`#90a1b9`) | `toast.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.feedback.info`, `placeholder.color.neutral`, `toast.info.color`) |
| `toast.warning.color` (`#90a1b9`) | `toast.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.feedback.warning`, `placeholder.color.neutral`, `toast.warning.color`) |
| `toast.error.color` (`#90a1b9`) | `toast.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.feedback.error`, `placeholder.color.neutral`, `toast.error.color`) |
| `toast.focus.color` (`#fff488`) | `toast.bg` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

Today the four feedback colors are one neutral placeholder (TBD-07), so the types are told apart by their icon and their title, never by color alone (WCAG 1.4.1). The toast has no glow and no shadow (ADR-0027).

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
- Text is 4.5:1 or more against the fill, and the outline is 3:1 or more against the page, where the colors are defined (REQ-015). Until then the pairs are reported as unverified.

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

The toaster is `calc(100% - 2rem)` wide below `sm`, and fixed in the bottom-right corner above it (Nuxt UI default, TBD-15). At 360 px a toast wraps its text inside the viewport and never causes horizontal overflow (REQ-028 AC1). Toasts stack and collapse behind the front one.

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

> **TBD (TBD-04):** The body text color is not decided. The toast text reads a placeholder, not a brand value. Owner input needed: a hex.
>
> **TBD (TBD-05):** The neutral scale is not defined. The description text reads a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-07):** The feedback colors are not defined. The outline and icon of all four types read the same placeholder, so today the types are told apart by their icon and title. Owner input needed: a hex set.
>
> **TBD (TBD-10):** "Rounded" has no values. The corner radius follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-11):** "Thick" has no values. The stroke width follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-14):** Motion durations and easing are not defined. The toast's slide animation and its five-second default duration are Nuxt UI defaults, not brand values. Owner input needed: values.
>
> **TBD (TBD-15):** The elevation and z-index scale are not defined. The toaster keeps Nuxt UI's `z-index` and its bottom-right position. Owner input needed: values.
>
> **Draft:** The look of the toast (a black fill with a thick outline and an icon in the feedback color) is approved (ADR-0027). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UToast` themed with the outline look, the four feedback types, the component tokens, and the demos (T8.3) — ADR-0027
