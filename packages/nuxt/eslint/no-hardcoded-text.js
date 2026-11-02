// cn/no-hardcoded-text (REQ-022 AC2, A-11): components render no hardcoded user-visible string. Every
// string arrives through a prop or slot. Text inside an aria-hidden element is decorative and allowed.

const isTrue = (value) => value === true || value === 'true'

const isAriaHidden = (element) =>
  element.startTag.attributes.some((attribute) => {
    if (!attribute.directive) return attribute.key.rawName === 'aria-hidden' && attribute.value?.value === 'true'
    const { name, argument } = attribute.key
    const expression = attribute.value?.expression
    return (
      name.name === 'bind' &&
      argument?.type === 'VIdentifier' &&
      argument.rawName === 'aria-hidden' &&
      expression?.type === 'Literal' &&
      isTrue(expression.value)
    )
  })

const insideAriaHidden = (node) => {
  for (let parent = node.parent; parent?.type === 'VElement'; parent = parent.parent) {
    if (isAriaHidden(parent)) return true
  }
  return false
}

// `{{ 'Text' }}` and `{{ `Text` }}` render a hardcoded string just like a text node does.
const isStaticString = (expression) =>
  (expression?.type === 'Literal' && typeof expression.value === 'string' && expression.value.trim() !== '') ||
  (expression?.type === 'TemplateLiteral' &&
    expression.expressions.length === 0 &&
    (expression.quasis[0]?.value.cooked ?? '').trim() !== '')

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow hardcoded text in component templates (REQ-022 AC2)' },
    messages: {
      text: 'Hardcoded text "{{ text }}". Pass user-visible strings through a prop or slot, or mark decorative text aria-hidden (REQ-022 AC2).',
    },
    schema: [],
  },
  create(context) {
    const defineTemplateBodyVisitor = context.sourceCode.parserServices?.defineTemplateBodyVisitor
    if (typeof defineTemplateBodyVisitor !== 'function') return {}
    return defineTemplateBodyVisitor({
      VText(node) {
        const text = node.value.trim()
        if (text && !insideAriaHidden(node)) context.report({ node, messageId: 'text', data: { text } })
      },
      'VElement > VExpressionContainer'(node) {
        if (isStaticString(node.expression) && !insideAriaHidden(node)) {
          context.report({ node, messageId: 'text', data: { text: context.sourceCode.getText(node.expression) } })
        }
      },
    })
  },
}
