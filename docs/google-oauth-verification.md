# Google OAuth verification — what's on the site, what's on you

Ocur asks for Gmail, Google Calendar, Google Drive and Google Contacts scopes,
several of which Google classes as **restricted**. That puts the app through
OAuth verification, and a verification round-trip costs days — so this file
records what the site now provides, and the handful of things that have to be
set outside this repo.

## The three findings from the last attempt

| Google's finding | Fix | Where |
| --- | --- | --- |
| "Your homepage URL 'https://ocur.ai' does not include a link to your privacy policy." | Footer legal links on every page, plus a `rel="privacy-policy"` link element and a contextual link from the "Is our data private?" FAQ answer. | `index.html`, `be-ai/index.html`, `src/strings.de.js` (German labels + `/de/…` hrefs) |
| "Your privacy policy URL 'https://ocur.ai/privacy' is unresponsive." | A real privacy policy at that exact URL, plus terms, plus German versions. | `privacy/`, `terms/`, `de/privacy/`, `de/terms/` |
| "The app name 'OcurAI' … does not match the app name on your homepage." | The site says **Ocur** everywhere and now says it machine-readably too (`<meta name="application-name">`, `SoftwareApplication` JSON-LD, the App identity table in the policy), and the footer names the publisher — "a product of OcurAI, Inc." — so both names appear on the home page with the relationship stated. **The console still says `OcurAI` — rename it to `Ocur`.** | `index.html` head + footer; console change below |

`npm run build` runs `scripts/check-legal.mjs`, which fails the build if a legal
page stops being built, if either home page stops linking to it, or if the
Limited Use disclosure disappears from a privacy policy.

## The operator, as published

All five legal pages carry the same block, marked with an `OCUR_LEGAL_ENTITY`
comment — change one, change them all:

| | |
| --- | --- |
| Legal entity | OcurAI, Inc., a Delaware C corporation |
| Registered office | 131 Continental Dr, Suite 305, Newark, DE 19713, USA |
| Registered agent | Legalinc Corporate Services Inc. (same address) |
| Principal place of business | Luisenstraße 8, 38448 Wolfsburg, Germany |
| Represented by | Felix Maximilian Graef |
| Register | Delaware Division of Corporations, file number 10662165 |
| Phone | +49 171 2189405 |
| Governing law / venue | Delaware, USA — with mandatory EU/UK/CH consumer protections preserved |

Deliberately **not** published anywhere: the EIN and the incorporation date.
Neither is required by any of these documents, and an EIN in public is a
gift to anyone filing things in your name. The German Impressum publishes the
Delaware file number instead, which is public record either way.

No VAT ID is published because none was provided — § 5 DDG only requires one if
the company has one. If a USt-IdNr. gets issued, add it to
`de/impressum/index.html`.

## Before submitting: two things this repo can't do

### 1. Make the mailboxes real

The pages publish `privacy@ocur.ai`, `security@ocur.ai` and `legal@ocur.ai`.
They must accept mail before submission — Google mails the contact address, and
a bouncing privacy contact reads as an abandoned app.

### 2. Set the OAuth consent screen to match

In Google Cloud Console → APIs & Services → OAuth consent screen:

| Field | Value |
| --- | --- |
| App name | `Ocur` (currently `OcurAI` — this is finding #3) |
| Publisher / developer | OcurAI, Inc. |
| User support email | a monitored address on the domain |
| App logo | the fox mark (`public/logo.svg`, exported to 120×120 PNG) |
| Application home page | `https://ocur.ai` |
| Application privacy policy link | `https://ocur.ai/privacy` |
| Application terms of service link | `https://ocur.ai/terms` |
| Authorised domain | `ocur.ai` |
| Developer contact | a monitored address |

The app name has to match the name on the home page character for character.
The site brand is `Ocur`, so the console moves to `Ocur` — not the other way
round. (The JSON-LD also lists `Ocur AI` and `OcurAI` as `alternateName`, which
covers a reviewer arriving from the old name, but it is not a substitute for
renaming.)

Also confirm in the console that `ocur.ai` is verified in Search Console under
the same Google account, that the OAuth client's redirect URI is the production
`/oauth/callback`, and that the app is **In production**, not Testing.

## The scopes, and what the reviewer will ask about each

From `backend/app/services/google_oauth.py` in `plutus-cloud`:

| Scope | Class | Justification the policy gives |
| --- | --- | --- |
| `openid`, `userinfo.email`, `userinfo.profile` | basic | identify the connected account |
| `gmail.readonly` | restricted | triage, summarise, find threads and attachments |
| `gmail.modify` | restricted | label, archive, mark read, manage drafts |
| `gmail.compose` | restricted | prepare drafts for approval |
| `gmail.send` | restricted | send the message the user approved |
| `contacts.readonly`, `profile.emails.read` | sensitive | resolve a name to the right address |
| `calendar.events` | sensitive | read and manage the events the user asks about |
| `drive` | restricted | work inside the file the user points at |

Restricted scopes also require a demo video showing the OAuth consent flow and
each restricted scope actually being used in-product, and — depending on the
review — a CASA security assessment. Neither lives in this repo; budget for
them.

## Optional hardening worth doing anyway

- **Revoke upstream on disconnect.** `disconnect_connector` in `plutus-cloud`
  deletes the stored Google tokens but doesn't call
  `https://oauth2.googleapis.com/revoke` (the constant is defined and unused).
  The grant therefore stays listed in the user's Google Account until they
  remove it themselves. The policy is written accurately around this — it points
  users at `myaccount.google.com/permissions` — but calling revoke on disconnect
  is the behaviour reviewers expect.
- **In-product privacy link.** Link `https://ocur.ai/privacy` from the app's
  connector settings, next to the Google connect button.

## German Impressum

Because the company's principal place of business is in Wolfsburg, the German
side of the site needs an Impressum under § 5 DDG (and § 18 Abs. 2 MStV for the
responsible person). It lives at `/de/impressum`, is linked from the footer and
nav of every German page — the home page link is appended by
`scripts/prerender-de.mjs`, since the English page has no counterpart — and the
build check treats a missing link as an error.

It states no willingness to take part in consumer arbitration (Ocur is a B2B
product) and deliberately carries no EU ODR link: that platform was shut down in
July 2025 and linking it now is simply wrong.

## Keeping the pages honest

The policy makes specific claims that must stay true as the product changes:
EU hosting (`eu-north-1`), 180-day audit retention, Fernet-encrypted connector
credentials, the sub-processor list, and no model training on customer content.
If any of those change, the policy changes in the same PR.
