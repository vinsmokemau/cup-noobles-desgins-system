// T5.4 (REQ-051 AC2): reads docs/ from disk and gives every doc its route. This is build-time code (Node's fs), so the
// pages never import it; the pure route logic they share with it is in doc-routes.ts.
import { readdirSync, readFileSync } from 'node:fs'
import { docRoute, type DocEntry } from './doc-routes'

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
