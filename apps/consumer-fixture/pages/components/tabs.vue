<script setup lang="ts">
const items = [
  { label: 'Reglas', value: 'reglas', content: 'Cada jugador empieza con cinco cartas.' },
  { label: 'Mesas', value: 'mesas', content: 'Hay seis mesas para cuatro personas.' },
  { label: 'Torneos', value: 'torneos', content: 'El torneo empieza a las 7 p. m.', disabled: true },
]
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Pestañas</h1>
    <UTabs :items="items" default-value="reglas" class="w-full max-w-lg" />
  </main>
</template>
