<script setup lang="ts">
// The state matrix of the key-value list (REQ-026 AC2). A list is not interactive, so it has `default`, and `empty` for a
// list with no rows, which renders nothing. The default cell shows a list of text values and a list with a badge in the
// `value` slot. The empty cell has a minimum height so that its baseline is an image of the space the list leaves. Copy is
// es-MX and has no domain content (REQ-022).
const states = ['default', 'empty'] as const
const details = [
  { label: 'Jugadores', value: '2 a 4' },
  { label: 'Duración', value: '30 minutos' },
  { label: 'Edad recomendada', value: '8 años en adelante' },
]
const languages = [{ label: 'Idioma', value: 'Español' }]
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <div v-for="state in states" :key="state">
      <p class="mb-2 text-sm font-medium">{{ state }}</p>
      <div :data-state="state" class="flex min-h-16 flex-col gap-6 p-6">
        <template v-if="state === 'default'">
          <CnKeyValueList data-list="text" :items="details" />
          <CnKeyValueList data-list="slot" :items="languages">
            <template #value="{ item }">
              <UBadge :label="item.value" color="primary" variant="outline" />
            </template>
          </CnKeyValueList>
        </template>
        <CnKeyValueList v-else data-list="empty" :items="[]" />
      </div>
    </div>
  </div>
</template>
