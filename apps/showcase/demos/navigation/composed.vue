<script setup lang="ts">
// The composed demo of the navigation pattern (REQ-035 AC2), on neutral content (a community events site). It puts the
// parts of one navigation system together: the site header, whose links show from `lg` up and move into a slideover below
// it; a breadcrumb that shows where the page sits; tabs that switch between views of one page; and pagination that moves
// through a list. Each link or control says where the person is: the current header link has `aria-current="page"`, the
// breadcrumb ends on the current page without a link, the selected tab is marked, and the current page number is marked.
// The accessible names are es-MX. Copy is es-MX.
const crumbs = [
  { label: 'Inicio', to: '#inicio' },
  { label: 'Eventos', to: '#eventos' },
  { label: 'Noche de juegos', active: true },
]
const links = [
  { label: 'Juegos', to: '#juegos', current: false },
  { label: 'Eventos', to: '#eventos', current: true },
  { label: 'Ayuda', to: '#ayuda', current: false },
]
const tabs = [
  { label: 'Reglas', value: 'reglas', content: 'Cada jugador empieza con cinco cartas.' },
  { label: 'Mesas', value: 'mesas', content: 'Hay seis mesas para cuatro personas.' },
  { label: 'Torneos', value: 'torneos', content: 'El torneo empieza a las 7 p. m.' },
]
</script>

<template>
  <div>
    <UHeader
      title="Cup Noobles"
      to="#inicio"
      mode="slideover"
      toggle-side="right"
      :menu="{ side: 'right', title: 'Menú', description: 'Navegación del sitio.' }"
      :toggle="{ color: 'primary', variant: 'ghost' }"
    >
      <nav aria-label="Principal">
        <ul class="flex items-center gap-4">
          <li v-for="link in links" :key="link.to">
            <ULink :to="link.to" :active="link.current" :aria-current="link.current ? 'page' : undefined">
              {{ link.label }}
            </ULink>
          </li>
        </ul>
      </nav>
      <template #right>
        <UButton color="primary" variant="solid" label="Entrar" />
      </template>
      <template #body>
        <nav aria-label="Menú">
          <ul class="flex flex-col gap-3">
            <li v-for="link in links" :key="link.to">
              <ULink :to="link.to" :active="link.current" :aria-current="link.current ? 'page' : undefined">
                {{ link.label }}
              </ULink>
            </li>
          </ul>
        </nav>
      </template>
    </UHeader>

    <div class="flex flex-col gap-6 p-4">
      <UBreadcrumb :items="crumbs" aria-label="Ruta de navegación" />
      <h1 class="text-2xl font-bold">Noche de juegos</h1>
      <UTabs :items="tabs" default-value="reglas" class="w-full" />
      <UPagination
        :total="90"
        :items-per-page="10"
        :default-page="2"
        :sibling-count="1"
        :show-controls="false"
        show-edges
      >
        <template #prev>
          <UButton color="neutral" variant="outline" icon="i-ph-caret-left-bold" aria-label="Página anterior" />
        </template>
        <template #item="{ item, page }">
          <UButton
            :color="page === item.value ? 'primary' : 'neutral'"
            :variant="page === item.value ? 'solid' : 'outline'"
            :label="String(item.value)"
            :aria-label="`Página ${item.value}`"
            square
          />
        </template>
        <template #next>
          <UButton color="neutral" variant="outline" icon="i-ph-caret-right-bold" aria-label="Página siguiente" />
        </template>
      </UPagination>
    </div>
  </div>
</template>
