// Codex Sinaiticus Greek loader and verse formatter
// Loads per-book JSON from public/sinaiticus/<Book>.json and exposes helpers

import { parseReference } from '../referenceParser';

const BOOKS = new Set([
  // OT
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah',
  'Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
  'Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah',
  'Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi',
  // NT
  'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
]);

const bookCache = new Map();

function urlForBook(book) {
  const base = process.env.PUBLIC_URL || '';
  return `${base}/sinaiticus/${book}.json`;
}

async function loadBook(book) {
  if (bookCache.has(book)) return bookCache.get(book);
  try {
    const res = await fetch(urlForBook(book));
    if (!res.ok) return null;
    const json = await res.json();
    bookCache.set(book, json);
    return json;
  } catch {
    return null;
  }
}

function makeAccessor(bookJson) {
  if (Array.isArray(bookJson)) return (ch, vs) => bookJson?.[ch - 1]?.[vs - 1] || null;
  if (bookJson && typeof bookJson === 'object') {
    const chapters = bookJson.chapters || bookJson;
    return (ch, vs) => chapters?.[String(ch)]?.[String(vs)] || null;
  }
  return () => null;
}

export function wordsToGreekText(words) {
  const tokens = (Array.isArray(words) ? words : []).map(w => (w && w[0]) || '').filter(Boolean);
  let text = tokens.join(' ');
  try { text = text.normalize('NFC'); } catch {}
  return text;
}

export async function getSinaiticusVerseByReference(reference) {
  const pr = parseReference(reference);
  if (!pr.valid) return null;
  const book = pr.book;
  if (!BOOKS.has(book) || !pr.chapter || !pr.verse) return null;
  const json = await loadBook(book);
  if (!json) return null;
  const acc = makeAccessor(json);
  const words = acc(pr.chapter, pr.verse);
  if (!words || !Array.isArray(words)) return null;
  const text = wordsToGreekText(words);
  return { reference: pr.normalized, text, words, translation: 'SINAITICUS', language: 'grc', rtl: false };
}

export default { getSinaiticusVerseByReference, wordsToGreekText };

