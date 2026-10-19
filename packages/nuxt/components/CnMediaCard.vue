<script setup lang="ts">
// CnMediaCard (REQ-025 AC2, AC4): the featured media card of BR-12, a thumbnail, a title, and tag badges, with an optional
// link target. Nuxt UI has no equivalent (REQ-020 AC2), so it is custom, but it composes ULink and UBadge. The look is the
// standard card's (ADR-0018, ADR-0026): the black page, a thick pink outline, no glow.
//
// The thumbnail sits in a 4:3 frame and the whole picture shows, never cropped (ADR-0056). A missing picture, or one that
// fails to load, shows the brand d20 on black, marked decorative, and never a broken-image icon (ADR-0057).
//
// The thumbnail needs `alt`, or the explicit `decorative` flag (REQ-025 AC2). The types ask for it in a consumer's templates, and
// the development warning below (`thumbnailProblem`, utils/media-card.ts) also covers a thumbnail given through the `thumbnail`\n// slot, and a call that bypasses the types.
//
// When `to` is set the whole card is one link (REQ-025 AC4). The link is the title, and its ::after covers the card, so the
// card has exactly one focusable element and its accessible name is the title. Nothing else in the card is focusable. The
// component holds no text of its own (A-11). The layer declares no `vue` dependency (Nuxt provides it).
import { thumbnailProblem } from '../utils/media-card'

const FALLBACK = new URL('../assets/brand/D20-CN.svg', import.meta.url).href

type Base = {
  title: string
  /** Tag badge labels, one badge each. */
  tags?: string[]
  /** Link target. When set, the whole card is one link and the title is its accessible name. */
  to?: string
  /** Heading level of the title. Default h3. */
  as?: 'h2' | 'h3' | 'h4'
}
type Props =
  | (Base & { src: string; alt: string; decorative?: false })
  | (Base & { src: string; decorative: true; alt?: string })
  | (Base & { src?: undefined; alt?: string; decorative?: boolean })

const props = defineProps<Props>()
const slots = defineSlots<{
  /** A thumbnail of your own. It receives the `alt` and `decorative` props, which it must apply to its image. */
  thumbnail?(props: { alt?: string; decorative: boolean }): unknown
}>()

// A picture that fails to load, including one that failed before the page hydrated, is swapped for the fallback in place.
type Picture = {
  src: string
  alt: string
  complete: boolean
  naturalWidth: number
  classList: { add(name: string): void; contains(name: string): boolean }
  setAttribute(name: string, value: string): void
}
const FALLBACK_CLASS = 'cn-media-card__image--fallback'
function showFallback(picture: Picture) {
  if (picture.classList.contains(FALLBACK_CLASS)) return
  picture.src = FALLBACK
  picture.alt = ''
  picture.setAttribute('aria-hidden', 'true')
  picture.classList.add(FALLBACK_CLASS)
}
function checkLoaded(picture: Picture) {
  if (picture.complete && picture.naturalWidth === 0) showFallback(picture)
}

if (process.env.NODE_ENV !== 'production') {
  const problem = thumbnailProblem({
    hasThumbnail: Boolean(props.src) || Boolean(slots.thumbnail),
    decorative: props.decorative,
    alt: props.alt,
  })
  if (problem) console.warn(problem)
}
</script>

<template>
  <article class="cn-media-card" :data-linked="to ? 'true' : undefined">
    <div class="cn-media-card__thumbnail">
      <slot name="thumbnail" :alt="alt" :decorative="Boolean(decorative)">
        <img
          class="cn-media-card__image"
          :class="{ 'cn-media-card__image--fallback': !src }"
          :src="src || FALLBACK"
          :alt="src && !decorative ? alt : ''"
          :aria-hidden="!src || decorative ? 'true' : undefined"
          draggable="false"
          @error="showFallback($event.target as Picture)"
          @vue:mounted="({ el }: { el: Picture }) => src && checkLoaded(el)"
        />
      </slot>
    </div>
    <div class="cn-media-card__body">
      <component :is="as ?? 'h3'" class="cn-media-card__title">
        <ULink v-if="to" :to="to" raw class="cn-media-card__link">{{ title }}</ULink>
        <template v-else>{{ title }}</template>
      </component>
      <div v-if="tags?.length" class="cn-media-card__tags">
        <UBadge v-for="tag in tags" :key="tag" :label="tag" color="secondary" variant="solid" />
      </div>
    </div>
  </article>
</template>
