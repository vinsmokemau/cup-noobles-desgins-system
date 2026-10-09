<script setup lang="ts">
// T6.3 (REQ-054 AC4): the frame of every non-color preview. A preview whose tokens are tbd carries a hatched band and its
// "TBD-NN" badges (SPEC.md §4.4), and any status other than stable shows as a badge. The band sits beside the sample, not
// over it, so a specimen stays legible. The hatch is drawn from tokens only, in em, so the page holds no raw value (REQ-016).
import type { Preview } from '../lib/token-preview'

defineProps<{ preview: Preview }>()
</script>

<template>
  <li
    class="rounded-md border border-default p-3"
    data-testid="preview"
    :data-kind="preview.kind"
    :data-id="preview.id"
    :data-label="preview.label"
  >
    <div v-if="preview.status === 'tbd'" class="preview-hatch mb-3 rounded-md" aria-hidden="true" data-testid="hatch" />
    <slot />
    <ul class="mt-3 space-y-1 text-sm text-muted">
      <li v-for="token in preview.tokens" :key="token.path" class="break-all">
        <code data-testid="preview-path">{{ token.path }}</code> ·
        <code data-testid="preview-var">{{ token.cssVar }}</code> ·
        <code data-testid="preview-value">{{ token.value }}</code>
      </li>
    </ul>
    <div class="mt-2 flex flex-wrap gap-2">
      <StatusBadge :status="preview.status" />
      <UBadge v-for="id in preview.tbd" :key="id" :label="id" color="neutral" variant="solid" data-testid="tbd-badge" />
    </div>
  </li>
</template>

<style scoped>
/* Stripes of the page base over the neutral placeholder color: it reads as "no value yet" and cannot pass for a real one. */
.preview-hatch {
  height: 0.75em;
  background-color: var(--cn-placeholder-color-neutral);
  background-image: repeating-linear-gradient(
    45deg,
    var(--cn-color-bg-base) 0,
    var(--cn-color-bg-base) 0.35em,
    transparent 0.35em,
    transparent 0.7em
  );
}
</style>
