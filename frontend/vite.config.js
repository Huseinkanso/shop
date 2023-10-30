import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: 'https://electro-shop-8p2k.onrender.com' ,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://electro-shop-8p2k.onrender.com' ,
        changeOrigin: true,
      },
    },
  },
})
