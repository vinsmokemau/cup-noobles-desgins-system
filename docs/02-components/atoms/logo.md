---
title: Logo
slug: logo
layer: component
level: atom
source: custom
component: CnLogo
status: stable
lang: en
brandRules: [BR-16]
tokens: [logo]
demos: [states, playground]
tbd: []
related: [brand-identity, sparkle, sticker-frame, imagery-and-motifs, accessibility]
since: 0.1.0
updated: 2026-10-09
---

# Logo

## Purpose

`CnLogo` shows one of the three brand assets: the circular "CN" icon, the vertical "Cup Noobles" lockup, or the horizontal "Cup Noobles" wordmark (BR-16, REQ-030). It renders the SVG files the owner supplied, unmodified, and applies the clear-space and minimum-size rules of [Brand identity](../../00-overview/brand-identity.md) (REQ-030 AC3). The files and the rules are recorded in ADR-0016.

**Why custom:** Nuxt UI has no equivalent. It ships no brand-asset component, and the logo files are the owner's artwork (BR-16), not something a Nuxt UI component can supply. `CnLogo` composes no Nuxt UI component, and it holds no behavior: it is one image that names or hides one asset.

## Anatomy

1. **container**: the box that holds the clear space around the image.
2. **image**: the supplied SVG, shown as an image file. It is cropped tight to the artwork, so the edge of the image is the edge of the logo.

## Tokens and specs

<!-- cn:generated tokens="logo" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `logo.clearSpace` | `--cn-logo-clear-space` | `0.25` | stable |
| `logo.minHeight.horizontal` | `--cn-logo-min-height-horizontal` | `36px` | stable |
| `logo.minHeight.icon` | `--cn-logo-min-height-icon` | `64px` | stable |
| `logo.minHeight.vertical` | `--cn-logo-min-height-vertical` | `80px` | stable |
| `logo.rule.clearSpace` | `--cn-logo-rule-clear-space` | `0.25` | stable |
| `logo.rule.minHeight.horizontal` | `--cn-logo-rule-min-height-horizontal` | `36px` | stable |
| `logo.rule.minHeight.icon` | `--cn-logo-rule-min-height-icon` | `64px` | stable |
| `logo.rule.minHeight.vertical` | `--cn-logo-rule-min-height-vertical` | `80px` | stable |

<!-- /cn:generated -->

The clear space is a share of the logo's own height, so it scales with the logo. The three minimum heights are the smallest size at which each logo's lettering stays legible: about 10 px tall in each file. The values were chosen by the owner (ADR-0016). The logos are brand artwork, so no contrast pair is declared for them (REQ-015 does not apply to a logo, WCAG 1.4.3).

### Brand rules

> **BR-16:** The brand assets are a circular "CN" icon, a vertical "Cup Noobles" lockup, and a horizontal "Cup Noobles" wordmark. The asset files have not been supplied yet (TBD-17).

The files are now supplied and recorded in ADR-0016, which resolved TBD-17. The sentence above is quoted from the brand source and is not edited (REQ-006).

## Variants

| Variant (REQ-030 AC1) | Brand asset (BR-16) | File | Minimum height |
|---|---|---|---|
| `icon` | The circular "CN" icon | `Icon-CN.svg` | `logo.minHeight.icon` |
| `vertical` | The vertical "Cup Noobles" lockup | `LogoVertical-CN.svg` | `logo.minHeight.vertical` |
| `horizontal` | The horizontal "Cup Noobles" wordmark | `LogoHorizontal-CN.svg` | `logo.minHeight.horizontal` |

The files live in `packages/nuxt/assets/brand/`. Each shows at its minimum height by default. A page makes a logo larger by setting the `--logo-height` custom property on it, and the component never lets it go below the minimum.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The only state. A logo is not interactive: it has no hover, focus, active, or disabled state. | `logo.clearSpace`, `logo.minHeight.icon`, `logo.minHeight.vertical`, `logo.minHeight.horizontal` |

A logo that links to the home page is a [Link](link.md) that contains a `CnLogo`. The link carries the focus ring and the name, and the logo is `decorative`.

## Usage rules

### When to use

- Use `CnLogo` wherever the brand must be identified, such as the site header.
- Pass `label` with the brand name when the logo is the only thing that names the brand. The label is required (REQ-030 AC1).
- Set `decorative` when the brand name is written next to the logo, or when a link already names it. A decorative logo has no label.
- Use `icon` where space is short, `horizontal` in wide bars, and `vertical` where height is free.
- Keep the clear space around every logo: 25% of its height on every side. Nothing else, such as text, a button, or the edge of a photo, enters it.

### When not to use

- Never draw, recreate, recolor, crop, stretch, or approximate a logo. `CnLogo` renders the supplied files unmodified (REQ-030 AC3).
- Never show a logo below its minimum height: 64 px for the icon, 80 px for the vertical lockup, 36 px for the horizontal wordmark.
- Never put a logo on a light or colored background. The files are made for the pure-black page (BR-03).
- Never use a logo to carry an action or a status.

## Do and don't

| Do | Don't |
|---|---|
| Give a standalone logo a label: "Cup Noobles". | Leave a standalone logo without a label or `decorative`. |
| Mark the logo `decorative` when the name is written next to it. | Label a logo that repeats its neighbor, so a screen reader says the name twice. |
| Wrap the logo in a link and name the link. | Add a click handler to the logo itself. |
| Make the logo larger with `--logo-height`. | Squeeze the logo under its minimum height with a utility class. |

## Accessibility

- A named logo is an `<img>` whose `alt` is `label`. The label is required unless the logo is `decorative` (REQ-030 AC1). In development, the component warns when neither is set.
- A `decorative` logo has an empty `alt` and `aria-hidden="true"`, so assistive technology skips it (REQ-029 applies the same rule to motifs).
- The logo has no focusable element and no keyboard interaction. It is not interactive, and it adds no tab stop.
- The SVG files are shown as images, so their inner shapes are not exposed to assistive technology.

Keyboard map: none. A logo takes no key.

ARIA: `alt` on a named logo; `alt=""` and `aria-hidden="true"` on a decorative one.

## Content

- Write the label as the brand name, plus the variant only when it helps: "Cup Noobles".
- Do not write "logo", "image", or "icon" in the label. The image role already says it.
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

At 360, 768, and 1280 px the logo keeps its proportions (A-09, ER-05). It is never wider than its container, and it keeps its minimum height. The smallest case is the horizontal wordmark at 36 px tall, which is narrow enough for a 360 px header. Make a logo larger for wide screens with `--logo-height`.

## Email notes

The email header uses its own logo image, set by the [email components](../../05-email/email-components.md). `CnLogo` is not used in email, and the same asset files apply there.

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnLogo` (`packages/nuxt/components/CnLogo.vue`) |
| Assets | `packages/nuxt/assets/brand/` |
| Theme | The `.cn-logo*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `logo.clearSpace`, `logo.minHeight.*` |
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

Not applicable.

## Changelog

- 0.1.0 — First draft: `CnLogo` with the three variants as placeholders, the required label or `decorative`, the component tokens, and the demos (T7.7) — awaiting owner approval and the logo files (OD-08)
- 0.1.0 — The supplied SVG files replace the placeholder, with a clear space of 25% of the logo height and minimum heights of 64, 80, and 36 px; the doc is `stable` (T7.9) — ADR-0016
