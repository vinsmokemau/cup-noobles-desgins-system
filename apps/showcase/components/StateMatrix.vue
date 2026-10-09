<script setup lang="ts">
// T7.1 (REQ-055 AC1, REQ-026 AC2): the state matrix of a component page. It shows the component's `states` demo, which
// marks each state with `data-state="<state>"`, at a chosen viewport width, and the demo's source below it.
import { STATES_DEMO } from '../lib/demos'

const props = defineProps<{ slug: string; source: string }>()
const id = `${props.slug}-state-matrix`
</script>

<template>
  <section class="mt-6" :aria-labelledby="id" data-testid="state-matrix">
    <h3 :id="id" class="text-lg font-semibold">State matrix</h3>
    <ViewportFrame :slug="slug" :demo="STATES_DEMO" />
    <CodeBlock :code="source" :label="`Source of the ${STATES_DEMO} demo`" />
  </section>
</template>
