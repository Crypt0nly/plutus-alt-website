import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// OCUR — static site, served from the domain root (ocur.ai).
// Base must be absolute: the prerendered /de/ page lives in a
// subdirectory and relative asset paths would break there.
// Two pages while design directions are being compared:
//   /      → design A "Midnight Aurora" (production)
//   /alt/  → design B "Editorial Motion" (noindex preview)
export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        alt: fileURLToPath(new URL('./alt/index.html', import.meta.url)),
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
