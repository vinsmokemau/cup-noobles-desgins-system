<script setup lang="ts">
// The composed demo of the feedback pattern (REQ-035 AC2). It shows the four ways the system tells people something, each
// on neutral content (a profile page of a community app): a banner for something about the whole page, an inline alert
// for something about one block, a toast for the result of an action that needs no decision, and a dialog for a decision
// that must be made before going on. Every kind has a title, an icon of its own, and a label on its close button, so the
// type is never told by color alone (WCAG 1.4.1). The page's toaster is off on demo routes (app.vue), so this demo has one.
// Copy is es-MX.
import { ref } from 'vue'

const banner = ref(true)
const inline = ref(true)
const toast = useToast()

function save() {
  toast.add({
    title: 'Cambios guardados',
    description: 'Tu perfil ya está actualizado.',
    color: 'success',
    icon: 'i-ph-check-circle-bold',
    close: { 'aria-label': 'Cerrar aviso' },
  })
}
</script>

<template>
  <div class="flex max-w-2xl flex-col gap-8 p-6">
    <section aria-labelledby="feedback-banner" class="flex flex-col gap-3">
      <h2 id="feedback-banner" class="text-lg font-semibold">Banner</h2>
      <UAlert
        v-if="banner"
        role="status"
        color="info"
        variant="outline"
        icon="i-ph-info-bold"
        title="Mantenimiento el sábado"
        description="El sitio estará en pausa de 2 a 3 a. m."
        :close="{ 'aria-label': 'Cerrar aviso' }"
        @update:open="banner = false"
      />
      <UButton v-else type="button" color="primary" variant="ghost" label="Mostrar banner" @click="banner = true" />
    </section>

    <section aria-labelledby="feedback-inline" class="flex flex-col gap-3">
      <h2 id="feedback-inline" class="text-lg font-semibold">Aviso en línea</h2>
      <UAlert
        v-if="inline"
        color="warning"
        variant="outline"
        icon="i-ph-warning-bold"
        title="Tu sesión termina pronto"
        description="Guarda lo que estás haciendo."
        :close="{ 'aria-label': 'Cerrar aviso' }"
        @update:open="inline = false"
      />
      <UButton v-else type="button" color="primary" variant="ghost" label="Mostrar aviso" @click="inline = true" />
    </section>

    <section aria-labelledby="feedback-toast" class="flex flex-col items-start gap-3">
      <h2 id="feedback-toast" class="text-lg font-semibold">Toast</h2>
      <UButton type="button" color="primary" variant="solid" label="Guardar cambios" @click="save" />
      <UToaster />
    </section>

    <section aria-labelledby="feedback-dialog" class="flex flex-col items-start gap-3">
      <h2 id="feedback-dialog" class="text-lg font-semibold">Diálogo</h2>
      <UModal
        title="Borrar borrador"
        description="No podrás recuperarlo después."
        :close="{ color: 'primary', variant: 'ghost', 'aria-label': 'Cerrar diálogo' }"
      >
        <UButton type="button" color="secondary" variant="solid" label="Borrar borrador" />
        <template #footer="{ close }">
          <UButton type="button" color="primary" variant="solid" label="Borrar" @click="close" />
          <UButton type="button" color="primary" variant="ghost" label="Cancelar" @click="close" />
        </template>
      </UModal>
    </section>
  </div>
</template>
