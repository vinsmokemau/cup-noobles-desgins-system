<script setup lang="ts">
// CnMain (T15.18, DSR-14): the `<main>` landmark that `CnSkipLink` jumps to. It renders a real `<main>` with an `id` and
// `tabindex="-1"`. The id lets the skip link find it, and the tabindex lets the browser move keyboard focus to it, which
// a plain `<main>` does not take. Without the tabindex, activating the link scrolls the page but leaves focus in the header,
// so the next Tab goes back into it, and nothing reports that (ADR-0072). It has no style of its own, and no focus ring,
// because a person never tabs to it. It holds no text (A-11); the default slot is the page.
withDefaults(
  defineProps<{
    /** The id of the region, with no `#`. `"main"` when it is not set, the default `target` of `CnSkipLink`. */
    id?: string
  }>(),
  { id: 'main' },
)
defineSlots<{
  /** The page content. */
  default?(): unknown
}>()
</script>

<template>
  <main :id="id" tabindex="-1" class="cn-main">
    <slot />
  </main>
</template>
