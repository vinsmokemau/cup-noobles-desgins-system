---
title: Typography
slug: typography
layer: foundation
status: stable
lang: en
brandRules: [BR-07, BR-08, BR-09]
tokens: [font]
tbd: []
related: [color, accessibility, brand-identity, email-foundations]
since: 0.1.0
updated: 2026-10-18
---

# Typography

## Purpose

This doc defines how Cup Noobles sets type: the brand's typographic character, the two typefaces, the five-level hierarchy and its scale, and the criteria a typeface must meet. It implements BR-07, BR-08, and BR-09. The display typeface is Titan One (ADR-0046), the body typeface is Rubik (ADR-0047), and the scale is the Balanced scale (ADR-0048). They are the owner's choices, not values from the brand context.

## Tokens and specs

<!-- cn:generated tokens="font" format="table" -->

| Token | CSS variable | Value | Status |
|---|---|---|---|
| `font.body.family` | `--cn-font-body-family` | `Rubik, Arial, Helvetica, sans-serif` | stable |
| `font.body.letterSpacing` | `--cn-font-body-letter-spacing` | `0em` | stable |
| `font.body.lineHeight` | `--cn-font-body-line-height` | `1.625rem` | stable |
| `font.body.size` | `--cn-font-body-size` | `1rem` | stable |
| `font.body.weight` | `--cn-font-body-weight` | `400` | stable |
| `font.caption.family` | `--cn-font-caption-family` | `Rubik, Arial, Helvetica, sans-serif` | stable |
| `font.caption.letterSpacing` | `--cn-font-caption-letter-spacing` | `0em` | stable |
| `font.caption.lineHeight` | `--cn-font-caption-line-height` | `1.125rem` | stable |
| `font.caption.size` | `--cn-font-caption-size` | `0.8125rem` | stable |
| `font.caption.weight` | `--cn-font-caption-weight` | `400` | stable |
| `font.family.body` | `--cn-font-family-body` | `Rubik, Arial, Helvetica, sans-serif` | stable |
| `font.family.display` | `--cn-font-family-display` | `'Titan One', 'Arial Black', 'Arial Bold', Gadget, sans-serif` | stable |
| `font.h1.family` | `--cn-font-h1-family` | `'Titan One', 'Arial Black', 'Arial Bold', Gadget, sans-serif` | stable |
| `font.h1.letterSpacing` | `--cn-font-h1-letter-spacing` | `0em` | stable |
| `font.h1.lineHeight` | `--cn-font-h1-line-height` | `2.75rem` | stable |
| `font.h1.size` | `--cn-font-h1-size` | `2.5rem` | stable |
| `font.h1.weight` | `--cn-font-h1-weight` | `400` | stable |
| `font.h2.family` | `--cn-font-h2-family` | `'Titan One', 'Arial Black', 'Arial Bold', Gadget, sans-serif` | stable |
| `font.h2.letterSpacing` | `--cn-font-h2-letter-spacing` | `0em` | stable |
| `font.h2.lineHeight` | `--cn-font-h2-line-height` | `2.125rem` | stable |
| `font.h2.size` | `--cn-font-h2-size` | `1.875rem` | stable |
| `font.h2.weight` | `--cn-font-h2-weight` | `400` | stable |
| `font.h3.family` | `--cn-font-h3-family` | `'Titan One', 'Arial Black', 'Arial Bold', Gadget, sans-serif` | stable |
| `font.h3.letterSpacing` | `--cn-font-h3-letter-spacing` | `0em` | stable |
| `font.h3.lineHeight` | `--cn-font-h3-line-height` | `1.625rem` | stable |
| `font.h3.size` | `--cn-font-h3-size` | `1.375rem` | stable |
| `font.h3.weight` | `--cn-font-h3-weight` | `400` | stable |
| `font.letterSpacing.body` | `--cn-font-letter-spacing-body` | `0em` | stable |
| `font.letterSpacing.caption` | `--cn-font-letter-spacing-caption` | `0em` | stable |
| `font.letterSpacing.h1` | `--cn-font-letter-spacing-h1` | `0em` | stable |
| `font.letterSpacing.h2` | `--cn-font-letter-spacing-h2` | `0em` | stable |
| `font.letterSpacing.h3` | `--cn-font-letter-spacing-h3` | `0em` | stable |
| `font.lineHeight.body` | `--cn-font-line-height-body` | `1.625rem` | stable |
| `font.lineHeight.caption` | `--cn-font-line-height-caption` | `1.125rem` | stable |
| `font.lineHeight.h1` | `--cn-font-line-height-h1` | `2.75rem` | stable |
| `font.lineHeight.h2` | `--cn-font-line-height-h2` | `2.125rem` | stable |
| `font.lineHeight.h3` | `--cn-font-line-height-h3` | `1.625rem` | stable |
| `font.size.body` | `--cn-font-size-body` | `1rem` | stable |
| `font.size.caption` | `--cn-font-size-caption` | `0.8125rem` | stable |
| `font.size.h1` | `--cn-font-size-h1` | `2.5rem` | stable |
| `font.size.h2` | `--cn-font-size-h2` | `1.875rem` | stable |
| `font.size.h3` | `--cn-font-size-h3` | `1.375rem` | stable |
| `font.weight.body` | `--cn-font-weight-body` | `400` | stable |
| `font.weight.caption` | `--cn-font-weight-caption` | `400` | stable |
| `font.weight.h1` | `--cn-font-weight-h1` | `400` | stable |
| `font.weight.h2` | `--cn-font-weight-h2` | `400` | stable |
| `font.weight.h3` | `--cn-font-weight-h3` | `400` | stable |

<!-- /cn:generated -->

Every row above is `stable`. The family rows are Titan One and Rubik, each followed by its email fallbacks (ADR-0058). The other rows are the Balanced scale (ADR-0048), which sets every level at weight 400 and letter spacing 0, because Titan One has one weight and Rubik 300 is not used. Sizes are in `rem`, so text follows the user's browser setting.

The primitive tokens (`font.family.*`, `font.size.*`, `font.lineHeight.*`, `font.weight.*`, and `font.letterSpacing.*`) hold the raw values. The semantic tokens (`font.h1.*`, `font.h2.*`, `font.h3.*`, `font.body.*`, and `font.caption.*`) give each hierarchy level its family, size, line height, weight, and letter spacing. Components and apps use the semantic tokens only.

### Brand rules

> **BR-07:** Typography is a bold, retro display sans-serif, similar in feel to the logo. The specific typeface is TBD-01.
>
> **BR-08:** Type hierarchy is H1 → H2/H3 → body → caption.
>
> **BR-09:** Type feels bold, geek, and premium, with strong presence and easy legibility.

### Hierarchy

BR-08 sets five levels. H2 and H3 share a rank in the brand source; they are separate tokens so each can be sized on its own.

| Level | Semantic tokens | Family | Role |
|---|---|---|---|
| H1 | `font.h1.*` | Display (`font.family.display`) | The single top heading of a page or view. |
| H2 | `font.h2.*` | Display (`font.family.display`) | Section headings. |
| H3 | `font.h3.*` | Display (`font.family.display`) | Subsection headings. |
| Body | `font.body.*` | Body (`font.family.body`) | Running text, labels, and form input. |
| Caption | `font.caption.*` | Body (`font.family.body`) | Secondary text: helper text, metadata, and fine print. |

The headings use the display family because BR-07 calls for a bold, retro display sans-serif. Body and caption use a separate family, because Titan One is limited to headings, button labels, and badges (ADR-0046).

| Level | Size | Line height | Weight | Letter spacing |
|---|---|---|---|---|
| H1 | 2.5rem (40 px) | 2.75rem (44 px) | 400 | 0 |
| H2 | 1.875rem (30 px) | 2.125rem (34 px) | 400 | 0 |
| H3 | 1.375rem (22 px) | 1.625rem (26 px) | 400 | 0 |
| Body | 1rem (16 px) | 1.625rem (26 px) | 400 | 0 |
| Caption | 0.8125rem (13 px) | 1.125rem (18 px) | 400 | 0 |

The scale is the same at every viewport (ADR-0048).

### Selection criteria

The owner chooses the typefaces (OD-06). A candidate for the display typeface, and for the body typeface, must meet every criterion below. The ADR for each choice records how the typeface meets each one, including its license terms (R-12). ADR-0046 records Titan One, ADR-0047 records Rubik, and ADR-0058 records the email fallback stack.

| # | Criterion | How to check it |
|---|---|---|
| 1 | **A bold, retro display sans-serif** that feels similar to the logo (BR-07) and reads as bold, geek, and premium, with strong presence (BR-09). It must never read as childish or generic (BR-05). | Set the H1 to H3 specimens next to the logo assets (ADR-0016) and review them with the owner. |
| 2 | **Spanish diacritics.** The family covers every character es-MX copy uses (ER-04), at least `áéíóú ÁÉÍÓÚ ñ Ñ ü Ü ¿ ¡`, in every weight the scale uses, with no fallback glyphs. | Render the showcase specimens, which include `áéíóú ñ ¿¡` (REQ-054 AC2), in every weight. |
| 3 | **A license that covers web embedding**: self-hosting or serving the font files to every consuming app, and the static showcase on GitHub Pages (OD-02). | Read the license text and record it in the ADR. |
| 4 | **Defined email fallback behavior.** Most email clients ignore web fonts (R-05), so the family needs a fallback stack that keeps the hierarchy and legibility when the font does not load, and a license that allows email use if the font is referenced from email. | Record the fallback stack in the ADR and in [Email foundations](../05-email/email-foundations.md) (REQ-040 AC1). |
| 5 | **Legible at body and caption sizes** if it is a body family, because BR-09 requires easy legibility. | Review the body and caption specimens at 360 px (ER-05). |

## Usage rules

### When to use

- Use the semantic tokens `font.h1.*` through `font.caption.*` for every piece of text. Pick the level by its place in the hierarchy (BR-08), never by the size you want.
- Use the display family (Titan One) for H1, H2, H3, button labels, and badges only (ADR-0046). Button and badge labels are at least 14 px.
- Use the body family (Rubik) for body text, captions, form fields, tables, and prices (ADR-0047). Captions are at least 13 px.
- Write headings in sentence case, never all caps (BR-05).
- Set the page language: `lang="es-MX"` on es-MX pages. Headings hyphenate long words, and the browser needs the language to do it.
- Use one H1 per page or view, and do not skip heading levels.
- Reference type only through `--cn-font-*` variables or token imports. Never write a font family, size, line height, weight, or letter spacing literally in a component, the showcase, or an app (REQ-016).

### When not to use

- Never set body text, captions, form fields, tables, or prices in the display family (ADR-0046).
- Never use the Rubik 300 weight. It looks thin on the pure-black base (BR-03, ADR-0047).
- Never use bold or italic on Titan One. It has one weight, and a browser would fake a heavier face. Hierarchy comes from size and color.
- Never write a heading in all caps (BR-05).
- Never make up a size, line height, weight, or letter spacing outside the scale (ADR-0048).
- Never rely on Rubik to tell `0` from `O`, or `l` from `I`. Codes and identifiers need another treatment, set when such a component exists (ADR-0047).
- Never load a different typeface from a font service. Both typefaces are self-hosted.

## Do and don't

| Do | Don't |
|---|---|
| Style a section title with `font.h2.*`. | Style body text with a heading size to make it stand out. |
| Use the display family for headings, button labels, and badges. | Set a paragraph or a price in the display family. |
| Write headings in sentence case. | Write headings in all caps. |
| Check every text sample with `áéíóú ñ ¿¡`. | Accept a fallback glyph for `ñ`, `¿`, or `¡`. |

## Accessibility

- The target is WCAG 2.2 level AA (A-10). Text contrast follows [Color](color.md): 4.5:1 for text and 3:1 for large text (REQ-015 AC2).
- Headings are real `h1` to `h3` elements in order, so assistive technology can navigate by heading. The visual level and the element level match.
- Sizes are set in `rem`, so text scales with the user's browser setting. Text resized to 200% must not lose content or function (WCAG 1.4.4).
- Layouts must not break when a user overrides line height, paragraph spacing, letter spacing, or word spacing (WCAG 1.4.12). The scale values are defaults, not limits.
- es-MX pages declare `lang="es-MX"`, so screen readers pronounce the copy correctly (ER-04).

## Responsive behavior

The hierarchy and the sizes are the same at every viewport (ADR-0048). Every level must fit and stay legible at 360 px (ER-05), and the reference viewports are 360, 768, and 1280 px (A-09). Long headings wrap; they are never truncated or scaled down to fit.

At 360 px the content is 328 px wide. A word of 15 letters or more, such as "Extraordinarios" or "Responsabilidades", does not fit on one line at the H1 size. Headings therefore set `hyphens: auto`, so the browser splits the word at a syllable break and adds a hyphen. This needs `lang="es-MX"` on the page. `overflow-wrap: break-word` is the backstop for a word the dictionary cannot split, so a heading never scrolls sideways. An end-to-end test measures both words at 360 px (T13.1).

## Email notes

Email clients do not support `var()`, so email templates use the resolved literals from `dist/email/email-tokens.json`, injected at build time with `$cn(font.h1.size)` (REQ-013, §4.9). Web fonts are widely unsupported in email (R-05), so email relies on the fallback stack from selection criterion 4: Arial Black behind Titan One, and Arial behind Rubik (ADR-0058). The stack, and the rule that no MJML default font reaches a component (ADR-0004), are defined in [Email foundations](../05-email/email-foundations.md) (REQ-040 AC1).

## Code reference

| Where | What |
|---|---|
| `tokens/primitive/font.json` | The families, sizes, line heights, weights, and letter spacing, all `stable`. |
| `packages/nuxt/assets/fonts/` | The self-hosted Titan One and Rubik files (latin and latin-ext woff2), with the OFL license text of each. |
| `tokens/semantic/font.json` | The five hierarchy levels: `font.h1` to `font.h3`, `font.body`, and `font.caption`. |
| `@vinsmokemau/cup-noobles-tokens`, `dist/css/tokens.css` | The CSS custom properties, such as `--cn-font-h1-size` (REQ-017). |
| `packages/nuxt/assets/css/main.css` | The `@font-face` rules, and the base rules that apply the body family to the page and the display family to headings, button labels, and badges. |
| `packages/nuxt/nuxt.config.ts` | Sets `ui.fonts: false`, so Nuxt UI fetches no default typeface; the layer self-hosts both (ADR-0001). |

```css
.example {
  font-family: var(--cn-font-h2-family);
  font-size: var(--cn-font-h2-size);
  line-height: var(--cn-font-h2-line-height);
  font-weight: var(--cn-font-h2-weight);
  letter-spacing: var(--cn-font-h2-letter-spacing);
}
```

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: BR-07 to BR-09, the hierarchy from BR-08, the typeface selection criteria, and TBD-01 to TBD-03 (T4.3) — awaiting owner approval
- 0.1.0 — Titan One, Rubik, and the Balanced scale are set by the owner, and the placeholders for them are gone. The doc moves to stable, with the email fallback stack and the hyphenation rule for long headings — ADR-0046, ADR-0047, ADR-0048, ADR-0058
