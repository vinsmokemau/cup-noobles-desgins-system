<script setup lang="ts">
// CnSparkle (REQ-029): the sparkles-and-stars motif (BR-14). It shows the sparkle SVG the owner chose (ADR-0017) as an
// image file, never edited, recoloured, or inlined, the way CnLogo shows the logos. The motif is decorative: it is hidden
// from assistive technology and holds no focusable element (REQ-029 AC1). It is as tall as the text beside it, and a page
// makes it larger through the `--sparkle-size` custom property. `animated` fades it slowly, and the fade stops under
// reduced motion (REQ-029 AC2). It holds no text of its own (A-11).
const SOURCE = new URL('../assets/brand/Sparkle-CN.svg', import.meta.url).href

defineProps<{ animated?: boolean }>()
</script>

<template>
  <img
    class="cn-sparkle"
    :data-animated="animated ? 'true' : undefined"
    :src="SOURCE"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>
