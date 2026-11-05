---
'@vinsmokemau/cup-noobles-tokens': minor
'@vinsmokemau/cup-noobles-nuxt': minor
'@vinsmokemau/cup-noobles-email': minor
---

Add `CnApp`, the root of an app, which gives Nuxt UI's built-in text a Spanish default. Nuxt UI reads the name of the close button of a modal, a slideover, a toast, and an alert (and the rest of its built-in text) from the `locale` prop of `UApp`, and uses English when it is not set. `CnApp` wraps `UApp` with the Nuxt UI `es` locale as the default, and its `locale` prop sets another locale; every other `UApp` prop and the default slot pass through. It holds no text of its own. An app turns it on by replacing `<UApp>` with `<CnApp>` in `app.vue` and `error.vue`; an app that keeps `<UApp>` stays in English. New doc `docs/02-components/organisms/app.md`, ADR-0071, and a new step in `using-the-system.md`. No token changes.
