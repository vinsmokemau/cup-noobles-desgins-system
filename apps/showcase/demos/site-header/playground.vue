<script setup lang="ts">
// The playground of the site header. The controls in controls.ts set these props. The header is slot-based: the title, the
// navigation, the actions, and the mobile menu body arrive through slots. Below `lg` the navigation moves into UHeader's own
// slideover, opened from the toggle, so the keyboard tests can open it, tab through it, and close it with Escape. The text
// below the header is the page behind. Copy is es-MX.
withDefaults(
  defineProps<{
    title?: string
    toggleSide?: 'left' | 'right'
  }>(),
  { title: 'Cup Noobles', toggleSide: 'right' },
)
</script>

<template>
  <div>
    <UHeader
      :title="title"
      to="#inicio"
      mode="slideover"
      :toggle-side="toggleSide"
      :menu="{ side: toggleSide, title: 'Menú', description: 'Navegación del sitio.' }"
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
        <ul class="flex flex-col gap-3" aria-label="Menú">
          <li><ULink to="#juegos">Juegos</ULink></li>
          <li><ULink to="#eventos">Eventos</ULink></li>
          <li><ULink to="#ayuda">Ayuda</ULink></li>
        </ul>
      </template>
    </UHeader>
    <div class="flex flex-col items-start gap-4 p-6">
      <p>Noche de juegos</p>
      <a href="#detalle" data-testid="page-link">Ver detalles</a>
    </div>
  </div>
</template>
