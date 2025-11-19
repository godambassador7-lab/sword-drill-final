// Bishops' Bible Provider: loads per-book JSON from /bible/bishops/<Book>.json

const BOOK_FILENAMES = new Proxy({}, {
  get(_, key) { return key + '.json'; }
});

const cache = new Map();

function publicUrl(path) { return `${process.env.PUBLIC_URL || ''}${path}`; }

export async function loadBookBishops(bookName) {
  const file = BOOK_FILENAMES[bookName] || `${bookName}.json`;
  if (cache.has(bookName)) return cache.get(bookName);
  try {
    const res = await fetch(publicUrl(`/bible/bishops/${file}`));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    cache.set(bookName, json);
    return json;
  } catch (e) {
    cache.set(bookName, null);
    return null;
  }
}

function getChaptersObject(bookJson) {
  if (!bookJson) return null;
  if (bookJson.chapters) return bookJson.chapters;
  const keys = Object.keys(bookJson);
  return keys.every(k => /^\d+$/.test(k)) ? bookJson : null;
}

export async function getBishopsVerses(book, chapter, vStart, vEnd) {
  const data = await loadBookBishops(book);
  const chapters = getChaptersObject(data);
  if (!chapters) return [];
  const ch = chapters[String(chapter)] || {};
  const start = vStart ?? 1;
  const end = vEnd ?? start;
  const out = [];
  for (let v = start; v <= end; v++) {
    const text = ch[String(v)];
    if (text) out.push({ reference: `${book} ${chapter}:${v}`, text, translation: 'BISHOPS' });
  }
  return out;
}

export default { getBishopsVerses };

