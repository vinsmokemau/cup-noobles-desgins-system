---
title: "ADR-0002: Nuxt Content version, docs source, generated blocks, and search"
slug: adr-0002-nuxt-content-spike
layer: adr
status: draft
lang: en
brandRules: []
tbd: []
related: [adr-0001-nuxt-ui-spike]
since: 0.1.0
updated: 2026-09-25
---

# ADR-0002: Nuxt Content version, docs source, generated blocks, and search

## Context

REQ-051 requires the showcase to render `docs/**/*.md` in place, with no committed copy inside `apps/showcase`. REQ-008 requires the docs to stay plain Markdown with no MDC syntax. SPEC.md §4.5 requires the showcase to swap each `<!-- cn:generated -->` block for a rich preview without rewriting the source, and REQ-002 requires frontmatter that validates against a schema. REQ-056 needs a search. §4.5 names Nuxt Content as the dependency that carries this risk, to be contained by this spike and by version pinning.

Task T0.2 built the smallest possible spike in `spikes/0002-nuxt-content/`:

- `docs/` holds two fixture docs with §4.3 frontmatter. It stands in for the repository's `docs/` and sits **outside** the app, in the app's parent directory. `sample-foundation.md` contains one `cn:generated` block.
- `site/` is the Nuxt app, standing in for `apps/showcase`. It contains no Markdown.
- `verify.mjs` runs three `nuxt generate` builds and checks the output (see "Evidence").

Versions used by the spike: Node 24.19.0, pnpm 12.6.0, `nuxt` 4.5.2 (as in ADR-0001), `@nuxt/content` 3.16.1, `zod` 3.25.76 (through `@nuxt/content`), `@nuxtjs/mdc` 0.23.1 (through `@nuxt/content`), and `yaml` 2.9.1.

## Decision

### 1. Version and license

Pin `@nuxt/content` to exactly **3.16.1**, which is licensed **MIT**. Use Node's built-in SQLite for the build-time database: `content.experimental.sqliteConnector = 'native'` (needs Node 22.5 or later; A-03's Node 24 LTS qualifies). This avoids compiling `better-sqlite3`. Any upgrade is its own task and needs a new ADR, because sections 3 and 4 below depend on Content internals.

### 2. Content source configuration: external directory supported

Nuxt Content 3.16.1 reads a directory outside the app through the collection source's `cwd` option. No copy is needed. `apps/showcase/content.config.ts` follows this pattern:

```ts
defineCollection({
  type: 'page',
  source: {
    cwd: fileURLToPath(new URL('../../docs', import.meta.url)),
    include: '**/*.md',
    exclude: ['**/_template.md']
  },
  schema: frontmatter // zod object built from §4.3
})
```

- Content derives each item's `path` from its location under `cwd`, keeping number prefixes such as `00-` (for example `/00-overview/sample-overview`). Showcase routes follow §4.6 and are resolved by the frontmatter `slug` (`queryCollection('docs').where('slug', '=', slug)`), not from `path`.
- Frontmatter keys declared in the schema become top-level, queryable columns. Undeclared keys go to `meta`.
- The static output also contains `/__nuxt_content/<collection>/sql_dump.txt`, which Content loads in the browser to answer queries after hydration.

**Fallback, not needed with 3.16.1.** If a later version drops external `cwd`, a pre-build step copies `docs/` into `apps/showcase/content/`, and `.gitignore` excludes that directory. REQ-051 forbids only committed copies. The REQ-051 AC1 test must then check that no `.md` file under `apps/showcase/content` is tracked by git, rather than that the directory is empty.

### 3. Frontmatter validation: Content does not enforce the schema, so the build must

Content 3.16.1 uses the collection schema for table columns and typed queries only. It does **not** validate. In the spike's control build, a doc with `status: finished` and `lang: es` built with exit code 0 and rendered "finished". Two more traps showed up:

- An error thrown from a `content:file:*` hook is caught per file and logged as the warning `"<file>" is ignored because parsing is failed`. The doc then disappears silently, and the build still passes.
- Content caches parsed files in `.data/` by a checksum of the file content and its markdown options. On a cache hit, the parse hooks do not run. A validator inside a hook is skipped for any file it has already seen.

Decision:

- The showcase validates frontmatter **from disk**, in Nuxt's `build:before` hook. It reads each `.md` under the docs source, parses the frontmatter with `yaml`, validates it with the same zod object, and throws one error that lists every bad file and field. The build stops before prerendering. The spike's version is `site/guard.ts`.
- The guard also rejects files that start with a UTF-8 BOM. With a BOM, Content does not detect the frontmatter, and the doc renders with every field `null`. (Windows PowerShell 5.1's `Set-Content -Encoding utf8` writes a BOM.)
- In the real repository, `pnpm check:docs` (REQ-002, T2.2) stays the primary gate, using `docs/_schema/frontmatter.schema.json`. The showcase guard is a second line of defense. The guard should validate against that same JSON schema, or against a zod object generated from it, so the two can't drift. Picking the mechanism belongs to the task that builds `check-docs`.
- The guard must skip the files that §4.3 exempts: `_template.md`, and `00-overview/brand-context-source.md`, which has no frontmatter.

### 4. Generated-block interception

Use Content's `content:file:beforeParse` hook to rewrite the **in-memory** copy of each Markdown file before parsing (`site/intercept.ts`). Each `<!-- cn:generated k="v" … -->` … `<!-- /cn:generated -->` region becomes an MDC block component:

```text
::cn-generated{tokens="…" format="…"}
<the generated table, unchanged>
::
```

- The file on disk is never written. The raw Markdown keeps its comment markers and plain table, and contains no MDC syntax (REQ-008 AC1).
- `components/content/CnGenerated.vue` receives the marker's attributes as props and the original table as its default slot. The real component picks a rich preview per token type from `tokens` and `format` (§4.5 mechanic 2), and can fall back to the slot.
- The hook runs when Content parses a file at build time, not in the browser. The result is part of the prerendered HTML, so the page needs no client-side work.
- Because of the parse cache (section 3), a cached file keeps the output of the old interceptor after the interceptor code changes. CI always builds from a clean checkout, so CI output is correct. Locally, delete `apps/showcase/.data` after changing the interceptor. The showcase `generate` script should do this.

### 5. Search approach

Options evaluated against REQ-056 (Ctrl+K / Cmd+K; doc titles, headings, token paths, and component names; navigate to page and anchor):

| Option | Static? | Covers token paths and component names | UI | Verdict |
|---|---|---|---|---|
| A. Content `queryCollectionSearchSections` prerendered to JSON, shown in Nuxt UI `UContentSearch` | Yes | Yes, as extra `groups` built from `tokens.flat.json` and component frontmatter | Nuxt UI command palette (ER-01) | **Chosen** |
| B. Pagefind index built from `.output/public` after generate | Yes | Only what is rendered as text | Pagefind UI, or a hand-rolled modal (conflicts with ER-01) | Rejected |
| C. Custom MiniSearch or Fuse index written by a script | Yes | Yes | Needs its own modal | Rejected: duplicates A |
| D. Hosted search such as Algolia DocSearch | No; external crawler and service | Only what is crawled | External widget | Rejected: adds an external service that a static site does not need |

Evidence for A: the spike prerenders `/search-sections.json` from `queryCollectionSearchSections(event, 'docs')`. It holds 14 sections for the two fixtures, one per heading with its `#anchor`. Generated-table text is included, so token paths inside generated blocks are searchable. `@nuxt/ui` 4.11.2 (ADR-0001) ships `UContentSearch` with `files`, `navigation`, `links`, and `groups` props and a `shortcut` prop that defaults to `meta_k` (`defineShortcuts` maps `meta` to Ctrl on Windows and Linux).

Not proven by this spike: `UContentSearch` itself was not rendered. Section ids use Content's `path` (`/00-overview/sample-overview#purpose`), so the showcase must map them to §4.6 routes. `UContentSearch` also has a color-mode ("theme") command, which must stay off (REQ-031). The search task (REQ-056) verifies all three.

## Consequences

- `apps/showcase` copies the spike's pattern when it is created (P5): `content.config.ts` with `cwd: ../../docs`, a `build:before` frontmatter guard, the `beforeParse` interceptor, and `components/content/CnGenerated.vue`.
- The REQ-051 AC1 test ("no `.md` under `apps/showcase/content`") holds trivially, because no content directory is needed.
- `docs/00-overview/brand-context-source.md` has no frontmatter, so Content stores it with `null` schema fields. The showcase renders it through a dedicated route with a fixed title (§4.3), not through the slug lookup.
- Serving under the GitHub Pages subpath `/cup-noobles-desgins-system/` (REQ-050 AC3) was not tested here. It is covered by the deploy task.
- The spike uses `nuxt generate` output checks only. The real test stack (ER-06) is set up in P1. `spikes/` is deleted in T1.1.
- Revisit this ADR when upgrading `@nuxt/content` past 3.16.1, especially if Content starts enforcing collection schemas (the guard would become redundant), or changes the parse cache, hook error handling, or external `cwd` support.

### Evidence

Run from `spikes/0002-nuxt-content/site`: `pnpm install`, then `pnpm verify`.

```text
PASS  Control: Content alone does not enforce the schema  [exit 0]
PASS  Build fails on invalid frontmatter  [exit 1]
PASS  Failure names the file and exactly the bad fields
PASS  Failure flags a BOM-prefixed doc
PASS  Failure stops the build before prerendering
PASS  Static generate succeeds against ../docs  [exit 0]
PASS  Source docs unchanged by the build
PASS  No .md file inside the app directory (REQ-051 AC1)
PASS  One static route per doc (REQ-051 AC2 shape)  [2 routes, 2 docs]
PASS  sample-overview rendered statically
PASS  sample-foundation rendered statically
PASS  Frontmatter reaches the page (status)
PASS  Generated block intercepted into CnGenerated
PASS  Original table kept as the fallback slot
PASS  No raw cn:generated marker leaks into HTML
PASS  Raw .md keeps the marker and has no MDC syntax (REQ-008 AC1)
PASS  Search sections prerendered for both docs  [14 sections]
PASS  Search content includes generated table text
```
