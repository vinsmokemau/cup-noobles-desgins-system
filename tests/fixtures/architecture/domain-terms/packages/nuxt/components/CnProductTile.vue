<!-- Fixture: REQ-022 AC1 violations. Every flagged name is listed in tests/architecture.test.ts. -->
<script setup lang="ts">
interface Props {
  title: string
  unitPrice: number
  border: string
}
defineProps<Props>()
const emit = defineEmits<{ (e: 'add-to-cart' | 'select'): void; (e: 'ordered'): void }>()
defineModel('selectedVariant')
</script>

<template>
  <div :style="{ '--cn-color-stock-low': 'x' }">
    <slot name="checkout" />
    <slot name="label" />
    <slot />
    <button type="button" @click="emit('select')" />
  </div>
</template>
