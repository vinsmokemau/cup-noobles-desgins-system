// T5.6 (REQ-050 AC3): runs the subpath spec against the deployed site, not the local build. deploy-showcase.yml runs it
// after each deploy. `SHOWCASE_ORIGIN` overrides the origin to check another host.
import { defineConfig } from '@playwright/test'
import { siteOrigin } from './lib/site'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/site.spec.ts',
  retries: 2,
  use: { baseURL: process.env.SHOWCASE_ORIGIN ?? siteOrigin },
})
