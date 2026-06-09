# Plutus — the AI operating system for companies

The Plutus marketing site: cinematic and calm, written for non-technical
readers. A midnight canvas with drifting aurora light, Instrument Serif
statements, glass cards — and two signature moments: a **notification pile
that clears itself** in the hero, and a **draggable before/after "same
Monday"** comparison. No frameworks, no runtime dependencies — just Vite,
vanilla JS and CSS.

> The product: *Plutus — the AI operating system for companies.* It connects
> the platforms a company already runs on (email, calendar, files, chat,
> documents, the web) and does the work inside them — always asking before
> anything important, and reporting back after every run.

## Page tour

1. **Hero** — "What if your to-do list *did itself?*" plus the self-clearing
   notification pile: five everyday worries get a check and swoosh away,
   ending on "✨ All handled. Enjoy your evening."
2. **Same Monday** — a curtain slider (pointer, touch and keyboard) comparing
   the day without Plutus (5:45 pm, still at your desk) and with it
   (4:00 pm, you went home). It nudges itself once to invite the drag.
3. **Three statements** — *You say it. It happens. You stay in charge* — with
   a literal "Yes, send it / Not yet" approval card.
4. **Everyday magic** — six plain-words cards: emails, meeting times, tidy
   folders, first drafts, looking things up, follow-ups.
5. **Final CTA** — "Less busywork. *More life.*"

## Tech notes

- **Vite** build, single page; **vanilla JS** (~160 lines) and **vanilla CSS**
  (design tokens at the top of `src/style.css`).
- Fonts: Instrument Serif (display) + Inter (body), via Google Fonts.
- Reveal-on-scroll styles are gated behind an `html.js` class, so the page is
  fully readable if JavaScript fails; the whole site respects
  `prefers-reduced-motion`.
- The slider is keyboard-accessible (`role="slider"`, arrow keys, Home/End).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/  (deploy this; Vercel → Vite preset)
npm run preview
```

## Structure

```
index.html       # the page
src/
  main.js        # notification pile, before/after slider, reveals
  style.css      # the whole design system
  fx.js          # reveal-on-scroll + reduced-motion flag
```

## Notes

- Copy is drafted from Plutus's public description; the hero notifications
  and the Monday lists are illustrative placeholders — swap in real examples
  before launch.
- Six other explored design directions (Apple-style minimal, neon
  attention-max, direct-response converter, enterprise "PlutusOS", serif
  editorial, playful coworker) live in this repo's git history — see the
  commits up to `1e4f27c`.
