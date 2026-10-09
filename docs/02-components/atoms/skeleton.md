---
title: Skeleton
slug: skeleton
layer: component
level: atom
source: nuxt-ui
nuxtUi: USkeleton
status: draft
lang: en
brandRules: [BR-06, BR-13]
tokens: [skeleton]
demos: [states, playground]
tbd: [TBD-05, TBD-10, TBD-11, TBD-14]
related: [progress, separator, accessibility, motion]
since: 0.1.0
updated: 2026-10-09
---

# Skeleton

## Purpose

The skeleton is a stand-in shape shown in the place where content will appear, so the page does not jump when the content arrives. It is a themed Nuxt UI `USkeleton`, styled only through tokens (C-03). A skeleton shape is an outline with no fill, because the system has no surface color yet (C-05), and it fades slowly between full and half opacity. Under reduced motion it stops (REQ-029). The brand context does not describe a loading placeholder, so the look in this doc is a draft built from existing tokens. The owner chose it from three options (ADR-0015).

## Anatomy

1. **shape**: one outlined block, line, or circle. The page sets its size with classes; the theme sets the outline, the radius, and the fade.
2. **group** (optional): a wrapper that names several shapes once, with `role="status"` and an accessible label.

## Tokens and specs

<!-- cn:generated tokens="skeleton" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `skeleton.border` | `--cn-skeleton-border` | `#90a1b9` | tbd (TBD-05) |

<!-- /cn:generated -->

The shape reads a neutral outline that follows a placeholder (TBD-05), so it is `tbd` until the owner supplies it. Its stroke width and radius are the tokens `border.width.skeleton` and `radius.skeleton` on the shape page, and they follow placeholders too (TBD-11, TBD-10). The fade lasts ten base motion durations, and the base duration is a placeholder (TBD-14). The depth of the fade, half opacity, is Nuxt UI's own default for the component, not a brand value.

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

A skeleton shape carries no information of its own, so no contrast ratio is declared for it (REQ-015 does not apply to decoration). The outline is the shape's only boundary, because there is no surface color yet (C-05).

## Variants

The skeleton has one brand look. The shape is set by the page with classes: a line is a short wide block, a block is a taller one, and a circle adds `rounded-full`.

| Shape | Typical classes |
|---|---|
| line | `h-4 w-full` |
| block | `h-32 w-full` |
| circle | `size-12 rounded-full` |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | An outlined shape that fades between full and half opacity. | `skeleton.border`, `border.width.skeleton`, `radius.skeleton` |

A skeleton is not interactive, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. It is the loading state of other content, so it has no loading state of its own. The state matrix on the component page shows it, and the state has a visual baseline.

## Usage rules

### When to use

- Use a skeleton where content is loading and its layout is known, such as a card or a list.
- Match the size of each shape to the content it replaces, so the page does not jump.
- Name a group of shapes once, with a `status` wrapper and a label from the page (A-11).

### When not to use

- Never use a skeleton for a task whose progress is known. Use [Progress](progress.md).
- Never leave a skeleton on screen with no end. Replace it with the content, or with an error message.
- Never use a skeleton as decoration or as an empty state.
- Never write a color, a duration, or a radius literally in a skeleton. Read the tokens (REQ-016).

## Do and don't

| Do | Don't |
|---|---|
| Match the shape to the content it replaces. | Show shapes unlike the content. |
| Name the group once: "Cargando tarjeta". | Let every shape announce its own label. |
| Replace the skeleton with the content as soon as it is ready. | Keep fading after the content has arrived. |

## Accessibility

- Nuxt UI gives every skeleton `role="alert"`, `aria-busy="true"`, `aria-live="polite"`, and the fixed English label `loading`. A fixed English label breaks the rule that components hold no copy (A-11, ER-04), so the page overrides it.
- For one shape, pass `role="status"` and an es-MX `aria-label` to `USkeleton`.
- For a group, wrap the shapes in an element with `role="status"`, `aria-busy="true"`, and one es-MX `aria-label`, and give each shape `aria-hidden="true"`, so the group is announced once.
- A skeleton is not focusable and has no keyboard interaction.
- Under `prefers-reduced-motion: reduce` the shapes stay at full opacity and nothing animates (REQ-029 AC2). The fade is slow and never flashes (WCAG 2.3.1).

Keyboard map: not applicable, because the skeleton is not interactive. A Playwright test checks that Tab skips it.

ARIA: `role="status"`, `aria-busy`, and `aria-label` on the shape or the group; `aria-hidden` on the shapes of a group.

## Content

- Write the label as what is loading, in a few words, in sentence case: "Cargando tarjeta".
- A skeleton holds no text of its own.

```copy es-MX
Cargando tarjeta
Cargando imagen
```

```copy-bad es-MX
loading
Espera un momento por favor...
```

## Responsive behavior

A shape that is `w-full` fills its container, so a skeleton layout is the same at 360, 768, and 1280 px (A-09). Give a shape a maximum width through its classes, not a fixed one, so it never causes horizontal overflow (REQ-028 AC1).

## Email notes

Not applicable. Email has no loading state.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `USkeleton` |
| Props used | `as`, `class`, and the attributes `role`, `aria-label`, `aria-hidden` |
| Theme | `ui.skeleton.base` in `packages/nuxt/app.config.ts` and the `.cn-skeleton` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `skeleton.*`, `border.width.skeleton`, `radius.skeleton` |
| Demos | `apps/showcase/demos/skeleton/` |

```vue
<USkeleton role="status" aria-label="Cargando imagen" class="h-32 w-full" />
```

## Open items

> **TBD (TBD-05):** The neutral scale is not defined. The shape outline reads a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-10):** "Rounded" has no values. The shape radius follows a placeholder. Owner input needed: values.
>
> **TBD (TBD-11):** "Thick" has no values. The shape outline follows the placeholder stroke width. Owner input needed: values.
>
> **TBD (TBD-14):** Motion durations are not defined. The fade length follows a placeholder. Owner input needed: values.
>
> **Draft:** The look (outlined shapes with a slow fade) is approved (ADR-0015). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `USkeleton` themed as outlined shapes with a slow fade that stops under reduced motion, the component tokens, and the demos (T7.6) — look approved (ADR-0015), awaiting the placeholders
