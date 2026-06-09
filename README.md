# Plutus — five design directions for the AI operating system for companies

A redesign of [myplutus.ai](https://myplutus.ai) as **five complete design
variants** of the same product story, linked by a fixed switcher bar at the top
of every page. No frameworks, no runtime dependencies — just Vite, vanilla JS
and CSS.

> The product: *Plutus — the AI operating system for companies.* It connects
> the platforms a company already runs on (Gmail, Google Calendar, GitHub,
> Discord, files, business apps and 10+ more) and does the work inside them —
> with human approval on consequential actions and a report after every run.

## The five variants

| # | Page | Direction |
| --- | --- | --- |
| 01 | `index.html` | **Minimal** — clean Apple-style: system font stack, large tight typography, frosted-glass nav, pill buttons, white / `#f5f5f7` / black bands, bento grid, animated hero demo window. |
| 02 | `neon.html` | **Neon** — maximum attention: near-black canvas, acid green + electric violet, gigantic Archivo Black display type, marquee tickers, brutalist offset-shadow cards with sticker badges, cursor-follow glow, pulsing mega CTA. |
| 03 | `convert.html` | **Converter** — conversion-maximized direct response: announcement bar, benefit-led headline with highlighter marks, high-contrast orange CTAs with risk-reversal microcopy, social proof (stars, avatars, testimonials), pain/gain comparison, 3-step flow, animated stat counters, FAQ accordion, sticky bottom CTA bar. |
| 04 | `system.html` | **System** — enterprise "PlutusOS": deep-slate canvas with a blueprint grid, JetBrains Mono microlabels (`SYS.01 / ORCHESTRATION`), an animated orchestrator console, a hub-and-spoke platform diagram, capability modules, control/audit band, per-department use cases. |
| 05 | `editorial.html` | **Editorial** — printed-matter manifesto: warm paper, Fraunces display serif, newspaper masthead, roman-numeral chapters, drop cap, pull quote, a specimen "ledger" of delegated work, double-bordered colophon CTA. |

The **switcher bar** (`src/switcher.js`) is mounted on all three pages; each
variant's CSS offsets its own nav by the shared `--switch-h` token. Remove the
`mountSwitcher(...)` call from a variant's entry script to ship that variant
standalone.

## Placeholder content

Copy is drafted from myplutus.ai's public description. Some variants
additionally use invented props as design placeholders: the **Converter**'s
testimonials/personas, star ratings, "first 100 teams", "~2 min setup" and
avatar initials; the **System** console's example runs and "j.meyer" approval;
the **Editorial** specimen ledger rows. **Replace them with real quotes and
real numbers before launching.** Content lives directly in each HTML file and
in the constants at the top of each entry script.

## Tech

- **Vite** multi-page build (`vite.config.js` → `rollupOptions.input`).
- **Vanilla JS per variant**: `src/main.js` (minimal), `src/neon.js`, `src/convert.js`, `src/system.js`, `src/editorial.js`.
- **Shared modules**: `src/icons.js` (integration data + stroke icons), `src/fx.js` (reveal-on-scroll), `src/switcher.js` + `src/switcher.css` (variant switcher).
- **Vanilla CSS per variant**: `src/style.css`, `src/neon.css`, `src/convert.css`, `src/system.css`, `src/editorial.css` (design tokens at the top of each).
- Fonts: Minimal uses the system stack; Neon loads Archivo Black + Space Grotesk; Converter loads Inter; System loads Inter + JetBrains Mono; Editorial loads Fraunces + Source Serif 4 (Google Fonts).
- All variants respect `prefers-reduced-motion`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173  (+ /neon.html, /convert.html, /system.html, /editorial.html)
npm run build    # → dist/  (deploy this; Vercel → Vite preset)
npm run preview
```

## Structure

```
index.html         # 01 Minimal (Apple-style)
neon.html          # 02 Neon (attention-maximized)
convert.html       # 03 Converter (conversion-maximized)
system.html        # 04 System (enterprise OS)
editorial.html     # 05 Editorial (serif manifesto)
src/
  main.js          # minimal: nav, reveals, hero demo loop
  style.css
  neon.js          # neon: tickers, tools wall, cursor glow
  neon.css
  convert.js       # converter: counters, sticky CTA bar
  convert.css
  system.js        # system: console replay, hub diagram, status strip
  system.css
  editorial.js     # editorial: switcher + reveals only
  editorial.css
  icons.js         # shared integration data + icon set
  fx.js            # shared reveal-on-scroll + reduced-motion flag
  switcher.js      # design-variant switcher bar
  switcher.css
```

## Disclaimer

A design concept. Copy is drafted placeholder text based on the public
description of Plutus and should be replaced with the official wording.
