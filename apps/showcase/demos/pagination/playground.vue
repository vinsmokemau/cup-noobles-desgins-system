<script setup lang="ts">
// The playground of the pagination. The controls in controls.ts set these props. `total` is the number of results, shown
// ten to a page, and `disabled` disables the whole control. The accessible names are es-MX, set through the slots, because
// Nuxt UI's own are English.
withDefaults(
  defineProps<{
    total?: number
    disabled?: boolean
  }>(),
  { total: 90, disabled: false },
)
</script>

<template>
  <div class="p-6">
    <UPagination
      :total="total"
      :items-per-page="10"
      :default-page="2"
      :sibling-count="1"
      :show-controls="false"
      show-edges
      :disabled="disabled"
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
  </div>
</template>
