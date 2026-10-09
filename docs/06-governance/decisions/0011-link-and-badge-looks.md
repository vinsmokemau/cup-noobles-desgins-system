---
title: "ADR-0011: Link and badge looks"
slug: adr-0011-link-and-badge-looks
layer: adr
status: stable
lang: en
brandRules: [BR-01, BR-02, BR-12]
tbd: []
related: [adr-0010-button-variants, link, badge]
since: 0.1.0
updated: 2026-10-09
---

# ADR-0011: Link and badge looks

## Context

The brand context names a tag badge on the featured media card (BR-12) but does not say how a link or a badge looks. T7.3 (Link, Icon, and Badge) built a proposal and marked it `> **Draft:**` in `link.md` and `badge.md` (REQ-009).

The owner compared three complete sets on a visual comparison page, on the pure-black page (BR-03):

- A. The link is pink and underlined, and the tag badge is a solid yellow fill. All label pairs pass contrast, the underline keeps the link from relying on color alone, and the yellow tag stands apart from pink buttons and badges.
- B. The link is yellow and underlined, and the tag badge is a yellow outline. Yellow is also the focus ring, so a focused link would blend into it.
- C. The link is pink with no underline, and the tag badge is a pink fill. A link told apart by color alone fails WCAG 1.4.1, and the tag looks like the primary badge.

The owner chose A in chat on 2026-10-09 (T7.3 session).

## Decision

The link and the badge look like this. The values come from the owner in chat, 2026-10-09.

| Part | Nuxt UI | Look |
|---|---|---|
| Link | `ULink` | Brand pink text (BR-01), always underlined |
| `primary` badge | `color="primary" variant="solid"` | Pink fill, black label |
| `outline` badge | `color="primary" variant="outline"` | Pink label and outline |
| `tag` badge | `color="secondary" variant="solid"` | Yellow fill (BR-02), black label (BR-12) |

1. Labels on pink and yellow fills stay black (SPEC.md §2.1).
2. The hover and pressed colors of the link, and the dimming of a disabled link, are not part of this decision. They stay `> **Draft:**` in `link.md`.

## Consequences

- The `.cn-link` and `.cn-badge*` rules and the link and badge tokens already match this decision, so no code changes.
- The badge radius and stroke width stay placeholders (TBD-10, TBD-11). The link hover and pressed colors stay `derived-pending` (TBD-08).
- The icon set is a separate decision (OD-09) and is not part of this ADR.
- Changing either look takes a new ADR that supersedes this one, and new visual baselines.
