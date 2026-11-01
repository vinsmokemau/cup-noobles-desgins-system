<script setup lang="ts">
// The playground of the key-value list. The controls in controls.ts set these props. `rows` is how many rows of the example
// details show, `badge` draws the values as outline badges through the `value` slot, and `longValue` makes the first value
// one very long word, to show that it breaks inside its column. Copy is es-MX.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ rows?: number; badge?: boolean; longValue?: boolean }>(), {
  rows: 3,
  badge: false,
  longValue: false,
})
const details = [
  { label: 'Jugadores', value: '2 a 4' },
  { label: 'Duración', value: '30 minutos' },
  { label: 'Edad recomendada', value: '8 años en adelante' },
  { label: 'Idioma', value: 'Español' },
  { label: 'Piezas', value: '120 cartas' },
  { label: 'Autor', value: 'Equipo Cup Noobles' },
]
const items = computed(() =>
  details.slice(0, Math.max(0, props.rows)).map((item, index) => ({
    ...item,
    value:
      props.longValue && index === 0 ? 'Supercalifragilisticoespialidosoconunapalabramuylargasinespacios' : item.value,
  })),
)
</script>

<template>
  <div class="p-6">
    <CnKeyValueList :items="items">
      <template v-if="badge" #value="{ item }">
        <UBadge :label="item.value" color="primary" variant="outline" />
      </template>
    </CnKeyValueList>
  </div>
</template>
