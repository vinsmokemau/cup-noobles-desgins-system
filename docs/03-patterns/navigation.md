---
title: Navigation
slug: navigation
layer: pattern
status: stable
lang: en
brandRules: [BR-06, BR-13, BR-15]
demos: [composed]
tbd: []
related: [site-header, slideover, breadcrumb, tabs, pagination, link, responsive-behavior, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Navigation

## Purpose

Navigation is how people find where to go and see where they are. This pattern says which part answers which question: the site header for the main sections, a breadcrumb for the path to the current page, tabs for views of one page, and pagination for a long list. On a wide screen the main links are in the header bar. On a narrow screen they move into a slideover that opens from one button (BR-15). Every part says where the person is, and none of them depends on color alone (BR-06).

## Usage rules

### When to use

Choose the part by the question the person asks:

| Question | Part | Use it when |
|---|---|---|
| Where can I go? | [Site header](../02-components/organisms/site-header.md) | The main sections of the site, on every page. |
| Where am I in the site? | [Breadcrumb](../02-components/molecules/breadcrumb.md) | A page sits two or more levels below the home page. |
| What else is on this page? | [Tabs](../02-components/molecules/tabs.md) | Two to five views of the same thing, shown one at a time. |
| Where is the rest of the list? | [Pagination](../02-components/molecules/pagination.md) | A long list is split into pages. |

- Put the main links in the header's default slot, and repeat the same links, in the same order, in the menu body. The header moves them into a [Slideover](../02-components/organisms/slideover.md) below `lg`.
- Keep the main navigation to three to six links, written as nouns: "Juegos", "Eventos", "Ayuda".
- Mark the link of the current page with `aria-current="page"`, and style it as the active link.
- Put the one primary action of the site, such as "Entrar", in the header's `right` slot.
- End a breadcrumb on the current page, without a link, and start it at the home page.
- Keep the same navigation, in the same place, on every page.

### When not to use

- Never use tabs to move between pages. Tabs switch views on one page. Use links.
- Never hide the main links in the slideover on a wide screen.
- Never use pagination for a list of five items or fewer.
- Never nest tabs inside tabs.
- Never mark more than one link of a navigation as the current page.
- Never write a link as "Haz clic aquí". The link says where it goes.

## Do and don't

| Do | Don't |
|---|---|
| Write links as nouns: "Eventos". | Write "Haz clic aquí" or "Ver más". |
| Show the current page with `aria-current="page"` and a visible style. | Show the current page only with a different color. |
| Use the same links in the bar and in the menu. | Show different links on mobile. |
| Name each pagination control: "Página 3". | Leave only the number "3" with no name. |
| End the breadcrumb on the current page, as plain text. | Link the last item to itself. |

## Accessibility

- The main links are inside a `<nav>` with an `aria-label` that names it ("Principal"), and a second navigation on the same page has a different name ("Menú", "Ruta de navegación"), so a screen reader user can tell them apart.
- The current page is marked with `aria-current="page"` in the header, the breadcrumb, and the pagination. See [Site header](../02-components/organisms/site-header.md), [Breadcrumb](../02-components/molecules/breadcrumb.md), and [Pagination](../02-components/molecules/pagination.md).
- The menu button opens a slideover that traps focus, closes with Escape, and returns focus to the button. See [Slideover](../02-components/organisms/slideover.md).
- Tabs follow the tabs pattern of the ARIA Authoring Practices: Tab moves into the list, and the arrow keys move between tabs. See [Tabs](../02-components/molecules/tabs.md).
- A skip link at the top of the page goes to the main content (WCAG 2.4.1).
- Every link and button is at least 24 × 24 px (REQ-028 AC2) and shows the yellow focus ring on `:focus-visible` (REQ-024).

Keyboard map:

| Key | Result |
|---|---|
| Tab | Moves focus to the next link or control. |
| Shift + Tab | Moves focus to the previous one. |
| Enter | Follows a link, or opens the menu from its button. |
| Left or Right arrow | Moves between tabs. |
| Escape | Closes the open menu and returns focus to its button. |

ARIA: `aria-label` on each `<nav>`; `aria-current="page"` on the current link or page number; the slideover's own dialog roles.

## Content

- Write each link as a noun, in one or two words, in sentence case.
- Write the name of the current page in the breadcrumb exactly as it is the page's heading.
- Write pagination names as "Página anterior", "Página 3", "Página siguiente".

```copy es-MX
Juegos
Eventos
Ayuda
Entrar
Página anterior
Página 3
Página siguiente
Ruta de navegación
```

```copy-bad es-MX
Haz clic aquí
Ver más
Ir a la página de eventos
```

## Responsive behavior

At 1280 px the main links are in the header bar, and the breadcrumb, tabs, and pagination sit in the content. At 768 px the header still shows the menu button, because the bar needs room for the links, and the same links are in the slideover. At 360 px the same slideover is used, the breadcrumb wraps to a second line when it is long, and the pagination keeps the first, the current, and the last page (ER-05, A-09). Nothing causes horizontal overflow (REQ-028 AC1). See [Responsive behavior](responsive-behavior.md).

## Code reference

| Item | Value |
|---|---|
| Nuxt UI components | `UHeader`, `ULink`, `UBreadcrumb`, `UTabs`, `UPagination`, `UButton` |
| Header props | `mode="slideover"`, `:menu`, `:toggle`, and the `right` and `body` slots |
| Current page | `aria-current="page"` and `:active="true"` on `ULink` |
| Composed demo | `apps/showcase/demos/navigation/composed.vue` |

```vue
<UHeader title="Cup Noobles" mode="slideover" :menu="{ title: 'Menú', description: 'Navegación del sitio.' }">
  <nav aria-label="Principal">
    <ULink to="/eventos" active aria-current="page">Eventos</ULink>
  </nav>
  <template #body><nav aria-label="Menú">…</nav></template>
</UHeader>
<UBreadcrumb :items="crumbs" aria-label="Ruta de navegación" />
```

The composed demo puts the header, a breadcrumb, tabs, and pagination on one page of neutral content: a community events site.

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: the navigation pattern, with header, breadcrumb, tabs, and pagination, and its composed demo (T9.2) — ADR-0034
- 0.1.0 — Approved as stable by the owner — ADR-0034
