// The beta waitlist — one field, and a puzzle the browser solves so the
// visitor doesn't have to prove anything.
//
// A form whose only field is an email address is the easiest thing on a
// website to abuse, and the usual answer is a CAPTCHA: the visitor pays
// with their attention, and a third party gets to watch everyone who
// comes near the page. This page does it the other way round. Before the
// form may post, the browser fetches a signed puzzle from the backend and
// burns a little CPU finding the number behind a hash (the ALTCHA scheme;
// plutus-cloud's `bot_shield.py` mints and checks it). Nobody is asked to
// identify a traffic light, nothing leaves for a third party, and one
// sign-up costs a fraction of a second where ten thousand cost real
// machine time.
//
// The solve starts the moment someone shows interest — a focus in the
// field, or the section coming into view — so by the time an address has
// been typed the answer is usually already waiting. The puzzle is
// single-use and short-lived, so each submission gets a fresh one.
//
// The post goes through the same-origin rewrite in vercel.json
// (/waitlist/api/<slug> → api.ocur.ai/api/waitlist/<slug>), so ad blockers
// that stop cross-origin API calls don't quietly lose sign-ups. Nothing is
// on the list until the backend's confirmation link is clicked; the click
// comes back here as ?confirmed=1#beta.

import { track } from './analytics.js';

// How many hashes to try before handing the main thread back, so a slow
// phone keeps scrolling smoothly while it works.
const YIELD_EVERY = 1024;

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Find the number the server hid behind the hash. The only way through is
// to try them in turn — which is the entire point.
async function solve({ salt, challenge, signature, max_number: max }) {
  for (let number = 0; number <= max; number += 1) {
    if ((await sha256Hex(`${salt}${number}`)) === challenge) {
      return { salt, challenge, signature, number };
    }
    if (number % YIELD_EVERY === YIELD_EVERY - 1) await wait(0);
  }
  return null;
}

// Fetch a puzzle and solve it, remembering when it may first be spent.
// The backend refuses an answer that comes back sooner than a browser and
// a person plausibly could — a floor it publishes rather than keeps
// secret, so an honest page simply waits the remainder out instead of
// being punished for a fast autofill.
async function fetchAndSolve(endpoint) {
  const res = await fetch(`${endpoint}/challenge`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('challenge');
  const challenge = await res.json();
  const ripeAt = Date.now() + (Number(challenge.min_age_ms) || 0);
  const answer = await solve(challenge);
  return answer && { answer, ripeAt };
}

export function initWaitlist() {
  const form = document.getElementById('g-beta');
  if (!form) return;

  const de = document.documentElement.lang === 'de';
  const endpoint = form.dataset.endpoint;
  const status = form.querySelector('.g-beta-status');
  const field = form.querySelector('input[name="email"]');
  const button = form.querySelector('button[type="submit"]');
  const say = (text) => {
    status.textContent = text;
  };

  const copy = de
    ? {
        working: 'Wird gesendet…',
        sent: 'Fast geschafft — klick den Link in deinem Postfach, um deinen Platz zu bestätigen.',
        confirmed: 'Du stehst auf der Liste. Wir melden uns, sobald deine Einladung bereit ist.',
        badEmail: 'Bitte gib eine gültige E-Mail-Adresse an.',
        failed:
          'Das hat nicht geklappt — bitte versuch es gleich noch einmal, oder schreib uns direkt.',
        noCrypto:
          'Dein Browser unterstützt die Prüfung nicht. Schreib uns kurz über das Kontaktformular — wir tragen dich von Hand ein.',
      }
    : {
        working: 'Sending…',
        sent: "Almost there — check your inbox and click the link to confirm you're in.",
        confirmed: "You're on the list. We'll write the moment your invitation is ready.",
        badEmail: 'Please enter a valid email address.',
        failed: "That didn't go through — please try again in a moment, or write to us instead.",
        noCrypto:
          "Your browser can't run the check. Write to us through the contact form and we'll add you by hand.",
      };

  // Back from the confirmation link in the email.
  if (new URLSearchParams(location.search).get('confirmed') === '1') {
    form.classList.add('is-done');
    say(copy.confirmed);
    track('waitlist_confirmed');
  }

  // No WebCrypto (an insecure context, a museum-piece browser): say so
  // rather than letting someone type into a form that can't post.
  if (!window.crypto?.subtle) {
    button.disabled = true;
    say(copy.noCrypto);
    return;
  }

  // The puzzle in flight, started on the first sign of interest so the
  // work is usually finished before the address is.
  let pending = null;
  const warmUp = () => {
    if (!pending) pending = fetchAndSolve(endpoint).catch(() => null);
    return pending;
  };

  field.addEventListener('focus', warmUp, { once: true });
  if ('IntersectionObserver' in window) {
    const watcher = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          watcher.disconnect();
          warmUp();
        }
      },
      { rootMargin: '200px' },
    );
    watcher.observe(form);
  }

  const openedAt = Date.now();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const email = String(data.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      say(copy.badEmail);
      field.focus();
      return;
    }

    button.disabled = true;
    say(copy.working);

    const post = async (solved) => {
      // One puzzle, one post: whatever happens, the next attempt needs a
      // fresh one (the backend spends it either way).
      pending = null;
      if (!solved) throw new Error('');
      await wait(Math.max(0, solved.ripeAt - Date.now()));
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          website: data.website || '',
          pow: solved.answer,
          locale: de ? 'de' : 'en',
          page: location.pathname,
          referrer: document.referrer || '',
          form_ms: Date.now() - openedAt,
        }),
      });
      return res;
    };

    try {
      let res = await post(await warmUp());
      // 400 is the backend refusing the puzzle itself — the one the page
      // warmed up may have gone stale while the visitor read the page, or
      // been spent by a double click. Worth exactly one silent retry with
      // a fresh one; anything else is the visitor's to see.
      if (res.status === 400) res = await post(await warmUp());
      if (!res.ok) {
        let detail = '';
        try {
          detail = (await res.json()).detail || '';
        } catch {
          /* not JSON */
        }
        throw new Error(typeof detail === 'string' ? detail : '');
      }
      form.classList.add('is-sent');
      say(copy.sent);
      track('waitlist_submit', { locale: de ? 'de' : 'en' });
    } catch (err) {
      button.disabled = false;
      warmUp(); // a fresh puzzle, ready for the next try
      say((err && err.message) || copy.failed);
    }
  });
}
