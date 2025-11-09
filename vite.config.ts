import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@aws-amplify/ui-react']
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@aws-amplify/ui-react', 'aws-amplify']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  server: {
    port: 3000,
    proxy: {
      '/graphql': {
        target: 'http://localhost:20002',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
