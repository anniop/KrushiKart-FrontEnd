import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This tells Vite to forward any request that starts with /api
      // to your backend server.
      '/api': {
        target: 'https://krushikart-backend.onrender.com/',
        changeOrigin: true,
      },
    }
  }
})
