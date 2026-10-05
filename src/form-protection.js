const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function solveInWorker(puzzle) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./proof-worker.js', import.meta.url), { type: 'module' });
    const finish = (answer) => {
      clearTimeout(timer);
      worker.terminate();
      if (answer) resolve(answer);
      else reject(new Error('Browser check failed'));
    };
    const timer = setTimeout(() => finish(null), 60_000);
    worker.onmessage = ({ data }) => finish(data.answer);
    worker.onerror = () => finish(null);
    worker.postMessage(puzzle);
  });
}

export function createFormProtection(endpoint, { solve = solveInWorker, now = Date.now, pause = wait } = {}) {
  let pending = null;
  let expiresAt = 0;
  const prepare = () => {
    if (!pending || now() >= expiresAt) {
      expiresAt = now() + 25 * 60_000;
      pending = (async () => {
        const res = await fetch(`${endpoint}/challenge`, {
          headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(10_000),
        });
        if (!res.ok) throw new Error('Browser check unavailable');
        const puzzle = await res.json();
        const ripeAt = now() + Math.min(5000, Math.max(0, Number(puzzle.min_age_ms) || 0));
        return { answer: await solve(puzzle), ripeAt };
      })().catch(() => null);
    }
    return pending;
  };
  return {
    prepare,
    async take() {
      const solved = await prepare();
      // Each attempted POST needs a new proof, including a retry after a network failure.
      pending = null;
      if (!solved) throw new Error('Browser check unavailable');
      await pause(Math.max(0, solved.ripeAt - now()));
      return solved.answer;
    },
  };
}
