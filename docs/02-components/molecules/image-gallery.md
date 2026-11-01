---
title: Image gallery
slug: image-gallery
layer: component
level: molecule
source: custom
component: CnImageGallery
status: stable
lang: en
brandRules: [BR-03, BR-13]
tokens: [imageGallery, radius.imageGallery, border.width.imageGallery]
demos: [states, playground]
tbd: []
related: [media-card, button, imagery-and-motifs, pagination, motion, accessibility]
since: 1.2.0
updated: 2026-11-01
---

# Image gallery

## Purpose

`CnImageGallery` shows a set of pictures one at a time, with a previous and a next control and one dot for each picture. Use it where one subject has several pictures, such as the photos of one item. Each picture shows whole in a 4:3 frame, as the thumbnail of the [Media card](media-card.md) does (ADR-0056).

**Why custom:** the component starts from Nuxt UI's `UCarousel`, which it composes for the sliding, the swipe, and the arrow keys, and the layer themes it. `UCarousel` cannot serve alone: its slides are bare slots, so a picture that fails to load would show a broken-image icon, which ADR-0057 forbids; its dots are 12 px, under the 24 px target of REQ-028 AC2, and are named from Nuxt UI's locale with no prop to set them; and its arrows sit outside the frame, past the edge of a 360 px page (ADR-0066).

## Anatomy

1. **frame**: the thick pink outline with rounded corners around the pictures, on the pure-black page. It has no glow.
2. **picture**: an image in a 4:3 area, scaled to fit inside it and never cropped. Space around it is black.
3. **previous** and **next**: ghost icon buttons under the frame, at its two ends. The previous control is disabled on the first picture and the next on the last.
4. **dots**: one 24 px circle for each picture, between the two buttons. The dot of the picture that shows is filled pink, and the others are hollow.

A gallery with no pictures renders nothing. A gallery with one picture shows the frame and no controls.

## Tokens and specs

<!-- cn:generated tokens="imageGallery radius.imageGallery border.width.imageGallery" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.imageGallery` | `--cn-border-width-image-gallery` | `3px` | stable |
| `imageGallery.bg` | `--cn-image-gallery-bg` | `#000000` | stable |
| `imageGallery.dot.border` | `--cn-image-gallery-dot-border` | `#8c8c8c` | stable |
| `imageGallery.dot.borderHover` | `--cn-image-gallery-dot-border-hover` | `#ef80ae` | stable |
| `imageGallery.dot.current` | `--cn-image-gallery-dot-current` | `#ef80ae` | stable |
| `imageGallery.focus.color` | `--cn-image-gallery-focus-color` | `#fff488` | stable |
| `imageGallery.focus.offset` | `--cn-image-gallery-focus-offset` | `3px` | stable |
| `imageGallery.focus.style` | `--cn-image-gallery-focus-style` | `solid` | stable |
| `imageGallery.focus.width` | `--cn-image-gallery-focus-width` | `3px` | stable |
| `imageGallery.highlight` | `--cn-image-gallery-highlight` | `#ef80ae` | stable |
| `radius.imageGallery` | `--cn-radius-image-gallery` | `1.25rem` | stable |

<!-- /cn:generated -->

The gallery tokens reference semantic tokens only (REQ-010 AC2), and all of them are `stable`. The frame is brand pink, like the cards (BR-01, ADR-0018), and the stroke and the radius are the cards' steps: `border.width.interactive` and the `container` radius (ADR-0050). The fill is the pure-black card surface (BR-03, ADR-0053). The dot outline is the neutral border color, and the focus ring is the system's focus ring (ADR-0009).

The space uses existing steps of the spacing scale (ADR-0049): `space.md` between the frame and the controls and between the controls, `space.sm` between two dots, and `space.lg` (24 px) for the width and the height of a dot.

Contrast pairs declared for the gallery (REQ-015):

<!-- cn:generated tokens="imageGallery" format="contrast" -->

| Foreground | Background | Usage | Ratio | Minimum | Result |
|---|---|---|---|---|---|
| `imageGallery.highlight` (`#ef80ae`) | `imageGallery.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `imageGallery.dot.border` (`#8c8c8c`) | `imageGallery.bg` (`#000000`) | ui | 6.25:1 | 3.00:1 | pass |
| `imageGallery.dot.borderHover` (`#ef80ae`) | `imageGallery.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `imageGallery.dot.current` (`#ef80ae`) | `imageGallery.bg` (`#000000`) | ui | 8.37:1 | 3.00:1 | pass |
| `imageGallery.focus.color` (`#fff488`) | `imageGallery.bg` (`#000000`) | ui | 18.55:1 | 3.00:1 | pass |

<!-- /cn:generated -->

### Brand rules

> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

The frame has the neon highlight of the cards (BR-12, ADR-0018), and the dots take the thick line work of BR-13. The gallery stays on the pure-black page (BR-03) and draws no glow, because the glow belongs to actions (ADR-0052).

## Variants

The gallery has one look. It changes with the number of pictures, not with a prop.

| Pictures | What shows |
|---|---|
| none | Nothing. |
| one | The frame, with no arrows and no dots. |
| two or more | The frame, the arrows, and one dot for each picture. |

A picture with no `src`, or one that fails to load, shows the brand d20 on black in the same frame, marked decorative (ADR-0057).

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | The first picture in the pink frame. The previous control is disabled, the first dot is filled, and the other dots are hollow. | `imageGallery.highlight`, `imageGallery.dot.current`, `imageGallery.dot.border` |
| `hover` | The outline of a dot that is not current turns pink. | `imageGallery.dot.borderHover` |
| `focus-visible` | A yellow ring outside the frame when the gallery has focus, and outside a dot when a dot has it. | `imageGallery.focus.color`, `imageGallery.focus.width`, `imageGallery.focus.offset`, `imageGallery.focus.style` |
| `selected` | A picture other than the first shows, and its dot is the filled one. | `imageGallery.dot.current` |
| `disabled` | The previous control on the first picture and the next control on the last are natively disabled, cannot be focused, and Nuxt UI dims them. | none |
| `error` | A picture that fails to load, or has no `src`, shows the d20 on black in the same frame. | `imageGallery.bg` |
| `empty` | A gallery with no pictures renders nothing: no element, no space. | none |

A gallery has no `active` (pressed) state of its own: pressing a dot or an arrow shows that picture, and `selected` covers it. It has no loading state: the page that fetches the pictures decides what to show meanwhile (see [Loading](../../03-patterns/loading.md)). The state matrix on the component page shows every row, and each state has a visual baseline.

## Usage rules

### When to use

- Use a gallery when one subject has several pictures and they should share one place on the page.
- Pass `items` with a `src` and an `alt` for each picture, or `decorative: true` when the text near the gallery already says what the picture shows.
- Pass `label` with the name of the gallery, and `labels` with the name of each control, in the language of the page (see Content).
- Put the picture people need to see first at the start. The gallery opens on the first picture.
- Pass every word through a prop. The component never holds copy (A-11).

### When not to use

- Never use a gallery for one picture. Show a [Media card](media-card.md) thumbnail or a plain image.
- Never use it to move between pages of results. Use [Pagination](pagination.md).
- Never put a link, a button, or text in a picture. A picture is an image, and a control inside a slide is an unexplained tab stop.
- Never crop a picture, change the 4:3 frame, or add a photo style (ADR-0056, ADR-0057).
- Never write a color, width, or space literally on the gallery. Read the tokens (REQ-016).
- Never start the gallery moving on its own. It moves only when a person asks it to.

## Do and don't

| Do | Don't |
|---|---|
| Give each picture an `alt` that says what it shows. | Repeat the same text for every picture. |
| Give the controls es-MX names with the position. | Leave Nuxt UI's English names on a Spanish page. |
| Let a picture of any shape show whole in the frame. | Crop it to fill the frame. |
| Keep the dots for a few pictures. | Show a dot for each of dozens of pictures. |

## Accessibility

- The gallery is a `role="region"` with `aria-roledescription="carousel"` and the name you pass in `label`, set by `UCarousel`. Each slide is a `role="group"` with `aria-roledescription="slide"`.
- The region takes one tab stop, and the arrow keys change the picture while it has focus. The two buttons and the dots are real `<button>` elements with names from `labels`.
- The current dot has `aria-current="true"` and is also the filled one, so the current picture is not told by color alone (WCAG 1.4.1). A visually hidden live region announces the position, such as "Imagen 2 de 5", each time the picture changes.
- A picture has `alt`, or `alt=""` and `aria-hidden="true"` when it is `decorative`. The d20 fallback is always decorative.
- The focus ring shows on `:focus-visible`: around the frame for the region, and around a dot. The ring is an outline, not the glow, and it is 18.55:1 against the page (REQ-024 AC1, AC2).
- A dot is 24 × 24 px, and the arrow buttons are larger (REQ-028 AC2).
- The previous control on the first picture and the next control on the last are disabled, so they are announced as unavailable and skipped by Tab.
- Under `prefers-reduced-motion: reduce` the picture changes at once, with no sliding (REQ-029 AC2).

Keyboard map (each row has a Playwright test, REQ-027 AC2):

| Key | Result |
|---|---|
| Tab | Moves focus to the gallery, then to the previous control, the dots, and the next control. A disabled control is skipped. |
| Shift + Tab | Moves focus to the previous stop. |
| Arrow Right | With focus on the gallery, shows the next picture. |
| Arrow Left | With focus on the gallery, shows the previous picture. |
| Enter | On a control or a dot, shows that picture. |
| Space | On a control or a dot, shows that picture. |

ARIA: `role="region"`, `aria-roledescription`, and `aria-label` on the gallery; `aria-label` on each control and dot; `aria-current="true"` on the current dot; `aria-live="polite"` on the position text.

## Content

- Name the gallery for what it shows: "Fotos del juego".
- Name the arrows with the action: "Imagen anterior", "Imagen siguiente".
- Name each dot with the action and the position: "Ir a la imagen 3". Name the group of dots: "Imágenes".
- Announce the position with the number and the total: "Imagen 3 de 5".
- Write an `alt` that says what the picture shows, in a short phrase, without "imagen de" or "foto de".

```copy es-MX
Fotos del juego
Imagen anterior
Ir a la imagen 3
Imagen 3 de 5
```

```copy-bad es-MX
Previous
Go to slide 3
>>
```

## Responsive behavior

The frame fills the width of its container at 360, 768, and 1280 px (A-09), and the 4:3 ratio holds at every width, so the gallery is as tall as three quarters of its width. The controls sit under the frame in one row, so nothing sits outside the container and the page never overflows (REQ-028 AC1, ER-05). The dots wrap onto a second line when there are more than fit. Give the gallery a maximum width in the page when a full-width 4:3 picture would be too tall.

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Import | Auto-imported from the `@vinsmokemau/cup-noobles-nuxt` layer as `CnImageGallery` (`packages/nuxt/components/CnImageGallery.vue`) |
| Nuxt UI component | `UCarousel`, composed |
| Theme | `ui.carousel` in `packages/nuxt/app.config.ts` and the `.cn-carousel*` and `.cn-image-gallery*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `imageGallery.*`, `radius.imageGallery`, `border.width.imageGallery` |
| Demos | `apps/showcase/demos/image-gallery/` |

| Prop | Type | Notes |
|---|---|---|
| `items` | `{ src?: string; alt: string }[]`, or `{ src?: string; decorative: true }` | Required. The pictures, in order. Each needs `alt`, or `decorative: true`. An empty array renders nothing. |
| `label` | `string` | Required. The accessible name of the gallery. |
| `labels` | `{ previous, next, dots, dot(position, total), position(position, total) }` | Required. The names of the controls and the announcement of the position. |

```vue
<CnImageGallery
  label="Fotos del juego"
  :items="[
    { src: '/fotos/caja.jpg', alt: 'La caja del juego, vista de frente' },
    { src: '/fotos/cartas.jpg', alt: 'Cartas sobre una mesa' },
  ]"
  :labels="{
    previous: 'Imagen anterior',
    next: 'Imagen siguiente',
    dots: 'Imágenes',
    dot: (position) => `Ir a la imagen ${position}`,
    position: (position, total) => `Imagen ${position} de ${total}`,
  }"
/>
```

## Open items

Not applicable.

## Changelog

- 1.2.0 — First version: `CnImageGallery`, a gallery of pictures over `UCarousel` with the 4:3 whole-picture frame, the d20 fallback, and the `imageGallery` tokens, and the demos — DSR-03, T15.3, ADR-0066
