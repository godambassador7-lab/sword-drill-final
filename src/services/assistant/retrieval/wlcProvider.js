// WLC (Hebrew Masoretic) loader and verse formatter
// Loads per-book JSON from public/wlc/<Book>.json and exposes helpers

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
  // Files are named exactly as canonical book names with spaces, e.g., "1 Samuel.json"
  return `${base}/wlc/${book}.json`;
}

async function loadBook(book) {
  if (bookCache.has(book)) return bookCache.get(book);
  const url = urlForBook(book);
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  bookCache.set(book, json);
  return json;
}

// Normalize different shapes to a getter function (chapter, verse) -> word triplets
function makeAccessor(bookJson) {
  // Shape A: top-level array [ [ [ [text, lemma, morph], ... ] (verse) ... ] (chapter) ... ]
  if (Array.isArray(bookJson)) {
    return (ch, vs) => bookJson?.[ch - 1]?.[vs - 1] || null;
  }
  // Shape B: { chapters: { '1': { '1': [ [text, lemma, morph], ... ] } } }
  if (bookJson && typeof bookJson === 'object') {
    const chapters = bookJson.chapters || bookJson;
    return (ch, vs) => chapters?.[String(ch)]?.[String(vs)] || null;
  }
  return () => null;
}

// Strip Hebrew niqqud and cantillation marks to avoid jumbled rendering in mixed LTR/RTL
function stripHebrewDiacritics(s) {
  if (!s) return s;
  return s.replace(/[\u0591-\u05C7]/g, '');
}

// Convert triplets to display text. Options:
// - stripDiacritics (default true)
// - addRtl (default true): wraps with RLM markers to ensure RTL display
export function wordsToHebrewText(words, opts = {}) {
  const { stripDiacritics: sd = true, addRtl = true } = opts;
  const tokens = (Array.isArray(words) ? words : []).map(w => (w && w[0]) || '').filter(Boolean);
  let text = tokens.join(' ');
  if (sd) text = stripHebrewDiacritics(text);
  // Use RLM markers to help layout in LTR contexts
  if (addRtl) text = `\u200F${text}\u200F`;
  return text;
}

export async function getWlcVerseByReference(reference, options = {}) {
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

  const text = wordsToHebrewText(words, options);
  return {
    reference: pr.normalized,
    text,
    words,
    translation: 'WLC',
    language: 'he',
    rtl: true,
  };
}

export async function getWlcChapter(book, chapter, options = {}) {
  if (!BOOKS_OT.has(book)) return null;
  const json = await loadBook(book);
  if (!json) return null;
  const acc = makeAccessor(json);
  const verses = [];
  // naive attempt: try verses 1..200 until null
  for (let v = 1; v <= 200; v++) {
    const words = acc(chapter, v);
    if (!words) break;
    verses.push({ verse: v, text: wordsToHebrewText(words, options), words });
  }
  return { book, chapter, verses };
}

export default { getWlcVerseByReference, getWlcChapter, wordsToHebrewText };

