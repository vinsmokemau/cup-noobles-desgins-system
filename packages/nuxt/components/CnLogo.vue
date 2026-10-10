<script setup lang="ts">
// CnLogo (REQ-030): renders one of the three brand assets (BR-16), the SVG files the owner supplied (ADR-0016). Each file is
// shown as an image and is never edited, recolored, or inlined: the three files reuse the same internal class names, so
// inlining them would let their styles overwrite each other (REQ-030 AC3). The clear space and the minimum height of each
// variant are tokens, applied by the `.cn-logo` rules in main.css. The logo is named by `label`, or hidden from assistive
// technology when `decorative`. It holds no text of its own (A-11).
type Variant = 'icon' | 'vertical' | 'horizontal'
type Props =
  { variant: Variant; label: string; decorative?: false } | { variant: Variant; decorative: true; label?: string }

const SOURCES: Record<Variant, string> = {
  icon: new URL('../assets/brand/Icon-CN.svg', import.meta.url).href,
  vertical: new URL('../assets/brand/LogoVertical-CN.svg', import.meta.url).href,
  horizontal: new URL('../assets/brand/LogoHorizontal-CN.svg', import.meta.url).href,
}

const props = defineProps<Props>()

// The accessible label is required unless the logo is decorative (REQ-030 AC1). TypeScript enforces it in templates; this
// catches a call that bypasses the types. The layer declares no `vue` dependency (Nuxt provides it), so the component uses
// no reactive import.
if (process.env.NODE_ENV !== 'production' && !props.decorative && !props.label?.trim()) {
  console.warn('[CnLogo] Pass a `label`, or set `decorative` when the logo repeats a name next to it (REQ-030 AC1).')
}
</script>

<template>
  <span class="cn-logo" :data-variant="variant">
    <img
      class="cn-logo__image"
      :src="SOURCES[variant]"
      :alt="decorative ? '' : label"
      :aria-hidden="decorative ? 'true' : undefined"
      draggable="false"
    />
  </span>
</template>
