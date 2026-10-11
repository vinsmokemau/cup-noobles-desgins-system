---
title: "ADR-0042: The email build expands includes and multiplies tokens"
slug: adr-0042-email-layout-includes-and-clear-space
layer: adr
status: stable
lang: en
brandRules: [BR-16]
tbd: []
related: [adr-0004-mjml-email-spike, adr-0016-logo-assets-and-rules, adr-0040-email-build-rem-to-px, adr-0041-email-components-approved, email-layouts]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0042: The email build expands includes and multiplies tokens

## Context

T10.4 builds the reference layout, which composes the six components (REQ-041 AC3). It also has to settle the question ADR-0041 left to it: the header cannot apply the logo clear space of ADR-0016, because `logo.rule.clearSpace` is a share of the logo height (`0.25`) and the build injects a token only as it is.

MJML has its own `mj-include`, but it reads the included file after the build has replaced `$cn()`, so an included component would keep its `$cn()` references. Copying the markup of each component into the layout would give two sources for one component.

## Decision

`packages/email/build.ts` gets two helpers. Neither adds a brand value.

1. **`<mj-include path="…" />` is expanded by the build**, before tokens are injected. The include is replaced with the content of the included file's `<mj-body>`. The path is relative to the including file and ends in `.mjml`. The included file must have the same `<mj-head>` and opening `<mj-body>` tag as the including file, and must include nothing itself, or the build fails. A component therefore renders the same alone and in a layout.
2. **`$cn(a*b)` is the product of tokens.** Each factor is a token path, at most one is a dimension, and the result is written in px (`rem` factors convert as in ADR-0040). `$cn(logo.rule.clearSpace*logo.rule.minHeight.horizontal)` is 25% of 36 px, which is `9px`. A factor that is not a number or a px dimension, or two dimensions, fail the build.

The header uses the product as the padding of the logo, so it has the clear space of ADR-0016 on every side.

## Consequences

- `reference.mjml` is the source of the reference layout, and `dist/reference.html` is its output. The component sources stay the only place where a component's markup lives.
- The header's padding is the clear space, 9px, in place of `space.base`. The header is about 1 px taller per side than before, and the clear space follows the logo tokens if they change.
- SPEC.md §4.9 names `$cn(path)` as the build-time syntax. This ADR adds the product form to that syntax without changing the `$cn(path)` form. If the owner wants §4.9 to say so, that is an amendment for the owner (SPEC.md §8).
- The owner approved this decision, and the part order and plain-text blocks of `email-layouts.md`, in chat on 2026-10-11, so the ADR is `stable`.
