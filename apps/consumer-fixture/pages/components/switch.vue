<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Interruptor</h1>
    <USwitch label="Avisos de lanzamientos" />
    <USwitch label="Modo silencioso" :default-value="true" />
    <USwitch label="Opción no disponible" disabled />
  </main>
</template>
