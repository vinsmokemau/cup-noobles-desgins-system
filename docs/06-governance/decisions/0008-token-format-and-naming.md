---
title: "ADR-0008: Token value format, untyped tokens, CSS names, and token sources"
slug: adr-0008-token-format-and-naming
layer: adr
status: stable
lang: en
brandRules: []
tbd: []
related: [adr-0003-style-dictionary-dtcg-spike, adr-0006-placeholder-values]
since: 0.1.0
updated: 2026-09-27
---

# ADR-0008: Token value format, untyped tokens, CSS names, and token sources

## Context

T3.1 built `scripts/check-tokens.ts`, which validates the token sources against DTCG (REQ-010 AC1), the metadata rules (REQ-014), and the naming convention (REQ-017). Building it left four questions that SPEC.md does not answer:

1. REQ-010 AC1 says tokens "validate against the DTCG schema", but it names no DTCG version. The DTCG 2025.10 release writes colors, dimensions, and durations as objects. ADR-0003 verified Style Dictionary 5.5.5 with plain strings (`"#ef80ae"`).
2. Some placeholder values in ADR-0006 fit no DTCG type: `0em` (letter spacing; DTCG dimensions allow only `px` and `rem`), `none` (glow), `auto` (z-index), and the elevation shadow written as one CSS string. ADR-0006 policy 6 lets T3.2 choose a `$type`, but not change a value.
3. ADR-0003 (Consequences) left open whether a camelCase path segment keeps its case in the CSS name (`--cn-font-lineHeight-h1`) or is split (`--cn-font-line-height-h1`).
4. REQ-014 AC3 requires a BR ID on every stable token "whose value comes from BC", but a check cannot tell where a value came from.

The owner answered all four in chat on 2026-09-27 (T3.1 open questions).

## Decision

### 1. DTCG values are plain strings

Token values use the string forms that Style Dictionary 5.5.5 reads (ADR-0003): colors are `#rrggbb` or `#rrggbbaa`, dimensions are a number with `px` or `rem`, and durations are a number with `ms` or `s`. Composite types (`border`, `transition`, `shadow`, `typography`, `gradient`) are objects whose fields hold these forms or whole-value references. The DTCG 2025.10 object forms are not used, and `check-tokens` rejects them.

### 2. Untyped tokens fall back to their JSON type

A token whose type cannot be determined (no `$type` on it or its groups, and not a reference) falls back to its JSON type, as in the DTCG drafts. It must hold a string, number, or boolean. This lets T3.2 store the ADR-0006 values `0em`, `none`, `auto`, and the elevation shadow string unchanged. Objects and arrays still need a `$type`.

### 3. CSS names are kebab-case

Each path segment is kebab-cased in the CSS name: a capital letter becomes a dash plus its lowercase letter, and the segments are joined with dashes. `color.bg.base` becomes `--cn-color-bg-base`, and `font.lineHeight.h1` becomes `--cn-font-line-height-h1`. This is Style Dictionary's built-in `name/kebab` transform, and it answers the ADR-0003 open question.

Token paths may still use camelCase segments (REQ-017 AC2). Because the mapping is lossy, `check-tokens` fails when two tokens map to the same CSS name, for example `brandAlias` and `brand-alias`.

The owner first chose camelCase, then withdrew it for kebab-case, because every other custom property in the stack is lowercase kebab-case (Nuxt UI `--ui-*`, Tailwind `--text-*`), and custom property names are case-sensitive.

### 4. A stable raw value names its source

Every token with status `stable` that holds a raw value (not a reference) names its source in `$extensions.cn.source`. The source is a BR ID from SPEC.md §2.1 for a value from BC, or the ADR that recorded an owner-supplied value (SPEC.md §4.4, resolution). `check-tokens` fails on a missing source, an unknown BR ID, or an ADR file that does not exist. Stable tokens that are references inherit their source through the chain, so `source` is optional on them.

## Consequences

- `check-tokens` (T3.1) enforces decisions 1, 2, and 4, and it fails on CSS-name collisions under decision 3.
- T3.2 may leave the four ADR-0006 values listed in the Context untyped, instead of forcing them into a DTCG type.
- T3.4 builds CSS names with `name/kebab`. It needs no custom name transform.
- Adopting the DTCG 2025.10 object forms later takes a new ADR, a `check-tokens` change, and new custom formats in T3.4.
