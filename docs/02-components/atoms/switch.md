---
title: Switch
slug: switch
layer: component
level: atom
source: nuxt-ui
nuxtUi: USwitch
status: draft
lang: en
brandRules: [BR-06, BR-13]
tokens: [choice]
demos: [states, playground]
tbd: [TBD-05, TBD-10, TBD-11]
related: [checkbox, radio-group, form-field, forms, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Switch

## Purpose

The switch turns one setting on or off, and the change applies at once. It is a themed Nuxt UI `USwitch`, styled only through tokens (C-03). Off, it is an outlined track on the pure-black page with a neutral thumb (BR-03, BR-13, C-05); on, the track is filled brand pink and the thumb is black. The brand context does not describe a switch, so the look in this doc is a draft built from existing tokens and waits for the owner. The [checkbox](checkbox.md) and the [radio group](radio-group.md) share this look and these tokens.

## Anatomy

1. **track**: the pill-shaped control, a `<button role="switch">` from Reka UI. Its outline color is the state.
2. **thumb**: the round knob that slides to the right when the switch is on.
3. **label**: the visible name of the setting, a `<label>` tied to the track. The page supplies the text (A-11).
4. **description** (optional): a line of help under the label.
5. **focus ring**: the yellow outline drawn outside the track on keyboard focus (REQ-024, ADR-0009).

## Tokens and specs

<!-- cn:generated tokens="choice" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `choice.bg` | `--cn-choice-bg` | `#000000` | stable |
| `choice.border` | `--cn-choice-border` | `#90a1b9` | tbd (TBD-05) |
| `choice.borderHover` | `--cn-choice-border-hover` | `#ef80ae` | stable |
| `choice.checked.bg` | `--cn-choice-checked-bg` | `#ef80ae` | stable |
| `choice.checked.border` | `--cn-choice-checked-border` | `#ef80ae` | stable |
| `choice.checked.fg` | `--cn-choice-checked-fg` | `#000000` | stable |
| `choice.focus.color` | `--cn-choice-focus-color` | `#fff488` | stable |
| `choice.focus.offset` | `--cn-choice-focus-offset` | `3px` | stable |
| `choice.focus.style` | `--cn-choice-focus-style` | `solid` | stable |
| `choice.focus.width` | `--cn-choice-focus-width` | `3px` | stable |

<!-- /cn:generated -->

The switch reads the same choice tokens as the [checkbox](checkbox.md). It is pill-shaped, so it does not read `radius.choice`, and it keeps Nuxt UI's 2 px track border because the thumb travel is tuned to it, so it does not read `border.width.choice` either. The off outline and the off thumb follow a placeholder (TBD-05), so they are `tbd` until the owner supplies them. The fill, the hover outline, the on colors, and the focus tokens are `stable`.

Contrast pairs declared for the choice controls (REQ-015):

<!-- cn:generated tokens="choice" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `choice.border` (`#90a1b9`) | `choice.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `choice.border`, `color.border.default`, `placeholder.color.neutral`) |
| `choice.borderHover` (`#ef80ae`) | `choice.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `choice.checked.bg` (`#ef80ae`) | `choice.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `choice.checked.fg` (`#000000`) | `choice.checked.bg` (`#ef80ae`) | ui | 8.37:1 | 3.00:1 | pass |
| `choice.focus.color` (`#fff488`) | `choice.bg` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The outline is the track's boundary, because there is no surface color yet (C-05). The neutral thumb is 7.98:1 against the black track, and the black thumb is 8.37:1 against the pink track (SPEC.md §2.1). The yellow focus ring is 18.55:1.

The track is at least 24 px tall and 36 px wide (REQ-028 AC2).

## Variants

The switch has one brand look. Nuxt UI's `color` prop is not used: the theme sets the look through the `.cn-choice` hook class, so there is nothing to map.

| Brand look | Nuxt UI props | Off | On |
|---|---|---|---|
| default | none | Black track, neutral outline and thumb, pink outline on hover | Pink track, black thumb |

The `size` prop (`xs`, `sm`, `md`, `lg`, `xl`) changes the text size; the track never goes below 24 px tall. The `description` prop adds a help line.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | An off switch: a black track with a neutral outline and a neutral thumb on the left. | `choice.bg`, `choice.border` |
| `hover` | The outline of an off switch turns brand pink. An on switch is already pink. | `choice.borderHover` |
| `focus-visible` | A yellow ring outside the track. | `choice.focus.color`, `choice.focus.width`, `choice.focus.offset`, `choice.focus.style` |
| `checked` | The switch is on: the track fills pink and the black thumb slides to the right. | `choice.checked.bg`, `choice.checked.border`, `choice.checked.fg` |
| `disabled` | The switch is natively disabled, cannot be focused, and Nuxt UI dims it. It ignores hover. A disabled switch can be on or off. | none |

A switch has no `active` state of its own: pressing it toggles it, and `checked` covers that. The thumb slides under a short transition that Nuxt UI turns off under reduced motion. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a switch for a setting that takes effect as soon as it changes, such as "Avisos de lanzamientos".
- Write the label as the setting, so "on" and "off" are the two states of that one thing.
- Give every switch a visible label. Pass it as text from the page (A-11).

### When not to use

- Never use a switch in a form that is sent with a button. Use [Checkbox](checkbox.md), because a form change is not applied until it is sent.
- Never use a switch to pick one of several options. Use [Radio group](radio-group.md).
- Never use a switch without a label, or one whose label changes with its state.
- Never remove the focus ring or replace it with a glow (REQ-024).
- Never write a color literally in a switch. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Name the setting: "Avisos de lanzamientos". | Name the action: "Activar avisos". |
| Apply the change as soon as the switch moves. | Make a person press a save button after a switch. |
| Show the state by the thumb position and the fill. | Show the state by color alone. |

## Accessibility

- The track is a `<button role="switch">` with `aria-checked` set to `true` or `false`. It is named by its `<label>`.
- Clicking the label toggles the switch, because the label is tied to it with `for` and `id`.
- The on state is shown by the thumb position as well as by the pink fill, so it is not told by color alone (WCAG 1.4.1).
- The focus ring shows on `:focus-visible`. The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1, AC2).
- A disabled switch is natively disabled: it is announced as unavailable and skipped by Tab.

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the switch and shows the focus ring. A disabled switch is skipped. |
| Shift + Tab | Moves focus to the previous control. |
| Space | Toggles the switch. |

ARIA: `role="switch"` and `aria-checked`, set by Reka UI.

## Content

- Write the label as the setting, in a few words, in sentence case: "Avisos de lanzamientos".
- Write the description, when there is one, as one short sentence that ends with a period.

```copy es-MX
Avisos de lanzamientos
Modo de ahorro de datos
```

```copy-bad es-MX
Activar
Encendido / Apagado
```

## Responsive behavior

The switch and its label are the same at 360, 768, and 1280 px (A-09). The label wraps beside the track on a narrow screen.

## Email notes

Not applicable. Email has no form controls.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `USwitch` |
| Props used | `id`, `label`, `size`, `default-value`, `v-model`, `disabled` |
| Theme | `ui.switch.slots.base` in `packages/nuxt/app.config.ts` and the `.cn-choice` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `choice.*` |
| Demos | `apps/showcase/demos/switch/` |

```vue
<USwitch id="avisos" label="Avisos de lanzamientos" />
```

## Open items

> **TBD (TBD-05):** The neutral scale is not defined. The off outline and the off thumb read a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-10):** "Rounded" has no values. The switch is pill-shaped by shape, but the choice token group also holds the checkbox radius, which follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-11):** "Thick" has no values. The switch keeps Nuxt UI's own track border, so its thickness is not set by a token until the owner supplies the stroke width. Owner input needed: values.
>
> **Draft:** The look of the choice controls (an outlined track that turns pink on hover and fills pink with a black thumb when on, with the yellow focus ring) is approved (ADR-0014). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `USwitch` themed with the shared choice look, the five states, the component tokens, and the demos (T7.5) — look approved (ADR-0014), awaiting the placeholders
