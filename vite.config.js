import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// OCUR — static site, served from the domain root (ocur.ai). Base must be
// absolute: the prerendered /de/ page and the /be-ai/ game both live in
// subdirectories and relative asset paths would break there.
//
// Entry points:
//   index.html          → the marketing home page (ocur.ai/)
//   be-ai/index.html    → the reverse Turing test game (ocur.ai/be-ai)
//   privacy/, terms/    → the legal pages (ocur.ai/privacy, ocur.ai/terms)
//   de/privacy/, de/terms/ → their German twins, plus de/impressum/ (§5 DDG)
//
// The legal pages are hand-written HTML rather than prerendered from the
// dictionary: they're long-form prose that changes on its own schedule, and
// /privacy has to answer with a real policy at exactly that URL — it's the
// privacy policy URL registered on Google's OAuth consent screen.
//
// The game's interactive parts are powered by the app backend (plutus-cloud).
// HTTP (gallery/leaderboard/duel) is proxied: in production a Vercel rewrite
// sends /be-ai/api/* → the backend api.ocur.ai (see vercel.json); in dev the
// server.proxy below stands in for it so `npm run dev` talks to a backend
// without CORS.
//
// The realtime WebSocket is NOT proxied (Vercel rewrites don't carry WS
// upgrades) — the client connects straight to wss://api.ocur.ai by default
// (the backend host, not the app.ocur.ai frontend). Point dev at a local
// backend with
//   VITE_BE_AI_WS=ws://localhost:8000/api/be-ai/ws VITE_BE_AI_BACKEND=http://localhost:8000 npm run dev
const BE_AI_BACKEND = process.env.VITE_BE_AI_BACKEND || 'https://api.ocur.ai';

export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        beai: resolve(__dirname, 'be-ai/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        privacyDe: resolve(__dirname, 'de/privacy/index.html'),
        termsDe: resolve(__dirname, 'de/terms/index.html'),
        impressumDe: resolve(__dirname, 'de/impressum/index.html'),
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
