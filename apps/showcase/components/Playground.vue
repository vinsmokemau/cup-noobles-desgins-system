<script setup lang="ts">
// T7.1 (REQ-055 AC1): the playground. One control per entry of the component's `controls.ts` (prop name, type, and
// options). The controls' values are sent to the `playground` demo as its props, live, in the viewport frame.
import { reactive } from 'vue'
import { defaultValues, PLAYGROUND_DEMO, type Control, type ControlValue } from '../lib/demos'

const props = defineProps<{ slug: string; controls: Control[]; source: string }>()
const id = `${props.slug}-playground`
const values = reactive<Record<string, ControlValue>>(defaultValues(props.controls))
</script>

<template>
  <section class="mt-6" :aria-labelledby="id" data-testid="playground">
    <h3 :id="id" class="text-lg font-semibold">Playground</h3>
    <div class="mt-2 flex flex-col gap-4 lg:flex-row">
      <div role="group" aria-label="Props" class="flex flex-col gap-4 lg:w-64 lg:shrink-0">
        <UFormField v-for="control in controls" :key="control.name" :label="control.name">
          <USwitch
            v-if="control.type === 'boolean'"
            size="xl"
            :model-value="values[control.name] as boolean"
            @update:model-value="values[control.name] = $event"
          />
          <USelect
            v-else-if="control.type === 'select'"
            class="w-full"
            :items="control.options"
            :model-value="values[control.name] as string"
            @update:model-value="values[control.name] = $event"
          />
          <UInput
            v-else-if="control.type === 'number'"
            class="w-full"
            type="number"
            :aria-label="control.name"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            :model-value="values[control.name] as number"
            @update:model-value="values[control.name] = Number($event)"
          />
          <UInput
            v-else
            class="w-full"
            :aria-label="control.name"
            :model-value="values[control.name] as string"
            @update:model-value="values[control.name] = String($event)"
          />
        </UFormField>
      </div>
      <div class="min-w-0 flex-1">
        <ViewportFrame :slug="slug" :demo="PLAYGROUND_DEMO" :demo-props="values" />
      </div>
    </div>
    <CodeBlock :code="source" :label="`Source of the ${PLAYGROUND_DEMO} demo`" />
  </section>
</template>
