---
title: Error pages
slug: error-pages
layer: pattern
status: stable
lang: en
brandRules: [BR-05, BR-06]
demos: [composed]
tbd: []
related: [button, feedback, navigation, empty-states, microcopy, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Error pages

## Purpose

An error page is what people see when a whole page cannot be shown: the address does not exist, or the service failed. This pattern says that an error page has four parts, in this order: the status code, a title that says what happened, one sentence that says what to do, and one primary action. It is calm and plain, never childish (BR-05), and legible and high-contrast (BR-06). The showcase's own 404 page is built from this pattern.

## Usage rules

### When to use

Choose the page by what went wrong:

| Page | Status | Say | Action |
|---|---|---|---|
| Not found | 404 | The page does not exist or has moved. | Go to the home page. |
| Server failure | 500 | The failure is ours, and it is not the person's fault. | Try again, or go to the home page. |
| No access | 403 | The person may not see this page. | Go to the home page, or sign in. |

- Show the status code first, as a small label, so the person and support can name the problem.
- Write the title in a real `h1`, and say what happened in plain words.
- Write one sentence that says what to do next.
- Offer one primary action, usually "Volver al inicio".
- Keep the site header and footer, so the person can still move around (see [Navigation](navigation.md)).
- Set the document title to the error title (WCAG 2.4.2), and return the real status code from the server.

### When not to use

- Never show a stack trace, an error message from the code, or an internal path.
- Never blame the person: "Escribiste mal la dirección".
- Never use an error page for a problem with one block of a page. Use an inline alert (see [Feedback](feedback.md)).
- Never use an error page for a list with no items. Use an [empty state](empty-states.md).
- Never offer two primary actions, and never leave the page with no action.
- Never use humor that makes light of a failure the person cannot fix.

## Do and don't

| Do | Don't |
|---|---|
| Say what happened: "No encontramos esta página". | Show only "404". |
| Say what to do: "Vuelve al inicio y búscala desde ahí." | Show "Error inesperado" and stop. |
| Offer one action: "Volver al inicio". | Offer "Aceptar". |
| Say the failure is ours when it is: "Algo salió mal de nuestro lado". | Say "Hiciste algo mal". |
| Keep the header and footer. | Show a bare page with no way out. |

## Accessibility

- The title is the page's `h1`, so a screen reader announces what happened first.
- The document has a title that says what happened (WCAG 2.4.2).
- The action is a link or a button with a name that says what it does, at least 24 × 24 px (REQ-028 AC2), and it shows the yellow focus ring (REQ-024).
- The status code is text, not an image, and the page does not depend on color alone.
- Text is 4.5:1 or more against the page where the colors are defined (REQ-015).

Keyboard map: Tab reaches the action, and Enter activates it. Nothing else on the page is interactive besides the header and footer.

ARIA: the page adds no `role`. The layout's `main` landmark holds it.

## Content

- Write the title as what happened, in a few words, in sentence case.
- Write one sentence that says what to do, and end it with a period.
- Write the action as a verb: "Volver al inicio", "Volver a intentar".
- When the failure is ours, say so, and do not blame the person.

```copy es-MX
No encontramos esta página
Puede que se haya movido o que la dirección tenga un error. Vuelve al inicio y búscala desde ahí.
Volver al inicio
Algo salió mal de nuestro lado
No pudimos mostrar esta página. Vuelve a intentarlo en unos minutos.
Volver a intentar
```

```copy-bad es-MX
Error 404
Error inesperado
Escribiste mal la dirección
Aceptar
```

## Responsive behavior

The content is one centered column with a maximum text width, so it is the same at 360, 768, and 1280 px (A-09). The title and the sentence wrap, and the action keeps its size (ER-05). Nothing causes horizontal overflow (REQ-028 AC1).

## Code reference

| Item | Value |
|---|---|
| Showcase component | `apps/showcase/components/ErrorPage.vue`, which holds the four parts and takes every text by props |
| Showcase 404 | `apps/showcase/error.vue`, which renders `ErrorPage` inside the app layout |
| Nuxt UI components | `UButton` |
| Composed demo | `apps/showcase/demos/error-pages/composed.vue` |

```vue
<ErrorPage
  status="404"
  title="No encontramos esta página"
  message="Puede que se haya movido o que la dirección tenga un error. Vuelve al inicio y búscala desde ahí."
  action-label="Volver al inicio"
  to="/"
/>
```

The composed demo shows a 404 page and a 500 page on neutral content: a community events site.

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: the error-pages pattern, with 404 and 500, its composed demo, and the showcase 404 built from it (T9.2) — ADR-0034
- 0.1.0 — Approved as stable by the owner — ADR-0034
