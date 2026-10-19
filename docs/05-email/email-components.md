---
title: Email components
slug: email-components
layer: email
status: draft
lang: en
brandRules: [BR-01, BR-03, BR-10, BR-12, BR-13, BR-16]
tokens: [button.primary, border.width.button, radius.button, card, border.width.card, radius.card, siteHeader, border.width.siteHeader, siteFooter, border.width.siteFooter, separator, border.width.separator, link.fg, font.family, font.h2, font.h3, color.bg.base, color.text, logo.rule, layout.email, space]
tbd: [TBD-09, TBD-10, TBD-12]
related: [email-foundations, email-layouts, button, card, separator, site-header, site-footer, logo, typography, spacing]
since: 0.1.0
updated: 2026-10-18
---

# Email components

## Purpose

This doc describes the six components of a Cup Noobles email: the button, the header with the logo, the content section, the card, the divider, and the footer (REQ-041 AC3). Each one is an MJML source in `packages/email/src/components/` that the email build compiles to one static HTML file, so a backend can copy its markup (§4.9). Every color, font, size, border, and radius is a token injected at build time (REQ-042), and every piece of content is a `{{ slot_name }}` placeholder (REQ-041 AC4). The components follow the fallbacks in [Email foundations](email-foundations.md): a solid thick border in place of the glow (BR-10, BR-13), a radius that may render square, and a text fallback for the logo (BR-16).

Each component reads the tokens of its web counterpart: the button reads the primary button tokens, the card reads the card tokens (ADR-0018), the header and footer read the site header and footer tokens (ADR-0030), and the divider reads the separator tokens (ADR-0015). It introduces no value of its own. The owner approved this mapping (ADR-0041).

## Tokens and specs

The tokens the components read are generated below. The build replaces each `$cn(token.path)` in a source with the literal in `email-tokens.json`, and writes a `rem` dimension as px (ADR-0040). Several of them are `tbd`, and their values are ADR-0006 placeholders, not brand values.

<!-- cn:generated tokens="button.primary border.width.button radius.button card border.width.card radius.card siteHeader border.width.siteHeader siteFooter border.width.siteFooter separator border.width.separator link.fg" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `border.width.button` | `--cn-border-width-button` | `3px` | stable |
| `border.width.card` | `--cn-border-width-card` | `3px` | stable |
| `border.width.separator` | `--cn-border-width-separator` | `3px` | stable |
| `border.width.siteFooter` | `--cn-border-width-site-footer` | `3px` | stable |
| `border.width.siteHeader` | `--cn-border-width-site-header` | `3px` | stable |
| `button.primary.bg` | `--cn-button-primary-bg` | `#ef80ae` | stable |
| `button.primary.bgActive` | `--cn-button-primary-bg-active` | `#ef80ae` | derived-pending (TBD-08) |
| `button.primary.bgHover` | `--cn-button-primary-bg-hover` | `#ef80ae` | derived-pending (TBD-08) |
| `button.primary.border` | `--cn-button-primary-border` | `#ef80ae` | stable |
| `button.primary.fg` | `--cn-button-primary-fg` | `#000000` | stable |
| `card.bg` | `--cn-card-bg` | `#000000` | stable |
| `card.divider` | `--cn-card-divider` | `#ef80ae` | stable |
| `card.fg` | `--cn-card-fg` | `#f5f5f5` | stable |
| `card.fgMuted` | `--cn-card-fg-muted` | `#bdbdbd` | stable |
| `card.highlight` | `--cn-card-highlight` | `#ef80ae` | stable |
| `link.fg` | `--cn-link-fg` | `#ef80ae` | stable |
| `radius.button` | `--cn-radius-button` | `0.375rem` | tbd (TBD-10) |
| `radius.card` | `--cn-radius-card` | `0.375rem` | tbd (TBD-10) |
| `separator.bg` | `--cn-separator-bg` | `#000000` | stable |
| `separator.color` | `--cn-separator-color` | `#8c8c8c` | stable |
| `siteFooter.bg` | `--cn-site-footer-bg` | `#000000` | stable |
| `siteFooter.fg` | `--cn-site-footer-fg` | `#f5f5f5` | stable |
| `siteFooter.line` | `--cn-site-footer-line` | `#ef80ae` | stable |
| `siteHeader.bg` | `--cn-site-header-bg` | `#000000` | stable |
| `siteHeader.fg` | `--cn-site-header-fg` | `#f5f5f5` | stable |
| `siteHeader.line` | `--cn-site-header-line` | `#ef80ae` | stable |

<!-- /cn:generated -->

The type, color, and layout tokens are the ones of [Email foundations](email-foundations.md): `font.family.body`, `font.family.display`, `font.h2.size`, `font.h3.size`, `font.size.body`, `font.size.caption`, `color.bg.base`, `color.text.default`, `logo.rule.minHeight.horizontal`, and `layout.email.width.max`.

### Which token each part uses

| Component | Part | Token |
|---|---|---|
| Button | Fill and outline | `button.primary.bg`, `button.primary.border` |
| Button | Label | `button.primary.fg` |
| Button | Outline width, corner | `border.width.button`, `radius.button` |
| Header | Fill, line under it, text | `siteHeader.bg`, `siteHeader.line`, `siteHeader.fg` |
| Header | Line width | `border.width.siteHeader` |
| Header | Logo height | `logo.rule.minHeight.horizontal` |
| Header | Logo clear space | `logo.rule.clearSpace` × `logo.rule.minHeight.horizontal` |
| Content section | Heading | `font.h2.size`, `font.h2.weight`, `font.h2.lineHeight`, `color.text.default` |
| Content section | Body | `font.size.body`, `font.lineHeight.body`, `color.text.default` |
| Card | Fill, outline, corner | `card.bg`, `card.highlight`, `radius.card`, `border.width.card` |
| Card | Title and body, footer text | `card.fg`, `card.fgMuted` |
| Card | Line between body and footer | `card.divider`, `border.width.card` |
| Divider | Line | `separator.color`, `border.width.separator` |
| Divider | Surface | `separator.bg` |
| Footer | Fill, line above it, text | `siteFooter.bg`, `siteFooter.line`, `siteFooter.fg` |
| Footer | Line width | `border.width.siteFooter` |
| Footer | Link | `link.fg` |
| All | Page base, body width, padding | `color.bg.base`, `layout.email.width.max`, `space.base` |

### Brand rules

> **BR-10:** Buttons have rounded corners, a subtle neon glow, and a thick outline stroke.
>
> **BR-13:** Line work is thick, clean, and high-contrast throughout all UI and illustration.

Email clients do not support `box-shadow` (R-05), so the button has no glow. Its outline is a real `border` of `border.width.button` in `button.primary.border`, which keeps the thick, high-contrast line of BR-13 (REQ-040, [Email foundations](email-foundations.md)). No component emits a `box-shadow`, a `text-shadow`, or a `filter`.

## Usage rules

### When to use

- Build an email from these six components, and nothing else. Compose them in the order of a layout (see [Email layouts](email-layouts.md)).
- Use the button for the one main action of an email, with a descriptive label and a link that goes where the label says.
- Use the header once, at the top of the email, so the logo is the first thing a reader sees (BR-16).
- Use the content section for a heading and a block of text, the card for a framed group of related content, and the divider between two parts that need a visible break.
- Use the footer once, at the end, for the closing line and one link.
- Fill every slot with content from the sending system. A component holds no copy of its own (A-11).
- Write copy in es-MX (ER-04).

### When not to use

- Never write a hex color, a font family, a size, or a radius in a component source. Reference a token (REQ-042 AC2).
- Never add a `box-shadow` to make the button glow. The solid outline is the glow fallback.
- Never rely on a rounded corner or on the logo image for meaning. A client may show square corners, or no image.
- Never put a backend template tag in a component. The slots are `{{ slot_name }}` only (REQ-044).
- Never put white text on a pink fill, or yellow on pink (SPEC.md §2.1). The button label is black on pink.
- Never use these components for commerce parts such as a product card or a price. The sending project builds those from these parts (C-02, ER-09).

## Accessibility

- The contrast pairs are the ones of the web components, from the same tokens. The button label is black on pink at 8.37:1, and the card text is `card.fg` on `card.bg` at 19.26:1 (see [Email foundations](email-foundations.md) and [Card](../02-components/molecules/card.md)).
- Every component sets a background and a text color together, so a client that inverts one changes the pair. Text and fill are never set apart (dark-mode inversion).
- The logo is an `img` with an `alt` slot. When images are off, the `img` shows its alt text in the display font, at the heading size, in `color.text.default`, on `siteHeader.bg`.
- The button is real text with a background, never an image, so it works with images off.
- The content section's heading is an `h2`, and the card's title is an `h3`, so a reader of assistive technology gets a heading outline.
- Link text says where the link goes. The footer link is underlined and pink, so it does not rely on color alone.
- The root of every component sets `lang="es-MX"` (ADR-0004).

## Code reference

Compile every component with `pnpm --filter @vinsmokemau/cup-noobles-email build`. Each source in `packages/email/src/components/` becomes `packages/email/dist/<name>.html`. The slots below are the only placeholders in each file. Slot names are unique across components, so a layout that composes several of them has no clash.

### button

File: `button.mjml`. One primary button, centered, with a solid outline.

| Slot | Where | Content |
|---|---|---|
| `{{ button_url }}` | `href` | The address the button opens. Required. |
| `{{ button_label }}` | Label | The text of the button. Required. |

### header

File: `header.mjml`. The logo, centered, on the header fill with a line under it.

| Slot | Where | Content |
|---|---|---|
| `{{ home_url }}` | `href` of the logo link | The address the logo opens. Required. |
| `{{ logo_url }}` | `src` of the logo image | A raster logo image, because most email clients do not render SVG. The sending project hosts it. Required. |
| `{{ logo_alt }}` | `alt` of the logo image | The words "Cup Noobles". They show in the logo's place when images are off. Required. |

### content-section

File: `content-section.mjml`. A heading and a block of text.

| Slot | Where | Content |
|---|---|---|
| `{{ heading }}` | `h2` | The heading. Required. |
| `{{ body }}` | Text block | The body text. Required. |

### card

File: `card.mjml`. A framed group with a title, a body, a line, and a footer.

| Slot | Where | Content |
|---|---|---|
| `{{ card_title }}` | `h3` | The card title. Required. |
| `{{ card_body }}` | Text block | The main content. Required. |
| `{{ card_footer }}` | Text block under the line | The closing text, in the muted color. Required. |

### divider

File: `divider.mjml`. A thick line across the body.

The divider has no slots.

### footer

File: `footer.mjml`. A closing line and one link, centered, on the footer fill with a line above it.

| Slot | Where | Content |
|---|---|---|
| `{{ footer_text }}` | Text block | The closing line. Required. |
| `{{ footer_link_url }}` | `href` | The address of the footer link. Required. |
| `{{ footer_link_label }}` | Link text | The text of the footer link. Required. |

## Open items

> **TBD (TBD-09):** The spacing scale is not defined, and the email build can inject a token only as it is. Every padding is therefore `space.base`, a placeholder, and the components have no larger steps between parts. Owner input needed: the base unit and the scale.
>
> **TBD (TBD-10):** The corner radius is not defined, so the button and the card use the ADR-0006 placeholder. Owner input needed: values.
>
> **TBD (TBD-12):** The glow parameters are not defined. The email button uses a solid outline in place of the glow in any case. Owner input needed: only if the owner wants a different email treatment.

The header keeps the logo clear space of ADR-0016: `logo.rule.clearSpace` is a share of the logo height, and the build turns it into a length with `$cn(logo.rule.clearSpace*logo.rule.minHeight.horizontal)`, 25% of `logo.rule.minHeight.horizontal` (ADR-0042, which settles the question ADR-0041 left to T10.4). Real-client rendering is not verified here (R-05).

## Changelog

- 0.1.0 — First draft: the button, header with logo, content section, card, divider, and footer as MJML components, with their `{{ slot_name }}` slots listed (T10.3, REQ-041 AC3 and AC4, REQ-042)
- 0.1.0 — Component-to-token mapping approved by the owner. The doc stays a draft while TBD-01, TBD-03, TBD-09, TBD-10, and TBD-12 are open — ADR-0041
- 0.1.0 — The header takes its logo clear space from the tokens, in place of `space.base` (T10.4, REQ-043) — ADR-0042
- 0.1.0 — The display typeface and the type scale are set by the owner, so the TBD-01 and TBD-03 callouts are gone. The doc stays a draft while TBD-09, TBD-10, and TBD-12 are open — ADR-0046, ADR-0047, ADR-0048, ADR-0058
