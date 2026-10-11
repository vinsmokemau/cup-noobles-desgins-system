// The controls of the tooltip playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'text', type: 'string', default: 'Guardar los cambios' },
  { name: 'side', type: 'select', options: ['top', 'right', 'bottom', 'left'], default: 'bottom' },
  { name: 'disabled', type: 'boolean', default: false },
]
