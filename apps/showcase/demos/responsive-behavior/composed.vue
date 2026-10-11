<script setup lang="ts">
// The composed demo of the responsive-behavior pattern (REQ-035 AC2), on neutral content (a community events page). It
// shows the four things a layout does as the screen narrows. A grid of cards goes from one column on the narrowest
// reference viewport to two on the middle one and three on the widest. A sidebar and its content sit side by side from the
// middle viewport and stack below it. A row of actions wraps to the next line when there is no room. A wide table scrolls
// inside its own region, so the page never scrolls sideways. The viewports are the reference widths (A-09, in the doc);
// the breakpoints themselves are TBD-13. Copy is es-MX.
const events = [
  { title: 'Noche de dados', text: 'Seis mesas para cuatro personas.' },
  { title: 'Torneo de tablero', text: 'Empieza a las 7 p. m.' },
  { title: 'Tarde de rol', text: 'Trae tu hoja de personaje.' },
  { title: 'Club de lectura', text: 'Un capítulo por semana.' },
  { title: 'Taller de dibujo', text: 'Materiales incluidos.' },
  { title: 'Cine de anime', text: 'Dos episodios y charla.' },
]
const rows = [
  { mesa: 'Mesa 1', juego: 'Dados', personas: 4, horario: 'Viernes 7 p. m.', lugar: 'Sala principal' },
  { mesa: 'Mesa 2', juego: 'Tablero', personas: 4, horario: 'Viernes 8 p. m.', lugar: 'Sala principal' },
  { mesa: 'Mesa 3', juego: 'Rol', personas: 5, horario: 'Sábado 5 p. m.', lugar: 'Sala de juegos' },
]
</script>

<template>
  <div class="flex flex-col gap-8 p-2">
    <section aria-labelledby="rwd-grid" class="flex flex-col gap-3">
      <h2 id="rwd-grid" class="text-xl font-semibold">Eventos</h2>
      <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="rwd-grid">
        <li v-for="event in events" :key="event.title" data-testid="rwd-card">
          <UCard class="h-full">
            <h3 class="font-semibold">{{ event.title }}</h3>
            <p class="text-muted">{{ event.text }}</p>
          </UCard>
        </li>
      </ul>
    </section>

    <section aria-labelledby="rwd-sidebar" class="flex flex-col gap-3">
      <h2 id="rwd-sidebar" class="text-xl font-semibold">Filtros y resultados</h2>
      <div class="flex flex-col gap-4 md:flex-row" data-testid="rwd-split">
        <aside class="md:w-56 md:shrink-0" data-testid="rwd-side">
          <UCard>
            <p class="font-semibold">Filtros</p>
            <p class="text-muted">Día, juego y sala.</p>
          </UCard>
        </aside>
        <div class="min-w-0 flex-1" data-testid="rwd-main">
          <UCard>
            <p class="text-muted">Los resultados ocupan el resto del ancho.</p>
          </UCard>
        </div>
      </div>
    </section>

    <section aria-labelledby="rwd-actions" class="flex flex-col gap-3">
      <h2 id="rwd-actions" class="text-xl font-semibold">Acciones</h2>
      <div class="flex flex-wrap gap-3">
        <UButton color="primary" variant="solid" label="Apartar lugar" />
        <UButton color="primary" variant="ghost" label="Compartir evento" />
        <UButton color="primary" variant="ghost" label="Agregar al calendario" />
      </div>
    </section>

    <section aria-labelledby="rwd-table" class="flex flex-col gap-3">
      <h2 id="rwd-table" class="text-xl font-semibold">Mesas</h2>
      <div
        class="overflow-x-auto border border-default"
        role="region"
        aria-label="Tabla de mesas, con desplazamiento"
        tabindex="0"
        data-testid="rwd-table"
      >
        <table class="w-full min-w-xl text-left">
          <caption class="sr-only">
            Mesas del evento
          </caption>
          <thead>
            <tr>
              <th scope="col" class="p-2">Mesa</th>
              <th scope="col" class="p-2">Juego</th>
              <th scope="col" class="p-2">Personas</th>
              <th scope="col" class="p-2">Horario</th>
              <th scope="col" class="p-2">Lugar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.mesa">
              <th scope="row" class="p-2">{{ row.mesa }}</th>
              <td class="p-2">{{ row.juego }}</td>
              <td class="p-2">{{ row.personas }}</td>
              <td class="p-2">{{ row.horario }}</td>
              <td class="p-2">{{ row.lugar }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
