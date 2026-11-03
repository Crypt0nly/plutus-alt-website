// "Talk to us" — the contact form (contact/index.html, #talk).

import { track } from './analytics.js';
import { trackXConversion, LEAD_EVENT_ID } from './xads.js';
import { createFormProtection } from './form-protection.js';

// The site's lead form: it lands in the founder's Ocur as a lead — contact,
// fact, notification for personal review. Posts JSON to the app backend
// through the same-origin rewrite in vercel.json (/leads/api/<slug> →
// api.ocur.ai/api/leads/<slug>); the form's own action is the direct URL.
// Every submission carries a single-use browser proof; without JavaScript
// the form offers the booking page instead. The business plans and the
// Enterprise extra on the pricing page link here with ?plan=…, which goes
// into the hidden field the lead lands with.
export function initContactForm() {
  const talk = document.getElementById('g-talk');
  if (!talk) return;
  const de = document.documentElement.lang === 'de';
  const status = talk.querySelector('.g-talk-status');
  const planField = talk.querySelector('input[name="plan"]');
  const emailField = talk.querySelector('input[name="email"]');
  const button = talk.querySelector('button[type="submit"]');
  const protection = createFormProtection(talk.dataset.endpoint);
  const say = (text) => {
    status.textContent = text;
  };
  const thanks = (withPhone) =>
    de
      ? `Danke — deine Nachricht ist da. Der Gründer meldet sich persönlich bei dir, per ${withPhone ? 'Anruf oder E-Mail' : 'E-Mail'}.`
      : `Thanks — your message is in. The founder will get back to you personally, by ${withPhone ? 'phone or email' : 'email'}.`;
  // What a message can't go without, in the order the fields sit.
  const needed = [
    ['name', 'Please add your name.', 'Bitte gib deinen Namen an.'],
    ['message', 'Tell us how we can help — one line is enough.', 'Sag uns kurz, wobei wir helfen können — eine Zeile reicht.'],
  ];

  // A pricing card or the Enterprise link sent the visitor here with its
  // plan (/contact?plan=growth#talk): carry it in the hidden field,
  // say so above the fields, and put a mouse user's cursor in the first one.
  const PLANS = { team: 'Team', growth: 'Growth', scale: 'Scale', enterprise: 'Enterprise' };
  const plan = new URLSearchParams(location.search).get('plan');
  if (PLANS[plan]) {
    planField.value = plan;
    const note = talk.querySelector('.g-talk-plan');
    if (note) {
      note.textContent = de ? `Zum ${PLANS[plan]}-Plan` : `About the ${PLANS[plan]} plan`;
      note.hidden = false;
    }
    if (matchMedia('(pointer: fine)').matches && location.hash === '#talk') {
      window.setTimeout(() => emailField.focus({ preventScroll: true }), 400);
    }
  }

  // back from a no-JS post: the backend redirects to ?sent=1#talk
  if (new URLSearchParams(location.search).get('sent') === '1') {
    talk.classList.add('is-sent');
    say(thanks(false));
  }

  if (window.crypto?.subtle && 'Worker' in window) {
    button.disabled = talk.classList.contains('is-sent');
    talk.addEventListener('focusin', () => protection.prepare(), { once: true });
    if ('IntersectionObserver' in window) {
      const watcher = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          watcher.disconnect();
          if (!talk.classList.contains('is-sent')) protection.prepare();
        }
      }, { rootMargin: '200px' });
      watcher.observe(talk);
    }
  } else {
    say(de
      ? 'Dein Browser unterstützt die Prüfung nicht. Bitte öffne die Seite in einem aktuellen Browser oder buch nebenan ein Gespräch.'
      : 'Your browser cannot run the check. Please use an up-to-date browser or book a call beside this form.');
  }

  talk.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (talk.classList.contains('is-sent') || talk.querySelector('button[type="submit"]').disabled) return;
    const data = Object.fromEntries(new FormData(talk).entries());
    const email = String(data.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      say(de ? 'Bitte gib eine gültige E-Mail-Adresse an.' : 'Please enter a valid email address.');
      emailField.focus();
      return;
    }
    const missing = needed.find(([name]) => !String(data[name] || '').trim());
    if (missing) {
      const [name, en, deText] = missing;
      say(de ? deText : en);
      talk.elements[name].focus();
      return;
    }
    button.disabled = true;
    talk.setAttribute('aria-busy', 'true');
    say(de ? 'Wird geprüft und gesendet…' : 'Checking and sending…');
    try {
      const post = async () => {
        const pow = await protection.take();
        return fetch(talk.dataset.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, pow, locale: de ? 'de' : 'en', page: location.pathname }),
          signal: AbortSignal.timeout(20_000),
        });
      };
      let res = await post();
      // Only 400 means a stale/spent proof. Retry it once; never retry a flood or invalid fields.
      if (res.status === 400) res = await post();
      if (!res.ok) {
        let detail = '';
        try {
          detail = (await res.json()).detail || '';
        } catch {
          /* not JSON */
        }
        throw new Error(typeof detail === 'string' ? detail : '');
      }
      talk.classList.add('is-sent');
      say(thanks(Boolean(String(data.phone || '').trim())));
      track('lead_submit', {
        plan: data.plan || '',
        team_size: data.team_size || '',
        phone: Boolean(String(data.phone || '').trim()),
        company: Boolean(String(data.company || '').trim()),
      });
      trackXConversion('lead', LEAD_EVENT_ID);
    } catch (err) {
      button.disabled = false;
      say(
        (err && err.message && !/browser check|timeout|abort/i.test(err.message) ? err.message : '') ||
          (de
            ? 'Das hat nicht geklappt — bitte versuch es gleich noch einmal, oder buch stattdessen ein Gespräch.'
            : "That didn't go through — please try again in a moment, or book a call instead."),
      );
    } finally {
      talk.removeAttribute('aria-busy');
    }
  });
}
