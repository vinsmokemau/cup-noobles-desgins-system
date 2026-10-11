---
title: "ADR-0031: Forms, feedback, and loading patterns"
slug: adr-0031-forms-feedback-loading-patterns
layer: adr
status: stable
lang: en
brandRules: [BR-06, BR-13]
tbd: []
related: [forms, feedback, loading, form-field, alert, toast, modal, skeleton, progress, button]
since: 0.1.0
updated: 2026-10-11
---

# ADR-0031: Forms, feedback, and loading patterns

## Context

The brand context says nothing about how forms, feedback, or loading behave. It asks for a UI that is high-contrast, vibrant, and legible (BR-06) with thick, clean line work (BR-13). T9.1 wrote three pattern docs by composing the component docs and WCAG 2.2, and marked each rule set as a draft because no source approved it (REQ-009 AC1). Its final report asked the owner to approve or amend the rules.

## Decision

The owner approved the rules of the three pattern docs in chat, 2026-10-11 ("approve").

1. **Forms.** One column; a visible label on every field; "Opcional" as a hint on optional fields; validation when the person leaves a field and on submit; a failed submit shows one summary alert with the count, a message under each field, and focus on the first field with an error; the submit is never disabled to prevent errors; the main action is `primary` and comes first.
2. **Feedback.** The kind is chosen by how long the message stays and whether it needs an answer: a toast for a result, an inline alert for one block, a banner (an alert at the top of the page region, with `role="status"`) for the whole page, and a dialog for a decision. The type is told by its icon and title, never by color alone. A toast with an action or a failure stays open until closed.
3. **Loading.** The part is chosen by the wait: a skeleton for content, the `loading` state of a button as the system's spinner (there is no standalone spinner), and a progress bar for a task. A group of skeleton shapes is announced once. Nothing is left loading with no end.
4. **Not decided here.** The feedback colors, the text and neutral colors, the stroke widths, and the motion values stay placeholders (TBD-04, TBD-05, TBD-07, TBD-11, TBD-14).

## Consequences

- `forms.md`, `feedback.md`, and `loading.md` record this ADR as the source of their rules.
- The three docs stay `draft` while their TBD callouts are open: a doc with a TBD callout cannot be `stable` (REQ-037 AC1).
- Changing a rule takes a new ADR that supersedes this one.
