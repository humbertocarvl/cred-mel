import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // allow Vite to accept connections from ngrok proxy
    host: 'localhost',
    port: 5173,
    hmr: {
      overlay: false,
    },
    proxy: {
      // proxy any /api requests to the local backend (adjust port if your backend runs elsewhere)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
