// T5.3, T5.6: serves the static build (.output/public) for the Playwright tests, the way GitHub Pages serves a project
// site: only under the subpath (`/cup-noobles-desgins-system/`), where a path maps to its file, or to
// `<path>/index.html`. Anything else, including a path outside the subpath, is the 404 page with status 404, so a link
// or an asset that forgot the subpath fails here as it would on the deployed site.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

// T7.1: CN_SERVE_DIR serves another static build, such as the throwaway one of the demo-infrastructure test.
const root = process.env.CN_SERVE_DIR ?? fileURLToPath(new URL('../.output/public', import.meta.url))
const port = Number(process.env.PORT ?? 3200)
const base = '/cup-noobles-desgins-system/'
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

async function find(pathname) {
  const decoded = decodeURIComponent(pathname)
  // `/cup-noobles-desgins-system` without the slash is redirected by the host; here it maps to the home page.
  const inside = decoded === base.slice(0, -1) ? base : decoded
  if (inside.startsWith(base)) {
    const clean = normalize(inside.slice(base.length)).replace(/^([/\\])+/, '')
    for (const candidate of [clean, join(clean, 'index.html'), `${clean}.html`]) {
      try {
        return { file: join(root, candidate), body: await readFile(join(root, candidate)), status: 200 }
      } catch {
        // try the next candidate
      }
    }
  }
  return { file: '404.html', body: await readFile(join(root, '404.html')), status: 404 }
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost')
  const { file, body, status } = await find(pathname)
  response.writeHead(status, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  response.end(body)
}).listen(port)
