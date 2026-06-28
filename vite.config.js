import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// OCUR — static site, served from the domain root (ocur.ai). Base must be
// absolute: the prerendered /de/ page and the /be-ai/ game both live in
// subdirectories and relative asset paths would break there.
//
// Two entry points:
//   index.html        → the marketing home page (ocur.ai/)
//   be-ai/index.html  → the reverse Turing test game (ocur.ai/be-ai)
//
// The game's interactive parts are powered by the app backend (plutus-cloud).
// In production a Vercel rewrite proxies /be-ai/api/* → app.ocur.ai (see
// vercel.json); in dev the server.proxy below stands in for that rewrite so
// `npm run dev` talks to the real (or a local) backend without CORS.
const BE_AI_BACKEND = process.env.VITE_BE_AI_BACKEND || 'https://app.ocur.ai';

export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        beai: resolve(__dirname, 'be-ai/index.html'),
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      // mirror the production rewrite: /be-ai/api/round → {backend}/api/be-ai/round
      '/be-ai/api': {
        target: BE_AI_BACKEND,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/be-ai\/api/, '/api/be-ai'),
      },
    },
  },
});
