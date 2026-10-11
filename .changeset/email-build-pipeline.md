---
'@vinsmokemau/cup-noobles-email': minor
---

Add the email build (`pnpm --filter @vinsmokemau/cup-noobles-email build`). It compiles the MJML sources in `src/` to `dist/<name>.html`: `$cn(token.path)` is replaced with the token literal (a `rem` dimension is written as px, ADR-0040), `{{ slot_name }}` is left untouched, and the build fails on a hex literal in a source, an unknown token, a `var()`, a stylesheet link, a script, a backend template tag, a hex value that is not a token value, or an MJML default in the output. `pnpm lint:email` runs the source rule alone.
