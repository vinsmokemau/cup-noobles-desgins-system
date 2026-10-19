---
title: Slideover
slug: slideover
layer: component
level: organism
source: nuxt-ui
nuxtUi: USlideover
status: stable
lang: en
brandRules: [BR-03, BR-12, BR-13, BR-15]
tokens: [overlay, radius.overlay, border.width.overlay, effect.scrim]
demos: [states, playground]
tbd: []
related: [modal, card, button, effects, accessibility]
since: 0.1.0
updated: 2026-10-19
---

# Slideover

## Purpose

The slideover is a panel that slides in from one edge of the screen on top of the page. It holds content people may want to keep beside the page, such as a filter list, a short form, or the mobile navigation (T8.6). It is a themed Nuxt UI `USlideover`, styled only through tokens (C-03), and it shares the look and the tokens of [Modal](modal.md): a black panel with a thick brand-pink outline over a dimmed backdrop (BR-03, BR-12, BR-13, ADR-0029). For a decision that must be answered first, use [Modal](modal.md).

## Anatomy

1. **backdrop**: the dimmed layer over the page. It is pure black at 85% (ADR-0054).
2. **panel**: the framed panel, attached to one edge. It has the page's black fill and the pink outline.
3. **header**: the title and the description, with the close button at the end.
4. **body**: the main content, passed to the `body` slot. It scrolls when it is taller than the panel.
5. **footer**: the optional actions, passed to the `footer` slot.
6. **dividers**: the pink lines between header, body, and footer.

## Tokens and specs

<!-- cn:generated tokens="overlay radius.overlay border.width.overlay effect.scrim" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.overlay` | `--cn-border-width-overlay` | `3px` | stable |
| `effect.scrim.opacity` | `--cn-effect-scrim-opacity` | `0.85` | stable |
| `overlay.bg` | `--cn-overlay-bg` | `#000000` | stable |
| `overlay.divider` | `--cn-overlay-divider` | `#ef80ae` | stable |
| `overlay.fg` | `--cn-overlay-fg` | `#f5f5f5` | stable |
| `overlay.fgMuted` | `--cn-overlay-fg-muted` | `#bdbdbd` | stable |
| `overlay.highlight` | `--cn-overlay-highlight` | `#ef80ae` | stable |
| `overlay.scrim` | `--cn-overlay-scrim` | `#000000` | stable |
| `overlay.scrimOpacity` | `--cn-overlay-scrim-opacity` | `0.85` | stable |
| `overlay.shadow` | `--cn-overlay-shadow` | `none` | stable |
| `overlay.z` | `--cn-overlay-z` | `50` | stable |
| `radius.overlay` | `--cn-radius-overlay` | `1.25rem` | stable |

<!-- /cn:generated -->

The slideover reads the same tokens as the modal, so a change to the overlay look changes both. The fill, the outline, the dividers, and the backdrop color are `stable`. The backdrop amount (0.85), the shadow (none), and the stacking order (50) are `stable` (ADR-0054). The corner radius is `stable`: the panel uses the large radius step, the same as the modal (ADR-0050; the step is assigned by T13.3). The fill is `color.surface.elevated`, the pure-black page (ADR-0053). The text colors and the stroke width are `stable` (ADR-0032).

Contrast pairs declared for the overlays (REQ-015) are listed in [Modal](modal.md#tokens-and-specs).

### Brand rules

> **BR-12:** Cards have a dark surface with neon highlights. There are two card types: a standard content card, and a featured media card (thumbnail, title, and tag badge).
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.
>
> **BR-15:** The system is responsive and works on both mobile and web/dashboard layouts.

The brand context does not describe a panel. It takes the card's look (ADR-0029). BR-15 is why the panel fills the screen width on a phone, and is a side panel on a wide screen.

## Variants

The slideover has one brand look. The Nuxt UI props below change where it sits.

| Brand look | Nuxt UI props | Result |
|---|---|---|
| right (default) | `side="right"` | A panel against the right edge, at most 28 rem wide |
| left | `side="left"` | A panel against the left edge, at most 28 rem wide |
| top | `side="top"` | A panel against the top edge, full width |
| bottom | `side="bottom"` | A panel against the bottom edge, full width |
| inset | `inset` | A panel that floats one rem from the edges, with all four corners rounded |

A panel that touches the edge of the screen rounds only the corners that do not touch it. The close button takes the brand ghost look through `:close="{ color: 'primary', variant: 'ghost' }"`.

## States

| State | What changes | Tokens |
|---|---|---|
| `default` | Open and at rest, from the right edge: the dimmed backdrop, and the black panel with the pink outline and pink dividers. | `overlay.bg`, `overlay.highlight`, `overlay.divider`, `overlay.scrim`, `overlay.scrimOpacity`, `radius.overlay`, `border.width.overlay` |

Closed, the slideover renders nothing. It is not a control, so it has no hover, focus-visible, active, or disabled state of its own. The buttons inside it show their own states. The matrix shows the real panel, open and drawn inside its cell, so the baseline keeps it in frame. The close button shows the yellow focus ring in the baseline, because focus moves into the panel when it opens (ADR-0009). The four sides are in the playground.

## Usage rules

### When to use

- Use a slideover for content that people read or fill in beside the page, such as filters or a short form.
- Always give it a `title`, and a `description` when the title alone is not enough.
- Use `side="bottom"` for a short list of actions on a phone, and `side="right"` for a panel on a wide screen.
- Pass every text through a prop or a slot. The component never holds copy (A-11).

### When not to use

- Never use a slideover for a decision that must be answered before going on. Use [Modal](modal.md).
- Never open a slideover from a modal, or a modal from a slideover.
- Never write a color, radius, width, or z-index literally on a slideover. Read the tokens (REQ-016).
- Never add a glow to the panel. The glow belongs to buttons (BR-10).
- Never rebuild a panel by hand. Nuxt UI provides it (ER-01, REQ-020 AC3).
- Never open a [Toast](../molecules/toast.md) while a slideover is open. The toast sits above the slideover in the bottom-right corner and can cover its actions (ADR-0054, ADR-0060).
- Never rely on the page behind the slideover for context. At 85% it is nearly invisible, which is the owner's choice (ADR-0054, ADR-0060).

## Do and don't

| Do | Don't |
|---|---|
| Name what is in the panel in its title: "Filtros". | Title it "Panel" or leave it empty. |
| Put the apply and cancel actions in the footer. | Make people scroll to find them. |
| Let the body scroll inside the panel. | Let the page behind scroll. |
| Return focus to the button that opened it. Nuxt UI does this. | Leave focus in the panel after it closes. |

## Accessibility

- The panel has `role="dialog"`. Its accessible name is the title (`aria-labelledby`), and its description is linked with `aria-describedby`. Always pass `title`.
- Focus moves into the panel when it opens, and is trapped there: Tab and Shift+Tab cycle through the panel only.
- Escape closes the panel and returns focus to the control that opened it.
- The page behind is switched off while the panel is open: hidden from assistive technology (`aria-hidden="true"`), its controls cannot be reached by Tab, and clicks on it hit the backdrop. Reka UI does this with `aria-hidden` and a focus trap, not with the HTML `inert` attribute.
- Text is 4.5:1 or more against the fill, and the pink outline is 8.37:1 (REQ-015, WCAG 1.4.11).
- The slide and fade stop under `prefers-reduced-motion: reduce`.

Keyboard map:

| Key | Action |
|---|---|
| `Tab` | Moves focus to the next control in the panel, and from the last one to the first |
| `Shift+Tab` | Moves focus to the previous control in the panel, and from the first one to the last |
| `Escape` | Closes the panel and returns focus to the opening control. It does nothing when `dismissible` is false |
| `Enter` or `Space` | Activates the focused button, including the close button |

ARIA: `role="dialog"`, `aria-labelledby` (the title), `aria-describedby` (the description). While it is open, the page behind has `aria-hidden="true"`.

## Content

- Write the title as a noun phrase of one to three words.
- Write the description as one short sentence, in sentence case.
- Write footer actions as verbs: "Aplicar", "Cancelar".

```copy es-MX
Filtros
Elige qué juegos quieres ver.
Aplicar
Cancelar
```

```copy-bad es-MX
PANEL!!!
Haz clic aquí
```

## Responsive behavior

At 360 px a side panel fills the screen width, so it works as a full-screen sheet. At 768 and 1280 px it is at most 28 rem wide and sits against its edge (A-09). A tall body scrolls inside the panel and the page behind never scrolls. Nothing causes horizontal overflow (REQ-028 AC1).

## Email notes

Not applicable.

## Code reference

| Item | Value |
|---|---|
| Nuxt UI component | `USlideover` |
| Props used | `title`, `description`, `side`, `inset`, `dismissible`, `close` |
| Slots used | default (the trigger), `body`, `footer` |
| Theme | `ui.slideover` in `packages/nuxt/app.config.ts` and the `.cn-overlay-*` rules in `packages/nuxt/assets/css/main.css` |
| Tokens | `overlay.*`, `radius.overlay`, `border.width.overlay`, `effect.scrim.opacity` |
| Demos | `apps/showcase/demos/slideover/` |

```vue
<USlideover title="Filtros" description="Elige qué juegos quieres ver." side="right" :close="{ color: 'primary', variant: 'ghost' }">
  <UButton label="Abrir filtros" />
  <template #body>Cartas, juegos de mesa y figuras.</template>
  <template #footer="{ close }">
    <UButton label="Aplicar" @click="close" />
  </template>
</USlideover>
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: `USlideover` themed with the pink outline look, the shared component tokens, and the demos (T8.5) — ADR-0029
- 0.1.0 — Text, neutral, feedback, stroke, and motion values are set by the owner, and the placeholders for them are gone — ADR-0032
- 0.1.0 — Approved as stable by the owner, with every point of the draft callouts decided. No value or rule changes — ADR-0060
