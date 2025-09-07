import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    __API_BASE_URL__: JSON.stringify(
      mode === 'development' ? '/api' : (process.env.VITE_API_BASE_URL || 'http://45.87.120.218:8080')
    )
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://45.87.120.218:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
}))
