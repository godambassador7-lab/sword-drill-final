// Number formatter with K/M/B/T suffixes
export function formatCompact(num) {
  if (num === null || num === undefined) return '0';
  const abs = Math.abs(num);
  const units = [
    { v: 1e12, s: 'T' },
    { v: 1e9, s: 'B' },
    { v: 1e6, s: 'M' },
    { v: 1e3, s: 'K' },
  ];
  for (const u of units) {
    if (abs >= u.v) {
      const n = num / u.v;
      const fixed = n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2);
      return fixed.replace(/\.0+$|(?<=\.[0-9])0+$/g, '') + u.s;
    }
  }
  return String(num);
}
export default { formatCompact };
