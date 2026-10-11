<script setup lang="ts">
// The playground of the site footer. The controls in controls.ts set these props. The footer is slot-based: the text, the
// links, and the actions arrive through slots. Below `lg` the three parts stack and are centered. Copy is es-MX.
withDefaults(
  defineProps<{
    text?: string
  }>(),
  { text: '© 2026 Cup Noobles' },
)
</script>

<template>
  <div>
    <div class="flex flex-col items-start gap-4 p-6">
      <p>Noche de juegos</p>
      <a href="#detalle" data-testid="page-link">Ver detalles</a>
    </div>
    <UFooter>
      <template #left>
        <p class="text-sm">{{ text }}</p>
      </template>
      <nav aria-label="Pie de página">
        <ul class="flex flex-wrap items-center justify-center gap-4">
          <li><ULink to="#ayuda">Ayuda</ULink></li>
          <li><ULink to="#terminos">Términos</ULink></li>
          <li><ULink to="#privacidad">Privacidad</ULink></li>
        </ul>
      </nav>
      <template #right>
        <UButton color="primary" variant="ghost" label="Contacto" />
      </template>
    </UFooter>
  </div>
</template>
