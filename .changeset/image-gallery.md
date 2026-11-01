---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-email': minor
---

Add `CnImageGallery`, a gallery of pictures over Nuxt UI's `UCarousel`. Each picture shows whole in a 4:3 frame, and a picture that is missing or fails to load shows the brand d20. It has previous and next buttons and one 24 px dot for each picture, and it holds no text of its own: the name of the gallery, the names of the controls, and the alternative text of each picture come through props. The slide changes at once under reduced motion. A gallery with no pictures renders nothing, and one picture shows no controls. The layer now themes `UCarousel` with a thick pink frame and no gutter between slides. New component tokens `imageGallery.*`, `radius.imageGallery`, and `border.width.imageGallery` reference existing semantic tokens only.
