// Rewrites the in-memory copy that Nuxt Content parses. The .md file on disk is never touched,
// so raw Markdown keeps the plain table (REQ-008) and only the showcase sees the component.
const BLOCK = /<!--\s*cn:generated\s+([^>]*?)\s*-->\r?\n([\s\S]*?)<!--\s*\/cn:generated\s*-->/g
const ATTR = /(\w+)="([^"]*)"/g

export function interceptGeneratedBlocks(body: string): string {
  return body.replace(BLOCK, (_match, rawAttrs: string, inner: string) => {
    const attrs = [...rawAttrs.matchAll(ATTR)].map(([, key, value]) => `${key}="${value}"`).join(' ')
    // The original table stays as the default slot, so the component can fall back to it.
    return `::cn-generated{${attrs}}\n${inner.trimEnd()}\n::\n`
  })
}
