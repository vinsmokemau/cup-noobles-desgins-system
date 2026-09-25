---
title: "ADR-0005: Baseline assumptions and conflict resolutions"
slug: adr-0005-baseline-assumptions-and-conflicts
layer: adr
status: draft
lang: en
brandRules: [BR-01, BR-02, BR-03, BR-10, BR-12, BR-13]
tbd: [TBD-06, TBD-08, TBD-13]
related: [adr-0001-nuxt-ui-spike, adr-0002-nuxt-content-spike, adr-0003-style-dictionary-dtcg-spike, adr-0004-mjml-email-spike]
since: 0.1.0
updated: 2026-09-25
---

# ADR-0005: Baseline assumptions and conflict resolutions

## Context

SPEC.md §2.3 lists 14 working assumptions (A-01 to A-14) and says each one is recorded as an ADR in T0.5. SPEC.md §2.2 lists 6 conflicts between the brand source (BC), the e-commerce plan (EC), and the owner's answers (OA), with a resolution and a status for each. REQ-073 requires decisions to be recorded as ADRs, so later tasks and TBD resolutions can cite a number.

This ADR records all 20 items as they stand on 2026-09-25, spec version 1.6, after the spikes in ADR-0001 to ADR-0004. It adds no new decision. Where a spike or an owner answer has since confirmed or narrowed an item, the evidence is named.

## Decision

### 1. Assumptions

Every assumption below is in force until the owner overrides it. An override needs a new ADR that supersedes the matching row here, plus a SPEC.md amendment (§8).

| ID | Assumption (SPEC.md §2.3) | Status on 2026-09-25 | Evidence |
|---|---|---|---|
| A-01 | A single maintainer runs the system with Claude Code. Governance is sized for one person, with no review board. | In force | — |
| A-02 | The theme is dark-only, because BR-03 makes pure black the base. There is no color-mode toggle. | In force; mechanism proven | ADR-0001 §4: `ui.colorMode: false` and a server-rendered `<html class="dark">`. |
| A-03 | Tooling is pnpm workspaces, the current Node LTS, and TypeScript in strict mode. | In force | The spikes ran on Node 24.19.0 (LTS) and pnpm 12.6.0 (ADR-0001). T1.1 pins them in `.nvmrc` and the workspace. |
| A-04 | All three packages are versioned in lockstep, starting at `0.1.0`. `1.0.0` is blocked by REQ-018. | In force | REQ-070 AC1 (Changesets, lockstep). |
| A-05 | The showcase is generated statically and hosted publicly on GitHub Pages (OD-02). | Confirmed by the owner | OA-10 (OD-02 decided); OA-11 (OD-14: public repository). ADR-0002 proves the static build. |
| A-06 | Docs are in English (ER-10). Every UI copy example is es-MX (ER-04) and labeled with its locale. | In force | OA-5. |
| A-07 | There is no Figma source of truth. The DTCG token JSON is the master. | In force | — |
| A-08 | Email body width is at most 600 px, the common email-client convention. This value is an assumption, not a brand rule. | In force; not a brand value | — |
| A-09 | The reference viewports for tests are 360 px (ER-05), 768 px, and 1280 px. The real breakpoint tokens are TBD-13. | In force until TBD-13 is resolved | TBD-13 stays open; ADR-0006 lists its placeholder values. |
| A-10 | The accessibility target is WCAG 2.2 level AA. | In force | — |
| A-11 | Components never contain hardcoded copy. All text arrives through props or slots, which keeps them locale-agnostic (supports ER-09). | In force | Enforced from T1.3 (hardcoded-text-node rule). |
| A-12 | Visual regression uses Playwright screenshot assertions inside one pinned CI container image, to avoid font-rendering differences between machines. | In force | Set up in T1.4. |
| A-13 | Tokens follow the W3C Design Tokens Community Group (DTCG) format and are built with Style Dictionary. Format support is verified in T0.3. | In force; verified | ADR-0003: `style-dictionary` 5.5.5 reads DTCG natively; all four outputs are deterministic. |
| A-14 | Email sources are written in MJML and compiled to static HTML at build time. Confirmed by the owner (OA-6, OD-12). | Confirmed by the owner | OA-6 (OD-12 decided); ADR-0004 proves `$cn(...)` injection and intact `{{ }}` slots. |

### 2. Conflicts

| ID | Conflict (short) | Resolution in force | Status on 2026-09-25 | Decided by |
|---|---|---|---|---|
| C-01 | EC §3.3 says "Do not build a design system," and this project builds one. | **Option A.** The design system is a documented theming layer over Nuxt UI. Tokens drive Nuxt UI's theme; themed Nuxt UI components are the atoms and most molecules. Custom `Cn*` components exist only where Nuxt UI has no equivalent. ER-01 stays in force. | Resolved | OA-1 |
| C-02 | Option A as first proposed put commerce components in the design system, but OA-4 requires it to be project-agnostic. | Commerce components stay in the storefront repo and are built from design system parts. The design system ships generic parts only. REQ-022 enforces this with a forbidden domain-term list. | Resolved | OA-10 (OD-01 (a)) |
| C-03 | ER-02 limits consuming apps to "Tailwind for layout only," but BR-10 and BR-13 need visual styling somewhere. | Visual styling lives only inside `packages/nuxt` (the Nuxt UI theme configuration and the token CSS). Consuming apps keep ER-02 as written. REQ-016 forbids raw values everywhere. | Resolved | OA-10 (OD-11 confirmed) |
| C-04 | BC lists stream overlays as a use of the system, but OA-4 limits scope to the storefront and emails. | Overlays are a non-goal (SPEC.md §1.3). The `tokens` package stays framework-free so an overlay project can adopt it later. | Needs confirmation | Awaits OD-10 |
| C-05 | BR-12 says cards have a "dark surface," but BR-03 says the base "must stay pure black, not dark gray." | No surface color is defined. `color.surface.card` is TBD-06. Until OD-05 is decided, cards render on `color.bg.base`, separated by a thick outline (BR-13), and the showcase marks the token TBD. | Open | Awaits OD-05 |
| C-06 | BR-01 and BR-02 give one hex each, but Nuxt UI color aliases need a full shade scale. Generating shades would invent colors. | No tints or shades are generated without approval. Until OD-04 is decided, every alias shade Nuxt UI needs is filled with the single brand hex and marked `derived-pending`. | Open | Awaits OD-04 |

### 3. What the spikes added to the conflicts

These are findings, not new resolutions. They do not change any status above.

- **C-01.** ADR-0001 §7 found that `@nuxt/ui` 4.11.2 ships `UHeader` and `UFooter`. Under C-01's own rule ("unless T0.1 finds Nuxt UI equivalents") and SPEC.md §4.10, `site-header` and `site-footer` become `source: nuxt-ui`, and the custom `Cn*` set shrinks to the logo, the decorative motifs, and the featured media card. The §4.10 table row and the C-01 wording still name `CnSiteHeader` and `CnSiteFooter`. Updating that text is an owner amendment (SPEC.md §8), still outstanding.
- **C-06.** ADR-0001 §3 confirmed that each Nuxt UI color alias reads all 11 shades (`50` to `950`), and that dark mode uses shade 400 for `--ui-<alias>`. The C-06 default (11 copies of one brand hex, `derived-pending`) is therefore required, not hypothetical. TBD-08 and OD-04 stay open.
- **C-05.** ADR-0001 noted that Nuxt UI's dark defaults set `--ui-bg` to neutral-900. The layer must remap it to `--cn-color-bg-base` (`#000000`, BR-03), which is consistent with C-05's interim rule.

## Consequences

- Later tasks cite this ADR when they rely on an assumption or a conflict resolution, for example T1.1 (A-03), T1.4 (A-12), T5.1 (A-02, C-03, C-06), T8.1 (C-05), and T10.x (A-08, A-14).
- When the owner decides OD-04, OD-05, or OD-10, or overrides an assumption, a new ADR records the decision and states which row of this ADR it supersedes. This ADR is not edited to change a decision; only its status moves to `deprecated` once every row is superseded.
- The §4.10 and C-01 wording for `site-header` and `site-footer` stays out of date until the owner amends SPEC.md. Until then, the SPEC.md text and ADR-0001 disagree, so T8.6 hits SPEC.md §0.1 rule 5 (stop and ask the owner) if it is still unsettled.
- Revisit this ADR at the P0 exit review (SPEC.md §5) and before release `1.0.0`.
