<script setup lang="ts">
// CnLogo (REQ-030): renders one of the three brand assets (BR-16). The logo files are not supplied (TBD-17), so every variant
// renders a neutral placeholder that carries the text below and never an invented logo (REQ-030 AC2). The text is a build
// marker required by REQ-030 AC2, not UI copy, so it is the one string the component holds (A-11). The placeholder is hidden
// from assistive technology; the component is named by `label`, or hidden altogether when `decorative`.
// Once the SVGs are supplied, they replace the placeholder unmodified, with the clear-space and minimum-size rules from
// brand-identity.md (REQ-030 AC3).
type Variant = 'icon' | 'vertical' | 'horizontal'
type Props =
  { variant: Variant; label: string; decorative?: false } | { variant: Variant; decorative: true; label?: string }

const PLACEHOLDER_TEXT = 'Logo asset pending (TBD-17)'

const props = defineProps<Props>()

// The accessible label is required unless the logo is decorative (REQ-030 AC1). TypeScript enforces it in templates; this
// catches a call that bypasses the types. The layer declares no `vue` dependency (Nuxt provides it), so the component uses
// no reactive import.
if (process.env.NODE_ENV !== 'production' && !props.decorative && !props.label?.trim()) {
  console.warn('[CnLogo] Pass a `label`, or set `decorative` when the logo repeats a name next to it (REQ-030 AC1).')
}
</script>

<template>
  <span
    class="cn-logo"
    :data-variant="variant"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : label"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <span class="cn-logo__placeholder" aria-hidden="true">{{ PLACEHOLDER_TEXT }}</span>
  </span>
</template>
