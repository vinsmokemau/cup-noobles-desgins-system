---
title: Progress
slug: progress
layer: component
level: atom
source: nuxt-ui
nuxtUi: UProgress
status: draft
lang: en
brandRules: [BR-01, BR-06, BR-13]
tokens: [progress]
demos: [states, playground]
tbd: [TBD-05, TBD-11]
related: [skeleton, separator, accessibility, motion]
since: 0.1.0
updated: 2026-10-09
---

# Progress

## Purpose

The progress bar shows how far a task has got, such as an upload, or that work is going on when the amount is unknown. It is a themed Nuxt UI `UProgress`, styled only through tokens (C-03). The track is a pill with a neutral outline on the pure-black page (BR-03, BR-13, C-05); the finished part is brand pink (BR-01). The brand context does not describe a progress bar, so the look in this doc is a draft built from existing tokens. The owner chose it from three options (ADR-0015).

## Anatomy

1. **track**: the pill-shaped outline, a `<div role="progressbar">` from Reka UI. Its outline is the boundary of the bar.
2. **fill**: the pink part inside the track. It slides to show the value.
3. **label**: the visible name of the task. The page supplies the text (A-11) and passes the same text as the accessible name.
4. **status** (optional): the percentage, shown above the track when the `status` prop is set.

## Tokens and specs

<!-- cn:generated tokens="progress" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `progress.bg` | `--cn-progress-bg` | `#000000` | stable |
| `progress.border` | `--cn-progress-border` | `#90a1b9` | tbd (TBD-05) |
| `progress.fill` | `--cn-progress-fill` | `#ef80ae` | stable |

<!-- /cn:generated -->

The track reads the same neutral outline as the text fields and the choice controls. The outline color and its stroke width follow placeholders (TBD-05, TBD-11), so they are `tbd` until the owner supplies them; the stroke width is the token `border.width.progress` on the shape page. The black fill and the pink fill are `stable`.

Contrast pairs declared for the progress bar (REQ-015):

<!-- cn:generated tokens="progress" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `progress.border` (`#90a1b9`) | `progress.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.border.default`, `placeholder.color.neutral`, `progress.border`) |
| `progress.fill` (`#ef80ae`) | `progress.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The outline is the track's boundary, because there is no surface color yet (C-05). The pink fill is 8.37:1 against the black track (SPEC.md §2.1). Progress is told by the length of the fill as well as by its color, so it does not rely on color alone (WCAG 1.4.1).

## Variants

The progress bar has one brand look. Nuxt UI's `color` prop is not used: the theme sets the look through the `.cn-progress` hook classes, so there is nothing to map.

| Brand look | Nuxt UI props | Result |
|---|---|---|
| determinate | `model-value` set | A pink fill whose length is the value |
| indeterminate | `model-value` is `null` | A moving pink fill; a still, partly filled bar under reduced motion |

The `size` prop (`xs`, `sm`, `md`, `lg`, `xl`) sets the thickness of the bar. The `orientation` prop makes it vertical, and `status` shows the percentage.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | A bar with some progress, such as 62%. | `progress.bg`, `progress.border`, `progress.fill` |
| `empty` | A bar with a value of 0: only the outlined track. | `progress.bg`, `progress.border` |
| `complete` | A bar with a value of 100: the fill reaches the end. | `progress.fill` |
| `indeterminate` | A bar with no value: the amount of work is unknown. | `progress.fill` |

A progress bar is not interactive, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. The fill moves under a short transition that Nuxt UI turns off under reduced motion. The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a progress bar when a task takes long enough to need feedback and the amount done is known, such as an upload.
- Use the indeterminate bar when the amount is unknown. For content that is loading, prefer [Skeleton](skeleton.md).
- Give every progress bar a visible label and pass the same text as its accessible name (`get-value-label`).

### When not to use

- Never use a progress bar for a value that is not progress, such as a rating or a stock level.
- Never use it as a decorative line. Use [Separator](separator.md).
- Never use a progress bar without a name.
- Never write a color literally in a progress bar. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Name the task: "Subiendo portada". | Leave the bar without a name. |
| Use the indeterminate bar when the amount is unknown. | Fake a value that does not move with the work. |
| Show the percentage with `status` when the number helps. | Show the percentage in a color that fails contrast. |

## Accessibility

- The track is a `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and, when the value is known, `aria-valuenow`. An indeterminate bar has no `aria-valuenow`, which tells assistive technology that the amount is unknown.
- The name comes from `get-value-label`, which Reka UI writes to `aria-label`. Without it, the bar would be named with the percentage only.
- A progress bar is not focusable and has no keyboard interaction.
- The pink fill is 8.37:1 against the black track, and the outline is 7.98:1 with the placeholder grey, unverified (REQ-015 AC4).
- Under `prefers-reduced-motion: reduce` the indeterminate bar stops moving and shows a still, partly filled bar. Nuxt UI would pulse it, and the theme turns that off (REQ-029 AC2).

Keyboard map: not applicable, because the bar is not interactive. A Playwright test checks that Tab skips it.

ARIA: `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-label`, set by Reka UI.

## Content

- Write the label as the task, in a few words, in sentence case: "Subiendo portada".
- When the task finishes, say so in the label: "Portada subida".

```copy es-MX
Subiendo portada
Procesando imagen
```

```copy-bad es-MX
Cargando...
Por favor espera
```

## Responsive behavior

The bar fills the width of its container, so it is the same at 360, 768, and 1280 px (A-09).

## Email notes

Not applicable. Email has no live progress.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UProgress` |
| Props used | `model-value`, `size`, `status`, `orientation`, `get-value-label` |
| Theme | `ui.progress.slots.base` and `ui.progress.slots.indicator` in `packages/nuxt/app.config.ts` and the `.cn-progress*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `progress.*`, `border.width.progress` |
| Demos | `apps/showcase/demos/progress/` |

```vue
<UProgress :model-value="62" :get-value-label="() => 'Subiendo portada'" />
```

## Open items

> **TBD (TBD-05):** The neutral scale is not defined. The track outline reads a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-11):** "Thick" has no values. The track outline follows the placeholder stroke width. Owner input needed: values.
>
> **Draft:** The look (a neutral outline with a pink fill) is approved (ADR-0015). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UProgress` themed with a neutral outline and a pink fill, the four states, the component tokens, and the demos (T7.6) — look approved (ADR-0015), awaiting the placeholders
