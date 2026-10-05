// Same SHA-256 contract as Ocur's bot_shield.py. Runs inside a worker so
// checking the form cannot interrupt typing, scrolling or assistive technology.
export async function solvePuzzle(puzzle) {
  const { salt, challenge, signature, max_number: max } = puzzle;
  if (puzzle.algorithm !== 'SHA-256' || typeof salt !== 'string' || salt.length > 200 ||
      !/^[a-f0-9]{64}$/.test(challenge) || !/^[a-f0-9]{64}$/.test(signature) ||
      !Number.isSafeInteger(max) || max < 0 || max > 1_000_000) {
    throw new Error('Invalid browser check');
  }
  const encoder = new TextEncoder();
  for (let number = 0; number <= max; number += 1) {
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(`${salt}${number}`));
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hex === challenge) return { salt, challenge, signature, number };
  }
  throw new Error('Unsolvable browser check');
}
