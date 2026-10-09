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
    // T7.3 (ADR-0012, TBD-19): the icon set is Phosphor Bold. Every icon name that a Nuxt UI component uses points to its
    // Phosphor Bold glyph, so no component shows an icon from another set (REQ-020).
    icons: {
      arrowDown: 'i-ph-arrow-down-bold',
      arrowLeft: 'i-ph-arrow-left-bold',
      arrowRight: 'i-ph-arrow-right-bold',
      arrowUp: 'i-ph-arrow-up-bold',
      caution: 'i-ph-warning-circle-bold',
      check: 'i-ph-check-bold',
      chevronDoubleLeft: 'i-ph-caret-double-left-bold',
      chevronDoubleRight: 'i-ph-caret-double-right-bold',
      chevronDown: 'i-ph-caret-down-bold',
      chevronLeft: 'i-ph-caret-left-bold',
      chevronRight: 'i-ph-caret-right-bold',
      chevronUp: 'i-ph-caret-up-bold',
      close: 'i-ph-x-bold',
      copy: 'i-ph-copy-bold',
      copyCheck: 'i-ph-check-square-bold',
      dark: 'i-ph-moon-bold',
      drag: 'i-ph-dots-six-vertical-bold',
      ellipsis: 'i-ph-dots-three-bold',
      error: 'i-ph-x-circle-bold',
      external: 'i-ph-arrow-up-right-bold',
      eye: 'i-ph-eye-bold',
      eyeOff: 'i-ph-eye-slash-bold',
      file: 'i-ph-file-bold',
      folder: 'i-ph-folder-bold',
      folderOpen: 'i-ph-folder-open-bold',
      hash: 'i-ph-hash-bold',
      info: 'i-ph-info-bold',
      light: 'i-ph-sun-bold',
      loading: 'i-ph-spinner-gap-bold',
      menu: 'i-ph-list-bold',
      minus: 'i-ph-minus-bold',
      panelClose: 'i-ph-sidebar-simple-bold',
      panelOpen: 'i-ph-sidebar-simple-bold',
      plus: 'i-ph-plus-bold',
      reload: 'i-ph-arrow-counter-clockwise-bold',
      search: 'i-ph-magnifying-glass-bold',
      stop: 'i-ph-square-bold',
      star: 'i-ph-star-bold',
      success: 'i-ph-check-circle-bold',
      system: 'i-ph-desktop-bold',
      tip: 'i-ph-lightbulb-bold',
      upload: 'i-ph-upload-simple-bold',
      warning: 'i-ph-warning-bold',
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
    // T7.4 (REQ-020, REQ-024): the text fields. UInput, UTextarea, and USelect share one look, the `.cn-field` rules in
    // assets/css/main.css, which read the --cn-input-* tokens. The error state is not a prop of the field: it is
    // `aria-invalid="true"` on the control, which the rules read. The select list highlights its keyboard-active item with
    // the focus ring (`.cn-select-item`), because Nuxt UI's own highlight is a fill that reads the page black.
    input: {
      slots: {
        base: 'cn-field',
      },
    },
    textarea: {
      slots: {
        base: 'cn-field',
      },
    },
    select: {
      slots: {
        base: 'cn-field',
        item: 'cn-select-item',
      },
    },
  },
} satisfies AppConfigInput
