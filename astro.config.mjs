import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import compress from 'astro-compress';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    react(),
    compress({
      css: true,
      js: true,
      svg: true,
      img: true,
      html: true,
      logger: 1,
    }),
  ],
  server: {
    port: 3000,
    host: true
  },
  vite: {
    build: {
      // Use esbuild for minification (better performance than terser)
      minify: 'esbuild',
      cssMinify: true,
      // Improve build performance
      target: 'esnext',
      // Reduce build size
      sourcemap: false,
      rollupOptions: {
        output: {
          // More advanced manual chunks strategy
          manualChunks: (id) => {
            // Create a chunk for node_modules
            if (id.includes('node_modules')) {
              // Split React and ReactDOM into a framework chunk
              if (id.includes('react') || id.includes('react-dom')) {
                return 'framework';
              }
              
              // Group other third-party dependencies
              return 'vendor';
            }
            
            // Group components
            if (id.includes('/src/components/')) {
              return 'components';
            }
            
            // Group utilities
            if (id.includes('/src/utils/')) {
              return 'utils';
            }
            
            // Group layouts
            if (id.includes('/src/layouts/')) {
              return 'layouts';
            }
          },
          // Improve long-term caching with content hashing
          chunkFileNames: 'assets/chunks/[name].[hash].js',
          entryFileNames: 'assets/entries/[name].[hash].js',
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
        }
      }
    },
    // Optimize CSS
    css: {
      devSourcemap: true,
    },
    // Cache dependencies for faster builds
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    // Enable server-side hot module replacement
    server: {
      hmr: true,
    }
  }
});