// T5.3: Playwright runs against the static build in .output/public (REQ-050 AC1). `pnpm build:showcase` must run
// first; `pnpm test:all` does that. The 360, 768, and 1280 px projects and the axe helper arrive in T5.5.
import { defineConfig } from '@playwright/test'

const port = 3200

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'node tests/serve-static.mjs',
    url: `http://localhost:${port}`,
    env: { PORT: String(port) },
    reuseExistingServer: false,
  },
  use: { baseURL: `http://localhost:${port}` },
})
