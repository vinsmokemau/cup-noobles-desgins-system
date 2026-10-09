---
'@vinsmokemau/cup-noobles-nuxt': patch
---

Map Nuxt UI's raised-surface roles (`--ui-bg-muted`, `--ui-bg-elevated`, `--ui-bg-accented`) to `--cn-color-bg-base`. The neutral scale is one placeholder color (TBD-05), so those roles painted a light slate under white text, a 2.63:1 contrast failure that the new axe route matrix found. Surfaces sit on the black base until OD-05 is decided (C-05).

Also in this change, with no package effect: the showcase's end-to-end, accessibility, and visual harness (Playwright projects at 360, 768, and 1280 px, the `expectNoA11yViolations` helper, a route matrix, a reduced-motion project, and the `toHaveScreenshot` setup with `pnpm test:visual:update`), and the showcase fixes it forced (page language, home and 404 titles, a focusable scrolling table wrapper, and the on-page table of contents overflow). The axe gate in `accessibility.md` is updated.
