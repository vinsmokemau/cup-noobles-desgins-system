---
title: "ADR-0041: Email components approved, and logo clear space deferred to T10.4"
slug: adr-0041-email-components-approved
layer: adr
status: stable
lang: en
brandRules: [BR-10, BR-12, BR-13, BR-16]
tbd: []
related: [adr-0039-email-foundations-rules-and-width-token, adr-0040-email-build-rem-to-px, email-components]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0041: Email components approved, and logo clear space deferred to T10.4

## Context

T10.3 built the six email components and wrote `email-components.md` as a draft. Each component reads the tokens of its web counterpart: the button reads the primary button tokens, the card reads the card tokens (ADR-0018), the header and footer read the site header and footer tokens (ADR-0030), and the divider reads the separator tokens (ADR-0015). No value was introduced.

The task report left two open questions. The first was whether the owner approves this mapping. The second was that the header cannot apply the logo clear space exactly, because `logo.rule.clearSpace` is a ratio and the email build injects a token only as it is.

## Decision

1. **Mapping approved.** The owner approved the component-to-token mapping of `email-components.md`, as written, in chat on 2026-10-11. The `Draft` callouts that awaited approval are removed.
2. **Doc stays a draft.** The doc still names TBD-01, TBD-03, TBD-09, TBD-10, and TBD-12, so it cannot move to `stable` (REQ-037 AC1). It moves to `stable` when those are resolved and the owner confirms it.
3. **Logo clear space goes to T10.4.** The owner decided in chat on 2026-10-11 that T10.4 handles it. Until then, the header pads the logo with `space.base`.

## Consequences

- `email-components.md` cites this ADR in its changelog.
- T10.4 must settle how the header gets the clear space of ADR-0016 (for example, a build helper that multiplies a token), and update `email-components.md` accordingly.
- A change to the mapping takes a new ADR that supersedes this one.
