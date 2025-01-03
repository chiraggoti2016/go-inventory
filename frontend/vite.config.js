import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  // Specify build output directory - this should match Wails expectations
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },

  // Development server configuration
  server: {
    port: 34115, // Default Wails development port
    strictPort: true,
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  },

  // Optimization settings
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@wailsjs/runtime']
  },

  // Environment variables
  envPrefix: ['VITE_', 'WAILS_'],

  // CSS configuration
  css: {
    postcss: {
      plugins: []
    }
  }
})