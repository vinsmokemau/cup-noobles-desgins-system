---
title: Site header
slug: site-header
layer: component
level: organism
source: nuxt-ui
nuxtUi: UHeader
status: stable
lang: en
brandRules: [BR-03, BR-13, BR-15]
tokens: [siteHeader, border.width.siteHeader]
demos: [states, playground]
tbd: []
related: [site-footer, slideover, link, button, logo, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Site header

## Purpose

The site header is the bar at the top of every page. It holds the logo or site name, the main navigation, and a few actions, and it stays at the top while the page scrolls. It is a themed Nuxt UI `UHeader`, styled only through tokens (C-03). It is slot-based and holds no domain content (REQ-022): the title, the navigation, the actions, and the menu body all arrive through slots. On a narrow screen the navigation moves into a slideover that opens from a toggle button (BR-15). The look is an opaque black bar with a thick brand-pink line under it (BR-03, BR-13, ADR-0030). For the bar at the bottom of the page, use [Site footer](site-footer.md).

## Anatomy

1. **bar**: the full-width, sticky container. It has the page's black fill and the pink line under it.
2. **left**: the logo or site name, as a link to the home page. Use the `title` slot or the `title` prop.
3. **center**: the main navigation, passed to the default slot. It shows from `lg` up.
4. **right**: the actions, passed to the `right` slot, such as a primary button.
5. **toggle**: the button that opens the mobile menu. It shows below `lg`, and sits at the end of the right group, or at the start of the left group with `toggle-side="left"`.
6. **menu**: the slideover that holds the navigation on a narrow screen: a title, a description, and the `body` slot.

## Tokens and specs

<!-- cn:generated tokens="siteHeader border.width.siteHeader" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.siteHeader` | `--cn-border-width-site-header` | `3px` | stable |
| `siteHeader.bg` | `--cn-site-header-bg` | `#000000` | stable |
| `siteHeader.fg` | `--cn-site-header-fg` | `#f5f5f5` | stable |
| `siteHeader.line` | `--cn-site-header-line` | `#ef80ae` | stable |

<!-- /cn:generated -->

The fill and the line are `stable`. The text color and the stroke width are `stable` too (ADR-0032).

Contrast pairs declared for the header (REQ-015): the pink line against the black fill is 8.37:1 and passes as a UI boundary (WCAG 1.4.11). The text color pair passes too (ADR-0032).

### Brand rules

> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.
>
> **BR-15:** The system is responsive and works on both mobile and web/dashboard layouts.

The brand context does not describe a header. It takes the card's line (ADR-0030). BR-03 is why the bar is pure black and not a dark grey: it is separated from the page by its line, not by a surface color (C-05).

## Variants

The header has one brand look. The Nuxt UI props below change how the menu behaves.

| Brand look | Nuxt UI props | Result |
|---|---|---|
| right toggle (default) | `toggle-side="right"` | The toggle is at the end of the bar |
| left toggle | `toggle-side="left"` | The toggle is before the title |
| slideover menu | `mode="slideover"` | The mobile menu is a panel from one edge, with the overlay look |

Always set `mode="slideover"`, so the mobile menu takes the one overlay look (ADR-0029). The menu panel side is set with `:menu="{ side: 'left' }"`. The toggle takes the brand ghost look through `:toggle="{ color: 'primary', variant: 'ghost' }"`.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | At rest at the top of the page: the black bar with the pink line under it. | `siteHeader.bg`, `siteHeader.line`, `border.width.siteHeader` |

The header is a landmark, not a control, so it has no hover, focus-visible, active, or disabled state of its own. The links and buttons inside show their own states (ADR-0009, ADR-0010, ADR-0011), and the open menu is the [Slideover](slideover.md). The matrix shows the real bar with the mobile menu closed. The menu opening is in the playground.

## Usage rules

### When to use

- Use one site header at the top of every page, as the first landmark after the skip link.
- Put the logo or site name on the left, the main navigation in the middle, and one or two actions on the right.
- Always pass the menu a `title` and a `description` through `:menu`, so the open panel has an accessible name.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never put page content, a search results list, or a form in the header.
- Never use more than one primary button in the bar.
- Never write a color, width, or z-index literally on the header. Read the tokens (REQ-016).
- Never add a glow to the bar. The glow belongs to buttons (BR-10).
- Never rebuild the menu by hand. Nuxt UI provides it (ER-01, REQ-020 AC3).

## Do and don't

| Do | Don't |
|---|---|
| Keep the navigation to a few words each: "Juegos". | Fill the bar with long labels that wrap. |
| Give the nav a label: `aria-label="Principal"`. | Leave two navigation landmarks with the same name. |
| Keep the toggle in the bar below `lg`. | Hide the navigation with no way to open it. |
| Let the sticky bar stay opaque. | Make it see-through so the page text shows behind the links. |

## Accessibility

- The bar is a `<header>` and is the page's banner landmark. Use it once per page, outside the main region.
- The navigation in the bar should be a `<nav>` with an `aria-label`. The same links in the menu body should be in a list with its own name.
- The toggle is a real button. Its name is "Open menu" and becomes "Close menu" while the menu is open. Set another name through the `toggle` prop for another locale.
- The open menu has `role="dialog"`. Its accessible name is the `title` passed in `menu`, and its description is linked with `aria-describedby`.
- Focus moves into the menu when it opens and is trapped there. Escape closes it and returns focus to the toggle.
- The page behind is hidden from assistive technology while the menu is open (`aria-hidden="true"`) and cannot be clicked or tabbed to.
- The pink line is 8.37:1 against the black fill (REQ-015, WCAG 1.4.11). Keyboard focus on a link or button is the yellow ring (ADR-0009, REQ-024).
- Every target is at least 24 by 24 CSS px (REQ-028 AC2).

Keyboard map:

| Key | Action |
|---|---|
| `Tab` | Moves focus to the next control. With the menu open, it cycles inside the menu only |
| `Shift+Tab` | Moves focus to the previous control. With the menu open, it cycles inside the menu only |
| `Enter` or `Space` | Activates the focused control, including the toggle, which opens the menu |
| `Escape` | Closes the menu and returns focus to the toggle |

ARIA: the bar is `<header>` (banner). The menu has `role="dialog"`, `aria-labelledby` (its title), and `aria-describedby` (its description). While it is open, the page behind has `aria-hidden="true"`.

## Content

- Write the site name as it is written everywhere else.
- Write navigation labels as one or two words, in sentence case.
- Write an action as a verb: "Entrar".

```copy es-MX
Juegos
Eventos
Ayuda
Entrar
```

```copy-bad es-MX
HAZ CLIC AQUÍ PARA VER TODOS NUESTROS JUEGOS
Ir
```

## Responsive behavior

At 360 and 768 px the center navigation is hidden and the toggle is shown, and the navigation is in the menu (A-09). From `lg` (1024 px) the navigation is in the bar and the toggle is hidden. The bar keeps a fixed height, so at 360 px the site name and the actions share one row and never wrap. Nothing causes horizontal overflow (REQ-028 AC1). An app whose sidebar appears earlier than `lg`, such as the showcase, changes where the toggle hides through the `ui` prop.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UHeader` |
| Props used | `title`, `to`, `mode`, `menu`, `toggle`, `toggle-side` |
| Slots used | default (the navigation), `title`, `right`, `body` |
| Theme | `ui.header` in `packages/nuxt/app.config.ts` and the `.cn-site-header` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `siteHeader.*`, `border.width.siteHeader` |
| Demos | `apps/showcase/demos/site-header/` |

```vue
<UHeader
  title="Cup Noobles"
  to="/"
  mode="slideover"
  :toggle="{ color: 'primary', variant: 'ghost' }"
  :menu="{ side: 'left', title: 'Menú', description: 'Navegación del sitio.' }"
>
  <nav aria-label="Principal">
    <ul class="flex items-center gap-4">
      <li><ULink to="/juegos">Juegos</ULink></li>
    </ul>
  </nav>
  <template #right>
    <UButton label="Entrar" />
  </template>
  <template #body>
    <ULink to="/juegos">Juegos</ULink>
  </template>
</UHeader>
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: `UHeader` themed with the pink line look, the component tokens, and the demos (T8.6) — ADR-0030
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
- 0.1.0 — Approved as stable by the owner — ADR-0033
