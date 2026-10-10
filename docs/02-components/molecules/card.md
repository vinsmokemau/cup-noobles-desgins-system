---
title: Card
slug: card
layer: component
level: molecule
source: nuxt-ui
nuxtUi: UCard
status: draft
lang: en
brandRules: [BR-03, BR-12, BR-13]
tokens: [card, radius.card, border.width.card, color.surface.card]
demos: [states, playground]
tbd: [TBD-04, TBD-05, TBD-06, TBD-10, TBD-11]
related: [media-card, badge, button, form-field, color, shape]
since: 0.1.0
updated: 2026-10-09
---

# Card

## Purpose

The card groups related content into one framed block with an optional header, a body, and an optional footer. It is the standard content card of BR-12, a themed Nuxt UI `UCard`, styled only through tokens (C-03). It sits on the pure-black page (BR-03) and is set apart by a thick brand-pink outline (BR-12, BR-13). The featured card with a thumbnail and tag badges is a different component: [Media card](media-card.md).

## Anatomy

1. **container**: the framed block. It has the page's black fill, the pink outline, and the rounded corners.
2. **header**: the optional top part, with a title and a description, or any content passed to the `header` slot.
3. **body**: the main content, passed to the default slot.
4. **footer**: the optional bottom part, passed to the `footer` slot.
5. **divider**: the pink line between two parts. It is drawn only between parts that exist.

## Tokens and specs

<!-- cn:generated tokens="card radius.card border.width.card color.surface.card" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.card` | `--cn-border-width-card` | `1px` | tbd (TBD-11) |
| `card.bg` | `--cn-card-bg` | `#000000` | stable |
| `card.divider` | `--cn-card-divider` | `#ef80ae` | stable |
| `card.fg` | `--cn-card-fg` | `#90a1b9` | tbd (TBD-04) |
| `card.fgMuted` | `--cn-card-fg-muted` | `#90a1b9` | tbd (TBD-05) |
| `card.highlight` | `--cn-card-highlight` | `#ef80ae` | stable |
| `color.surface.card` | `--cn-color-surface-card` | `#90a1b9` | tbd (TBD-06) |
| `radius.card` | `--cn-radius-card` | `0.375rem` | tbd (TBD-10) |

<!-- /cn:generated -->

The card tokens reference semantic tokens only (REQ-010 AC2). The text colors, the corner radius, and the stroke width follow placeholders (TBD-04, TBD-05, TBD-10, TBD-11), so they are `tbd` until the owner supplies them. The fill, the outline, and the dividers are `stable`: black and brand pink (BR-01, BR-03).

The card does not read `color.surface.card`. The table lists it so the open item is visible: no card surface color is defined (TBD-06, C-05), and the card renders on `color.bg.base` until OD-05 is decided.

Contrast pairs declared for the card (REQ-015):

<!-- cn:generated tokens="card" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `card.fg` (`#90a1b9`) | `card.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `card.fg`, `color.text.default`, `placeholder.color.neutral`) |
| `card.fgMuted` (`#90a1b9`) | `card.bg` (`#000000`) | text | 7.98:1 | 4.50:1 | unverified (tbd: `card.fgMuted`, `color.text.muted`, `placeholder.color.neutral`) |
| `card.highlight` (`#ef80ae`) | `card.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `card.divider` (`#ef80ae`) | `card.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-12:** Cards have a dark surface with neon highlights. There are two card types: a standard content card, and a featured media card (thumbnail, title, and tag badge).
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The neon highlight is the pink outline and the pink dividers. There is no glow on the card, so the glow rule (TBD-12) does not affect it (ADR-0018). Pink on black is 8.37:1 (SPEC.md §2.1).

## Variants

The card has one brand look. Nuxt UI's `variant` prop is not used: the theme sets the look through the `.cn-card` hook class, so there is nothing to map. Never use the `solid` variant, which paints a light fill and would break BR-03.

| Brand look | Nuxt UI props | Outline | Fill |
|---|---|---|---|
| default | none | Brand pink, thick | The black page |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Black fill, pink outline, pink dividers between parts. | `card.bg`, `card.highlight`, `card.divider`, `radius.card`, `border.width.card` |

A card shows content. It is not a control, so it has no hover, focus-visible, active, or disabled state, and it takes no focus. Controls inside it show their own states. To make a whole card a link, use [Media card](media-card.md).

## Usage rules

### When to use

- Use a card to group content that belongs together, such as a short description with an action.
- Use the `header` slot for the title, the default slot for the content, and the `footer` slot for actions or notes.
- Leave out the header or the footer when a card does not need one.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never nest a card inside a card.
- Never make the whole card clickable. Use [Media card](media-card.md), which handles a single tab stop.
- Never use the card for a thumbnail and tag badges. Use [Media card](media-card.md).
- Never write a color, radius, or width literally on a card. Read the tokens (REQ-016).
- Never add a glow to a card. The glow belongs to buttons (BR-10).

## Do and don't

| Do | Don't |
|---|---|
| Give the card a short title: "Noche de juegos". | Leave the header empty and put a heading in the body. |
| Put the main action in the footer. | Spread actions across the header and the body. |
| Keep a long title wrapping inside the card. | Truncate a title that people need to read. |
| Use the pink outline as the only boundary. | Add a separate surface color until TBD-06 is decided. |

## Accessibility

- A card is a plain container. It has no role and takes no focus, so it adds no keyboard interaction and no tab stop.
- Put the title in a real heading element so assistive technology can navigate to it. Nuxt UI's `title` prop renders a `<div>`; pass a heading through the `header` slot when the page needs one.
- Text is 4.5:1 or more against the fill and the pink outline is 8.37:1, so the card boundary is perceivable (REQ-015, WCAG 1.4.11).
- Controls inside the card keep their own focus ring. The ring is yellow and sits on the black fill, 18.55:1 (REQ-024).

Keyboard map: none. The card is not interactive. Tab moves through the controls inside it, as it would outside.

ARIA: no `role` or `aria-*` attribute is added.

## Content

- Write the title as a noun phrase of one to four words.
- Write the description as one short sentence, in sentence case.
- Write footer actions as verbs: "Apartar lugar".

```copy es-MX
Noche de juegos
Trae tus dados y tu mazo favorito. Hay mesas para cuatro personas.
Viernes a las 7 p. m.
```

```copy-bad es-MX
NOCHE DE JUEGOS!!!
Haz clic aquí
```

## Responsive behavior

The card fills the width of its container and wraps its content at 360, 768, and 1280 px (A-09). Long titles and descriptions break inside the card and never cause horizontal overflow (REQ-028 AC1). Stack cards in one column at 360 px.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `UCard` |
| Props used | `title`, `description` (optional) |
| Slots used | `header`, default, `footer` |
| Theme | `ui.card.slots.root` in `packages/nuxt/app.config.ts` and the `.cn-card` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `card.*`, `radius.card`, `border.width.card` |
| Demos | `apps/showcase/demos/card/` |

```vue
<UCard>
  <template #header>Noche de juegos</template>
  Trae tus dados y tu mazo favorito.
  <template #footer>Viernes a las 7 p. m.</template>
</UCard>
```

## Open items

> **TBD (TBD-04):** The body text color is not decided. The card text reads a placeholder, not a brand value. Owner input needed: a hex.
>
> **TBD (TBD-05):** The neutral scale is not defined. The description text reads a placeholder, not a brand value. Owner input needed: a hex set.
>
> **TBD (TBD-06):** Card and elevated surface colors are not defined (C-05). The card renders on `color.bg.base`, separated by its outline, until OD-05 is decided. Owner input needed: decision OD-05.
>
> **TBD (TBD-10):** "Rounded" has no values. The corner radius follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-11):** "Thick" has no values. The stroke width follows the ADR-0006 placeholder. Owner input needed: values.
>
> **Draft:** The look of the card (a pink outline and pink dividers on the black page, with no glow) is approved (ADR-0018). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `UCard` themed with the pink outline look, the component tokens, and the demos (T8.1) — ADR-0018
