import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.BACKEND_URL || process.env.BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: import.meta.env.BACKEND_URL || process.env.BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
})
