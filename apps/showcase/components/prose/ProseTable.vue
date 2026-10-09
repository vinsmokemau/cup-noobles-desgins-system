<script setup lang="ts">
// T5.5: replaces Nuxt UI's `ProseTable` for the docs. A table wider than the page scrolls inside its wrapper, and
// axe (`scrollable-region-focusable`, WCAG 2.1.1) needs that wrapper to take keyboard focus so the scroll can be
// reached without a mouse. The classes are Nuxt UI's own for the wrapper and the table, so the look is unchanged.
</script>

<template>
  <div
    class="relative my-5 overflow-x-auto rounded-md outline-primary/25 focus-visible:outline-3"
    tabindex="0"
    role="region"
    aria-label="Table"
  >
    <table class="w-full border-separate border-spacing-0 rounded-md">
      <slot />
    </table>
  </div>
</template>
