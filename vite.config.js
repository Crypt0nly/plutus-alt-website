import { defineConfig } from 'vite';

// PLUTUS — static, single-page Three.js experience.
// Base is relative so the built site works from any sub-path (GitHub Pages, S3, etc.).
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
  server: {
    host: true,
    port: 5173,
  },
});
