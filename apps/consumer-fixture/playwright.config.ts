// T5.2: Playwright runs against the built Nuxt SSR server (ER-03), so the smoke tests see the server-rendered CSS.
// `pnpm build:fixture` must run first; `pnpm test:all` does that.
import { defineConfig } from '@playwright/test'

const port = 3100

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'node .output/server/index.mjs',
    url: `http://localhost:${port}`,
    env: { PORT: String(port), NITRO_PORT: String(port) },
    reuseExistingServer: false,
  },
  use: { baseURL: `http://localhost:${port}` },
})
