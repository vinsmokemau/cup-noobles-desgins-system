<script setup lang="ts">
// The playground of the icon. The controls in controls.ts set these props. `UIcon` hides itself from assistive technology,
// so an icon with a `label` carries its meaning on a wrapper (`role="img"` with that label); without one it is decorative.
// The icon names are Phosphor Bold glyphs, the set the owner chose (ADR-0012).
withDefaults(
  defineProps<{
    name?: string
    size?: 'size-4' | 'size-5' | 'size-6' | 'size-8'
    label?: string
  }>(),
  { name: 'i-ph-star-bold', size: 'size-6', label: '' },
)
</script>

<template>
  <div class="p-6">
    <span class="inline-flex" :role="label ? 'img' : undefined" :aria-label="label || undefined" data-icon="playground">
      <UIcon :name="name" :class="size" />
    </span>
  </div>
</template>
