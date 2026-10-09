// T6.5 checks: the model behind the home page (REQ-062 AC1). The browser checks are in
// apps/showcase/tests/e2e/home.spec.ts; these run the model on a small fixed doc list, so the rules are pinned.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { parseDesignNav } from '../apps/showcase/lib/design-nav'
import { componentCount, frontmatterValue, layerCards, type DocMeta } from '../apps/showcase/lib/home'

const metas: DocMeta[] = [
  { file: '00-overview/brand-context-source.md' },
  { file: '00-overview/principles.md', layer: 'overview', status: 'draft' },
  { file: '01-foundations/color.md', layer: 'foundation', status: 'draft' },
  { file: '01-foundations/shape.md', layer: 'foundation', status: 'tbd' },
  { file: '02-components/inventory.md', layer: 'overview', status: 'tbd' },
  { file: '02-components/atoms/button.md', layer: 'component', status: 'tbd' },
  { file: '02-components/molecules/card.md', layer: 'component', status: 'tbd' },
]
const nav = parseDesignNav(`# Title

## Overview

- [Principles](docs/00-overview/principles.md): a

## Foundations

- [Color](docs/01-foundations/color.md): a
- [Shape](docs/01-foundations/shape.md): a

## Components

- [Component inventory](docs/02-components/inventory.md): a

### Atoms

- [Button](docs/02-components/atoms/button.md): a
`)

test('frontmatterValue reads a top-level key and nothing else', () => {
  const doc = '---\ntitle: Button\nlayer: component\nstatus: tbd\n---\n\nlayer: not-this\n'
  assert.equal(frontmatterValue(doc, 'layer'), 'component')
  assert.equal(frontmatterValue(doc, 'status'), 'tbd')
  assert.equal(frontmatterValue(doc, 'level'), undefined)
  assert.equal(frontmatterValue('# no frontmatter\nlayer: component\n', 'layer'), undefined)
})

test('componentCount counts only docs whose layer is component', () => {
  assert.equal(componentCount(metas), 2)
})

test('layerCards gives one card per DESIGN.md section with its docs and statuses', () => {
  const cards = layerCards(metas, nav)
  assert.deepEqual(
    cards.map((card) => [card.title, card.to, card.docs, card.statuses]),
    [
      ['Overview', '/overview/principles', 2, { draft: 1 }],
      ['Foundations', '/foundations', 2, { draft: 1, tbd: 1 }],
      ['Components', '/components', 3, { tbd: 3 }],
    ],
  )
})
