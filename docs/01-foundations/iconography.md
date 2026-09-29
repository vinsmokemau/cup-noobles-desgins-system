---
title: Iconography
slug: iconography
layer: foundation
status: draft
lang: en
brandRules: [BR-06, BR-13]
tbd: [TBD-19]
related: [icon, button, color, shape, accessibility, imagery-and-motifs]
since: 0.1.0
updated: 2026-09-28
---

# Iconography

## Purpose

This doc defines how Cup Noobles UI uses icons: the small functional glyphs inside buttons, inputs, alerts, and navigation. Icons follow the thick, clean, high-contrast line work of BR-13 and stay legible on black (BR-06). The icon set itself is not chosen yet (TBD-19, decision OD-09), so this doc sets the criteria the set must meet and the rules every icon follows, whichever set is chosen.

## Tokens and specs

Not applicable.

## Usage rules

### Brand rules

> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.
>
> **BR-06:** The UI is high-contrast, vibrant, and legible.

BR-13 covers "all UI", so it covers icons. The brand context names no icon set and no stroke width for icons.

### The icon set

The owner chooses the icon set (OD-09): "any Iconify collection with a stroke style consistent with BR-13, or custom icons". Until then, Nuxt UI components show the default icons that Nuxt UI ships with. Those defaults are **not a brand choice**, and they are replaced once TBD-19 is resolved.

A candidate set must meet every criterion below. The ADR that resolves TBD-19 records how the chosen set meets each one.

| # | Criterion | How to check it |
|---|---|---|
| 1 | **A stroke style consistent with BR-13**: thick, clean, and high-contrast. | Set the candidate icons next to a button outline and review them with the owner on the black page base. |
| 2 | **Renders through `UIcon`**: an Iconify collection, or custom SVGs served as a collection (OD-09, §4.10). No hand-rolled icon component (ER-01). | Render a sample in the showcase's Icon demo. |
| 3 | **A license that covers the published packages and the public showcase** (OD-02, OD-03). | Read the license text and record it in the ADR. |
| 4 | **Covers every icon that Nuxt UI components use**, the names set in `app.config.ts` under `ui.icons` (ADR-0001), such as close, chevrons, and loading. | List each `ui.icons` entry with its replacement in the ADR. |

### Icons and the brand assets

The circular "CN" icon (BR-16) is a logo asset, and the pink ramen cup (BR-14) is a decorative motif. Neither is a UI icon. They are rendered by `CnLogo` and by the motif components, as described in [Brand identity](../00-overview/brand-identity.md) and [Imagery and motifs](imagery-and-motifs.md).

### When to use

- Render every icon through `UIcon`, or through the `icon`, `leadingIcon`, and `trailingIcon` props of Nuxt UI components (see [Icon](../02-components/atoms/icon.md)).
- Use an icon to support a label: to make an action or a status faster to recognize.
- Give an icon its color through `--cn-color-*` variables or the Nuxt UI theme, never a literal (REQ-016).
- Use black (`color.text.inverted`) for an icon on a pink or yellow fill, the same as a label (SPEC.md §2.1).
- Let the component that holds an icon set its size. No icon size token exists; if one is needed, it is added with the owner's approval.

### When not to use

- Never pick or mix in an icon set before OD-09 is decided. Only the owner chooses it (TBD-19).
- Never make an icon the only way to convey meaning when a text label fits. An icon-only control is allowed only with an accessible name.
- Never use a white or yellow icon on a pink fill, or a white icon on a yellow fill. These are the forbidden pairs from SPEC.md §2.1.
- Never use the logo or a motif as a UI icon.
- Never redraw, recolor, or restyle an icon from the chosen set to make it look thicker. A set that does not meet BR-13 fails criterion 1.

## Do and don't

| Do | Don't |
|---|---|
| Pair a delete icon with a visible label. | Show a bare delete icon with no accessible name. |
| Use a black icon on a pink primary button. | Use a white icon on a pink primary button. |
| Keep every icon from the one approved set. | Mix icons from two sets because one has a glyph the other lacks. |
| Wait for OD-09 and keep Nuxt UI's defaults until then. | Choose a "close enough" icon set without the owner. |

## Accessibility

- The target is WCAG 2.2 level AA (A-10).
- **Decorative icons.** An icon next to a visible label repeats the label, so it is hidden from assistive technology with `aria-hidden="true"`.
- **Meaningful icons.** An icon-only control, such as a close button, has an accessible name through `aria-label` or visually hidden text. The name arrives through a prop, never hardcoded (A-11).
- **Contrast.** An icon that carries meaning is a UI graphic, so it needs at least 3:1 against its background (WCAG SC 1.4.11, REQ-015 `ui` usage). Pink (8.37:1) and yellow (18.55:1) pass on black. A new icon color and background combination is declared in `tokens/contrast-pairs.json` so `check-contrast` verifies it.
- **Not color alone.** An icon that marks a state, such as an error, is paired with text, and the state never depends on the icon's color alone.
- **Target size.** An icon-only control is at least 24 × 24 CSS px (REQ-028 AC2), even when the glyph is smaller.
- The full rules are in [Accessibility](accessibility.md).

## Responsive behavior

Icons do not change between viewports. The same rules apply at 360, 768, and 1280 px (A-09), and at every breakpoint once TBD-13 is resolved. Icon-only controls keep their 24 × 24 CSS px minimum target at 360 px (ER-05).

## Email notes

The email components (REQ-041 AC3) include no icons. If an email needs one, it is an image with alt text, not an inline SVG or an icon font, because many email clients do not render those. Images-off behavior is defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `UIcon` (Nuxt UI) | Renders an icon by name. Documented in [Icon](../02-components/atoms/icon.md) (T7.3). |
| `packages/nuxt/app.config.ts`, `ui.icons` | The icon names that Nuxt UI components use (ADR-0001). They are set once TBD-19 is resolved. |

```vue
<!-- Decorative: the button's label names the action. The icon name depends on TBD-19. -->
<UButton :label="label" :leading-icon="icon" />

<!-- Icon-only: the accessible name arrives through a prop (A-11). -->
<UButton :icon="icon" :aria-label="label" />
```

## Open items

> **TBD (TBD-19):** The icon set is not chosen: the library, its stroke style consistent with BR-13, and its license. Nuxt UI's default icons are used until then and are not a brand choice. Owner input needed: decision OD-09.

## Changelog

- 0.1.0 — First draft: BR-13 and BR-06, the icon set selection criteria, the icon usage and accessibility rules, and TBD-19 (T4.6) — awaiting owner approval
