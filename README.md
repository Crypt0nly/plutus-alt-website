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
> org/role guardrails, and both plan ladders — solo (Free / Starter $29 /
> Pro $149 / Pro Plus $299) and company (Team $399 / Growth $1,500 / Scale
> $5,000, humans free, AI workers $199 each).

## Page tour

1. **Hero** — kicker "The AI operating system for companies", then "What if
   your company *ran itself?*", **Apply for the founding cohort** beside
   *Watch it work*, the application's microcopy (two-minute application ·
   answer within two business days · closes on the deadline), a quiet
   *Just you? Start free* line for solo, and three count-up stats that are
   the founding offer (seats, the founding discount, 1:1 setup) — see
   [Founding cohort](#founding-cohort-the-application).
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
6. **Pricing** — two ladders behind one switch ("Just me" / "My company"),
   because the two are priced on different units. **Solo**: Free (1.5M
   tokens) / Starter $29 (5M) / Pro $149 (25M, "most popular") / Pro Plus
   $299 (50M), each with its annual price (2 months free). **Company**:
   Team $399 (48M pooled) / Growth $1,500 (240M, "most popular") / Scale
   $5,000 (680M), annual at one month free, unlimited human members, plus
   an extras row (+1 AI worker $199/mo, $100 top-ups, Enterprise). Both
   ladders are in the DOM — the switch only decides which is on screen, so
   crawlers, the German prerender and a page whose bundle never ran all
   still see every price. Mirrors the in-app plans and token allowances
   (plutus-cloud's `PLAN_LIMITS` / `ORG_PLAN_LIMITS`). Solo stays
   self-serve and says so ("open to everyone, no application"). The company
   ladder carries the **founding ribbon** (the discount, the setup, *Apply
   by …*), and its three cards lead with **Apply for the founding price**
   (to the application, with the plan picked) over a quiet *or start today
   at list price →* (sign-up with the plan).
7. **Founding cohort** (`#apply`) — "*N* companies first. *Set up by
   hand.*": four glass perks (founding price, setup with the founder, a
   direct line, early access), then the application beside *What happens
   next* and the founder's booking page — see
   [Founding cohort](#founding-cohort-the-application).
8. **FAQ** — thirteen `<details>` accordions: what the founding cohort is,
   who gets in and how fast, whether you have to apply (no — solo is open),
   then the classic objections: vs. a chat assistant?, install?,
   autonomy/approval, what if it's wrong?, integrations, privacy,
   company-wide use, pay-per-person?, rollout time, a demo first?
9. **Final CTA** — "Run the company. *Not the busywork.*" → **Apply for the
   founding cohort**, with *Book a live demo* and *Just you? Start free*
   beneath it.

A persistent floating glass **CTA dock** — *Apply now · Founding cohort ·
closes …* — rides along from just past the hero until the final section,
and steps aside while the application itself is on screen.

## Book a demo

For anyone who'd rather see Ocur before applying. Four doors, one
destination: the founder's booking page, which is Ocur's own calendar
feature served by the app backend (`https://api.ocur.ai/api/book/<slug>` —
see plutus-cloud's `calendar.py`; the link's title, length and video-call
location are edited in the app, not here).

- **Book a demo** in the phone menu (`menu`);
- the **"Rather see it first?"** card beside the application, under *What
  happens next* (`cohort`) — the main one;
- the last **FAQ** entry ("Can I get a demo first?", `faq`);
- a *Book a live demo* line under the **final** Apply (`final`).

The nav's second pill is *Start free* now (the application is the first), so
the demo is no longer in the nav bar.

Every door opens in a new tab and carries `data-book="<placement>"`, which is
what the analytics key on: PostHog gets `book_demo_click` with the placement
(`src/main.js`), and X Ads gets a `book_demo` conversion through the same
dual-fire path as Start free (`src/xads.js`; event id
`VITE_X_EVENT_ID_BOOK_DEMO` / `X_EVENT_ID_BOOK_DEMO`, dormant until set). The
href is repeated on every link on purpose — the page has to work with no JS,
and the German prerender copies the markup — so when the booking link
changes, grep for `data-book` in `index.html` and update `BOOK_URL` in
`src/strings.de.js` (the German FAQ answer carries its own inline link).

## Founding cohort (the application)

The launch runs on an application, not a waitlist: a capped, dated
**founding cohort** of companies the founder sets up personally, at a
founding price. Solo stays open to everyone (*Start free*), so the scarcity
sits on the offer — the price, the setup, the direct line, early access —
never on access to the software, and nothing on the page pretends a gate
that isn't there.

**The promises live in one file: `src/cohort.js`** — the seats, the
founding discount and how many months it runs, the deadline (`CLOSES_AT`,
end of that day Berlin time) and the answer time. `vite.config.js` fills
the `{{COHORT_*}}` tokens in `index.html` from it (dev server and build; an
unknown token fails the build), and `src/strings.de.js` builds the German
lines from the same values. Change a number there and both pages follow.
Every one of them is a public promise to a visitor — and a fake deadline or
seat count is on the UWG blacklist in Germany — so they change on purpose
and stay true. The answer time is also in the app's owner notification
(plutus-cloud, `lead_email_service.APPLICATION_ANSWER`); change both.

**When the deadline passes**, the inline script in `<head>` sets
`html.cohort-closed` from `<html data-closes>` and every `.g-deadline`
goes: the hero and final micro lines, the cohort kicker, the pricing
ribbon's *by …*, the dock's *closes …* and the FAQ clause. Each is written
so its sentence still reads without it — the page never promises a date
that has gone — and the build warns until a new `CLOSES_AT` is set. When
the cohort is full, set `CLOSES_AT` to now.

**Where it's asked for** — every Apply carries `data-apply="<placement>"`
and glides to `#apply`: the nav's primary pill (`nav`), the phone menu
(`menu`), the hero (`hero`), the company ladder's ribbon (`pricing`), the
dock (`dock`) and the final call (`final`). The company cards' *Apply for
the founding price* and the Enterprise extra's *Talk to us* go straight to
the form (`#talk`) with their plan in the hidden field.

**The form is the site's lead form** (it was "Talk to us"), so an
application lands in the founder's Ocur exactly the way a lead always did —
same endpoint, same slug, same manual-review flow. Fields: work email, company,
name, role (optional), team size (`1`, `2-10`, `11-50`, `51-200`, `201+`),
an optional phone ("so we can call you"), and the first job they'd hand
Ocur; plus hidden `kind=application`, `plan` and `locale`. The script
checks the required ones in order before anything is sent.

It posts to the app backend's `POST /api/leads/<slug>` — the same slug as
the booking page, so one identifier on the site and the lead reaches
whoever owns that link (plutus-cloud's `leads.py`; `docs/CRM.md` → Website
leads → Founding-cohort applications). There it becomes a CRM contact
tagged `lead`, `website`, `founding-cohort`, `team:<size>` (and `plan:` when
a card sent it), the role on the contact, a dated fact ("Applied to the
founding cohort … The first job they'd hand Ocur: …"), a notification on the
founder's channel headed **New founding-cohort application**. Every submission
is marked `manual-contact-only` and `needs-review`. The founder reviews it and
makes contact personally; Ocur sends no acknowledgement or automated outreach.
The backend also blocks mail to existing website leads at delivery time.
With JS the script posts JSON
through the same-origin rewrite in `vercel.json` (`/leads/api/<slug>`, so ad
blockers that stop cross-origin API calls don't lose applications) and shows
the answer inline; the form's own `action` is the direct URL, so with no JS
the backend takes the plain post and sends the visitor back to
`/?sent=1#talk` (`/de/…` on the German page), which the script renders as
the same thank-you. A hidden honeypot, IP/link and submitted-email rate limits,
a request-body cap and duplicate suppression live on the backend. The browser
matches the field caps and ignores repeated submit clicks.

Analytics: PostHog gets `apply_click` (with the placement), `talk_open` (a
card or the Enterprise link opened the form, with the plan) and
`lead_submit` (with `kind`, plan, team size and whether a phone, a company
and a role were given); X Ads gets the `lead` conversion through the same
dual-fire path as the other two (`VITE_X_EVENT_ID_LEAD` / `X_EVENT_ID_LEAD`,
dormant until set). German copy — "das Pilotprogramm", its price der
Pilotpreis — is in `src/strings.de.js` (the status messages are in
`src/main.js`, keyed on the page language), and the hidden `locale` field
flips to `de` in the prerender so a no-JS post comes back to the German
page.

## Tech notes

- **Vite** build, single page; **vanilla JS** + a motion stack of
  **GSAP + ScrollTrigger + SplitText + Lenis** (~59 KB gz). Vanilla CSS,
  with the liquid-glass and theme tokens at the top of `src/style.css`.
- Fonts: Inter (body) + JetBrains Mono (labels), via Google Fonts.
- **Analytics & ads**: PostHog product analytics, lazy-loaded and env-gated
  (`VITE_POSTHOG_KEY`, see `src/analytics.js`), cookie-free with memory-only
  persistence. The **X Ads conversion pixel** (`reji3`) sits inline in every
  page's `<head>` (all seven HTML entry points — `/de/` inherits it through
  the prerender), verbatim from X Ads Manager and deliberately not
  host-gated: X's Pixel Helper and Events Manager can then verify the
  install on previews and localhost too (an earlier hostname guard made the
  helper report "script detected but no pixel fired" on non-prod hosts).
  The base pixel only reports page visits. Conversions ride on top:
  `src/xads.js` captures the `twclid` from ad-click landings (30-day
  window), passes it through on every app.ocur.ai link (so the app backend
  can report the real signup conversion later), and on Start-free clicks
  fires the event twice with one `conversion_id` for dedup — through the
  pixel (`twq('event', …)`, blocked by ad blockers) and through the
  serverless Conversions API relay `api/x-conversions.js` (not blocked;
  the `X_PIXEL_TOKEN` secret never leaves Vercel). Demo bookings are the
  second conversion: every `data-book` link fires `book_demo` the same way.
  Both legs stay dormant until the `X_EVENT_ID_*`/`VITE_X_EVENT_ID_*` vars in
  `.env.example` are set with real event ids from X Events Manager.
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
  `/de`.
- An explicit EN/DE choice is stored in the `ocur-lang` cookie (set by the
  nav toggle) and wins in both directions.
- A deliberately opened `/de` link with no stored preference is served
  as-is.
- `www.ocur.ai` permanently redirects to `ocur.ai`, preserving the path
  and query string. `trailingSlash: false` consolidates `/de/` into `/de`
  and normalizes the other directory pages the same way.
- `/assets/*` (hashed filenames) are served immutable for a year.
- `/be-ai/api/*` is rewritten (proxied) to `api.ocur.ai/api/be-ai/*` so the
  game's interactive parts run on the app backend while the page itself stays
  on the marketing site (see the `/be-ai` section above).

`scripts/build-discovery.mjs` generates `dist/sitemap.xml` from the HTML
pages actually built, with reciprocal hreflang alternates. It also emits
`llms.txt`, `llms-full.txt`, and a Markdown copy of every public page
(`/index.md` for the English homepage, `/de.md` for German, `/product.md`,
and so on). These files are generated on every build, so pricing and
product information follow the HTML rather than a separately maintained
summary. `llms.txt` is an optional aid for readers that use it, not a
requirement or a ranking guarantee.

`public/robots.txt` allows public crawling by search and AI providers;
training crawlers remain allowed through the wildcard rule. Only the
proxied game and lead API paths are excluded, and those responses get
`X-Robots-Tag: noindex, nofollow`. No public HTML page gets that header.
The sitemap remains `https://ocur.ai/sitemap.xml`: submit it to Google
Search Console and Bing Webmaster Tools, then use their inspection tools
to check the selected canonical URLs and indexing. Bot-name HTTP tests
do not verify provider IP access; use Vercel request logs to investigate
real crawler denials before changing firewall settings.

`content/pages.js` contains English and German content for `/product`,
`/integrations`, `/use-cases/invoice-follow-up`, and
`/use-cases/business-phone`. The same template and site styles render
both languages. Prices link to the homepage rather than being duplicated.
Edit these claims when the product changes. `scripts/lib/discovery.mjs`
adds static language links, product navigation, and Organization,
WebSite, SoftwareApplication, WebPage and breadcrumb metadata. The
language-switch JavaScript records the preference on the existing links.

`npm run build` ends with `scripts/check-discovery.mjs`. It checks all
emitted pages, sitemap coverage, reciprocal languages, canonical URLs,
structured data, static switches, internal links and anchors, local
assets, Markdown copies, public crawl rules and redirect destinations.
`npm run check:discovery` rechecks an existing build. The local Vite
preview resolves directory pages the same way as Vercel; development
serves the generated content-page templates directly. Language routing
in `src/i18n.js` remains a fallback for dev and non-Vercel hosts.

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

## Nav, phone menu and the doors into the app

- **The nav's two pills**: *Apply now* (the founding-cohort application,
  `#apply`) and, beside it, *Start free* as the quiet glass one — solo is
  open to everyone. *Start free* leaves the bar below 1280px, where one
  button is all the pill has room for.
- **Log in** sits next to them: `app.ocur.ai/?auth=sign-in`. Every
  *Start free* (nav, hero, phone menu, solo cards, the cohort section,
  final) lands on the sign-up card (`/?auth=sign-up`) instead of the
  sign-in card's small "Sign up" link.
- **Pricing links deep-link into sign-up with the plan picked**:
  `?auth=sign-up&plan=starter|pro|pro-plus|team|growth|scale` — the solo
  buttons, and the company cards' *or start today at list price →*. The
  app keeps the `plan` through sign-up and opens its plan picker on that
  plan.
- **Below 1100px** the nav links, the *Log in* link and the language switch
  leave the pill and a burger opens a glass sheet (`#g-menu`): the section
  links, the application across the top of its buttons, *Log in* and
  *Start free* side by side, *Book a demo*, and the EN | DE switch (cloned
  in by `src/i18n.js`). `mobile_menu_open` is tracked.
- **On phones both pricing ladders stack** under their own ledes instead of
  hiding one behind the *Just me / My company* switch.
- **"Your first ten minutes"** (`#start`, between features and pricing)
  prepares visitors for the desk they land on: sign in → say the first job
  → connect one tool → put it on autopilot.

## Where your data goes (`/data`, `/de/data`)

A plain map of which external service receives customer content, when,
and what stays put — the customer-facing edition of the app repo's
`docs/DATA_FLOWS.md`, in the legal-page shell (`src/legal.js`,
`src/legal.css`). Linked from the FAQ's privacy answer, the footer, and
the app's Settings › Guardrails. Both pages are Vite entries and the build
guard checks they exist. Keep it in step with `DATA_FLOWS.md` when a flow
changes.

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
  main.js          # GSAP/Lenis choreography, pinned demo, the application form, micro-interactions
  cohort.js        # the founding cohort's promises: seats, founding price, deadline, answer time
  style.css        # the liquid-glass design system (theme tokens at the top)
  legal.js         # entry for the legal pages — theme + EN|DE chrome, no GSAP
  legal.css        # long-form reading layout: sticky TOC, prose, data tables
  i18n.js          # language routing + EN|DE toggle
  strings.de.js    # the entire German dictionary (data only)
  theme.js         # dark/light toggle
  analytics.js     # PostHog (lazy, env-gated) + a small track() helper
  xads.js          # X Ads conversions: twclid capture + CTA dual-fire
  be-ai.js         # /be-ai live game: WebSocket client + view state machine
  be-ai.css        # /be-ai styling — Ocur glass + hand-drawn "sketch" accents
  be-ai-draw.js    # /be-ai drawing pad (answer a prompt with a scribble)
  be-ai-share.js   # /be-ai share card (canvas) + native share / modal
api/
  x-conversions.js    # Vercel function: X Conversions API relay (token stays server-side)
scripts/
  prerender-de.mjs    # bakes dist/de/index.html after the Vite build
  check-legal.mjs     # guards the Google-OAuth requirements (see below)
  gen-og.mjs          # renders the OG share cards into public/
docs/
  google-oauth-verification.md   # what verification needs, and what's left to set
```

## Notes

- The brand and site are **Ocur** (ocur.ai); every *Apply* goes to the
  application on the page (`#apply`), every *Book a demo* to the founder's
  booking page, and every other CTA to the app's sign-up route,
  `https://app.ocur.ai/?auth=sign-up`. A bare `app.ocur.ai`
  shows the app's *sign-in* card, which sent new visitors hunting for the
  "Sign up" link. The legal pages' in-text mentions of app.ocur.ai stay bare
  on purpose — they name the application, they don't sell it. Where Clerk
  sends people *after* they sign up is a Clerk Dashboard setting, documented
  in plutus-cloud's README ("Clerk Dashboard: redirect settings").
- Copy is drafted from Ocur's public description; the demo conversation and
  the stat figures are illustrative placeholders — swap in real examples
  before launch.
- Earlier explored design directions — including **"Midnight Aurora"** (the
  serif/aurora direction that was A) and six others (neon attention-max,
  direct-response converter, enterprise "PlutusOS", serif editorial, playful
  coworker) — live in this repo's git history.
