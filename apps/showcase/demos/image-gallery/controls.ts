// The controls of the image gallery playground (REQ-055): the prop name, its type, and, for a select, its options.
export default [
  { name: 'count', type: 'number', default: 3, min: 0, max: 5 },
  {
    name: 'source',
    type: 'select',
    options: ['brand', '3:2', '5:7', '1:1', 'missing', 'broken'],
    default: 'brand',
  },
  { name: 'decorative', type: 'boolean', default: false },
]
