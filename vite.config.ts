import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'f2bf1c7ea3e0.ngrok-free.app'
    ],
    proxy: {
      '/api': {
        target: 'http://100.31.50.33:3002',  // Port 80 (Nginx)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  }
})
