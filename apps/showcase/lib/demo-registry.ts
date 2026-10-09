// T7.1 (REQ-055 AC2): the demo registry. The demos are the files in the demos folder (the `#demos` alias, see
// nuxt.config.ts); this module finds them by doc slug and demo name. The source shown on a component page is the file
// itself, imported with `?raw`, never retyped (SPEC.md §4.5, mechanic 3). It needs Vite (`import.meta.glob`), so the
// pure logic lives in demos.ts, which the unit tests import.
import type { Component } from 'vue'
import { assertControls, type Control } from './demos'

const components = import.meta.glob('#demos/*/*.vue') as Record<string, () => Promise<{ default: Component }>>
const sources = import.meta.glob('#demos/*/*.vue', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>
const controls = import.meta.glob('#demos/*/controls.ts', { import: 'default' }) as Record<
  string,
  () => Promise<unknown>
>

// A glob key keeps the alias or the resolved path, so the demo is found by the end of the path.
const find = <T>(table: Record<string, T>, path: string): T | undefined =>
  Object.entries(table).find(([key]) => key.endsWith(`/${path}`))?.[1]

/** The component of a demo, or undefined when there is no such demo file. */
export function demoComponent(slug: string, name: string): (() => Promise<{ default: Component }>) | undefined {
  return find(components, `${slug}/${name}.vue`)
}

/** The exact text of the demo's file. */
export async function demoSource(slug: string, name: string): Promise<string> {
  const load = find(sources, `${slug}/${name}.vue`)
  if (!load) throw new Error(`demos/${slug}/${name}.vue does not exist`)
  return load()
}

/** The controls schema of a component's playground, validated. A component without one has no controls. */
export async function demoControls(slug: string): Promise<Control[]> {
  const load = find(controls, `${slug}/controls.ts`)
  return load ? assertControls(await load(), `demos/${slug}/controls.ts`) : []
}
