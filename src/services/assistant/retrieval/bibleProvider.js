// Local Bible provider using the DAILY_VERSES_POOL and any verse history provided.
// This is a stopgap until a full translation corpus is integrated.

import { DAILY_VERSES_POOL } from '../../../dailyVerses';
import { KJV, WEB } from './translationsData';

// Cache combined translations array to avoid repeated spreading
const COMBINED_TRANSLATIONS = [...KJV, ...WEB];

function normalize(s) {
  return (s || '').toString().toLowerCase();
}

function scoreMatch(text, query) {
  // Simple score: length of query overlap
  if (!text || !query) return 0;
  const t = normalize(text);
  const q = normalize(query);
  if (t.includes(q)) return Math.min(q.length / 100, 1) + 0.5;
  // token overlap heuristic
  const qTokens = q.split(/\W+/).filter(Boolean);
  const hits = qTokens.filter(tok => t.includes(tok)).length;
  return hits / Math.max(qTokens.length, 1);
}

export function getVerseByReference(reference, translation) {
  if (!reference) return null;
  const list = translation === 'WEB' ? WEB : translation === 'KJV' ? KJV : [...KJV, ...WEB];
  const refLower = reference.toLowerCase();
  return list.find(v => (v.reference || '').toLowerCase() === refLower) || null;
}

export async function searchLocalVerses(query, opts = {}) {
  const sources = [];
  // Daily pool
  sources.push(...DAILY_VERSES_POOL.map(v => ({
    reference: v.reference,
    text: v.text,
    translation: 'PD',
  })));
  // Add any verseHistory texts if provided
  if (opts.verseHistory && Array.isArray(opts.verseHistory)) {
    for (const v of opts.verseHistory) {
      if (v?.text && v?.reference) {
        sources.push({ reference: v.reference, text: v.text, translation: v.translation || 'Unknown' });
      }
    }
  }

  // Add minimal translation corpora (use cached combined array)
  const selected = opts.selectedTranslation || null;
  sources.push(...COMBINED_TRANSLATIONS);

  const scored = sources
    .map(s => {
      let base = scoreMatch(`${s.reference} ${s.text}`, query);
      // Exact reference boost
      if ((query || '').toLowerCase().includes((s.reference || '').toLowerCase())) base += 1.5;
      // Translation preference boost
      if (selected && s.translation === selected) base += 0.2;
      return { ...s, score: base };
    })
    .filter(s => s.score > 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return scored;
}

export default { searchLocalVerses, getVerseByReference };
