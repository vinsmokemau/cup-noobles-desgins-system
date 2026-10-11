<script setup lang="ts">
// The composed demo of the forms pattern (REQ-035 AC2). It uses only design system parts, a themed Nuxt UI form, its form
// fields, the text controls, a checkbox, an alert, and buttons, and neutral content: a message to an events team. It shows
// the whole pattern: one column, a visible label on every field, "Opcional" as a hint on the optional one, and validation
// when the person submits. A failed submit shows a summary alert that names how many fields to fix, puts each message under
// its field, and moves focus to the first field with an error. A good submit replaces the form with a success alert.
// The `error` slot is passed only while its field has an error, because Nuxt UI hides the help text whenever the slot
// exists (see the form field doc). The messages are written here, not in a component, so the component stays free of
// copy (A-11). Copy is es-MX.
import { nextTick, reactive, ref } from 'vue'

// The shapes Nuxt UI's form hands over and expects back (the showcase does not import Nuxt UI's types).
interface FormError {
  name: string
  message: string
}
interface FormErrorEvent {
  errors: { id?: string }[]
}

const topics = ['Un evento', 'Una sugerencia', 'Otra cosa']

const state = reactive({ name: '', email: '', topic: undefined as string | undefined, message: '', updates: false })
const form = ref<{ errors: { name?: string }[] }>()
const failed = ref(0)
const sent = ref(false)

function validate(values: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!values.name.trim()) errors.push({ name: 'name', message: 'Escribe tu nombre.' })
  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.push({ name: 'email', message: 'Escribe un correo con arroba, por ejemplo nombre@ejemplo.mx.' })
  }
  if (!values.topic) errors.push({ name: 'topic', message: 'Elige un tema.' })
  return errors
}

const hasError = (name: string) => form.value?.errors.some((error) => error.name === name) ?? false

// The first field with an error takes focus, so a keyboard or screen reader user lands where the fix starts. Nuxt UI keeps
// the form disabled until its submit has finished, and a disabled control cannot take focus, so focus waits one tick.
function onError(event: FormErrorEvent) {
  failed.value = event.errors.length
  const id = event.errors[0]?.id
  if (id) void nextTick(() => document.getElementById(id)?.focus())
}

function onSubmit() {
  failed.value = 0
  sent.value = true
}

function reset() {
  Object.assign(state, { name: '', email: '', topic: undefined, message: '', updates: false })
  failed.value = 0
  sent.value = false
}
</script>

<template>
  <div class="flex max-w-md flex-col gap-4 p-6">
    <UAlert
      v-if="sent"
      role="status"
      color="success"
      variant="outline"
      icon="i-ph-check-circle-bold"
      title="Mensaje enviado"
      description="Te respondemos en uno o dos días."
      :actions="[{ label: 'Escribir otro', color: 'primary', variant: 'ghost', onClick: reset }]"
    />
    <UForm
      v-else
      ref="form"
      :state="state"
      :validate="validate"
      class="flex flex-col gap-4"
      @submit="onSubmit"
      @error="onError"
    >
      <UAlert
        v-if="failed > 0"
        role="alert"
        color="error"
        variant="outline"
        icon="i-ph-x-circle-bold"
        :title="failed === 1 ? 'Revisa 1 campo' : `Revisa ${failed} campos`"
        description="Corrige lo marcado y vuelve a enviar."
      />

      <UFormField name="name" label="Nombre" required>
        <UInput v-model="state.name" autocomplete="name" class="w-full" />
        <template v-if="hasError('name')" #error="{ error }">
          <span class="flex items-center gap-1">
            <UIcon name="i-ph-x-circle-bold" class="size-4 shrink-0" />
            {{ error }}
          </span>
        </template>
      </UFormField>

      <UFormField
        name="email"
        label="Correo electrónico"
        :help="hasError('email') ? undefined : 'Lo usamos solo para responderte.'"
        required
      >
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="nombre@ejemplo.mx"
          class="w-full"
        />
        <template v-if="hasError('email')" #error="{ error }">
          <span class="flex items-center gap-1">
            <UIcon name="i-ph-x-circle-bold" class="size-4 shrink-0" />
            {{ error }}
          </span>
        </template>
      </UFormField>

      <UFormField name="topic" label="Tema" required>
        <USelect v-model="state.topic" :items="topics" placeholder="Elige un tema" class="w-full" />
        <template v-if="hasError('topic')" #error="{ error }">
          <span class="flex items-center gap-1">
            <UIcon name="i-ph-x-circle-bold" class="size-4 shrink-0" />
            {{ error }}
          </span>
        </template>
      </UFormField>

      <UFormField name="message" label="Mensaje" hint="Opcional">
        <UTextarea v-model="state.message" :rows="4" class="w-full" />
      </UFormField>

      <UCheckbox v-model="state.updates" label="Quiero recibir avisos de eventos" />

      <div class="flex flex-wrap gap-3">
        <UButton type="submit" color="primary" variant="solid" label="Enviar mensaje" />
        <UButton type="button" color="primary" variant="ghost" label="Borrar todo" @click="reset" />
      </div>
    </UForm>
  </div>
</template>
