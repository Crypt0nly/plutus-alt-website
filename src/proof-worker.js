import { solvePuzzle } from './proof-of-work.js';

self.onmessage = async ({ data }) => {
  try {
    self.postMessage({ answer: await solvePuzzle(data) });
  } catch {
    self.postMessage({ error: true });
  }
};
