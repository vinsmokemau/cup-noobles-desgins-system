---
title: Accessibility
slug: accessibility
layer: foundation
status: draft
lang: en
brandRules: [BR-03, BR-06]
tokens: [focus, color]
tbd: [TBD-04, TBD-05, TBD-06, TBD-07]
related: [color, effects, layout, motion, iconography, imagery-and-motifs]
since: 0.1.0
updated: 2026-10-08
---

# Accessibility

## Purpose

This doc states the accessibility target of the Cup Noobles Design System, WCAG 2.2 level AA (A-10), and how the system meets it: contrast, focus, target size, reduced motion, and the automated axe gate. It supports BR-06 ("high-contrast, vibrant, and legible") and gathers in one place the rules that the foundation and component docs apply. It is the documentation part of REQ-027 and REQ-029.

## Tokens and specs

<!-- cn:generated tokens="focus" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `focus.offset.default` | `--cn-focus-offset-default` | `3px` | stable |
| `focus.ring.color` | `--cn-focus-ring-color` | `#fff488` | stable |
| `focus.ring.offset` | `--cn-focus-ring-offset` | `3px` | stable |
| `focus.ring.style` | `--cn-focus-ring-style` | `solid` | stable |
| `focus.ring.width` | `--cn-focus-ring-width` | `3px` | stable |
| `focus.style.default` | `--cn-focus-style-default` | `solid` | stable |
| `focus.width.default` | `--cn-focus-width-default` | `3px` | stable |

<!-- /cn:generated -->

The focus tokens are `stable` (ADR-0009). The contrast pairs declared for every color token, and the forbidden combinations, are generated below. It is the same report `check-contrast` prints (REQ-015).

<!-- cn:generated tokens="color focus" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `color.text.default` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.default`, `placeholder.color.neutral`) |
| `color.text.muted` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.text.muted`, `placeholder.color.neutral`) |
| `color.brand.primary` (`#ef80ae`) | `color.bg.base` (`#000000`) | text | 8.37:1 | 4.50:1 | pass |
| `color.brand.primary` (`#ef80ae`) | `color.bg.base` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `color.brand.secondary` (`#fff488`) | `color.bg.base` (`#000000`) | text | 18.55:1 | 4.50:1 | pass |
| `color.brand.secondary` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `color.text.inverted` (`#000000`) | `color.brand.primary` (`#ef80ae`) | text | 8.37:1 | 4.50:1 | pass |
| `color.text.inverted` (`#000000`) | `color.brand.secondary` (`#fff488`) | text | 18.55:1 | 4.50:1 | pass |
| `color.border.default` (`#90a1b9`) | `color.bg.base` (`#000000`) | ui | 7.98:1 | 3.00:1 | unverified (tbd: `color.border.default`, `placeholder.color.neutral`) |
| `color.text.default` (`#90a1b9`) | `color.surface.card` (`#90a1b9`) | text | 1.00:1 | 4.50:1 | unverified (tbd: `color.surface.card`, `color.text.default`, `placeholder.color.neutral`) |
| `color.text.muted` (`#90a1b9`) | `color.surface.card` (`#90a1b9`) | text | 1.00:1 | 4.50:1 | unverified (tbd: `color.surface.card`, `color.text.muted`, `placeholder.color.neutral`) |
| `color.brand.primary` (`#ef80ae`) | `color.surface.card` (`#90a1b9`) | ui | 1.05:1 | 3.00:1 | unverified (tbd: `color.surface.card`, `placeholder.color.neutral`) |
| `color.text.default` (`#90a1b9`) | `color.surface.elevated` (`#90a1b9`) | text | 1.00:1 | 4.50:1 | unverified (tbd: `color.surface.elevated`, `color.text.default`, `placeholder.color.neutral`) |
| `color.text.muted` (`#90a1b9`) | `color.surface.elevated` (`#90a1b9`) | text | 1.00:1 | 4.50:1 | unverified (tbd: `color.surface.elevated`, `color.text.muted`, `placeholder.color.neutral`) |
| `color.feedback.success` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.feedback.success`, `placeholder.color.neutral`) |
| `color.feedback.warning` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.feedback.warning`, `placeholder.color.neutral`) |
| `color.feedback.error` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.feedback.error`, `placeholder.color.neutral`) |
| `color.feedback.info` (`#90a1b9`) | `color.bg.base` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `color.feedback.info`, `placeholder.color.neutral`) |
| `focus.ring.color` (`#fff488`) | `color.bg.base` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |
| `focus.ring.color` (`#fff488`) | `color.surface.card` (`#90a1b9`) | ui | 2.32:1 | 3.00:1 | unverified (tbd: `color.surface.card`, `placeholder.color.neutral`) |
| `#ffffff` | `color.brand.pink` (`#ef80ae`) | — | 2.51:1 | — | forbidden |
| `color.brand.yellow` (`#fff488`) | `color.brand.pink` (`#ef80ae`) | — | 2.22:1 | — | forbidden |
| `color.brand.pink` (`#ef80ae`) | `color.brand.yellow` (`#fff488`) | — | 2.22:1 | — | forbidden |
| `#ffffff` | `color.brand.yellow` (`#fff488`) | — | 1.13:1 | — | forbidden |

<!-- /cn:generated -->

A pair that involves a `tbd` token is `unverified`, never `pass`, until the owner supplies the real value (REQ-015 AC4). The ratios of `unverified` pairs come from the ADR-0006 placeholder, which is **not a brand value**.

## Usage rules

### Brand rules

> **BR-06:** The UI is high-contrast, vibrant, and legible.

BR-03 makes pure black the base and background, so every contrast ratio for page content is measured against black. The black itself is in [Color](color.md).

### The target

The target is WCAG 2.2 level AA (A-10), for every component, pattern, showcase route, and consuming app built from the system. The theme is dark-only (A-02), so every rule is checked on the pure-black base (BR-03).

### The rules

| Area | Rule | Source | How it is checked |
|---|---|---|---|
| Contrast | Text reaches 4.5:1, large text 3:1, and UI components and graphics 3:1 against their background. | REQ-015 AC2 | `check-contrast` in `pnpm test`, over every pair in `tokens/contrast-pairs.json`. |
| Forbidden pairs | White on pink (2.51:1), yellow on pink in either direction (2.22:1), and white on yellow (1.13:1) are never used as text, and yellow and pink are never the only boundary between two UI regions. Labels on a pink fill are black. | SPEC.md §2.1, REQ-015 AC3 | `check-contrast` fails if a component token combines them. |
| Color alone | Color is never the only signal. A state such as error or selected also changes text, an icon, or a shape. | WCAG SC 1.4.1 | Reviewed in each component's state matrix (REQ-026). |
| Focus | Every interactive component shows a focus indicator on `:focus-visible`, never on a mouse click alone. It uses `focus.ring.*`, is not the glow alone, and reaches 3:1 against adjacent colors. | REQ-024, ADR-0009 | A Playwright keyboard test on every interactive component (REQ-024 AC2). |
| Keyboard | Every component and every showcase route can be operated by keyboard alone. Each component doc lists its keyboard interactions and ARIA roles and attributes. | REQ-027 AC2, REQ-060 AC2 | A Playwright test for each listed keyboard interaction. |
| Landmarks | Every showcase route has a skip link and landmark regions. | REQ-060 AC2 | Playwright. |
| Target size | Every interactive target is at least 24 × 24 CSS px. | REQ-028 AC2, WCAG SC 2.5.8 | A Playwright bounding-box assertion. |
| Reflow | No page or component demo scrolls horizontally at 360, 768, or 1280 px. | REQ-028 AC1, REQ-061 AC1, ER-05 | Playwright: `document.documentElement.scrollWidth <= innerWidth`. |
| Reduced motion | Any animation stops, or reduces to a non-moving state, under `prefers-reduced-motion: reduce`. | REQ-029 AC2 | Playwright with reduced motion emulated. |
| Flashing | Nothing flashes more than 3 times per second. | REQ-029 AC3, WCAG SC 2.3.1 | Manual, because flash frequency needs visual review; done once per animated component. |
| Decorative content | Motifs render with `aria-hidden="true"` and no focusable element. | REQ-029 AC1 | Playwright with axe, and the component tests. |
| Images and logos | A thumbnail has `alt` text or an explicit `decorative` flag. `CnLogo` has an accessible label or `decorative`. | REQ-025 AC2, REQ-030 AC1 | The component tests. |
| Text | Components contain no hardcoded copy; every string, including accessible names, arrives through a prop or slot. | A-11, REQ-022 AC2 | A lint rule. |

### The axe gate

axe (`@axe-core/playwright`) runs in the Playwright suite (ER-06), and it must report zero violations:

- on every component demo page, in every state of its state matrix (REQ-027 AC1);
- on every showcase route, at 360, 768, and 1280 px (REQ-060 AC1, A-09).

The suite runs in `pnpm test:all`, which CI runs on every push and pull request (REQ-074). A task is not done until it passes. The helper `expectNoA11yViolations` (in `apps/showcase/tests/e2e/helpers/a11y.ts`) runs axe with the WCAG 2.2 A and AA tags and fails with every violation it finds. The showcase's route matrix applies it, with the overflow, target-size, landmark, skip-link, and keyboard checks, to every route at the three widths. axe finds only part of the WCAG failures, so the keyboard, focus, and target-size tests above run alongside it, and each component doc lists what it covers by hand.

### When to use

- Build interactive behavior from Nuxt UI components, which provide the roles, keyboard handling, and focus management (ER-01). Never hand-roll a dialog, listbox, menu, tooltip, or focus trap (REQ-020 AC3).
- Declare every new foreground and background combination in `tokens/contrast-pairs.json` before using it (REQ-015 AC1).
- Show the `focus.ring.*` indicator on `:focus-visible` in every interactive component (REQ-024).
- Give every icon-only control, image, and logo an accessible name through a prop, or mark it decorative.
- Wrap every animation in a `prefers-reduced-motion` check (REQ-029 AC2).

### When not to use

- Never ship a component or a route with an axe violation. Fix the cause; never disable the rule.
- Never use a forbidden pair from SPEC.md §2.1.
- Never remove the focus outline, and never use the glow as the only focus indicator (REQ-024).
- Never treat an `unverified` contrast pair as passing. It is checked again when the owner supplies the value.
- Never shrink a target below 24 × 24 CSS px, on any viewport.

## Do and don't

| Do | Don't |
|---|---|
| Use black labels on a pink fill (8.37:1). | Use white labels on a pink fill (2.51:1). |
| Show the yellow focus ring on keyboard focus. | Remove the outline because it looks noisy on click. |
| Build a dialog from `UModal`. | Build a dialog with a `div` and a hand-written focus trap. |
| Give an icon-only close button an accessible name. | Leave an icon-only button with no name for screen readers. |
| Show a still motif under reduced motion. | Keep a motif animating when the user asked for reduced motion. |

## Accessibility

This whole doc is the system's accessibility reference. Each foundation doc applies it to its own area: contrast in [Color](color.md), focus and glow in [Effects](effects.md), overflow and target size in [Layout](layout.md), motion in [Motion](motion.md), icons in [Iconography](iconography.md), and motifs and images in [Imagery and motifs](imagery-and-motifs.md). Each component doc's Accessibility section lists its keyboard map, its roles and ARIA attributes, the contrast pairs it uses, and its focus behavior (§4.2, REQ-027 AC2).

## Responsive behavior

Every rule applies at 360, 768, and 1280 px (A-09), and at every breakpoint once TBD-13 is resolved. At 360 px (ER-05), targets keep their 24 × 24 CSS px minimum, nothing scrolls horizontally, and the focus indicator stays fully visible.

## Email notes

Email templates follow the same contrast rules, using the resolved values from `dist/email/email-tokens.json`. Email clients may invert colors in dark mode or block images (R-05), so every image has alt text and no content depends on an image or on color alone. The email rules are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040).

## Code reference

| Where | What |
|---|---|
| `tokens/contrast-pairs.json` and `tokens/contrast-forbidden.json` | The declared pairs and the forbidden combinations (REQ-015). |
| `scripts/check-contrast.ts` | The contrast check, run by `pnpm check:tokens` and `pnpm test`. |
| `tokens/semantic/focus.json` | The focus indicator, `stable` (ADR-0009). |
| `apps/showcase/tests/e2e/` | The Playwright suite with axe, keyboard, target-size, overflow, and reduced-motion tests (T5.5). |
| `apps/showcase/tests/e2e/helpers/a11y.ts` | `expectNoA11yViolations`, `expectNoHorizontalOverflow`, and `expectTargetSize`, which component demos reuse (T7.x). |

```css
.example:focus-visible {
  outline-color: var(--cn-focus-ring-color);
  outline-width: var(--cn-focus-ring-width);
  outline-style: var(--cn-focus-ring-style);
  outline-offset: var(--cn-focus-ring-offset);
}

@media (prefers-reduced-motion: reduce) {
  .example {
    transition: none;
    animation: none;
  }
}
```

## Open items

The contrast pairs below are `unverified` until their colors are defined. Each one is checked again when the owner supplies the value.

> **TBD (TBD-04):** The body text color is not defined, so the `color.text.default` pairs are unverified. Owner input needed: a hex value.
>
> **TBD (TBD-05):** The neutral scale is not defined, so the `color.text.muted` and `color.border.default` pairs are unverified. Owner input needed: a set of hex values.
>
> **TBD (TBD-06):** Card and elevated surface colors are not defined, so every pair on `color.surface.*` is unverified, including the focus ring on a card. Owner input needed: decision OD-05.
>
> **TBD (TBD-07):** Feedback colors are not defined, so the `color.feedback.*` pairs are unverified. Owner input needed: a set of hex values.

## Changelog

- 0.1.0 — First draft: the WCAG 2.2 AA target (A-10), the contrast, focus, keyboard, target-size, reflow, reduced-motion, flashing, and decorative-content rules, the axe gate (REQ-027, REQ-060), and the unverified pairs for TBD-04 to TBD-07 (T4.6); the axe helper and the route matrix are built (T5.5) — awaiting owner approval
