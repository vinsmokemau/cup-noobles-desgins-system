---
title: "ADR-0039: Email foundations rules approved, and the width token"
slug: adr-0039-email-foundations-rules-and-width-token
layer: adr
status: stable
lang: en
brandRules: [BR-03]
tbd: []
related: [adr-0038-email-maximum-width, email-foundations]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0039: Email foundations rules approved, and the width token

## Context

T10.1 wrote `email-foundations.md` as a draft. ADR-0038 recorded the owner's choice of 600 px for the email maximum width, and left two things open: the owner had not approved the dark-mode, images-off, and radius rules, and no token held the width. The owner answered both open questions with "make the suggested action" in chat, 2026-10-11. The suggested actions were to add the width token as its own small task, and to approve the rules and move the doc to `stable`.

A stable doc holds no `TBD` or `Draft` callout (REQ-037 AC1). The doc still names four open items: TBD-01 (the display typeface, so the final font stack), TBD-03 (the type scale), TBD-10 (the radius), and TBD-12 (the glow). Each is a value the fallbacks read, and none of them is the owner's to settle in this answer.

## Decision

1. **Rules approved.** The owner approved the dark-mode inversion, images-off behavior, and radius tolerance rules of `email-foundations.md`, as written. The `Draft` callouts that said they awaited approval are removed.
2. **Doc stays a draft.** Moving to `stable` would break REQ-037 AC1 while the four TBD callouts stand. The doc moves to `stable` when TBD-01, TBD-03, TBD-10, and TBD-12 are resolved, and the owner confirms it then.
3. **Width token.** The width has two tokens: the primitive `email.width.max` (`600px`) and the semantic `layout.email.width.max` that references it. Both are `stable` and name ADR-0038 as their source. The width is a technical convention of email, not a brand value.

## Consequences

- `email-foundations.md` cites this ADR in its changelog, and maps the maximum width to `layout.email.width.max`, so the email build (T10.2) reads it with `$cn(layout.email.width.max)` like every other value.
- `email-tokens.json` gains `email.width.max` and `layout.email.width.max`, and the built CSS gains `--cn-layout-email-width-max`.
- SPEC.md gains task T3.7 for the token, and a row in its change log.
- Changing the width takes a new ADR that supersedes ADR-0038.
