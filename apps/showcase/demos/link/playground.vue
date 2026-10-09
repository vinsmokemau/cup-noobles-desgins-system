<script setup lang="ts">
// The playground of the link. The controls in controls.ts set these props. `iconOnly` hides the text and leaves the
// accessible label, which an icon-only link must have. The icon is a Phosphor Bold glyph (ADR-0012).
withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    iconOnly?: boolean
  }>(),
  { label: 'Ver las reglas del torneo', disabled: false, iconOnly: false },
)
</script>

<template>
  <div class="p-6">
    <ULink
      to="/"
      :disabled="disabled"
      :aria-label="iconOnly ? label : undefined"
      :class="iconOnly ? 'inline-flex size-8 items-center justify-center' : undefined"
    >
      <UIcon v-if="iconOnly" name="i-ph-magnifying-glass-bold" class="size-5" />
      <template v-else>{{ label }}</template>
    </ULink>
  </div>
</template>
