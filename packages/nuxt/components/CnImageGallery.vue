<script setup lang="ts">
// CnImageGallery (T15.3, DSR-03): a gallery of pictures, one at a time, with previous and next controls and one dot for each
// picture. It composes Nuxt UI's `UCarousel` (Embla), which gives the swipe, the arrow keys, and the sliding, and the layer
// themes it (`ui.carousel` in app.config.ts). It is custom only because `UCarousel` cannot serve alone (ADR-0066, REQ-020
// AC2): its slides are bare slots, so a picture that fails would show a broken-image icon; its dots are 12 px, under the
// 24 px target of REQ-028 AC2; and its controls name themselves in English and sit outside the frame at `sm`, past the edge of
// a 360 px page.
//
// Every picture sits in a 4:3 frame and the whole picture shows, never cropped (ADR-0056). A picture with no `src`, or one that
// fails to load, shows the brand d20 on black, marked decorative, and never a broken-image icon (ADR-0057).
//
// The component holds no text of its own (A-11): the name of the gallery, the names of the controls, and the alternative text of
// each picture all arrive through props. A gallery with no pictures renders nothing, and one picture shows no controls. Under
// reduced motion the slide moves at once (REQ-029 AC2). The layer declares no `vue` dependency (Nuxt provides it).
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { clampPosition, pictureProblem } from '../utils/image-gallery'

const FALLBACK = new URL('../assets/brand/D20-CN.svg', import.meta.url).href

type Picture = { src?: string; alt: string; decorative?: false } | { src?: string; decorative: true; alt?: string }

const props = defineProps<{
  /** The pictures, in order. Each needs `alt`, or `decorative: true`. A gallery with none renders nothing. */
  items: Picture[]
  /** The accessible name of the gallery. */
  label: string
  /** The picture the gallery opens on, counting from 0. Default 0, the first. */
  startIndex?: number
  /** The gallery is above the fold: the opening picture also asks for high fetch priority. Default false (T15.8). */
  priority?: boolean
  /** The accessible names of the controls. All of them are copy, so all of them arrive here (A-11). */
  labels: {
    previous: string
    next: string
    /** The name of the group of dots. */
    dots: string
    /** The name of the dot of one picture, from its position (1 to `total`). */
    dot: (position: number, total: number) => string
    /** What a screen reader hears when the picture changes, such as "Imagen 2 de 5". */
    position: (position: number, total: number) => string
  }
}>()

// A picture that fails to load, including one that failed before the page hydrated, is swapped for the fallback in place.
type Image = {
  src: string
  alt: string
  complete: boolean
  naturalWidth: number
  classList: { add(name: string): void; contains(name: string): boolean }
  setAttribute(name: string, value: string): void
}
const FALLBACK_CLASS = 'cn-image-gallery__image--fallback'
function showFallback(image: Image) {
  if (image.classList.contains(FALLBACK_CLASS)) return
  image.src = FALLBACK
  image.alt = ''
  image.setAttribute('aria-hidden', 'true')
  image.classList.add(FALLBACK_CLASS)
}
function checkLoaded(image: Image) {
  if (image.complete && image.naturalWidth === 0) showFallback(image)
}

if (process.env.NODE_ENV !== 'production') {
  const problem = pictureProblem(props.items)
  if (problem) console.warn(problem)
}

const carousel = useTemplateRef<{ emblaApi?: { scrollTo(index: number, jump?: boolean): void } }>('carousel')
const selected = ref(clampPosition(props.startIndex ?? 0, props.items.length))
// T15.8 (DSR-11, ADR-0068): the picture the gallery opens on loads at once, the others lazily. Every image carries `width="4"` and `height="3"`, the ratio of the frame, as a hint only.
const opening = computed(() => clampPosition(props.startIndex ?? 0, props.items.length))
const last = computed(() => props.items.length - 1)
function onSelect(position: number) {
  selected.value = clampPosition(position, props.items.length)
}

// Embla animates in script, so CSS cannot switch the movement off. Under reduced motion the speed is set so that a slide lands at once.
const reducedMotion = ref(false)
onMounted(() => {
  const query = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = query.matches
  query.addEventListener('change', (event) => (reducedMotion.value = event.matches))
})
function go(position: number) {
  carousel.value?.emblaApi?.scrollTo(clampPosition(position, props.items.length), reducedMotion.value)
}
</script>

<template>
  <div v-if="items.length" class="cn-image-gallery">
    <UCarousel
      ref="carousel"
      :items="items"
      :aria-label="label"
      :start-index="clampPosition(startIndex ?? 0, items.length)"
      :duration="reducedMotion ? 0 : undefined"
      @select="onSelect"
    >
      <template #default="{ item, index }">
        <div class="cn-image-gallery__frame" :data-position="index + 1">
          <img
            class="cn-image-gallery__image"
            :class="{ 'cn-image-gallery__image--fallback': !item.src }"
            :src="item.src || FALLBACK"
            :alt="item.src && !item.decorative ? item.alt : ''"
            :aria-hidden="!item.src || item.decorative ? 'true' : undefined"
            width="4"
            height="3"
            :loading="index === opening ? 'eager' : 'lazy'"
            :fetchpriority="priority && index === opening ? 'high' : undefined"
            draggable="false"
            @error="showFallback($event.target as unknown as Image)"
            @vue:mounted="({ el }: { el: Image }) => item.src && checkLoaded(el)"
          />
        </div>
      </template>
    </UCarousel>
    <div v-if="items.length > 1" class="cn-image-gallery__controls">
      <UButton
        color="primary"
        variant="ghost"
        icon="i-ph-caret-left-bold"
        square
        :aria-label="labels.previous"
        :disabled="selected <= 0"
        @click="go(selected - 1)"
      />
      <div role="group" :aria-label="labels.dots" class="cn-image-gallery__dots">
        <button
          v-for="(_, index) in items"
          :key="index"
          type="button"
          class="cn-image-gallery__dot"
          :aria-label="labels.dot(index + 1, items.length)"
          :aria-current="index === selected ? 'true' : undefined"
          :data-current="index === selected ? 'true' : undefined"
          @click="go(index)"
        />
      </div>
      <UButton
        color="primary"
        variant="ghost"
        icon="i-ph-caret-right-bold"
        square
        :aria-label="labels.next"
        :disabled="selected >= last"
        @click="go(selected + 1)"
      />
    </div>
    <p class="sr-only" aria-live="polite">{{ labels.position(selected + 1, items.length) }}</p>
  </div>
</template>
