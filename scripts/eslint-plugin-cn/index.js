// Local ESLint plugin for the design system's custom lint rules (T1.3). Wired up in eslint.config.js.
import noHardcodedText from './no-hardcoded-text.js'
import noRawValues from './no-raw-values.js'

export default {
  meta: { name: 'eslint-plugin-cn' },
  rules: {
    'no-hardcoded-text': noHardcodedText,
    'no-raw-values': noRawValues,
  },
}
