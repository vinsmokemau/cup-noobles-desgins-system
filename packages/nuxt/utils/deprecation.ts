// T11.3 (REQ-072 AC1): the one helper every deprecated component or prop calls. It warns in development only, and
// the warning names what is deprecated, what replaces it, and the version that removes it (docs/06-governance/deprecation.md).
// `import.meta.dev` is Nuxt's build-time flag. It is false in a production build, and absent outside Nuxt (a unit
// test), where the helper stays silent unless the caller says `dev: true`.
export interface Deprecation {
  /** What is deprecated, as the consumer writes it: `CnOldThing`, or `CnButton` `size="xl"`. */
  name: string
  /** What to use instead. */
  replacement: string
  /** The major version that removes it, for example `1.0.0`. */
  removedIn: string
}

export interface DeprecationOptions {
  /** Defaults to Nuxt's `import.meta.dev`. */
  dev?: boolean
  /** Defaults to `console.warn`. */
  warn?: (message: string) => void
}

// One warning per message, so a component that renders a hundred times warns once.
const warned = new Set<string>()

export function deprecationMessage({ name, replacement, removedIn }: Deprecation): string {
  return `[Cup Noobles] ${name} is deprecated. Use ${replacement} instead. It will be removed in ${removedIn}.`
}

/** Warns once in development. Returns whether it warned. Never warns in production. */
export function warnDeprecated(deprecation: Deprecation, options: DeprecationOptions = {}): boolean {
  const dev = options.dev ?? (import.meta as { dev?: boolean }).dev ?? false
  if (!dev) return false
  const message = deprecationMessage(deprecation)
  if (warned.has(message)) return false
  warned.add(message)
  ;(options.warn ?? console.warn)(message)
  return true
}
