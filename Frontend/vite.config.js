import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/v1': 'http://localhost:8000/api',
    },
  },
  plugins: [react()],
})
