---
title: Contribution
slug: contribution
layer: governance
status: stable
lang: en
tbd: []
related: [ownership, versioning-and-releases, deprecation, decision-log]
since: 0.1.0
updated: 2026-10-11
---

# Contribution

## Purpose

This doc says how a change is proposed and made. The flow is spec first: the decision is recorded, then the task, then the code. The spec is the contract, and code is built from it, never the other way around.

## Policy and process

### The flow

1. **Decide.** A change that needs a decision starts with an ADR, or with a change to `SPEC.md`. The owner makes the decision, and the ADR records it with its source (REQ-073). A change the spec already describes skips this step.
2. **Task.** The work is one task from `SPEC.md` §6. One task is done per session, and the next task is never started early.
3. **Code and docs.** The change is built from the spec. The docs and the code change together (REQ-075).
4. **Verify.** The checks pass, and the task's Definition of Done is reported item by item.
5. **Commit.** The work is committed as `T<id>: <task title>`, and a second commit marks the task done.

### Writing an ADR

1. Copy [the ADR template](decisions/0000-adr-template.md) to `decisions/NNNN-title.md`, using the next free number (REQ-073 AC1).
2. Fill in **Context**, **Decision**, and **Consequences**. State rules as imperatives, and give every value its source.
3. List the BR IDs and TBD IDs the decision touches in the frontmatter.
4. Set `status` to `draft` while the decision is open, and to `stable` once the owner accepts it.
5. Add the ADR to the [decision log](decision-log.md). Every ADR must appear there (REQ-001 AC2).
6. When a TBD item is resolved, mark its row in SPEC.md §2.4 as `Resolved (ADR-NNNN)`. Every TBD resolution and every open decision names an ADR (REQ-073 AC2).

### Rules for every change

- Never invent a brand value. A value comes from the brand context, an ADR, or the owner. Anything else is a TBD item (SPEC.md §4.4).
- Never edit `docs/00-overview/brand-context-source.md`. It is hash-locked (REQ-006).
- A token value is never typed by hand in a doc. Run `pnpm sync:docs` after a token changes (REQ-004).
- A doc moves from `draft` to `stable` only with an ADR or an owner approval named in its changelog (REQ-009 AC2).
- A change to public API, tokens, or docs includes a changeset file (SPEC.md §4.8).
- If the spec, the brand context, and an ADR disagree, stop and ask the owner. Do not pick one.

### Before a change is done

| Check | Command |
|---|---|
| Lint, typecheck, unit tests, docs, tokens, and TBD checks | `pnpm test` |
| The full suite, with builds and end-to-end tests | `pnpm test:all` |
| Frontmatter, template headings, and links in the docs | `pnpm check:docs` |
| Generated blocks match the tokens | `pnpm sync:docs --check` |

CI runs `pnpm test:all` on every push and pull request (REQ-074). Pull requests use the template that carries the docs-sync checklist (REQ-075).

## Open items

Not applicable.

## Changelog

- 0.1.0 — First draft: the spec-first flow, how to write an ADR, and the rules every change follows (T11.2, REQ-073) — awaiting owner approval
- 0.1.0 — Approved as stable by the owner — ADR-0044
