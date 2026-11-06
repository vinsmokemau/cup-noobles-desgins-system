<script setup lang="ts">
// CnSkipLink (T15.18, DSR-14): the link that lets a keyboard or screen-reader user jump past the site header to the main
// content (WCAG 2.4.1). Nuxt UI has no equivalent (REQ-020 AC2, ADR-0072), so it is custom. It renders a real
// `<a href="#id">`, so it works with server-side rendering and with no JavaScript. It is the first focusable element of the
// page: put it first inside the root of the app, before the header. It is hidden off-screen until it receives
// `:focus-visible`, then it is shown above the header with the focus ring of ADR-0009, at least 44 px tall.
//
// The component holds no text of its own (A-11): the `label` prop is the text, and the storefront passes es-MX. Its `target`
// is the id of the main region, "main" by default, which is also the default id of `CnMain`, so `<CnSkipLink>` and
// `<CnMain>` agree with no props. Activating the link moves focus to the target when the target has `tabindex="-1"`, which
// `CnMain` sets, so an app that uses `CnMain` has nothing else to write.
withDefaults(
  defineProps<{
    /** The text of the link. Required, and written by the app in its own language. */
    label: string
    /** The id of the main region the link jumps to, with no `#`. `"main"` when it is not set, the default id of `CnMain`. */
    target?: string
  }>(),
  { target: 'main' },
)
</script>

<template>
  <a class="cn-skip-link" :href="`#${target}`">{{ label }}</a>
</template>
