# Plutus — the AI assistant that does the work

The Plutus marketing site: cinematic and calm, written for non-technical
readers. A midnight canvas with drifting aurora light, Instrument Serif
statements, glass cards — and two signature moments: a **notification pile
that clears itself** in the hero, and a **draggable before/after "same
Monday"** comparison. No frameworks, no runtime dependencies — just Vite,
vanilla JS and CSS.

> The product: *Plutus — the AI assistant that does the work.* It connects
> the platforms a person or team already runs on (email, calendar, files,
> chat, documents, the web) and does the work inside them — always asking
> before anything important, and reporting back after every run. Content on
> this page is kept in sync with what the
> [plutus-cloud](https://github.com/Crypt0nly/plutus-cloud) app actually
> ships: connectors, voice, memory, scheduled automations, teams, and the
> Free / Team ($149) / Business ($299) plans.

## Page tour

1. **Hero** — "What if your to-do list *did itself?*" plus the self-clearing
   notification pile: five everyday worries get a check and swoosh away,
   ending on "✨ All handled. Enjoy your evening." Primary CTA is **Start
   free**, with risk-removing microcopy (free plan · no credit card ·
   nothing to install).
2. **Your team's Monday** — a scrubber over one team to-do list (pointer,
   touch and keyboard): each row flips ✗→✓ as the divider passes it, the
   card washes teal, the end line swaps (5:45 pm buried → 4:00 pm clear)
   and a "+team-hours" pill ticks with progress. On first view it plays one
   slow demonstration sweep, then settles halfway; any interaction cancels.
3. **Three statements** — *You say it. It happens. You stay in charge* — a
   pinned scroll story: the section holds for ~3 screens while scroll
   progress dissolves each statement into the next (drift + blur crossfade).
   Falls back to simple stacked blocks without JS or with reduced motion.
4. **Everyday magic** — six plain-words cards: emails, meeting times, tidy
   folders, first drafts, looking things up, follow-ups.
5. **One assistant, everywhere** — a pill strip of real connectors (Gmail,
   Google Calendar, Drive, Notion, WhatsApp, Telegram, Slack, Discord,
   GitHub) plus four differentiator cards: voice, memory, scheduled
   automations, team workspace.
6. **Pricing** — Free / Team ($149, "most popular") / Business ($299), each
   mirroring the in-app plans and token allowances, with an Enterprise note.
7. **FAQ** — six `<details>` accordions (no JS needed) answering the
   classic objections: free?, install?, autonomy/approval, integrations,
   privacy, teams.
8. **Final CTA** — "Less busywork. *More life.*" → **Start free**.

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
