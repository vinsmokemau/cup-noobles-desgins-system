<script setup lang="ts">
// The state matrix of the site header (REQ-026 AC2). The header is a landmark, not a control, so it has one visible state,
// `default`: at rest, with the pink line under it. The links and buttons inside show their own states in their own docs. The
// mobile menu is closed here; it opens from the toggle on the playground, where the keyboard tests drive it. Copy is es-MX and
// has no domain content (REQ-022).
const states = ['default'] as const
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="relative">
        <UHeader
          title="Cup Noobles"
          to="#inicio"
          mode="slideover"
          :menu="{ title: 'Menú', description: 'Navegación del sitio.' }"
          :toggle="{ color: 'primary', variant: 'ghost' }"
        >
          <nav aria-label="Principal">
            <ul class="flex items-center gap-4">
              <li><ULink to="#juegos">Juegos</ULink></li>
              <li><ULink to="#eventos">Eventos</ULink></li>
              <li><ULink to="#ayuda">Ayuda</ULink></li>
            </ul>
          </nav>
          <template #right>
            <UButton color="primary" variant="solid" label="Entrar" />
          </template>
          <template #body>
            <ul class="flex flex-col gap-3">
              <li><ULink to="#juegos">Juegos</ULink></li>
              <li><ULink to="#eventos">Eventos</ULink></li>
              <li><ULink to="#ayuda">Ayuda</ULink></li>
            </ul>
          </template>
        </UHeader>
      </div>
    </div>
  </div>
</template>
