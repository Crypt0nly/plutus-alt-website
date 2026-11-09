import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import handler from '../api/x-conversions.js';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
let calls;
beforeEach(() => {
  process.env.NODE_ENV = 'production';
  process.env.X_PIXEL_TOKEN = 'synthetic-key';
  process.env.X_EVENT_ID_LEAD = 'synthetic-event';
  process.env.VERCEL_URL = 'this-site.vercel.app';
  calls = [];
  globalThis.fetch = async (...args) => {
    calls.push(args);
    return new Response(JSON.stringify({ private: 'provider-account-data' }), { status: 200 });
  };
});
afterEach(() => { globalThis.fetch = originalFetch; process.env = { ...originalEnv }; });

async function submit({ origin = 'https://ocur.ai', body = { event: 'lead', twclid: 'synthetic-click' }, headers = {}, method = 'POST' } = {}) {
  const response = {
    headers: {}, statusCode: 200, body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
  await handler({ method, headers: { origin, ...headers }, body }, response);
  return response;
}

test('only configured website origins can use the relay', async () => {
  for (const origin of [undefined, 'null', 'https://attacker.vercel.app', 'https://evil.ocur.ai', 'http://ocur.ai', 'https://ocur.ai:444', 'http://localhost:5173']) {
    const response = await submit({ headers: { origin } });
    assert.equal(response.statusCode, 403, String(origin));
  }
  assert.equal(calls.length, 0);
});

test('the exact configured preview origin is allowed', async () => {
  assert.equal((await submit({ origin: 'https://this-site.vercel.app' })).statusCode, 200);
});

test('cross-site browser requests cannot trigger an upstream call', async () => {
  assert.equal((await submit({ headers: { 'sec-fetch-site': 'cross-site' } })).statusCode, 403);
  assert.equal(calls.length, 0);
});

test('prototype names are not valid event names', async () => {
  for (const event of ['constructor', '__proto__', 'toString', 'unknown']) {
    assert.equal((await submit({ body: { event, twclid: 'click' } })).statusCode, 400);
  }
  assert.equal(calls.length, 0);
});

test('oversized, malformed and array payloads cannot reach X', async () => {
  assert.equal((await submit({ body: { event: 'lead', twclid: 'x'.repeat(9000) } })).statusCode, 413);
  assert.equal((await submit({ body: '{broken' })).statusCode, 400);
  assert.equal((await submit({ body: [] })).statusCode, 400);
  assert.equal(calls.length, 0);
});

test('valid beacon JSON forwards only configured events without URL secrets', async () => {
  const response = await submit({ body: JSON.stringify({
    event: 'lead', twclid: 'synthetic-click', conversion_id: 'synthetic-id',
    event_source_url: 'https://ocur.ai/contact?email=private@example.test#private',
  }) });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { ok: true });
  assert.equal(response.headers['Cache-Control'], 'no-store');
  const [, options] = calls[0];
  const { conversions: [conversion] } = JSON.parse(options.body);
  assert.equal(conversion.event_id, 'synthetic-event');
  assert.equal(conversion.conversion_id, 'synthetic-id');
  assert.equal(conversion.event_source_url, 'https://ocur.ai/contact');
  assert.equal(options.redirect, 'error');
  assert.ok(options.signal instanceof AbortSignal);
});

test('unrelated attribution URLs are discarded', async () => {
  await submit({ body: { event: 'lead', twclid: 'click', event_source_url: 'https://attacker.example/path' } });
  const { conversions: [conversion] } = JSON.parse(calls[0][1].body);
  assert.equal(conversion.event_source_url, undefined);
});

test('upstream failures do not reveal provider responses', async () => {
  globalThis.fetch = async () => new Response('secret provider response', { status: 401 });
  const response = await submit();
  assert.equal(response.statusCode, 502);
  assert.deepEqual(response.body, { ok: false });
});

test('non-POST requests are rejected before any upstream request', async () => {
  assert.equal((await submit({ method: 'GET' })).statusCode, 405);
  assert.equal(calls.length, 0);
});
