---
title: "ADR-0040: The email build writes rem dimensions as px"
slug: adr-0040-email-build-rem-to-px
layer: adr
status: draft
lang: en
brandRules: []
tbd: []
related: [adr-0004-mjml-email-spike, adr-0006-placeholder-values, email-foundations]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0040: The email build writes rem dimensions as px

## Context

`email-tokens.json` holds the resolved token values, and most dimensions in it are `rem`, for example `radius.button` (`0.375rem`), `font.size.body` (`1rem`), and `space.base` (`0.25rem`). ADR-0006 left open "whether `rem` values need converting to `px` for email clients", and assigned the question to the email tasks.

T10.2 built the pipeline and met the question. MJML 5 with `validationLevel: 'strict'` (ADR-0004) rejects `rem` for `font-size`, `line-height`, and `padding`: "only accepts (px) units". Many email clients also ignore `rem`, and a client that ignores `font-size` falls back to its own default.

## Decision

`packages/email/build.ts` writes a token that is one whole `rem` dimension as `px`, at the CSS default root size of 16 px per `rem`, when it replaces `$cn(path)` (`remToPx`). `0.375rem` becomes `6px`, and `1.75rem` becomes `28px`. Every other value is injected as it is.

This changes the unit and not the size, so no brand value is introduced or altered. The 16 px root is the browser default and not a brand rule. The tokens, `email-tokens.json`, and the web outputs are unchanged.

## Consequences

- Email components (T10.3) write sizes as `$cn(font.size.body)` and the like, and the compiled HTML carries px.
- A token whose value mixes units, such as a composite string, is injected as written. A source that needs a px value from such a token needs a separate token.
- The compiled HTML does not follow a reader's browser font size, which email clients rarely apply anyway.
- If the token build later emits px for email directly (a change to `cn/json-email`), this conversion becomes a no-op, and the ADR can be superseded.
- Status is `draft`: the decision is an implementation choice made under ADR-0006's delegation, and the owner has not reviewed it.
