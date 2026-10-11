<script setup lang="ts">
// T10.5 (REQ-058): the preview of one compiled email. `html` is the exact text of the file in packages/email/dist/ with
// its `{{ slot_name }}` placeholders, so what is shown, and what "Copy HTML" copies, is the file (AC2). The email runs in a
// sandboxed iframe (AC1): the frame has no scripts, so the markup of a backend template cannot reach the showcase.
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { EMAIL_SANDBOX, EMAIL_TITLES, EMAIL_WIDTHS } from '../lib/email-previews'

const props = defineProps<{ name: string; html: string }>()

const title = EMAIL_TITLES[props.name] ?? props.name
const id = `email-preview-${props.name}`
const width = ref<(typeof EMAIL_WIDTHS)[number]>(EMAIL_WIDTHS[0])
const height = ref(480)
const frame = ref<HTMLIFrameElement>()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

// The frame is as tall as its email, so the page scrolls and the frame does not. A narrower frame wraps the text, so
// the height is measured again after the width changes.
async function measure() {
  await nextTick()
  const document = frame.value?.contentDocument
  if (document?.documentElement) height.value = document.documentElement.scrollHeight
}

function setWidth(option: (typeof EMAIL_WIDTHS)[number]) {
  width.value = option
  void measure()
}

async function copy() {
  await navigator.clipboard.writeText(props.html)
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 2000)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section class="mt-6" :aria-labelledby="id" data-testid="email-preview" :data-email="name">
    <h3 :id="id" class="text-lg font-semibold">{{ title }}</h3>
    <div class="mt-2 flex flex-wrap items-center gap-2">
      <div role="group" aria-label="Preview width" class="flex flex-wrap gap-2">
        <UButton
          v-for="option in EMAIL_WIDTHS"
          :key="option"
          size="sm"
          color="neutral"
          :variant="width === option ? 'solid' : 'outline'"
          :aria-pressed="width === option"
          :label="`${option} px`"
          @click="setWidth(option)"
        />
      </div>
      <span class="flex-1" />
      <span role="status" class="text-sm text-muted">{{ copied ? 'Copied' : '' }}</span>
      <UButton
        size="sm"
        color="neutral"
        variant="outline"
        icon="i-ph-copy-bold"
        label="Copy HTML"
        data-testid="email-copy"
        @click="copy"
      />
    </div>
    <!-- The frame is wider than a small page, so this region scrolls sideways. The keyboard needs to reach it. -->
    <div
      class="mt-2 max-w-full overflow-x-auto border border-default"
      role="region"
      :aria-label="`${title} email at ${width} px`"
      tabindex="0"
    >
      <iframe
        ref="frame"
        :srcdoc="html"
        :sandbox="EMAIL_SANDBOX"
        referrerpolicy="no-referrer"
        :title="`${title} email`"
        :style="{ width: `${width}px`, height: `${height}px` }"
        class="block max-w-none border-0"
        :data-width="width"
        data-testid="email-frame"
        @load="measure"
      />
    </div>
  </section>
</template>
