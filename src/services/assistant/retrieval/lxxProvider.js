// LXX (Greek Septuagint, Rahlfs) loader and verse formatter
// Loads per-book JSON from public/lxx/<Book>.json and exposes helpers

import { parseReference } from '../referenceParser';

const BOOKS_OT = new Set([
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah',
  'Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
  'Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah',
  'Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'
]);

const bookCache = new Map();

function urlForBook(book) {
  const base = process.env.PUBLIC_URL || '';
  return `${base}/lxx/${book}.json`;
}

async function loadBook(book) {
  if (bookCache.has(book)) return bookCache.get(book);
  const url = urlForBook(book);
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    bookCache.set(book, json);
    return json;
  } catch {
    return null;
  }
}

function makeAccessor(bookJson) {
  if (Array.isArray(bookJson)) {
    return (ch, vs) => bookJson?.[ch - 1]?.[vs - 1] || null;
  }
  if (bookJson && typeof bookJson === 'object') {
    const chapters = bookJson.chapters || bookJson;
    return (ch, vs) => chapters?.[String(ch)]?.[String(vs)] || null;
  }
  return () => null;
}

// For Greek we keep diacritics; normalize to NFC to avoid jumbled combining sequences
export function wordsToGreekText(words, opts = {}) {
  const tokens = (Array.isArray(words) ? words : []).map(w => (w && w[0]) || '').filter(Boolean);
  let text = tokens.join(' ');
  try { text = text.normalize('NFC'); } catch {}
  return text;
}

export async function getLxxVerseByReference(reference, options = {}) {
  const pr = parseReference(reference);
  if (!pr.valid) return null;
  const book = pr.book;
  if (!BOOKS_OT.has(book)) return null;
  if (!pr.verse || !pr.chapter) return null;

  const json = await loadBook(book);
  if (!json) return null;
  const acc = makeAccessor(json);
  const words = acc(pr.chapter, pr.verse);
  if (!words || !Array.isArray(words)) return null;

  const text = wordsToGreekText(words, options);
  return {
    reference: pr.normalized,
    text,
    words,
    translation: 'LXX',
    language: 'grc',
    rtl: false,
  };
}

export default { getLxxVerseByReference, wordsToGreekText };

