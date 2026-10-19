// The controls of the media card playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'title', type: 'string', default: 'Noche de juegos de mesa' },
  { name: 'alt', type: 'string', default: 'Un dado de veinte caras dorado' },
  { name: 'decorative', type: 'boolean', default: false },
  { name: 'source', type: 'select', options: ['d20', '3:2', '5:7', '1:1', 'missing', 'broken'], default: 'd20' },
  { name: 'linked', type: 'boolean', default: true },
  { name: 'tagCount', type: 'number', default: 2 },
]
