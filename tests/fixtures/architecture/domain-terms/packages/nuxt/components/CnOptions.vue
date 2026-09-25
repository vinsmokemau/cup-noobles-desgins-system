<!-- Fixture: REQ-022 AC1 violations through the Options API and defineSlots. -->
<script lang="ts">
export default {
  props: { sku: String, heading: String },
  emits: ['paymentDone', 'close'],
}
</script>

<script setup lang="ts">
defineSlots<{ CheckOut(): unknown; footer(): unknown }>()
</script>

<template>
  <div />
</template>
