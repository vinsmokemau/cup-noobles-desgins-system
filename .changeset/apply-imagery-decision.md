---
'@vinsmokemau/cup-noobles-nuxt': minor
---

Apply the imagery decision. The thumbnail of `CnMediaCard` is a 4:3 frame at every width, and the picture is scaled to fit inside it and never cropped (ADR-0056). A card with no picture, or whose picture fails to load, shows the brand golden d20 on black, marked decorative, and never a broken-image icon (ADR-0057). The photography and thumbnail standards are written in `imagery-and-motifs.md` and `media-card.md`: one clear subject on a plain or dark background, no text inside the image, a source at least twice the displayed width, and no photo style.

The media card and imagery and motifs docs are stable.
