---
title: "ADR-0025: Sticker frame fit"
slug: adr-0025-sticker-frame-fit
layer: adr
status: stable
lang: en
brandRules: [BR-03, BR-06, BR-13, BR-14]
tbd: []
related: [adr-0024-sticker-border-motif-artwork, sticker-frame, imagery-and-motifs, brand-identity]
since: 0.1.0
updated: 2026-10-10
---

# ADR-0025: Sticker frame fit

## Context

ADR-0024 supplied the sticker border as `Sticker-Border-CN.svg`: a fixed frame of about 8:5 (`viewBox` 1415.74 × 885.87) with an empty centre. Its item 8 says a component that uses it "fits content inside the empty centre and does not stretch the frame to another ratio". Content comes in other shapes, so how `CnStickerFrame` fits it is a design decision. T7.17 showed the owner three options on a visual comparison page, on the real artwork, on the pure-black page (BR-03), around a short text, the supplied ramen cup, and a wide banner:

- **A. Fixed sticker, content centred.** The frame keeps the 8:5 shape and scales as one piece with its width. Content sits in the centre, and what does not fit is clipped at its edge.
- **B. Frame follows the content (stretched edges).** The corners keep their shape and the straight edges stretch. It needs a band thickness nobody has chosen, and it goes against ADR-0024 item 8.
- **C. Fixed sticker, content shrinks to fit.** The frame is as in A, and a script scales oversized content down. It needs script, and text gets small on narrow screens.

The recommendation was A: it adds no new value, needs no script, and keeps the artwork exactly as the owner approved it.

## Decision

The values come from the owner in chat, 2026-10-10.

1. **Fit.** The owner chose **A**, the recommended option.
2. **Shape.** The frame keeps the ratio of the file's `viewBox`, 1415.74 : 885.87. Its width is the width of its container, and a page sets another width through `--sticker-frame-width`, the way `CnSparkle` takes `--sparkle-size`. The frame never grows wider than its container.
3. **Artwork.** `CnStickerFrame` renders `Sticker-Border-CN.svg` unmodified, as an image file, and never inlines, recolours, rotates, or stretches it. It is `aria-hidden` and `inert`, with no label, no role, and no focusable child (REQ-029 AC1).
4. **Content.** The slot content is centred inside the empty centre. Long words break, and content larger than the centre is clipped at its edge, never scrolled.
5. **Geometry is measured, not designed.** The empty centre starts 6.8% in from the left and right edges and 11% in from the top and bottom, because the band is about 96 `viewBox` units thick on every side (measured from the file by rendering it and finding the first drawn pixel from the centre outward). These numbers describe the supplied file. They are not brand values and not tokens. They change only if the artwork changes, which takes a new ADR.
6. **Placeholders removed.** The placeholder outline, the tokens `motif.placeholder.bg`, `motif.placeholder.border`, `border.width.motif`, and `radius.motif`, and their contrast pair are removed. The frame declares no colour, stroke width, radius, or padding of its own, and no replacement value is invented. TBD-05, TBD-10, and TBD-11 are not caused by the frame any more, and it reads none of them.
7. **TBD-18 resolved.** All seven BR-14 motifs have their artwork, and `CnStickerFrame`, the last component that drew a stand-in for it, now renders the file. §2.4 marks TBD-18 `Resolved (ADR-0025)`.
8. **Audit.** The `frontend-design` audit of the choice, run before this record, found no problem to fix. The choice adds no colour, size, or motion. The band is thick and high-contrast at 360 px (BR-13, BR-06), the palette is the brand's (BR-01 to BR-03), and the frame is decorative. The one cost is the clipping of oversized content in option A, which the component doc states in its usage rules.

## Consequences

- `sticker-frame.md` states the artwork, drops every TBD that only the placeholders caused, and becomes `stable`.
- `brand-identity.md` drops TBD-18 and becomes `stable`. `imagery-and-motifs.md` drops TBD-18 and stays `draft` for TBD-20.
- The other six motifs have artwork but no component yet. That is not a TBD: no requirement asks for those components in this phase.
- Choosing B or C later takes a new ADR that supersedes this one.
