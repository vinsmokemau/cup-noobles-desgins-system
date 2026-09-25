<!-- Fixture: REQ-020 AC3 violation (a hand-rolled focus trap). -->
<script setup lang="ts">
import { ref } from 'vue'

const first = ref<HTMLElement>()
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Tab') first.value?.focus()
}
</script>

<template>
  <div ref="first" @keydown="onKeydown"><slot /></div>
</template>
