import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // allow Vite to accept connections from ngrok proxy
    host: true,
    port: 5173,
    allowedHosts: [
      'histogenetic-afterwards-keri.ngrok-free.dev',
      '.ngrok-free.dev'
    ],
    hmr: {
      overlay: false,
    },
    proxy: {
      // proxy any /api requests to the local backend (adjust port if your backend runs elsewhere)
      '/api': {
        target: 'https://cred-mel-production.up.railway.app/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
