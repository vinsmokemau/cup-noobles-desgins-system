---
title: "ADR-0064: Text printed on a product may show in a photo"
slug: adr-0064-packaging-text-in-photos
layer: adr
status: stable
lang: en
brandRules: [BR-12]
tbd: []
related: [adr-0057-photo-standards-approved, adr-0056-thumbnail-frame-4x3-contain, imagery-and-motifs, media-card]
since: 0.1.0
updated: 2026-11-01
---

# ADR-0064: Text printed on a product may show in a photo

## Context

ADR-0057 approved the photo standard "no text inside the image", because baked-in words cannot be translated or read by assistive technology. The e-commerce repository asked whether that rule covers the words printed on the packaging of a real product, which its photos show (DSR-07). The rule was written for banners and graphics and did not mention packaging. The owner saw three options on a comparison page: keep the rule as written (A), allow the product's own printing and ban added text (B), or drop the rule (C).

## Decision

The owner chose **B** in chat on 2026-11-01. This is the owner's choice for an open item, not a brand value.

1. **Text you add to a photo is not allowed.** That includes banners, price stickers, flashes such as "NEW", watermarks, and captions.
2. **Text printed on the product itself may show**, such as its box or label, because it is part of the thing being sold.
3. **The words that matter live outside the picture.** The title, the tag, and the alt text carry the text, so no one needs the picture to read it.
4. The rest of ADR-0057 and ADR-0056 stands: one clear subject on a plain or dark background, a source at least twice the displayed width, the 4:3 frame, no crop.

Proposed wording for the docs: "Put no text you add inside the image. Words printed on the product itself, such as its box or label, may show. The title, the tag, and the alt text carry the text, so no one needs the picture to read it."

## Consequences

- This amends the second bullet of ADR-0057. ADR-0057 stays as the record of what was approved on 2026-10-18.
- "Added text" is a judgment made when a photo is uploaded. A test cannot detect it.
- The wording in `imagery-and-motifs.md` and `media-card.md` changes in a later task, not in this ADR. Until then those docs still say "no text inside the image".
- SPEC.md OD-15 is decided by this ADR.
- The e-commerce repository is told of the ruling (DSR-07).
