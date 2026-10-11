<template>
  <div>
    <main class="flex flex-col items-start gap-6 p-6">
      <h1>Pie del sitio</h1>
    </main>
    <UFooter>
      <template #left>
        <p class="text-sm">© 2026 Cup Noobles</p>
      </template>
      <nav aria-label="Pie de página">
        <ul class="flex flex-wrap items-center justify-center gap-4">
          <li><ULink to="/components/alert">Ayuda</ULink></li>
          <li><ULink to="/components/card">Términos</ULink></li>
          <li><ULink to="/components/tabs">Privacidad</ULink></li>
        </ul>
      </nav>
      <template #right>
        <UButton label="Contacto" variant="ghost" />
      </template>
    </UFooter>
  </div>
</template>
