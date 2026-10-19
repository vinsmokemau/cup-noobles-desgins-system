---
title: "ADR-0058: The email font fallback stack uses Arial Black and Arial"
slug: adr-0058-email-font-fallback-stack
layer: adr
status: stable
lang: en
brandRules: [BR-05, BR-07, BR-09]
tbd: []
related: [typography, email-foundations, adr-0046-display-typeface-titan-one, adr-0047-body-typeface-rubik, adr-0004-mjml-email-spike]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0058: The email font fallback stack uses Arial Black and Arial

## Context

ADR-0046 and ADR-0047 chose Titan One and Rubik, and both left criterion 4 of the typography selection criteria (a defined email fallback) pending until the owner confirmed a stack. Most email clients ignore web fonts (R-05), so an email shows the first family in the stack that the reader's device has. T13.1 asked the owner to choose. The owner reviewed three stacks on a comparison page: A, Arial Black for headings with Arial for text; B, Impact for headings; C, Arial only. The page marked A as the recommendation.

## Decision

The owner chose **A** in chat on 2026-10-18.

| Role | Token | Stack |
|---|---|---|
| Headings | `font.family.display` | `'Titan One', 'Arial Black', 'Arial Bold', Gadget, sans-serif` |
| Text | `font.family.body` | `Rubik, Arial, Helvetica, sans-serif` |

The stack names are examples the owner confirmed by choosing this option. They are not brand typefaces: the brand typefaces are Titan One and Rubik. Both stacks end in the generic `sans-serif` keyword, as `email-foundations.md` requires.

Known limits, as shown on the comparison page: Android phones have no Arial Black, so they show their own sans-serif. Titan One has one weight, so a regular-weight fallback looks thin, which is why the heading fallbacks are heavy faces.

## Consequences

- Criterion 4 of ADR-0046 and ADR-0047 is met.
- The two tokens above carry the stack for the web and for email. The web falls back to the same fonts only if the self-hosted files fail to load.
- `email-foundations.md` records the stack and loses its TBD-01 and TBD-03 callouts.
