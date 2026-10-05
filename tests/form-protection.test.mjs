import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { createFormProtection } from '../src/form-protection.js';
import { solvePuzzle } from '../src/proof-of-work.js';

test('browser solver matches the server SHA-256 contract', async () => {
  const salt = 'leads-123.1700000000.nonce';
  const puzzle = {
    algorithm: 'SHA-256', salt, signature: 'a'.repeat(64), max_number: 50,
    challenge: createHash('sha256').update(`${salt}37`).digest('hex'),
  };
  assert.deepEqual(await solvePuzzle(puzzle), {
    salt, signature: puzzle.signature, challenge: puzzle.challenge, number: 37,
  });
  await assert.rejects(solvePuzzle({ ...puzzle, max_number: 36 }), /Unsolvable/);
  await assert.rejects(solvePuzzle({ ...puzzle, max_number: 2_000_000 }), /Invalid/);
});

test('prefetch shares one solve, waits the server floor, and never reuses a spent proof', async (t) => {
  let requests = 0;
  let clock = 1000;
  const waits = [];
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.equal(options.cache, 'no-store');
    requests += 1;
    return { ok: true, json: async () => ({ min_age_ms: 1000, number: requests }) };
  });
  const protection = createFormProtection('/leads/api/slug', {
    now: () => clock, solve: async (puzzle) => ({ number: puzzle.number }),
    pause: async (ms) => { waits.push(ms); clock += ms; },
  });
  assert.equal(protection.prepare(), protection.prepare());
  assert.deepEqual(await protection.take(), { number: 1 });
  assert.deepEqual(waits, [1000]);
  assert.deepEqual(await protection.take(), { number: 2 });
  assert.equal(requests, 2);
});

test('a visitor returning after half an hour gets a fresh puzzle', async (t) => {
  let requests = 0;
  let clock = 1000;
  t.mock.method(globalThis, 'fetch', async () => {
    requests += 1;
    return { ok: true, json: async () => ({ number: requests }) };
  });
  const protection = createFormProtection('/leads/api/slug', {
    now: () => clock, solve: async (puzzle) => puzzle, pause: async () => {},
  });
  await protection.prepare();
  clock += 30 * 60_000;
  assert.deepEqual(await protection.take(), { number: 2 });
  assert.equal(requests, 2);
});

test('an unavailable check blocks submission and a later attempt can recover', async (t) => {
  let up = false;
  t.mock.method(globalThis, 'fetch', async () => ({ ok: up, json: async () => ({ number: 5 }) }));
  const protection = createFormProtection('/leads/api/slug', {
    solve: async (puzzle) => puzzle, pause: async () => {},
  });
  await assert.rejects(protection.take(), /unavailable/);
  up = true;
  assert.deepEqual(await protection.take(), { number: 5 });
});
