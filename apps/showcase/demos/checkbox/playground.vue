<script setup lang="ts">
import { ref, watch } from 'vue'

// The playground of the checkbox. The controls in controls.ts set these props. `checked` and `indeterminate` set the value
// from outside; clicking the checkbox still toggles it.
const props = withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    checked?: boolean
    indeterminate?: boolean
    disabled?: boolean
  }>(),
  { size: 'md', checked: false, indeterminate: false, disabled: false },
)
const value = ref<boolean | 'indeterminate'>(props.indeterminate ? 'indeterminate' : props.checked)
watch(
  () => [props.checked, props.indeterminate] as const,
  ([checked, indeterminate]) => {
    value.value = indeterminate ? 'indeterminate' : checked
  },
)
</script>

<template>
  <div class="p-6">
    <UCheckbox
      id="checkbox-playground"
      v-model="value"
      label="Recibir avisos de lanzamientos"
      :size="size"
      :disabled="disabled"
    />
  </div>
</template>
