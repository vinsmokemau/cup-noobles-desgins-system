<script setup lang="ts">
// The state matrix of the logo (REQ-026 AC2). A logo is not interactive and has one state. The cell shows the three variants
// (REQ-030 AC1), each named by `label`, and a `decorative` one that repeats a name written next to it and is hidden from
// assistive technology. Each logo shows at its minimum height (ADR-0016). Copy is es-MX.
const states = ['default'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-col items-start gap-6 p-6">
        <CnLogo variant="icon" label="Cup Noobles, icono" />
        <CnLogo variant="vertical" label="Cup Noobles, versión vertical" />
        <CnLogo variant="horizontal" label="Cup Noobles, versión horizontal" />
        <div class="flex items-center gap-4">
          <CnLogo variant="icon" decorative />
          <span class="text-sm">Cup Noobles</span>
        </div>
      </div>
    </div>
  </div>
</template>
