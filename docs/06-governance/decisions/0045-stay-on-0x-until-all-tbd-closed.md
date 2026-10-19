---
title: "ADR-0045: Stay on 0.x until every TBD item is closed"
slug: adr-0045-stay-on-0x-until-all-tbd-closed
layer: adr
status: stable
lang: en
brandRules: []
tbd: [TBD-01, TBD-02, TBD-03, TBD-06, TBD-08, TBD-09, TBD-10, TBD-12, TBD-15, TBD-20]
related: [versioning-and-releases, decision-log, adr-0007-owner-decisions-on-record]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0045: Stay on 0.x until every TBD item is closed

## Context

T12.3 is the 1.0 readiness review (REQ-018). On 2026-10-18 `pnpm release:check` passed at version 0.2.0: none of the 10 stable component docs reaches a tbd or derived-pending token, and no foundation doc is tbd. `pnpm check:tbd` still reported 10 open TBD items (107 tbd tokens, 36 draft docs): TBD-01, TBD-02, TBD-03, TBD-06, TBD-08, TBD-09, TBD-10, TBD-12, TBD-15, and TBD-20. The owner saw these results on a decision page and chose between releasing 1.0.0 now, staying on 0.x, or staying on 0.x with a dated target.

## Decision

The owner chose to stay on 0.x, in chat on 2026-10-18: "A. I want to close all the TBD points before publish the 1.0.0 version". The release of 1.0.0 waits until every item in the TBD register (SPEC.md §2.4) is resolved. Passing `pnpm release:check` alone is not enough. The 0.x line continues in the meantime.

## Consequences

- Claude Code does not release 1.0.0. The owner confirms the release in chat, and a new ADR records it, after `pnpm check:tbd` reports zero open items.
- The ten open items stay open, each resolved through the owner's decision and an ADR (SPEC.md §4.4).
- T12.3 is closed by this decision. A later 1.0 review is a new task, started only when the TBD register is empty.
