# Site design

The public site speaks the Ocur app language: the design approved for
plutus-cloud's app interiors on 2026-10-16 (Competitors, News, Automation,
CRM). Source of truth, in the plutus-cloud repository:

- `skills/ocur-design-language/agent.md` — the guide (surfaces, type,
  geometry, navigation, components, motion, accessibility).
- `skills/ocur-design-language/references/reading-tokens.css` — the exact
  palette, glass and frost values.
- `frontend/src/components/competitors/competitors.css` — the reference
  implementation of the glass capsule, tab lens, buttons and sheets.

The `--cp-*` block at the top of `src/style.css` matches that palette. Keep
the CSS-only dark fallback in sync too. Follow the app guide when reviewing
this site; the desktop shell's Prism/Pulse styling is not the public site's
design authority.

## Structure of the site

Five marketing pages, each with one job, instead of one long page:

| Page | Path | What it holds |
| --- | --- | --- |
| Home | `/` (`index.html`) | the opening ([hero.md](hero.md)), *You keep the say* (four control and data cards), the product family, the connectors, three cards to the other pages, the closing card |
| Product | `/product` | a page head, the pinned demo, the ledgers, the features (each of those two ends in *Start free* and *Book a demo*), the first ten minutes, a closer look at the reading pages, the closing card |
| Pricing | `/pricing` | both plan ladders behind the *Just me / My company* switch, the extras and notes, five pricing questions, the closing card |
| FAQ | `/faq` | the questions in three groups beside a sticky head with a *Book a demo* card, the closing card |
| Contact | `/contact` | *Talk to us* (the lead form, `#talk`), what happens next, and the booking page |

Every page has a German twin under `/de` (prerendered, see the README).
The pages share their head bits, icon sprite and closing card as partials
(`partials/`, included by `scripts/lib/partials.mjs`). The nav, the phone
menu and the footer are drawn at build time from `src/site.js` by
`scripts/lib/chrome.mjs`, for every page and language — including the
legal and reading pages — so they never drift apart. The game (`/be-ai`)
keeps its own nav (`header[data-nav="own"]`).

**Navigation.** The nav holds the three destinations (Product, Pricing,
FAQ), *Log in*, *Book a demo* (quiet) and *Start free* (blue). The current
page wears the lens; a reading page under Product (integrations, use cases)
marks Product. Contact is in the phone menu and the footer. Language and
theme are secondary settings, so they live in the footer and the phone
menu, not the bar. Below 900px the links move into the phone menu and only
*Start free* stays beside the burger.

**Moving between pages.** Where the browser supports cross-document view
transitions (and the visitor hasn't asked for reduced motion), pages
crossfade and the lens slides to the new page's link. Only the lens is
named: a named nav would become a backdrop root and lose its glass blur.

**Old anchors.** The site used to be one page, so the home page forwards
its old anchors (`/#pricing`, `/#faq`, `/#system` …, and the form's no-JS
return `/?sent=1#talk`) to the page that has them now, before first paint.

On the home page, the opening uses the current theme's neutral canvas and
the rest of the page rises over it as one rounded sheet (`.o-sheet`). The
other pages start with a page head (`.pg-head` / `.pg-top`): a blue kicker,
the page title in two voices and one sentence. A page never hides what is
already on screen when it opens; entrance motion is for what you scroll to.

The opening, closing card, autopilot tile and game all follow the selected
theme. Do not restore forced dark islands, decorative background auras,
metallic headline gradients or hand-drawn interface fonts. Existing brand
marks and the game's drawing-paper colours retain their own identity.

## Rules carried over from the app guide

- **Cards for content, glass for controls.** `.lg` is the opaque card (white
  on `#f2f2f7`, charcoal on black). Glass — fill and blur on `::before`,
  bright edge on `::after` — is reserved for the floating nav, the phone
  menu and the segmented controls.
- **Blue means action and selection.** Filled blue capsules are the primary
  actions; gray capsules with blue text are the quiet second doors. Orange
  marks attention and the fox; green marks success
  and live status; small category symbols carry the other colours.
- **Sentence case, calm type.** The system stack first (SF Pro on Apple
  devices), Inter elsewhere. Headlines are 700 with tight tracking; the
  second voice of a headline uses the secondary label colour. Reading-page
  headings use the guide's 2.125rem title and prose is bounded to 46rem.
- **One selection lens.** The nav's lens slides to the chapter on screen
  (`src/chrome.js`); the segmented controls slide theirs the same way.
- **Geometry.** 26px cards, 22px tiles, 999px capsules, 18px gaps; the
  sections breathe at `--g-section`.

## Motion

Scroll motion lives in a reversible GSAP context in `src/main.js`. It only
runs without a system reduced-motion preference or `data-motion="reduced"`.
Changing either preference reverts pins, inline styles and split text. The
opening's deck is `src/hero.js`, started from the same place. Its copy and
actions are immediately readable; do not reintroduce a blurred entrance.

| Moment | What happens |
| --- | --- |
| The opening | the copy and actions are immediately readable; the example deck deals jobs and rests when the sheet covers it |
| Navigation | the lens marks the current page and slides to the next one between pages (view transitions) |
| Connectors | the rings expand, the sun pops, the planets swirl out to their orbits |
| Demo | the window tips up out of the page; the ask types itself; four scenes over one pinned stretch, with the step rail filling toward the next step |
| Headlines | every section headline below the first screen rises line by line out of its own mask (SplitText, re-split on font load and resize); page titles never wait |
| The ledgers | the statement lights up word by word, scrubbed to the scroll |
| Cards | control cards, ledgers, tiles, steps, prices, the contact form and the resources cascade in row by row as you reach them |
| First ten minutes | the timeline's line draws itself with the scroll |
| Pricing | the selection slides; prices re-set themselves when the billing interval changes |
| FAQ | answers unfold to their height where the browser supports `interpolate-size` |
| Closing card | a neutral card with the same type and material roles as the main content |

Guard rails:

- Hidden starting states are set by GSAP, never by CSS, so the page reads
  with JavaScript off. Without JavaScript the demo shows its end state. The
  opening's copy and actions have no entrance delay.
- Elements GSAP moves have their CSS transitions held off during the reveal
  and handed back afterwards (`transition: none`, then `clearProps`), so the
  two never ease the same property.
- Reveals use opacity, never `visibility`, so keyboard focus can reach
  content that has not been revealed yet.

## Navigation and accessibility

`src/mobile-menu.js` controls the shared narrow-screen menu on the homepage,
reading pages and game. It moves focus into the dialog, traps Tab/Shift+Tab,
supports Escape, makes the background inert, and restores focus on close.
Language links only appear when a translation exists. Touch controls have
a 44px minimum target. Keep high-contrast glass solid and remove backdrop
blur for reduced-transparency preferences.

## Checking a change

`npm test` and `npm run build` (German prerender, legal and discovery
checks). In a browser: 320, 390, 768, 1120, 1280 and 1440 wide; light and
dark; every marketing page in both languages (`/`, `/product`, `/pricing`,
`/faq`, `/contact` and their `/de` twins); moving between pages; reduced
motion; JavaScript off; the reading pages (`/privacy`, `/integrations`,
`/data`) and the game (`/be-ai`). Never send a real message through the
contact form while testing.

The link previews (`public/og.jpg`, `og-de.jpg`, `be-ai-og.png`) are drawn in
the same language by `npm run gen:og`; bump their `?v=` when they change.
