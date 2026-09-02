// Vercel serverless relay for the X Ads Conversions API.
//
// The site is static, so the X-Pixel-Token (a real secret — anything in the
// bundle ships to every visitor) can only live server-side: the browser posts
// a tiny JSON here (see src/xads.js), and this function forwards it to
// https://ads-api.x.com/{v}/measurement/conversions/{pixel} with the token
// from the environment. Dual-fire dedup: the browser also fires the same
// event through the pixel (twq('event', …)) with the same conversion_id, and
// X collapses the pair.
//
// Config (Vercel → Settings → Environment Variables; see .env.example):
//   X_PIXEL_TOKEN         Conversions API token — REQUIRED, secret.
//   X_EVENT_ID_CTA_CLICK  tw-reji3-… id from Events Manager for 'cta_click'.
//   X_EVENT_ID_BOOK_DEMO  same, for 'book_demo' (the Book-a-demo links).
//   X_PIXEL_ID            defaults to 'reji3'.
//   X_ADS_API_VERSION     defaults to '12'.
//
// The caller sends a logical event key, never a raw event id — only ids
// configured here can be emitted. Identity is taken from the request itself
// (IP + user agent) plus the twclid the client captured from the ad click;
// X requires twclid or the ip/user-agent pair to attribute.

const ALLOWED_HOSTS = /(^|\.)ocur\.ai$|\.vercel\.app$|^localhost(:\d+)?$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only' });
  }

  const origin = req.headers.origin;
  if (origin) {
    let host = '';
    try {
      host = new URL(origin).host;
    } catch {}
    if (!ALLOWED_HOSTS.test(host)) return res.status(403).json({ error: 'origin not allowed' });
  }

  const token = process.env.X_PIXEL_TOKEN;
  if (!token) return res.status(501).json({ error: 'X_PIXEL_TOKEN not configured' });

  // sendBeacon may deliver the JSON as a string, fetch as a parsed object
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'invalid JSON' });
    }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'missing body' });

  const eventIds = {
    cta_click: process.env.X_EVENT_ID_CTA_CLICK,
    book_demo: process.env.X_EVENT_ID_BOOK_DEMO,
  };
  const eventId = eventIds[body.event];
  if (!eventId) return res.status(400).json({ error: 'unknown or unconfigured event' });

  const identifier = {};
  if (typeof body.twclid === 'string' && body.twclid) identifier.twclid = body.twclid.slice(0, 500);
  const ip = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '')
    .split(',')[0]
    .trim();
  const ua = req.headers['user-agent'];
  if (ip && ua) {
    identifier.ip_address = ip;
    identifier.user_agent = ua;
  }
  if (!Object.keys(identifier).length) {
    return res.status(422).json({ error: 'no usable identifier (twclid or ip+user_agent)' });
  }

  const conversion = {
    conversion_time: new Date().toISOString(),
    event_id: eventId,
    identifiers: [identifier],
  };
  if (typeof body.conversion_id === 'string' && body.conversion_id) {
    conversion.conversion_id = body.conversion_id.slice(0, 200);
  }
  if (typeof body.event_source_url === 'string' && body.event_source_url) {
    conversion.event_source_url = body.event_source_url.slice(0, 2000);
  }

  const pixelId = process.env.X_PIXEL_ID || 'reji3';
  const version = process.env.X_ADS_API_VERSION || '12';
  try {
    const upstream = await fetch(
      `https://ads-api.x.com/${version}/measurement/conversions/${pixelId}`,
      {
        method: 'POST',
        headers: { 'X-Pixel-Token': token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversions: [conversion] }),
      }
    );
    const text = await upstream.text();
    res.status(upstream.ok ? 200 : upstream.status);
    return res.json({ ok: upstream.ok, upstream: text.slice(0, 2000) });
  } catch (e) {
    return res.status(502).json({ error: 'upstream unreachable' });
  }
}
