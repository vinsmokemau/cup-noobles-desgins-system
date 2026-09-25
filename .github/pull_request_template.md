<!-- markdownlint-disable-file MD041 -- the PR title is the H1, so the body starts at H2. -->

## Summary

<!-- The SPEC.md §6 task ID, and what changed. -->

## Docs sync checklist

Docs and code change together (REQ-075). Tick each item, or write "n/a" and why.

- [ ] Every doc in `docs/` or `DESIGN.md` that describes the changed tokens, components, patterns, or emails is updated in this PR.
- [ ] Generated blocks are regenerated with `pnpm sync:docs`, and `pnpm sync:docs --check` reports no drift.
- [ ] The `status` field in the frontmatter of every touched doc is correct (SPEC.md §4.3).
- [ ] New unknowns are registered as TBD items, and no brand value was added without a source (SPEC.md §2.1, an ADR, or the owner).
- [ ] If public API, tokens, or docs changed, a changeset file exists in `.changeset/` (SPEC.md §4.8).
- [ ] `pnpm test:all` passes locally.
