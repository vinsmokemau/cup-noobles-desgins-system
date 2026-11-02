// The design system's ESLint plugin (T1.3). It ships in the layer package (T15.6, DSR-09, ADR-0067), so a consuming app
// runs the same rules as this repository's eslint.config.js.
import noHardcodedText from './no-hardcoded-text.js'
import noRawValues from './no-raw-values.js'

export default {
  meta: { name: 'eslint-plugin-cn' },
  rules: {
    'no-hardcoded-text': noHardcodedText,
    'no-raw-values': noRawValues,
  },
}
