---
title: Shape
slug: shape
layer: foundation
status: draft
lang: en
brandRules: [BR-10, BR-13]
tokens: [radius, border]
tbd: []
related: [effects, color, button, card]
since: 0.1.0
updated: 2026-10-19
---

# Shape

## Purpose

This doc defines the shape of Cup Noobles UI: rounded corners and thick, high-contrast line work. It implements the shape part of BR-10 (rounded corners and a thick outline stroke) and BR-13 (thick, clean line work). The stroke width is 3 px (ADR-0032). The radius is Chunky (ADR-0050): 8, 12, and 20 px.

## Tokens and specs

<!-- cn:generated tokens="radius border" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.alert` | `--cn-border-width-alert` | `3px` | stable |
| `border.width.badge` | `--cn-border-width-badge` | `3px` | stable |
| `border.width.button` | `--cn-border-width-button` | `3px` | stable |
| `border.width.card` | `--cn-border-width-card` | `3px` | stable |
| `border.width.choice` | `--cn-border-width-choice` | `3px` | stable |
| `border.width.default` | `--cn-border-width-default` | `3px` | stable |
| `border.width.input` | `--cn-border-width-input` | `3px` | stable |
| `border.width.interactive` | `--cn-border-width-interactive` | `3px` | stable |
| `border.width.mediaCard` | `--cn-border-width-media-card` | `3px` | stable |
| `border.width.overlay` | `--cn-border-width-overlay` | `3px` | stable |
| `border.width.pagination` | `--cn-border-width-pagination` | `3px` | stable |
| `border.width.progress` | `--cn-border-width-progress` | `3px` | stable |
| `border.width.separator` | `--cn-border-width-separator` | `3px` | stable |
| `border.width.siteFooter` | `--cn-border-width-site-footer` | `3px` | stable |
| `border.width.siteHeader` | `--cn-border-width-site-header` | `3px` | stable |
| `border.width.skeleton` | `--cn-border-width-skeleton` | `3px` | stable |
| `border.width.tabs` | `--cn-border-width-tabs` | `3px` | stable |
| `border.width.toast` | `--cn-border-width-toast` | `3px` | stable |
| `border.width.tooltip` | `--cn-border-width-tooltip` | `3px` | stable |
| `radius.alert` | `--cn-radius-alert` | `0.75rem` | stable |
| `radius.badge` | `--cn-radius-badge` | `0.5rem` | stable |
| `radius.button` | `--cn-radius-button` | `0.75rem` | stable |
| `radius.card` | `--cn-radius-card` | `1.25rem` | stable |
| `radius.choice` | `--cn-radius-choice` | `0.5rem` | stable |
| `radius.compact` | `--cn-radius-compact` | `0.5rem` | stable |
| `radius.container` | `--cn-radius-container` | `1.25rem` | stable |
| `radius.input` | `--cn-radius-input` | `0.75rem` | stable |
| `radius.interactive` | `--cn-radius-interactive` | `0.75rem` | stable |
| `radius.lg` | `--cn-radius-lg` | `1.25rem` | stable |
| `radius.md` | `--cn-radius-md` | `0.75rem` | stable |
| `radius.mediaCard` | `--cn-radius-media-card` | `1.25rem` | stable |
| `radius.overlay` | `--cn-radius-overlay` | `1.25rem` | stable |
| `radius.pagination` | `--cn-radius-pagination` | `0.75rem` | stable |
| `radius.skeleton` | `--cn-radius-skeleton` | `0.75rem` | stable |
| `radius.sm` | `--cn-radius-sm` | `0.5rem` | stable |
| `radius.toast` | `--cn-radius-toast` | `0.75rem` | stable |
| `radius.tooltip` | `--cn-radius-tooltip` | `0.5rem` | stable |

<!-- /cn:generated -->

The radius rows are `stable`: BR-10 asks for "rounded" corners, and the owner chose the Chunky radius (ADR-0050). The stroke-width row is `stable` too: BR-13 asks for "thick" lines, and the owner chose 3 px (ADR-0032).

The component tokens that apply shape to a component are added by that component's task. The button's are `radius.button` and `border.width.button` (REQ-023 AC2, see [Button](../02-components/atoms/button.md)).

### Brand rules

> **BR-10:** Buttons have rounded corners, a subtle neon glow, and a thick outline stroke.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The glow in BR-10 is covered in [Effects](effects.md).

### Radius

| Token group | Source | Role |
|---|---|---|
| `radius.sm` | BR-10, ADR-0050 | 0.5rem (8 px): badges, checkboxes, and tooltips. |
| `radius.md` | BR-10, ADR-0050 | 0.75rem (12 px): buttons, text fields, pagination, alerts, and toasts. |
| `radius.lg` | BR-10, ADR-0050 | 1.25rem (20 px): cards, media cards, and overlay panels. |

The three steps are the whole scale. There is no fully round step, so a component never takes a pill shape from a radius token. A radio is round and a switch is pill-shaped by their own shape, not by a radius.

Components read a step through a role in the semantic tier (REQ-010 AC2): `radius.compact` is `radius.sm`, `radius.interactive` is `radius.md`, and `radius.container` is `radius.lg`. The owner chose the radius of the button, badge, input, checkbox, card, media card, and alert (ADR-0050). The overlay, pagination, skeleton, toast, tooltip, and the interactive role were left to the task that applied the decision (T13.3), which gave each the step of the closest component the owner chose.

A badge with an 8 px radius looks nearly round when it is short, so badges keep a minimum height (ADR-0050).

### Stroke width

| Token group | Source | Role |
|---|---|---|
| `border.width.default` | BR-10 and BR-13, value ADR-0032 | The outline stroke of buttons and the line work of the UI. |

BR-13 applies to "all UI and illustration", so every outline, divider, and illustrated line uses a stroke-width token. Cards and overlays are set apart from the pure-black page by this outline, not by a fill (C-05, ADR-0053, see [Color](color.md)).

## Usage rules

### When to use

- Use `radius.*` tokens for every rounded corner, and `border.width.*` tokens for every outline, divider, and line.
- Give every button rounded corners and a thick outline stroke (BR-10).
- Keep line work thick, clean, and high-contrast everywhere, including illustration (BR-13).
- Set a card apart from the page with an outline while C-05 is open.
- Reference shape only through `--cn-radius-*` and `--cn-border-*` variables or token imports. Never write a radius or width literally in a component, the showcase, or an app (REQ-016).

### When not to use

- Never make up a radius or a stroke width. The stroke width is in ADR-0032. The radius is in ADR-0050. A new component takes one of the three steps and never adds a fourth.
- Never draw hairline or low-contrast lines; they contradict BR-13.

## Do and don't

| Do | Don't |
|---|---|
| Draw a button outline with `border.width.*`. | Draw a button outline with a width typed into the component. |
| Round a button's corners with `radius.*`. | Pick a "rounder" radius by eye because the placeholder looks too square. |
| Separate a card from the page with a thick outline. | Separate a card with a thin, low-contrast line. |

## Accessibility

- Outlines that identify a component, such as a button or input boundary, are UI components under WCAG 1.4.11 and need 3:1 contrast against adjacent colors (REQ-015 AC2). Their colors are in [Color](color.md).
- An outline never replaces the focus indicator. Focus has its own `focus.*` tokens (REQ-024); see [Effects](effects.md).
- Shape is never the only signal of a state. A state change also changes text, an icon, or color.

## Responsive behavior

Radius and stroke width do not change between viewports. The same tokens apply at 360, 768, and 1280 px (A-09), and at every breakpoint once TBD-13 is resolved. Lines stay thick at 360 px (ER-05).

## Email notes

Email templates use the resolved literals from `dist/email/email-tokens.json`, injected at build time with `$cn(radius.md)` (REQ-013, §4.9). MJML fills an unset radius with its own default, so every radius and border in an email component comes from a token (ADR-0004). Outlook's radius support is limited (R-05); the fallbacks are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/radius.json` | The three radius steps, `stable` (ADR-0050). |
| `tokens/primitive/border.json` | The stroke width, `stable` (ADR-0032). |
| `@vinsmokemau/cup-noobles-tokens`, `dist/css/tokens.css` | The CSS custom properties, such as `--cn-radius-md` (REQ-017). |
| `packages/nuxt/assets/css/main.css` | Maps Nuxt UI's base radius (`--ui-radius`) to the `--cn-*` variables (§4.7, ADR-0001). |

```css
.example {
  border-radius: var(--cn-radius-md);
  border-width: var(--cn-border-width-default);
}
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: BR-10 and BR-13, the radius and stroke-width groups, and TBD-10 and TBD-11 (T4.4) — awaiting owner approval
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
- 0.1.0 — The radius is Chunky, set by the owner, and the placeholders for it are gone. The remaining radius tokens take a step — ADR-0050
