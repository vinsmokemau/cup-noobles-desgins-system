// The controls of the badge playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'variant', type: 'select', options: ['primary', 'outline', 'tag'], default: 'primary' },
  { name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
  { name: 'label', type: 'string', default: 'Juegos de mesa' },
  { name: 'withIcon', type: 'boolean', default: false },
]
