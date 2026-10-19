---
title: "ADR-0056: Thumbnails use a 4:3 frame and are never cropped"
slug: adr-0056-thumbnail-frame-4x3-contain
layer: adr
status: stable
lang: en
brandRules: [BR-12]
tbd: [TBD-20]
related: [imagery-and-motifs, media-card, adr-0053-card-surface-pure-black, adr-0045-stay-on-0x-until-all-tbd-closed]
since: 0.1.0
updated: 2026-10-18
---

# ADR-0056: Thumbnails use a 4:3 frame and are never cropped

## Context

TBD-20 left the photography and thumbnail standards open: what images show, their style, and their aspect ratios and crops. It is the same open item as decision D11 in the e-commerce plan. The featured media card (BR-12) has a thumbnail with no declared ratio. The owner has not supplied photography, so the comparison page used grey stand-in pictures, only to show shape and crops. It compared three frames on four media cards each (a horizontal photo, a trading card, a square box, and the fallback card with the brand d20): wide 16:9 with a cover crop, square 1:1 with a cover crop, and a 4:3 frame that shows the whole picture. The page marked the 4:3 frame as the recommendation.

## Decision

The owner chose **a 4:3 frame that shows the whole picture** in chat on 2026-10-18 ("C"). The thumbnail frame is 4:3, and the picture is scaled to fit inside it, never cropped (`object-fit: contain`). Any space around the picture is black, the colour of the card (ADR-0053). The frame is the same at every screen width.

Computed with this frame: 100% of every picture stays visible (a 3:2 photo, a 5:7 trading card, and a square box), and the picture is 242 px tall on a 360 px phone (a 322 px wide picture, after the page margins and the 3 px outline).

The proposed written standards were **not answered by the owner and are not approved**. They stay a proposal and are listed under Consequences.

## Consequences

- The frame ratio and the crop rule of TBD-20 are decided. TBD-20 as a whole stays open until the owner decides the written standards below, so the TBD-20 row and callouts stay open.
- `media-card.md` and `imagery-and-motifs.md` change in a later task, not in this ADR: a 4:3 frame with the whole picture shown, and the TBD-20 callouts shortened to what is still open. `pnpm check:tbd` still counts TBD-20 as open.
- A picture with a bright background shows as a visible rectangle inside the black frame. The standards below ask for plain or dark backgrounds for that reason.
- Proposed written standards, awaiting owner approval:
  - One clear, well-lit subject on a plain or dark background.
  - No text inside the image, because baked-in words cannot be translated or read by assistive technology.
  - Source at least twice the displayed width, so the picture stays sharp on high-density screens.
  - Alt text says what the image shows, or the thumbnail is marked decorative when the title already says it all (REQ-025 AC2).
  - A missing picture shows the brand d20 on black, marked decorative, and never a broken-image icon.
  - The picture is never cropped (this ADR), so its edges must hold nothing important.
- No photo style (a colour grade, a filter, or a treatment) is defined. The owner has not supplied one, and it is not invented here.
