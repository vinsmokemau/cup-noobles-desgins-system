# SPEC.md — Cup Noobles Design System

| Field | Value |
|---|---|
| Document type | Requirements specification for Spec-Driven Development (SDD) with Claude Code |
| Spec version | 1.14 |
| Status | Approved for Phase 0; later phases are gated by the open decisions in §7.2 |
| Owner | Cup Noobles design system owner (single maintainer, see A-01) |
| Repository | `github.com/vinsmokemau/cup-noobles-desgins-system` (OA-7, OA-8, OA-9) |

---

## 0. How Claude Code uses this file

This file is the contract. Code is built from it; it is not derived from code.

### 0.1 Execution protocol (every session)

1. Read §0, §2 (rules, conflicts, assumptions, TBD register) and the task you were given in §6. If `DESIGN.md` exists, read it as well.
2. Execute exactly **one task** per session. Do not start the next task.
3. Implement only the requirement IDs listed on the task. If the task seems to need work that no listed requirement covers, stop and ask.
4. **Never invent brand values.** Colors, typefaces, font sizes, radii, stroke widths, glow values, spacing, motion values, icon sets, logos, and illustrations come only from §2.1, from an approved ADR, or from the owner in chat. Anything else is recorded with the TBD convention (§4.4), never as a guessed value.
5. If this spec contradicts itself, contradicts `docs/00-overview/brand-context-source.md`, or contradicts an ADR, stop. Quote both passages to the owner and wait for a decision. Do not pick one silently.
6. Before reporting done, complete the Definition of Done in §0.2 and report each item as pass or fail.
7. When a task is done, change its checkbox in §6 from `[ ]` to `[x]` and append the date and commit SHA.

### 0.2 Definition of Done (applies to every task)

- [ ] Every acceptance criterion of every REQ listed on the task is met, and each one is backed by an automated test or check, or marked `manual:` with the reason it can't be automated.
- [ ] `pnpm test:all` passes locally, including every test from earlier tasks.
- [ ] `pnpm check:docs`, `pnpm check:tokens`, and `pnpm sync:docs --check` pass.
- [ ] No brand value was introduced without a source (§2.1, an ADR, or the owner). New unknowns are registered as TBD items.
- [ ] Every doc touched by the task has `status` set correctly in its frontmatter (§4.3).
- [ ] If public API, tokens, or docs changed, a changeset file exists (§4.8).
- [ ] The task's "Done when" statement is true, and the final report names the evidence (test name, command output, or screenshot path).

### 0.3 Commands (defined in T1.2–T1.4, T2.2, T3.1, and T3.6)

| Command | Runs |
|---|---|
| `pnpm test` | Lint, typecheck, unit tests, docs checks, token checks. Fast; run it constantly. |
| `pnpm test:all` | `pnpm test`, then token build, email build, showcase static generation, Playwright end-to-end tests with axe, and visual regression tests. CI runs this on every push. |
| `pnpm check:docs` | Validates frontmatter, template headings, links, and forbidden patterns in `docs/` and `DESIGN.md`. |
| `pnpm check:tokens` | Validates the token schema, tier references, and contrast pairs. |
| `pnpm check:tbd` | Writes `reports/tbd-report.json` and prints the count of open TBD items. |
| `pnpm sync:docs [--check]` | Regenerates the generated blocks inside the `.md` files. With `--check`, it only reports drift and fails if any is found. |

---

## 1. Overview

### 1.1 Goal

Build the Cup Noobles Design System as an independent, reusable repository with two deliverables:

1. **Documentation.** `DESIGN.md` is the entry point. It links to a set of focused `.md` files, one per part of the system. These files are the reference that every future Cup Noobles project must follow.
2. **Showcase web app.** A static site that renders those same `.md` files and visualizes every token, atom, molecule, organism, pattern, and email component, all live and inspectable.

### 1.2 Scope

| In scope | Notes |
|---|---|
| Foundations and tokens | Color, typography, spacing, shape (radius and line work), effects (glow, elevation, z-index), motion, layout, iconography, imagery and motifs, accessibility |
| Components | Atoms, molecules, and organisms, following the Option A architecture (§2.2, C-01): Nuxt UI components themed through a layer, plus custom `Cn*` components only where Nuxt UI has nothing equivalent |
| Patterns | Forms, feedback, loading, navigation, empty states, error pages, responsive behavior |
| Content guidelines | Voice and tone, microcopy mechanics, formatting of numbers, currency, and dates |
| Email | Email-safe foundations, components, and one reference layout, compiled to static HTML that any backend can use |
| Governance | Ownership, versioning, releases, contribution, deprecation, decision records |
| Distribution | Three packages: `tokens` (framework-free), `nuxt` (Nuxt layer), and `email` (static HTML) |
| Showcase | A static Nuxt site that renders `docs/` directly |

### 1.3 Non-goals

- **Changes to the e-commerce repository.** That includes adopting these packages in the storefront or porting email partials into Django templates. Those tasks belong to the e-commerce project.
- **Any change to the Django admin UI.** (owner answer, Q4)
- **Commerce components.** ProductCard, VariantSelector, PriceTag, AvailabilityBadge, PreorderBanner, and CartLine are out of the design system (C-02, OD-01). The storefront builds them from design system parts.
- **Stream overlays.** "Starting Soon" screens and other overlays are not built here (C-04, OD-10). The token outputs stay framework-free so an overlay project can use them later.
- **A light theme.** The system is dark-only (A-02).
- **A Figma library.** The token JSON is the master source (A-07).
- **React, Svelte, or other framework bindings.** Only the Vue/Nuxt layer is built. Tokens and email HTML stay framework-free.
- **Reimplementing interactive primitives that Nuxt UI already provides**, such as a modal, combobox, select, tooltip, or toast (C-01).
- **Brand creation.** No logo, typeface, or color is designed here. Missing brand inputs are tracked as TBD items (§2.4).

---
## 2. Carried-forward rules, conflicts, assumptions, and TBD items

Source key:
- **BC**: `cup_noobles_desgin_context.md`, the brand context document supplied by the owner. It is stored verbatim at `docs/00-overview/brand-context-source.md`.
- **EC**: the "E-commerce implementation plan for Cup Noobles", a separate project in this workspace.
- **OA**: the owner's answers to the five pre-spec questions (§2.5).

### 2.1 Carried-forward rules

Each rule below must be reflected in the docs and enforced wherever a requirement says so. Rules marked **BC** are brand rules: quote them, and never reinterpret them without an ADR.

#### Brand identity (BC)

| ID | Rule | Source |
|---|---|---|
| BR-01 | Primary color is `#ef80ae`, a neon/hot pink. It is the protagonist color and dominates the visual identity. | BC §Color Palette |
| BR-02 | Secondary color is `#fff488`, a bright yellow/gold. It is used as a luminous, premium accent. | BC §Color Palette |
| BR-03 | Tertiary color is `#000000`, pure black, used for the base and background. It **must stay pure black, not dark gray.** | BC §Color Palette |
| BR-04 | The aesthetic is geek, gaming, anime, TCG, and board game culture, with a retro-arcade, neon, "sticker mascot logo" style. | BC §Brand Aesthetic |
| BR-05 | The brand is premium, fun, and energetic. It is **never childish or generic.** | BC §Brand Aesthetic |
| BR-06 | The UI is high-contrast, vibrant, and legible. | BC §Brand Aesthetic |
| BR-07 | Typography is a bold, retro display sans-serif, similar in feel to the logo. The specific typeface is TBD-01. | BC §Typography |
| BR-08 | Type hierarchy is H1 → H2/H3 → body → caption. | BC §Typography |
| BR-09 | Type feels bold, geek, and premium, with strong presence and easy legibility. | BC §Typography |
| BR-10 | Buttons have rounded corners, a subtle neon glow, and a thick outline stroke. | BC §Components |
| BR-11 | Button states are primary, secondary, ghost, and disabled. | BC §Components |
| BR-12 | Cards have a dark surface with neon highlights. There are two card types: a standard content card, and a featured media card (thumbnail, title, and tag badge). | BC §Components |
| BR-13 | Line work is thick, clean, and high-contrast throughout all UI and illustration. | BC §Line work |
| BR-14 | Decorative motifs: sparkles and stars, sticker-style borders, a pink ramen cup with gamer details (the core brand icon), noodle-inspired curves and waves, a golden d20, chopsticks, and arcade-inspired shapes and dynamic lines. | BC §Decorative Motifs |
| BR-15 | The system is responsive and works on both mobile and web/dashboard layouts. | BC §Usage Context |
| BR-16 | The brand assets are a circular "CN" icon, a vertical "Cup Noobles" lockup, and a horizontal "Cup Noobles" wordmark. The asset files have not been supplied yet (TBD-17). | BC §Usage Context |
| BR-17 | The overall feel conveys anticipation, hype, energy, gamer/geek identity, visual professionalism, and memorable branding. | BC §Overall Feel |

#### Engineering and product constraints (EC, OA)

| ID | Rule | Source |
|---|---|---|
| ER-01 | Nuxt UI provides the interactive components. Do not hand-roll a modal, combobox, or any other primitive that Nuxt UI provides. | EC §3.3 rule 3, confirmed by OA-1 |
| ER-02 | The consuming Nuxt apps use Tailwind for layout only, and keep custom CSS to a small file of brand tokens. How this rule applies to the design system is set out in C-03. | EC §3.3 rule 4 |
| ER-03 | The storefront is Nuxt 4 (Vue 3) in SSR mode, so the design system's Nuxt layer must work in an SSR app. | EC §3.3 |
| ER-04 | Customer-facing copy is Spanish (es-MX). | EC Phase 11/12 |
| ER-05 | Layouts must work at 360 px wide. | EC Phase 12 |
| ER-06 | Test tooling: Vitest with `@nuxt/test-utils` for components, Playwright for end-to-end tests, and axe (`@axe-core/playwright`) for accessibility. A task is not done until the full suite passes. | EC §6, adopted here for consistency |
| ER-07 | This repository is independent of the e-commerce project: separate repo, separate CI, separate deployment. | OA-3 |
| ER-08 | Covered surfaces are the storefront and transactional emails. The Django admin UI is not changed. | OA-4 |
| ER-09 | The system is project-agnostic and reusable. Nothing in the packages may assume the e-commerce domain. | OA-4 |
| ER-10 | All documentation, including DESIGN.md, the `.md` files, and this spec, is written in English. | OA-5 |

#### Derived facts (computed from BR-01 to BR-03 using the WCAG 2.x relative-luminance formula)

These are measurements, not new rules. REQ-015 enforces them.

| Pair | Contrast | WCAG 2.2 AA result |
|---|---|---|
| Pink `#ef80ae` on black `#000000` | 8.37:1 | Passes for text and for UI components |
| Yellow `#fff488` on black `#000000` | 18.55:1 | Passes for text and for UI components |
| Black text on a pink fill | 8.37:1 | Passes. **Labels on primary-filled buttons must be black.** |
| Black text on a yellow fill | 18.55:1 | Passes |
| White text on a pink fill | 2.51:1 | **Fails.** Never allowed as text. |
| Yellow on pink (either direction) | 2.22:1 | **Fails.** Never allowed as text, and never as the only boundary between two UI regions. |
| White on yellow | 1.13:1 | **Fails** |

### 2.2 Conflicts and their resolutions

| ID | Conflict | Resolution in this spec | Status |
|---|---|---|---|
| C-01 | EC §3.3 says "Do not build a design system." This project builds one. | OA-1 chose **Option A**. The design system is a documented theming layer over Nuxt UI. Tokens drive Nuxt UI's theme, and themed Nuxt UI components serve as the atoms and most molecules. Custom `Cn*` components exist only where Nuxt UI has no equivalent: logo, decorative motifs, and the featured media card. The site header and footer are themed `UHeader` and `UFooter`, because T0.1 found Nuxt UI equivalents (ADR-0001). ER-01 stays in force. | Resolved (OA-1) |
| C-02 | Option A, as first proposed, put commerce components (ProductCard, VariantSelector, PriceTag, AvailabilityBadge) in the design system. OA-4 requires the system to be project-agnostic. | **Default:** commerce components stay in the storefront repo and are built from design system parts. The design system ships generic parts such as Card, MediaCard, Badge, and FormField. REQ-022 enforces this with a list of forbidden domain terms. | Resolved (OD-01, OA-10) |
| C-03 | ER-02 limits consuming apps to "Tailwind for layout only." But BR-10 and BR-13 (glow, thick outlines, rounded corners) require visual styling somewhere. | Visual styling lives **only** inside `packages/nuxt`: the Nuxt UI theme configuration and the token CSS. A consuming app keeps ER-02 as written and does no visual styling of its own. REQ-016 enforces that no raw values appear anywhere. | Resolved (OD-11, OA-10) |
| C-04 | BC §Usage Context lists stream overlays as a use of the system. OA-4 limits scope to the storefront and emails. | Overlays are a non-goal (§1.3). The `tokens` package ships framework-free CSS and JSON, so an overlay project can adopt it later without changes. | Needs confirmation (OD-10) |
| C-05 | BR-12 describes cards as having a "dark surface," while BR-03 says the base "must stay pure black, not dark gray." A card on a pure-black page needs *something* to separate it from the page. | No surface color is defined. The token `color.surface.card` is TBD-06. Until OD-05 is decided, cards render on `color.bg.base`, separated by a thick outline (BR-13), and the showcase marks the token TBD. | Open (OD-05) |
| C-06 | BR-01 and BR-02 give one hex value per color. Nuxt UI color aliases probably expect a full shade scale (to be verified in T0.1). Generating shades would mean inventing colors. | No tints or shades are generated without approval. Until OD-04 is decided, every alias shade that Nuxt UI requires is filled with the single brand hex and marked `derived-pending`. | Open (OD-04) |

### 2.3 Assumptions

The owner can override any of these. Each assumption is recorded as an ADR in T0.5.

| ID | Assumption |
|---|---|
| A-01 | A single maintainer runs the system with Claude Code. Governance is sized for one person, with no review board. |
| A-02 | The theme is dark-only, because BR-03 makes pure black the base. There is no color-mode toggle. |
| A-03 | Tooling is pnpm workspaces, the current Node LTS, and TypeScript in strict mode. |
| A-04 | All three packages are versioned in lockstep, starting at `0.1.0`. `1.0.0` is blocked by REQ-018. |
| A-05 | The showcase is generated statically and hosted publicly on GitHub Pages (OD-02). |
| A-06 | Docs are in English (ER-10). Every UI copy example is es-MX (ER-04) and labeled with its locale. |
| A-07 | There is no Figma source of truth. The DTCG token JSON is the master. |
| A-08 | Email body width is at most 600 px, the common email-client convention. This value is an assumption, not a brand rule. |
| A-09 | The reference viewports for tests are 360 px (ER-05), 768 px, and 1280 px. The real breakpoint tokens are TBD-13. |
| A-10 | The accessibility target is WCAG 2.2 level AA. |
| A-11 | Components never contain hardcoded copy. All text arrives through props or slots, which keeps them locale-agnostic (supports ER-09). |
| A-12 | Visual regression uses Playwright screenshot assertions inside one pinned CI container image, to avoid font-rendering differences between machines. |
| A-13 | Tokens follow the W3C Design Tokens Community Group (DTCG) format and are built with Style Dictionary. Format support is verified in T0.3. |
| A-14 | Email sources are written in MJML and compiled to static HTML at build time. Confirmed by the owner (OA-6, OD-12). |

### 2.4 TBD register

These values are **not defined** in any source. Each one is a token or doc field with `status: tbd` until the owner supplies it or approves it through an ADR. Claude Code must never fill them in on its own.

| ID | Item | Blocks | Owner input needed |
|---|---|---|---|
| TBD-01 | Display typeface: family, license, and web and email availability. It must match BR-07. | typography.md, `font.family.display` | Font name and license |
| TBD-02 | Body typeface, or confirmation that one family covers both display and body | `font.family.body` | Font name |
| TBD-03 | Type scale: sizes, line heights, weights, and letter spacing for H1, H2, H3, body, and caption | `font.size.*`, `font.lineHeight.*` | Values or approval of a proposal |
| TBD-04 | Body text color: pure white or an off-white | `color.text.default` | Hex |
| TBD-05 | Neutral scale for secondary text, borders, disabled states, and dividers | `color.neutral.*` | Hex set |
| TBD-06 | Card and elevated surface colors (see C-05) | `color.surface.*` | Decision OD-05 |
| TBD-07 | Feedback colors for success, warning, error, and info | `color.feedback.*` | Hex set |
| TBD-08 | Tints and shades of pink and yellow (see C-06) | Nuxt UI alias scales | Decision OD-04 |
| TBD-09 | Spacing base unit and scale | `space.*` | Base unit |
| TBD-10 | Corner radius values ("rounded" in BR-10) | `radius.*` | Values |
| TBD-11 | Stroke widths ("thick" in BR-10 and BR-13) | `border.width.*` | Values |
| TBD-12 | Neon glow parameters: blur, spread, opacity, and which color is used per state ("subtle" in BR-10) | `effect.glow.*` | Values |
| TBD-13 | Breakpoints and container widths. The 360 px minimum is fixed by ER-05. | `breakpoint.*` | Values |
| TBD-14 | Motion durations and easing curves | `motion.*` | Values |
| TBD-15 | Elevation and z-index scale | `elevation.*`, `z.*` | Values |
| TBD-16 | Focus indicator style. Required by REQ-024 to differ from the glow. | `focus.*` | Resolved (ADR-0009) |
| TBD-17 | Logo files: CN icon, vertical lockup, and horizontal wordmark, as SVG, with clear-space and minimum-size rules | `CnLogo`, brand-identity.md | SVG files and rules |
| TBD-18 | Motif artwork (BR-14) as SVG | `CnSparkle`, imagery-and-motifs.md | SVG files |
| TBD-19 | Icon set (library and stroke style consistent with BR-13) | iconography.md | Decision OD-09 |
| TBD-20 | Photography and thumbnail standards. This is the same open item as EC decision D11. | imagery-and-motifs.md | Guidelines |
| TBD-21 | Voice attributes beyond the adjectives in BC (the "this, not that" pairs) | voice-and-tone.md | Approval of a draft |

### 2.5 Owner answers on record

| ID | Question | Answer |
|---|---|---|
| OA-1 | How should the conflict with EC's "Do not build a design system" be resolved? | Option A: a themed layer over Nuxt UI |
| OA-2 | What design assets exist? | `cup_noobles_desgin_context.md` (BC) |
| OA-3 | Where does the showcase live? | Somewhere independent of the e-commerce project |
| OA-4 | Which surfaces are covered? | The storefront and emails. The system must be project-agnostic and reusable, and the Django admin UI is not changed. |
| OA-5 | What language are the docs in? | English |
| OA-6 | OD-12: How are email templates authored? | MJML, as recommended |
| OA-7 | OD-13: Where is the code hosted, and what is the repository called? | GitHub; repository `cup-noobles-desgins-system` |
| OA-8 | OD-13: Who owns the repository? | A personal GitHub account |
| OA-9 | OD-13 and OD-03: What is the package scope, and where are packages published? | Scope `@vinsmokemau` (the GitHub username), brand in each package name, published privately on GitHub Packages |
| OA-10 | OD-01, OD-02, and OD-11 | OD-01: commerce components live in the storefront repo, built from design system parts. OD-02: the showcase is public, on GitHub Pages. OD-11: confirmed. |
| OA-11 | OD-14: What is the repository's visibility? | Public; created empty at `https://github.com/vinsmokemau/cup-noobles-desgins-system` |

---
## 3. Requirements

Format: each requirement is one verifiable statement followed by its acceptance criteria (AC). "Check" means an automated script or test that runs in `pnpm test` or `pnpm test:all`. "Manual" means the owner verifies it by hand, and the reason automation isn't possible is given.

### 3.1 Documentation

**REQ-001. `DESIGN.md` is the single entry point, and it links every doc.**
- AC1. `DESIGN.md` exists at the repository root.
- AC2. Every `docs/**/*.md` file except `docs/_template.md` and the ADRs is linked directly from `DESIGN.md`. ADRs are linked from `docs/06-governance/decision-log.md`. Check: `check-links` reports zero orphan docs.
- AC3. Every relative link in `DESIGN.md` and in `docs/` resolves to an existing file and heading anchor. Check: `check-links` reports zero broken links.
- AC4. `DESIGN.md` lists docs grouped by layer, in this order: overview, foundations, components (atoms, molecules, organisms), patterns, content, email, governance.

**REQ-002. Every doc has valid frontmatter.**
- AC1. Frontmatter validates against `docs/_schema/frontmatter.schema.json` (fields in §4.3). Check: `check-docs`.
- AC2. `status` is exactly one of `tbd`, `draft`, `stable`, or `deprecated`.
- AC3. Every component doc sets `level` to `atom`, `molecule`, or `organism`, and sets `source` to `nuxt-ui` or `custom`.
- AC4. `docs/_template.md` and `docs/00-overview/brand-context-source.md` are exempt from REQ-002 and REQ-003 (§4.3).

**REQ-003. Every doc follows the standard template.**
- AC1. The required H2 headings for the doc's `layer` (§4.2) are present and in order. Check: `check-docs`.
- AC2. A section that does not apply contains the single line `Not applicable.` and nothing else.

**REQ-004. Token values in docs are generated, never hand-written.**
- AC1. Token tables appear only between `<!-- cn:generated ... -->` and `<!-- /cn:generated -->` markers (§4.5).
- AC2. Outside generated blocks, no hex color literal (`#[0-9a-fA-F]{3,8}\b`) appears in `docs/` or `DESIGN.md`. Three exceptions apply: `docs/00-overview/brand-context-source.md`; ADRs in `docs/06-governance/decisions/`, because they record values with their source (§4.4); and fenced blocks tagged `bad-example`. Check: `check-docs`.
- AC3. `pnpm sync:docs --check` exits 0 on a clean tree and exits non-zero after any token value changes until `pnpm sync:docs` is run.

**REQ-005. Undefined values follow a single TBD convention.**
- AC1. Every undefined item in a doc appears as a `> **TBD (TBD-NN):** …` callout that references an ID from §2.4, or a new ID appended to §2.4 in the same commit.
- AC2. Every undefined token has `$extensions.cn.status = "tbd"`.
- AC3. `pnpm check:tbd` writes `reports/tbd-report.json` listing every TBD callout and every TBD token, with its file and ID.

**REQ-006. The brand context is preserved verbatim.**
- AC1. `docs/00-overview/brand-context-source.md` is byte-identical to the file the owner supplied. Check: a SHA-256 test against a committed hash.
- AC2. Each BR rule quoted in any doc names its BR ID from §2.1.
- AC3. Any change to a BR rule requires a new ADR, and `brand-context-source.md` is replaced only together with an updated hash and that ADR.

**REQ-007. Docs are English, and UI copy examples are es-MX.**
- AC1. Every doc's frontmatter declares `lang: en`.
- AC2. Every UI copy example sits in a fenced block tagged `copy es-MX` or `copy-bad es-MX`. Check: `check-docs` fails on the `copy` tag without a locale.

**REQ-008. Docs are fully readable without the showcase.**
- AC1. No MDC component syntax appears in `docs/` outside fenced code blocks: no line starts with `::`, and there is no `:component{…}` inline syntax. Fenced code is never parsed as MDC, so it may show MDC as literal code. Check: `check-docs`.
- AC2. Live demos are attached through frontmatter (`demos:`), never embedded in prose.
- AC3. Manual (depends on rendering in a third-party viewer): a sample of three docs renders correctly in the repository host's Markdown preview.

**REQ-009. Draft content is visibly marked as draft.**
- AC1. Any rule not sourced from BC, an ADR, or the owner lives in a doc with `status: draft`, or inside a `> **Draft:**` callout.
- AC2. A doc moves from `draft` to `stable` only when an ADR or an owner approval is referenced in its changelog section.

### 3.2 Tokens

**REQ-010. Tokens are DTCG JSON in three tiers.**
- AC1. Token sources live in `tokens/primitive/`, `tokens/semantic/`, and `tokens/component/`, and they validate against the DTCG schema. Check: `check-tokens`.
- AC2. Semantic tokens reference only primitive tokens. Component tokens reference only semantic tokens. Check: `check-tokens` fails on any other reference.
- AC3. Raw values appear only in primitive tokens.

**REQ-011. The brand colors are exact.**
- AC1. `color.brand.pink = #ef80ae`, `color.brand.yellow = #fff488`, and `color.brand.black = #000000` are primitive tokens with status `stable`.
- AC2. The semantic tokens `color.brand.primary`, `color.brand.secondary`, and `color.bg.base` reference those primitives, in that order.
- AC3. The built CSS contains `--cn-color-brand-primary: #ef80ae`, `--cn-color-brand-secondary: #fff488`, and `--cn-color-bg-base: #000000`. Check: a snapshot test.

**REQ-012. The page base stays pure black.**
- AC1. `color.bg.base` resolves to exactly `#000000`. Check: a unit test.
- AC2. The `<body>` background in the showcase and in the consumer fixture computes to `rgb(0, 0, 0)`. Check: a Playwright test.

**REQ-013. The token build produces every required output.**
- AC1. `pnpm --filter @vinsmokemau/cup-noobles-tokens build` writes `dist/css/tokens.css` (custom properties), `dist/json/tokens.flat.json` (resolved values), `dist/ts/tokens.ts` (typed constants), and `dist/email/email-tokens.json` (email-safe resolved values with no references and no `var()`).
- AC2. The outputs are deterministic: two builds produce byte-identical files. Check: a test.
- AC3. The outputs depend on no framework. The `tokens` package has zero runtime dependencies.

**REQ-014. Every token carries metadata.**
- AC1. Every token has a `$description`.
- AC2. Every token has `$extensions.cn.status`, set to `stable`, `tbd`, `derived-pending`, or `deprecated`.
- AC3. Every token with status `stable` whose value comes from BC names its BR ID in `$extensions.cn.source`.

**REQ-015. Declared color pairs meet contrast minimums.**
- AC1. `tokens/contrast-pairs.json` lists every intended pair: foreground token, background token, and usage (`text`, `large-text`, or `ui`).
- AC2. The minimum ratios are 4.5:1 for `text`, 3:1 for `large-text`, and 3:1 for `ui` (WCAG 2.2 AA). Check: `check-contrast` fails the build below the minimum.
- AC3. The failing pairs in §2.1 (white on pink, yellow on pink, white on yellow) are listed in `contrast-forbidden.json`. `check-contrast` fails if any component token combines them as foreground and background.
- AC4. A pair involving a token with status `tbd` is reported as "unverified," not as passing.

**REQ-016. Components and the showcase contain no raw visual values.**
- AC1. `packages/nuxt` and `apps/showcase` contain no hex, `rgb()`, or `hsl()` color literals, and no `px`, `rem`, or `ms` literals in style declarations. Visual values come only from `var(--cn-*)`, token imports, or the Nuxt UI theme config that reads tokens. Check: a lint rule. Allowed exception: `0`.
- AC2. A deliberate violation added to a fixture file makes `pnpm test` fail. Check: a test of the lint rule itself.

**REQ-017. Tokens follow one naming convention.**
- AC1. Every CSS custom property is `--cn-{path-with-dashes}`. The DTCG path `color.bg.base` maps to `--cn-color-bg-base`.
- AC2. Token path segments are lowercase kebab-case or camelCase, matching the pattern in `check-tokens`.

**REQ-018. Release 1.0.0 is gated on TBD resolution.**
- AC1. `pnpm release:check` fails if any component with doc `status: stable` references, directly or through a chain, a token whose status is `tbd` or `derived-pending`.
- AC2. `pnpm release:check` fails for a `1.0.0` version if any doc under `01-foundations/` has status `tbd`.

### 3.3 Components

**REQ-020. Components follow Option A.**
- AC1. Every component doc sets `source: nuxt-ui` (a themed Nuxt UI component) or `source: custom` (a `Cn*` component).
- AC2. Every `source: custom` doc contains a "Why custom" paragraph naming the Nuxt UI component it would otherwise use, or stating that Nuxt UI has no equivalent.
- AC3. `packages/nuxt/components/` contains no implementation of a dialog, listbox, combobox, menu, tooltip, popover, or toast. Custom components may compose Nuxt UI components. Check: an architecture test that scans for `role="dialog"`, `role="listbox"`, `role="menu"`, `role="tooltip"`, and hand-rolled focus traps.

**REQ-021. Custom components are prefixed `Cn`.**
- AC1. Every Vue file in `packages/nuxt/components/` is named `Cn*.vue`. Check: a test.

**REQ-022. Components are project-agnostic.**
- AC1. No component name, prop name, slot name, event name, or token path in `packages/` contains any word from the forbidden domain terms list (`scripts/domain-terms.txt`). The list initially contains: product, cart, order, price, stock, checkout, sku, variant, preorder, shipping, payment. Check: a test.
- AC2. No component renders a hardcoded user-visible string. Every string arrives through a prop or slot (A-11). Check: a lint rule that flags text nodes in component templates, with `aria-hidden` decorative text allowed.
- AC3. `apps/consumer-fixture`, a generic Nuxt app with no commerce code, renders every component in the inventory (REQ-071).

**REQ-023. The button implements BR-10 and BR-11.**
- AC1. It exposes the brand variants `primary`, `secondary`, and `ghost`, plus the `disabled` and `loading` states. `button.md` includes a mapping table from each brand variant to Nuxt UI props.
- AC2. It renders rounded corners (`radius.button`), a thick outline (`border.width.button`), and a neon glow (`effect.glow.button`) through component tokens only.
- AC3. The label on a pink fill is black (§2.1 derived facts). Check: a contrast pair.
- AC4. The states `default`, `hover`, `focus-visible`, `active`, `disabled`, and `loading` each appear in the state matrix and have a visual regression baseline.
- AC5. A disabled button has no glow, and is still marked disabled to assistive technology.

**REQ-024. The focus indicator is distinct from the decorative glow.**
- AC1. Every interactive component shows a focus-visible indicator that is not the glow alone. It uses `focus.*` tokens (TBD-16) and has at least 3:1 contrast against adjacent colors.
- AC2. Focus is never shown on mouse click alone; it appears for keyboard focus (`:focus-visible`). Check: a Playwright keyboard test on every interactive component.

**REQ-025. Cards implement BR-12.**
- AC1. A standard content card (themed `UCard`) has header, body, and footer slots.
- AC2. `CnMediaCard` has a thumbnail slot or `src`, a title, one or more tag badges, and an optional link target. The thumbnail requires `alt`, or an explicit `decorative` flag.
- AC3. Both cards render on `color.bg.base`, or on `color.surface.card` once TBD-06 is resolved, with a neon highlight from component tokens.
- AC4. When the whole card is a link, it has exactly one focusable element, and the card's accessible name is its title.

**REQ-026. Every component documents and demonstrates its full set of states.**
- AC1. Every component doc lists `default`, `hover`, `focus-visible`, `active`, and `disabled`, plus `loading`, `error`, `selected`, or `empty` wherever they apply.
- AC2. Every listed state appears in the component's state-matrix demo.
- AC3. Every state in the matrix has a visual regression baseline image.

**REQ-027. Every component is accessible.**
- AC1. axe reports zero violations for every component demo page, in every state. Check: Playwright with axe.
- AC2. Every component doc's Accessibility section lists its keyboard interactions and ARIA roles and attributes. Each listed keyboard interaction has a Playwright test.

**REQ-028. Components are responsive.**
- AC1. At 360, 768, and 1280 px wide, no component demo causes horizontal page overflow (`document.documentElement.scrollWidth <= innerWidth`). Check: Playwright.
- AC2. Every interactive target is at least 24 × 24 CSS px (WCAG 2.2 SC 2.5.8). Check: a Playwright bounding-box assertion.

**REQ-029. Decorative motifs never carry meaning, and motion is safe.**
- AC1. `CnSparkle`, `CnStickerFrame`, and any motif SVG render with `aria-hidden="true"` and no focusable element.
- AC2. Any animation stops, or reduces to a non-moving state, under `prefers-reduced-motion: reduce`. Check: Playwright with emulated reduced motion.
- AC3. Nothing flashes more than 3 times per second (WCAG SC 2.3.1). Manual, because flash frequency needs visual review, done once per animated component.

**REQ-030. `CnLogo` renders the three brand assets.**
- AC1. `CnLogo` accepts `variant: "icon" | "vertical" | "horizontal"` and a required accessible label prop, or `decorative`.
- AC2. While TBD-17 is open, it renders a neutral placeholder showing the text "Logo asset pending (TBD-17)". It never shows an invented logo.
- AC3. Once the SVGs are supplied, it renders them unmodified, and applies clear-space and minimum-size rules from `brand-identity.md`.

**REQ-031. The theme is dark-only.**
- AC1. The Nuxt layer forces dark color mode, and no color-mode toggle exists in the showcase or the fixture.
- AC2. Tokens define a single mode. No token has light and dark variants.

### 3.4 Patterns and content

**REQ-035. Pattern docs exist and are demonstrated.**
- AC1. Pattern docs exist for forms, feedback (toast, inline, banner, dialog), loading (skeleton, spinner), navigation (desktop and mobile), empty states, error pages, and responsive behavior.
- AC2. Every pattern doc links to at least one composed demo that uses only design system components and neutral, non-commerce content.

**REQ-036. Content docs exist.**
- AC1. `voice-and-tone.md` states the BC voice (BR-05, BR-17) and leaves the "this, not that" attribute pairs as `draft` until TBD-21 is approved.
- AC2. `microcopy.md` covers button labels, error message structure, empty state text, and confirmation text, with examples in es-MX blocks.
- AC3. `formatting.md` covers numbers, currency, dates, and times for es-MX using `Intl` APIs. It contains no commerce logic, and it states that currency amounts are display-only.

**REQ-037. Draft rules cannot become stable without approval.**
- AC1. `check-docs` fails if a doc marked `stable` contains a `> **Draft:**` or `> **TBD` callout.

### 3.5 Email

**REQ-040. Email foundations document every client limitation that affects the brand.**
- AC1. `email-foundations.md` has sections on the font fallback stack, glow fallback (a solid thick border in place of `box-shadow`), radius tolerance, dark-mode inversion behavior for `#000000` and `#ef80ae`, images-off behavior (alt text and a text fallback for the logo), and maximum width (A-08).
- AC2. Every fallback maps to a token in `email-tokens.json`.

**REQ-041. Email components compile to self-contained static HTML.**
- AC1. `pnpm --filter @vinsmokemau/cup-noobles-email build` compiles the MJML sources in `packages/email/src/` to `packages/email/dist/*.html`.
- AC2. The compiled HTML contains no `<link rel="stylesheet">`, no `var(`, no `<script>`, and no external CSS. Check: a test.
- AC3. The components are button, header with logo, content section, card, divider, and footer, plus one reference layout that composes them.
- AC4. Content slots use the placeholder syntax `{{ slot_name }}`. Each component's slots are listed in `email-components.md`.

**REQ-042. Email values come from tokens.**
- AC1. Every color value in compiled email HTML also appears in `email-tokens.json`. Check: a test that extracts hex values.
- AC2. The MJML sources contain no hex literals. Check: a lint rule.

**REQ-043. Email layouts are safe at every width.**
- AC1. The reference layout renders without horizontal scroll at 320 and 600 px. Check: Playwright rendering the compiled HTML.
- AC2. `email-layouts.md` specifies a plain-text counterpart structure for every layout.

**REQ-044. Email output is backend-agnostic.**
- AC1. The compiled HTML contains no backend template tags (`{%`, `<%`, `@{`) and no framework-specific markup. Check: a test.

### 3.6 Showcase web app

**REQ-050. The showcase is an independent static site.**
- AC1. `apps/showcase` is a Nuxt app, and `pnpm --filter showcase generate` produces a fully static build in `apps/showcase/.output/public`.
- AC2. It has no dependency on, and no import from, the e-commerce repository (ER-07).
- AC3. A deploy workflow publishes the static output to GitHub Pages as a public site (OD-02), served correctly under the project subpath `/cup-noobles-desgins-system/`.

**REQ-051. The showcase renders `docs/` directly from source.**
- AC1. The showcase reads `../../docs/**/*.md` in place. No copy of any doc is committed inside `apps/showcase`. Check: a test that no `.md` file exists under `apps/showcase/content`.
- AC2. The number of doc routes generated equals the number of docs (excluding `_template.md`). Check: an end-to-end test.
- AC3. Editing a doc changes the rendered page after regeneration. Check: an end-to-end test that uses a fixture doc.

**REQ-052. Every route in the sitemap (§4.6) exists.**
- AC1. Every route in §4.6 returns a rendered page in the static build. Check: an end-to-end route crawl.
- AC2. The sidebar navigation order matches the order in `DESIGN.md`.

**REQ-053. The showcase includes a token explorer.**
- AC1. `/tokens` lists every token with its path, CSS variable, raw value, resolved value, tier, status, and description.
- AC2. Tokens can be filtered by tier, group, and status, and searched by text.
- AC3. Each row has copy buttons for the CSS variable and the resolved value. Check: an end-to-end test of the clipboard.
- AC4. The token count shown equals the count in `tokens.flat.json`.

**REQ-054. The showcase previews every kind of token.**
- AC1. Colors appear as swatches, with the contrast ratio against `color.bg.base` and a pass or fail badge.
- AC2. Typography appears as specimens for H1, H2, H3, body, and caption, including Spanish diacritics (`áéíóú ñ ¿¡`).
- AC3. Spacing appears as bars, radius and stroke as shapes, glow and elevation as sample boxes, and motion as a play-on-demand demo that respects reduced motion.
- AC4. Tokens with status `tbd` or `derived-pending` show a visible status badge on their preview.

**REQ-055. Component pages are live and copyable.**
- AC1. Every component page shows a state matrix, a playground with prop controls, and a code snippet.
- AC2. The code snippet is read from the demo source file (not retyped) and can be copied. Check: an end-to-end test.
- AC3. A viewport toggle renders the demo at 360, 768, and 1280 px.

**REQ-056. The showcase has global search.**
- AC1. Ctrl+K on Windows and Linux, or Cmd+K on macOS, opens a search that covers doc titles, headings, token paths, and component names.
- AC2. Choosing a result navigates to the right page and anchor. Check: an end-to-end test.

**REQ-057. The showcase makes status visible.**
- AC1. Pages whose doc status is `draft`, `tbd`, or `deprecated` show a status banner.
- AC2. `/status` lists every open TBD item and draft doc, and its counts equal `reports/tbd-report.json`. Check: an end-to-end test.

**REQ-058. The showcase previews emails.**
- AC1. `/email/*` pages render the compiled HTML in a sandboxed iframe, with a width toggle between 320 and 600 px.
- AC2. A "Copy HTML" button copies the exact compiled file content.

**REQ-059. The showcase is built with the design system itself.**
- AC1. `apps/showcase` extends `@vinsmokemau/cup-noobles-nuxt` and is subject to REQ-016.

**REQ-060. The showcase is accessible.**
- AC1. axe reports zero violations on every route. Check: Playwright.
- AC2. Every route can be operated by keyboard alone, and it has a skip link and landmark regions. Check: Playwright.

**REQ-061. The showcase is responsive.**
- AC1. Every route has no horizontal overflow at 360 px. Check: Playwright.
- AC2. Below the `md` breakpoint, the sidebar collapses into a Nuxt UI slideover.

**REQ-062. The showcase shows version history.**
- AC1. The header shows the current package version.
- AC2. `/changelog` renders `CHANGELOG.md`.

### 3.7 Distribution and governance

**REQ-070. Packages are versioned with semver.**
- AC1. `@vinsmokemau/cup-noobles-tokens`, `@vinsmokemau/cup-noobles-nuxt`, and `@vinsmokemau/cup-noobles-email` are released in lockstep with semver (A-04), using Changesets.
- AC2. Every release updates `CHANGELOG.md`, with entries grouped as Breaking, Added, Changed, Deprecated, and Fixed.

**REQ-071. The system can be consumed from a generic Nuxt app.**
- AC1. `apps/consumer-fixture` extends `@vinsmokemau/cup-noobles-nuxt` with at most 10 lines of added config, and renders themed Nuxt UI components and every `Cn*` component. Check: a CI build and an end-to-end smoke test.
- AC2. After T12.1, the fixture installs the packages from GitHub Packages (OD-03), not from the workspace.

**REQ-072. Deprecations follow a documented policy.**
- AC1. A deprecated token, component, or prop is marked `deprecated`, emits a development-only console warning (for components), and survives at least one minor release before it is removed in a major release.
- AC2. Every breaking change has a migration note in `CHANGELOG.md`.

**REQ-073. Decisions are recorded as ADRs.**
- AC1. ADRs live in `docs/06-governance/decisions/NNNN-title.md`, using the ADR template.
- AC2. Every TBD resolution and every OD decision references an ADR number. Check: `check-tbd` fails if a resolved item has no ADR link.

**REQ-074. CI enforces the full suite.**
- AC1. CI runs `pnpm test:all` on every push and pull request.
- AC2. Branch protection on `main` requires the check to pass before merging. Manual, because it is repository-host settings, verified once.

**REQ-075. Docs and code change together.**
- AC1. The PR template includes a docs-sync checklist.
- AC2. CI runs `pnpm sync:docs --check` (REQ-004).

---
## 4. Technical design

### 4.1 Architecture and file tree

The system has three layers, and each has a single source of truth:

```
tokens/*.json (DTCG) ──► packages/tokens ──► CSS vars · flat JSON · TS · email JSON
                                  │                         │
                                  ▼                         ▼
docs/*.md ◄── sync:docs ──── generated blocks        packages/email (MJML → static HTML)
   │                              │                         │
   ▼                              ▼                         ▼
apps/showcase (Nuxt + Nuxt Content) ◄── packages/nuxt (layer: Nuxt UI theme + Cn* components)
                                              │
                                              ▼
                                   apps/consumer-fixture (proof of reuse)
```

**Repository tree.** Every path below is normative. Tasks create these files; they must not rename or move them without an ADR.

```
cup-noobles-desgins-system/
├── DESIGN.md                         # Entry point: links every doc, grouped by layer (REQ-001)
├── SPEC.md                           # This file
├── CLAUDE.md                         # Short standing instructions for Claude Code; points to SPEC.md (owner-supplied)
├── .claude/skills/task/SKILL.md      # The /task command that runs one task from §6 (owner-supplied)
├── CHANGELOG.md                      # Generated by Changesets (REQ-070)
├── README.md                         # Points to DESIGN.md and SPEC.md; setup commands
├── package.json · pnpm-workspace.yaml · .nvmrc · tsconfig.base.json
├── .changeset/
├── .github/
│   ├── workflows/{ci.yml, release.yml, deploy-showcase.yml}
│   └── pull_request_template.md      # Docs-sync checklist (REQ-075)
├── docs/
│   ├── _template.md                  # Canonical template (§4.2); not published
│   ├── _schema/frontmatter.schema.json
│   ├── 00-overview/
│   │   ├── brand-context-source.md   # BC, verbatim, hash-locked (REQ-006)
│   │   ├── principles.md
│   │   ├── brand-identity.md         # Logos, lockups, clear space, motifs overview
│   │   ├── using-the-system.md       # How to install and consume the packages; how to read docs
│   │   └── glossary.md
│   ├── 01-foundations/
│   │   ├── color.md  typography.md  spacing.md  shape.md  effects.md
│   │   ├── motion.md  layout.md  iconography.md  imagery-and-motifs.md
│   │   └── accessibility.md
│   ├── 02-components/
│   │   ├── inventory.md              # Generated table of all components (§4.10)
│   │   ├── atoms/        button.md link.md icon.md badge.md input.md textarea.md select.md
│   │   │                 checkbox.md radio-group.md switch.md progress.md skeleton.md
│   │   │                 separator.md logo.md sparkle.md sticker-frame.md
│   │   ├── molecules/    form-field.md card.md media-card.md alert.md toast.md tooltip.md
│   │   │                 tabs.md breadcrumb.md pagination.md
│   │   └── organisms/    modal.md slideover.md site-header.md site-footer.md
│   ├── 03-patterns/      forms.md feedback.md loading.md navigation.md empty-states.md
│   │                     error-pages.md responsive-behavior.md
│   ├── 04-content/       voice-and-tone.md microcopy.md formatting.md
│   ├── 05-email/         email-foundations.md email-components.md email-layouts.md
│   └── 06-governance/    ownership.md versioning-and-releases.md contribution.md
│                         deprecation.md decision-log.md decisions/NNNN-*.md
├── tokens/
│   ├── primitive/  color.json font.json space.json radius.json border.json effect.json
│   │               motion.json breakpoint.json z.json _placeholder.json
│   ├── semantic/   color.json font.json effect.json focus.json layout.json
│   ├── component/  <one file per component, added by the component's task>
│   ├── contrast-pairs.json           # REQ-015
│   └── contrast-forbidden.json       # REQ-015 AC3
├── packages/
│   ├── tokens/     # @vinsmokemau/cup-noobles-tokens: Style Dictionary config, custom formats, dist/
│   ├── nuxt/       # @vinsmokemau/cup-noobles-nuxt: Nuxt layer
│   │   ├── nuxt.config.ts            # Extends Nuxt UI, loads token CSS, forces dark mode
│   │   ├── app.config.ts             # Nuxt UI theme built only from tokens (C-03)
│   │   ├── assets/css/main.css       # Imports tokens.css and maps Nuxt UI vars to --cn-* vars
│   │   ├── assets/brand/             # Logo and motif SVGs (TBD-17, TBD-18)
│   │   └── components/Cn*.vue
│   └── email/      # @vinsmokemau/cup-noobles-email: src/{components,layouts}/*.mjml, build.ts, dist/*.html
├── apps/
│   ├── showcase/
│   │   ├── nuxt.config.ts · content.config.ts   # Content source = ../../docs
│   │   ├── pages/ (§4.6)
│   │   ├── components/   # Showcase-only UI: TokenTable, Swatch, TypeSpecimen, StateMatrix,
│   │   │                 # Playground, CodeBlock, ViewportFrame, StatusBadge, EmailPreview
│   │   ├── demos/<slug>/{states.vue, playground.vue, controls.ts, *.example.vue}
│   │   └── tests/e2e/
│   └── consumer-fixture/             # Minimal generic Nuxt app (REQ-071)
├── scripts/  check-docs.ts check-links.ts check-tokens.ts check-contrast.ts check-tbd.ts
│             sync-docs.ts release-check.ts domain-terms.txt
├── tests/    # Tests for the scripts themselves
└── reports/  # Git-ignored: tbd-report.json and similar
```

### 4.2 Standard `.md` template

Every doc starts with frontmatter (§4.3), then an H1 equal to `title`, then the H2 sections required for its `layer`, in the order shown. `check-docs` enforces this. Optional H3 subsections are free.

| # | H2 heading | overview | foundation | component | pattern | content | email | governance | adr |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 1 | Purpose | ● | ● | ● | ● | ● | ● | ● | |
| 2 | Anatomy | | | ● | | | | | |
| 3 | Tokens and specs *(generated block)* | | ● | ● | | | ● | | |
| 4 | Variants | | | ● | | | | | |
| 5 | States | | | ● | | | | | |
| 6 | Usage rules *(H3: When to use / When not to use)* | ● | ● | ● | ● | ● | ● | | |
| 7 | Do and don't | | ● | ● | ● | ● | | | |
| 8 | Accessibility | | ● | ● | ● | ● | ● | | |
| 9 | Content | | | ● | ● | | | | |
| 10 | Responsive behavior | | ● | ● | ● | | | | |
| 11 | Email notes | | ● | ● | | | | | |
| 12 | Code reference | | ● | ● | ● | | ● | | |
| 13 | Policy and process | | | | | | | ● | |
| 14 | Context · Decision · Consequences | | | | | | | | ● |
| 15 | Open items | ● | ● | ● | ● | ● | ● | ● | |
| 16 | Changelog | ● | ● | ● | ● | ● | ● | ● | |

Row 14 is three H2 headings, in this order: `Context`, `Decision`, `Consequences`.

Section content rules:

- **Purpose.** Two or three sentences: what this is and which problem it solves. Name the BR IDs it implements.
- **Anatomy.** A numbered list of named parts, for example 1. container, 2. label, 3. leading icon, 4. glow. The same part names are used in token paths.
- **Tokens and specs.** A generated block only (§4.5). Hand-written notes may follow the block.
- **Variants and States.** Tables. The States table lists every state from REQ-026 AC1 that applies, with the tokens that change in each.
- **Usage rules.** Imperative statements, for example "Use `primary` for the single main action per view."
- **Do and don't.** Paired rows. Each row names a demo example from `demos/<slug>/*.example.vue` when one exists.
- **Accessibility.** Keyboard map (key → result), roles and ARIA attributes, contrast pairs used, and focus behavior.
- **Content.** Label rules, with examples in fenced `copy es-MX` blocks (REQ-007).
- **Responsive behavior.** Behavior at each breakpoint token. Before TBD-13 is resolved, use 360, 768, and 1280 px.
- **Email notes.** The email equivalent, or `Not applicable.`
- **Code reference.** For `nuxt-ui` components: the Nuxt UI component name, the props used, and where the theme is configured. For `custom` components: the import path and a props, slots, and events table. For email: the partial filename and its slots. Snippets live in demo files; the doc shows the smallest usage example only.
- **Open items.** TBD callouts and draft callouts (REQ-005, REQ-009).
- **Changelog.** `version — change — ADR/approval reference`.

`docs/_template.md` contains all 16 headings with guidance comments. Authors delete the headings their layer does not require.

### 4.3 Frontmatter schema

```yaml
title: Button                  # required
slug: button                   # required, unique, kebab-case; also the showcase route segment
layer: component               # required: overview|foundation|component|pattern|content|email|governance|adr
level: atom                    # component only: atom|molecule|organism
source: nuxt-ui                # component only: nuxt-ui|custom
nuxtUi: UButton                # required when source = nuxt-ui
component: null                # required when source = custom (e.g. CnMediaCard)
status: draft                  # required: tbd|draft|stable|deprecated
lang: en                       # required, must be "en" (REQ-007)
brandRules: [BR-10, BR-11]     # BR IDs implemented (may be empty)
tokens: [component.button]     # token path prefixes rendered in generated blocks
demos: [states, playground]    # component/pattern only; files in apps/showcase/demos/<slug>/
tbd: [TBD-10, TBD-11, TBD-12, TBD-16]
related: [link, form-field]    # slugs
since: 0.1.0                   # required
updated: 2026-09-23            # required, ISO date
```

**Exempt files:** `docs/_template.md` and `docs/00-overview/brand-context-source.md`. The brand source is verbatim, so it cannot carry frontmatter. The showcase renders it at `/overview/brand-context-source` with a fixed title.

### 4.4 TBD convention

- **In docs:** `> **TBD (TBD-12):** Glow blur, spread, and opacity are not defined. Owner input needed.`
- **Content pending in docs:** a doc section that has not been written yet holds exactly `> **TBD:** Content pending (Tn.n).`, where `Tn.n` is the §6 task that writes it. This callout marks unwritten content, not an undefined value, so it carries no TBD ID. `check-tbd` accepts only these two callout forms: it validates the task ID against §6 and reports these callouts separately from TBD-NN items. Any other `> **TBD…` callout fails.
- **In tokens:** a TBD token gets `$extensions.cn.status: "tbd"`, and its value is a reference into `tokens/primitive/_placeholder.json`. It also names the §2.4 items it stands in for in `$extensions.cn.tbd`, a non-empty list of TBD IDs (for example `["TBD-05"]`). This applies to the placeholder tokens too, which take their IDs from the "Stands in for" column of ADR-0006. A `derived-pending` token has `$extensions.cn.tbd: ["TBD-08"]` (C-06). A `stable` or `deprecated` token has no `tbd` field. `check-tokens` enforces these rules, and `check-tbd` fails on an unknown ID or on an ID whose §2.4 row is resolved, and counts tokens per TBD item.
- **Placeholder values:** `_placeholder.json` holds one set of deliberately non-brand placeholder values, and every one of them has status `tbd`. Colors use a single neutral placeholder. Dimensions use the Nuxt UI default the component would have anyway. These placeholder values are recorded in ADR-0006 (T0.5) and are never described as brand values.
- **In the showcase:** TBD previews carry a hatched overlay and a "TBD-NN" badge (REQ-054 AC4).
- **Resolution:** the owner supplies the value, an ADR records it, the token changes to `stable`, the callout is removed, and §2.4 marks the row resolved by writing `Resolved (ADR-NNNN)` in it (REQ-073). `check-tbd` fails if a row that says `Resolved` names no existing ADR, or if a callout still cites a resolved ID.

### 4.5 Keeping docs and the app in sync: the single source of truth

**Recommendation: the showcase renders directly from the `.md` files and token files. It never keeps its own copy of any content.** Each artifact has exactly one source:

| Artifact | Single source of truth | Derived consumers |
|---|---|---|
| Token values | `tokens/**/*.json` | CSS, TS, and email JSON outputs; doc generated blocks; `/tokens` explorer; previews |
| Rules and prose | `docs/**/*.md` | Showcase pages, Claude Code, human readers |
| Component behavior | `packages/nuxt` and Nuxt UI | Showcase demos, consumer fixture |
| Component inventory | Frontmatter of component docs | `inventory.md` generated block, `/components` index |
| Email markup | `packages/email/src/*.mjml` | `dist/*.html`, `/email` previews |
| Open items | Token status and TBD callouts | `reports/tbd-report.json`, `/status` |

**Mechanics.**

1. **Generated blocks.** `scripts/sync-docs.ts` rewrites everything between markers. The `.md` files stay plain GitHub-flavored Markdown, so Claude Code and the repository host read real tables and values:
   ```
   <!-- cn:generated tokens="component.button" format="table" -->
   | Token | CSS variable | Value | Status |
   |---|---|---|---|
   | ...generated rows... |
   <!-- /cn:generated -->
   ```
   Supported `format` values: `table` (token rows), `contrast` (contrast pairs involving the tokens), and `inventory` (component list from frontmatter).
2. **The showcase adds interactivity without editing the docs.** A generated block is shown as a table in raw Markdown. In the showcase, a renderer swaps it for the rich preview for that token type (a swatch, a type specimen, and so on), using the block's `tokens` attribute. The Markdown source is never rewritten for the showcase.
3. **Demos attach through frontmatter.** `demos: [states, playground]` maps to `apps/showcase/demos/<slug>/*.vue`. The showcase renders them at fixed positions: states after "States", playground after "Code reference". Code snippets are imported with `?raw` from the same demo files, so the displayed code is the code that runs.
4. **Drift is a build failure.** `sync:docs --check`, `check-links`, `check-docs`, and the route-count test (REQ-051 AC2) run in CI.

**Options considered.**

| Option | Drift risk | Readable by Claude Code and in raw Markdown | Live interactivity | Setup cost | Verdict |
|---|---|---|---|---|---|
| A. The app renders `.md` and tokens directly, with generated blocks and frontmatter demos | Low; enforced by CI | High; plain Markdown with real values | High | Medium | **Recommended** |
| B. A separate authored site (Storybook or Histoire), with `.md` maintained by hand | High; two copies of every rule | High, but values go stale | Highest; controls and addons for free | Medium | Rejected: two sources of truth |
| C. `.md` generated from code (component source and docgen) | Low | Medium; prose authored in code comments is poor | High | High | Rejected: the docs are the spec, and they must be authored before code (SDD) |
| D. The app renders `.md` with MDC components embedded inline | Low | **Low**; raw files show `::component` syntax | High | Low | Rejected by REQ-008 |

**Trade-offs of the recommendation, stated plainly:**
- The showcase depends on Nuxt Content and its major version. That risk is contained by T0.2 and version pinning.
- Demos appear at fixed positions, not inline between paragraphs.
- Authors must run `pnpm sync:docs` after token changes. CI catches it if they forget.
- There is no free props-control UI like Storybook's, so the playground is built once (T7.1). If that proves too costly, Histoire is the fallback for demos only; the docs still render from `.md`. That fallback needs an ADR.

### 4.6 Showcase sitemap and core features

| Route | Renders from | Features |
|---|---|---|
| `/` | `DESIGN.md` | Version, counts (tokens, components, open TBD items), layer cards with status |
| `/overview/[slug]` | `docs/00-overview/*` | Brand identity with `CnLogo` variants (placeholder until TBD-17) and motif gallery; the brand source rendered verbatim |
| `/foundations` | Frontmatter index | Cards per foundation doc with status badge |
| `/foundations/[slug]` | `docs/01-foundations/*` | Token previews by type (REQ-054), contrast badges |
| `/tokens` | `tokens.flat.json` | Explorer: filter, search, copy CSS variable and value, status column (REQ-053) |
| `/components` | Component frontmatter | Grouped atoms → molecules → organisms, with source (`nuxt-ui` or `custom`) and status badges |
| `/components/[slug]` | `docs/02-components/**` | State matrix, playground, copyable code, viewport toggle at 360, 768, and 1280 px (REQ-055) |
| `/patterns`, `/patterns/[slug]` | `docs/03-patterns/*` | Composed demos with neutral content |
| `/content`, `/content/[slug]` | `docs/04-content/*` | es-MX copy examples with do and don't styling |
| `/email`, `/email/[slug]` | `docs/05-email/*` + `packages/email/dist` | Sandboxed iframe preview, 320 and 600 px toggle, copy HTML (REQ-058) |
| `/governance`, `/governance/[slug]` | `docs/06-governance/*` | Policies |
| `/governance/decisions/[slug]` | ADRs | ADR index and pages |
| `/changelog` | `CHANGELOG.md` | Release history (REQ-062) |
| `/status` | `tbd-report.json` + frontmatter | Open TBD items, draft docs, and derived-pending tokens (REQ-057) |
| `404` | Error-page pattern | Built from the design system itself |

**Global features on every page:** search on Ctrl+K or Cmd+K (REQ-056); a sidebar ordered by `DESIGN.md`, which collapses to a slideover on mobile (REQ-061); a status banner (REQ-057); an on-page table of contents; a skip link; the version in the header; and dark mode only (REQ-031).

### 4.7 Token architecture

- **Tiers:** primitive (raw values: brand hexes, placeholders), then semantic (roles such as `color.bg.base`, `color.text.default`, `color.brand.primary`, `focus.ring.*`), then component (for example `button.primary.bg`, `button.glow`, `card.border.width`).
- **Groups:** `color`, `font`, `space`, `radius`, `border`, `effect` (glow, shadow), `elevation`, `z`, `motion`, `breakpoint`, `focus`.
- **Mapping to Nuxt UI:** `packages/nuxt/assets/css/main.css` maps Nuxt UI's theme variables to `--cn-*` variables, and `app.config.ts` sets the color aliases and component slot classes. The exact variable names and configuration keys are **not specified here**; T0.1 records them in ADR-0001 against the pinned Nuxt UI version.
- **Nuxt UI shade scales** follow C-06 and OD-04.
- **Email outputs** resolve every reference to a literal value, because email clients do not support `var()` (REQ-013).

### 4.8 Versioning and release flow

1. Each change that affects a package includes a changeset (`pnpm changeset`).
2. `release.yml` on `main` runs Changesets, which opens a "Version packages" pull request. Merging it bumps all three packages in lockstep, updates `CHANGELOG.md`, and tags the release.
3. Tagged releases publish privately to GitHub Packages (OD-03) and trigger `deploy-showcase.yml`, which publishes to GitHub Pages (OD-02).
4. Versions stay `0.x` until `pnpm release:check` passes the 1.0 gate (REQ-018).

### 4.9 Email architecture

- MJML sources in `packages/email/src/` reference tokens with the build-time syntax `$cn(color.brand.primary)`. `build.ts` replaces these references with values from `email-tokens.json` **before** MJML compiles.
- Content slots use `{{ slot_name }}`. This syntax is left untouched by the build and is readable by Django, Jinja, Handlebars, and Mustache (REQ-041 AC4, REQ-044).
- The output is inlined, self-contained HTML files in `dist/`, one per component and one per reference layout.
- The design system does not port these files into any backend. The e-commerce project does that in its own repository (non-goal, §1.3).

### 4.10 Component inventory

The Nuxt UI component names below are provisional; T0.1 confirms them against the pinned version. If Nuxt UI provides a header or footer component, `site-header` and `site-footer` become `source: nuxt-ui` (ADR-0001).

| Slug | Level | Source | Implementation | Task |
|---|---|---|---|---|
| button | atom | nuxt-ui | UButton | T7.2 |
| link | atom | nuxt-ui | ULink | T7.3 |
| icon | atom | nuxt-ui | UIcon (icon set TBD-19) | T7.3 |
| badge | atom | nuxt-ui | UBadge (includes the "tag badge" from BR-12) | T7.3 |
| input · textarea · select | atom | nuxt-ui | UInput · UTextarea · USelect | T7.4 |
| checkbox · radio-group · switch | atom | nuxt-ui | UCheckbox · URadioGroup · USwitch | T7.5 |
| progress · skeleton · separator | atom | nuxt-ui | UProgress · USkeleton · USeparator | T7.6 |
| logo | atom | custom | CnLogo (REQ-030) | T7.7 |
| sparkle · sticker-frame | atom | custom | CnSparkle · CnStickerFrame (BR-14, REQ-029) | T7.8 |
| form-field · card | molecule | nuxt-ui | UFormField · UCard | T8.1 |
| media-card | molecule | custom | CnMediaCard (BR-12) | T8.2 |
| alert · toast · tooltip | molecule | nuxt-ui | UAlert · UToast · UTooltip | T8.3 |
| tabs · breadcrumb · pagination | molecule | nuxt-ui | UTabs · UBreadcrumb · UPagination | T8.4 |
| modal · slideover | organism | nuxt-ui | UModal · USlideover | T8.5 |
| site-header · site-footer | organism | nuxt-ui | UHeader · UFooter (ADR-0001); slot-based, no domain content | T8.6 |

---
## 5. Implementation phases

| Phase | Goal | Deliverables | Depends on | Done when |
|---|---|---|---|---|
| P0 | Bootstrap and spikes | Repository initialized; ADR-0001 through ADR-0006 | Nothing | All six ADRs are merged, and every "verify in T0.x" note in this spec is resolved in an ADR |
| P1 | Repository and tooling | pnpm workspace, lint, custom lint rules, test runners, CI, brand-source hash test | P0 | `pnpm test:all` is green in CI on the empty skeleton, and each custom lint rule fails on its fixture violation |
| P2 | Docs skeleton and doc tooling | `_template.md`, frontmatter schema, `DESIGN.md`, every doc stub, `check-docs`, `check-links`, `check-tbd` | P1 | Every doc in §4.1 exists with valid frontmatter and headings, and every doc check passes |
| P3 | Token pipeline | Token schema, primitive and semantic tokens, build outputs, `check-contrast`, `sync-docs` | P2 | All four token outputs build deterministically, the contrast check passes, and generated blocks are in sync |
| P4 | Foundation docs | 10 foundation docs and 4 overview docs with real content, TBD callouts, and generated blocks | P3 | Every foundation doc is `draft` or `stable`, none is `tbd`, and every BC rule appears with its BR ID |
| P5 | Nuxt layer, fixture, showcase shell | `@vinsmokemau/cup-noobles-nuxt` layer, consumer fixture, showcase rendering every doc, end-to-end harness, deploy | P3, P2 | Every doc renders at its route, axe and overflow checks pass on every route, and the site deploys |
| P6 | Token showcase | `/tokens`, previews for every token type, `/status`, home counts | P5 | REQ-053, REQ-054, and REQ-057 pass |
| P7 | Component infrastructure and atoms | State matrix, playground, code copy, viewport frame; every atom | P5, P4 | Every atom in §4.10 has a doc, demos, visual baselines, axe and keyboard tests |
| P8 | Molecules and organisms | Every molecule and organism, the generated inventory, the fixture rendering everything | P7 | Every component in §4.10 is complete, and REQ-071 AC1 passes |
| P9 | Patterns and content | 7 pattern docs with demos, 3 content docs | P8 | REQ-035 and REQ-036 pass |
| P10 | Email | Email foundations, build pipeline, 6 components, reference layout, previews | P3, P5 | REQ-040 through REQ-044 and REQ-058 pass |
| P11 | Search, governance, release tooling | Search, governance docs, Changesets, changelog page, `release-check` | P5 | REQ-056, REQ-062, REQ-070, REQ-072, and REQ-073 pass |
| P12 | Release readiness | 0.x published and consumed from the registry; 1.0 gate review | P6–P11 | The fixture installs from the registry and passes, and `release:check` output has been reviewed with the owner |

P10 and P11 can run in parallel with P7–P9 once P5 is done.

---

## 6. Task list

Each task is sized for one Claude Code session. Task IDs are `T<phase>.<n>`. "Depends on" lists tasks that must be `[x]` before the task starts. Every task also inherits the Definition of Done in §0.2.

### P0 — Bootstrap and spikes

- [x] **T0.1 — Initialize the repository and run the Nuxt UI spike** (2026-09-24, b456ba4)
  - REQs: REQ-020, REQ-031
  - Depends on: none
  - Scope: Initialize git with `README.md`, `SPEC.md`, the owner-supplied `CLAUDE.md` and `.claude/` (committed unchanged), `docs/06-governance/decisions/0000-adr-template.md`, and `docs/00-overview/brand-context-source.md` plus its `.sha256`. The owner places `cup_noobles_desgin_context.md` at the repository root; move it to that path with `mv` so its bytes stay identical. Never retype or re-save it. In `spikes/0001-nuxt-ui/`, build the smallest Nuxt app that extends a local layer, themes `UButton` from CSS variables, and forces dark mode.
  - Record in ADR-0001: the pinned Nuxt UI version and license; the exact theme variable names and `app.config` keys; whether color aliases require shade scales (feeds C-06 and OD-04); how dark mode is forced; whether layers work under SSR; the confirmed component names for §4.10; and whether header and footer components exist.
  - Done when: ADR-0001 is merged, it answers every item above, and the spike app renders a themed button whose background computes to `#ef80ae`.

- [x] **T0.2 — Nuxt Content spike** (2026-09-25, 14af4a6)
  - REQs: REQ-051, REQ-008
  - Depends on: T0.1
  - Scope: In `spikes/0002-nuxt-content/`, render a Markdown directory that sits outside the app directory. Validate frontmatter with a schema. Intercept `<!-- cn:generated -->` blocks at render time. Generate a static build. Evaluate the search options.
  - Record in ADR-0002: the version, the content source configuration, the interception approach, the search approach, and the fallback if an external directory is unsupported (a build-time copy into a git-ignored directory is allowed, because REQ-051 forbids only *committed* copies).
  - Done when: ADR-0002 is merged, and the spike statically renders two Markdown files taken from the parent directory.

- [x] **T0.3 — Style Dictionary and DTCG spike** (2026-09-25, 1bb49ff)
  - REQs: REQ-010, REQ-013
  - Depends on: T0.1
  - Scope: In `spikes/0003-tokens/`, build 3 DTCG tokens into CSS, flat JSON, TS, and resolved email JSON, then run a second build and compare.
  - Record in ADR-0003: the version, how the DTCG format is configured, custom format needs, and the determinism result.
  - Done when: ADR-0003 is merged, and all four outputs were produced deterministically.

- [x] **T0.4 — MJML email spike** (2026-09-25, fb3add4)
  - REQs: REQ-041, REQ-044
  - Depends on: T0.1 (OD-12 decided: MJML)
  - Scope: In `spikes/0004-email/`, write one MJML button that uses `$cn(...)` injection and a `{{ label }}` slot, compile it, and inspect the output.
  - Record in ADR-0004: the version, confirmation that `{{ }}` survives compilation, inlining behavior, and the output size.
  - Done when: ADR-0004 is merged, and the compiled HTML contains the injected hex, an intact `{{ label }}`, and no `var(`.

- [x] **T0.5 — Baseline ADRs** (2026-09-25, 6c98c03)
  - REQs: REQ-073
  - Depends on: T0.1
  - Scope: ADR-0005 records assumptions A-01 through A-14 and conflicts C-01 through C-06 with their current resolution status. ADR-0006 records the placeholder-value policy from §4.4, listing each placeholder value explicitly.
  - Done when: both ADRs are merged, and ADR-0006 labels every placeholder "not a brand value".

### P1 — Repository and tooling

- [x] **T1.1 — Workspace scaffold** (2026-09-25, ac83716)
  - REQs: REQ-050 (AC2), REQ-013 (AC3)
  - Depends on: T0.1–T0.5
  - Scope: Create the tree from §4.1: pnpm workspace, empty `package.json` files for the 3 packages and 2 apps, `tsconfig.base.json`, `.nvmrc`, and git-ignored `reports/` and `dist/`. Delete `spikes/`.
  - Done when: `pnpm install` succeeds from a clean clone, every path in §4.1 that is a directory exists, and `spikes/` is gone.

- [x] **T1.2 — Lint, format, typecheck, and test runners** (2026-09-25, 411c0ed)
  - REQs: REQ-074 (AC1, partial)
  - Depends on: T1.1
  - Scope: ESLint (flat config), Prettier, markdownlint, `vue-tsc`, and a Vitest workspace. Add stub `pnpm test` and `pnpm test:all` scripts wired to the commands in §0.3.
  - Done when: `pnpm test` runs lint, typecheck, and an empty Vitest suite, and exits 0.

- [x] **T1.3 — Custom lint rules and architecture tests** (2026-09-25, ded5169)
  - REQs: REQ-016, REQ-021, REQ-022 (AC1, AC2), REQ-020 (AC3)
  - Depends on: T1.2
  - Scope: a raw-value rule (REQ-016); a `Cn*.vue` naming test; a forbidden-domain-term test with `scripts/domain-terms.txt`; a hardcoded-text-node rule; the forbidden-primitive scan (REQ-020 AC3). Each rule gets a fixture violation and a test proving it fails.
  - Done when: `pnpm test` is green, and every rule's fixture test confirms the rule triggers.

- [x] **T1.4 — CI and PR template** (2026-09-27, 9198c11, bc1b6d3)
  - REQs: REQ-074, REQ-075 (AC1)
  - Depends on: T1.2
  - Scope: `ci.yml` runs `pnpm test:all` on push and pull request in a pinned container image (A-12). Add `pull_request_template.md` with the docs-sync checklist. Document the required branch protection in `README.md`.
  - Done when: CI is green on `main`, a deliberately failing branch shows a red check, and the owner confirms branch protection (manual).

- [x] **T1.5 — Brand source integrity test** (2026-09-27, 1b7c7dd)
  - REQs: REQ-006 (AC1)
  - Depends on: T1.2
  - Scope: A test comparing the SHA-256 of `brand-context-source.md` with the committed `.sha256`.
  - Done when: the test passes, and it fails when one byte of the file changes.

### P2 — Docs skeleton and doc tooling

- [x] **T2.1 — Template and frontmatter schema** (2026-09-27, 22242a7)
  - REQs: REQ-002, REQ-003
  - Depends on: T1.5
  - Scope: `docs/_template.md` with all 16 headings from §4.2 and guidance comments; `docs/_schema/frontmatter.schema.json` implementing §4.3, including the conditional fields for components.
  - Done when: the schema accepts the §4.3 example, and rejects a component doc that has no `level`.

- [x] **T2.2 — `check-docs`** (2026-09-27, f27c25e)
  - REQs: REQ-002, REQ-003, REQ-004 (AC2), REQ-007, REQ-008 (AC1), REQ-037
  - Depends on: T2.1
  - Scope: `scripts/check-docs.ts`: frontmatter validation; the heading set and order per layer; exempt files; hex literals outside generated blocks; MDC syntax; `copy` blocks without a locale; draft or TBD callouts inside `stable` docs. Include unit tests with one fixture per rule.
  - Done when: `pnpm check:docs` exists, and every rule has a passing fixture and a failing fixture.

- [x] **T2.3 — `DESIGN.md`, doc stubs, and `check-links`** (2026-09-27, 6fcc5f5)
  - REQs: REQ-001
  - Depends on: T2.2
  - Scope: Create every doc listed in §4.1 as a stub with `status: tbd`, valid frontmatter, and the headings its layer requires, each section containing only `> **TBD:** Content pending (Tn.n).` Create `DESIGN.md`, grouped per REQ-001 AC4, with a one-line description per link. Create `scripts/check-links.ts`.
  - Done when: `pnpm check:docs` passes, there are zero orphan docs and zero broken links, and the number of stubs equals the number of files listed in §4.1.

- [x] **T2.4 — TBD convention and `check-tbd`** (2026-09-27, 73175fb)
  - REQs: REQ-005, REQ-009 (AC1), REQ-073 (AC2)
  - Depends on: T2.3
  - Scope: `scripts/check-tbd.ts` collects doc callouts and token statuses (tokens are read once P3 exists; until then the token list is empty), writes `reports/tbd-report.json`, and validates that every TBD ID exists in §2.4 of `SPEC.md` and that resolved items link an ADR.
  - Done when: the report lists every stub's TBD callouts, and an unknown ID such as `TBD-99` fails the check.

### P3 — Token pipeline

- [x] **T3.1 — Token schema and `check-tokens`** (2026-09-27, b22aca0)
  - REQs: REQ-010, REQ-014, REQ-017
  - Depends on: T2.4, T0.3
  - Scope: Validate DTCG structure, the tier reference rules, required `$description` and `$extensions.cn.status`, the `source` BR ID on stable brand tokens, and the naming pattern.
  - Done when: `pnpm check:tokens` passes on an empty token set, and fixtures prove each rule fails.

- [x] **T3.2 — Primitive tokens** (2026-09-27, e365b02)
  - REQs: REQ-011 (AC1), REQ-005 (AC2)
  - Depends on: T3.1
  - Scope: `color.json` holds the three brand colors (status `stable`, sources BR-01 through BR-03). `_placeholder.json` holds the values from ADR-0006. Every other primitive group from §4.7 references a placeholder and has status `tbd`, with the TBD ID in its description. Extend `check-tbd` to read `$extensions.cn.tbd`: fail on an ID not in §2.4 or on a resolved ID, and count tokens per TBD item in `reports/tbd-report.json`.
  - Done when: `check:tokens` passes, and `check:tbd` lists every TBD-03 through TBD-16 token.

- [x] **T3.3 — Semantic tokens and contrast files** (2026-09-27, 5a65077)
  - REQs: REQ-011 (AC2), REQ-012 (AC1), REQ-015 (AC1, AC3)
  - Depends on: T3.2
  - Scope: Semantic color, font, effect, focus, and layout tokens; `contrast-pairs.json` with every intended pair; `contrast-forbidden.json` with the three failing combinations from §2.1.
  - Done when: `color.bg.base` resolves to `#000000` in a unit test, and every semantic color token appears in at least one pair.

- [x] **T3.4 — Token build** (2026-09-27, bbd7959)
  - REQs: REQ-013, REQ-011 (AC3), REQ-017 (AC1)
  - Depends on: T3.3
  - Scope: The Style Dictionary configuration and custom formats for the 4 outputs in REQ-013, a snapshot test, and a determinism test.
  - Done when: all 4 outputs exist, the snapshot contains the three brand variables exactly, and two builds are byte-identical.

- [x] **T3.5 — `check-contrast`** (2026-09-27, 8df83bc)
  - REQs: REQ-015
  - Depends on: T3.4
  - Scope: Compute WCAG contrast from the resolved values; apply the thresholds per usage; enforce the forbidden list; report pairs with TBD tokens as "unverified".
  - Done when: the three pairs from §2.1 are reported with the exact ratios 8.37, 18.55, and 2.51 (rounded to 2 decimals), and a fixture using white on pink fails.

- [x] **T3.6 — `sync-docs`** (2026-09-27, 6f2a6d3)
  - REQs: REQ-004 (AC1, AC3), REQ-075 (AC2)
  - Depends on: T3.5
  - Scope: Rewrite generated blocks in the `table` and `contrast` formats (the `inventory` format comes in T8.7), add `--check` mode, and add `sync:docs --check` to `pnpm test`.
  - Done when: after a token value changes, `--check` fails; after running `pnpm sync:docs`, it passes; and running it on an in-sync tree leaves no git diff.

### P4 — Foundation docs

Rule for all P4 tasks: BC content is quoted with its BR ID. Anything else is either a TBD callout or a `draft` proposal. The docs leave `tbd` status, becoming `draft` or `stable`. Each doc includes the generated blocks for its token groups.

- [x] **T4.1 — Overview docs** (2026-09-27, 325e28d)
  - REQs: REQ-006 (AC2), REQ-009, REQ-030 (documentation part)
  - Depends on: T3.6
  - Scope: `principles.md` (draft principles derived only from BR-04 through BR-06, BR-09, and BR-17, awaiting approval); `brand-identity.md` (the three assets from BR-16, with clear space and minimum size as TBD-17, and motifs from BR-14); `using-the-system.md` (packages, install steps for GitHub Packages, including the access-token setup, how to read docs, how to report a TBD); `glossary.md`.
  - Done when: `check:docs` passes, and every BR ID quoted matches §2.1.

- [x] **T4.2 — `color.md`** (2026-09-27, 5a900b8)
  - REQs: REQ-011, REQ-012, REQ-015
  - Depends on: T4.1
  - Scope: The three brand colors with their roles; the pure-black rule (BR-03); the derived contrast facts and forbidden pairs; TBD callouts for TBD-04 through TBD-08; C-05 and C-06 explained.
  - Done when: `check:docs` and `sync:docs --check` pass, and the generated contrast block matches `check-contrast` output.

- [x] **T4.3 — `typography.md`** (2026-09-27, 7984f3f)
  - REQs: REQ-005, REQ-009, REQ-054 (documentation part)
  - Depends on: T4.1
  - Scope: BR-07 through BR-09 quoted; the hierarchy H1, H2, H3, body, caption; the selection criteria the font must meet (a bold retro display sans, Spanish diacritics, a license covering web embedding, and email fallback behavior); TBD-01 through TBD-03.
  - Done when: `check:docs` passes, and no font family name appears outside a TBD callout.

- [x] **T4.4 — `shape.md` and `effects.md`** (2026-09-27, bc44f1d)
  - REQs: REQ-023 (documentation part), REQ-024 (documentation part)
  - Depends on: T4.1
  - Scope: BR-10 and BR-13 quoted; radius, stroke-width, glow, elevation, z-index, and focus token groups (TBD-10, 11, 12, 15, 16); the rule that focus is never the glow alone (REQ-024); a draft rule proposing that glow applies to component edges, not body text (see R-04).
  - Done when: `check:docs` passes, and the TBD callouts reference TBD-10, 11, 12, 15, and 16.

- [x] **T4.5 — `spacing.md`, `layout.md`, and `motion.md`** (2026-09-28, 8128938)
  - REQs: REQ-028 (documentation part), REQ-029 (documentation part)
  - Depends on: T4.1
  - Scope: TBD-09, TBD-13, and TBD-14; the 360 px minimum (ER-05); the reference viewports (A-09); reduced-motion rules and the flash limit.
  - Done when: `check:docs` passes.

- [x] **T4.6 — `iconography.md`, `imagery-and-motifs.md`, and `accessibility.md`** (2026-09-28, 7a0679d)
  - REQs: REQ-027 (documentation part), REQ-029 (documentation part)
  - Depends on: T4.1
  - Scope: The icon set is TBD-19 and must be consistent with BR-13. The motifs are BR-14 (art TBD-18) and are decorative only. Photography follows TBD-20. `accessibility.md` states the WCAG 2.2 AA target (A-10), the contrast rules, focus, target size, reduced motion, and the axe gate.
  - Done when: `check:docs` passes, and there are zero `tbd`-status docs in `01-foundations/`.

### P5 — Nuxt layer, fixture, showcase shell

- [x] **T5.1 — `@vinsmokemau/cup-noobles-nuxt` layer** (2026-09-28, 8d8edca)
  - REQs: REQ-020, REQ-031, REQ-016
  - Depends on: T3.4, T0.1
  - Scope: A layer `nuxt.config.ts` that extends Nuxt UI (version pinned per ADR-0001) and forces dark mode; `main.css` importing `tokens.css` and mapping Nuxt UI variables to `--cn-*` variables; `app.config.ts` with the color aliases, filling shade scales per C-06.
  - Done when: the package builds, and `pnpm test` (including the raw-value rule) passes.

- [x] **T5.2 — Consumer fixture** (2026-10-08, 2a469ae)
  - REQs: REQ-071 (AC1, partial), REQ-012 (AC2)
  - Depends on: T5.1
  - Scope: A generic Nuxt SSR app that extends the layer in 10 lines or fewer and renders one `UButton`. Add Playwright smoke tests: the body background is `rgb(0, 0, 0)`, and the primary button background is `#ef80ae`.
  - Done when: both smoke tests pass in `pnpm test:all`.

- [x] **T5.3 — Showcase scaffold** (2026-10-08, a38bd7b)
  - REQs: REQ-050 (AC1), REQ-051 (AC1), REQ-052 (AC2), REQ-059, REQ-031
  - Depends on: T5.1, T0.2, T2.3
  - Scope: A Nuxt app that extends the layer, with Nuxt Content reading `../../docs` per ADR-0002; the app layout with header, version, sidebar in `DESIGN.md` order, a mobile slideover, and a skip link.
  - Done when: `generate` produces a static build, the sidebar order matches `DESIGN.md` in a test, and no `.md` file exists under `apps/showcase`.

- [x] **T5.4 — Doc routes and rendering** (2026-10-08, 95ec70b)
  - REQs: REQ-051 (AC2, AC3), REQ-052 (AC1), REQ-057 (AC1)
  - Depends on: T5.3
  - Scope: Every route in §4.6 except `/tokens`, `/status`, and the email previews (those pages exist, with content pending); generated blocks rendered as plain tables for now; a status banner; an on-page table of contents; a verbatim brand-source page; a 404 page.
  - Done when: the route count equals the doc count, the route crawl has zero 404s, and the fixture-doc edit test passes.

- [x] **T5.5 — End-to-end, accessibility, and visual harness** (2026-10-08, 4bdc927)
  - REQs: REQ-060, REQ-061 (AC1), REQ-028 (infrastructure)
  - Depends on: T5.4
  - Scope: Playwright projects at 360, 768, and 1280 px; an `expectNoA11yViolations` helper; a crawl over every route with axe and overflow checks; skip-link and landmark tests; a reduced-motion project; the `toHaveScreenshot` setup with baselines stored in git and updated only by `pnpm test:visual:update`.
  - Done when: every route passes axe and the overflow check at all 3 widths in CI.

- [x] **T5.6 — Static deploy** (2026-10-08, 670cd33)
  - REQs: REQ-050 (AC3)
  - Depends on: T5.5
  - Scope: `deploy-showcase.yml`, publishing the static build to GitHub Pages through GitHub Actions. Set Nuxt's `app.baseURL` to `/cup-noobles-desgins-system/`, because a project site is served under a subpath.
  - Done when: a push to `main` deploys to `https://vinsmokemau.github.io/cup-noobles-desgins-system/`; the deployed home page returns 200; and a route crawl against the deployed site finds no broken internal links or assets under the project subpath (Nuxt `app.baseURL`).

### P6 — Token showcase

- [ ] **T6.1 — `/tokens` explorer**
  - REQs: REQ-053
  - Depends on: T5.5
  - Done when: the row count equals the token count in `tokens.flat.json`; filtering by tier, group, and status and searching by text work in end-to-end tests; and both copy buttons put the exact text on the clipboard.

- [ ] **T6.2 — Color previews**
  - REQs: REQ-054 (AC1, AC4)
  - Depends on: T6.1
  - Done when: `/foundations/color` shows a swatch per color token with its ratio against `color.bg.base`; the ratios match `check-contrast`; and TBD tokens show the hatched overlay and badge.

- [ ] **T6.3 — Typography, spacing, shape, effects, and motion previews**
  - REQs: REQ-054 (AC2, AC3, AC4)
  - Depends on: T6.1
  - Done when: each foundation page renders its preview type from its generated blocks; the type specimens include `áéíóú ñ ¿¡`; and the motion demo does not move under reduced motion.

- [ ] **T6.4 — `/status` dashboard**
  - REQs: REQ-057 (AC2)
  - Depends on: T6.1, T2.4
  - Done when: the counts on `/status` equal `tbd-report.json` in an end-to-end test, and each item links to its doc or token.

- [ ] **T6.5 — Home page**
  - REQs: REQ-062 (AC1), REQ-052
  - Depends on: T6.4
  - Done when: `/` shows the package version and the token, component, and open-TBD counts, each matching its source.

### P7 — Component infrastructure and atoms

Rule for every component task (T7.2 onward): produce the component doc (the full §4.2 component template), its component tokens, its Nuxt UI theme entries or `Cn*` source, the `states` and `playground` demos, visual baselines for every state, axe tests, keyboard tests for every documented interaction, contrast pairs added to `contrast-pairs.json`, and at least one changeset. The doc status is `draft` while any token it uses is `tbd`.

- [ ] **T7.1 — Component page infrastructure**
  - REQs: REQ-055, REQ-026 (AC2, AC3)
  - Depends on: T5.5
  - Scope: A demo registry driven by frontmatter `demos`; the `StateMatrix`, `Playground` (reading the `controls.ts` schema: prop name, type, and options), and `CodeBlock` components (source imported with `?raw`, plus copy); `ViewportFrame`, which renders the isolated demo route `/_demo/[slug]/[demo]` in an iframe at 360, 768, or 1280 px so that media queries respond; and a helper that creates a visual baseline for every state matrix. Validate everything with one dummy demo that is deleted at the end of the task.
  - Done when: the dummy demo shows all three panels, the copied code equals the demo file's content, and the iframe width changes the media query result.

- [ ] **T7.2 — Button**
  - REQs: REQ-023, REQ-024, REQ-026, REQ-027, REQ-028, REQ-022 (AC2)
  - Depends on: T7.1, T4.4
  - Done when: every REQ-023 acceptance criterion passes; the primary label is black; the disabled button has no glow; keyboard activation works with Enter and Space; focus-visible is distinct from the glow in its baseline; and axe is clean in every state.

- [ ] **T7.3 — Link, Icon, and Badge**
  - REQs: REQ-020, REQ-026, REQ-027, REQ-028
  - Depends on: T7.2 (OD-09 needed before the icon doc can be `stable`)
  - Done when: all three components have docs, demos, and baselines; the badge includes the "tag" variant used by BR-12; and an icon-only link requires an accessible label (the test fails without one).

- [ ] **T7.4 — Input, Textarea, and Select**
  - REQs: REQ-020, REQ-024, REQ-026, REQ-027, REQ-028
  - Depends on: T7.2
  - Done when: each component demonstrates the default, hover, focus-visible, disabled, and error states; error text is linked with `aria-describedby`; and axe is clean.

- [ ] **T7.5 — Checkbox, RadioGroup, and Switch**
  - REQs: REQ-020, REQ-024, REQ-026, REQ-027, REQ-028
  - Depends on: T7.2
  - Done when: each component demonstrates its checked, unchecked, disabled, and focus-visible states (plus indeterminate for the checkbox); arrow keys move within the radio group; and Space toggles the switch.

- [ ] **T7.6 — Progress, Skeleton, and Separator**
  - REQs: REQ-020, REQ-026, REQ-027, REQ-029 (AC2)
  - Depends on: T7.2
  - Done when: the skeleton animation stops under reduced motion, and the progress bar exposes its value to assistive technology.

- [ ] **T7.7 — `CnLogo`**
  - REQs: REQ-030, REQ-021, REQ-022
  - Depends on: T7.2 (OD-08 needed before the doc can be `stable`)
  - Done when: all 3 variants render the placeholder text "Logo asset pending (TBD-17)"; the accessible label is required unless the logo is `decorative`; and the component contains no invented artwork.

- [ ] **T7.8 — `CnSparkle` and `CnStickerFrame`**
  - REQs: REQ-029, REQ-021, REQ-022
  - Depends on: T7.2
  - Done when: both are `aria-hidden` with no focusable children, any animation respects reduced motion, and the sticker frame wraps arbitrary slot content without overflow at 360 px. Motif artwork is a TBD-18 placeholder.

### P8 — Molecules and organisms

- [ ] **T8.1 — FormField and Card**
  - REQs: REQ-025 (AC1, AC3), REQ-026, REQ-027, REQ-028
  - Depends on: T7.4
  - Done when: FormField wires its label, help text, and error to the control, and axe is clean in the error state; Card renders on `color.bg.base` with its outline and highlight tokens, and marks `color.surface.card` TBD-06 per C-05.

- [ ] **T8.2 — `CnMediaCard`**
  - REQs: REQ-025 (AC2, AC4), REQ-021, REQ-022, REQ-026, REQ-027, REQ-028
  - Depends on: T8.1, T7.3
  - Done when: the thumbnail, title, and tag badges render; a card missing both `alt` and `decorative` fails the type check or the development warning test; a linked card has exactly one tab stop; and the layout holds at 360 px with a long title.

- [ ] **T8.3 — Alert, Toast, and Tooltip**
  - REQs: REQ-020, REQ-026, REQ-027
  - Depends on: T7.3
  - Done when: each feedback variant uses feedback tokens (TBD-07 placeholders); the toast is announced by a live region; and the tooltip opens on focus as well as hover.

- [ ] **T8.4 — Tabs, Breadcrumb, and Pagination**
  - REQs: REQ-020, REQ-026, REQ-027, REQ-028
  - Depends on: T7.3
  - Done when: arrow-key navigation works in tabs, the current page is marked `aria-current` in the breadcrumb and pagination, and nothing overflows at 360 px.

- [ ] **T8.5 — Modal and Slideover**
  - REQs: REQ-020, REQ-026, REQ-027
  - Depends on: T7.2
  - Done when: focus is trapped and restored, Escape closes, the background is inert, and axe is clean while open.

- [ ] **T8.6 — Site header and footer**
  - REQs: REQ-020, REQ-022, REQ-028, REQ-061 (AC2)
  - Depends on: T8.5, T7.7
  - Scope: The source is `nuxt-ui` or `custom`, per ADR-0001. The header and footer are slot-based (logo, navigation, actions) with no domain content; on mobile, navigation moves into a slideover.
  - Done when: the header works at 360 and 1280 px, the mobile navigation opens and closes by keyboard, and the showcase adopts it.

- [ ] **T8.7 — Generated inventory and full fixture coverage**
  - REQs: REQ-020 (AC1, AC2), REQ-022 (AC3), REQ-071 (AC1)
  - Depends on: T8.1–T8.6
  - Scope: The `inventory` generated-block format in `sync-docs`; `inventory.md`; the `/components` index; and the consumer fixture rendering every component.
  - Done when: the inventory rows equal the component docs, and the fixture's end-to-end test visits every component with axe clean.

### P9 — Patterns and content

- [ ] **T9.1 — Forms, feedback, and loading patterns**
  - REQs: REQ-035, REQ-009
  - Depends on: T8.7
  - Done when: 3 pattern docs (at `draft` status at minimum) exist, each with at least one composed demo using neutral content only (the domain-term test passes on demos), and axe is clean.

- [ ] **T9.2 — Navigation, empty states, error pages, and responsive behavior**
  - REQs: REQ-035, REQ-009
  - Depends on: T9.1
  - Done when: 4 pattern docs have demos, and the showcase 404 page is built from the error-page pattern.

- [ ] **T9.3 — Content docs**
  - REQs: REQ-036, REQ-007, REQ-009
  - Depends on: T8.7
  - Done when: the three content docs pass `check-docs`; every example is in a `copy es-MX` block; and the voice attribute pairs are marked draft (TBD-21).

### P10 — Email

- [ ] **T10.1 — `email-foundations.md`**
  - REQs: REQ-040
  - Depends on: T3.4
  - Done when: every section listed in REQ-040 AC1 exists, and every fallback names a token that exists in `email-tokens.json`.

- [ ] **T10.2 — Email build pipeline**
  - REQs: REQ-041 (AC1, AC2), REQ-042, REQ-044
  - Depends on: T10.1, T0.4
  - Done when: `pnpm --filter @vinsmokemau/cup-noobles-email build` works, and the output checks pass: no `var(`, no stylesheet link, no scripts, no backend tags, only token hex values, and no hex literals in the sources.

- [ ] **T10.3 — Email components**
  - REQs: REQ-041 (AC3, AC4), REQ-042
  - Depends on: T10.2
  - Done when: the 6 components compile, every slot is documented in `email-components.md`, and the button uses a solid border in place of the glow, per REQ-040.

- [ ] **T10.4 — Reference layout and `email-layouts.md`**
  - REQs: REQ-043
  - Depends on: T10.3
  - Done when: the layout renders at 320 and 600 px with no horizontal scroll, and the plain-text structure is documented.

- [ ] **T10.5 — Email previews in the showcase**
  - REQs: REQ-058
  - Depends on: T10.4, T5.5
  - Done when: the iframe preview is sandboxed, the width toggle works, and "Copy HTML" equals the file content in an end-to-end test.

### P11 — Search, governance, and release tooling

- [ ] **T11.1 — Global search**
  - REQs: REQ-056
  - Depends on: T6.1, T8.7
  - Done when: Ctrl+K or Cmd+K opens the search; queries for a doc title, a heading, a token path, and a component name each return the right result and anchor; and the search is keyboard-operable with axe clean.

- [ ] **T11.2 — Governance docs**
  - REQs: REQ-072, REQ-073 (AC1)
  - Depends on: T5.4
  - Scope: `ownership.md` (A-01), `versioning-and-releases.md` (§4.8), `contribution.md` (a spec-first flow: ADR or spec change, then task, then code), `deprecation.md` (REQ-072), and `decision-log.md` (an index of every ADR).
  - Done when: `check-docs` and `check-links` pass, and every ADR appears in the index.

- [ ] **T11.3 — Changesets, changelog page, and deprecation helper**
  - REQs: REQ-070, REQ-062 (AC2), REQ-072 (AC1)
  - Depends on: T11.2
  - Done when: a test changeset produces a lockstep version pull request in a dry run; `/changelog` renders `CHANGELOG.md`; and the deprecation helper warns in development only (tested).

- [ ] **T11.4 — `release-check`**
  - REQs: REQ-018
  - Depends on: T11.3
  - Done when: `pnpm release:check` fails today, listing every stable component that reaches a TBD token, and passes on a fixture where every token is stable.

### P12 — Release readiness

- [ ] **T12.1 — Publish 0.x and consume it from the registry**
  - REQs: REQ-070, REQ-071 (AC2)
  - Depends on: P6–P11 complete
  - Done when: `0.x.0` is published, and the fixture, switched to install from the registry, passes its end-to-end suite in CI.

- [ ] **T12.2 — Consumer documentation and manual checks**
  - REQs: REQ-001, REQ-008 (AC3), REQ-074 (AC2)
  - Depends on: T12.1
  - Done when: `using-the-system.md` has install steps verified against the registry, and the manual checks for REQ-008 AC3 and REQ-074 AC2 are recorded in ADR-0007.

- [ ] **T12.3 — 1.0 readiness review**
  - REQs: REQ-018
  - Depends on: T12.2
  - Done when: the `release:check` output and the open TBD list have been presented to the owner, and the owner decides in writing to release 1.0.0 or stay on 0.x (ADR). Claude Code does not release 1.0.0 without that decision.

---
## 7. Risks and open decisions

### 7.1 Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | A Nuxt UI major release changes theming variables or config keys and breaks the layer. | Medium | High | Pin the version (ADR-0001). The consumer fixture and visual baselines catch breakage. Upgrades are their own task with an ADR. |
| R-02 | Brand gaps (typefaces, neutrals, feedback colors, logo files, and the other TBD items) keep the system from reaching 1.0. | High | Medium | Structural work proceeds on labeled placeholders, and the release gate (REQ-018) blocks 1.0. Ask the owner for OD-04 through OD-08 during P0. |
| R-03 | Brand color combinations fail contrast: white or yellow on pink, white on yellow. | Certain, if the pairs are used | High | Derived facts in §2.1, the forbidden-pairs list, and `check-contrast` in CI. |
| R-04 | A neon glow on a pure-black base causes halation that hurts text legibility, which conflicts with BR-06. | Medium | Medium | A draft rule in `effects.md` restricts glow to component edges and bans it on body text. The owner approves or rejects it. |
| R-05 | Email clients alter the brand: dark-mode inversion shifts `#000000` and `#ef80ae`, `box-shadow` and web fonts are widely unsupported, and Outlook's radius support is limited. | High | Medium | Fallbacks per REQ-040. Real-client testing belongs to the consuming project; an optional rendering service is a future ADR. |
| R-06 | Nuxt Content cannot read a directory outside the app, or changes behavior between versions. | Medium | Medium | The T0.2 spike, a pinned version, and a fallback to a git-ignored build-time copy. |
| R-07 | Reuse is limited to Vue and Nuxt, because the components are a Nuxt layer. | Certain | Low | Accepted, and stated in `using-the-system.md`. Tokens and email HTML are framework-free, so other stacks consume those. |
| R-08 | Visual regression tests flake because fonts render differently across machines. | Medium | Medium | Screenshots run only in the pinned CI container (A-12), and baselines are updated only by an explicit command. |
| R-09 | Scope creep: commerce components or overlays drift into the packages. | Medium | Medium | The non-goals in §1.3, the domain-term test (REQ-022), and OD-01 and OD-10. |
| R-10 | Claude Code drifts from the spec across sessions or invents brand values. | Medium | High | The execution protocol in §0, one task per session, the Definition of Done, the TBD convention, and the automated checks. |
| R-11 | Placeholder values get mistaken for brand values and copied into other projects. | Medium | High | ADR-0006, hatched TBD previews, status badges, `/status`, and the release gate. |
| R-12 | The chosen display typeface has no web or email embedding license. | Medium | Medium | License terms are a selection criterion in `typography.md` (T4.3) and must be recorded in the ADR that resolves TBD-01. |
| R-13 | Sparkle and arcade motifs animate in ways that harm users sensitive to motion. | Low | High | REQ-029: decorative only, reduced-motion support, and the flash limit. |

### 7.2 Open decisions

The owner must decide these. Each decision becomes an ADR.

| ID | Decision | Options | Recommendation | Needed by |
|---|---|---|---|---|
| OD-01 | Where do commerce components live? (C-02) | (a) In the storefront repo, built from design system parts; (b) in the design system under a separate "commerce" namespace | **Decided: (a)** (OA-10, ADR-0007). | T1.3 |
| OD-02 | Showcase hosting and visibility | Public or private; hosted on a static host or the owner's own infrastructure | **Decided: public, on GitHub Pages** (OA-10, ADR-0007), as a project site at `https://vinsmokemau.github.io/cup-noobles-desgins-system/`. On GitHub Free, this requires a public repository (OD-14). | T5.6 |
| OD-03 | Package distribution | Private registry (GitHub Packages), public npm, or git-referenced layer | **Decided: GitHub Packages, private** (OA-9, ADR-0007). Consumers install with a GitHub token that has `read:packages`, documented in T12.2. | T12.1 |
| OD-04 | Brand color shades (C-06, TBD-08) | (a) The brand supplies full scales; (b) approve an algorithmic derivation such as OKLCH lightness steps, recorded in an ADR; (c) use the single hex for every shade | (a) or (b). Both need owner sign-off. (c) is the temporary default. | Before 1.0 (T5.1 uses the default) |
| OD-05 | Card surface (C-05, TBD-06) | (a) Pure black, separated by an outline only; (b) a distinct near-black surface token | Undecided: (a) best respects BR-03, and (b) better matches "dark surface" in BR-12. | T8.1 (placeholder allowed) |
| OD-06 | Typefaces (TBD-01, TBD-02) | Any font meeting the criteria set in T4.3 | Owner supplies | T4.3 (placeholder allowed), before 1.0 |
| OD-07 | Text, neutral, and feedback colors (TBD-04, 05, 07) | Owner supplies, or approves a proposal | Owner supplies | Before 1.0 |
| OD-08 | Logo and motif SVG delivery (TBD-17, TBD-18) | Owner supplies SVGs plus clear-space and minimum-size rules | — | Before T7.7 or T8.6 can be `stable` |
| OD-09 | Icon set (TBD-19) | Any Iconify collection with a stroke style consistent with BR-13, or custom icons | Owner decides | Before T7.3 can be `stable` |
| OD-10 | Stream overlays (C-04) | Keep as a non-goal, or add an overlay phase later | Keep as a non-goal for this spec | None |
| OD-11 | Confirm C-03: visual styling lives only in the layer, and consuming apps keep "Tailwind for layout only" | Confirm or amend | **Decided: confirmed** (OA-10, ADR-0007). | T5.1 |
| OD-12 | Email authoring | MJML (A-14), or hand-written table HTML | **Decided: MJML** (OA-6). ADR-0004 records it. | T0.4 |
| OD-13 | Repository host, owner, name, and package scope | **Decided** (OA-7, OA-8, OA-9, ADR-0007): GitHub, personal account `vinsmokemau`, repository `cup-noobles-desgins-system`, scope `@vinsmokemau` with package names `cup-noobles-tokens`, `cup-noobles-nuxt`, and `cup-noobles-email`. | — | T1.1 |
| OD-14 | Repository visibility | (a) Public; (b) private, with a GitHub Pro subscription | **Decided: (a) public** (OA-11, ADR-0007). The repository `https://github.com/vinsmokemau/cup-noobles-desgins-system` exists, is public, and is empty. This enables GitHub Pages (OD-02) and branch protection (REQ-074 AC2) on the free plan. | T1.4 |

---

## 8. Spec change log

| Spec version | Date | Change | Reference |
|---|---|---|---|
| 1.0 | 2026-09-23 | Initial specification | OA-1 through OA-5, BC, EC |
| 1.1 | 2026-09-23 | OD-12 decided (MJML). OD-13 partly decided: GitHub, repository `cup-noobles-desgins-system`. The owner and package scope stay open, now needed by T1.1 instead of T0.1. | OA-6, OA-7 |
| 1.2 | 2026-09-23 | OD-13: owner decided (personal account). Recommended scope recorded; awaiting the username and confirmation. | OA-8 |
| 1.3 | 2026-09-23 | OD-13 and OD-03 decided: scope `@vinsmokemau`, packages `cup-noobles-tokens`, `cup-noobles-nuxt`, `cup-noobles-email`, published privately on GitHub Packages. Placeholder package names replaced throughout. | OA-9 |
| 1.4 | 2026-09-23 | Added `CLAUDE.md` and the `/task` skill to the file tree; T0.1 now moves the owner's brand file into place. | Owner request |
| 1.5 | 2026-09-23 | OD-01 (a), OD-02 (public, GitHub Pages), and OD-11 (confirmed) decided; C-02 and C-03 resolved. Added OD-14 (repository visibility). T5.6 targets the GitHub Pages project subpath. | OA-10 |
| 1.6 | 2026-09-23 | OD-14 decided: the repository is public and was created empty. No open decision blocks any task in P0–P12 anymore; only the brand inputs (OD-04 through OD-09) remain, and they gate stable status and 1.0, not the tasks. | OA-11 |
| 1.7 | 2026-09-25 | `site-header` and `site-footer` are `source: nuxt-ui` (themed `UHeader` and `UFooter`), following the ADR-0001 finding. Updated the C-01 custom-component list and the §4.10 row. | Owner decision in chat; ADR-0001 |
| 1.8 | 2026-09-27 | §4.2: row 14 (Context · Decision · Consequences) is three H2 headings, as in the ADR template and ADRs 0001–0006. | Owner decision in chat (T2.1 open question) |
| 1.9 | 2026-09-27 | REQ-004 AC2: ADRs are exempt from the hex-literal rule, because §4.4 has ADRs record values. REQ-008 AC1: the MDC check applies outside fenced code blocks only. | Owner decision in chat (T2.2 open questions) |
| 1.10 | 2026-09-27 | §4.4: added the content-pending callout (`> **TBD:** Content pending (Tn.n).`) that T2.3's stubs use. It has no TBD ID, `check-tbd` validates its task ID against §6 and reports it separately, and any other `> **TBD…` form fails. | Owner decision in chat (T2.3 open question) |
| 1.11 | 2026-09-27 | §7.2: the six decided ODs that cited only owner answers (OD-01, OD-02, OD-03, OD-11, OD-13, OD-14) now also cite ADR-0007, which records them, so REQ-073 AC2 holds. §4.4: a resolved §2.4 row is marked `Resolved (ADR-NNNN)`. | Owner decision in chat (T2.4 open questions); ADR-0007 |
| 1.12 | 2026-09-27 | §4.4: TBD and `derived-pending` tokens name their §2.4 items in `$extensions.cn.tbd` (`derived-pending` is always `["TBD-08"]`); `stable` and `deprecated` tokens have no such field. `check-tokens` enforces it, and `check-tbd` validates the IDs and counts tokens per item. | Owner decision in chat (T2.4 open question) |
| 1.13 | 2026-09-27 | T3.2 scope: extend `check-tbd` to read `$extensions.cn.tbd`, the part of 1.12 that no task covered. | Owner decision in chat (T3.1 open question); related token decisions in ADR-0008 |
| 1.14 | 2026-09-27 | §2.4: TBD-16 resolved. The focus indicator is a solid brand-yellow ring, 3 px wide, with a 3 px gap. | Owner decision in chat (T4.4, option A, size 2); ADR-0009 |

Amendment rule: this file changes only through an ADR, or by the owner directly. Every amendment bumps the spec version, adds a row here, and keeps every REQ and task ID stable. Removed items are struck through, never renumbered.

---

## Appendix A — Traceability matrix (requirement → tasks)

Generated from §6 while this spec was written. Every requirement is covered by at least one task. When the spec is amended, regenerate this table and confirm that no requirement is left without a task.

| Requirement | Tasks |
|---|---|
| REQ-001 | T2.3, T12.2 |
| REQ-002 | T2.1, T2.2 |
| REQ-003 | T2.1, T2.2 |
| REQ-004 | T2.2, T3.6 |
| REQ-005 | T2.4, T3.2, T4.3 |
| REQ-006 | T1.5, T4.1 |
| REQ-007 | T2.2, T9.3 |
| REQ-008 | T0.2, T2.2, T12.2 |
| REQ-009 | T2.4, T4.1, T4.3, T9.1, T9.2, T9.3 |
| REQ-010 | T0.3, T3.1 |
| REQ-011 | T3.2, T3.3, T3.4, T4.2 |
| REQ-012 | T3.3, T4.2, T5.2 |
| REQ-013 | T0.3, T1.1, T3.4 |
| REQ-014 | T3.1 |
| REQ-015 | T3.3, T3.5, T4.2 |
| REQ-016 | T1.3, T5.1 |
| REQ-017 | T3.1, T3.4 |
| REQ-018 | T11.4, T12.3 |
| REQ-020 | T0.1, T1.3, T5.1, T7.3, T7.4, T7.5, T7.6, T8.3, T8.4, T8.5, T8.6, T8.7 |
| REQ-021 | T1.3, T7.7, T7.8, T8.2 |
| REQ-022 | T1.3, T7.2, T7.7, T7.8, T8.2, T8.6, T8.7 |
| REQ-023 | T4.4, T7.2 |
| REQ-024 | T4.4, T7.2, T7.4, T7.5 |
| REQ-025 | T8.1, T8.2 |
| REQ-026 | T7.1, T7.2, T7.3, T7.4, T7.5, T7.6, T8.1, T8.2, T8.3, T8.4, T8.5 |
| REQ-027 | T4.6, T7.2, T7.3, T7.4, T7.5, T7.6, T8.1, T8.2, T8.3, T8.4, T8.5 |
| REQ-028 | T4.5, T5.5, T7.2, T7.3, T7.4, T7.5, T8.1, T8.2, T8.4, T8.6 |
| REQ-029 | T4.5, T4.6, T7.6, T7.8 |
| REQ-030 | T4.1, T7.7 |
| REQ-031 | T0.1, T5.1, T5.3 |
| REQ-035 | T9.1, T9.2 |
| REQ-036 | T9.3 |
| REQ-037 | T2.2 |
| REQ-040 | T10.1 |
| REQ-041 | T0.4, T10.2, T10.3 |
| REQ-042 | T10.2, T10.3 |
| REQ-043 | T10.4 |
| REQ-044 | T0.4, T10.2 |
| REQ-050 | T1.1, T5.3, T5.6 |
| REQ-051 | T0.2, T5.3, T5.4 |
| REQ-052 | T5.3, T5.4, T6.5 |
| REQ-053 | T6.1 |
| REQ-054 | T4.3, T6.2, T6.3 |
| REQ-055 | T7.1 |
| REQ-056 | T11.1 |
| REQ-057 | T5.4, T6.4 |
| REQ-058 | T10.5 |
| REQ-059 | T5.3 |
| REQ-060 | T5.5 |
| REQ-061 | T5.5, T8.6 |
| REQ-062 | T6.5, T11.3 |
| REQ-070 | T11.3, T12.1 |
| REQ-071 | T5.2, T8.7, T12.1 |
| REQ-072 | T11.2, T11.3 |
| REQ-073 | T0.5, T2.4, T11.2 |
| REQ-074 | T1.2, T1.4, T12.2 |
| REQ-075 | T1.4, T3.6 |
