// T5.2: Playwright runs against the built Nuxt SSR server (ER-03), so the smoke tests see the server-rendered CSS.
// `pnpm build:fixture` must run first; `pnpm test:all` does that.
import { defineConfig } from '@playwright/test'

const port = 3100
// T15.5: the same fixture built with the workspace layer in front of the installed one (`nuxt build --extends`), so a
// change to the layer is tested before it is published. The installed layer (REQ-071 AC2) is the build on `port`.
const workspacePort = 3101

export default defineConfig({
  testDir: './tests/e2e',
  webServer: [
    {
      command: 'node .output/server/index.mjs',
      url: `http://localhost:${port}`,
      env: { PORT: String(port), NITRO_PORT: String(port) },
      reuseExistingServer: false,
    },
    {
      command: 'node .output-workspace/server/index.mjs',
      url: `http://localhost:${workspacePort}`,
      env: { PORT: String(workspacePort), NITRO_PORT: String(workspacePort) },
      reuseExistingServer: false,
    },
  ],
  use: { baseURL: `http://localhost:${port}` },
})
