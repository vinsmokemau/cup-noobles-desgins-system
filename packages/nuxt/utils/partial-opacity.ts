// T13.2 (C-06, ADR-0055): Nuxt UI's own themes tint its colors with partial opacity, for example `hover:bg-primary/75` and
// `outline-primary/25`. Each one makes a translucent version of a brand color, and the owner approved no translucent brand
// color except the glow (ADR-0051). `nuxt.config.ts` runs every generated Nuxt UI theme file through this function, so the
// classes are gone from the theme. The `.cn-*` rules in assets/css/main.css own the hover, pressed, and focus colors.
//
// A class is dropped when it is a color utility with an opacity modifier on one of Nuxt UI's color roles. A size with a
// line height, such as `text-sm/6`, is not a color and stays.
const UTILITIES = [
  'bg',
  'text',
  'ring',
  'ring-offset',
  'outline',
  'border',
  'divide',
  'decoration',
  'shadow',
  'inset-ring',
  'inset-shadow',
  'fill',
  'stroke',
  'from',
  'via',
  'to',
  'caret',
  'accent',
  'placeholder',
]
const COLORS = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'error',
  'neutral',
  'inverted',
  'default',
  'muted',
  'toned',
  'elevated',
  'accented',
  'highlighted',
  'dimmed',
  'black',
  'white',
]

// An optional chain of variants (`hover:`, `data-[state=open]:`), the utility, a color role, and an opacity from 0 to 100.
const CLASS = String.raw`(?:[^\s"]*:)?!?(?:${UTILITIES.join('|')})-(?:${COLORS.join('|')})\/\d{1,3}!?`
const ONE = new RegExp(`^${CLASS}$`)
// A double-quoted string on one line. A class list, a key, or a value: only a class list can hold a partial opacity.
const STRING = /"((?:[^"\\\n]|\\.)*)"/g

/** Whether one class is a color utility with a partial opacity. */
export const isPartialOpacity = (className: string): boolean => ONE.test(className)

/** Removes every partial-opacity color class from the source of a generated Nuxt UI theme file. */
export function stripPartialOpacity(source: string): string {
  return source.replace(STRING, (whole: string, body: string) => {
    const classes = body.split(' ')
    if (!classes.some(isPartialOpacity)) return whole
    return `"${classes.filter((c) => c && !isPartialOpacity(c)).join(' ')}"`
  })
}
