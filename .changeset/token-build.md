---
'@vinsmokemau/cup-noobles-tokens': minor
---

Add the token build (`pnpm --filter @vinsmokemau/cup-noobles-tokens build`). It writes `dist/css/tokens.css` (`--cn-*` custom properties with resolved values), `dist/json/tokens.flat.json` (resolved values keyed by token path, with CSS variable, type, tier, status, and description), `dist/ts/tokens.ts` (typed constants), and `dist/email/email-tokens.json` (email-safe literals). The outputs are deterministic and import nothing.
