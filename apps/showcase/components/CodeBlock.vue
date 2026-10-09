<script setup lang="ts">
// T7.1 (REQ-055 AC1, AC2): a code snippet with a copy button. `code` is the text of the demo file, imported with `?raw`
// (lib/demo-registry.ts), so what is shown and copied is the code that runs.
import { onBeforeUnmount, ref } from 'vue'

const props = defineProps<{ code: string; label: string }>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 2000)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="mt-4" role="region" :aria-label="label" data-testid="code-block">
    <div class="flex items-center justify-end gap-2">
      <span role="status" class="text-sm text-muted">{{ copied ? 'Copied' : '' }}</span>
      <UButton
        size="sm"
        color="neutral"
        variant="outline"
        icon="i-ph-copy-bold"
        label="Copy code"
        data-testid="code-copy"
        @click="copy"
      />
    </div>
    <!-- The block scrolls sideways when a line is long, so the keyboard needs to reach it (axe scrollable-region-focusable). -->
    <pre
      class="mt-2 max-w-full overflow-x-auto border border-default p-4 text-sm"
      tabindex="0"
    ><code data-testid="code-source">{{ code }}</code></pre>
  </div>
</template>
