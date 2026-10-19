---
title: "ADR-0060: The draft component docs are approved"
slug: adr-0060-component-docs-approved
layer: adr
status: stable
lang: en
brandRules: [BR-10, BR-11, BR-12, BR-13]
tbd: []
related: [adr-0045-stay-on-0x-until-all-tbd-closed, adr-0059-color-and-accessibility-docs-approved, adr-0051-neon-glow-neon-tube, adr-0054-elevation-outline-only, adr-0055-brand-shades-minimal-derived, adr-0006-placeholder-values]
since: 0.1.0
updated: 2026-10-19
---

# ADR-0060: The draft component docs are approved

## Context

ADR-0045 kept the system on 0.x until the TBD register was closed. It is closed (0 open items). The 1.0.0 readiness review of 2026-10-19 found that the gate (`pnpm release:check`) passes, but 17 of the 29 component docs were still `draft` and carried `> **Draft:**` callouts, and ADR-0000 to ADR-0006 were still `draft`. Some of those callouts held points that no ADR had decided. The owner chose option B on the review page, which was to settle these before releasing 1.0.0, and then answered seven questions on a comparison page. Each question showed the choice on the brand colors, and the page marked A as the recommendation for questions 1 to 6 and B for question 7.

## Decision

The owner answered **1A 2A 3A 4A 5A 6A 7B** in chat on 2026-10-19:

| # | Question | Answer |
|---|---|---|
| 1 | A pressed button | **A.** The fill takes the darker pink (`color.brand.primaryActive`, or the yellow or ghost equivalent) and the glow stays at hover strength (ADR-0051, ADR-0055). |
| 2 | A disabled or loading button | **A.** A disabled button has no glow and keeps Nuxt UI's own dimming. A loading button keeps its look and its glow. Disabled links and fields keep following the library. |
| 3 | The hover and pressed pinks on links, breadcrumbs, and pagination | **A.** Approved as T13.2 applied them: the lighter pink on hover and the darker pink pressed (ADR-0055). |
| 4 | The backdrop behind a modal or a slideover | **A.** It stays pure black at 85% (ADR-0054). The docs say not to rely on the page behind for context. |
| 5 | A toast while a dialog is open | **A.** The toaster stays bottom-right. The docs add a rule: never open a toast while a modal or a slideover is open. |
| 6 | The `aria-hidden-focus` warning on an open select list | **A.** Accepted as a known limit of the library, written in the `select.md` Accessibility section. |
| 7 | Statuses | **B.** The 17 component docs become `stable`. ADR-0000 to ADR-0005 become `stable`, and ADR-0006 becomes `deprecated`. |

None of these is a brand value from the brand context. They are the owner's choices for open items, and they match what the code already does, so no token, style, or component changes.

The 17 docs are button, checkbox, input, link, radio group, select, skeleton, switch, textarea, alert, breadcrumb, card, pagination, toast, tooltip, modal, and slideover. Their `> **Draft:**` callouts are removed. The Open items section of each says "Not applicable".

ADR-0006 lists the placeholder values that stood in for the TBD items. Every one of them has been replaced, so the ADR is `deprecated`. It stays in the decision log as history.

## Consequences

- No doc under `docs/` is `draft` or `tbd`. The only doc that is not `stable` is ADR-0006, which is `deprecated`.
- The showcase shows its status banner on ADR-0006 and on no other doc. The end-to-end test that checks the banner uses that ADR.
- The release gate (REQ-018) has nothing left to wait for. The 1.0.0 release is a separate task that needs its own ADR and the owner's confirmation of each step (push, merge).
- If the owner later wants a calmer pressed glow, a grey disabled look, a lighter backdrop, or toasts at the top, each needs a new ADR, a code change, and new visual baselines.
