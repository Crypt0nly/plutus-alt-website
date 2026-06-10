# Ocur — the AI operating system for companies

The Ocur marketing site: cinematic and calm, written for non-technical
readers. A midnight canvas with drifting aurora light, Instrument Serif
statements, glass cards — and two signature moments: a **notification pile
that clears itself** in the hero, and a **draggable before/after "same
Monday"** comparison. No frameworks, no runtime dependencies — just Vite,
vanilla JS and CSS.

> The product: *Ocur — the AI operating system for companies.* It plugs
> into the platforms a company already runs on (email, calendar, files,
> chat, documents, the web) and does the work inside them — always asking
> before anything important, and reporting back after every run. Content on
> this page is kept in sync with what the
> [plutus-cloud](https://github.com/Crypt0nly/plutus-cloud) app actually
> ships: connectors, voice, company memory, the autonomous heartbeat
> autopilot, scheduled automations, parallel workers, desktop control,
> image generation, autonomous email replies, org/role guardrails, and
> the Free / Team ($149) / Business ($299) plans.

## Page tour

1. **Hero** — kicker "The AI operating system for companies", then "What if
   your company *ran itself?*" plus the self-clearing notification pile:
   five company worries (customer email, scheduling, invoices, investor
   update, launch post) get a check and swoosh away, ending on "✨ All
   handled." Primary CTA is **Start free**, with risk-removing microcopy
   (free pilot · no credit card · no IT project).
2. **Your company's Monday** — a scrubber over one team to-do list (pointer,
   touch and keyboard): each row flips ✗→✓ as the divider passes it, the
   card washes teal, the end line swaps (5:45 pm buried → 4:00 pm clear)
   and a "+team-hours" pill ticks with progress. On first view it plays one
   slow demonstration sweep, then settles halfway; any interaction cancels.
3. **Four statements** — *Your team says it. It happens. Or say nothing.
   You stay in charge* — one coherent invoice-chasing story told as a
   pinned scroll narrative: the section holds while scroll progress
   dissolves each statement into the next. Falls back to simple stacked
   blocks without JS or with reduced motion.
4. **Autopilot, with a heartbeat** — a timeline card of one morning on
   autopilot: heartbeats wake Ocur (pulsing "lub-dub" dots), it answers
   the routine email, chases an invoice, builds itself a tool on a quiet
   beat, and lands the morning digest. Mirrors the app's real per-user
   heartbeat runner (interval wake-ups, quiet hours, full action log).
5. **One system, every department** — six department cards: Sales, Support,
   Finance, Marketing, Operations, Company memory.
6. **Plugged into everything** — a CSS-only solar system: Ocur at the
   centre, real connector logos in two counter-rotating orbits (Gmail,
   Google Calendar, Drive, Notion, GitHub inner; Telegram, WhatsApp,
   Discord, email, your computer, the web outer) plus a dashed "+" planet
   and a caption making the no-limits point: build your own connectors —
   API or, failing that, desktop control. Logos lifted from the app's
   `ConnectorLogos.tsx`. Below it, six system cards: voice, parallel
   workers, scheduled rhythm, desktop control, image generation, admin
   guardrails.
7. **Pricing** — Free ("for the pilot") / Team ($149, "most popular") /
   Business ($299), each mirroring the in-app plans and token allowances,
   with an Enterprise note.
8. **FAQ** — seven `<details>` accordions (no JS needed) answering the
   classic objections: free?, install?, autonomy/approval, integrations,
   privacy, company-wide use, rollout time.
9. **Final CTA** — "Run the company. *Not the busywork.*" → **Start free**.

## Tech notes

- **Vite** build, single page; **vanilla JS** (~160 lines) and **vanilla CSS**
  (design tokens at the top of `src/style.css`).
- Fonts: Instrument Serif (display) + Inter (body), via Google Fonts.
- Reveal-on-scroll styles are gated behind an `html.js` class, so the page is
  fully readable if JavaScript fails; the whole site respects
  `prefers-reduced-motion`.
- The slider is keyboard-accessible (`role="slider"`, arrow keys, Home/End).
- **Localisation** (`src/i18n.js`): German-language browsers get the full
  page in German (incl. euro pricing, German times/decimals and
  aria-labels); everyone else gets the English baked into the HTML. An
  EN | DE toggle in the nav persists to localStorage and beats browser
  language. Detection is `navigator.languages`, deliberately not geo-IP
  (privacy, VPNs, expats). The dictionary maps CSS selectors →
  replacement HTML, so the markup stays single-source — when copy
  changes, update the matching entry. SEO note: the swap is client-side,
  so search engines index English; if German SERP presence matters
  later, prerender a `/de/` page from the same dictionary.

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

- **Domain transition:** the brand and site are now **Ocur** (ocur.ai).
  The app itself still runs at app.useplutus.ai, so every CTA points there
  for now — flip the links once the app answers on app.ocur.ai (or a 301
  is in place).
- Copy is drafted from Ocur's public description; the hero notifications
  and the Monday lists are illustrative placeholders — swap in real examples
  before launch.
- Six other explored design directions (Apple-style minimal, neon
  attention-max, direct-response converter, enterprise "PlutusOS", serif
  editorial, playful coworker) live in this repo's git history — see the
  commits up to `1e4f27c`.
