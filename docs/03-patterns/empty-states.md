---
title: Empty states
slug: empty-states
layer: pattern
status: stable
lang: en
brandRules: [BR-05, BR-06, BR-13]
demos: [composed]
tbd: []
related: [card, button, icon, loading, feedback, microcopy, accessibility]
since: 0.1.0
updated: 2026-10-11
---

# Empty states

## Purpose

An empty state is what a list, a search, or a section shows when it has nothing to show. This pattern says that an empty state is never a blank area: it says why there is nothing, and it offers the one action that changes that. It stays premium and clear, never childish (BR-05), and it is legible and high-contrast (BR-06). It is built from a [Card](../02-components/molecules/card.md), an [Icon](../02-components/atoms/icon.md), a short text, and at most one [Button](../02-components/atoms/button.md).

## Usage rules

### When to use

Choose the kind by why there is nothing:

| Kind | Why it is empty | What it offers |
|---|---|---|
| First use | The person has not created anything yet. | The action that creates the first item: "Crear partida". |
| No results | A search or a filter matched nothing. | The action that undoes it: "Limpiar búsqueda". |
| Cleared | The person finished everything. | Nothing, or a way to look at what was done. |
| Not available | The person cannot see this yet, for a reason they can fix. | The action that fixes it. |

- Write a title that says what is empty, and one sentence that says what the person can do.
- Offer one primary action at most. When there is no useful action, offer none.
- Name the search in a no-results state: "Sin resultados para «dados»".
- Place the state where the content would be, inside the same card or region, so the page does not jump.
- Replace the empty state with the content as soon as there is content.

### When not to use

- Never use an empty state while content is loading. Use a skeleton (see [Loading](loading.md)).
- Never use an empty state for an error. A failed request is an error: say what failed and how to try again (see [Feedback](feedback.md)).
- Never leave a list blank with no explanation.
- Never offer two primary actions.
- Never blame the person: "No hiciste nada todavía".
- Never use a decorative image that carries meaning the text does not.

## Do and don't

| Do | Don't |
|---|---|
| Say what is empty: "Aún no tienes partidas". | Show a blank area, or only "Sin datos". |
| Offer the action that fills it: "Crear partida". | Say "No hay nada aquí" and stop. |
| Name the search: "Sin resultados para «dados»". | Say "Sin resultados" with no hint of what was searched. |
| Hide the icon from assistive technology. | Give the icon a name that repeats the title. |
| Keep the state in the card where the content goes. | Move it to the middle of an empty page. |

## Accessibility

- The icon is decorative: it has `aria-hidden="true"`. The title and the sentence carry the meaning.
- The title is a real heading, one level under the heading of its section, so it is part of the page outline.
- A no-results state appears after the person types, so it is a `role="status"` region, and a screen reader reads it without moving focus.
- The action is a real button, with a name that says what it does, at least 24 × 24 px (REQ-028 AC2), and it shows the yellow focus ring (REQ-024).
- Text is 4.5:1 or more against the page where the colors are defined (REQ-015).

Keyboard map: Tab reaches the action, and Enter or Space activates it. The state itself is not interactive.

ARIA: `aria-hidden="true"` on the icon; `role="status"` on a state that appears after the person acts.

## Content

- Write the title as what is empty, in a few words: "Aún no tienes partidas".
- Write the sentence as what the person can do, ending with a period.
- Write the action as a verb with its object: "Crear partida", "Limpiar búsqueda".
- Say it plainly, with the brand's energy but no jokes about the person's situation.

```copy es-MX
Aún no tienes partidas
Aquí verás las partidas que crees. Empieza con la primera.
Crear partida
Sin resultados para «dados»
Revisa la ortografía o prueba con otra palabra.
Limpiar búsqueda
```

```copy-bad es-MX
Sin datos
No hay nada aquí
No hiciste nada todavía
Ups, nada por aquí
```

## Responsive behavior

An empty state fills the width of its card and centers its content, so it is the same at 360, 768, and 1280 px (A-09). The card has a maximum width so lines stay short on a wide screen. The text wraps and the action keeps its size (ER-05). Nothing causes horizontal overflow (REQ-028 AC1).

## Code reference

| Item | Value |
|---|---|
| Nuxt UI components | `UCard`, `UIcon`, `UButton` |
| Icon | an `i-ph-*-bold` name from the icon set, with `aria-hidden="true"` |
| Composed demo | `apps/showcase/demos/empty-states/composed.vue` |

```vue
<UCard>
  <div class="flex flex-col items-center gap-3 text-center">
    <UIcon name="i-ph-folder-open-bold" class="size-10" aria-hidden="true" />
    <h3 class="text-lg font-semibold">Aún no tienes partidas</h3>
    <p class="text-muted">Aquí verás las partidas que crees. Empieza con la primera.</p>
    <UButton color="primary" variant="solid" label="Crear partida" @click="create" />
  </div>
</UCard>
```

The composed demo shows a first-use state and a no-results state on neutral content: a list of game sessions in a community app.

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: the empty-states pattern, with first use and no results, and its composed demo (T9.2) — ADR-0034
- 0.1.0 — Approved as stable by the owner — ADR-0034
