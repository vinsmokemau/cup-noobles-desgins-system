// T7.1: the static build of a throwaway docs and demos tree, shared by the specs that build one (docs.spec.ts, demos.spec.ts).
import { mkdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// `nuxt generate` writes into the app folder (.nuxt, the content database) and refuses to run twice at once. `--repeat-each`
// gives each repeat its own worker, so the builds take turns through a lock folder: `mkdir` fails when it exists.
const buildLock = join(tmpdir(), 'cn-showcase-generate.lock')
const staleAfter = 15 * 60_000
export async function withBuildLock<T>(run: () => T): Promise<T> {
  for (;;) {
    try {
      mkdirSync(buildLock)
      break
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      // A lock left by a crashed run would block every later run, so an old one is taken over.
      const age = Date.now() - (statSync(buildLock, { throwIfNoEntry: false })?.mtimeMs ?? Date.now())
      if (age > staleAfter) rmSync(buildLock, { recursive: true, force: true })
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
  try {
    return run()
  } finally {
    rmSync(buildLock, { recursive: true, force: true })
  }
}
