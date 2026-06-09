import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// PLUTUS — static multi-page site: three design variants of the same product
// story, linked by a fixed switcher bar.
// Base is relative so the built site works from any sub-path (GitHub Pages, S3, etc.).
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      input: {
        minimal: fileURLToPath(new URL('./index.html', import.meta.url)),
        neon: fileURLToPath(new URL('./neon.html', import.meta.url)),
        convert: fileURLToPath(new URL('./convert.html', import.meta.url)),
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
