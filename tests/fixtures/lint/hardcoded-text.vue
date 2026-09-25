<!-- Fixture: deliberate REQ-022 AC2 violations. Every flagged text is listed in tests/lint-rules.test.ts. -->
<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <div>
    <button type="button">Enviar</button>
    <p>{{ 'Hola' }}</p>
    <p>{{ `Adiós` }}</p>
    <p>{{ label }}</p>
    <slot />
    <span aria-hidden="true">★</span>
    <span :aria-hidden="true"><b>✦</b></span>
    <span aria-hidden="false">Visible</span>
    <p>&nbsp;</p>
  </div>
</template>
