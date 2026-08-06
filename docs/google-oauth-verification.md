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
| "The app name 'OcurAI' … does not match the app name on your homepage." | The site says **Ocur** everywhere and now says it machine-readably too (`<meta name="application-name">`, `SoftwareApplication` JSON-LD, the App identity table in the policy). **The console still says `OcurAI` — rename it.** | `index.html` head; console change below |

`npm run build` runs `scripts/check-legal.mjs`, which fails the build if a legal
page stops being built, if either home page stops linking to it, or if the
Limited Use disclosure disappears from a privacy policy. It warns (does not
fail) while the operator placeholders are unfilled.

## Before submitting: three things this repo can't do

### 1. Fill in the operator details

Four pages carry `[[ PLACEHOLDER ]]` blocks marked with an
`OCUR_LEGAL_ENTITY` comment and a loud on-page box: `privacy/`, `terms/`,
`de/privacy/`, `de/terms/`. They need the registered company name, address,
country, and — in the terms — governing law and venue. The build prints exactly
which ones are still open. **A reviewer who sees `[[ LEGAL ENTITY NAME ]]` will
reject the app**, so this is the blocking item.

### 2. Make the mailboxes real

The pages publish `privacy@ocur.ai`, `security@ocur.ai` and `legal@ocur.ai`.
They must accept mail before submission — Google mails the contact address, and
a bouncing privacy contact reads as an abandoned app.

### 3. Set the OAuth consent screen to match

In Google Cloud Console → APIs & Services → OAuth consent screen:

| Field | Value |
| --- | --- |
| App name | `Ocur` (currently `OcurAI` — this is finding #3) |
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

## Keeping the pages honest

The policy makes specific claims that must stay true as the product changes:
EU hosting (`eu-north-1`), 180-day audit retention, Fernet-encrypted connector
credentials, the sub-processor list, and no model training on customer content.
If any of those change, the policy changes in the same PR.
