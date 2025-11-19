// Apocrypha provider: loads per-book files from public/apocrypha

const APOC_BOOKS = new Set([
  'Tobit','Judith','Additions to Esther','Wisdom of Solomon','Sirach','Baruch',
  'Letter of Jeremiah','Song of the Three Holy Children','Susanna','Bel and the Dragon',
  '1 Esdras','2 Esdras','1 Maccabees','2 Maccabees',
  'Prayer of Manasseh'
]);

const cache = new Map();
function urlFor(book) {
  const base = process.env.PUBLIC_URL || '';
  return `${base}/apocrypha/${book}.json`;
}

async function loadBook(book) {
  if (cache.has(book)) return cache.get(book);
  try {
    const res = await fetch(urlFor(book));
    if (!res.ok) return null;
    const json = await res.json();
    cache.set(book, json);
    return json;
  } catch {
    return null;
  }
}

export function isApocryphaBook(book) { return APOC_BOOKS.has(book); }

export async function getApocryphaVerses(book, ch, vs, ve) {
  if (!APOC_BOOKS.has(book)) return [];
  // Handle chapter aliasing for Letter of Jeremiah (Baruch 6 in KJV tradition)
  let chapter = ch;
  if (book === 'Letter of Jeremiah' && (ch === 1 || ch === '1')) {
    chapter = 6;
  }
  const data = await loadBook(book);
  if (!data) return [];
  const out = [];
  const start = vs || 1;
  const end = ve && ve >= start ? ve : start;
  for (let v = start; v <= end; v++) {
    const t = data?.chapters?.[String(chapter)]?.[String(v)];
    if (t) out.push({ reference: `${book} ${ch}:${v}`, text: t, translation: 'KJV' });
  }
  return out;
}

export default { isApocryphaBook, getApocryphaVerses };

// Search across all Apocrypha books locally (simple substring match)
export async function searchApocrypha(query, limit = 50) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  const results = [];
  for (const book of APOC_BOOKS) {
    const data = await loadBook(book);
    if (!data || !data.chapters) continue;
    const chapters = data.chapters;
    for (const ch of Object.keys(chapters)) {
      const verses = chapters[ch] || {};
      for (const vs of Object.keys(verses)) {
        const text = verses[vs] || '';
        if (String(text).toLowerCase().includes(q)) {
          results.push({ reference: `${book} ${ch}:${vs}`, text, translation: 'KJV' });
          if (results.length >= limit) return results;
        }
      }
    }
  }
  return results;
}
