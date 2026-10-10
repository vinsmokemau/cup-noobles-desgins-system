---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add `CnSparkle` and `CnStickerFrame` (T7.8, REQ-029, REQ-021, REQ-022), the decorative motifs of BR-14. Both render with `aria-hidden="true"` and hold no focusable element; the frame is also `inert`, so nothing in its slot can take focus. The motif artwork is not supplied yet (TBD-18), so the sparkle renders an outlined placeholder with the note "Motif pending (TBD-18)", and the frame is a plain outline around its slot that never overflows its container. The sparkle takes an optional `animated` prop that fades it slowly, and the fade stops under reduced motion. The tokens package gains the component tokens `motif.placeholder.*` and the shape tokens `border.width.motif` and `radius.motif`. The outline color, the stroke width, the radius, and the fade duration follow ADR-0006 placeholders (TBD-05, TBD-10, TBD-11, TBD-14).
