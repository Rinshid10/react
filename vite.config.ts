import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Sends `/admin` to `/admin/`.
 *
 * Without this the request misses the `admin/index.html` entry and falls
 * through to Vite's SPA fallback, which quietly serves the *portfolio* page at
 * an /admin URL — no error, no 404, just the wrong site. Static hosts do this
 * redirect for directory URLs already; the dev and preview servers do not.
 */
const adminTrailingSlash = (): Plugin => {
  const redirect = (req: { url?: string }, res: import('node:http').ServerResponse, next: () => void) => {
    const [path, search] = (req.url ?? '').split('?')
    if (path !== '/admin') return next()
    res.writeHead(301, { Location: `/admin/${search ? `?${search}` : ''}` })
    res.end()
  }

  return {
    name: 'admin-trailing-slash',
    configureServer: (server) => {
      server.middlewares.use(redirect)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(redirect)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminTrailingSlash()],

  // Two pages, not one SPA with a route: the portfolio and the admin panel
  // share the Appwrite config and nothing else. Keeping them as separate entries
  // means no router dependency, and — the point of it — none of the admin code
  // or the Appwrite SDK's auth surface is shipped to site visitors.
  //
  // `admin/index.html` builds to `dist/admin/index.html`, so the panel is served
  // at /admin/ with no rewrite rule.
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html'),
      },
    },
  },
})
