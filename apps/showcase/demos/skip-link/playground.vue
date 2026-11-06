<script setup lang="ts">
// The playground of the skip link. The controls in controls.ts set these props: `label` is the text of the link, and `shown`
// forces the shown state with `data-cn-state`, because a page cannot hold keyboard focus. With `shown` off, the link is
// hidden, and Tab reveals it. The stage contains the fixed link, as in the state matrix, and a `CnMain` below the header is
// the target, so Enter moves focus there.
withDefaults(defineProps<{ label?: string; shown?: boolean }>(), { label: 'Saltar al contenido', shown: true })
</script>

<template>
  <div class="relative h-40 overflow-hidden [contain:paint]">
    <CnSkipLink :label="label" target="contenido" :data-cn-state="shown ? 'focus-visible' : undefined" />
    <div class="flex h-16 items-center gap-4 border-b-4 border-primary px-6">
      <CnLogo variant="icon" label="Cup Noobles" />
      <nav aria-label="Principal">
        <ul class="flex items-center gap-4">
          <li><ULink to="#juegos">Juegos</ULink></li>
          <li><ULink to="#eventos">Eventos</ULink></li>
        </ul>
      </nav>
    </div>
    <CnMain id="contenido" class="p-6"><p>Contenido principal de la página.</p></CnMain>
  </div>
</template>
