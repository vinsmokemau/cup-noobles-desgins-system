<script setup lang="ts">
// T7.1 (REQ-055 AC3): shows a demo at 360, 768, or 1280 px. The demo runs on its own isolated route
// (`/_demo/[slug]/[demo]`) inside an iframe of that width, so the demo's media queries answer to the iframe's width and
// not to the page's. The demo reports its height, and the playground sends its props, through `postMessage`.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'nuxt/app'
import { demoRoute, MESSAGE_HEIGHT, MESSAGE_PROPS, VIEWPORTS, type ControlValue } from '../lib/demos'

const props = defineProps<{
  slug: string
  demo: string
  /** The props the playground sets on the demo. Left out for a demo that takes none. */
  demoProps?: Record<string, ControlValue>
}>()

const width = ref<(typeof VIEWPORTS)[number]>(VIEWPORTS[0])
const height = ref(240)
const frame = ref<HTMLIFrameElement>()
const src = useRouter().resolve(demoRoute(props.slug, props.demo)).href

function sendProps() {
  if (!props.demoProps) return
  const message = { type: MESSAGE_PROPS, props: JSON.parse(JSON.stringify(props.demoProps)) as unknown }
  frame.value?.contentWindow?.postMessage(message, window.location.origin)
}

function onMessage(event: MessageEvent) {
  if (event.origin !== window.location.origin || event.source !== frame.value?.contentWindow) return
  const data = event.data as { type?: string; height?: number }
  if (data.type === MESSAGE_HEIGHT && typeof data.height === 'number') height.value = data.height
}

onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
watch(() => props.demoProps, sendProps, { deep: true })
</script>

<template>
  <div data-testid="viewport-frame">
    <div role="group" aria-label="Viewport width" class="flex flex-wrap gap-2">
      <UButton
        v-for="option in VIEWPORTS"
        :key="option"
        size="sm"
        color="neutral"
        :variant="width === option ? 'solid' : 'outline'"
        :aria-pressed="width === option"
        :label="`${option} px`"
        @click="width = option"
      />
    </div>
    <!-- The iframe is wider than a small page, so this region scrolls sideways. The keyboard needs to reach it. -->
    <div
      class="mt-2 max-w-full overflow-x-auto border border-default"
      role="region"
      :aria-label="`${demo} demo at ${width} px`"
      tabindex="0"
    >
      <iframe
        ref="frame"
        :src="src"
        :title="`${slug} ${demo} demo`"
        :style="{ width: `${width}px`, height: `${height}px` }"
        class="block max-w-none border-0"
        :data-width="width"
        @load="sendProps"
      />
    </div>
  </div>
</template>
