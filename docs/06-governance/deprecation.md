---
title: Deprecation
slug: deprecation
layer: governance
status: draft
lang: en
tbd: []
related: [versioning-and-releases, contribution, ownership, decision-log]
since: 0.1.0
updated: 2026-10-11
---

# Deprecation

## Purpose

This doc says how a token, a component, or a prop is retired. A consumer gets a clear warning and at least one minor release to move before anything is removed, so a removal is never a surprise (REQ-072).

## Policy and process

### The policy

A deprecated token, component, or prop (REQ-072 AC1):

- Is marked `deprecated`.
- Emits a console warning in development, for components and props. It never warns in production.
- Survives at least one minor release before it is removed.
- Is removed only in a major release.

Every breaking change, including a removal, has a migration note in `CHANGELOG.md` (REQ-072 AC2).

### How each kind is marked

| Kind | How it is marked as deprecated |
|---|---|
| Token | `$extensions.cn.status` is `deprecated`. A `deprecated` token has no `tbd` field (SPEC.md §4.4). |
| Component | The component's doc has `status: deprecated`, and the component emits the development-only warning. |
| Prop | The component emits the development-only warning when the prop is used, and the component doc says so. |
| Doc | `status: deprecated` in its frontmatter. The showcase shows a status banner (REQ-057). |

### The steps

1. **Decide.** The owner approves the deprecation, and an ADR records it, with the replacement and the reason.
2. **Mark.** Apply the marks in the table above. Name the replacement in the warning and in the doc.
3. **Announce.** Write a changeset, and list the item under **Deprecated** in `CHANGELOG.md`, with a migration note that says what to use instead.
4. **Wait.** Keep the item working for at least one minor release.
5. **Remove.** Remove the item in a major release. List it under **Breaking** in `CHANGELOG.md`, with the migration note.

### The warning

A deprecation warning names three things: what is deprecated, what replaces it, and the version that will remove it. A helper that emits it, and a test that it stays silent outside development, arrive with T11.3 (REQ-072 AC1).

## Open items

> **Draft:** The marks and the steps above follow REQ-072 and the token statuses in SPEC.md §4.4. The exact wording of the warning and the helper are not built yet (T11.3). The doc stays `draft` until the owner approves it in an ADR.

## Changelog

- 0.1.0 — First draft: the deprecation policy, how each kind is marked, and the steps from decision to removal (T11.2, REQ-072) — awaiting owner approval
