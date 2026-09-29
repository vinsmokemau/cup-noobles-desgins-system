---
title: Spacing
slug: spacing
layer: foundation
status: draft
lang: en
brandRules: [BR-06, BR-15]
tokens: [space]
tbd: [TBD-09]
related: [layout, typography, shape, responsive-behavior]
since: 0.1.0
updated: 2026-09-28
---

# Spacing

## Purpose

This doc defines how space is measured in Cup Noobles UI: one base unit, and a scale of steps built from it, used for every padding, gap, and margin. Consistent spacing keeps the UI legible (BR-06) and lets the same components work on mobile and web/dashboard layouts (BR-15). The base unit and the scale are not defined yet (TBD-09), so the spacing token holds an ADR-0006 placeholder that is not a brand value.

## Tokens and specs

<!-- cn:generated tokens="space" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `space.base` | `--cn-space-base` | `0.25rem` | tbd (TBD-09) |

<!-- /cn:generated -->

The row above is `tbd`. It holds the ADR-0006 placeholder taken from Tailwind's `--spacing`, the base unit of every Nuxt UI padding and gap class. **It is not a brand value.** It exists only so the tokens build and the showcase renders stock Nuxt UI spacing.

Only the base unit exists as a token today. The steps of the scale, such as small, medium, and large gaps, are part of TBD-09 and are added when the owner supplies them. The component tokens that apply spacing to a component, such as a button's padding, are added by that component's task.

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

- Never make up a base unit or a scale step. They are TBD-09, and only the owner can supply them.
- Never treat the ADR-0006 placeholder as a brand value, and never copy it into another project.
- Never remove spacing to make content fit at 360 px. Let the layout reflow instead (see [Layout](layout.md)).

## Do and don't

| Do | Don't |
|---|---|
| Set the gap between two cards with a `space.*` token. | Type a pixel gap into the component. |
| Wait for TBD-09 before adding a spacing step. | Add a "slightly bigger" step by eye because the placeholder feels tight. |
| Keep the same spacing tokens at every viewport. | Shrink padding at 360 px until the text touches the outline. |

## Accessibility

- Text spacing must hold up under the user overrides in WCAG 2.2 SC 1.4.12 (line height, paragraph, letter, and word spacing) without clipping or overlapping content. Components use spacing tokens with flexible containers, never fixed heights for text.
- Spacing between interactive targets supports the 24 × 24 CSS px minimum target size (REQ-028 AC2, WCAG 2.2 SC 2.5.8). A smaller target needs enough space around it to meet the spacing exception in SC 2.5.8. See [Layout](layout.md).
- Spacing never carries meaning on its own.

## Responsive behavior

Spacing tokens do not change between viewports until TBD-09 and TBD-13 define whether the scale varies by breakpoint. The same tokens apply at 360, 768, and 1280 px (A-09). At 360 px (ER-05), content reflows rather than losing its spacing.

## Email notes

Email templates use the resolved literals from `dist/email/email-tokens.json`, injected at build time with `$cn(space.base)` (REQ-013, §4.9). Email clients handle padding more reliably than margin; the email-safe spacing fallbacks are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/space.json` | The base unit, `tbd` (TBD-09). |
| `tokens/primitive/_placeholder.json` | `placeholder.space.base`, recorded in ADR-0006. |
| `@vinsmokemau/cup-noobles-tokens`, `dist/css/tokens.css` | The CSS custom properties, such as `--cn-space-base` (REQ-017). |

```css
.example {
  padding: var(--cn-space-base);
}
```

## Open items

> **TBD (TBD-09):** The spacing base unit and scale are not defined. `space.base` holds the ADR-0006 placeholder. Owner input needed: the base unit, and the steps of the scale.

## Changelog

- 0.1.0 — First draft: BR-06 and BR-15, the spacing group, and TBD-09 (T4.5) — awaiting owner approval
