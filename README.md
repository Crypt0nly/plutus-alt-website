# Plutus — three design directions for the AI agent that does your work

A redesign of [myplutus.ai](https://myplutus.ai) as **three complete design
variants** of the same product story, linked by a fixed switcher bar at the top
of every page. No frameworks, no runtime dependencies — just Vite, vanilla JS
and CSS.

> The product: *Plutus — the AI agent that actually does your work.* Give it a
> goal in plain language; it understands, gathers context, uses your tools
> (Gmail, Google Calendar, GitHub, Discord and 10+ more), does the work, and
> tells you what changed.

## The three variants

| # | Page | Direction |
| --- | --- | --- |
| 01 | `index.html` | **Minimal** — clean Apple-style: system font stack, large tight typography, frosted-glass nav, pill buttons, white / `#f5f5f7` / black bands, bento grid, animated hero demo window. |
| 02 | `neon.html` | **Neon** — maximum attention: near-black canvas, acid green + electric violet, gigantic Archivo Black display type, marquee tickers, brutalist offset-shadow cards with sticker badges, cursor-follow glow, pulsing mega CTA. |
| 03 | `convert.html` | **Converter** — conversion-maximized direct response: announcement bar, benefit-led headline with highlighter marks, high-contrast orange CTAs with risk-reversal microcopy, social proof (stars, avatars, testimonials), pain/gain comparison, 3-step flow, animated stat counters, FAQ accordion, sticky bottom CTA bar. |

The **switcher bar** (`src/switcher.js`) is mounted on all three pages; each
variant's CSS offsets its own nav by the shared `--switch-h` token. Remove the
`mountSwitcher(...)` call from a variant's entry script to ship that variant
standalone.

## Placeholder content

Copy is drafted from myplutus.ai's public description. The **Converter**
variant additionally uses invented conversion props — testimonials/personas,
star ratings, "first 100 teams", "~2 min setup", avatar initials — as design
placeholders. **Replace them with real quotes and real numbers before
launching.** Content lives directly in each HTML file and in the constants at
the top of each entry script.

## Tech

- **Vite** multi-page build (`vite.config.js` → `rollupOptions.input`).
- **Vanilla JS per variant**: `src/main.js` (minimal), `src/neon.js`, `src/convert.js`.
- **Shared modules**: `src/icons.js` (integration data + stroke icons), `src/fx.js` (reveal-on-scroll), `src/switcher.js` + `src/switcher.css` (variant switcher).
- **Vanilla CSS per variant**: `src/style.css`, `src/neon.css`, `src/convert.css` (design tokens at the top of each).
- Fonts: Minimal uses the system stack; Neon loads Archivo Black + Space Grotesk; Converter loads Inter (Google Fonts).
- All variants respect `prefers-reduced-motion`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173  (+ /neon.html, /convert.html)
npm run build    # → dist/  (deploy this; Vercel → Vite preset)
npm run preview
```

## Structure

```
index.html         # 01 Minimal (Apple-style)
neon.html          # 02 Neon (attention-maximized)
convert.html       # 03 Converter (conversion-maximized)
src/
  main.js          # minimal: nav, reveals, hero demo loop
  style.css
  neon.js          # neon: tickers, tools wall, cursor glow
  neon.css
  convert.js       # converter: counters, sticky CTA bar
  convert.css
  icons.js         # shared integration data + icon set
  fx.js            # shared reveal-on-scroll + reduced-motion flag
  switcher.js      # design-variant switcher bar
  switcher.css
```

## Disclaimer

A design concept. Copy is drafted placeholder text based on the public
description of Plutus and should be replaced with the official wording.
