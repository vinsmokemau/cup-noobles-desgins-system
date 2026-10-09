<script setup lang="ts">
// The playground of the progress bar. The controls in controls.ts set these props. `indeterminate` drops the value, as an
// unknown amount of work does.
withDefaults(
  defineProps<{
    value?: number
    indeterminate?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    status?: boolean
  }>(),
  { value: 62, indeterminate: false, size: 'lg', status: true },
)
</script>

<template>
  <div class="flex flex-col gap-2 p-6">
    <span class="text-sm">Subiendo portada</span>
    <UProgress
      :model-value="indeterminate ? null : value"
      :size="size"
      :status="status"
      :get-value-label="() => 'Subiendo portada'"
    />
  </div>
</template>
