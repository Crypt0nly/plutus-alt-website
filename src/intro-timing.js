// Time-based damping has the same response on 60 / 120 Hz screens.
export function dampProgress(current, target, deltaMs) {
  return current + (target - current) * (1 - Math.exp(-Math.max(0, deltaMs) / 95));
}
const smooth = (a, b, value) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export function captionOpacity(index, progress) {
  if (index === 0) return 1 - smooth(.04, .14, progress);
  if (index === 1) return smooth(.43, .49, progress) * (1 - smooth(.56, .65, progress));
  return smooth(.94, 1, progress);
}
