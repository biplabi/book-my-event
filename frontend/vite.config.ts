import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      // The Spring services have no CORS config, so the dev server proxies API
      // calls and the browser only ever talks to its own origin.
      proxy: {
        '/api': {
          target: env.USER_SERVICE_URL || 'http://localhost:8081',
          changeOrigin: true,
        },
        // event-service has no /api prefix, so namespace it here and strip it.
        '/event-service': {
          target: env.EVENT_SERVICE_URL || 'http://localhost:8082',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/event-service/, ''),
        },
        '/booking-service': {
          target: env.BOOKING_SERVICE_URL || 'http://localhost:8083',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/booking-service/, ''),
        },
      },
    },
  }
})
