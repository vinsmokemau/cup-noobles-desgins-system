---
title: Responsive behavior
slug: responsive-behavior
layer: pattern
status: draft
lang: en
brandRules: [BR-15]
demos: [composed]
tbd: [TBD-13]
related: [layout, spacing, navigation, card, button, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Responsive behavior

## Purpose

The system works on mobile and on web and dashboard layouts (BR-15). This pattern says how common layouts adapt as the screen narrows: a grid loses columns, a sidebar stacks above its content, a row of actions wraps, and a wide table scrolls inside its own region. Every layout works at 360 px wide (ER-05), and it is described and tested at 360, 768, and 1280 px (A-09). The widths where a layout changes are the breakpoints, which are not defined yet (TBD-13). See [Layout](../01-foundations/layout.md).

## Usage rules

### When to use

| Layout | At 360 px | At 768 px | At 1280 px |
|---|---|---|---|
| Card grid | One column | Two columns | Three columns |
| Sidebar and content | Stacked, sidebar first | Side by side | Side by side |
| Row of actions | Wraps to more lines | One or two lines | One line |
| Main navigation | In the slideover | In the slideover | In the header bar (see [Navigation](navigation.md)) |
| Wide table | Scrolls inside its own region | Scrolls if it needs to | Fits |

- Design every layout at 360 px first, then widen it.
- Let content reflow into fewer columns as the screen narrows, and keep the reading order the same as the visual order.
- Let a row of buttons wrap, with `flex-wrap`, and keep each button's size.
- Put a wide table in its own region that scrolls, make the region focusable, and give it a name.
- Use Tailwind layout utilities for the grid and the flow. Do no visual styling of your own (C-03).

### When not to use

- Never let a page scroll sideways at 360, 768, or 1280 px (REQ-028 AC1).
- Never write a breakpoint or a container width as a literal number in a component. They come from tokens (REQ-016), and they are TBD-13.
- Never shrink a target below 24 × 24 px to make it fit (REQ-028 AC2).
- Never hide content on mobile that the person needs. Move it, or put it behind a control.
- Never rely on hover for anything on a touch screen.

## Do and don't

| Do | Don't |
|---|---|
| Stack the cards in one column at 360 px. | Keep three columns and let the page scroll sideways. |
| Let a table scroll inside its own region. | Let a table push the page wider than the screen. |
| Let the actions wrap to the next line. | Shrink the buttons until the labels are cut off. |
| Keep the reading order and the focus order the same. | Reorder with CSS so Tab jumps around. |
| Test at 360, 768, and 1280 px. | Test only at the width of your own screen. |

## Accessibility

- No page or demo scrolls horizontally at 360, 768, or 1280 px: `document.documentElement.scrollWidth <= innerWidth` (REQ-028 AC1). Playwright checks every composed demo at the three widths.
- Every interactive target is at least 24 × 24 px at every width (REQ-028 AC2, WCAG 2.5.8).
- Content reflows at 320 CSS px without two-dimensional scrolling (WCAG 1.4.10).
- A region that scrolls is keyboard-focusable (`tabindex="0"`), has `role="region"`, and has an accessible name, so a keyboard user can scroll it (WCAG 2.1.1).
- The reading order is the DOM order. Layout changes never reorder what a screen reader reads.

Keyboard map: Tab reaches the scrolling region, and the arrow keys scroll it. Everything else is as in the part that fills the layout.

ARIA: `role="region"` with `aria-label` on a scrolling table region; the table has a `<caption>`.

## Content

- The same text is shown at every width. Do not write a shorter label for mobile that says something different.
- Write labels short enough to wrap without losing meaning.
- Name a scrolling region as what it holds, and say that it scrolls: "Tabla de mesas, con desplazamiento".

```copy es-MX
Tabla de mesas, con desplazamiento
Apartar lugar
Compartir evento
Agregar al calendario
```

```copy-bad es-MX
Tabla
Haz scroll hacia el lado para ver más
```

## Responsive behavior

This pattern is about responsive behavior, so the table above is its behavior. Two rules hold for every other pattern and component: describe the behavior at 360, 768, and 1280 px until the breakpoints are defined, and then describe it at each breakpoint token (see [Layout](../01-foundations/layout.md)).

## Code reference

| Item | Value |
|---|---|
| Nuxt UI components | `UCard`, `UButton` |
| Tailwind utilities | `grid`, `grid-cols-*`, `flex`, `flex-col`, `flex-wrap`, `overflow-x-auto`, and the `md:` and `lg:` prefixes |
| Composed demo | `apps/showcase/demos/responsive-behavior/composed.vue` |

```vue
<ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">…</ul>
<div class="flex flex-wrap gap-3">…</div>
<div class="overflow-x-auto" role="region" aria-label="Tabla de mesas, con desplazamiento" tabindex="0">
  <table>…</table>
</div>
```

The prefixes `md:` and `lg:` use Tailwind's default widths today, which are the ADR-0006 placeholders and not brand values. They change when TBD-13 is resolved. The composed demo shows the four layouts on neutral content: a community events page.

## Open items

> **TBD (TBD-13):** Breakpoints and container widths are not defined. The 360 px minimum is fixed by ER-05, and the three test widths by A-09. Owner input needed: values.

## Changelog

- 0.1.0 — First draft: the responsive-behavior pattern, with the card grid, the sidebar, the action row, and the scrolling table, and its composed demo (T9.2) — ADR-0034
- 0.1.0 — Rules approved by the owner. The doc stays a draft while TBD-13 is open — ADR-0034
