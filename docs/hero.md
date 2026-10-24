# The opening

The first screen does three jobs at once, with nothing to scroll first:

1. **Say what Ocur is.** "Less busywork. More business." and one sentence:
   the AI operating system for companies, what it does, and that you set
   the limits.
2. **Open both doors.** *Apply for the founding cohort* (the loud one) and
   *Start free* (the quiet gray one), the same pair as the nav, with the
   founding offer as a small pill above the headline and three plain facts
   under the buttons: a two-minute application, the answer time from
   `src/cohort.js`, and no credit card for the free plan.
3. **Show Ocur at work.** Beside the copy (below it on narrow screens), a
   deck of Ocur windows deals real jobs: the ask types itself, Ocur answers,
   the steps land one by one, and the result counts up.

It replaced a scroll-driven particle film (until October 2026). The film
looked spectacular, but a first-time visitor had to scroll through four
screens of shapes before learning what Ocur does or seeing a button. The
opening puts both on the first frame, and keeps the motion in the product
itself.

## The deck

Four jobs, each something the page promises further down:

| Job | The ask | What it shows |
| --- | --- | --- |
| Invoices | chase everything 30+ days overdue | the money ledger, email in your voice, a live phone call, €3,200 counted up |
| Leads | answer new leads in five minutes, book the good ones | inbox, qualification against the pipeline, a demo on the calendar |
| Calls | take my calls this afternoon | answering the phone, checking stock, a summary on WhatsApp |
| Autopilot | every weekday at 6: inbox, invoices, a WhatsApp brief | the heartbeat running before you're up |

The company names (Weber & Co., Nordwerk GmbH, Bäckerei Schmidt) and the
numbers are an illustrated example, not customers or results. The page
claims no customers, logos or metrics it doesn't have.

The ask for each job lives in `index.html`; the German in
`src/strings.de.js` under "the opening's deck". The dictionary's arrays run
in page order, and `tests/hero.test.mjs` fails if any German entry stops
matching the page, so add a job or a step in both places at once.

`src/hero.js` builds one paused GSAP timeline per window:

- **Typing.** The ask's letters appear in place (SplitText), so no window
  ever changes size. A caret rides the newest letter.
- **Ocur's turn.** The reply shimmers for a moment while Ocur "thinks".
- **The steps.** Each one lands with a spinner, then a check. A phone call
  shows a red *Live* tag with a small waveform first.
- **The result.** The result card rises. A number with `data-count` counts
  up to exactly what the page says (`data-prefix` / `data-suffix` carry
  "€" or "&nbsp;€").

The chip under each job fills while it plays. When a job is done it holds
for a few seconds, then slips down and away while the next window comes
forward from the stack behind it.

## Behaviour

- **The visitor is in charge.** A chip deals that job at once (`hero_example`
  in analytics), and the round button stops everything, CSS spinners
  included (`hero_pause`). While the mouse rests on the deck, or keyboard
  focus is in it, a finished job stays until they leave.
- **Nothing plays unseen.** The deck rests when it's off screen, and when
  the page has risen over the opening (`main.js` → `opening.cover()`).
- **The lean.** On a mouse, the deck tips a few degrees toward the pointer,
  the light behind it drifts the other way, and a light follows the
  pointer along the front window's edge.
- **The rising page.** With motion, the opening holds still while the page
  rises over it as one sheet, then dims and settles back. On phones the
  opening is taller than the screen, so `src/hero.js` measures it
  (`--hx-h`). It scrolls normally until its end is in view and holds from
  there.

## Fallbacks

- **Reduced motion:** the first job shows finished, and the chips switch
  finished jobs in place. Nothing types or deals itself, and there's no
  pause button because nothing moves.
- **No JavaScript:** the first job shows finished, exactly as written in
  `index.html`. The chips and the pause button are hidden.
- **Slow script:** if the deck is already on screen when the script
  arrives, the first job stays finished and dealing starts from the next
  one. The page never rewinds something the visitor is already reading.

## Speed

- **Paint-time entrance.** The entrance is CSS keyed on `html.motion`, so
  it starts with the first paint and never waits for the script.
- **Largest paint stays early.** The headline and its sentence settle out
  of a soft blur instead of starting hidden, so the browser counts them as
  the largest paint the moment they appear. Starting hidden would let a
  later line of demo text become the page's largest paint seconds in.
- **Cheap motion.** The light behind the deck is three soft gradients moved
  by transform, not a blur filter.
- **No WebGL.** Three.js is gone from the site, so the 3D engine no longer
  downloads at all.
