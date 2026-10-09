<script setup lang="ts">
// T7.1 (REQ-055 AC3, SPEC.md §4.6): `/_demo/[slug]/[demo]`, one demo on its own page, with none of the showcase's layout
// around it. The component pages show it in an iframe (ViewportFrame), so the demo's media queries respond to the
// iframe's width. The tests open it directly too, for axe and for the state baselines (tests/e2e/helpers/states.ts).
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { createError, useRoute, useRuntimeConfig, useSeoMeta } from 'nuxt/app'
import { demoComponent, demoControls } from '../../../lib/demo-registry'
import { defaultValues, MESSAGE_HEIGHT, MESSAGE_PROPS, PLAYGROUND_DEMO, type ControlValue } from '../../../lib/demos'

definePageMeta({ layout: false })

const params = useRoute().params as { slug: string; demo: string }
const listed = (useRuntimeConfig().public.demos as Record<string, string[]>)[params.slug]
const load = listed?.includes(params.demo) ? demoComponent(params.slug, params.demo) : undefined
if (!load) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({ title: `${params.slug} ${params.demo} demo`, robots: 'noindex' })

const demo = defineAsyncComponent(load)
// Only the playground demo takes props. The parent sets them with a message, and these are what it starts with.
const isPlayground = params.demo === PLAYGROUND_DEMO
const values = ref<Record<string, ControlValue>>(isPlayground ? defaultValues(await demoControls(params.slug)) : {})

const root = ref<HTMLElement>()
let observer: ResizeObserver | undefined

function reportHeight() {
  if (window.parent === window || !root.value) return
  const height = Math.ceil(root.value.getBoundingClientRect().height)
  window.parent.postMessage({ type: MESSAGE_HEIGHT, height }, window.location.origin)
}

function onMessage(event: MessageEvent) {
  if (event.origin !== window.location.origin || event.source !== window.parent) return
  const data = event.data as { type?: string; props?: Record<string, ControlValue> }
  if (isPlayground && data.type === MESSAGE_PROPS && data.props) values.value = data.props
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  observer = new ResizeObserver(reportHeight)
  if (root.value) observer.observe(root.value)
  reportHeight()
})
onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  observer?.disconnect()
})
</script>

<template>
  <div ref="root" class="p-4" data-testid="demo-root">
    <component :is="demo" v-bind="values" />
  </div>
</template>
