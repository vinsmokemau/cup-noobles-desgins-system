<script setup lang="ts">
// The state matrix of the separator (REQ-026 AC2). A separator is not interactive, and it has one state. The cell shows a
// horizontal line between two blocks of text, the same line with a label, and a vertical line between two links in a row.
// The decorative line (`decorative`) is hidden from assistive technology; the plain one is announced as a separator. Copy is
// es-MX.
const states = ['default'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex flex-col gap-4 p-6">
        <p class="text-sm">Envíos</p>
        <USeparator data-separator="horizontal" />
        <p class="text-sm">Pagos</p>
        <USeparator data-separator="label" label="o" />
        <div class="flex h-8 items-center gap-4 text-sm">
          <span>Cartas</span>
          <USeparator data-separator="vertical" orientation="vertical" decorative />
          <span>Juegos de mesa</span>
        </div>
      </div>
    </div>
  </div>
</template>
