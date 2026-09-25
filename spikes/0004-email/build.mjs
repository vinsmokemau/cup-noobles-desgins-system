// Compiles src/*.mjml to static HTML: $cn(path) -> literal from email-tokens.json, then MJML.
// Usage: node build.mjs <outDir>
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import mjml2html from 'mjml'

// fonts: {} stops MJML from adding its default Google Fonts <link> tags (REQ-041 AC2).
export const MJML_OPTIONS = { validationLevel: 'strict', fonts: {} }

// Token injection runs on the MJML source, before MJML sees it (§4.9). Unknown paths fail the build.
export const injectTokens = (source, tokens) =>
  source.replace(/\$cn\(([^)]*)\)/g, (_, path) => {
    const key = path.trim()
    if (!Object.hasOwn(tokens, key)) throw new Error(`Unknown token in $cn(${path})`)
    return tokens[key]
  })

export const compile = async (source, tokens, options = MJML_OPTIONS) => {
  const { html, errors } = await mjml2html(injectTokens(source, tokens), options)
  if (errors.length) throw new Error(errors.map(e => e.formattedMessage).join('\n'))
  return html
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const outDir = process.argv[2] ?? 'dist'
  const tokens = JSON.parse(readFileSync('email-tokens.json', 'utf8'))
  mkdirSync(outDir, { recursive: true })
  for (const file of readdirSync('src').filter(f => f.endsWith('.mjml')).sort()) {
    const html = await compile(readFileSync(`src/${file}`, 'utf8'), tokens)
    writeFileSync(`${outDir}/${basename(file, '.mjml')}.html`, html)
  }
}
