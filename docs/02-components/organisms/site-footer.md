---
title: Site footer
slug: site-footer
layer: component
level: organism
source: nuxt-ui
nuxtUi: UFooter
status: stable
lang: en
brandRules: [BR-03, BR-13, BR-15]
tokens: [siteFooter, border.width.siteFooter]
demos: [states, playground]
tbd: []
related: [site-header, link, button, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Site footer

## Purpose

The site footer is the bar at the bottom of every page. It holds the closing text, a few secondary links, and an action or two. It is a themed Nuxt UI `UFooter`, styled only through tokens (C-03). It is slot-based and holds no domain content (REQ-022): the text, the links, and the actions all arrive through slots. The look is the header's: a black bar with a thick brand-pink line, above the footer this time (BR-03, BR-13, ADR-0030). For the bar at the top of the page, use [Site header](site-header.md).

## Anatomy

1. **bar**: the full-width container, with the page's black fill and the pink line above it.
2. **left**: the closing text, such as the name and the year. Use the `left` slot.
3. **center**: the secondary links, passed to the default slot.
4. **right**: an optional action, passed to the `right` slot.
5. **top and bottom**: two optional full-width bands, from the `top` and `bottom` slots, for a larger footer.

## Tokens and specs

<!-- cn:generated tokens="siteFooter border.width.siteFooter" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.siteFooter` | `--cn-border-width-site-footer` | `3px` | stable |
| `siteFooter.bg` | `--cn-site-footer-bg` | `#000000` | stable |
| `siteFooter.fg` | `--cn-site-footer-fg` | `#f5f5f5` | stable |
| `siteFooter.line` | `--cn-site-footer-line` | `#ef80ae` | stable |

<!-- /cn:generated -->

The fill and the line are `stable`. The text color and the stroke width are `stable` too (ADR-0032).

Contrast pairs declared for the footer (REQ-015): the pink line against the black fill is 8.37:1 and passes as a UI boundary (WCAG 1.4.11). The text color pair passes too (ADR-0032).

### Brand rules

> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.
>
> **BR-15:** The system is responsive and works on both mobile and web/dashboard layouts.

The brand context does not describe a footer. It takes the header's line (ADR-0030). BR-03 is why the bar is pure black and not a dark grey.

## Variants

The footer has one brand look. A footer with more content uses the `top` and `bottom` slots of `UFooter`, and keeps the same line and fill.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | At rest at the end of the page: the black bar with the pink line above it. | `siteFooter.bg`, `siteFooter.line`, `border.width.siteFooter` |

The footer is a landmark, not a control, so it has no hover, focus-visible, active, or disabled state of its own. The links and buttons inside show their own states (ADR-0009, ADR-0010, ADR-0011).

## Usage rules

### When to use

- Use one site footer at the end of every page, after the main region.
- Keep it to the closing text and secondary links, such as help, terms, and privacy.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never put primary content or the main navigation only in the footer.
- Never write a color, width, or z-index literally on the footer. Read the tokens (REQ-016).
- Never add a glow to the bar. The glow belongs to buttons (BR-10).

## Do and don't

| Do | Don't |
|---|---|
| Give the footer navigation a label: `aria-label="Pie de página"`. | Leave it with no name, or with the same name as the header's. |
| Keep the link text self-explanatory: "Privacidad". | Use "Aquí" or "Más". |
| Let the parts stack and center on a phone. | Squeeze three groups into one row at 360 px. |

## Accessibility

- The bar is a `<footer>` and is the page's contentinfo landmark. Use it once per page, outside the main region.
- The links should be in a `<nav>` with an `aria-label` that differs from the header's.
- The pink line is 8.37:1 against the black fill (REQ-015, WCAG 1.4.11). Keyboard focus on a link or button is the yellow ring (ADR-0009, REQ-024).
- Every target is at least 24 by 24 CSS px (REQ-028 AC2).

Keyboard map:

| Key | Action |
|---|---|
| `Tab` | Moves focus to the next link or button in the footer |
| `Shift+Tab` | Moves focus to the previous link or button |
| `Enter` | Follows the focused link, or activates the focused button |
| `Space` | Activates the focused button |

ARIA: the bar is `<footer>` (contentinfo). The footer adds no ARIA attributes of its own.

## Content

- Write the closing text as the name and the year.
- Write links as one or two words, in sentence case.

```copy es-MX
© 2026 Cup Noobles
Ayuda
Términos
Privacidad
```

```copy-bad es-MX
TODOS LOS DERECHOS RESERVADOS!!!
Aquí
```

## Responsive behavior

Below `lg` (1024 px) the three parts stack and are centered, so at 360 and 768 px nothing wraps awkwardly (A-09). From `lg` they sit in one row: the text on the left, the links in the middle, and the action on the right. Nothing causes horizontal overflow (REQ-028 AC1).

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UFooter` |
| Props used | none |
| Slots used | default (the links), `left`, `right`, `top`, `bottom` |
| Theme | `ui.footer` in `packages/nuxt/app.config.ts` and the `.cn-site-footer` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `siteFooter.*`, `border.width.siteFooter` |
| Demos | `apps/showcase/demos/site-footer/` |

```vue
<UFooter>
  <template #left>
    <p>© 2026 Cup Noobles</p>
  </template>
  <nav aria-label="Pie de página">
    <ul class="flex flex-wrap items-center justify-center gap-4">
      <li><ULink to="/ayuda">Ayuda</ULink></li>
    </ul>
  </nav>
</UFooter>
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: `UFooter` themed with the pink line look, the component tokens, and the demos (T8.6) — ADR-0030
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
- 0.1.0 — Approved as stable by the owner — ADR-0033
