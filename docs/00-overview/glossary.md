---
title: Glossary
slug: glossary
layer: overview
status: draft
lang: en
brandRules: []
tbd: []
related: [principles, brand-identity, using-the-system]
since: 0.1.0
updated: 2026-09-27
---

# Glossary

## Purpose

This glossary defines the terms used across the Cup Noobles docs, tokens, and packages, so every doc and every project uses each term with one meaning. It defines words only. It sets no brand values and no rules.

## Usage rules

### Terms

| Term | Meaning |
|---|---|
| ADR | Architecture decision record. A numbered file in `docs/06-governance/decisions/` that records a decision, its context, and its consequences. Brand values that SPEC.md §2.1 does not define enter the system only through an ADR or the owner. |
| Atom | The smallest component level, such as a button, badge, or input. Atoms are listed in [DESIGN.md](../../DESIGN.md). |
| BC | The brand context: the owner's brand document, kept verbatim in [Brand context source](brand-context-source.md) (REQ-006). |
| BR rule | A brand rule taken from BC, with an ID from `BR-01` to `BR-17` in SPEC.md §2.1. Docs quote BR rules with their ID. |
| Brand asset | One of the three logo files from BR-16: the icon, the vertical lockup, and the horizontal wordmark. See [Brand identity](brand-identity.md). |
| Changeset | A file in `.changeset/` that describes a change to a package, used to version and release the packages. |
| `Cn*` component | A custom component, prefixed `Cn`, built only where Nuxt UI has no equivalent (C-01, REQ-021). |
| Component token | A token of the third tier, scoped to one component, such as a button's glow. It references semantic tokens only (REQ-010). |
| Consumer fixture | `apps/consumer-fixture`, a generic Nuxt app that installs the packages to prove they are reusable (REQ-071). |
| Contrast pair | A foreground token and a background token that are meant to be used together, listed with their usage in `tokens/contrast-pairs.json` and checked against WCAG minimums (REQ-015). |
| Content-pending callout | `> **TBD:** Content pending (Tn.n).`, which marks a doc section that task `Tn.n` has not written yet (SPEC.md §4.4). |
| `derived-pending` | The status of a token that repeats a single brand color where Nuxt UI expects a full shade scale, until the owner decides how shades are made (C-06, OD-04). |
| Draft | A doc status, and a callout (`> **Draft:** …`), for a rule that the owner has not approved yet (REQ-009). |
| DTCG | The W3C Design Tokens Community Group format, used for every token file (A-13). |
| Email tokens | `dist/email/email-tokens.json`: token values resolved to plain literals, because email clients do not support CSS custom properties (REQ-013). |
| Forbidden pair | A color combination that fails contrast and must never be used, listed in `tokens/contrast-forbidden.json` (REQ-015 AC3). |
| Generated block | The part of a doc between `cn:generated` marker comments. `pnpm sync:docs` writes it from the token files (REQ-004). |
| Glow | The subtle neon glow on buttons (BR-10). Its values are TBD-12. |
| Layer (doc) | The part of the system a doc belongs to: overview, foundation, component, pattern, content, email, governance, or ADR. It sets the doc's required headings (§4.2). |
| Layer (Nuxt) | A Nuxt project that another Nuxt app extends. `@vinsmokemau/cup-noobles-nuxt` is the system's Nuxt layer. |
| Line work | The thick, clean, high-contrast outlines used throughout UI and illustration (BR-13). |
| Lockup | A fixed arrangement of logo elements. BR-16 names a vertical lockup. |
| MJML | The markup language that the email components are written in and compiled to static HTML from (A-14). |
| Molecule | A component built from atoms, such as a form field or a card. |
| Motif | A decorative brand element from BR-14, such as sparkles or a golden d20. Motifs never carry meaning (REQ-029). |
| Nuxt UI | The component library that provides the interactive components. The system themes it rather than rebuilding its primitives (ER-01, C-01). |
| Open decision (OD) | A decision the owner must make, with an ID in SPEC.md §7.2. |
| Organism | A larger component built from molecules and atoms, such as a modal or the site header. |
| Placeholder value | A deliberately non-brand value that a `tbd` token holds until the owner supplies the real one. Placeholders are listed in ADR-0006 and are never brand values. |
| Primitive token | A token of the first tier. It holds a raw value, such as a brand color. |
| Semantic token | A token of the second tier. It names a role, such as `color.bg.base`, and references primitive tokens only (REQ-010). |
| Showcase | `apps/showcase`, the static site that renders these docs and shows every token and component live (REQ-050). |
| Slot placeholder | `{{ slot_name }}` in the email HTML, which a backend replaces with content (REQ-041 AC4). |
| Status | A doc's or a token's state. Docs use `tbd`, `draft`, `stable`, or `deprecated` (REQ-002). Tokens use `stable`, `tbd`, `derived-pending`, or `deprecated` (REQ-014). |
| TBD item | A value that no source defines yet, with an ID from SPEC.md §2.4, such as TBD-01 for the display typeface. Docs mark it with a `> **TBD (TBD-NN):** …` callout (REQ-005). |
| Token | A named design decision, such as a color or a size, stored as DTCG JSON in `tokens/` and built into the tokens package. |
| Wordmark | A logo that spells out the brand name. BR-16 names a horizontal wordmark. |

### When to use

- Look up a term here when a doc uses it without explaining it.
- Use each term with the meaning given here in every doc, ADR, and commit message.

### When not to use

- Do not treat a definition as a rule. The rules live in the doc each term points to.
- Do not add a term that nothing in the system uses.

## Open items

> **Draft:** The definitions restate SPEC.md and the other docs. They await the owner's approval before this doc becomes `stable` (REQ-009 AC2).

## Changelog

- 0.1.0 — First draft of the glossary (T4.1) — awaiting owner approval
