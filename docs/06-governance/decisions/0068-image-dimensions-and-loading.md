---
title: "ADR-0068: Image dimensions and loading on the media card and the gallery"
slug: adr-0068-image-dimensions-and-loading
layer: adr
status: stable
lang: en
brandRules: []
tbd: []
related: [media-card, image-gallery, adr-0066-image-gallery-custom]
since: 1.4.0
updated: 2026-11-02
---

# ADR-0068: Image dimensions and loading on the media card and the gallery

## Context

The storefront's /ui-review (DSR-11) found that the `<img>` in `CnMediaCard` and `CnImageGallery` had no `width`, no `height`, and no `loading` attribute. A catalog grid shifted while it loaded, and every picture loaded at once. The storefront adds no markup of its own to design system components, so the layer must fix it. T15.8 left two choices to the owner: the name of the prop that marks a picture as above the fold, and the loading default of the gallery.

## Decision

1. **Every `<img>` carries `width="4"` and `height="3"`**, the 4:3 ratio of the frame (ADR-0056). They are an aspect-ratio hint only: the frame and `object-fit: contain` size the picture, so the look does not change.
2. **`CnMediaCard` loads its picture lazily by default.**
3. **The prop is `priority`** (a boolean, default `false`) on both components. On `CnMediaCard` it loads the picture eagerly with `fetchpriority="high"`.
4. **`CnImageGallery` loads the opening picture eagerly and the others lazily.** With `priority`, the opening picture also gets `fetchpriority="high"`.
5. Alt-or-decorative, the d20 fallback on error (ADR-0057), the absence of copy (A-11), and one focusable element per card do not change.

The owner chose `priority` (option A) and the opening-picture default (option A) in chat on 2026-11-02, after comparing them with `eager`, `loading`, all-lazy, and all-eager.

## Consequences

- A grid reserves its space before the pictures arrive, and the pictures below the fold wait.
- A consumer marks the first row of a catalog with `priority`. A card without it is lazy, even at the top of the page.
- No Web Interface Guidelines rule conflicts with an ADR here. The 4 and 3 are a ratio, not the displayed size, so a consumer's pictures need no matching file size.
- A minor addition to the layer, released in the next lockstep version.
