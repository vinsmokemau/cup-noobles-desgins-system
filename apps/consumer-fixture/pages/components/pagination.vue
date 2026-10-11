<template>
  <main class="flex flex-col items-start gap-6 p-6">
    <h1>Paginación</h1>
    <UPagination
      :total="90"
      :items-per-page="10"
      :default-page="2"
      :sibling-count="1"
      :show-controls="false"
      show-edges
    >
      <template #prev>
        <UButton color="neutral" variant="outline" icon="i-ph-caret-left-bold" aria-label="Página anterior" />
      </template>
      <template #item="{ item, page }">
        <UButton
          :color="page === item.value ? 'primary' : 'neutral'"
          :variant="page === item.value ? 'solid' : 'outline'"
          :label="String(item.value)"
          :aria-label="`Página ${item.value}`"
          square
        />
      </template>
      <template #next>
        <UButton color="neutral" variant="outline" icon="i-ph-caret-right-bold" aria-label="Página siguiente" />
      </template>
    </UPagination>
  </main>
</template>
