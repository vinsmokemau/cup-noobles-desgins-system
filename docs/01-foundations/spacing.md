---
title: Spacing
slug: spacing
layer: foundation
status: stable
lang: en
brandRules: [BR-06, BR-15]
tokens: [space]
tbd: []
related: [layout, typography, shape, responsive-behavior]
since: 0.1.0
updated: 2026-10-19
---

# Spacing

## Purpose

This doc defines how space is measured in Cup Noobles UI: one base unit, and a scale of steps built from it, used for every padding, gap, and margin. Consistent spacing keeps the UI legible (BR-06) and lets the same components work on mobile and web/dashboard layouts (BR-15). The scale is the Rhythm of 8 (ADR-0049): a 4 px base and eight steps, each a multiple of it.

## Tokens and specs

<!-- cn:generated tokens="space" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `space.base` | `--cn-space-base` | `0.25rem` | stable |
| `space.lg` | `--cn-space-lg` | `1.5rem` | stable |
| `space.md` | `--cn-space-md` | `1rem` | stable |
| `space.sm` | `--cn-space-sm` | `0.5rem` | stable |
| `space.xl` | `--cn-space-xl` | `2rem` | stable |
| `space.xxl` | `--cn-space-xxl` | `3rem` | stable |
| `space.xxxl` | `--cn-space-xxxl` | `4rem` | stable |
| `space.xxxxl` | `--cn-space-xxxxl` | `6rem` | stable |

<!-- /cn:generated -->

The base unit is 0.25rem (4 px), the same as Tailwind's `--spacing`, so every stock Nuxt UI padding and gap class keeps its size. The owner chose a 4 px base because a larger one would double each of them (ADR-0049).

### Steps

Each step is a multiple of the base, and the scale is the same at every viewport. The first step is the base token itself.

| Step | Token | Value | Pixels |
|---|---|---|---|
| xs | `space.base` | 0.25rem | 4 |
| sm | `space.sm` | 0.5rem | 8 |
| md | `space.md` | 1rem | 16 |
| lg | `space.lg` | 1.5rem | 24 |
| xl | `space.xl` | 2rem | 32 |
| 2xl | `space.xxl` | 3rem | 48 |
| 3xl | `space.xxxl` | 4rem | 64 |
| 4xl | `space.xxxxl` | 6rem | 96 |

A token path segment cannot start with a digit (REQ-017 AC2), so the steps `2xl`, `3xl`, and `4xl` are named `xxl`, `xxxl`, and `xxxxl`, the way the `2xl` breakpoint is named `xxl`.

The roles the owner saw on the comparison page (icon to text, between buttons, card padding, between cards, and so on) were examples. Each component task decides which step it uses, and no task may add a step outside this scale (ADR-0049). The component tokens that apply spacing to a component, such as a button's padding, are added by that component's task.

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.
>
> **BR-15:** The system is responsive and works on both mobile and web/dashboard layouts.

The brand context defines no spacing values. How the layout adapts between viewports is covered in [Layout](layout.md).

## Usage rules

### When to use

- Use `space.*` tokens for every padding, gap, and margin between components and inside them.
- Reference spacing only through `--cn-space-*` variables or token imports. Never write a spacing value literally in a component, the showcase, or an app (REQ-016).
- In a consuming app, apply spacing tokens through layout only (C-03, ER-02).

### When not to use

- Never make up a spacing step or a value between two steps. The scale is in ADR-0049, and only the owner can change it.
- Never remove spacing to make content fit at 360 px. Let the layout reflow instead (see [Layout](layout.md)).

## Do and don't

| Do | Don't |
|---|---|
| Set the gap between two cards with a `space.*` token. | Type a pixel gap into the component. |
| Pick the nearest step of the scale. | Add a "slightly bigger" step by eye because the scale feels tight. |
| Keep the same spacing tokens at every viewport. | Shrink padding at 360 px until the text touches the outline. |

## Accessibility

- Text spacing must hold up under the user overrides in WCAG 2.2 SC 1.4.12 (line height, paragraph, letter, and word spacing) without clipping or overlapping content. Components use spacing tokens with flexible containers, never fixed heights for text.
- Spacing between interactive targets supports the 24 × 24 CSS px minimum target size (REQ-028 AC2, WCAG 2.2 SC 2.5.8). A smaller target needs enough space around it to meet the spacing exception in SC 2.5.8. See [Layout](layout.md).
- Spacing never carries meaning on its own.

## Responsive behavior

Spacing tokens do not change between viewports (ADR-0049). The same tokens apply at 360, 768, and 1280 px (A-09). At 360 px (ER-05), content reflows rather than losing its spacing.

## Email notes

Email templates use the resolved literals from `dist/email/email-tokens.json`, injected at build time with `$cn(space.base)` (REQ-013, §4.9). Email clients handle padding more reliably than margin; the email-safe spacing fallbacks are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/space.json` | The base unit and the seven steps above it, `stable` (ADR-0049). |
| `@vinsmokemau/cup-noobles-tokens`, `dist/css/tokens.css` | The CSS custom properties, such as `--cn-space-base` (REQ-017). |

```css
.example {
  padding: var(--cn-space-md);
}
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: BR-06 and BR-15, the spacing group, and TBD-09 (T4.5) — awaiting owner approval
- 0.1.0 — The spacing scale is the Rhythm of 8, set by the owner, and the placeholder for it is gone. The seven steps above the base are tokens — ADR-0049
- 0.1.0 — The scale is set, and the doc moves to stable — ADR-0049
