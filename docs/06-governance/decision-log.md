---
title: Decision log
slug: decision-log
layer: governance
status: stable
lang: en
tbd: []
related: [contribution, ownership, versioning-and-releases, deprecation]
since: 0.1.0
updated: 2026-10-11
---

# Decision log

## Purpose

This is the index of every architecture decision record (ADR). An ADR records one decision, the context it was made in, and what follows from it, so a value or a rule can always be traced to its source (REQ-073). The index links every ADR, and `check-links` reports an ADR that is missing from it (REQ-001 AC2).

## Policy and process

- ADRs live in `docs/06-governance/decisions/NNNN-title.md` and start from [the ADR template](decisions/0000-adr-template.md) (REQ-073 AC1).
- Numbers are given in order and never reused. A decision that is replaced keeps its number, and the new ADR names the one it replaces.
- Every TBD resolution and every open decision names an ADR (REQ-073 AC2).
- Add each new ADR to the list below in the same change that creates it. The steps are in [Contribution](contribution.md).

### Index

- [ADR template](decisions/0000-adr-template.md)
- [ADR-0001: Nuxt UI version, theming, and dark mode](decisions/0001-nuxt-ui-spike.md)
- [ADR-0002: Nuxt Content version, docs source, generated blocks, and search](decisions/0002-nuxt-content-spike.md)
- [ADR-0003: Style Dictionary version, DTCG configuration, custom formats, and determinism](decisions/0003-style-dictionary-dtcg-spike.md)
- [ADR-0004: MJML version, token injection, slot survival, inlining, and output size](decisions/0004-mjml-email-spike.md)
- [ADR-0005: Baseline assumptions and conflict resolutions](decisions/0005-baseline-assumptions-and-conflicts.md)
- [ADR-0006: Placeholder values for TBD tokens](decisions/0006-placeholder-values.md)
- [ADR-0007: Owner decisions on record](decisions/0007-owner-decisions-on-record.md)
- [ADR-0008: Token value format, untyped tokens, CSS names, and token sources](decisions/0008-token-format-and-naming.md)
- [ADR-0009: Focus indicator style](decisions/0009-focus-indicator.md)
- [ADR-0010: Button variants](decisions/0010-button-variants.md)
- [ADR-0011: Link and badge looks](decisions/0011-link-and-badge-looks.md)
- [ADR-0012: Icon set](decisions/0012-icon-set.md)
- [ADR-0013: Text field look](decisions/0013-text-field-look.md)
- [ADR-0014: Choice controls look](decisions/0014-choice-controls-look.md)
- [ADR-0015: Progress, skeleton, and separator look](decisions/0015-progress-skeleton-separator-look.md)
- [ADR-0016: Logo assets, clear space, and minimum size](decisions/0016-logo-assets-and-rules.md)
- [ADR-0017: Sparkle motif artwork and size](decisions/0017-sparkle-motif-artwork.md)
- [ADR-0018: Card look](decisions/0018-card-look.md)
- [ADR-0019: Ramen cup motif artwork](decisions/0019-ramen-cup-motif-artwork.md)
- [ADR-0020: Chopsticks motif artwork](decisions/0020-chopsticks-motif-artwork.md)
- [ADR-0021: Golden d20 motif artwork](decisions/0021-golden-d20-motif-artwork.md)
- [ADR-0022: Noodle curves and waves motif artwork](decisions/0022-noodle-wave-motif-artwork.md)
- [ADR-0023: Arcade shapes and dynamic lines motif artwork](decisions/0023-arcade-lines-motif-artwork.md)
- [ADR-0024: Sticker border motif artwork](decisions/0024-sticker-border-motif-artwork.md)
- [ADR-0025: Sticker frame fit](decisions/0025-sticker-frame-fit.md)
- [ADR-0026: Media card look](decisions/0026-media-card-look.md)
- [ADR-0027: Feedback look](decisions/0027-feedback-look.md)
- [ADR-0028: Tabs, breadcrumb, and pagination looks](decisions/0028-navigation-looks.md)
- [ADR-0029: Modal and slideover look](decisions/0029-overlay-look.md)
- [ADR-0030: Site header and footer look](decisions/0030-site-chrome-look.md)
- [ADR-0031: Forms, feedback, and loading patterns](decisions/0031-forms-feedback-loading-patterns.md)
- [ADR-0032: Text, neutral, feedback, stroke, and motion values](decisions/0032-text-neutral-feedback-stroke-motion-values.md)
- [ADR-0033: First docs move to stable](decisions/0033-first-docs-stable.md)
- [ADR-0034: Navigation, empty-states, error-pages, and responsive-behavior patterns](decisions/0034-navigation-empty-error-responsive-patterns.md)
- [ADR-0035: Breakpoints and container width](decisions/0035-breakpoints-and-container.md)
- [ADR-0036: Layout doc moves to stable](decisions/0036-layout-doc-stable.md)
- [ADR-0037: Content docs move to stable](decisions/0037-content-docs-stable.md)
- [ADR-0038: Email maximum width is 600 px](decisions/0038-email-maximum-width.md)
- [ADR-0039: Email foundations rules approved, and the width token](decisions/0039-email-foundations-rules-and-width-token.md)
- [ADR-0040: The email build writes rem dimensions as px](decisions/0040-email-build-rem-to-px.md)
- [ADR-0041: Email components approved, and logo clear space deferred to T10.4](decisions/0041-email-components-approved.md)
- [ADR-0042: The email build expands includes and multiplies tokens](decisions/0042-email-layout-includes-and-clear-space.md)
- [ADR-0043: The global search is UContentSearch with its own palette and a prerendered data file](decisions/0043-global-search-composition.md)
- [ADR-0044: Governance docs move to stable](decisions/0044-governance-docs-stable.md)
- [ADR-0045: Stay on 0.x until every TBD item is closed](decisions/0045-stay-on-0x-until-all-tbd-closed.md)
- [ADR-0046: The display typeface is Titan One](decisions/0046-display-typeface-titan-one.md)
- [ADR-0047: The body typeface is Rubik](decisions/0047-body-typeface-rubik.md)
- [ADR-0048: The type scale is Balanced](decisions/0048-type-scale-balanced.md)
- [ADR-0049: The spacing scale is the rhythm of 8](decisions/0049-spacing-scale-rhythm-of-8.md)
- [ADR-0050: The corner radius is Chunky](decisions/0050-corner-radius-chunky.md)

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: the ADR policy and the index of ADR-0001 through ADR-0043 (T11.2, REQ-073) — awaiting owner approval
- 0.1.0 — Approved as stable by the owner — ADR-0044
- 0.1.0 — Index extended with ADR-0045 (T12.3)
- 0.1.0 — Index extended with ADR-0046 (TBD-01 decision)
- 0.1.0 — Index extended with ADR-0047 (TBD-02 decision)
- 0.1.0 — Index extended with ADR-0048 (TBD-03 decision)
- 0.1.0 — Index extended with ADR-0049 (TBD-09 decision)
- 0.1.0 — Index extended with ADR-0050 (TBD-10 decision)
