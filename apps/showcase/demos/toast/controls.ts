// The controls of the toast playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'type', type: 'select', options: ['info', 'success', 'warning', 'error'], default: 'info' },
  { name: 'title', type: 'string', default: 'Cambios guardados' },
  { name: 'description', type: 'string', default: 'Tu perfil ya está actualizado.' },
  { name: 'close', type: 'boolean', default: true },
  { name: 'action', type: 'boolean', default: false },
]
