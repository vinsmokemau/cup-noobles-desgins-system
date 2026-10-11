---
title: Ownership
slug: ownership
layer: governance
status: stable
lang: en
tbd: []
related: [contribution, versioning-and-releases, deprecation, decision-log]
since: 0.1.0
updated: 2026-10-11
---

# Ownership

## Purpose

This doc says who owns the Cup Noobles Design System and who decides what. One person maintains the system with Claude Code (A-01), so the governance is sized for one person: there is no review board, and no approval step waits on anyone else.

## Policy and process

### Who owns what

| Area | Owner | What that means |
|---|---|---|
| The repository | The owner, on a personal GitHub account | The owner holds the repository `cup-noobles-desgins-system` and the package scope `@vinsmokemau` (OA-7, OA-8, OA-9). |
| Brand values | The owner | Colors, typefaces, sizes, radii, stroke widths, glow, spacing, motion, icons, logos, and artwork come only from the brand context, an ADR, or the owner in chat. |
| Decisions | The owner | Every open decision is the owner's to make. An ADR records it (REQ-073). |
| The spec | The owner | `SPEC.md` is the contract. It changes only through an ADR, or by the owner directly. |
| Work | The owner, with Claude Code | Claude Code does one task from the spec per session. It never invents a brand value and never publishes or deploys without the owner's confirmation. |

### The owner is not a designer

The owner decides what the brand is and how it looks, but is not a designer. Whenever a design decision is needed (a TBD item, an open decision, or a draft rule), the options are shown side by side on real brand context, each one explained in plain language. Measurable checks are marked pass or fail, and one option is recommended. The owner answers in chat, and the answer is recorded in an ADR. The page that compares the options only helps the owner decide. The owner's reply is the source of the value.

### What does not need the owner

- Work that the spec already describes, such as writing a doc from existing ADRs or building a component from approved tokens.
- Fixes that change no brand value and no rule.

### What always needs the owner

- Any brand value that has no source yet, which is a TBD item (SPEC.md §2.4).
- A change to a brand rule (BR-01 to BR-17). It also needs a new ADR (REQ-006 AC3).
- A change to `SPEC.md`, other than ticking a finished task.
- A doc moving from `draft` to `stable` (REQ-009 AC2).
- A `1.0.0` release (REQ-018). Claude Code does not release `1.0.0` without the owner's written decision.
- Anything outward-facing: pushing, publishing packages, deploying, or changing repository settings.

### If the maintainer changes

A-01 assumes a single maintainer. If another person joins or takes over, record the change in an ADR and update this doc, so the table above stays true.

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: owners, the decisions that need the owner, and how design decisions are presented (T11.2, REQ-073) — awaiting owner approval
- 0.1.0 — Approved as stable by the owner — ADR-0044
