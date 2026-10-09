// Playwright runs against the static build in .output/public (REQ-050 AC1). `pnpm build:showcase` must run first;
// `pnpm test:all` does that.
//
// Projects (T5.5, A-09): the same suite runs at the 3 reference viewports, 360, 768, and 1280 px, in the file kinds below.
//   *.spec.ts     one run, at 1280 px: the behavior checks that do not depend on the width (`functional`)
//   *.matrix.ts   every route at 360, 768, and 1280 px: axe, overflow, landmarks, keyboard (REQ-060, REQ-061)
//   *.reduced.ts  every route with `prefers-reduced-motion: reduce` emulated (REQ-029 AC2)
//   *.visual.ts   screenshot assertions at the 3 widths, in the pinned CI container only (A-12, R-08)
import { defineConfig, devices } from '@playwright/test'
import { siteBase } from './lib/site'

const port = 3200
const widths = [360, 768, 1280] as const
const desktop = devices['Desktop Chrome']
const viewport = (width: number) => ({ ...desktop, viewport: { width, height: 800 } })

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'node tests/serve-static.mjs',
    url: `http://localhost:${port}${siteBase}`,
    env: { PORT: String(port) },
    reuseExistingServer: false,
  },
  use: { baseURL: `http://localhost:${port}` },
  // Baselines live in git, one folder per file kind and one image per width. The path has no platform suffix, because
  // baselines are made in the pinned container only (A-12).
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}{ext}',
  expect: { toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.001 } },
  projects: [
    { name: 'functional', testMatch: '**/*.spec.ts', use: viewport(1280) },
    ...widths.map((width) => ({ name: `w${width}`, testMatch: '**/*.matrix.ts', use: viewport(width) })),
    {
      name: 'reduced-motion',
      testMatch: '**/*.reduced.ts',
      use: { ...viewport(1280), reducedMotion: 'reduce' as const },
    },
    ...widths.map((width) => ({ name: `visual-${width}`, testMatch: '**/*.visual.ts', use: viewport(width) })),
  ],
})
