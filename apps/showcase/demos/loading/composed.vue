<script setup lang="ts">
// The composed demo of the loading pattern (REQ-035 AC2), on neutral content (a profile page of a community app). It
// shows the three things people see while they wait. Skeleton: a shape for each piece of content, in the layout the
// content will have, next to the finished content, so the two can be compared. Spinner: the system has no standalone
// spinner, so the spinner is the loading state of a button, which keeps its label. Progress: a bar with a visible label,
// for a task whose amount is known, and an indeterminate bar for one whose amount is not. A group of skeleton shapes is
// named once by a `status` wrapper, and its shapes are hidden from assistive technology (see the skeleton doc). Copy is es-MX.
import { onBeforeUnmount, ref } from 'vue'

const saving = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function save() {
  saving.value = true
  timer = setTimeout(() => (saving.value = false), 2000)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="flex max-w-2xl flex-col gap-8 p-6">
    <section aria-labelledby="loading-skeleton" class="flex flex-col gap-4">
      <h2 id="loading-skeleton" class="text-lg font-semibold">Esqueleto</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p class="mb-2 text-sm font-medium">Cargando</p>
          <div role="status" aria-busy="true" aria-label="Cargando perfil" class="flex items-center gap-4 p-1">
            <USkeleton as="span" aria-hidden="true" class="size-12 shrink-0 rounded-full" />
            <span class="flex min-w-0 flex-1 flex-col gap-2">
              <USkeleton as="span" aria-hidden="true" class="block h-4 w-full" />
              <USkeleton as="span" aria-hidden="true" class="block h-4 w-3/5" />
            </span>
          </div>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium">Listo</p>
          <div class="flex items-center gap-4 p-1">
            <UIcon name="i-ph-user-circle-bold" class="size-12 shrink-0" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <p class="font-medium">Ana Torres</p>
              <p class="text-sm">Miembro desde 2024</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="loading-spinner" class="flex flex-col items-start gap-3">
      <h2 id="loading-spinner" class="text-lg font-semibold">Spinner</h2>
      <UButton
        type="button"
        color="primary"
        variant="solid"
        label="Guardar cambios"
        :loading="saving"
        :aria-busy="saving ? 'true' : undefined"
        @click="save"
      />
    </section>

    <section aria-labelledby="loading-progress" class="flex flex-col gap-4">
      <h2 id="loading-progress" class="text-lg font-semibold">Progreso</h2>
      <div class="flex flex-col gap-2">
        <span class="text-sm">Subiendo portada</span>
        <UProgress :model-value="62" size="lg" :get-value-label="() => 'Subiendo portada'" />
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm">Procesando imagen</span>
        <UProgress :model-value="null" size="lg" :get-value-label="() => 'Procesando imagen'" />
      </div>
    </section>
  </div>
</template>
