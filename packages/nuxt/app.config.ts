// T5.1: Nuxt UI's color aliases (ADR-0001 Â§2). Each alias names an 11-shade scale declared in assets/css/main.css,
// and every shade there reads a --cn-* token (C-03, REQ-016).
// A plain object typed with `satisfies`, not defineAppConfig(), so the file imports nothing at runtime.
import type { AppConfigInput } from 'nuxt/schema'

export default {
  ui: {
    colors: {
      primary: 'cn-primary', // BR-01, shades derived-pending (C-06)
      secondary: 'cn-secondary', // BR-02, shades derived-pending (C-06)
      success: 'cn-success', // feedback color (ADR-0032)
      info: 'cn-info', // feedback color (ADR-0032)
      warning: 'cn-warning', // feedback color (ADR-0032)
      error: 'cn-error', // feedback color (ADR-0032)
      neutral: 'cn-neutral', // neutral roles (ADR-0032)
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
    // T7.5 (REQ-020, REQ-024): the choice controls. UCheckbox, URadioGroup, and USwitch share one look, the `.cn-choice*`
    // rules in assets/css/main.css, which read the --cn-choice-* tokens. The state is read from Reka UI's `data-state`
    // (checked, unchecked, indeterminate) on the control, so no prop changes the look.
    checkbox: {
      slots: {
        base: 'cn-choice cn-choice--box cn-choice--checkbox',
      },
    },
    radioGroup: {
      slots: {
        base: 'cn-choice cn-choice--box cn-choice--radio',
      },
    },
    switch: {
      slots: {
        base: 'cn-choice cn-choice--switch',
      },
    },
    // T7.6 (REQ-020, REQ-029): progress, skeleton, and separator. Their looks are the `.cn-progress*`, `.cn-skeleton`, and
    // `.cn-separator*` rules in assets/css/main.css (ADR-0015). The progress track is the `base` slot and its fill is the
    // `indicator` slot. The separator line is the `border` slot; the horizontal and vertical hooks only pick which side of the
    // line carries the stroke width.
    progress: {
      slots: {
        base: 'cn-progress',
        indicator: 'cn-progress__fill',
      },
    },
    skeleton: {
      // The radius is a utility class that reads the token, not a rule in main.css, so the page can still give a circle
      // `rounded-full`: Nuxt UI merges the classes and the later one wins, as it does with its own `rounded-md`.
      base: 'cn-skeleton rounded-(--cn-radius-skeleton)',
    },
    separator: {
      slots: {
        border: 'cn-separator',
      },
      compoundVariants: [
        { orientation: 'horizontal', class: { border: 'cn-separator--horizontal' } },
        { orientation: 'vertical', class: { border: 'cn-separator--vertical' } },
      ],
    },
    // T8.1 (REQ-020, REQ-025): the standard card and the form field. UCard has one brand look, the `.cn-card` rules in
    // assets/css/main.css (ADR-0018): black fill, a pink outline, and pink dividers. UFormField only colors its text slots;
    // the label, help, and error are tied to the control by Nuxt UI itself.
    card: {
      slots: {
        root: 'cn-card',
      },
    },
    formField: {
      slots: {
        label: 'cn-form-field__label',
        description: 'cn-form-field__description',
        hint: 'cn-form-field__hint',
        help: 'cn-form-field__help',
        error: 'cn-form-field__error',
      },
    },
    // T8.5 (REQ-020, REQ-026, REQ-027): the modal and the slideover share one look (ADR-0029), the `.cn-overlay-*` rules in
    // assets/css/main.css, which read the --cn-overlay-* tokens: a dimmed backdrop and a black panel with a thick pink
    // outline. Nuxt UI's own dialog gives the behavior (focus trap and restore, Escape, an inert page behind), so nothing
    // here re-implements it. Under reduced motion the opening movement is switched off with Tailwind's `motion-reduce:`.
    modal: {
      slots: {
        overlay: 'cn-overlay-scrim motion-reduce:animate-none!',
        content: 'cn-overlay-panel motion-reduce:animate-none!',
      },
    },
    // The edge hooks round only the corners that do not touch the viewport, so a panel that sits against the edge of the
    // screen has no gap at its corners. An `inset` slideover floats, so it keeps all four corners.
    slideover: {
      slots: {
        overlay: 'cn-overlay-scrim motion-reduce:animate-none!',
        content: 'cn-overlay-panel motion-reduce:animate-none!',
      },
      compoundVariants: [
        { side: 'top', inset: false, class: { content: 'cn-overlay-panel--edge-top' } },
        { side: 'right', inset: false, class: { content: 'cn-overlay-panel--edge-right' } },
        { side: 'bottom', inset: false, class: { content: 'cn-overlay-panel--edge-bottom' } },
        { side: 'left', inset: false, class: { content: 'cn-overlay-panel--edge-left' } },
      ],
    },
    // T8.6 (REQ-020, REQ-022, REQ-028, ADR-0030): the site header and the site footer, `UHeader` and `UFooter`. They are
    // slot-based and hold no domain content. The look is the `.cn-site-header` and `.cn-site-footer` rules in
    // assets/css/main.css, which read the --cn-site-header-* and --cn-site-footer-* tokens: an opaque black bar with a thick
    // pink line. The mobile menu is Nuxt UI's own slideover (`mode="slideover"`), which takes the overlay look above.
    header: {
      slots: {
        root: 'cn-site-header',
      },
    },
    footer: {
      slots: {
        root: 'cn-site-footer',
      },
    },
    // T8.4 (REQ-020, REQ-024, REQ-028): tabs, breadcrumb, and pagination, with the look the owner chose in ADR-0028. UTabs has
    // one brand look, the `link` variant: a pink underline under the selected tab on a rule. Nuxt UI's `pill` variant fills
    // the selected tab, which is not the chosen look, so the theme makes `link` the default. UBreadcrumb shows the links in
    // pink and underlined and the current page as plain bold text. UPagination draws its numbers and controls with UButton,
    // so the `.cn-pagination` hook restyles the buttons inside it: a neutral outline and no glow, and a pink chip for the
    // current page. The rules are in assets/css/main.css and read only --cn-tabs-*, --cn-breadcrumb-*, and
    // --cn-pagination-* tokens.
    tabs: {
      slots: {
        list: 'cn-tabs__list',
        trigger: 'cn-tabs__trigger',
        indicator: 'cn-tabs__indicator',
        content: 'cn-tabs__content',
      },
      defaultVariants: {
        variant: 'link',
      },
    },
    breadcrumb: {
      slots: {
        link: 'cn-breadcrumb__link',
        separatorIcon: 'cn-breadcrumb__separator',
      },
    },
    pagination: {
      slots: {
        root: 'cn-pagination',
        list: 'cn-pagination__list',
      },
    },
    // T8.3 (REQ-020, REQ-026, ADR-0027): the alert, the toast, and the tooltip. They share one look, the owner's option A:
    // the black page, a thick outline and an icon in the feedback color, and normal text. The look is the `.cn-alert*`,
    // `.cn-toast*`, and `.cn-tooltip*` rules in assets/css/main.css, which read the --cn-alert-*, --cn-toast-*, and
    // --cn-tooltip-* tokens. The four feedback types map to Nuxt UI's `color` prop (`success`, `info`, `warning`, `error`)
    // and each puts one modifier class on the root. The alert's `variant` has no effect on the look: the rules replace the
    // fill and the ring that each Nuxt UI variant draws.
    alert: {
      slots: {
        root: 'cn-alert',
        title: 'cn-alert__title',
        description: 'cn-alert__description',
        icon: 'cn-alert__icon',
        close: 'cn-alert__close',
      },
      // Nuxt UI's alert theme gives color plain strings, not slots, so the modifier is a compound variant.
      compoundVariants: [
        { color: 'success', class: { root: 'cn-alert--success' } },
        { color: 'info', class: { root: 'cn-alert--info' } },
        { color: 'warning', class: { root: 'cn-alert--warning' } },
        { color: 'error', class: { root: 'cn-alert--error' } },
      ],
    },
    toast: {
      slots: {
        root: 'cn-toast',
        title: 'cn-toast__title',
        description: 'cn-toast__description',
        icon: 'cn-toast__icon',
        close: 'cn-toast__close',
        // The countdown bar is hidden: it moves on its own and says nothing a screen reader could use.
        progress: 'hidden',
      },
      variants: {
        color: {
          success: { root: 'cn-toast--success' },
          info: { root: 'cn-toast--info' },
          warning: { root: 'cn-toast--warning' },
          error: { root: 'cn-toast--error' },
        },
      },
    },
    // The toaster only gets a hook for reduced motion: where the toast sits is a Nuxt UI default (TBD-15), and how it
    // moves is Nuxt UI's default animation.
    toaster: {
      slots: {
        base: 'cn-toaster__item',
      },
    },
    tooltip: {
      slots: {
        content: 'cn-tooltip',
      },
    },
  },
} satisfies AppConfigInput
