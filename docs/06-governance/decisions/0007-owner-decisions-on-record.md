---
title: "ADR-0007: Owner decisions on record"
slug: adr-0007-owner-decisions-on-record
layer: adr
status: draft
lang: en
brandRules: []
tbd: []
related: [adr-0004-mjml-email-spike, adr-0005-baseline-assumptions-and-conflicts]
since: 0.1.0
updated: 2026-09-27
---

# ADR-0007: Owner decisions on record

## Context

REQ-073 AC2 says: "Every TBD resolution and every OD decision references an ADR number. Check: `check-tbd` fails if a resolved item has no ADR link."

SPEC.md §7.2 marks seven open decisions as decided. OD-12 cites ADR-0004. The other six (OD-01, OD-02, OD-03, OD-11, OD-13, and OD-14) cite only the owner's answers in SPEC.md §2.5 (OA-7 to OA-11), so no ADR records them. ADR-0005 mentions OD-01, OD-02, OD-11, and OD-14 as evidence for assumptions and conflicts, but it does not record the decisions themselves, and no ADR mentions OD-03 or OD-13.

The owner chose, in chat on 2026-09-27 (T2.4 open question), to record these six decisions in one ADR and have SPEC.md §7.2 cite it, so that `check-tbd` can enforce REQ-073 AC2 strictly.

## Decision

The six decisions below are recorded as the owner gave them. This ADR adds nothing new: each row restates SPEC.md §2.5 and §7.2 as of SPEC.md 1.10. All six answers were given on 2026-09-23 (SPEC.md §8, versions 1.1 to 1.6).

| OD | Decision | Owner answer | Recorded in SPEC.md |
|---|---|---|---|
| OD-01 | Commerce components live in the storefront repository and are built from design system parts. The design system ships generic parts only (C-02). | OA-10 | 1.5 |
| OD-02 | The showcase is public and hosted on GitHub Pages as a project site at `https://vinsmokemau.github.io/cup-noobles-desgins-system/`. | OA-10 | 1.5 |
| OD-03 | Packages are published privately on GitHub Packages. Consumers install with a GitHub token that has `read:packages`. | OA-9 | 1.3 |
| OD-11 | C-03 is confirmed: visual styling lives only in the layer, and consuming apps keep "Tailwind for layout only". | OA-10 | 1.5 |
| OD-13 | The code is on GitHub, under the personal account `vinsmokemau`, in the repository `cup-noobles-desgins-system`. The package scope is `@vinsmokemau`, and the packages are `cup-noobles-tokens`, `cup-noobles-nuxt`, and `cup-noobles-email`. | OA-7, OA-8, OA-9 | 1.1 to 1.3 |
| OD-14 | The repository is public. It was created empty at `https://github.com/vinsmokemau/cup-noobles-desgins-system`. | OA-11 | 1.6 |

OD-12 (MJML for email, OA-6) stays recorded in ADR-0004. OD-04 to OD-10 are still open. Each gets its own ADR when the owner decides it (ADR-0005, Consequences).

## Consequences

- SPEC.md 1.11 cites this ADR on the six §7.2 rows above, and `check-tbd` (T2.4) fails when a decided OD or a resolved TBD row in SPEC.md names no existing ADR.
- Changing any of these decisions takes a new ADR that supersedes the matching row here, and a SPEC.md amendment.
