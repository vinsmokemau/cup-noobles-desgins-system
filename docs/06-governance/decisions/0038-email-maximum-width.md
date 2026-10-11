---
title: "ADR-0038: Email maximum width is 600 px"
slug: adr-0038-email-maximum-width
layer: adr
status: stable
lang: en
brandRules: []
tbd: []
related: [adr-0004-mjml-email-spike, email-foundations]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0038: Email maximum width is 600 px

## Context

Assumption A-08 set the email body width to at most 600 px, as a common email convention and not a brand rule. T10.1 wrote `email-foundations.md` with that width, and flagged it as a draft because no source backed it and `email-tokens.json` has no token for it.

The owner compared three widths on a visual comparison page, each shown on the same example email: A, 600 px; B, 640 px; and C, 480 px. All three are fluid and pass the 320 px no-scroll check (REQ-043 AC1), so the choice was one of taste and of room for the brand art. No `frontend-design` audit was run: the choice sets one number and adds no color, shape, or motion.

## Decision

The owner chose A, 600 px, in chat on 2026-10-11, the recommended option. The email body is at most 600 px wide, and it shrinks to the width of the client. This confirms A-08, and the width has the owner as its source.

## Consequences

- The maximum-width rule in `email-foundations.md` cites this ADR and no longer awaits approval.
- The doc stays `draft`. The owner did not approve the other rules in it (dark-mode, images-off, and radius tolerance).
- A token for the width does not exist yet. Adding one is a token change, so it needs its own task. Until then, the email sources carry the number 600, and the build task (T10.2) must not hide it behind a hex or a font value.
- Changing the width takes a new ADR that supersedes this one.
