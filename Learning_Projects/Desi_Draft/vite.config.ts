import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** The enquiry backend (`npm run api`) owns /api in dev and in preview. */
const api = { '/api': { target: 'http://127.0.0.1:8787' } };

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    proxy: api,
  },
  preview: {
    host: '127.0.0.1',
    proxy: api,
  },
  build: {
    target: 'es2020',
    // Route chunks get their own CSS; the old single stylesheet was forced.
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Long-lived vendor chunks. three.js is gone; matter-js and qrcode are
        // dynamic imports, so they get their own async chunks automatically.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-gsap': ['gsap', 'lenis'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
});
