---
title: Button
slug: button
layer: component
level: atom
source: nuxt-ui
nuxtUi: UButton
status: draft
lang: en
brandRules: [BR-01, BR-02, BR-10, BR-11, BR-13]
tokens: [button, radius.button, border.width.button, effect.glow.button]
demos: [states, playground]
tbd: [TBD-08, TBD-10, TBD-11, TBD-12]
related: [link, icon, form-field, effects, shape]
since: 0.1.0
updated: 2026-10-09
---

# Button

## Purpose

The button triggers an action. It implements BR-10 (rounded corners, a subtle neon glow, and a thick outline stroke) and BR-11 (the primary, secondary, ghost, and disabled states) on top of Nuxt UI's `UButton`, themed only through tokens (C-03). The corner radius (TBD-10), the stroke width (TBD-11), and the glow (TBD-12) are not defined yet, so those tokens hold ADR-0006 placeholders that are not brand values.

## Anatomy

1. **container**: the filled or transparent shape, with rounded corners.
2. **outline**: the thick stroke around the container (BR-10, BR-13).
3. **label**: the text that names the action. It arrives through the `label` prop or the default slot (A-11).
4. **leading icon**: an optional icon before the label. It also holds the spinner while the button loads.
5. **trailing icon**: an optional icon after the label.
6. **glow**: the neon shadow around the container (BR-10). A disabled button has none.
7. **focus ring**: the yellow outline drawn outside the container on keyboard focus (REQ-024, ADR-0009).

## Tokens and specs

<!-- cn:generated tokens="button radius.button border.width.button effect.glow.button" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.button` | `--cn-border-width-button` | `1px` | tbd (TBD-11) |
| `button.focus.color` | `--cn-button-focus-color` | `#fff488` | stable |
| `button.focus.offset` | `--cn-button-focus-offset` | `3px` | stable |
| `button.focus.style` | `--cn-button-focus-style` | `solid` | stable |
| `button.focus.width` | `--cn-button-focus-width` | `3px` | stable |
| `button.ghost.bgActive` | `--cn-button-ghost-bg-active` | `#ef80ae` | derived-pending (TBD-08) |
| `button.ghost.bgHover` | `--cn-button-ghost-bg-hover` | `#ef80ae` | derived-pending (TBD-08) |
| `button.ghost.border` | `--cn-button-ghost-border` | `#ef80ae` | stable |
| `button.ghost.fg` | `--cn-button-ghost-fg` | `#ef80ae` | stable |
| `button.ghost.fgHover` | `--cn-button-ghost-fg-hover` | `#000000` | stable |
| `button.primary.bg` | `--cn-button-primary-bg` | `#ef80ae` | stable |
| `button.primary.bgActive` | `--cn-button-primary-bg-active` | `#ef80ae` | derived-pending (TBD-08) |
| `button.primary.bgHover` | `--cn-button-primary-bg-hover` | `#ef80ae` | derived-pending (TBD-08) |
| `button.primary.border` | `--cn-button-primary-border` | `#ef80ae` | stable |
| `button.primary.fg` | `--cn-button-primary-fg` | `#000000` | stable |
| `button.secondary.bg` | `--cn-button-secondary-bg` | `#fff488` | stable |
| `button.secondary.bgActive` | `--cn-button-secondary-bg-active` | `#fff488` | derived-pending (TBD-08) |
| `button.secondary.bgHover` | `--cn-button-secondary-bg-hover` | `#fff488` | derived-pending (TBD-08) |
| `button.secondary.border` | `--cn-button-secondary-border` | `#fff488` | stable |
| `button.secondary.fg` | `--cn-button-secondary-fg` | `#000000` | stable |
| `effect.glow.button` | `--cn-effect-glow-button` | `none` | tbd (TBD-12) |
| `radius.button` | `--cn-radius-button` | `0.375rem` | tbd (TBD-10) |

<!-- /cn:generated -->

The component tokens only reference semantic tokens (REQ-010 AC2). The shape and glow tokens are `tbd`: they follow the ADR-0006 placeholders (Nuxt UI's default radius, outline width, and no glow), and **none of them is a brand value**. The hover and pressed fills are `derived-pending`: each reads a shade token that repeats the single brand color, so a hovered or pressed button does not change color yet (C-06, TBD-08). The label, outline, and focus tokens are `stable`.

Contrast pairs declared for the button (REQ-015, REQ-023 AC3):

<!-- cn:generated tokens="button" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `button.primary.fg` (`#000000`) | `button.primary.bg` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `button.primary.fg` (`#000000`) | `button.primary.bgHover` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `button.primary.fg` (`#000000`) | `button.primary.bgActive` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `button.primary.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `button.secondary.fg` (`#000000`) | `button.secondary.bg` (`#fff488`) | text | 18.55:1 | 4.50:1 | pass |
| `button.secondary.fg` (`#000000`) | `button.secondary.bgHover` (`#fff488`) | text | 18.55:1 | 4.50:1 | pass |
| `button.secondary.fg` (`#000000`) | `button.secondary.bgActive` (`#fff488`) | text | 18.55:1 | 4.50:1 | pass |
| `button.secondary.border` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `button.ghost.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `button.ghost.fgHover` (`#000000`) | `button.ghost.bgHover` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `button.ghost.fgHover` (`#000000`) | `button.ghost.bgActive` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `button.ghost.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `button.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-10:** Buttons have rounded corners, a subtle neon glow, and a thick outline stroke.
>
> **BR-11:** Button states are primary, secondary, ghost, and disabled.

The labels on pink and yellow fills are black, because white on pink is 2.51:1, yellow on pink is 2.22:1, and white on yellow is 1.13:1 (SPEC.md §2.1). The focus ring is brand yellow (BR-02) and sits 3 px away from the container, so it only touches the page behind the button (ADR-0009).

## Variants

The button exposes three brand variants (BR-11) and two states, `disabled` and `loading`. Each maps to Nuxt UI props like this:

| Brand variant | Nuxt UI props | Fill | Label | Outline |
|---|---|---|---|---|
| `primary` | `color="primary" variant="solid"` | Brand pink (BR-01) | Black | Pink |
| `secondary` | `color="secondary" variant="solid"` | Brand yellow (BR-02) | Black | Yellow |
| `ghost` | `color="primary" variant="ghost"` | None; the page shows through | Pink | Pink |
| `disabled` state | the `disabled` prop | Keeps the variant | Keeps the variant | Keeps the variant |
| `loading` state | the `loading` prop | Keeps the variant | Keeps the variant | Keeps the variant |

Any other Nuxt UI `color` or `variant` falls back to Nuxt UI's defaults and is not part of the system. Sizes `xs`, `sm`, `md` (default), `lg`, and `xl` are Nuxt UI's.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The variant's fill, label, outline, and glow. | `button.<variant>.bg`, `button.<variant>.fg`, `button.<variant>.border`, `radius.button`, `border.width.button`, `effect.glow.button` |
| `hover` | The fill. A ghost button also fills and turns its label black. | `button.<variant>.bgHover`, `button.ghost.fgHover` |
| `focus-visible` | A yellow ring outside the container, on top of the glow. | `button.focus.color`, `button.focus.width`, `button.focus.offset`, `button.focus.style` |
| `active` | The fill while pressed. | `button.<variant>.bgActive` |
| `disabled` | The glow is removed. The button is natively disabled, so it is skipped by Tab and ignores clicks. Nuxt UI dims it. | none |
| `loading` | A spinner replaces the leading icon, and the button is disabled while it spins. It keeps its glow. | none |

The state matrix on the component page shows every row in the three variants, and each state has a visual baseline.

## Usage rules

### When to use

- Use `primary` for the single main action of a view.
- Use `secondary` for an alternative action of the same weight, such as going back.
- Use `ghost` for a quiet action next to a primary one, such as cancel.
- Use `loading` while the action runs, and set `aria-busy="true"` with it.
- Give an icon-only button an accessible name through `aria-label`.
- Pass the label through the `label` prop or the slot. The component never holds copy (A-11).

### When not to use

- Never put two `primary` buttons side by side.
- Never use a button to move to another page. Use [Link](link.md) for navigation.
- Never put white or yellow text on a pink fill, or white text on a yellow fill (SPEC.md §2.1).
- Never give a disabled button a glow (REQ-023 AC5).
- Never write a radius, width, or glow literally in a button. Read the tokens (REQ-016).
- Never remove the focus ring or replace it with the glow (REQ-024).

## Do and don't

| Do | Don't |
|---|---|
| One primary action, with a ghost button for the way out (`one-primary.example.vue`). | Two primary buttons side by side (`two-primary.example.vue`). |
| Name the action: "Guardar cambios". | Use a vague label: "Aceptar". |
| Keep a loading button visible, with the same label. | Swap the label for "Cargando...". |
| Leave the focus ring on. | Hide the outline because it "clashes" with the glow. |

## Accessibility

- The button is a native `<button>`, or an `<a>` when it has a `to`. It is named by its label, or by `aria-label` when it holds only an icon.
- A disabled button carries the native `disabled` attribute (or `aria-disabled="true"` on a link), so assistive technology announces it as unavailable (REQ-023 AC5).
- A loading button is natively disabled while it runs. Set `aria-busy="true"` so the busy state is announced. The spinner is hidden from assistive technology.
- Focus is shown on `:focus-visible` only, never on a mouse click alone (REQ-024 AC2). The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1).
- Every button is at least 24 × 24 CSS px, including the `xs` size (REQ-028 AC2).
- The spinner stops under `prefers-reduced-motion: reduce` (REQ-029 AC2).

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the button and shows the focus ring. A disabled or loading button is skipped. |
| Enter | Activates the button. |
| Space | Activates the button, when the key is released. |

ARIA: no `role` is added to a native button. `aria-busy` is set by the author while loading. A link-styled disabled button gets `aria-disabled="true"` from Nuxt UI.

## Content

- Start with a verb and name the result: "Guardar cambios", "Continuar".
- Keep it to one to three words, in sentence case.
- Do not end with a period.
- Keep the same label while loading, and let the spinner show the progress.

```copy es-MX
Guardar cambios
Continuar
Cancelar
```

```copy-bad es-MX
Aceptar
HAZ CLIC AQUÍ.
```

## Responsive behavior

The button is the same at 360, 768, and 1280 px (A-09). Its label stays on one line and truncates before it wraps. Add `block` for a full-width button on small screens. At 360 px, a row of buttons wraps to the next line instead of overflowing (ER-05). The focus ring reaches 6 px outside the container, so leave room around buttons inside scrolling containers.

## Email notes

The email button is a separate MJML component, described in [Email components](../../05-email/email-components.md). It cannot use a glow, so it shows a solid thick border in its place (REQ-040).

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UButton` |
| Props used | `color`, `variant`, `size`, `label`, `disabled`, `loading`, `to`, `block`, `leading-icon`, `trailing-icon` |
| Theme | `ui.button` in `packages/nuxt/app.config.ts` (hook classes and the loading variant) and the `.cn-button*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `button.*`, `radius.button`, `border.width.button`, `effect.glow.button` |
| Demos | `apps/showcase/demos/button/` |

```vue
<UButton label="Continuar" color="primary" variant="solid" />
```

## Open items

> **TBD (TBD-10):** The corner radius is not defined ("rounded" in BR-10). `radius.button` follows an ADR-0006 placeholder. Owner input needed.
>
> **TBD (TBD-11):** The stroke width is not defined ("thick" in BR-10 and BR-13). `border.width.button` follows an ADR-0006 placeholder. Owner input needed.
>
> **TBD (TBD-12):** The glow is not defined ("subtle" in BR-10): its blur, spread, opacity, and color per state. `effect.glow.button` follows the placeholder `none`, so no button glows yet. Owner input needed.
>
> **TBD (TBD-08):** Tints and shades of pink and yellow are not defined. The hover and pressed fills read shade tokens that repeat the brand color, so they look the same as the default fill. Owner input needed: decision OD-04.
>
> **Draft:** The hover and pressed behavior, and the dimming of a disabled or loading button, are not defined by BC. The hover and pressed fills use the shade tokens (TBD-08), and the dimming is Nuxt UI's default. This awaits owner approval.

## Changelog

- 0.1.0 — First draft: BR-10 and BR-11 on `UButton`, the three brand variants, the six states, the component tokens, and the demos (T7.2) — awaiting owner approval
- 0.1.0 — The mapping of the primary, secondary, and ghost variants to fills is approved by the owner (option A); the draft callout is removed — ADR-0010
