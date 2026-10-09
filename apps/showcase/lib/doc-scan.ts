// T5.4 (REQ-051 AC2): reads docs/ from disk and gives every doc its route. This is build-time code (Node's fs), so the
// pages never import it; the pure route logic they share with it is in doc-routes.ts.
import { readdirSync, readFileSync } from 'node:fs'
import { tableBlockPrefixes } from './doc-blocks'
import { docRoute, type DocEntry } from './doc-routes'
import { frontmatterValue, type DocMeta } from './home'

function* markdownFiles(dir: string, prefix = ''): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) yield* markdownFiles(`${dir}/${entry.name}`, relative)
    else if (entry.name.endsWith('.md') && entry.name !== '_template.md') yield relative
  }
}

const slugOf = (markdown: string): string | undefined => {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown)?.[1]
  return frontmatter ? /^slug:\s*(\S+)\s*$/m.exec(frontmatter)?.[1] : undefined
}

/** T6.5: the layer and status of every doc, from its frontmatter, for the home page's component count and layer cards. */
export function scanDocMeta(docsDir: string): DocMeta[] {
  return [...markdownFiles(docsDir)].sort().map((file) => {
    const markdown = readFileSync(`${docsDir}/${file}`, 'utf8')
    const layer = frontmatterValue(markdown, 'layer')
    const status = frontmatterValue(markdown, 'status')
    return { file, ...(layer ? { layer } : {}), ...(status ? { status } : {}) }
  })
}

/**
 * T6.3: the token prefixes of the `table` blocks of every foundation doc, by file (`01-foundations/motion.md` ->
 * `['motion']`). Docs with no such block are left out. The pages read this to pick the previews for a doc.
 */
export function scanPreviewBlocks(docsDir: string): Record<string, string[]> {
  const blocks: Record<string, string[]> = {}
  for (const file of markdownFiles(docsDir)) {
    if (!file.startsWith('01-foundations/')) continue
    const prefixes = tableBlockPrefixes(readFileSync(`${docsDir}/${file}`, 'utf8'))
    if (prefixes.length > 0) blocks[file] = prefixes
  }
  return blocks
}

/** Every doc under `docsDir` except `_template.md`, in path order. Throws if two docs share a route. */
export function scanDocs(docsDir: string): DocEntry[] {
  const entries = [...markdownFiles(docsDir)].sort().map((file): DocEntry => {
    const slug = slugOf(readFileSync(`${docsDir}/${file}`, 'utf8'))
    return { file, path: `/${file.replace(/\.md$/, '')}`, route: docRoute(file, slug) }
  })
  const seen = new Map<string, string>()
  for (const entry of entries) {
    const other = seen.get(entry.route)
    if (other) throw new Error(`docs/${other} and docs/${entry.file} both have the route ${entry.route}`)
    seen.set(entry.route, entry.file)
  }
  return entries
}
