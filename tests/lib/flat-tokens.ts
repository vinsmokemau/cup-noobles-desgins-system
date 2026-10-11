// The resolved tokens (tokens.flat.json) from a token build into a temporary directory. `pnpm test` runs before
// `pnpm build:tokens`, and packages/tokens/dist is git-ignored, so a test cannot read the dist file: on a fresh checkout
// (CI) it does not exist yet. scripts/sync-docs.ts does the same.
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from '../../packages/tokens/build'

export async function flatTokens<T>(): Promise<Record<string, T>> {
  const out = mkdtempSync(join(tmpdir(), 'cn-flat-tokens-'))
  try {
    await build(out)
    return JSON.parse(readFileSync(join(out, 'json/tokens.flat.json'), 'utf8')) as Record<string, T>
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
}
