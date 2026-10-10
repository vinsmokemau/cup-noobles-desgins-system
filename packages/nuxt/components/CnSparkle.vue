<script setup lang="ts">
// CnSparkle (REQ-029): the sparkles-and-stars motif (BR-14). The artwork is not supplied (TBD-18), so it renders a neutral
// outlined placeholder that carries the note below and never an invented sparkle. The note is a build marker, not UI copy,
// so it is the one string the component holds (A-11), like the CnLogo placeholder of T7.7. The motif is decorative: it is
// hidden from assistive technology, holds no focusable element, and has no label (REQ-029 AC1). `animated` fades it slowly;
// the fade stops under reduced motion (REQ-029 AC2). Once the SVG is supplied, it replaces the placeholder unmodified.
const PLACEHOLDER_TEXT = 'Motif pending (TBD-18)'

defineProps<{ animated?: boolean }>()
</script>

<template>
  <span class="cn-sparkle" :data-animated="animated ? 'true' : undefined" aria-hidden="true">{{
    PLACEHOLDER_TEXT
  }}</span>
</template>
