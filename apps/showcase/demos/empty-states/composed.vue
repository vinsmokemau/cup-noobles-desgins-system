<script setup lang="ts">
// The composed demo of the empty-states pattern (REQ-035 AC2), on neutral content (a list of game sessions in a community
// app). It shows the two empty states people meet most. First use: nothing exists yet, so the state explains the list and
// offers the one action that fills it. No results: a search matched nothing, so the state names the search and offers to
// clear it. Each state is a title, one sentence, and at most one primary action, in a card. The list comes back when the
// action is taken. Copy is es-MX.
import { computed, ref } from 'vue'

const created = ref<string[]>([])
const query = ref('')

const matches = computed(() => {
  const text = query.value.trim().toLowerCase()
  return created.value.filter((name) => name.toLowerCase().includes(text))
})

function create() {
  created.value = ['Noche de dados', 'Torneo de tablero', 'Tarde de rol']
}
function clear() {
  query.value = ''
}
</script>

<template>
  <div class="flex max-w-xl flex-col gap-4 p-2">
    <h2 class="text-xl font-semibold">Mis partidas</h2>

    <UFormField v-if="created.length > 0" label="Buscar partida">
      <UInput v-model="query" icon="i-ph-magnifying-glass-bold" class="w-full" />
    </UFormField>

    <UCard v-if="created.length === 0" data-testid="empty-first-use">
      <div class="flex flex-col items-center gap-3 text-center">
        <UIcon name="i-ph-folder-open-bold" class="size-10" aria-hidden="true" />
        <h3 class="text-lg font-semibold">Aún no tienes partidas</h3>
        <p class="text-muted">Aquí verás las partidas que crees. Empieza con la primera.</p>
        <UButton color="primary" variant="solid" label="Crear partida" @click="create" />
      </div>
    </UCard>

    <UCard v-else-if="matches.length === 0" data-testid="empty-no-results">
      <div class="flex flex-col items-center gap-3 text-center" role="status">
        <UIcon name="i-ph-magnifying-glass-bold" class="size-10" aria-hidden="true" />
        <h3 class="text-lg font-semibold">Sin resultados para «{{ query }}»</h3>
        <p class="text-muted">Revisa la ortografía o prueba con otra palabra.</p>
      </div>
      <template #footer>
        <div class="flex justify-center">
          <UButton color="primary" variant="ghost" label="Limpiar búsqueda" @click="clear" />
        </div>
      </template>
    </UCard>

    <ul v-else class="flex flex-col gap-2" aria-label="Partidas">
      <li v-for="name in matches" :key="name">
        <UCard>{{ name }}</UCard>
      </li>
    </ul>
  </div>
</template>
