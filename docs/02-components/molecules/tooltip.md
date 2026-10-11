---
title: Tooltip
slug: tooltip
layer: component
level: molecule
source: nuxt-ui
nuxtUi: UTooltip
status: draft
lang: en
brandRules: [BR-06, BR-13]
tokens: [tooltip, radius.tooltip, border.width.tooltip]
demos: [states, playground]
tbd: [TBD-04, TBD-10, TBD-11, TBD-14]
related: [button, link, alert, toast, accessibility]
since: 0.1.0
updated: 2026-10-10
---

# Tooltip

## Purpose

The tooltip is a short hint that appears beside a control when the person hovers over it or focuses it with the keyboard. It names or explains the control and never holds anything the person needs to act. It is a themed Nuxt UI `UTooltip`, styled only through tokens (C-03). It serves the high-contrast, legible UI of BR-06 and the thick line work of BR-13.

## Anatomy

1. **trigger**: the control the hint belongs to, passed to the default slot. It keeps its own look and focus ring.
2. **bubble**: the small black block with a brand pink outline that holds the text.
3. **text**: the hint, one short line.

## Tokens and specs

<!-- cn:generated tokens="tooltip radius.tooltip border.width.tooltip" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.tooltip` | `--cn-border-width-tooltip` | `1px` | tbd (TBD-11) |
| `radius.tooltip` | `--cn-radius-tooltip` | `0.375rem` | tbd (TBD-10) |
| `tooltip.bg` | `--cn-tooltip-bg` | `#000000` | stable |
| `tooltip.border` | `--cn-tooltip-border` | `#ef80ae` | stable |
| `tooltip.fg` | `--cn-tooltip-fg` | `#90a1b9` | tbd (TBD-04) |

<!-- /cn:generated -->

The outline is brand pink (BR-01) and the fill is the black page (BR-03), so both are `stable`. The text color, the radius, and the stroke width follow placeholders (TBD-04, TBD-10, TBD-11), so they are `tbd`.

Contrast pairs declared for the tooltip (REQ-015):

<!-- cn:generated tokens="tooltip" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `tooltip.fg` (`#90a1b9`) | `tooltip.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.default`, `placeholder.color.neutral`, `tooltip.fg`) |
| `tooltip.border` (`#ef80ae`) | `tooltip.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The bubble has no glow and no shadow (ADR-0027). The pink outline against the black page is 8.37:1 (SPEC.md §2.1).

## Variants

The tooltip has one look. Its `side` prop (`top`, `right`, `bottom`, `left`) picks where the bubble sits, and Nuxt UI flips it when there is no room. Nuxt UI's optional arrow and keyboard-shortcut chips are not part of the brand look: do not pass `arrow`, and pass `kbds` only when the shortcut is the hint.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Closed. Only the trigger shows. | none |
| `hover` | Open after the pointer rests on the trigger: black bubble with a pink outline. | `tooltip.bg`, `tooltip.fg`, `tooltip.border`, `radius.tooltip`, `border.width.tooltip` |
| `focus-visible` | Open after the trigger is focused with the keyboard, and the trigger shows its own focus ring. | the trigger's focus tokens |

The tooltip is not focusable and has no active or disabled state of its own. A `disabled` tooltip never opens. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a tooltip to name an icon-only control or to add a short hint to a control whose label is already clear.
- Keep the text to one short line.
- Put it on a control that can be focused, so keyboard users reach it too.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never put information in a tooltip that the person needs to complete a task. Touch screens and many assistive technologies never show it.
- Never put a link, a button, or a form control in a tooltip.
- Never use a tooltip as the only label of a control. An icon-only control still needs an accessible name.
- Never put a tooltip on something that cannot be focused.
- Never write a color, radius, or width literally on a tooltip. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Write a short hint: "Guardar los cambios". | Write a paragraph. |
| Give an icon-only button an `aria-label` and a tooltip with the same words. | Rely on the tooltip as the only name. |
| Put the tooltip on a focusable control. | Put it on plain text. |
| Let the bubble flip when there is no room. | Force a side that falls off the screen. |

## Accessibility

- The tooltip opens when the trigger is hovered **and** when it receives keyboard focus (WCAG 1.4.13). It closes on Escape, when the trigger loses focus, and when the pointer leaves both the trigger and the bubble.
- The bubble stays open while the pointer is over it, so a person can read it with a magnifier (WCAG 1.4.13 hoverable).
- Reka UI links the bubble to the trigger with `aria-describedby` while it is open, so a screen reader reads it after the control's name.
- The trigger keeps its own focus ring. The tooltip draws none, because it is never focused (REQ-024).
- Under `prefers-reduced-motion: reduce` the scale-in and scale-out animations are removed (REQ-029 AC2).
- Text is 4.5:1 or more against the black fill where the text color is defined, and the outline is 8.37:1 against the page (REQ-015).

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the trigger and opens the tooltip. |
| Escape | Closes the open tooltip and keeps focus on the trigger. |
| Shift + Tab | Moves focus away and closes the tooltip. |

ARIA: the bubble has `role="tooltip"` (Reka UI), and the trigger gets `aria-describedby` while the tooltip is open.

## Content

- Write the hint as a short phrase in sentence case, without a final period.
- Describe the action: "Guardar los cambios". Do not repeat the visible label word for word.

```copy es-MX
Guardar los cambios
Copiar el enlace
```

```copy-bad es-MX
Haz clic aquí para guardar todos los cambios que hayas hecho en el formulario.
```

## Responsive behavior

The bubble sits beside its trigger and wraps long text inside the viewport at 360, 768, and 1280 px (A-09). It never causes horizontal overflow (REQ-028 AC1). Touch screens have no hover, so a tooltip may never open there: keep the hint redundant.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UTooltip` |
| Props used | `text`, `content` (`side`), `disabled` |
| Slots used | default (the trigger) |
| Theme | `ui.tooltip.slots.content` in `packages/nuxt/app.config.ts` and the `.cn-tooltip` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `tooltip.*`, `radius.tooltip`, `border.width.tooltip` |
| Demos | `apps/showcase/demos/tooltip/` |

```vue
<UTooltip text="Guardar los cambios">
  <UButton label="Guardar" />
</UTooltip>
```

## Open items

> **TBD (TBD-04):** The body text color is not decided. The tooltip text reads a placeholder, not a brand value. Owner input needed: a hex.
>
> **TBD (TBD-10):** "Rounded" has no values. The corner radius follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-11):** "Thick" has no values. The stroke width follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-14):** Motion durations and easing are not defined. The open and close animation and the hover delay are Nuxt UI defaults, not brand values. Owner input needed: values.
>
> **Draft:** The look of the tooltip (a black bubble with a brand pink outline) is approved (ADR-0027). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UTooltip` themed with the pink outline look, the component tokens, and the demos (T8.3) — ADR-0027
