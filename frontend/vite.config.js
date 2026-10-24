import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Three.js + React Three Fiber come to ~250 kB gzipped. That code is only
    // reachable through lazily imported 3D scenes, so it never affects the
    // initial page load; the default limit would just warn about it.
    chunkSizeWarningLimit: 1000,
  },
})
