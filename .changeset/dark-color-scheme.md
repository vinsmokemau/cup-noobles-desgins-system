---
'@vinsmokemau/cup-noobles-nuxt': patch
---

Tell the browser the page is dark. The layer sets `color-scheme: dark`, as a `<meta>` tag and a CSS rule on `:root`, so scrollbars and form controls draw dark, and a `theme-color` meta tag with the pure-black page base, read from the `color.bg.base` token at build time. Nuxt UI sets neither when its color mode is off, so an app that extends the layer gets both with no config. No token changes.
