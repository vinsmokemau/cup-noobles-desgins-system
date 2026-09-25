// Vitest workspace (T1.2). Each entry in `projects` is one project; packages and apps add their own
// entries, with a vitest.config.ts in their directory, when they get their first unit tests.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: 'repo',
          include: ['tests/**/*.test.ts'],
          environment: 'node',
        },
      },
    ],
  },
})
