---
title: Radio group
slug: radio-group
layer: component
level: atom
source: nuxt-ui
nuxtUi: URadioGroup
status: draft
lang: en
brandRules: [BR-06, BR-13]
tokens: [choice]
demos: [states, playground]
tbd: [TBD-05, TBD-10, TBD-11]
related: [checkbox, switch, select, form-field, forms, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Radio group

## Purpose

The radio group lets a person pick exactly one option from a short list that stays in view. It is a themed Nuxt UI `URadioGroup`, styled only through tokens (C-03). An unchecked radio is an outlined circle on the pure-black page (BR-03, BR-13, C-05); the checked radio is filled brand pink with a black dot. The brand context does not describe a radio, so the look in this doc is a draft built from existing tokens and waits for the owner. The [checkbox](checkbox.md) and the [switch](switch.md) share this look and these tokens.

## Anatomy

1. **legend**: the visible name of the whole group, a `<legend>` inside a `<fieldset>`. The page supplies the text (A-11).
2. **radio**: the round control, a `<button role="radio">` from Reka UI. Its outline color is the state.
3. **dot**: the black dot inside a checked radio, on the pink fill.
4. **label**: the visible name of one option, a `<label>` tied to its radio.
5. **description** (optional): a line of help under a label.
6. **focus ring**: the yellow outline drawn outside the focused radio (REQ-024, ADR-0009).

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

The radio group reads the same choice tokens as the [checkbox](checkbox.md); it is always round, so it does not read `radius.choice`. The outline color follows a placeholder (TBD-05) and the stroke width follows another (TBD-11), so they are `tbd` until the owner supplies them. The fill, the hover outline, the checked colors, and the focus tokens are `stable`.

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

The outline is the radio's boundary, because there is no surface color yet (C-05). The stroke width is a placeholder until TBD-11 gives the "thick" value. Black on the pink fill is 8.37:1, and the yellow focus ring is 18.55:1 (SPEC.md §2.1).

Each radio is at least 24 × 24 px (six space units, REQ-028 AC2), larger than Nuxt UI's 16 px default.

## Variants

The radio group has one brand look. Nuxt UI's `color` and `variant` props are not used: the theme sets the look through the `.cn-choice` hook class on each radio, so there is nothing to map.

| Brand look | Nuxt UI props | Unchecked | Checked |
|---|---|---|---|
| default | none | Black circle, neutral outline, pink on hover | Pink circle, pink outline, black dot |

The `size` prop (`xs`, `sm`, `md`, `lg`, `xl`) changes the text size; a radio never goes below 24 px. The `orientation` prop lays the options out in a `vertical` (default) or `horizontal` row. The `items` prop takes `{ label, value }` objects, and each item can be `disabled` on its own. Set `loop` so the arrow keys wrap around the ends, as a native radio group does; Nuxt UI leaves it off by default.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Unchecked black circles with a neutral outline. | `choice.bg`, `choice.border` |
| `hover` | The outline of an unchecked radio turns brand pink. | `choice.borderHover` |
| `focus-visible` | A yellow ring outside the focused radio. | `choice.focus.color`, `choice.focus.width`, `choice.focus.offset`, `choice.focus.style` |
| `checked` | The selected radio fills pink and shows a black dot. | `choice.checked.bg`, `choice.checked.border`, `choice.checked.fg` |
| `disabled` | The radios are natively disabled, cannot be focused, and Nuxt UI dims them. They ignore hover. A disabled group can have one radio checked. | none |

A radio has no `active` state of its own: pressing it selects it, and `checked` covers that. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a radio group when exactly one option must be picked and the list is short, up to about five options.
- Preselect the safest or most common option when there is one. If a person must choose, leave none selected and say so in the legend.
- Give the group a legend and every radio a label. Pass them as text from the page (A-11).

### When not to use

- Never use a radio group when a person can pick several options. Use [Checkbox](checkbox.md).
- Never use a radio group for a long list. Use [Select](select.md).
- Never use a radio group for a setting that applies at once. Use [Switch](switch.md).
- Never remove the focus ring or replace it with a glow (REQ-024).
- Never write a color literally in a radio. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Write a legend that names the choice: "Categoría". | Leave the group without a legend. |
| Write each option so it stands alone: "Juegos de mesa". | Write options that depend on the order: "La segunda". |
| Keep the options in a stable order. | Reorder the options after each use. |

## Accessibility

- The group is a `<fieldset>` with a `<legend>`, and the radios are `role="radio"` inside a `role="radiogroup"`. Each radio is named by its `<label>`.
- Only one radio of the group is in the tab order: the checked one, or the first when none is checked. Arrow keys move inside the group, as in a native radio group.
- The checked state is shown by the black dot as well as by the pink fill, so it is not told by color alone (WCAG 1.4.1). The unchecked outline is 7.98:1 against the page (REQ-015).
- The focus ring shows on `:focus-visible`. The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1, AC2).
- A disabled radio is natively disabled: it is announced as unavailable and skipped by Tab and by the arrow keys.

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus into the group, to the checked radio or the first one. A disabled group is skipped. |
| Shift + Tab | Moves focus out of the group, to the previous control. |
| Arrow down (vertical group), arrow right (horizontal group) | Moves focus to the next radio and selects it. With `loop`, it wraps from the last radio to the first. |
| Arrow up (vertical group), arrow left (horizontal group) | Moves focus to the previous radio and selects it. With `loop`, it wraps from the first radio to the last. |
| Space | Selects the focused radio. |

ARIA: `role="radiogroup"` on the group, `role="radio"` and `aria-checked` on each radio, set by Reka UI.

## Content

- Write the legend as a noun or a short question: "Categoría".
- Write each option in a few words, in sentence case: "Juegos de mesa".

```copy es-MX
Categoría
Cartas
Juegos de mesa
Figuras
```

```copy-bad es-MX
Elige
Opción 1
Otro (especificar abajo)
```

## Responsive behavior

The radio group is the same at 360, 768, and 1280 px (A-09). A horizontal group wraps its options onto the next line when they do not fit, so nothing overflows at 360 px. Prefer a vertical group on a narrow screen.

## Email notes

Not applicable. Email has no form controls.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `URadioGroup` |
| Props used | `id`, `legend`, `items`, `size`, `orientation`, `default-value`, `v-model`, `disabled`, `loop` |
| Theme | `ui.radioGroup.slots.base` in `packages/nuxt/app.config.ts` and the `.cn-choice` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `choice.*`, `border.width.choice` |
| Demos | `apps/showcase/demos/radio-group/` |

```vue
<URadioGroup
  legend="Categoría"
  :items="[
    { label: 'Cartas', value: 'cartas' },
    { label: 'Juegos de mesa', value: 'juegos' },
  ]"
/>
```

## Open items

> **TBD (TBD-05):** The neutral scale is not defined. The unchecked outline reads a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-11):** "Thick" has no values. The stroke width follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-10):** "Rounded" has no values. A radio is round by shape, but the choice token group also holds the checkbox radius, which follows the ADR-0006 placeholder. Owner input needed: values.
>
> **Draft:** The look of the choice controls (an outlined circle that turns pink on hover and fills pink with a black dot when checked, with the yellow focus ring) is approved (ADR-0014). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `URadioGroup` themed with the shared choice look, the five states, the component tokens, and the demos (T7.5) — look approved (ADR-0014), awaiting the placeholders
