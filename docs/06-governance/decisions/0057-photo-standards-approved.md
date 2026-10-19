---
title: "ADR-0057: Photo and thumbnail written standards approved"
slug: adr-0057-photo-standards-approved
layer: adr
status: stable
lang: en
brandRules: [BR-12]
tbd: []
related: [imagery-and-motifs, media-card, adr-0056-thumbnail-frame-4x3-contain, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0057: Photo and thumbnail written standards approved

## Context

ADR-0056 recorded the thumbnail frame (4:3, never cropped) and left the proposed written standards awaiting owner approval, because the owner had answered only the letter. The owner has now reviewed the standards.

## Decision

The owner approved the proposed written standards in chat on 2026-10-18 ("Yes I approved the standards we review"). With ADR-0056, this decides TBD-20. The approved standards are:

- Photography shows one clear, well-lit subject on a plain or dark background.
- No text inside the image, because baked-in words cannot be translated or read by assistive technology. The title and tag carry the text.
- The source image is at least twice the displayed width, so it stays sharp on high-density screens.
- Alt text says what the image shows, or the thumbnail is marked decorative when the title already says it all (REQ-025 AC2).
- A missing picture shows the brand d20 on black, marked decorative, and never a broken-image icon.
- The picture is never cropped (ADR-0056), so its edges must hold nothing important.
- No photo style (a colour grade, a filter, or a treatment) is defined. The owner has not supplied one, and none is invented.

These standards are the owner's choice for an open item. They are not brand values from the brand context.

## Consequences

- TBD-20 is decided, through ADR-0056 and this ADR.
- The SPEC.md §2.4 row for TBD-20, the TBD-20 callouts in `imagery-and-motifs.md`, `media-card.md`, and `inventory.md`, and the thumbnail rules in those docs change in a later task, not in this ADR. Until then `pnpm check:tbd` still counts TBD-20 as open.
- A photo style stays undefined. If the owner supplies one later, it needs its own decision and ADR.
- With this ADR every item in the TBD register has a decision recorded. The register itself, the docs, and the tokens still need the later tasks before `pnpm check:tbd` reports zero open items.
