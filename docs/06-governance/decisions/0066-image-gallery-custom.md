---
title: "ADR-0066: The image gallery is a custom component over UCarousel"
slug: adr-0066-image-gallery-custom
layer: adr
status: stable
lang: en
brandRules: [BR-03, BR-13]
tbd: []
related: [adr-0001-nuxt-ui-spike, adr-0056-thumbnail-frame-4x3-contain, adr-0057-photo-standards-approved, image-gallery, media-card]
since: 1.2.0
updated: 2026-11-01
---

# ADR-0066: The image gallery is a custom component over UCarousel

## Context

The e-commerce repository asked for a gallery of pictures for its product gallery (DSR-03). C-01 and ER-01 say a themed Nuxt UI component comes first, and a custom `Cn*` component exists only where the Nuxt UI component cannot serve. T15.3 asked to start from Nuxt UI's carousel and to keep the 4:3 whole-picture frame and the d20 fallback (ADR-0056, ADR-0057).

The check read `UCarousel` of the pinned `@nuxt/ui` 4.11.2 (ADR-0001). It gives the sliding, the swipe, the arrow keys, and a focusable `role="region"` root. It cannot serve alone, for four reasons:

- **The fallback.** Its slides are bare slots with no picture of their own. A picture that fails to load shows the browser's broken-image icon, which ADR-0057 forbids. The fallback needs a handler on each picture, as `CnMediaCard` has.
- **The dots.** They are `size-3` (12 px) with no larger target, under the 24 × 24 px minimum of REQ-028 AC2. They also take their names from Nuxt UI's locale ("Go to slide 2"), with no prop to set them, and A-11 says every string arrives through props.
- **The arrows.** They sit at `sm:-start-12`, outside the frame, which pushes them past the edge of the page at 360 and 768 px (REQ-028 AC1). Their default names are English too, although a prop can replace those.
- **The empty and single cases.** A carousel with no items still renders its frame, and one with a single item still renders controls that cannot move.

## Decision

1. **`CnImageGallery` is a custom component that composes `UCarousel`.** It keeps the Nuxt UI carousel for the sliding, the swipe, and the arrow keys (C-01, REQ-020 AC2). The layer themes `UCarousel` through `ui.carousel`: a thick pink frame, a focus ring on its root, and no gutter between slides.
2. **It draws its own picture, arrows, and dots.** The picture sits in a 4:3 frame, scaled to fit, never cropped (ADR-0056). A missing or failed picture shows the d20 on black, marked decorative (ADR-0057). The arrows are ghost `UButton`s inside the layout, and the dots are 24 px buttons.
3. **It holds no copy.** The name of the gallery, the names of the controls, the name of each dot, the announcement of the position, and the alternative text of each picture arrive through props (A-11). Each picture needs `alt`, or `decorative`, as the thumbnail of the media card does (REQ-025 AC2).
4. **It implements no primitive.** The carousel is Nuxt UI's. The arrows and dots are plain buttons, with no role of their own, so ER-01 and REQ-020 AC3 do not apply.
5. **It adds no brand value.** Every color, the stroke, the radius, and the focus ring are component tokens that reference existing semantic tokens (REQ-010 AC2). The dot is one step of the spacing scale, `space.lg` (ADR-0049). The slide movement is Embla's, and it is switched off under `prefers-reduced-motion` (REQ-029 AC2). No motion value is added.

## Consequences

- A new doc, `docs/02-components/molecules/image-gallery.md`, with `source: custom` and a "Why custom" paragraph. SPEC 1.55 lists it (owner approved in chat).
- New component tokens `imageGallery.*`, `radius.imageGallery`, and `border.width.imageGallery`, all `stable`, all referencing semantic tokens. No TBD item is opened.
- The layer's `ui.carousel` theme applies to any `UCarousel` in a consuming app, which gets the pink frame and no gutter.
- If a later Nuxt UI release names its dots through props, enlarges their target, and handles a failed picture, this component is reviewed for replacement (C-01).
