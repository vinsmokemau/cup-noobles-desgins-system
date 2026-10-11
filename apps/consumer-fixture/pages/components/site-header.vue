<template>
  <div>
    <UHeader
      title="Cup Noobles"
      to="/"
      mode="slideover"
      :menu="{ side: 'right', title: 'Menú', description: 'Navegación del sitio.' }"
      :toggle="{ color: 'primary', variant: 'ghost' }"
    >
      <nav aria-label="Principal">
        <ul class="flex items-center gap-4">
          <li><ULink to="/components/card">Juegos</ULink></li>
          <li><ULink to="/components/tabs">Eventos</ULink></li>
          <li><ULink to="/components/alert">Ayuda</ULink></li>
        </ul>
      </nav>
      <template #right>
        <UButton label="Entrar" />
      </template>
      <template #body>
        <ul class="flex flex-col gap-3" aria-label="Menú">
          <li><ULink to="/components/card">Juegos</ULink></li>
          <li><ULink to="/components/tabs">Eventos</ULink></li>
          <li><ULink to="/components/alert">Ayuda</ULink></li>
        </ul>
      </template>
    </UHeader>
    <main class="flex flex-col items-start gap-6 p-6">
      <h1>Encabezado del sitio</h1>
    </main>
  </div>
</template>
