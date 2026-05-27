import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@pages': resolve(__dirname, './src/pages')
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    target: 'ES2020',
    outDir: 'dist',
    sourcemap: true
  }
})
