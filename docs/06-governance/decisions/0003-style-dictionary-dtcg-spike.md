---
title: "ADR-0003: Style Dictionary version, DTCG configuration, custom formats, and determinism"
slug: adr-0003-style-dictionary-dtcg-spike
layer: adr
status: draft
lang: en
brandRules: [BR-01]
tbd: []
related: [adr-0001-nuxt-ui-spike]
since: 0.1.0
updated: 2026-09-25
---

# ADR-0003: Style Dictionary version, DTCG configuration, custom formats, and determinism

## Context

REQ-010 requires DTCG token sources in three tiers (`tokens/primitive/`, `tokens/semantic/`, `tokens/component/`). REQ-013 requires one build to write four outputs: `dist/css/tokens.css`, `dist/json/tokens.flat.json`, `dist/ts/tokens.ts`, and `dist/email/email-tokens.json`. Two builds must produce byte-identical files, and the outputs must depend on no framework. Assumption A-13 says tokens follow DTCG and are built with Style Dictionary, with format support to be verified here. REQ-011 AC3 and REQ-017 AC1 fix the CSS custom property shape (`--cn-{path-with-dashes}`, resolved to the literal value), and §4.7 and §4.9 require email outputs to resolve every reference to a literal.

Task T0.3 built the smallest possible spike in `spikes/0003-tokens/`:

- `tokens/` holds three DTCG tokens, one per tier, all traced to BR-01: `color.brand.pink` (primitive, `#ef80ae`), `color.brand.primary` (semantic, `{color.brand.pink}`), and `button.primary.bg` (component, `{color.brand.primary}`). The primitive file declares `$type` on the group, which tests DTCG type inheritance. No other value is used.
- `build.mjs` holds the Style Dictionary configuration and three custom formats, and writes the four outputs to a given directory.
- `verify.mjs` runs two builds in separate Node processes, plus a third with the source order reversed, compares SHA-256 hashes, checks the output contents, and runs five in-memory control builds (see "Evidence").

Versions used by the spike: Node 24.19.0, pnpm 12.6.0, and `style-dictionary` 5.5.5.

## Decision

### 1. Version and license

Pin `style-dictionary` to exactly **5.5.5** (the `latest` dist-tag on 2026-09-25), which is licensed **Apache-2.0**. It is a **devDependency** of `packages/tokens` only. The built outputs import nothing, so the published `tokens` package keeps zero runtime dependencies (REQ-013 AC3). Any upgrade is its own task, with a rerun of the determinism test.

### 2. DTCG configuration

Style Dictionary 5.5.5 reads DTCG natively. Set `usesDtcg: true` explicitly, even though it auto-detected DTCG from `$value` in the spike, so a file without `$`-keys cannot silently switch the parser.

- `$value`, `$type`, `$description`, and `$extensions` pass through to formats. `$type` set on a group is inherited by its tokens.
- References use the DTCG `{group.token}` syntax and resolve across files and tiers.
- `$extensions.cn.status` and `$extensions.cn.source` are readable on every token in a format (`token.$extensions.cn`). The unresolved reference is at `token.original.$value`, and the source file at `token.filePath`. `check-tokens` can use both for the tier rules.
- List the sources tier by tier (`tokens/primitive/**/*.json`, `tokens/semantic/**/*.json`, `tokens/component/**/*.json`). With the sorting in section 3, source order does not affect output (section 4), but this order keeps the configuration readable.
- Use the built-in `css` transform group with `prefix: 'cn'` on every platform. This gives the `--cn-{path-with-dashes}` names (REQ-017 AC1) and the same color normalization in every output. `#ef80ae` passes through as `#ef80ae`.
- Set `log: { verbosity: 'silent', warnings: 'error' }`, so a warning such as a token-name collision fails the build instead of scrolling past (proven by a control build).

### 3. Formats: one built-in, three custom

| Output | Format | Why |
|---|---|---|
| `dist/css/tokens.css` | Built-in `css/variables`, `outputReferences: false`, `sort: 'name'` | Already produces `:root { --cn-color-brand-primary: #ef80ae; }`. References must stay resolved, because REQ-011 AC3 requires the literal hex in the built CSS. Without `sort`, the format writes tokens in source-file order. |
| `dist/json/tokens.flat.json` | Custom `cn/json-flat` | Built-in `json/flat` keys tokens by PascalCase name (`ColorBrandPrimary`) and drops metadata. The `/tokens` explorer (REQ-053) needs the DTCG path, CSS variable, resolved value, `$type`, status, and description. |
| `dist/ts/tokens.ts` | Custom `cn/ts-constants` | Built-in `javascript/es6` writes one PascalCase `export const` per token, with no path lookup. The custom format writes one path-keyed object `as const` plus a `TokenPath` union type. |
| `dist/email/email-tokens.json` | Custom `cn/json-email` | No built-in format gives a flat map from DTCG path to literal, which the `$cn(color.brand.primary)` lookup in §4.9 needs. |

All three custom formats:

- sort tokens by their dotted path explicitly, so their output order can never depend on the order files are discovered in;
- throw if any value still contains `{` or `var(`, which is a second guard on the REQ-013 AC1 "no references and no `var()`" rule for email;
- end the file with one `\n` and write no timestamp.

The field set of `tokens.flat.json` and the shape of `tokens.ts` shown here are spike choices. T3.4 finalizes them, and T6.1 (the `/tokens` explorer) may add fields.

### 4. Determinism result: deterministic

Two builds in separate Node processes into separate directories produced byte-identical files for all four outputs (SHA-256 hashes under "Evidence"). A third build with the source globs in reverse order produced the same bytes, too.

- Style Dictionary 5.5.5's default file header has no timestamp (`Do not edit directly, this file was auto-generated.`).
- Order is the one real risk. By default, `css/variables` writes tokens in the order their source files are read. An early probe that used a single `tokens/**/*.json` glob wrote `component/` tokens first, and the tier-ordered configuration wrote `primitive/` tokens first. `sort: 'name'` on CSS, and the explicit path sort in the custom formats, remove that dependency.
- No output contains CR characters, so output does not depend on the Windows line-ending setting.

The T3.4 determinism test repeats the two-build comparison. It should keep the reversed-source build as well.

### 5. What Style Dictionary does not check, and must be checked by `check-tokens`

The control builds show that Style Dictionary 5.5.5:

- **does fail** on a reference to a missing token (the build throws);
- **does not enforce tiers**: a semantic token that references a component token builds without error. REQ-010 AC2 and AC3 need `check-tokens` (T3.1);
- **does not validate DTCG values**: a `color` token with the value `banana` builds, and the CSS contains `--cn-bogus: banana;`. REQ-010 AC1 needs `check-tokens` to validate against the DTCG schema;
- does not require `$description` or `$extensions.cn.status` (REQ-014), which is also a `check-tokens` job.

## Consequences

- `packages/tokens` copies this spike's pattern in T3.4: the configuration from `build.mjs`, the three custom formats, and `css/variables` for CSS. Its build writes to `dist/`, which is git-ignored (T1.1).
- `check-tokens` (T3.1) must enforce the tier rules, DTCG value validity, and required metadata itself. It can read `filePath` and `original.$value` from Style Dictionary's token objects, or parse the JSON directly.
- **Open question for T3.1 and T3.4, not decided here.** The built-in `name/kebab` transform splits camelCase segments: the path `color.brandAlias.x` becomes `--cn-color-brand-alias-x`. REQ-017 AC1 says `--cn-{path-with-dashes}`, and REQ-017 AC2 allows camelCase segments. It does not say whether `lineHeight` becomes `lineHeight` or `line-height` in the CSS name. `name/kebab` is lossy: `brandAlias` and `brand-alias` collide, and the `warnings: 'error'` setting then fails the build. The owner should confirm the mapping before T3.4.
- The spike checks Style Dictionary behavior only. The real test stack (ER-06) is set up in P1, and `spikes/` is deleted in T1.1.
- Revisit this ADR when upgrading `style-dictionary` past 5.5.5, especially if the default file header, the `css/variables` sort order, DTCG parsing, or the `name/kebab` transform changes.

### Evidence

Run from `spikes/0003-tokens`: `pnpm install`, then `pnpm verify`.

```text
PASS  Build into .verify/a exits 0
PASS  Build into .verify/b exits 0
PASS  Build into .verify/r exits 0 (--reverse-sources)
PASS  Output exists: css/tokens.css
PASS  Output exists: json/tokens.flat.json
PASS  Output exists: ts/tokens.ts
PASS  Output exists: email/email-tokens.json
PASS  Byte-identical across builds: css/tokens.css  [b1a210b7477f]
PASS  Byte-identical across builds: json/tokens.flat.json  [a2ad9d36c8c5]
PASS  Byte-identical across builds: ts/tokens.ts  [41313b2bf564]
PASS  Byte-identical across builds: email/email-tokens.json  [30ff5c56d6e7]
PASS  Independent of source order: css/tokens.css
PASS  Independent of source order: json/tokens.flat.json
PASS  Independent of source order: ts/tokens.ts
PASS  Independent of source order: email/email-tokens.json
PASS  CSS: --cn-color-brand-primary resolves to BR-01 pink
PASS  CSS: all three tiers present as --cn-* vars
PASS  CSS: no var() references (resolved values)
PASS  Flat JSON: 3 tokens keyed by DTCG path  [button.primary.bg,color.brand.pink,color.brand.primary]
PASS  Flat JSON: carries value, cssVar, status
PASS  TS: loads and exports resolved constants
PASS  TS: typed with `as const` and a TokenPath type
PASS  Email JSON: no references and no var()
PASS  Email JSON: path -> literal value
PASS  No output imports anything (zero runtime deps)
PASS  No CR line endings in any output
PASS  No timestamp in any output
PASS  Control: a broken reference fails the build
PASS  Control: tier rules are NOT enforced (semantic -> component ref builds)
PASS  Control: invalid DTCG color value is NOT rejected
PASS  Observed: camelCase segment naming under name/kebab  [--cn-color-brand-alias-x]
PASS  Control: a CSS-name collision fails the build (warnings: error)

SHA-256 (build a = build b = reversed-source build):
  b1a210b7477fec5c05eb37618b0e6ad6bd90ba3b3e465eeb540ee5dc932e3ef9  css/tokens.css
  a2ad9d36c8c59457be96eeedaa9889a9936bba5cf6d646c85a39a7edfaf1c8e6  json/tokens.flat.json
  41313b2bf564a055abca5caaed197bbf4e4a0e82a1c5c9656a2ee3bc58b6e50e  ts/tokens.ts
  30ff5c56d6e795ea42d3c5e7e4c92d5f02b8015d353cf7c2bea7c7cd4b68730f  email/email-tokens.json
```

The CSS output (`sort: 'name'`):

```css
/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --cn-button-primary-bg: #ef80ae; /** Primary button fill. */
  --cn-color-brand-pink: #ef80ae; /** Brand pink, the protagonist color. */
  --cn-color-brand-primary: #ef80ae; /** Primary brand role. */
}
```
