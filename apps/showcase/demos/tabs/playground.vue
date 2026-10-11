<script setup lang="ts">
// The playground of the tabs. The controls in controls.ts set these props. `disabledTab` disables the third tab, and
// `orientation` lays the list out in a row or in a column. Each tab has a panel, so the panel and its label can be tested.
withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    disabledTab?: boolean
  }>(),
  { orientation: 'horizontal', disabledTab: false },
)
const items = [
  { label: 'Reglas', value: 'reglas', content: 'Cada jugador empieza con cinco cartas.' },
  { label: 'Mesas', value: 'mesas', content: 'Hay seis mesas para cuatro personas.' },
  { label: 'Torneos', value: 'torneos', content: 'El torneo empieza a las 7 p. m.' },
]
</script>

<template>
  <div class="p-6">
    <UTabs
      :items="items.map((item, index) => ({ ...item, disabled: disabledTab && index === 2 }))"
      :orientation="orientation"
      default-value="reglas"
      class="w-full"
    />
  </div>
</template>
