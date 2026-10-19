---
title: Email layouts
slug: email-layouts
layer: email
status: stable
lang: en
brandRules: [BR-01, BR-03, BR-10, BR-13, BR-15, BR-16]
tokens: [layout.email, logo.rule, space, color.bg.base, siteHeader, siteFooter, card, separator]
tbd: []
related: [email-foundations, email-components, logo, spacing, layout, accessibility]
since: 0.1.0
updated: 2026-10-19
---

# Email layouts

## Purpose

This doc describes the one reference layout of a Cup Noobles email, and the plain-text counterpart of every layout (REQ-043). The reference layout composes the six [email components](email-components.md) in a fixed order, on the pure-black base of BR-03, and compiles to `packages/email/dist/reference.html`. It renders with no horizontal scroll at 320 and 600 px (REQ-043 AC1), so it is safe at every width a client gives it. It keeps the logo first (BR-16) and the thick line work of BR-13, and it carries no domain content: the sending project fills every slot (ER-09).

## Tokens and specs

The layout introduces no value of its own. It reads the tokens of its components, and the tokens below set its frame: the body width, the base, the logo clear space, and the three spacing steps its parts use.

<!-- cn:generated tokens="layout.email.width.max color.bg.base logo.rule.clearSpace logo.rule.minHeight.horizontal space.sm space.md space.lg" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `color.bg.base` | `--cn-color-bg-base` | `#000000` | stable |
| `layout.email.width.max` | `--cn-layout-email-width-max` | `600px` | stable |
| `logo.rule.clearSpace` | `--cn-logo-rule-clear-space` | `0.25` | stable |
| `logo.rule.minHeight.horizontal` | `--cn-logo-rule-min-height-horizontal` | `36px` | stable |
| `space.lg` | `--cn-space-lg` | `1.5rem` | stable |
| `space.md` | `--cn-space-md` | `1rem` | stable |
| `space.sm` | `--cn-space-sm` | `0.5rem` | stable |

<!-- /cn:generated -->

### Structure

The layout has one column, at most `layout.email.width.max` wide, and it shrinks to the client. Its parts come in this order, and none is optional:

| # | Part | Component | Slots |
|---|---|---|---|
| 1 | Header with the logo | `header` | `{{ home_url }}`, `{{ logo_url }}`, `{{ logo_alt }}` |
| 2 | Heading and text | `content-section` | `{{ heading }}`, `{{ body }}` |
| 3 | Framed group | `card` | `{{ card_title }}`, `{{ card_body }}`, `{{ card_footer }}` |
| 4 | Main action | `button` | `{{ button_url }}`, `{{ button_label }}` |
| 5 | Break | `divider` | None |
| 6 | Closing line and link | `footer` | `{{ footer_text }}`, `{{ footer_link_url }}`, `{{ footer_link_label }}` |

The page base is `color.bg.base` in every part, set as both the `bgcolor` attribute and the inline `background` (see [Email foundations](email-foundations.md)). Every padding is a step of the spacing scale (ADR-0049): text blocks and the button use `space.md`, the card and the footer use `space.lg`, and the divider section uses `space.sm`. The header keeps the logo clear space, below. The layout shrinks to 320 px with no horizontal scroll.

### Logo clear space

The header keeps the clear space of ADR-0016 around the logo: 25% of the logo height on every side. The logo is `logo.rule.minHeight.horizontal` high, and the clear space is `logo.rule.clearSpace` of that height. The build computes the length from the two tokens with `$cn(logo.rule.clearSpace*logo.rule.minHeight.horizontal)` (ADR-0042), so the header holds no length of its own and the clear space follows the tokens.

### Widths

| Width | Behavior |
|---|---|
| 600 px and wider | The body is `layout.email.width.max` wide and centered. |
| Narrower than 600 px | The body takes the width of the client, and the parts keep their order. |
| 320 px | No part is wider than the client, and the page does not scroll sideways. |

## Usage rules

### When to use

- Start an email from the reference layout, and fill every slot with content from the sending system (A-11).
- Keep the parts in the order of the structure table. The header is first and the footer is last.
- Write the copy in es-MX (ER-04), and keep it short enough to read at 320 px.
- Send the plain-text counterpart with the HTML, as the second part of a multipart message.

### When not to use

- Never add a part that the six components do not provide, and never write a hex color, a font, or a size in a layout source (REQ-042 AC2).
- Never set a fixed width wider than `layout.email.width.max`, and never let a block force horizontal scroll at 320 px.
- Never use the layout for commerce parts such as a product list or a price. The sending project builds those from the components (C-02).
- Never put a headline, a date, a code, or a link label only in an image.

## Accessibility

- Every part sets its text color and its background together, so a client that inverts colors changes the pair (see [Email foundations](email-foundations.md)).
- The logo is an image with an `alt` slot, so the words "Cup Noobles" show when images are off. The heading outline is an `h2` for the content section and an `h3` for the card title.
- The button and the footer link are real text, and their text says where they go.
- The root sets `lang="es-MX"` (ADR-0004).
- The plain-text counterpart carries every text and every link address of the HTML, so a reader of either part gets the same content (REQ-043 AC2).

## Code reference

Compile the layout with `pnpm --filter @vinsmokemau/cup-noobles-email build`. The source is `packages/email/src/layouts/reference.mjml`, and it becomes `packages/email/dist/reference.html`. The source holds one `<mj-include path="../components/<name>.mjml" />` for each part. The build expands each include with the content of that component before it injects tokens, so a component renders the same alone and in the layout. An included file must have the same `<mj-head>` and `<mj-body>` tag as the layout, or the build fails (ADR-0042).

The layout has the 13 slots of its components, and the slot names are unique across components, so none clashes. The compiled file is about 20 KB, well under the roughly 102 KB at which Gmail clips a message (ADR-0004).

### Plain-text counterpart

Every layout has a plain-text counterpart. The sending system writes it from the same slot values as the HTML, and sends it as the `text/plain` part of the message. The reference layout's counterpart has these blocks, in order, with a blank line between blocks:

| # | Block | Lines |
|---|---|---|
| 1 | Header | `{{ logo_alt }}: {{ home_url }}` |
| 2 | Content section | `{{ heading }}`, then a blank line, then `{{ body }}` |
| 3 | Card | `{{ card_title }}`, then `{{ card_body }}`, then `{{ card_footer }}` |
| 4 | Button | `{{ button_label }}: {{ button_url }}` |
| 5 | Divider | A line of three hyphens, `---` |
| 6 | Footer | `{{ footer_text }}`, then `{{ footer_link_label }}: {{ footer_link_url }}` |

The rules of the counterpart:

- It is plain text in UTF-8, with no markup and no images. The logo appears as its alt text.
- Every link is written as its label, a colon, and the full address, so the address is visible and can be followed.
- It holds every slot of the HTML except `{{ logo_url }}`, the address of an image, in the order of the parts, so no text or link of the HTML is missing from it.
- It keeps the copy in es-MX.

The structure with sample es-MX values:

```copy es-MX
Cup Noobles: https://example.com/

Tu pedido está en camino

Hola, tu pedido salió de nuestro almacén y llegará en los próximos días.

Resumen del pedido
Tres artículos enviados a una sola dirección.
Si algo no es correcto, responde a este correo.

Ver mi pedido: https://example.com/pedido

---

Recibiste este correo porque hiciste un pedido.
Centro de ayuda: https://example.com/ayuda
```

## Open items

Real-client rendering is not verified here (R-05). It belongs to the consuming project.

## Changelog

- 0.1.0 — First draft: the reference layout of the six components, its widths, the logo clear space, and the plain-text counterpart (T10.4, REQ-043)
- 0.1.0 — Part order, plain-text blocks, and logo clear space approved by the owner. The doc stays a draft while TBD-01, TBD-03, TBD-09, and TBD-10 are open — ADR-0042
- 0.1.0 — The display typeface and the type scale are set by the owner, so the TBD-01 and TBD-03 callouts are gone. The doc stays a draft while TBD-09 and TBD-10 are open — ADR-0046, ADR-0047, ADR-0048, ADR-0058
- 0.1.0 — The spacing scale and the corner radius are set by the owner, so the TBD-09 and TBD-10 callouts are gone. The parts take their padding from the scale (T13.3) — ADR-0049, ADR-0050
- 0.1.0 — No TBD item is left, and the doc moves to stable — ADR-0042, ADR-0049, ADR-0050
