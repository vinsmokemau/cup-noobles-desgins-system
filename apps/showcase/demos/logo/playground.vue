<script setup lang="ts">
// The playground of the logo. The controls in controls.ts set these props. `decorative` hides the logo from assistive
// technology and drops the label, as it does on a logo that repeats a name next to it.
withDefaults(
  defineProps<{
    variant?: 'icon' | 'vertical' | 'horizontal'
    decorative?: boolean
    label?: string
  }>(),
  { variant: 'horizontal', decorative: false, label: 'Cup Noobles' },
)
</script>

<template>
  <div class="p-6">
    <CnLogo v-if="decorative" :variant="variant" decorative />
    <CnLogo v-else :variant="variant" :label="label" />
  </div>
</template>
