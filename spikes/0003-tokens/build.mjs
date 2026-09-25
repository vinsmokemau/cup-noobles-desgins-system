// Builds tokens/**/*.json (DTCG) into the four REQ-013 outputs.
// Usage: node build.mjs <outDir> [--reverse-sources]  (the flag exists only to prove order independence)
import StyleDictionary from 'style-dictionary'

const outDir = process.argv[2] ?? 'dist'
const sources = ['tokens/primitive/**/*.json', 'tokens/semantic/**/*.json', 'tokens/component/**/*.json']
if (process.argv.includes('--reverse-sources')) sources.reverse()
const HEADER = '/**\n * Do not edit directly, this file was auto-generated.\n */\n\n'

const dotPath = token => token.path.join('.')
// Explicit sort so output order never depends on file discovery order.
const sorted = dictionary => [...dictionary.allTokens].sort((a, b) => (dotPath(a) < dotPath(b) ? -1 : 1))
const assertResolved = token => {
  const v = String(token.$value)
  if (v.includes('{') || v.includes('var(')) throw new Error(`${dotPath(token)} is not resolved: ${v}`)
}

// Resolved values keyed by DTCG path, with the metadata the /tokens explorer needs (REQ-053).
StyleDictionary.registerFormat({
  name: 'cn/json-flat',
  format: ({ dictionary }) => {
    const out = {}
    for (const t of sorted(dictionary)) {
      assertResolved(t)
      out[dotPath(t)] = {
        value: t.$value,
        type: t.$type,
        cssVar: `--${t.name}`,
        status: t.$extensions?.cn?.status ?? null,
        description: t.$description ?? null
      }
    }
    return JSON.stringify(out, null, 2) + '\n'
  }
})

// Typed constants keyed by DTCG path.
StyleDictionary.registerFormat({
  name: 'cn/ts-constants',
  format: ({ dictionary }) => {
    const lines = sorted(dictionary).map(t => {
      assertResolved(t)
      return `  ${JSON.stringify(dotPath(t))}: ${JSON.stringify(t.$value)},`
    })
    return `${HEADER}export const tokens = {\n${lines.join('\n')}\n} as const\n\nexport type TokenPath = keyof typeof tokens\n`
  }
})

// Email-safe: DTCG path -> literal value. No references, no var() (REQ-013 AC1, §4.9 $cn(...) lookup).
StyleDictionary.registerFormat({
  name: 'cn/json-email',
  format: ({ dictionary }) => {
    const out = {}
    for (const t of sorted(dictionary)) {
      assertResolved(t)
      out[dotPath(t)] = t.$value
    }
    return JSON.stringify(out, null, 2) + '\n'
  }
})

const sd = new StyleDictionary({
  source: sources,
  usesDtcg: true,
  log: { verbosity: 'silent', warnings: 'error' },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'cn',
      buildPath: `${outDir}/css/`,
      files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: false, sort: 'name' } }]
    },
    json: {
      transformGroup: 'css',
      prefix: 'cn',
      buildPath: `${outDir}/json/`,
      files: [{ destination: 'tokens.flat.json', format: 'cn/json-flat' }]
    },
    ts: {
      transformGroup: 'css',
      prefix: 'cn',
      buildPath: `${outDir}/ts/`,
      files: [{ destination: 'tokens.ts', format: 'cn/ts-constants' }]
    },
    email: {
      transformGroup: 'css',
      prefix: 'cn',
      buildPath: `${outDir}/email/`,
      files: [{ destination: 'email-tokens.json', format: 'cn/json-email' }]
    }
  }
})

await sd.buildAllPlatforms()
