// The controls of the alert playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'type', type: 'select', options: ['info', 'success', 'warning', 'error'], default: 'info' },
  { name: 'title', type: 'string', default: 'Nueva versión disponible' },
  { name: 'description', type: 'string', default: 'Recarga la página para verla.' },
  { name: 'close', type: 'boolean', default: true },
]
