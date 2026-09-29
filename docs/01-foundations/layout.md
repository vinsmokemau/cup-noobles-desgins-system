---
title: Layout
slug: layout
layer: foundation
status: draft
lang: en
brandRules: [BR-15]
tokens: [breakpoint, layout]
tbd: [TBD-13]
related: [spacing, responsive-behavior, accessibility, typography]
since: 0.1.0
updated: 2026-09-28
---

# Layout

## Purpose

This doc defines how Cup Noobles pages are laid out: the breakpoints where a layout changes, the width of the content container, and the fixed rule that every layout works at 360 px wide (ER-05). It implements BR-15, the requirement that the system works on both mobile and web/dashboard layouts, and the documentation part of REQ-028. The breakpoints and container widths are not defined yet (TBD-13), so those tokens hold ADR-0006 placeholders that are not brand values.

## Tokens and specs

<!-- cn:generated tokens="breakpoint layout" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `breakpoint.lg` | `--cn-breakpoint-lg` | `64rem` | tbd (TBD-13) |
| `breakpoint.md` | `--cn-breakpoint-md` | `48rem` | tbd (TBD-13) |
| `breakpoint.sm` | `--cn-breakpoint-sm` | `40rem` | tbd (TBD-13) |
| `breakpoint.xl` | `--cn-breakpoint-xl` | `80rem` | tbd (TBD-13) |
| `breakpoint.xxl` | `--cn-breakpoint-xxl` | `96rem` | tbd (TBD-13) |
| `layout.container.max` | `--cn-layout-container-max` | `80rem` | tbd (TBD-13) |

<!-- /cn:generated -->

Every row above is `tbd`. The breakpoint rows hold the ADR-0006 placeholders taken from Tailwind's default breakpoints, and the container row holds the placeholder taken from Nuxt UI's `--ui-container`. **None of them is a brand value.** They exist only so the tokens build and the showcase renders.

The primitive `breakpoint.*` tokens hold the viewport widths. The semantic `layout.container.max` token gives the content container its role. Components and apps use the semantic tokens where one exists.

### Brand rules

> **BR-15:** The system is responsive and works on both mobile and web/dashboard layouts.

### Fixed widths

These widths come from the spec, not from TBD-13, and they do not change when TBD-13 is resolved.

| Width | Source | Role |
|---|---|---|
| 360 px | ER-05 | The minimum layout width. Every page and component works at 360 px wide. |
| 360, 768, and 1280 px | A-09 | The reference viewports for tests and for the showcase viewport toggle (REQ-055). |

The reference viewports are test widths, not breakpoints. Until TBD-13 is resolved, docs describe responsive behavior at 360, 768, and 1280 px (§4.2). After that, they describe it at each breakpoint token, and the tests keep running at the three reference viewports.

### Breakpoints and containers

| Token group | Source | Role |
|---|---|---|
| `breakpoint.sm` to `breakpoint.xxl` | BR-15, values TBD-13 | The viewport widths at which a layout may change. |
| `layout.container.max` | BR-15, value TBD-13 | The maximum width of the page's content container. |

How many breakpoints the system needs, and which layouts change at each, is part of TBD-13.

## Usage rules

### When to use

- Design and test every layout at 360 px wide first (ER-05), then at 768 and 1280 px (A-09).
- Use `breakpoint.*` tokens for every media query and `layout.container.*` tokens for container widths.
- Reference layout values only through `--cn-breakpoint-*` and `--cn-layout-*` variables or token imports. Never write a breakpoint or container width literally in a component, the showcase, or an app (REQ-016).
- Let content reflow into fewer columns as the viewport narrows.
- In a consuming app, build layouts with Tailwind layout utilities only, and do no visual styling (C-03, ER-02).

### When not to use

- Never let a page or component scroll horizontally at 360, 768, or 1280 px (REQ-028 AC1). Wide content, such as a table, scrolls inside its own container instead.
- Never make up a breakpoint or a container width. They are TBD-13, and only the owner can supply them.
- Never treat the ADR-0006 placeholders as brand values, and never copy them into another project.
- Never design for a width below 360 px as the minimum, and never raise the minimum above it.

## Do and don't

| Do | Don't |
|---|---|
| Stack cards in one column at 360 px. | Keep three columns at 360 px and let the page scroll sideways. |
| Put a wide table inside its own scrolling container. | Let a wide table push the whole page wider than the viewport. |
| Write a media query with a `breakpoint.*` token. | Write a media query with a pixel width typed into the component. |
| Keep every tap target at least 24 × 24 CSS px at 360 px. | Shrink buttons and links on mobile until they are hard to tap. |

## Accessibility

- The target is WCAG 2.2 level AA (A-10).
- **No horizontal overflow.** At 360, 768, and 1280 px wide, no page or component demo scrolls horizontally: `document.documentElement.scrollWidth <= innerWidth` (REQ-028 AC1). Playwright checks every component demo at the three reference viewports.
- **Target size.** Every interactive target is at least 24 × 24 CSS px (REQ-028 AC2, WCAG 2.2 SC 2.5.8). A Playwright bounding-box assertion checks it.
- **Reflow.** Content reflows at 320 CSS px wide without two-dimensional scrolling (WCAG SC 1.4.10). Designing for 360 px (ER-05) and avoiding fixed widths covers this.
- Layout order follows reading order, so the visual order matches the keyboard focus order.

## Responsive behavior

Before TBD-13 is resolved, every doc describes its responsive behavior at 360, 768, and 1280 px (§4.2, A-09). Once TBD-13 defines the breakpoints, docs describe behavior at each breakpoint token. How the common layouts adapt, such as navigation and grids, is covered in [Responsive behavior](../03-patterns/responsive-behavior.md).

## Email notes

Emails do not use these breakpoints. The email body is at most 600 px wide (A-08), and the showcase previews emails at 320 and 600 px (§4.6). The email layout rules are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/breakpoint.json` | The breakpoints, all `tbd` (TBD-13). |
| `tokens/semantic/layout.json` | The content container width, `layout.container.max`, `tbd` (TBD-13). |
| `@vinsmokemau/cup-noobles-tokens`, `dist/css/tokens.css` | The CSS custom properties, such as `--cn-layout-container-max` (REQ-017). |
| `packages/nuxt/assets/css/main.css` | Maps Nuxt UI's container width (`--ui-container`) to the `--cn-*` variables (§4.7, ADR-0001). |

```css
.example {
  max-width: var(--cn-layout-container-max);
}
```

CSS custom properties cannot be used inside a media query condition, so a media query uses the token's value from the token build, never a width typed by hand.

## Open items

> **TBD (TBD-13):** Breakpoints and container widths are not defined. The 360 px minimum is fixed by ER-05. `breakpoint.*` and `layout.container.max` hold ADR-0006 placeholders. Owner input needed: values.

## Changelog

- 0.1.0 — First draft: BR-15, the 360 px minimum (ER-05), the reference viewports (A-09), the REQ-028 overflow and target-size rules, the breakpoint and container groups, and TBD-13 (T4.5) — awaiting owner approval
