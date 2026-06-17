# Ocur — the AI operating system for companies

The Ocur marketing site: an Apple-keynote-style page in the **"Obsidian
Glass"** direction — a near-black canvas, fox-orange glow meshes, true
liquid-glass surfaces everywhere, and GSAP/Lenis scroll choreography. Built
with Vite, vanilla JS, and vanilla CSS.

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
   your company *ran itself?*", risk-removing microcopy (free pilot · no
   credit card · no IT project), and three count-up stats.
2. **Connector solar system** — Ocur as a glowing glass sun, the connectors
   orbiting in two counter-rotating rings (Gmail, Google Calendar, Drive,
   Notion, GitHub inner; Telegram, WhatsApp, Discord, email, your computer,
   the web outer) plus a dashed **"+"** slot for connectors you build
   yourself. CSS-only orbits; GitHub's mark uses `currentColor` to follow
   the theme.
3. **Pinned product demo** — "Delegate it. *Watch it happen.*": a pinned
   glass app window plays a three-scene story as you scroll — the ask → the
   work → the sign-off (Approve / Hold). Without motion it shows the end
   state so the story still reads.
4. **Bento features** — "One system. *Every job.*": six liquid-glass tiles
   (autopilot heartbeat, every department, talk to it, company memory,
   drives your computer, built for control), each with a pointer-tracked
   glare.
5. **Pricing** — Free ("for the pilot") / Team ($149, "most popular") /
   Business ($299), mirroring the in-app plans and token allowances, with
   an Enterprise note.
6. **FAQ** — seven `<details>` accordions answering the classic objections:
   free?, install?, autonomy/approval, integrations, privacy, company-wide
   use, rollout time.
7. **Final CTA** — "Run the company. *Not the busywork.*" → **Start free**.

A persistent floating glass **CTA dock** rides along from just past the
hero until the final section.

## Tech notes

- **Vite** build, single page; **vanilla JS** + a motion stack of
  **GSAP + ScrollTrigger + SplitText + Lenis** (~59 KB gz). Vanilla CSS,
  with the liquid-glass and theme tokens at the top of `src/style.css`.
- Fonts: Inter (body) + JetBrains Mono (labels), via Google Fonts.
- **Motion gates behind `html.motion`** (set in `<head>` unless the visitor
  prefers reduced motion), so the page reads fine without JS or with
  reduced motion. The pinned demo falls back to its end state; the connector
  orbits stop; counters show their final values.
- Liquid-glass system: pointer-tracked specular glare on every `.glare`
  surface, magnetic buttons, a custom cursor (fine pointers only), and the
  counter-rotating connector orbits.
- **Themes**: dark is the default; a sun/moon toggle in the nav switches to
  a frosted-white light mode, persisted in localStorage (`ocur-theme`), with
  `prefers-color-scheme` as the first-visit default. Every colour flows
  through the `--g-*` token block — retint by editing the
  `html[data-theme='light']` block only.
- **Localisation**: the German page is a real prerendered URL — `npm run
  build` runs `scripts/prerender-de.mjs`, which applies the dictionary in
  `src/strings.de.js` (CSS selector → replacement HTML) to the built page
  with cheerio and writes `dist/de/index.html` (euro pricing, translated
  copy, `lang="de"`, its own canonical). Both pages carry `hreflang`
  alternates, so English and German index separately. At runtime
  `src/i18n.js` only routes: German-language browsers landing on `/` are
  redirected to `/de/` (`navigator.languages`, deliberately not geo-IP), a
  shared `/de/` link is respected as-is, and the EN | DE toggle in the nav
  is a pair of real links whose choice persists in localStorage (`ocur-lang`)
  and beats browser language. `?lang=de` force-applies German client-side on
  the dev server, where `/de/` doesn't exist.

## Deploy (Vercel)

The repo is connected to Vercel (build `npm run build`, output `dist/`).
`vercel.json` moves the language routing to the edge — zero client hops in
production:

- `/` with a German `Accept-Language` and no preference cookie → 307 to
  `/de/`.
- An explicit EN/DE choice is stored in the `ocur-lang` cookie (set by the
  nav toggle) and wins in both directions.
- A deliberately opened `/de/` link with no stored preference is served
  as-is.
- `/assets/*` (hashed filenames) are served immutable for a year.

`public/sitemap.xml` lists both language URLs with hreflang alternates;
`public/robots.txt` points to it — submit the sitemap in Google Search
Console once the domain is live. The client-side routing in `src/i18n.js`
stays as a fallback for dev and non-Vercel hosts.

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
  main.js        # GSAP/Lenis choreography, pinned demo, micro-interactions
  style.css      # the liquid-glass design system (theme tokens at the top)
  i18n.js        # language routing + EN|DE toggle
  strings.de.js  # the entire German dictionary (data only)
  theme.js       # dark/light toggle
scripts/
  prerender-de.mjs  # bakes dist/de/index.html after the Vite build
```

## Notes

- The brand and site are **Ocur** (ocur.ai); every CTA points to
  app.ocur.ai.
- Copy is drafted from Ocur's public description; the demo conversation and
  the stat figures are illustrative placeholders — swap in real examples
  before launch.
- Earlier explored design directions — including **"Midnight Aurora"** (the
  serif/aurora direction that was A) and six others (neon attention-max,
  direct-response converter, enterprise "PlutusOS", serif editorial, playful
  coworker) — live in this repo's git history.
