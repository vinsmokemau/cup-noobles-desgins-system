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
tbd: []
related: [link, icon, form-field, effects, shape]
since: 0.1.0
updated: 2026-10-19
---

# Button

## Purpose

The button triggers an action. It implements BR-10 (rounded corners, a subtle neon glow, and a thick outline stroke) and BR-11 (the primary, secondary, ghost, and disabled states) on top of Nuxt UI's `UButton`, themed only through tokens (C-03). The corner radius is the medium radius step, 12 px (ADR-0050). The stroke width is 3 px (ADR-0032), the glow is Neon tube (ADR-0051), and the hover and pressed fills are the brand tones of ADR-0055.

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
| `border.width.button` | `--cn-border-width-button` | `3px` | stable |
| `button.focus.color` | `--cn-button-focus-color` | `#fff488` | stable |
| `button.focus.offset` | `--cn-button-focus-offset` | `3px` | stable |
| `button.focus.style` | `--cn-button-focus-style` | `solid` | stable |
| `button.focus.width` | `--cn-button-focus-width` | `3px` | stable |
| `button.ghost.bgActive` | `--cn-button-ghost-bg-active` | `#d06c96` | stable |
| `button.ghost.bgHover` | `--cn-button-ghost-bg-hover` | `#000000` | stable |
| `button.ghost.border` | `--cn-button-ghost-border` | `#ef80ae` | stable |
| `button.ghost.fg` | `--cn-button-ghost-fg` | `#ef80ae` | stable |
| `button.ghost.fgActive` | `--cn-button-ghost-fg-active` | `#000000` | stable |
| `button.ghost.fgHover` | `--cn-button-ghost-fg-hover` | `#ef80ae` | stable |
| `button.ghost.glow` | `--cn-button-ghost-glow` | `0px 0px 12px 1px rgba(239, 128, 174, 0.6)` | stable |
| `button.ghost.glowHover` | `--cn-button-ghost-glow-hover` | `0px 0px 20px 2px rgba(239, 128, 174, 0.8509803921568627)` | stable |
| `button.primary.bg` | `--cn-button-primary-bg` | `#ef80ae` | stable |
| `button.primary.bgActive` | `--cn-button-primary-bg-active` | `#d06c96` | stable |
| `button.primary.bgHover` | `--cn-button-primary-bg-hover` | `#fea0c5` | stable |
| `button.primary.border` | `--cn-button-primary-border` | `#ef80ae` | stable |
| `button.primary.fg` | `--cn-button-primary-fg` | `#000000` | stable |
| `button.primary.glow` | `--cn-button-primary-glow` | `0px 0px 12px 1px rgba(239, 128, 174, 0.6)` | stable |
| `button.primary.glowHover` | `--cn-button-primary-glow-hover` | `0px 0px 20px 2px rgba(239, 128, 174, 0.8509803921568627)` | stable |
| `button.secondary.bg` | `--cn-button-secondary-bg` | `#fff488` | stable |
| `button.secondary.bgActive` | `--cn-button-secondary-bg-active` | `#dacf6d` | stable |
| `button.secondary.bgHover` | `--cn-button-secondary-bg-hover` | `#fff7a3` | stable |
| `button.secondary.border` | `--cn-button-secondary-border` | `#fff488` | stable |
| `button.secondary.fg` | `--cn-button-secondary-fg` | `#000000` | stable |
| `button.secondary.glow` | `--cn-button-secondary-glow` | `0px 0px 12px 1px rgba(255, 244, 136, 0.6)` | stable |
| `button.secondary.glowHover` | `--cn-button-secondary-glow-hover` | `0px 0px 20px 2px rgba(255, 244, 136, 0.8509803921568627)` | stable |
| `effect.glow.button` | `--cn-effect-glow-button` | `0px 0px 12px 1px rgba(239, 128, 174, 0.6)` | stable |
| `radius.button` | `--cn-radius-button` | `0.75rem` | stable |

<!-- /cn:generated -->

The component tokens only reference semantic tokens (REQ-010 AC2). The radius token is `stable`: it uses the medium radius step, 12 px (ADR-0050). The glow tokens (`button.<variant>.glow` and `glowHover`) are `stable` and give each variant its own glow color, pink around pink and ghost buttons and yellow around the secondary one (ADR-0051). The hover and pressed fills are `stable`: the lighter and darker tones of ADR-0055. The label, outline, and focus tokens are `stable`.

Contrast pairs declared for the button (REQ-015, REQ-023 AC3):

<!-- cn:generated tokens="button" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `button.primary.fg` (`#000000`) | `button.primary.bg` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `button.primary.fg` (`#000000`) | `button.primary.bgHover` (`#fea0c5`) | text | 11.05:1 | 4.50:1 | pass |
| `button.primary.fg` (`#000000`) | `button.primary.bgActive` (`#d06c96`) | text | 6.27:1 | 4.50:1 | pass |
| `button.primary.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `button.secondary.fg` (`#000000`) | `button.secondary.bg` (`#fff488`) | text | 18.55:1 | 4.50:1 | pass |
| `button.secondary.fg` (`#000000`) | `button.secondary.bgHover` (`#fff7a3`) | text | 19.09:1 | 4.50:1 | pass |
| `button.secondary.fg` (`#000000`) | `button.secondary.bgActive` (`#dacf6d`) | text | 13.13:1 | 4.50:1 | pass |
| `button.secondary.border` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `button.ghost.fg` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `button.ghost.fgHover` (`#ef80ae`) | `button.ghost.bgHover` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `button.ghost.fgActive` (`#000000`) | `button.ghost.bgActive` (`#d06c96`) | text | 6.27:1 | 4.50:1 | pass |
| `button.ghost.border` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `button.focus.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-10:** Buttons have rounded corners, a subtle neon glow, and a thick outline stroke.
>
> **BR-11:** Button states are primary, secondary, ghost, and disabled.

The labels on pink and yellow fills are black, because white on pink is 2.51:1, yellow on pink is 2.22:1, and white on yellow is 1.13:1 (SPEC.md §2.1). The focus ring is brand yellow (BR-02) and sits 3 px away from the container, so it only touches the page behind the button (ADR-0009). The glow goes on the edge only, never on the label (ADR-0052).

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
| `default` | The variant's fill, label, outline, and glow (blur 12 px, spread 1 px, 60% opacity). | `button.<variant>.bg`, `button.<variant>.fg`, `button.<variant>.border`, `button.<variant>.glow`, `radius.button`, `border.width.button` |
| `hover` | A primary or secondary button takes the lighter tone and a stronger glow (blur 20 px, spread 2 px, 85% opacity). A ghost button hovers with the stronger glow only, on the black page. | `button.<variant>.bgHover`, `button.<variant>.glowHover` |
| `focus-visible` | A yellow ring outside the container, on top of the glow. | `button.focus.color`, `button.focus.width`, `button.focus.offset`, `button.focus.style` |
| `active` | The darker tone while pressed, with the hover glow. A ghost button fills with the darker pink and turns its label black. | `button.<variant>.bgActive`, `button.<variant>.glowHover`, `button.ghost.fgActive` |
| `disabled` | The glow is removed. The button is natively disabled, so it is skipped by Tab and ignores clicks. Nuxt UI dims it. | none |
| `loading` | A spinner replaces the leading icon, and the button is disabled while it spins. It keeps its glow. | none |

The state matrix on the component page shows every row in the three variants, and each state has a visual baseline. The yellow hover tone is very close to the rest yellow, so on the secondary button the glow carries the hover state (ADR-0055).

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
- Never put the glow on the label or on any text (ADR-0052).
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

> **Draft:** The pressed state and the dimming of a disabled or loading button are not decided. The pressed button keeps the hover glow and takes the darker tone (a ghost button fills with it), which T13.2 proposed because ADR-0051 and ADR-0055 decide the rest and hover states only. The dimming is Nuxt UI's default. This awaits owner approval.

## Changelog

- 0.1.0 — First draft: BR-10 and BR-11 on `UButton`, the three brand variants, the six states, the component tokens, and the demos (T7.2) — awaiting owner approval
- 0.1.0 — The glow is Neon tube and the hover and pressed fills are the brand tones, set by the owner, and the placeholders for them are gone. A ghost button hovers with the glow only — ADR-0051, ADR-0052, ADR-0055
- 0.1.0 — The mapping of the primary, secondary, and ghost variants to fills is approved by the owner (option A); the draft callout is removed — ADR-0010
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
