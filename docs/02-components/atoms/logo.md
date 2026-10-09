---
title: Logo
slug: logo
layer: component
level: atom
source: custom
component: CnLogo
status: draft
lang: en
brandRules: [BR-13, BR-16]
tokens: [logo, border.width.logo]
demos: [states, playground]
tbd: [TBD-05, TBD-11, TBD-17]
related: [brand-identity, sparkle, sticker-frame, imagery-and-motifs, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Logo

## Purpose

`CnLogo` shows one of the three brand assets: the circular "CN" icon, the vertical "Cup Noobles" lockup, or the horizontal "Cup Noobles" wordmark (BR-16, REQ-030). The asset files have not been supplied (TBD-17), so every variant renders a neutral placeholder that shows the text "Logo asset pending (TBD-17)". The component draws no logo, and it contains no artwork of any kind. Once the owner supplies the SVG files, `CnLogo` renders them unmodified and applies the clear-space and minimum-size rules from [Brand identity](../../00-overview/brand-identity.md) (REQ-030 AC3).

**Why custom:** Nuxt UI has no equivalent. It ships no brand-asset component, and the logo files are the owner's artwork (BR-16), not something a Nuxt UI component can supply. `CnLogo` composes no Nuxt UI component, and it holds no behavior: it is one element that names or hides one asset.

## Anatomy

1. **container**: the outlined box that stands in for the asset. Later, the SVG takes its place.
2. **placeholder note**: the text "Logo asset pending (TBD-17)". It is hidden from assistive technology, because the accessible name comes from `label`.

## Tokens and specs

<!-- cn:generated tokens="logo border.width.logo" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.logo` | `--cn-border-width-logo` | `1px` | tbd (TBD-11) |
| `logo.placeholder.bg` | `--cn-logo-placeholder-bg` | `#000000` | stable |
| `logo.placeholder.border` | `--cn-logo-placeholder-border` | `#90a1b9` | tbd (TBD-05, TBD-17) |
| `logo.placeholder.fg` | `--cn-logo-placeholder-fg` | `#90a1b9` | tbd (TBD-05, TBD-17) |

<!-- /cn:generated -->

The placeholder reads existing semantic tokens only: the black page (BR-03), the neutral outline and note color (TBD-05, a placeholder, not a brand value), and the placeholder stroke width (TBD-11). It has no fixed size and no corner radius, because the size and the shape of each asset belong to the missing files (TBD-17). It is not a design decision: it is a stand-in that keeps every page layout testable until the files arrive.

Contrast pairs declared for the placeholder (REQ-015):

<!-- cn:generated tokens="logo" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `logo.placeholder.fg` (`#90a1b9`) | `logo.placeholder.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.muted`, `logo.placeholder.fg`, `placeholder.color.neutral`) |
| `logo.placeholder.border` (`#90a1b9`) | `logo.placeholder.bg` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.border.default`, `logo.placeholder.border`, `placeholder.color.neutral`) |

<!-- /cn:generated -->

### Brand rules

> **BR-16:** The brand assets are a circular "CN" icon, a vertical "Cup Noobles" lockup, and a horizontal "Cup Noobles" wordmark. The asset files have not been supplied yet (TBD-17).
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

## Variants

| Variant (REQ-030 AC1) | Brand asset (BR-16) | Rendered today |
|---|---|---|
| `icon` | The circular "CN" icon | The placeholder |
| `vertical` | The vertical "Cup Noobles" lockup | The placeholder |
| `horizontal` | The horizontal "Cup Noobles" wordmark | The placeholder |

The three placeholders look the same. Their shapes and proportions are part of the missing files, so the component does not guess them. The variant is exposed as `data-variant`, which the SVG rules use later.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The only state. A logo is not interactive: it has no hover, focus, active, or disabled state. | `logo.placeholder.bg`, `logo.placeholder.border`, `logo.placeholder.fg`, `border.width.logo` |

A logo that links to the home page is a [Link](link.md) that contains a `CnLogo`. The link carries the focus ring and the name, and the logo is `decorative`.

## Usage rules

### When to use

- Use `CnLogo` wherever the brand must be identified, such as the site header.
- Pass `label` with the brand name when the logo is the only thing that names the brand. The label is required (REQ-030 AC1).
- Set `decorative` when the brand name is written next to the logo, or when a link already names it. A decorative logo has no label.
- Use `icon` where space is short, `horizontal` in wide bars, and `vertical` where height is free.

### When not to use

- Never draw, recreate, recolor, or approximate a logo. Until the files arrive, the placeholder is the only allowed rendering (REQ-030 AC2).
- Never put the text "Logo asset pending (TBD-17)" in a page by hand. It belongs to the component.
- Never edit a supplied asset file. `CnLogo` renders the SVGs unmodified (REQ-030 AC3).
- Never use a logo to carry an action or a status.

## Do and don't

| Do | Don't |
|---|---|
| Give a standalone logo a label: "Cup Noobles". | Leave a standalone logo without a label or `decorative`. |
| Mark the logo `decorative` when the name is written next to it. | Label a logo that repeats its neighbor, so a screen reader says the name twice. |
| Wrap the logo in a link and name the link. | Add a click handler to the logo itself. |
| Keep the placeholder until the files arrive. | Replace it with a hand-made logo. |

## Accessibility

- A named logo is `role="img"` with `aria-label` set from `label`. The label is required unless the logo is `decorative` (REQ-030 AC1). In development, the component warns when neither is set.
- A `decorative` logo is `aria-hidden="true"` and has no role or label, so assistive technology skips it (REQ-029 applies the same rule to motifs).
- The placeholder note is `aria-hidden="true"`, so it is never read in place of the brand name.
- The logo has no focusable element and no keyboard interaction. It is not interactive, and it adds no tab stop.
- The note is 7.98:1 against the black page with the placeholder grey, unverified while TBD-05 is open (REQ-015 AC4). A real logo is exempt from contrast rules (WCAG 1.4.3).

Keyboard map: none. A logo takes no key.

ARIA: `role="img"` and `aria-label` on a named logo; `aria-hidden="true"` on a decorative one.

## Content

- Write the label as the brand name, plus the variant only when it helps: "Cup Noobles".
- Do not write "logo", "image", or "icon" in the label. The `img` role already says it.
- Keep the label short. It is read once, wherever the logo appears.

```copy es-MX
Cup Noobles
Cup Noobles, inicio
```

```copy-bad es-MX
Logo de Cup Noobles
Imagen
```

## Responsive behavior

The placeholder has no fixed size, so it never overflows: it is at most as wide as its container, and its note wraps. At 360, 768, and 1280 px it behaves the same (A-09, ER-05). The sizes of the real assets, and their minimum sizes, wait for the owner's rules (TBD-17).

## Email notes

The email header uses its own logo image, set by the [email components](../../05-email/email-components.md). `CnLogo` is not used in email, and the same asset files apply there once supplied (TBD-17).

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnLogo` (`packages/nuxt/components/CnLogo.vue`) |
| Theme | The `.cn-logo*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `logo.placeholder.*`, `border.width.logo` |
| Demos | `apps/showcase/demos/logo/` |

| Prop | Type | Notes |
|---|---|---|
| `variant` | `"icon" \| "vertical" \| "horizontal"` | Required. Picks the brand asset. |
| `label` | `string` | The accessible label. Required unless `decorative`. |
| `decorative` | `boolean` | Hides the logo from assistive technology. |

The component has no slots and no events.

```vue
<CnLogo variant="horizontal" label="Cup Noobles" />
<CnLogo variant="icon" decorative />
```

## Open items

> **TBD (TBD-17):** The logo files (the CN icon, the vertical lockup, and the horizontal wordmark) as SVG, and their clear-space and minimum-size rules, are not supplied. The component shows the placeholder "Logo asset pending (TBD-17)". Owner input needed: decision OD-08. The doc cannot become `stable` before it.
>
> **TBD (TBD-05):** The neutral scale is not defined. The placeholder outline and note follow a placeholder grey. Owner input needed.
>
> **TBD (TBD-11):** The stroke width is not defined ("thick" in BR-13). `border.width.logo` follows a placeholder. Owner input needed.
>
> **Draft:** The look of the placeholder (an outlined box with a neutral note, no size) is not defined by BC. It reuses the neutral outline of the other atoms and is dropped when the SVGs arrive. This awaits owner approval.

## Changelog

- 0.1.0 — First draft: `CnLogo` with the three variants as placeholders, the required label or `decorative`, the component tokens, and the demos (T7.7) — awaiting owner approval and the logo files (OD-08)
