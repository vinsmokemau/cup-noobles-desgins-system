---
'@vinsmokemau/cup-noobles-email': minor
---

Add the reference email layout, `src/layouts/reference.mjml`, which composes the six components and compiles to `dist/reference.html`, and document it with its plain-text counterpart in `email-layouts.md`. The build expands `<mj-include>` and accepts `$cn(a*b)`, and the header takes its logo clear space from the logo tokens.
