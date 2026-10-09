<script setup lang="ts">
import { ref, watch } from 'vue'

// The playground of the switch. The controls in controls.ts set these props. `checked` sets the value from outside;
// pressing the switch still toggles it.
const props = withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    checked?: boolean
    disabled?: boolean
  }>(),
  { size: 'md', checked: false, disabled: false },
)
const value = ref(props.checked)
watch(
  () => props.checked,
  (checked) => {
    value.value = checked
  },
)
</script>

<template>
  <div class="p-6">
    <USwitch id="switch-playground" v-model="value" label="Avisos de lanzamientos" :size="size" :disabled="disabled" />
  </div>
</template>
