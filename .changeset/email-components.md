---
'@vinsmokemau/cup-noobles-email': minor
---

Add the six email components as MJML sources in `src/components/`: button, header with logo, content section, card, divider, and footer. Each compiles to `dist/<name>.html`, reads its values from the same tokens as its web counterpart, and uses `{{ slot_name }}` placeholders. The button draws a solid border in place of the glow. The slots are listed in `email-components.md`.
