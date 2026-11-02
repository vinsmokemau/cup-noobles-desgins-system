---
title: "ADR-0067: The raw-value rule ships inside the layer package"
slug: adr-0067-raw-value-rule-ships-in-layer
layer: adr
status: stable
lang: en
brandRules: []
tbd: []
related: [using-the-system, decision-log, adr-0005-baseline-assumptions-and-conflicts]
since: 1.3.0
updated: 2026-11-01
---

# ADR-0067: The raw-value rule ships inside the layer package

## Context

The e-commerce repository asked to run the same raw-value check as this repository (DSR-09). REQ-016 forbids color literals and `px`, `rem`, and `ms` literals in styles, and C-03 says a consuming app does no visual styling of its own. The rule lived in `scripts/eslint-plugin-cn/`, which no package shipped. T15.6 asked where it should ship: an export of the layer, or a small separate package. A new package changes the distribution in SPEC.md §1.2 and the lockstep of A-04, so the owner decides.

## Decision

1. **The rule ships inside `@vinsmokemau/cup-noobles-nuxt`.** The plugin moves from `scripts/eslint-plugin-cn/` to `packages/nuxt/eslint/`, and `eslint` joins the package's `files`. An app imports it from `@vinsmokemau/cup-noobles-nuxt/eslint/index.js`.
2. **This repository lints with the same copy.** `eslint.config.js` imports `./packages/nuxt/eslint/index.js`, so the app and this repository run one rule. No second copy exists.
3. **The distribution stays at three packages.** SPEC.md §1.2 and A-04 do not change.
4. **The consumer fixture runs the rule.** It installs the published 1.0.1 layer (T14.5), which has no rule, so the repository's `eslint.config.js` applies the rule to `apps/consumer-fixture` from the workspace copy. A later release task can switch the fixture to the published entry point.

The owner chose this option in chat on 2026-11-01, after comparing it with a fourth package (option A).

## Consequences

- Every Nuxt app that extends the layer already has the rule. A project without Nuxt would have to install the layer to get it. A fourth package can be reconsidered if that need appears.
- The plugin also exports `cn/no-hardcoded-text`. Only the raw-value rule is documented for apps.
- The app needs ESLint. It also needs `vue-eslint-parser` to lint `.vue` files and `@eslint/css` to lint `.css` files.
- The rule is a minor addition to the layer package, released in the next lockstep version.
