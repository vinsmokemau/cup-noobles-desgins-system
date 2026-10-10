<script setup lang="ts">
// The playground of the sticker frame. The controls in controls.ts set these props: the kind of content the frame wraps.
// Copy is es-MX.
withDefaults(defineProps<{ content?: 'text' | 'long-word' | 'wide' }>(), { content: 'text' })
</script>

<template>
  <div class="p-6">
    <CnStickerFrame>
      <p v-if="content === 'text'">¡Nuevo ingreso!</p>
      <p v-else-if="content === 'long-word'">
        Superlargapalabrasinningunespacioquedebeajustarseaanchodelmarcoenpantallaspequeñas
      </p>
      <div v-else class="w-screen">Contenido más ancho que la pantalla</div>
    </CnStickerFrame>
  </div>
</template>
