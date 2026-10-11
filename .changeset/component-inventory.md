---
---

Add the generated component inventory (T8.7, REQ-020 AC1, REQ-022 AC3, REQ-071 AC1). `sync:docs` gains the `inventory` format, which lists every component doc from its frontmatter, and `docs/02-components/inventory.md` is written (draft). The consumer fixture renders every component in the inventory, one page each, and its end-to-end test visits them all at 360 and 1280 px with axe clean, and again while each overlay is open. No package changes.
