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
- **Themes**: dark is the default; a sun/moon toggle in the nav switches
  to light mode, persisted in localStorage, with `prefers-color-scheme`
  as the first-visit default. Every colour flows through the token block
  at the top of `src/style.css`; the light palette is sampled from
  Pitchdeck 7.0 (cream #f8f7f3, black ink, fox orange #f2942e) —
  retint by editing the `html[data-theme='light']` block only.
- The slider is keyboard-accessible (`role="slider"`, arrow keys, Home/End).
- **Localisation**: the German page is a real prerendered URL — `npm run
  build` runs `scripts/prerender-de.mjs`, which applies the dictionary in
  `src/strings.de.js` (CSS selector → replacement HTML) to the built page
  with cheerio and writes `dist/de/index.html` (euro pricing, German
  times/decimals, translated aria-labels, `lang="de"`, its own
  canonical). Both pages carry `hreflang` alternates, so English and
  German index separately. At runtime `src/i18n.js` only routes:
  German-language browsers landing on `/` are redirected to `/de/`
  (`navigator.languages`, deliberately not geo-IP — privacy, VPNs,
  expats), a shared `/de/` link is respected as-is, and the EN | DE
  toggle in the nav is a pair of real links whose choice persists in
  localStorage and beats browser language. When copy changes, update
  the matching dictionary entry. `?lang=de` force-applies German
  client-side on the dev server, where `/de/` doesn't exist.

## Deploy (Vercel)

The repo is connected to Vercel (build `npm run build`, output `dist/`).
`vercel.json` moves the language routing to the edge — zero client hops
in production:

- `/` with a German `Accept-Language` and no preference cookie → 307 to
  `/de/`.
- An explicit EN/DE choice is stored in the `ocur-lang` cookie (set by
  the nav toggle) and wins in both directions.
- A deliberately opened `/de/` link with no stored preference is served
  as-is.
- `/assets/*` (hashed filenames) are served immutable for a year.

`public/sitemap.xml` lists both language URLs with hreflang alternates;
`public/robots.txt` points to it — submit the sitemap in Google Search
Console once the domain is live. The client-side routing in
`src/i18n.js` stays as a fallback for dev and non-Vercel hosts.

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
  style.css      # the design system (theme tokens at the top)
  fx.js          # reveal-on-scroll + reduced-motion flag
  i18n.js        # language routing + EN|DE toggle
  strings.de.js  # the entire German dictionary (data only)
  theme.js       # dark/light toggle
```

### Design preview

Two directions are live side by side while a winner is being picked —
a slim bar at the top of every page switches between **/** (A ·
Midnight Aurora) and **/alt/** (B · Obsidian Glass). Design B is an
Apple-keynote-style page: near-black canvas, fox-orange glow meshes,
liquid-glass surfaces everywhere (floating glass nav, glass bento
tiles, pricing/FAQ cards with pointer-tracked glare, a persistent
glass CTA dock) and GSAP/Lenis choreography. Centrepiece: a pinned
glass app window that plays a three-scene product demo as you scroll
(delegate → Ocur executes → approval). Full conversion machinery:
nav anchors, connector logo row, stats counters, complete pricing,
FAQ, trust beats in the demo and bento. English-only, `noindex`; its
~55 KB gz motion stack loads only on its own page, and all animation
gates behind `html.motion`. To retire: delete `alt/`, `src/alt/`,
`src/designbar.js`, the `initDesignBar` calls, the nav-offset rules
in `style.css`, and the `alt` input in `vite.config.js`.

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
