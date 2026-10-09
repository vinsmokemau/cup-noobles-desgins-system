// The controls of the input playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
  { name: 'placeholder', type: 'string', default: 'nombre@ejemplo.mx' },
  { name: 'disabled', type: 'boolean', default: false },
  { name: 'error', type: 'boolean', default: false },
]
