// cn/no-raw-values (REQ-016): visual values come only from var(--cn-*), token imports, or the Nuxt UI
// theme config that reads tokens. Runs on JS, TS, and Vue files (script, template, and <style> blocks),
// and on CSS files parsed by @eslint/css.
import { findRawValues, findRawValuesInCss } from './raw-values.js'

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow raw color, px, rem, and ms literals (REQ-016)' },
    messages: {
      raw: 'Raw visual value "{{ value }}". Use a var(--cn-*) token, a token import, or the Nuxt UI theme config (REQ-016).',
    },
    schema: [],
  },
  create(context) {
    const { sourceCode } = context
    const reportAt = (start, value) =>
      context.report({
        loc: { start: sourceCode.getLocFromIndex(start), end: sourceCode.getLocFromIndex(start + value.length) },
        messageId: 'raw',
        data: { value },
      })
    const checkText = (node) => {
      for (const raw of findRawValues(sourceCode.getText(node))) reportAt(node.range[0] + raw.index, raw.text)
    }
    const checkLiteral = (node) => {
      if (typeof node.value === 'string') checkText(node)
    }

    const script = {
      Literal: checkLiteral,
      TemplateElement: checkText,
      // Vue <style> blocks are not part of the script or template AST, so they are scanned as CSS text.
      Program() {
        const fragment = sourceCode.parserServices?.getDocumentFragment?.()
        for (const element of fragment?.children ?? []) {
          if (element.type !== 'VElement' || element.name !== 'style') continue
          for (const child of element.children) {
            const [start, end] = child.range
            for (const raw of findRawValuesInCss(sourceCode.text.slice(start, end)))
              reportAt(start + raw.index, raw.text)
          }
        }
      },
      // @eslint/css nodes. A custom property's value is a Raw node, so both cases read the value's text.
      Declaration(node) {
        for (const raw of findRawValues(sourceCode.getText(node.value))) {
          context.report({ node, messageId: 'raw', data: { value: raw.text } })
        }
      },
      Atrule(node) {
        if (node.name !== 'apply' || !node.prelude) return
        for (const raw of findRawValues(sourceCode.getText(node.prelude))) {
          context.report({ node, messageId: 'raw', data: { value: raw.text } })
        }
      },
    }

    const defineTemplateBodyVisitor = sourceCode.parserServices?.defineTemplateBodyVisitor
    if (typeof defineTemplateBodyVisitor !== 'function') return script
    return defineTemplateBodyVisitor({ VLiteral: checkText, Literal: checkLiteral, TemplateElement: checkText }, script)
  },
}
