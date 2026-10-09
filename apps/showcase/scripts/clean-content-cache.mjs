// T5.3 (ADR-0002 §4): Nuxt Content caches parsed files in .data/ by checksum, so a stale cache can hide a change to
// how files are parsed. `generate` starts from an empty cache.
import { rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

rmSync(fileURLToPath(new URL('../.data', import.meta.url)), { recursive: true, force: true })
