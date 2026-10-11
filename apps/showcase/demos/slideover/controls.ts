// The controls of the slideover playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'title', type: 'string', default: 'Filtros' },
  { name: 'description', type: 'string', default: 'Elige qué juegos quieres ver.' },
  { name: 'side', type: 'select', options: ['right', 'left', 'top', 'bottom'], default: 'right' },
  { name: 'dismissible', type: 'boolean', default: true },
]
