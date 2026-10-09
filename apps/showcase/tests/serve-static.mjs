// T5.3: serves the static build (.output/public) for the Playwright tests, the way a static host would: a path maps to
// its file, or to `<path>/index.html`; anything else is the 404 page.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../.output/public', import.meta.url))
const port = Number(process.env.PORT ?? 3200)
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
  const clean = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, '')
  for (const candidate of [clean, join(clean, 'index.html'), `${clean}.html`]) {
    try {
      return { file: join(root, candidate), body: await readFile(join(root, candidate)), status: 200 }
    } catch {
      // try the next candidate
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
