---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-email': minor
---

Add `CnKeyValueList`, a list of attributes, each a label and a value, as a description list (`<dl>`). It stacks each label over its value at 360 px and puts them side by side from the `md` breakpoint. It holds no text of its own, takes its rows from `items`, and has a `value` slot to draw a value another way. A list with no rows renders nothing. New component tokens `keyValueList.*` reference existing semantic tokens only.
