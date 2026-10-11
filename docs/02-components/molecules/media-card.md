---
title: Media card
slug: media-card
layer: component
level: molecule
source: custom
component: CnMediaCard
status: draft
lang: en
brandRules: [BR-03, BR-12, BR-13]
tokens: [mediaCard, radius.mediaCard, border.width.mediaCard, color.surface.card]
demos: [states, playground]
tbd: [TBD-06, TBD-10, TBD-20]
related: [card, badge, link, imagery-and-motifs, accessibility, shape]
since: 0.1.0
updated: 2026-10-11
---

# Media card

## Purpose

`CnMediaCard` is the featured media card of BR-12: a thumbnail, a title, and one or more tag badges, optionally as one link to another page. It has the same look as the standard [Card](card.md): the pure-black page (BR-03) set apart by a thick brand-pink outline, with no glow (ADR-0018, ADR-0026). Use it to feature one item, such as an article, an event, or a show.

**Why custom:** Nuxt UI has no equivalent. The nearest component, `UCard`, has no thumbnail that requires a text alternative and no way to make the whole card a link with a single tab stop and the title as its name. `CnMediaCard` still composes Nuxt UI parts: `ULink` for the link and `UBadge` for the tags.

## Anatomy

1. **container**: the framed block, an `<article>`. It has the page's black fill, the pink outline, and the rounded corners.
2. **thumbnail**: the picture at the top, from the `src` prop or the `thumbnail` slot. It keeps its own proportions.
3. **divider**: the pink line between the thumbnail and the text. It is drawn only when a thumbnail exists.
4. **title**: a heading (`h3` by default). When the card has a `to` target, the title is the link.
5. **tags**: one yellow tag badge for each label in `tags`. They are not interactive.

## Tokens and specs

<!-- cn:generated tokens="mediaCard radius.mediaCard border.width.mediaCard color.surface.card" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.mediaCard` | `--cn-border-width-media-card` | `3px` | stable |
| `color.surface.card` | `--cn-color-surface-card` | `#90a1b9` | tbd (TBD-06) |
| `mediaCard.bg` | `--cn-media-card-bg` | `#000000` | stable |
| `mediaCard.divider` | `--cn-media-card-divider` | `#ef80ae` | stable |
| `mediaCard.fg` | `--cn-media-card-fg` | `#f5f5f5` | stable |
| `mediaCard.focus.color` | `--cn-media-card-focus-color` | `#fff488` | stable |
| `mediaCard.focus.offset` | `--cn-media-card-focus-offset` | `3px` | stable |
| `mediaCard.focus.style` | `--cn-media-card-focus-style` | `solid` | stable |
| `mediaCard.focus.width` | `--cn-media-card-focus-width` | `3px` | stable |
| `mediaCard.highlight` | `--cn-media-card-highlight` | `#ef80ae` | stable |
| `radius.mediaCard` | `--cn-radius-media-card` | `0.375rem` | tbd (TBD-10) |

<!-- /cn:generated -->

The media card tokens reference semantic tokens only (REQ-010 AC2). The fill, the outline, the divider, and the focus ring are `stable`: black and brand pink, and the brand yellow of the focus indicator (BR-01, BR-02, BR-03). The corner radius follows a placeholder (TBD-10), so it is `tbd` until the owner supplies it. The title color and the stroke width are `stable` (ADR-0032).

The card does not read `color.surface.card`. The table lists it so the open item is visible: no card surface color is defined (TBD-06, C-05), and the card renders on `color.bg.base` until OD-05 is decided.

Contrast pairs declared for the media card (REQ-015):

<!-- cn:generated tokens="mediaCard" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `mediaCard.fg` (`#f5f5f5`) | `mediaCard.bg` (`#000000`) | text | 19.26:1 | 4.50:1 | pass |
| `mediaCard.highlight` (`#ef80ae`) | `mediaCard.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `mediaCard.divider` (`#ef80ae`) | `mediaCard.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `mediaCard.focus.color` (`#fff488`) | `mediaCard.bg` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

The tag badges use the `tag` badge pairs, which pass: black on yellow is 18.55:1 (see [Badge](../atoms/badge.md)).

### Brand rules

> **BR-12:** Cards have a dark surface with neon highlights. There are two card types: a standard content card, and a featured media card (thumbnail, title, and tag badge).
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The neon highlight is the pink outline and the pink line under the thumbnail. There is no glow on the card (ADR-0018). Pink on black is 8.37:1 (SPEC.md §2.1). The thumbnail has no declared aspect ratio, because the photography and thumbnail standards are TBD-20.

## Variants

The media card has one brand look. It has one structural variant: linked or not linked.

| Variant | Props | What changes |
|---|---|---|
| Linked | `to` | The title is a link, and its hit area covers the whole card. The hover, active, and focus-visible states apply. |
| Not linked | none | The card only shows content. It has no focusable element and no interactive states. |

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Black fill, pink outline, pink line under the thumbnail, yellow tag badges. | `mediaCard.bg`, `mediaCard.highlight`, `mediaCard.divider`, `radius.mediaCard`, `border.width.mediaCard` |
| `hover` | The title is underlined. Nothing changes color. | None |
| `focus-visible` | A yellow ring surrounds the whole card, outside the outline. The ring shows for keyboard focus, never on a mouse click. | `mediaCard.focus.color`, `mediaCard.focus.width`, `mediaCard.focus.offset`, `mediaCard.focus.style` |
| `active` | The title stays underlined. No shade is defined for a pressed card (TBD-08), so it looks like hover. | None |

The `hover`, `focus-visible`, and `active` states exist only on a linked card. A card has no `disabled` state: a card that must not be followed is simply not given a `to`. The thumbnail and the tags are not interactive.

## Usage rules

### When to use

- Use a media card to feature one item that has a picture, a name, and a few categories.
- Give `to` when the whole card goes to one page. Leave it out when the card only shows content.
- Give every thumbnail `alt`, or set `decorative` when the title already says everything the image shows (REQ-025 AC2).
- Keep tag labels to one or two words.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never use a media card for plain grouped content with header, body, and footer. Use [Card](card.md).
- Never put a link, a button, or a field inside the card. A linked card has exactly one tab stop, and a second control would nest an interactive element in a link.
- Never make a tag badge a filter or a link inside the card.
- Never write a color, radius, or width literally on the card. Read the tokens (REQ-016).
- Never add a glow to a card. The glow belongs to buttons (BR-10).
- Never set a fixed thumbnail ratio or crop on your own. Those are TBD-20.

## Do and don't

| Do | Don't |
|---|---|
| Give the thumbnail alt text that says what the image shows: "Un dado de veinte caras dorado". | Give every thumbnail the same generic alt text, or leave it out. |
| Let a long title wrap inside the card. | Truncate a title that people need to read. |
| Use one to three tag badges. | Fill the card with tags until the text is pushed down. |
| Make the title the link and let it cover the card. | Wrap the card in a second link around the picture. |

## Accessibility

- The card is an `<article>`. The title is a heading, so assistive technology can navigate to it. Pass `as` to match the heading level of the page.
- A linked card has exactly one focusable element: the title link (REQ-025 AC4). The thumbnail, the tags, and the card container take no focus and add no tab stop. The link's text is the title, so the card's accessible name is its title.
- The thumbnail is an `<img>` with `alt`, or with an empty `alt` and `aria-hidden="true"` when `decorative`. A card with a thumbnail and neither `alt` nor `decorative` is a type error in a consumer's template, and it logs a warning in development, also for a thumbnail given in the `thumbnail` slot.
- The focus indicator is a yellow ring around the whole card on the black page, 18.55:1, never the glow (REQ-024 AC1). It shows on keyboard focus only (`:focus-visible`).
- The pink outline is 8.37:1 against the page, so the card boundary is perceivable (REQ-015, WCAG 1.4.11). Hover is shown by an underline, so it does not rely on color (WCAG 1.4.1).
- The hit area of the link is the whole card, so the target is far larger than 24 × 24 px (REQ-028 AC2).

Keyboard map (a linked card):

| Key | Action |
|---|---|
| `Tab` | Moves focus to the card, or past it. One stop per card. |
| `Shift` + `Tab` | Moves focus to the previous stop. |
| `Enter` | Follows the link. |

ARIA: no `role` or `aria-*` attribute is added except `aria-hidden="true"` on a decorative thumbnail. The element roles are native: `article`, heading, link, and image.

## Content

- Write the title as a noun phrase of one to six words, in sentence case.
- Write tag labels as one or two words.
- Write the alt text as a short description of what the image shows, not "imagen de".

```copy es-MX
Noche de juegos de mesa
Anime
Cartas
Un dado de veinte caras dorado
```

```copy-bad es-MX
HAZ CLIC AQUÍ PARA VER MÁS!!!
Imagen
```

## Responsive behavior

The card fills the width of its container and the thumbnail scales with it, keeping its own proportions (TBD-20). A long title breaks inside the card and never causes horizontal overflow at 360, 768, and 1280 px (REQ-028 AC1, ER-05, A-09). The tags wrap onto more lines. Stack cards in one column at 360 px.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnMediaCard` (`packages/nuxt/components/CnMediaCard.vue`) |
| Theme | The `.cn-media-card*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `mediaCard.*`, `radius.mediaCard`, `border.width.mediaCard` |
| Demos | `apps/showcase/demos/media-card/` |

| Prop | Type | Notes |
|---|---|---|
| `title` | `string` | Required. The title, and the accessible name of a linked card. |
| `src` | `string` | The thumbnail image. Needs `alt` or `decorative`. |
| `alt` | `string` | The thumbnail's text alternative. |
| `decorative` | `boolean` | Marks the thumbnail as decoration. It is hidden from assistive technology. |
| `tags` | `string[]` | One tag badge for each label. |
| `to` | `string` | The link target. When set, the whole card is one link. |
| `as` | `'h2' \| 'h3' \| 'h4'` | The heading level of the title. Default `h3`. |

| Slot | Notes |
|---|---|
| `thumbnail` | A thumbnail of your own, in place of `src`. It receives `alt` and `decorative`, which it must apply to its image. |

```vue
<CnMediaCard
  title="Noche de juegos de mesa"
  src="/media/dado.webp"
  alt="Un dado de veinte caras dorado"
  :tags="['Anime', 'Cartas']"
  to="/eventos/noche-de-juegos"
/>
```

## Open items

> **TBD (TBD-06):** Card and elevated surface colors are not defined (C-05). The card renders on `color.bg.base`, separated by its outline, until OD-05 is decided. Owner input needed: decision OD-05.
>
> **TBD (TBD-10):** "Rounded" has no values. The corner radius follows the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-20):** Photography and thumbnail standards are not defined: subject, style, aspect ratios, and crops. The thumbnail keeps its own proportions until then. Owner input needed: guidelines.
>
> **Draft:** The look of the card (a pink outline, an underlined title on hover, and the yellow focus ring around the card, with no glow) is approved (ADR-0026). The doc stays a draft until the placeholders in the TBD callouts above are replaced.

## Changelog

- 0.1.0 — First draft: `CnMediaCard` with a thumbnail, a title, tag badges, an optional link with one tab stop, the component tokens, and the demos (T8.2) — ADR-0026
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
