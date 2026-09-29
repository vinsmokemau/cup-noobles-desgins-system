// T5.1: Nuxt UI's color aliases (ADR-0001 §2). Each alias names an 11-shade scale declared in assets/css/main.css,
// and every shade there reads a --cn-* token (C-03, REQ-016).
// A plain object typed with `satisfies`, not defineAppConfig(), so the file imports nothing at runtime.
import type { AppConfigInput } from 'nuxt/schema'

export default {
  ui: {
    colors: {
      primary: 'cn-primary', // BR-01, shades derived-pending (C-06)
      secondary: 'cn-secondary', // BR-02, shades derived-pending (C-06)
      success: 'cn-success', // TBD-07
      info: 'cn-info', // TBD-07
      warning: 'cn-warning', // TBD-07
      error: 'cn-error', // TBD-07
      neutral: 'cn-neutral', // TBD-05
    },
  },
} satisfies AppConfigInput
