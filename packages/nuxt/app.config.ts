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
    // T7.2 (REQ-023): the button. The look itself is the `.cn-button*` rules in assets/css/main.css, which read only the
    // --cn-button-* tokens. This theme entry puts the hook classes on the right Nuxt UI props, so the three brand variants
    // (BR-11) map to props like this: primary = color primary + variant solid, secondary = color secondary + variant solid,
    // ghost = color primary + variant ghost. The disabled and loading states are the `disabled` and `loading` props.
    button: {
      slots: {
        base: 'cn-button',
      },
      variants: {
        // A string value applies to the base slot. Nuxt UI's own loading.true is a string, so an object would not merge.
        loading: {
          true: 'cn-button--loading',
        },
      },
      compoundVariants: [
        { color: 'primary', variant: 'solid', class: 'cn-button--primary' },
        { color: 'secondary', variant: 'solid', class: 'cn-button--secondary' },
        { color: 'primary', variant: 'ghost', class: 'cn-button--ghost' },
      ],
    },
    // T7.3 (REQ-020): the link. ULink is a thin wrapper, so the whole look is the `.cn-link` rules in assets/css/main.css.
    // It has one brand look: pink, underlined, with a yellow focus ring. The disabled state is the `disabled` prop.
    link: {
      base: 'cn-link',
    },
    // T7.3 (REQ-020, BR-12): the badge. The three brand variants map to props like this: primary = color primary +
    // variant solid, outline = color primary + variant outline, tag = color secondary + variant solid (the tag badge of
    // the featured media card).
    badge: {
      slots: {
        base: 'cn-badge',
      },
      compoundVariants: [
        { color: 'primary', variant: 'solid', class: 'cn-badge--primary' },
        { color: 'primary', variant: 'outline', class: 'cn-badge--outline' },
        { color: 'secondary', variant: 'solid', class: 'cn-badge--tag' },
      ],
    },
  },
} satisfies AppConfigInput
