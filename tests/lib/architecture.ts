// Architecture scanners for T1.3 (REQ-020 AC3, REQ-021, REQ-022 AC1). Each takes the repository root, so
// tests run it on the real tree and on a fixture tree under tests/fixtures/architecture/.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import tseslint from 'typescript-eslint'
import { parseForESLint } from 'vue-eslint-parser'

type Node = { type: string; [key: string]: unknown }

const skipDirectories = new Set(['node_modules', 'dist', '.nuxt', '.output', '.data'])

// Every file under `dir` whose name matches `pattern`, as paths relative to `root` with forward slashes.
export function listFiles(root: string, dir: string, pattern: RegExp): string[] {
  const files: string[] = []
  const walk = (current: string) => {
    if (!existsSync(current)) return
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        if (!skipDirectories.has(entry.name)) walk(full)
      } else if (pattern.test(entry.name)) files.push(relative(root, full).split('\\').join('/'))
    }
  }
  walk(join(root, dir))
  return files.sort()
}

const lineOf = (text: string, index: number) => text.slice(0, index).split('\n').length

// REQ-021 AC1: every Vue file in packages/nuxt/components/ is named Cn*.vue.
export function findMisnamedComponents(root: string): string[] {
  return listFiles(root, 'packages/nuxt/components', /\.vue$/).filter(
    (file) => !/^Cn[A-Z][A-Za-z0-9]*\.vue$/.test(basename(file)),
  )
}

// REQ-020 AC3: packages/nuxt/components/ implements no dialog, listbox, combobox, menu, tooltip, popover,
// or toast, and no hand-rolled focus trap. Composing Nuxt UI components (UModal, UPopover, …) is allowed.
const primitivePatterns: [string, RegExp][] = [
  ['forbidden role', /\brole\s*[=:]\s*["'`]{1,2}(?:dialog|alertdialog|listbox|combobox|menu|menubar|tooltip)["'`]/g],
  [
    'forbidden role',
    /setAttribute\(\s*["'`]role["'`]\s*,\s*["'`](?:dialog|alertdialog|listbox|combobox|menu|menubar|tooltip)["'`]/g,
  ],
  ['native <dialog>', /<dialog[\s>/]/g],
  ['native popover attribute', /<[a-zA-Z][^>]*\spopover(?=[\s=>/])/g],
  ['focus-trap library', /\b(?:focus-trap|useFocusTrap|createFocusTrap)\b/g],
]

export function findForbiddenPrimitives(root: string): string[] {
  const findings: string[] = []
  for (const file of listFiles(root, 'packages/nuxt/components', /\.(vue|[cm]?[jt]sx?)$/)) {
    const text = readFileSync(join(root, file), 'utf8')
    for (const [label, pattern] of primitivePatterns) {
      for (const match of text.matchAll(pattern)) findings.push(`${file}:${lineOf(text, match.index)} ${label}`)
    }
    // A hand-rolled trap listens for Tab and moves focus itself.
    const tab = /["'`]Tab["'`]/.exec(text)
    if (tab && /\.focus\(/.test(text)) findings.push(`${file}:${lineOf(text, tab.index)} hand-rolled focus trap`)
  }
  return [...new Set(findings)]
}

// REQ-022 AC1: the forbidden domain terms, one per line in scripts/domain-terms.txt.
export function readDomainTerms(root: string): string[] {
  return readFileSync(join(root, 'scripts/domain-terms.txt'), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line && !line.startsWith('#'))
}

// Splits a name into lowercase words: `addToCart`, `add-to-cart`, and `color.cart.bg` all contain `cart`.
const words = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

// The term a name contains, matching whole words (so `border` does not contain `order`). Adjacent words are
// also joined (so `CheckOut` contains `checkout`), and plurals count (`products`, `prices`).
export function matchDomainTerm(name: string, terms: string[]): string | undefined {
  const parts = words(name)
  for (let start = 0; start < parts.length; start++) {
    for (let end = start + 1; end <= parts.length; end++) {
      const joined = parts.slice(start, end).join('')
      const term = terms.find((t) => joined === t || joined === `${t}s` || joined === `${t}es`)
      if (term) return term
    }
  }
  return undefined
}

const isNode = (value: unknown): value is Node =>
  typeof value === 'object' && value !== null && typeof (value as Node).type === 'string'

function walk(node: Node, visit: (node: Node) => void, seen = new Set<Node>()) {
  if (seen.has(node)) return
  seen.add(node)
  visit(node)
  for (const [key, value] of Object.entries(node)) {
    if (key === 'parent' || key === 'tokens' || key === 'comments' || key === 'loc' || key === 'range') continue
    for (const child of Array.isArray(value) ? value : [value]) if (isNode(child)) walk(child, visit, seen)
  }
}

const child = (node: Node | undefined, key: string) => {
  const value = node?.[key]
  return isNode(value) ? value : undefined
}
const children = (node: Node | undefined, key: string) => {
  const value = node?.[key]
  return Array.isArray(value) ? value.filter(isNode) : []
}
const stringValue = (node: Node | undefined) =>
  node?.type === 'Literal' && typeof node.value === 'string' ? node.value : undefined
const keyName = (node: Node | undefined) => {
  const key = child(node, 'key')
  return key?.type === 'Identifier' ? (key.name as string) : stringValue(key)
}

// The names declared by an object (`{ a: String }`), an array (`['a']`), or a type (`{ a: string }`,
// `(e: 'a') => void`, or a local interface or type alias).
function declaredNames(node: Node | undefined, types: Map<string, Node>): string[] {
  if (!node) return []
  switch (node.type) {
    case 'ObjectExpression':
      return children(node, 'properties').flatMap((property) => keyName(property) ?? [])
    case 'ArrayExpression':
      return children(node, 'elements').flatMap((element) => stringValue(element) ?? [])
    case 'TSTypeLiteral':
    case 'TSInterfaceBody':
      return children(node, node.type === 'TSTypeLiteral' ? 'members' : 'body').flatMap((member) => {
        if (member.type !== 'TSCallSignatureDeclaration') return keyName(member) ?? []
        // defineEmits<{ (e: 'change'): void }>(): the event name is the first parameter's literal type.
        const event = child(child(children(member, 'params')[0], 'typeAnnotation'), 'typeAnnotation')
        const literals = event?.type === 'TSUnionType' ? children(event, 'types') : event ? [event] : []
        return literals.flatMap((literal) => stringValue(child(literal, 'literal')) ?? [])
      })
    case 'TSIntersectionType':
      return children(node, 'types').flatMap((type) => declaredNames(type, types))
    case 'TSTypeReference': {
      const name = child(node, 'typeName')
      return name?.type === 'Identifier' ? declaredNames(types.get(name.name as string), types) : []
    }
    case 'TSInterfaceDeclaration':
      return declaredNames(child(node, 'body'), types)
    case 'TSTypeAliasDeclaration':
      return declaredNames(child(node, 'typeAnnotation'), types)
    default:
      return []
  }
}

type Name = { kind: string; name: string; file: string }

// Component, prop, slot, and event names declared by one Vue single-file component.
function vueNames(file: string, code: string): Name[] {
  const { ast } = parseForESLint(code, { parser: tseslint.parser, sourceType: 'module', ecmaVersion: 'latest' })
  const program = ast as unknown as Node
  const names: Name[] = [{ kind: 'component', name: basename(file, '.vue'), file }]
  const add = (kind: string, list: string[]) => names.push(...list.map((name) => ({ kind, name, file })))

  const types = new Map<string, Node>()
  walk(program, (node) => {
    const id = child(node, 'id')
    if (
      (node.type === 'TSInterfaceDeclaration' || node.type === 'TSTypeAliasDeclaration') &&
      id?.type === 'Identifier'
    ) {
      types.set(id.name as string, node)
    }
  })

  const macroKinds: Record<string, string> = { defineProps: 'prop', defineEmits: 'event', defineSlots: 'slot' }
  walk(program, (node) => {
    if (node.type === 'CallExpression') {
      const callee = child(node, 'callee')
      const calleeName =
        callee?.type === 'Identifier'
          ? (callee.name as string)
          : callee?.type === 'MemberExpression'
            ? (child(callee, 'property')?.name as string | undefined)
            : undefined
      const [first] = children(node, 'arguments')
      const typeArgument = children(child(node, 'typeArguments') ?? child(node, 'typeParameters'), 'params')[0]
      const kind = calleeName ? macroKinds[calleeName] : undefined
      if (kind) add(kind, [...declaredNames(first, types), ...declaredNames(typeArgument, types)])
      else if (calleeName === 'defineModel') add('prop', [stringValue(first) ?? 'modelValue'])
      else if (calleeName === 'emit' || calleeName === '$emit')
        add('event', stringValue(first) ? [stringValue(first)!] : [])
    }
    // Options API: export default { props, emits } or defineComponent({ props, emits }).
    if (node.type === 'Property' && (keyName(node) === 'props' || keyName(node) === 'emits')) {
      add(keyName(node) === 'props' ? 'prop' : 'event', declaredNames(child(node, 'value'), types))
    }
    // <slot name="…"> in the template.
    if (node.type === 'VElement' && node.rawName === 'slot') {
      const attributes = children(child(node, 'startTag'), 'attributes')
      const nameAttribute = attributes.find((a) => !a.directive && child(a, 'key')?.rawName === 'name')
      const value = child(nameAttribute, 'value')?.value
      if (typeof value === 'string') add('slot', [value])
    }
  })
  return names
}

// Token paths in DTCG JSON: every object with a $value, named by its dotted key path.
function tokenPaths(value: unknown, path: string[] = []): string[] {
  if (typeof value !== 'object' || value === null) return []
  const record = value as Record<string, unknown>
  const own = '$value' in record ? [path.join('.')] : []
  return [
    ...own,
    ...Object.entries(record).flatMap(([key, v]) => (key.startsWith('$') ? [] : tokenPaths(v, [...path, key]))),
  ]
}

// Every name REQ-022 AC1 covers: component, prop, slot, and event names in packages/, and token paths, both
// as DTCG sources in tokens/ (which packages/tokens builds) and as --cn-* custom properties used in packages/.
export function collectNames(root: string): Name[] {
  const names: Name[] = []
  for (const file of listFiles(root, 'packages', /\.vue$/)) {
    names.push(...vueNames(file, readFileSync(join(root, file), 'utf8')))
  }
  // Email components are MJML files, and their slots are {{ slot_name }} placeholders (REQ-041 AC4).
  for (const file of listFiles(root, 'packages', /\.mjml$/)) {
    names.push({ kind: 'component', name: basename(file, '.mjml'), file })
    for (const [, slot] of readFileSync(join(root, file), 'utf8').matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)) {
      names.push({ kind: 'slot', name: slot!, file })
    }
  }
  for (const file of listFiles(root, 'packages', /\.(vue|[cm]?[jt]s|css|mjml)$/)) {
    for (const [variable] of readFileSync(join(root, file), 'utf8').matchAll(/--cn-[\w-]+/g)) {
      names.push({ kind: 'token', name: variable, file })
    }
  }
  for (const file of listFiles(root, 'tokens', /\.json$/)) {
    for (const path of tokenPaths(JSON.parse(readFileSync(join(root, file), 'utf8')))) {
      names.push({ kind: 'token', name: path, file })
    }
  }
  return names
}

export function findDomainTerms(root: string, terms = readDomainTerms(root)): string[] {
  return collectNames(root).flatMap(({ kind, name, file }) => {
    const term = matchDomainTerm(name, terms)
    return term ? [`${file}: ${kind} "${name}" contains "${term}"`] : []
  })
}
