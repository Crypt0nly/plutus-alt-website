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
> image generation, autonomous email replies (Ocur's own inboxes), the
> phone connector (Ocur's own number, inbound calls, transcripts), the
> business ledgers (commitments, money, CRM, stock, agent-designed
> business objects, the Command Center), Live Apps, record-a-skill,
> org/role guardrails, and the Free / Team ($1,500) / Business ($5,000)
> plans.

## Page tour

1. **Hero** — kicker "The AI operating system for companies", then "What if
   your company *ran itself?*", risk-removing microcopy (free pilot · no
   credit card · no IT project), and three count-up stats.
2. **Connector solar system** — Ocur as a glowing glass sun, the connectors
   orbiting in two counter-rotating rings (Gmail, Google Calendar, Drive,
   Notion, GitHub inner; Telegram, WhatsApp, Slack, Discord, email, your
   computer, the web outer) plus a dashed **"+"** slot for connectors you
   build yourself. CSS-only orbits; GitHub's mark uses `currentColor` to
   follow the theme.
3. **Pinned product demo** — "Delegate it. *Watch it happen.*": a pinned
   glass app window plays a four-scene story as you scroll, built around
   the "no way" capability — Ocur makes a real phone call. The ask ("40
   units short — sort it out with the supplier", typed out live with a
   blinking caret) → the facts, then the call (stock ledger vs. delivery
   note, the contract clause from Drive, then a pulsing "● live" card:
   Ocur is on the phone with the supplier, plus a quoted line from the
   call) → the deal ("€312 credit + Thursday redelivery — take it?"; the
   button presses itself, the written confirmation goes out) → the payoff
   report ("While you stayed in your meeting — €312 recovered" counting
   up; credit booked, redelivery on the calendar, transcript filed).
   Without motion it shows the payoff report so the story still reads.
   Outbound calling is a real shipped capability (see plutus-cloud's
   `phone_service.py` — outbound-call intents, transcripts).
4. **The ledgers** (`#system`) — "Other AI answers. *Ocur keeps the
   books.*": six glass cards that make the "operating system" claim
   literal — commitments, money, the self-updating CRM, stock, the
   agent-designed business database, and the Command Center — closed by
   the one-graph line (a won deal books its receivable, a promise is
   already a commitment).
5. **Bento features** — "One system. *Every job.*": eleven liquid-glass
   tiles (autopilot heartbeat, answers its own email, talk to it, answers
   the phone, parallel workers, record-a-skill, company memory, drives
   your computer, built for control, builds its own tools/Live Apps, every
   department), each with a pointer-tracked glare.
6. **Pricing** — Free ("for the pilot") / Team ($1,500, "most popular") /
   Business ($5,000), mirroring the in-app plans and token allowances, with
   an Enterprise note.
7. **FAQ** — nine `<details>` accordions answering the classic objections:
   free?, vs. a chat assistant?, install?, autonomy/approval, what if it's
   wrong?, integrations, privacy, company-wide use, rollout time.
8. **Final CTA** — "Run the company. *Not the busywork.*" → **Start free**.

A persistent floating glass **CTA dock** rides along from just past the
hero until the final section.

## Tech notes

- **Vite** build, single page; **vanilla JS** + a motion stack of
  **GSAP + ScrollTrigger + SplitText + Lenis** (~59 KB gz). Vanilla CSS,
  with the liquid-glass and theme tokens at the top of `src/style.css`.
- Fonts: Inter (body) + JetBrains Mono (labels), via Google Fonts.
- **Analytics & ads**: PostHog product analytics, lazy-loaded and env-gated
  (`VITE_POSTHOG_KEY`, see `src/analytics.js`), cookie-free with memory-only
  persistence. The **X Ads conversion pixel** (`reji3`) sits inline in every
  page's `<head>` (all seven HTML entry points — `/de/` inherits it through
  the prerender), gated to the production hostname so localhost and Vercel
  previews don't pollute conversion data. The base pixel only reports page
  visits; define conversion events on it in X Ads Manager, then fire them
  with `twq('event', 'tw-reji3-…', {…})` (safe everywhere — off-prod `twq`
  is a no-op stub).
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

## Link previews

Every page unfurls with a full-bleed card when it's pasted into X, WhatsApp,
iMessage, LinkedIn, Slack or Discord — `summary_large_image` plus a 1200×630
image, `og:url`, `og:site_name` and `og:locale`:

| Page | Card |
| --- | --- |
| `ocur.ai/` | `public/og.jpg` |
| `ocur.ai/de/` | `public/og-de.jpg` |
| `ocur.ai/be-ai` | `public/be-ai-og.png` |

The cards are rendered from HTML through Playwright's Chromium — the real
Obsidian-Glass look, not a hand-rolled bitmap — and the outputs are committed,
so the production build never touches them:

```bash
npm i -D playwright && npm run gen:og     # all three
npm run gen:og og.jpg                     # just one
```

Playwright is a one-off tool, deliberately not a shipped dependency (it would
pull a browser download into every install and Vercel build).

Two things to keep in mind when changing a card:

- **Bump the `?v=` query** on `og:image`/`twitter:image` (in `index.html` and
  `scripts/prerender-de.mjs`) — every crawler caches the image by URL, so
  without a new URL the old art keeps unfurling.
- **Keep it well under 300 KB.** WhatsApp silently drops the preview on heavy
  images. That's why the home cards are JPEG q96 (~130 KB, no visible
  difference on art that's mostly a smooth gradient) while `/be-ai` keeps the
  PNG it was already shared with.

The German page gets its own card, `og:url`, `og:locale` and Twitter copy,
swapped in by `scripts/prerender-de.mjs` from `src/strings.de.js`.

### When a post shows no image

Almost always a cache, not a bug — check the markup is actually live before
changing anything:

```bash
curl -s -A "Twitterbot/1.0" https://ocur.ai/ | grep -E 'og:image|twitter:card'
curl -sI https://ocur.ai/og.jpg | grep -iE 'HTTP|content-type'
```

If those look right, it's the platform's cache:

- **X** snapshots a link card **when the post is composed** — editing the post
  afterwards does not re-fetch it, so a post written before a deploy keeps the
  old card forever. X also caches card data per URL for roughly a week. The
  Card Validator that used to force a re-scrape (`cards-dev.twitter.com/validator`)
  was retired and now just redirects to a login page; there is no official
  replacement. To get a fresh crawl before the cache expires, post the link
  with a distinct query string — a `?utm_source=x` is a different URL to the
  crawler, and `canonical`/`og:url` still point at the clean one, so SEO is
  unaffected.
- **WhatsApp / iMessage / LinkedIn** share Meta's scraper cache, which
  [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
  can still refresh on demand.

Worth knowing what X will drop a card over: `twitter:title` > 70 chars,
`twitter:description` > 200, `twitter:image:alt` > 420, a relative or
non-HTTPS image URL, or an image the crawler can't fetch (check `robots.txt`
and any bot protection in front of the domain).

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
- `/be-ai/api/*` is rewritten (proxied) to `api.ocur.ai/api/be-ai/*` so the
  game's interactive parts run on the app backend while the page itself stays
  on the marketing site (see the `/be-ai` section above).

`public/sitemap.xml` lists both language URLs (plus `/be-ai`) with hreflang
alternates;
`public/robots.txt` points to it — submit the sitemap in Google Search
Console once the domain is live. The client-side routing in `src/i18n.js`
stays as a fallback for dev and non-Vercel hosts.

## `/be-ai` — the live "be the AI" game (top of funnel)

A standalone, shareable **realtime multiplayer** game at **`ocur.ai/be-ai`** —
the structure of [youraislopbores.me](https://youraislopbores.me), with Ocur as
the house player. Two roles:

- **Be the AI** — join the AI queue, get strangers' prompts, and answer
  pretending to be a machine in **text or a drawing**; fool the asker to earn
  credits and a "Certified Artificial" leaderboard spot.
- **Spot the AI** — ask a prompt, read the answers, and pick the real Ocur
  hiding among the humans.

The look is a **blend**: the Obsidian Glass design system plus hand-drawn
accents (a Caveat marker font, wobbly `.ba-sketch` borders, offset marker
shadows, a scribble underline). Anonymous by design — a client-generated player
id in `localStorage` is the only identity; login is a later conversion step.

**Transport / infra split.** The website owns the public shell, SEO and routing;
the game lives in the app backend (`plutus-cloud`).

- **Realtime** runs over a WebSocket the client opens **directly** to
  `wss://api.ocur.ai/api/be-ai/ws?pid=<id>` — Vercel rewrites don't carry WS
  upgrades, so it is *not* proxied. Messages: `join_queue` / `ask` / `respond`
  / `guess` / `vote`.
- **HTTP** (gallery, leaderboard) goes through the same-origin `/be-ai/api/*`
  rewrite → `api.ocur.ai/api/be-ai/*` (in `vercel.json`; `vite.config.js`
  mirrors it as a dev proxy). Override with `VITE_BE_AI_WS`,
  `VITE_BE_AI_BACKEND`, `VITE_BE_AI_API`.

**Ocur is the house player**, so a round always works even with nobody in the
queue. **Brand safety:** human answers (text or drawing) are always shown and
labelled as **not Ocur** ("🥸 … pretending to be an AI"); only the real Ocur
answer carries the mark. The backend moderates text and validates drawings.

`/be-ai` carries its own `canonical`, `summary_large_image` OG/Twitter tags and
a sitemap entry; it is English-only (no `/de/` variant yet).

**Share cards.** Each result renders to a 1200×630 card client-side (canvas) and
shares via the native sheet where supported, else an X / LinkedIn / Save modal —
every card stamped "Made with Ocur". The page's static OG image is
`public/be-ai-og.png` — see [Link previews](#link-previews).

**Analytics.** Funnel events fire through PostHog (`be_ai_role`, `be_ai_ask`,
`be_ai_respond`, `be_ai_guess`, `be_ai_cta_click`, `be_ai_share*`) — the metric
that matters is `/be-ai → app.ocur.ai` CTR.

## Legal pages (and why the build checks them)

`/privacy` and `/terms` — plus `/de/privacy` and `/de/terms` — are hand-written
HTML entry points, not dictionary-prerendered like `/de/`: they're long-form
prose on their own schedule, and `/privacy` has to answer with a real policy at
exactly that URL because that's the privacy policy URL registered on Ocur's
Google OAuth consent screen. They share the design system through
`src/legal.js` (`style.css` + `legal.css`, theme and EN|DE chrome, no GSAP), and
the EN|DE switch reads the page's own `hreflang` alternates, so it lands on the
translation of the page you're reading rather than the home page.

Google rejected Ocur's first verification attempt for exactly the failures this
setup now prevents, so `npm run build` ends with `scripts/check-legal.mjs`,
which **fails** the build if a legal page stops being emitted, if either home
page stops linking to its privacy policy and terms, or if the Limited Use
disclosure vanishes from a policy — and **warns** while the operator
placeholders are still unfilled.

The German side additionally carries an **Impressum** at `/de/impressum` (§ 5
DDG — the company's principal place of business is in Wolfsburg). It's linked
from every German page; the home page link is appended by
`scripts/prerender-de.mjs`, since the English page has no counterpart.

`docs/google-oauth-verification.md` has the rest: the operator details as
published, the scope-by-scope justifications, the exact values for the consent
screen, and the items that have to be set outside this repo.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/  (deploy this; Vercel → Vite preset)
npm run preview
```

Note that `vite preview` serves `/privacy` (no trailing slash) with the SPA
fallback — use `/privacy/` locally. Vercel resolves the directory index either
way, which is how `/be-ai` already works in production.

## Structure

```
index.html         # the marketing home page (ocur.ai/)
be-ai/index.html   # the reverse Turing test game (ocur.ai/be-ai)
privacy/index.html # the privacy policy (ocur.ai/privacy)
terms/index.html   # the terms of service (ocur.ai/terms)
de/privacy/, de/terms/   # their German twins (/de/privacy, /de/terms)
de/impressum/      # Anbieterkennzeichnung § 5 DDG (German pages only)
src/
  main.js          # GSAP/Lenis choreography, pinned demo, micro-interactions
  style.css        # the liquid-glass design system (theme tokens at the top)
  legal.js         # entry for the legal pages — theme + EN|DE chrome, no GSAP
  legal.css        # long-form reading layout: sticky TOC, prose, data tables
  i18n.js          # language routing + EN|DE toggle
  strings.de.js    # the entire German dictionary (data only)
  theme.js         # dark/light toggle
  analytics.js     # PostHog (lazy, env-gated) + a small track() helper
  be-ai.js         # /be-ai live game: WebSocket client + view state machine
  be-ai.css        # /be-ai styling — Ocur glass + hand-drawn "sketch" accents
  be-ai-draw.js    # /be-ai drawing pad (answer a prompt with a scribble)
  be-ai-share.js   # /be-ai share card (canvas) + native share / modal
scripts/
  prerender-de.mjs    # bakes dist/de/index.html after the Vite build
  check-legal.mjs     # guards the Google-OAuth requirements (see below)
  gen-og.mjs          # renders the OG share cards into public/
docs/
  google-oauth-verification.md   # what verification needs, and what's left to set
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
