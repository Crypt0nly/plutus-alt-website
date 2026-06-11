import { defineConfig } from 'vite';

// OCUR — static site, served from the domain root (ocur.ai).
// Base must be absolute: the prerendered /de/ page lives in a
// subdirectory and relative asset paths would break there.
export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    sourcemap: false,
  },
  server: {
    host: true,
    port: 5173,
  },
});
