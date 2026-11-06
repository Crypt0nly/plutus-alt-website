# Ocur — the AI operating system for companies

The Ocur marketing site: five short pages — Home, Product, Pricing, FAQ and
Contact — with one shared nav and footer. Home opens on what Ocur is, both
doors in, and Ocur visibly at work — a live deck of real jobs, no scrolling
needed ([docs/hero.md](docs/hero.md)); everything is drawn in the **Ocur app
language** — the design approved for plutus-cloud's apps
(`skills/ocur-design-language`): neutral reading surfaces, restrained blue
actions, floating glass controls and calm, large type — with GSAP scroll
choreography on top ([docs/site-design.md](docs/site-design.md)). Built with
Vite, vanilla JS, and vanilla CSS.

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

## Site tour

The site used to be one long page whose nav jumped between seven sections.
It is now five pages, each with one job; the nav names three of them
([docs/site-design.md](docs/site-design.md) → Structure of the site).

1. **Home** (`/`, `index.html`) — the opening: "Less busywork. *More
   business.*", one sentence on what Ocur is, **Start free** beside *Book a
   demo*, and Ocur at work: a deck of Ocur windows, one real job each —
   chasing overdue invoices, answering leads, taking calls, a weekday
   autopilot ([docs/hero.md](docs/hero.md)). Under the buttons: *Free plan ·
   No credit card*. With motion the page rises over it as one sheet: *You
   keep the say* (`#control` — asks before anything important, every action
   on the record, only what you connect, your data stays yours, with a link
   to `/data`; each claim is one the FAQ and privacy policy already make),
   the product family (Ocur, oDrops, oWorlds — the oWorlds view is a render
   of the current 3D office and links to the public demo world, see
   [docs/product-visuals.md](docs/product-visuals.md)), the
   connectors ("Works inside the tools your company already runs on.", a
   small solar system of the connectors, with a link to `/integrations`),
   three cards to Product, Pricing and the FAQ, and the closing card.
2. **Product** (`/product`) — a page head ("One Ocur for the work *across
   your company.*"), then the pinned demo "Delegate it. *Watch it happen.*":
   an Ocur window plays a four-scene story as you scroll — the ask typed
   live ("40 units short — sort it out with the supplier"), the facts and a
   real phone call, the deal waiting for your OK, the payoff report (€312
   recovered). Outbound calling is a real shipped capability (plutus-cloud's
   `phone_service.py`). Without motion it shows the payoff. Then the ledgers
   (`#system`, "Other AI answers. *Ocur keeps the books.*"), the eleven
   feature tiles (`#features`) — both end in *Start free* and *Book a demo*
   (`.g-inline-cta`), so the long page has a way in before its end —
   "Your first ten minutes" (`#start`), a closer
   look at the reading pages (integrations and two use cases, added by the
   build) and the closing card.
3. **Pricing** (`/pricing`) — two ladders behind one switch ("Just me" /
   "My company"), because the two are priced on different units. **Solo**:
   Free (1.5M credits, 2 Drops) / Starter $29 (3M, 10 Drops) / Pro $149
   (16M, 50 Drops, "most popular") / Pro Plus $299 (32M, 100 Drops), each
   with its annual price (2 months free). **Company**: Team $399 (48M pooled,
   2 AI workers) / Growth $1,500 (180M, 5 AI workers, "most popular") /
   Scale $5,000 (600M, 15 AI workers), monthly, every six months or annually,
   unlimited human members, plus an extras row (+1 AI worker $199/mo, $100
   per +10M credits, Enterprise). Each company card leads with *Get Team /
   Growth / Scale* (sign-up with the plan and the chosen billing interval)
   over a quiet *or talk to us first →* (the contact form with the plan).
   The *What's an AI worker?* note and a *Not ready for a company plan?*
   line (start free, or talk to us about a pilot) sit inside the company
   ladder. Every card leads with what Ocur does; the oDrops line comes last,
   as plain text (no link off the page). Under the ladders, five pricing
   questions (`#pricing-faq`: what a credit is, running out, cancelling,
   trying before paying, paying per person) answer where people decide.
   Both ladders are in the DOM — the switch only decides which is on screen,
   so crawlers, the German prerender and a page whose bundle never ran all
   still see every price. Prices, credits, Drop limits and benefits mirror
   the Ocur Desktop and oDrops cards in plutus-cloud's
   `frontend/src/lib/plans.ts`, `PricingPlanGrid.tsx` and
   `odrops/src/Billing.tsx`. Credits are shared across Ocur, oDrops and oWorlds,
   cost-weighted by model and media, and renew monthly even with annual
   billing. When updating pricing, use those cards as the source of truth
   and update both `pricing/index.html` and `src/strings.de.js` together.
4. **FAQ** (`/faq`) — eleven `<details>` accordions in three groups
   (getting started; how Ocur works; your company and your data) beside a
   sticky head with a *Book a demo* card.
5. **Contact** (`/contact`) — "Talk to us. *Or see it live first.*": the
   *Talk to us* form beside *What happens next* and the founder's booking
   page — see [Talk to us](#talk-to-us-the-contact-form).

Every page but Contact ends with the same closing card: "Run the company.
*Not the busywork.*" → **Start free**, with *Book a live demo* and *Talk to
us* beneath it. Shared parts of the pages live in `partials/` (the head
bits, the icon sprite and the closing card), included at build time with
`<!-- @include partials/… -->`.

## Book a demo

For anyone who'd rather see Ocur first. Every door leads to one
destination: the founder's booking page, which is Ocur's own calendar
feature served by the app backend (`https://api.ocur.ai/api/book/<slug>` —
see plutus-cloud's `calendar.py`; the link's title, length and video-call
location are edited in the app, not here). The doors: the nav (`nav`), the
phone menu (`menu`), the opening (`hero`), the product page's chapter
ends (`product-system`, `product-features`), the FAQ's side card and answer
(`faq-side`, `faq`), the contact page (`contact`), the closing card
(`final`) and the footer (`footer`).

Every door opens in a new tab and carries `data-book="<placement>"`, which is
what the analytics key on: PostHog gets `book_demo_click` with the placement
(`src/chrome.js`), and X Ads gets a `book_demo` conversion through the same
dual-fire path as Start free (`src/xads.js`; event id
`VITE_X_EVENT_ID_BOOK_DEMO` / `X_EVENT_ID_BOOK_DEMO`, dormant until set). The
href is repeated on every link on purpose — the pages have to work with no
JS, and the German prerender copies the markup — so when the booking link
changes, update `BOOK_URL` in `src/site.js` and `src/strings.de.js`, and grep
for `data-book` in the pages and partials.

## Talk to us (the contact form)

The form on `/contact` (`#talk`) is the site's lead form, so a message lands
in the founder's Ocur the way a lead always did — same endpoint, same slug,
same manual-review flow. Fields: work email, name, an optional company, an
optional team size (`1`, `2-10`, `11-50`, `51-200`, `201+`), an optional
phone ("so we can call you") and the message; plus hidden `plan` and
`locale`. The script checks email, name and message in order before
anything is sent. The pricing page's company cards and the Enterprise extra
link here with `?plan=team|growth|scale|enterprise`; the plan goes into the
hidden field and shows as a small note above the fields.

It posts to the app backend's `POST /api/leads/<slug>` — the same slug as
the booking page (plutus-cloud's `leads.py`). With no `kind`, the backend
treats it as a plain website lead: a CRM contact tagged `lead`, `website`,
`team:<size>` and `plan:` when given, a dated fact with the message, and a
notification on the founder's channel headed **New lead from ocur.ai**.
Every submission is marked `manual-contact-only` and `needs-review`; the
founder makes contact personally and Ocur sends no automated outreach. The
page promises no answer time. (The backend still understands the old
founding-cohort application, `kind=application`; the site no longer sends
it.)

With JS the script posts JSON through the same-origin rewrite in
`vercel.json` (`/leads/api/<slug>`, so ad blockers that stop cross-origin
API calls don't lose messages) and shows the answer inline. The browser
fetches `GET /api/leads/<slug>/challenge` through
`/leads/api/<slug>/challenge` and solves Ocur's signed SHA-256 puzzle in a
Web Worker when the form comes into view or gets focus. Every POST carries
a fresh `pow` proof, checked and spent on the backend before a contact,
fact or notification can be created. Puzzles expire in 30 minutes; the
browser refreshes its cached puzzle after 25 minutes and retries a refused
proof (HTTP 400) once. Validation failures and rate limits are never
retried. Network failures keep all typed fields. JavaScript and WebCrypto
are required to send; visitors without them get the booking page instead,
in both languages. The submit button starts disabled until the form script
has initialized. Without JS the backend redirects a post to `/?sent=1#talk`
(or `/de/…`); the home page forwards that to `/contact?sent=1#talk`, which
shows the thanks.

The backend also checks the fields, rejects known temporary inboxes,
HTML/link markup and messages with three or more URLs, and limits failed
attempts, challenge issuance, daily IP volume, Gmail mailbox aliases and
repeated long messages across different senders. The honeypot, body cap,
IP/link/email limits and duplicate suppression remain in place.

Analytics: PostHog gets `talk_open` (a pricing link opened the form, with
the plan) and `lead_submit` (with the plan, the team size and whether a
phone and a company were given); X Ads gets the `lead` conversion through
the same dual-fire path as the other two (`VITE_X_EVENT_ID_LEAD` /
`X_EVENT_ID_LEAD`, dormant until set). German copy is in
`src/strings.de.js` (the status messages are in `src/contact-form.js`,
keyed on the page language), and the hidden `locale` field flips to `de` in
the prerender so a no-JS post comes back to the German page.

## Tech notes

- **Vite** build, five marketing pages sharing one entry (`src/main.js`),
  plus the reading pages and the game; **vanilla JS** + a motion stack of
  **GSAP + ScrollTrigger + SplitText**. Vanilla CSS, with the design tokens
  (the app's `--cp-*` palette) at the top of `src/style.css`.
- Fonts: the system stack first (SF Pro on Apple devices, as in the app),
  Inter from Google Fonts elsewhere. JetBrains Mono remains for the game's
  small print.
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
  `.env.example` are set with real event ids from X Events Manager. Only
  links into sign-up (`app.ocur.ai/?auth=sign-up…`) count as the Start-free
  conversion — *Log in* and the oWorlds demo link carry the twclid but are
  not conversions.
- **Sign-up clicks and campaigns**: every link into sign-up fires PostHog's
  `signup_click` with its `placement` (nav, menu, hero, products,
  pricing-card, pricing-pilot, pricing-faq, product-system,
  product-features, final, footer, …), the `plan` and `interval` it carries,
  and the visit's campaign tags (`src/chrome.js`). `src/attribution.js`
  keeps `utm_*` tags from the landing URL for the tab (sessionStorage) and
  adds them to every app.ocur.ai link, so a sign-up keeps the campaign that
  brought it (the app has to read them to report on them). PostHog's
  cookieless mode — one visitor counted across pages without storing
  anything — is opt-in with `VITE_POSTHOG_COOKIELESS=always`, after
  cookieless tracking is enabled in the PostHog project.
- **Motion gates behind `html.motion`** (set in `<head>` unless the visitor
  prefers reduced motion), and every hidden starting state below the
  opening is set by GSAP, never by CSS, so the page reads fine without JS or
  with reduced motion. The opening's own entrance is paint-time CSS that
  never hides its headline. The opening's deck holds its first job,
  finished (the chips still switch jobs without motion); the pinned demo
  falls back to its end state (with or without JS); the connector orbits
  stop; counters show their final values; the opening stops holding still
  under the sheet.
- **Glass for controls, cards for content** (the app's rule): the nav
  capsule — whose lens marks the current page and slides to the next one
  between pages — the phone menu and the segmented controls use the app's
  glass recipe; everything you read sits on opaque cards.
- **Themes**: a sun/moon toggle in the footer and the phone menu switches between the app's
  light (white cards on `#f2f2f7`) and dark (charcoal on black) palettes,
  persisted in localStorage (`ocur-theme`), with `prefers-color-scheme` as
  the first-visit default. Colours flow through the `--cp-*` tokens at the
  top of `src/style.css`, copied from plutus-cloud's
  `skills/ocur-design-language/references/reading-tokens.css`; the older
  `--g-*` names remain as aliases for the reading pages and the game. The
  opening, the closing card and the autopilot tile are dark islands
  (`.o-dark`) in either theme.
- **Localisation**: every marketing page has a real prerendered German
  twin — `npm run build` runs `scripts/prerender-de.mjs`, which applies the
  dictionary in `src/strings.de.js` (CSS selector → replacement HTML) to
  each built page with cheerio and writes `dist/de/index.html`,
  `dist/de/product/index.html` and so on (euro pricing, translated copy,
  `lang="de"`, its own title, description and canonical, and every
  internal link pointed at its German twin). Each page carries `hreflang`
  alternates, so English and German index separately. At runtime
  `src/i18n.js` only routes: German-language browsers landing on an English
  page are sent to its German twin (`navigator.languages`, deliberately not
  geo-IP), a shared `/de/…` link is respected as-is, and the EN | DE switch
  in the footer is a pair of real links whose choice persists in
  localStorage (`ocur-lang`) and beats browser language. `?lang=de`
  force-applies German client-side on the dev server, where `/de/…` doesn't
  exist.

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
stage-and-app look, not a hand-rolled bitmap — and the outputs are committed,
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

The look is a **blend**: the Ocur app language plus hand-drawn
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

- **One nav for every page** (but the game), drawn at build time from
  `src/site.js` by `scripts/lib/chrome.mjs`: the three destinations
  (Product, Pricing, FAQ) with the current page on the lens, *Log in*,
  *Book a demo* as the quiet gray capsule and **Start free** in blue. The
  reading pages under Product (integrations, use cases) mark Product.
- **Log in** goes to `app.ocur.ai/?auth=sign-in`. Every *Start free* lands on
  the sign-up card (`/?auth=sign-up`) instead of the sign-in card's small
  "Sign up" link.
- **Pricing links deep-link into sign-up with the plan picked**:
  `?auth=sign-up&plan=starter|pro|pro-plus|team|growth|scale` (company
  cards add `&interval=` once a billing interval is chosen). The app keeps
  the `plan` through sign-up and opens its plan picker on that plan.
- **Below 980px** *Book a demo* leaves the bar; **below 900px** the links
  and *Log in* move into a frosted sheet behind the burger (`#g-menu`):
  Home, the three pages and Contact, then *Start free*, *Log in*, *Book a
  demo*, and the language and theme switches. `mobile_menu_open` is
  tracked.
- **The footer** (also from `chrome.mjs`) lists the product and reading
  pages, the ways to get started and the trust pages, with the copyright,
  the EN | DE switch, the theme button and X along the bottom.
- **On phones both pricing ladders stack** under their own ledes instead of
  hiding one behind the *Just me / My company* switch.

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
index.html         # home (ocur.ai/)
product/, pricing/, faq/, contact/   # the other marketing pages
partials/          # head bits, icon sprite, closing card — shared by those pages
be-ai/index.html   # the reverse Turing test game (ocur.ai/be-ai)
privacy/index.html # the privacy policy (ocur.ai/privacy)
terms/index.html   # the terms of service (ocur.ai/terms)
data/index.html    # where your data goes (ocur.ai/data)
de/privacy/, de/terms/, de/data/   # their German twins
de/impressum/      # Anbieterkennzeichnung § 5 DDG (German pages only)
content/pages.js   # the reading pages: /integrations and two use cases
src/
  site.js          # the site map: nav destinations, pages, shared links
  main.js          # every marketing page: GSAP choreography, pricing switch, page parts
  contact-form.js  # "Talk to us": validation, browser proof, posting
  hero.js          # the opening's deck: four live jobs, the chips, pause, the pointer lean
  chrome.js        # nav state, the scroll edge, the opening's stage, booking-link analytics
  style.css        # the design system: app tokens, glass controls, cards, every section
  legal.js         # entry for the legal and reading pages — theme + language, no GSAP
  legal.css        # long-form reading layout: sticky TOC, prose, data tables
  i18n.js          # language routing + EN|DE switch
  strings.de.js    # the entire German dictionary (data only)
  theme.js         # dark/light toggle
  analytics.js     # PostHog (lazy, env-gated) + a small track() helper
  xads.js          # X Ads conversions: twclid capture + CTA dual-fire
  be-ai*.js/.css   # /be-ai live game
api/
  x-conversions.js    # Vercel function: X Conversions API relay (token stays server-side)
scripts/
  lib/chrome.mjs      # draws the nav, phone menu and footer for every page and language
  lib/partials.mjs    # <!-- @include partials/… -->
  lib/discovery.mjs   # page enrichment: chrome, structured data, reading pages
  prerender-de.mjs    # bakes the German pages after the Vite build
  build-discovery.mjs # sitemap, llms.txt, Markdown copies
  check-legal.mjs     # guards the Google-OAuth requirements (see below)
  check-discovery.mjs # checks every built page, link, language and the shared nav
  gen-og.mjs          # renders the OG share cards into public/
docs/
  site-design.md                 # the design rules and the structure of the site
  hero.md                        # the opening
  google-oauth-verification.md   # what verification needs, and what's left to set
```

## Notes

- The brand and site are **Ocur** (ocur.ai); every *Book a demo* goes to
  the founder's booking page, every *Talk to us* to the contact form, and
  every other CTA to the app's sign-up route,
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
