---
'@vinsmokemau/cup-noobles-nuxt': minor
---

Add the release tooling (T11.3, REQ-070, REQ-062 AC2, REQ-072 AC1). The three packages are versioned in lockstep with Changesets, and `pnpm version-packages` writes `CHANGELOG.md` with entries grouped as Breaking, Added, Changed, Deprecated, and Fixed (a changeset picks its group with a `Breaking:`, `Added:`, `Changed:`, `Deprecated:`, or `Fixed:` prefix). The showcase renders the file at `/changelog`. The Nuxt layer gains the `warnDeprecated` helper, which a deprecated component or prop calls to warn in development only.
