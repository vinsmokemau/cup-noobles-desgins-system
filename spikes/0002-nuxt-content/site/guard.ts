import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { parse } from 'yaml'
import { frontmatter } from './schema'

const FRONTMATTER = /^---\n([\s\S]*?)\n---(\n|$)/

// Validates every doc's frontmatter straight from disk. It cannot live in a Content hook:
// Content 3.16.1 caches parsed files by checksum and skips the hooks on a cache hit.
export function validateDocs(dir: string): string[] {
  const names = readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter(name => name.endsWith('.md') && basename(name) !== '_template.md')
  return names.flatMap((name) => {
    const raw = readFileSync(join(dir, name), 'utf8')
    // A BOM hides the frontmatter from Content, so the doc would render with no metadata.
    if (raw.charCodeAt(0) === 0xFEFF) return [`${name}: starts with a UTF-8 BOM`]
    const match = FRONTMATTER.exec(raw.replace(/\r\n/g, '\n'))
    if (!match) return [`${name}: no frontmatter block`]
    const result = frontmatter.safeParse(parse(match[1]))
    if (result.success) return []
    return [`${name}: ${result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`]
  })
}
