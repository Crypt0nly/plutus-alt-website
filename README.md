# Plutus — a clean, Apple-style site for the AI agent that does your work

A redesign of [myplutus.ai](https://myplutus.ai) in a **clean, Apple-inspired
design language**: system font stack, large tight typography, a frosted-glass
navigation bar, pill buttons, generous whitespace, and alternating
white / `#f5f5f7` / black bands. No frameworks, no heavy dependencies — just
Vite, vanilla JS and CSS.

> The product: *Plutus — the AI agent that actually does your work.* Give it a
> goal in plain language; it understands, gathers context, uses your tools
> (Gmail, Google Calendar, GitHub, Discord and 10+ more), does the work, and
> tells you what changed.

## Page structure

1. **Nav** — fixed, translucent, `backdrop-filter` blur; collapses to a burger menu on mobile.
2. **Hero** — oversized headline, subhead with an Apple-style footnote, pill CTA, and a live **demo window**: a chat mock that types a goal, shows the plan, checks the steps off, and reports back (three scenarios on loop).
3. **Tool strip** — "Works with the tools you already use."
4. **How it works** — four numbered cards on a `#f5f5f7` band: ask → plan → work → report.
5. **Features** — a bento grid (two wide + four small cards): memory, approvals, real output, team, cloud/local, nothing to learn.
6. **Integrations** — black band with a grid of tinted tool tiles.
7. **CTA** — "Stop managing tools. Start delegating outcomes."
8. **Footer** — footnote, link columns, legal line.

The copy is **drafted from myplutus.ai's public description** — swap in the
exact site wording when ready (it lives directly in `index.html` and the
constants at the top of `src/main.js`).

## Tech

- **Vite** — dev server + production bundle.
- **Vanilla JS** — nav state, `IntersectionObserver` reveal-on-scroll, the hero demo loop, integration grids. ~200 lines, no runtime dependencies.
- **Vanilla CSS** — the whole design system in `src/style.css` (tokens up top).
- Respects `prefers-reduced-motion` (static, completed demo; no transitions).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/  (deploy this; Vercel → Vite preset)
npm run preview
```

## Structure

```
index.html       # full page markup
src/
  main.js        # interactions: nav, reveals, hero demo, integration grids
  style.css      # Apple-style design system (tokens, nav, hero, bento, dark band, footer)
```

## Disclaimer

A design concept. Copy is drafted placeholder text based on the public
description of Plutus and should be replaced with the official wording.
