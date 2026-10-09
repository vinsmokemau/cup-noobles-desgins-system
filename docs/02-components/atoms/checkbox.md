---
title: Checkbox
slug: checkbox
layer: component
level: atom
source: nuxt-ui
nuxtUi: UCheckbox
status: draft
lang: en
brandRules: [BR-06, BR-13]
tokens: [choice]
demos: [states, playground]
tbd: [TBD-05, TBD-10, TBD-11]
related: [radio-group, switch, input, form-field, forms, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Checkbox

## Purpose

The checkbox lets a person turn one option on or off, or pick any number of options from a list. It is a themed Nuxt UI `UCheckbox`, styled only through tokens (C-03). Unchecked it is an outlined box on the pure-black page (BR-03, BR-13, C-05); checked it is filled brand pink with a black check mark. The brand context does not describe a checkbox, so the look in this doc is a draft built from existing tokens and waits for the owner. The [radio group](radio-group.md) and the [switch](switch.md) share this look and these tokens.

## Anatomy

1. **box**: the square control, a `<button role="checkbox">` from Reka UI. Its outline color is the state.
2. **mark**: the check (checked) or the minus (indeterminate), drawn inside the box in black on the pink fill.
3. **label**: the visible name of the option, a `<label>` tied to the box. The checkbox never holds copy (A-11), so the page supplies it.
4. **description** (optional): a line of help under the label.
5. **focus ring**: the yellow outline drawn outside the box on keyboard focus (REQ-024, ADR-0009).

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

The choice tokens are shared by the checkbox, the radio group, and the switch, so the three always match. The component tokens only reference semantic tokens (REQ-010 AC2). The unchecked outline, the corner radius, and the stroke width follow placeholders (TBD-05, TBD-10, TBD-11), so they are `tbd` until the owner supplies them. The fill, the hover outline, the checked colors, and the focus tokens are `stable`.

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

The outline is the box's boundary, because there is no surface color yet (C-05). The stroke width is a placeholder until TBD-11 gives the "thick" value. Black on the pink fill is 8.37:1, and the yellow focus ring is 18.55:1 (SPEC.md §2.1).

The box is at least 24 × 24 px (six space units, REQ-028 AC2), larger than Nuxt UI's 16 px default, so it is a safe target.

## Variants

The checkbox has one brand look. Nuxt UI's `color` and `variant` props are not used: the theme sets the look through the `.cn-choice` hook class, so there is nothing to map.

| Brand look | Nuxt UI props | Unchecked | Checked |
|---|---|---|---|
| default | none | Black box, neutral outline, pink on hover | Pink box, pink outline, black mark |

The `size` prop (`xs`, `sm`, `md`, `lg`, `xl`) changes the text size and the mark; the box never goes below 24 px. The `indicator` prop moves the box to the `start` (default) or `end` of the label. The `description` prop adds a help line.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | An unchecked black box with a neutral outline. | `choice.bg`, `choice.border` |
| `hover` | The outline of an unchecked box turns brand pink. A checked box is already pink. | `choice.borderHover` |
| `focus-visible` | A yellow ring outside the box. | `choice.focus.color`, `choice.focus.width`, `choice.focus.offset`, `choice.focus.style` |
| `checked` | The box fills pink and shows a black check mark. | `choice.checked.bg`, `choice.checked.border`, `choice.checked.fg` |
| `indeterminate` | The box looks checked, with a black minus instead of a check. It means "some, not all" for a parent of a list. | `choice.checked.bg`, `choice.checked.border`, `choice.checked.fg` |
| `disabled` | The box is natively disabled, cannot be focused, and Nuxt UI dims it. It ignores hover. A disabled box can be checked or unchecked. | none |

A checkbox has no `active` state of its own: pressing it toggles it, and `checked` covers that. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a checkbox for an option that is on or off, such as "Recibir avisos de lanzamientos".
- Use a group of checkboxes when a person can pick any number of options.
- Use `indeterminate` only on a parent checkbox whose children are partly checked.
- Give every checkbox a visible label. Pass the label as text from the page (A-11).

### When not to use

- Never use a checkbox when exactly one option may be picked. Use [Radio group](radio-group.md).
- Never use a checkbox for a setting that applies at once, without a save step. Use [Switch](switch.md).
- Never leave a checkbox without a label, and never use a placeholder-like hint as the label.
- Never remove the focus ring or replace it with a glow (REQ-024).
- Never write a color literally in a checkbox. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Write the label as the option itself: "Recibir avisos de lanzamientos". | Write a label that needs the box's state to make sense: "Activar". |
| Pass the `label` prop, so the whole label is a click target. | Place a bare box with loose text beside it. |
| Keep the box at least 24 px (REQ-028 AC2). | Shrink the box to look lighter. |

## Accessibility

- The box is a `<button role="checkbox">` with `aria-checked` set to `true`, `false`, or `mixed` (indeterminate). It is named by its `<label>`.
- Clicking the label toggles the box, because the label is tied to it with `for` and `id`.
- The checked state is shown by the check mark as well as by the pink fill, so it is not told by color alone (WCAG 1.4.1). The unchecked outline is 7.98:1 against the page, and the pink outline on hover and the focus ring are above 3:1 (REQ-015).
- The focus ring shows on `:focus-visible`, which keyboard focus matches and a mouse click does not (REQ-024 AC2). The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1).
- A disabled checkbox is natively disabled: it is announced as unavailable and skipped by Tab.

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the checkbox and shows the focus ring. A disabled checkbox is skipped. |
| Shift + Tab | Moves focus to the previous control. |
| Space | Toggles the checkbox. |

ARIA: `role="checkbox"` and `aria-checked` (`true`, `false`, or `mixed`), set by Reka UI. Enter does not toggle a checkbox, as in the native control.

## Content

- Write the label as the option, in a few words, in sentence case: "Recibir avisos de lanzamientos".
- Write the description, when there is one, as one short sentence that ends with a period.

```copy es-MX
Recibir avisos de lanzamientos
Aceptar los términos de uso
```

```copy-bad es-MX
Activar
Sí
Marcar aquí
```

## Responsive behavior

The checkbox and its label are the same at 360, 768, and 1280 px (A-09). The label wraps under the box's right edge on a narrow screen. Stack checkboxes in one column at 360 px.

## Email notes

Not applicable. Email has no form controls.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UCheckbox` |
| Props used | `id`, `label`, `size`, `default-value`, `v-model`, `disabled` |
| Theme | `ui.checkbox.slots.base` in `packages/nuxt/app.config.ts` and the `.cn-choice` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `choice.*`, `radius.choice`, `border.width.choice` |
| Demos | `apps/showcase/demos/checkbox/` |

```vue
<UCheckbox id="avisos" label="Recibir avisos de lanzamientos" />
```

## Open items

> **TBD (TBD-05):** The neutral scale is not defined. The unchecked outline and the unchecked switch thumb read a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-10):** "Rounded" has no values. The checkbox corner radius follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-11):** "Thick" has no values. The stroke width follows the ADR-0006 placeholder. Owner input needed: values.
>
> **Draft:** The look of the choice controls (an outlined box that turns pink on hover and fills pink with a black mark when checked, with the yellow focus ring) was built from existing tokens and has not been shown to the owner. It needs an ADR with the owner's choice, and the doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UCheckbox` themed with the shared choice look, the six states, the component tokens, and the demos (T7.5) — awaiting owner approval of the look and the placeholders
