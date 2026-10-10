<script setup lang="ts">
// The playground of the standard card. The controls in controls.ts set these props. `title` and `description` fill the
// header through Nuxt UI's props, and `footer` shows or hides the footer slot.
withDefaults(
  defineProps<{
    title?: string
    description?: string
    footer?: boolean
  }>(),
  { title: 'Noche de juegos', description: 'Mesas para cuatro personas.', footer: true },
)
</script>

<template>
  <div class="p-6">
    <UCard :title="title" :description="description">
      <p>Trae tus dados y tu mazo favorito.</p>
      <template v-if="footer" #footer>
        <p class="text-sm">Viernes a las 7 p. m.</p>
      </template>
    </UCard>
  </div>
</template>
