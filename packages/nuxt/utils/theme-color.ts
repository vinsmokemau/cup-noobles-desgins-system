// T15.5 (DSR-06, A-02, BR-03): Nuxt UI sets no `theme-color` meta and no `color-scheme` in an app that turns its color
// mode off, so the layer adds both. The browser chrome should be the pure-black base, so the `theme-color` value is read
// from the built token CSS (`--cn-color-bg-base`) at build time, and no color is written here.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const TOKEN = '--cn-color-bg-base'

// The value of one `--name: value;` declaration in the token CSS.
export function readTokenValue(css: string, name: string): string {
  const match = css.match(new RegExp(String.raw`${name}\s*:\s*([^;]+);`))
  if (!match) throw new Error(`The token CSS has no ${name}. Run \`pnpm build:tokens\`.`)
  return match[1]!.trim()
}

type Head = { meta?: unknown[] }

// Appends the two meta tags to a head config.
export function addThemeMeta(head: Head, css: string) {
  head.meta = [
    ...(head.meta ?? []),
    { name: 'color-scheme', content: 'dark' },
    { name: 'theme-color', content: readTokenValue(css, TOKEN) },
  ]
}

// A Nuxt module that adds the meta tags to every page's <head>. `color-scheme: dark` itself is in assets/css/main.css.
export function themeColorModule(_options: unknown, nuxt: { options: { app: { head: Head } } }) {
  const path = createRequire(import.meta.url).resolve('@vinsmokemau/cup-noobles-tokens/tokens.css')
  addThemeMeta(nuxt.options.app.head, readFileSync(path, 'utf8'))
}
