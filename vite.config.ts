import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'id-verify-api-960587958424.northamerica-northeast2.run.app',
      'f2bf1c7ea3e0.ngrok-free.app'
    ],
    proxy: {
      '/api': {
        target: 'https://2c98ddbc23a8.ngrok-free.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('[Vite Proxy] Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[Vite Proxy] Request:', req.method, req.url, '→', options.target + proxyReq.path);
          });
        }
      },
      '/uploads': {
        target: 'https://2c98ddbc23a8.ngrok-free.app',
        changeOrigin: true
      }
    }
  }
})
