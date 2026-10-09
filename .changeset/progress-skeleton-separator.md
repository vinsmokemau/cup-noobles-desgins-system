---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the progress bar, the skeleton, and the separator (T7.6, REQ-020, REQ-029). The tokens package gains the component tokens `progress.*`, `skeleton.*`, and `separator.*`, and the shape tokens `border.width.progress`, `border.width.skeleton`, `border.width.separator`, and `radius.skeleton`. The Nuxt layer themes `UProgress`, `USkeleton`, and `USeparator`: a progress bar is a black track with a neutral outline and a pink fill, a skeleton is an outlined shape that fades slowly, and a separator is a neutral line. The skeleton fade and the indeterminate progress movement stop under reduced motion. The outline color, the stroke widths, the skeleton radius, and the fade duration still follow ADR-0006 placeholders (TBD-05, TBD-10, TBD-11, TBD-14).
