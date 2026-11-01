<script setup lang="ts">
const details = [
  { label: 'Jugadores', value: '2 a 4' },
  { label: 'Duración', value: '30 minutos' },
  { label: 'Edad recomendada', value: '8 años en adelante' },
]
</script>

<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Lista de atributos</h1>
    <div class="w-full max-w-lg">
      <CnKeyValueList :items="details" />
    </div>
  </main>
</template>
