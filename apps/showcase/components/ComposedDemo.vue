<script setup lang="ts">
// T9.1 (REQ-035 AC2): the composed demo of a pattern page. It shows the doc's `composed` demo at a chosen viewport width,
// and the demo's source below it, like the state matrix of a component page.
import { COMPOSED_DEMO } from '../lib/demos'

const props = defineProps<{ slug: string; source: string }>()
const id = `${props.slug}-composed-demo`
</script>

<template>
  <section class="mt-6" :aria-labelledby="id" data-testid="composed-demo">
    <h3 :id="id" class="text-lg font-semibold">Composed demo</h3>
    <ViewportFrame :slug="slug" :demo="COMPOSED_DEMO" />
    <CodeBlock :code="source" :label="`Source of the ${COMPOSED_DEMO} demo`" />
  </section>
</template>
