import { parseReference } from './assistant/referenceParser';
import { simplifyText } from './simplifiedMode';

/**
 * Clean verse text by removing formatting symbols like paragraph marks
 */
function cleanVerseText(text) {
  if (!text) return text;
  return text
    .replace(/¶/g, '') // Remove pilcrow/paragraph symbol
    .replace(/\u00B6/g, '') // Remove Unicode paragraph symbol
    .trim();
}

const CODE_MAP = {
  KJV: 'kjv',
  WEB: 'web',
  ASV: 'asv',
  YLT: 'ylt',
  BISHOPS: 'bishops',
  GENEVA: 'geneva',
};

function folderFor(translation) {
  const code = CODE_MAP[(translation || '').toUpperCase()];
  return code ? `/bible/${code}` : null;
}

async function loadBookJson(folder, book) {
  const url = `${process.env.PUBLIC_URL || ''}/public${folder}/${book}.json`.replace('/public/public', '/public');
  // CRA serves from "/"; but our public path is at root: build will include public/*
  const alt = `${process.env.PUBLIC_URL || ''}${folder}/${book}.json`;
  for (const u of [alt]) {
    try {
      const res = await fetch(u);
      if (res.ok) return await res.json();
    } catch (_) {}
  }
  return null;
}

export async function getLocalVerseByReference(translation, reference, options = {}) {
  const folder = folderFor(translation);
  if (!folder) return null;
  const pr = parseReference(reference);
  if (!pr.valid || !pr.verse) return null;
  const bookJson = await loadBookJson(folder, pr.book);
  if (!bookJson || !bookJson.chapters) return null;
  let text = bookJson.chapters?.[String(pr.chapter)]?.[String(pr.verse)];
  if (!text) return null;

  // Clean verse text
  text = cleanVerseText(text);

  // Apply simplified mode if requested
  if (options.simplifiedMode) {
    text = simplifyText(text, translation);
  }

  return { reference: pr.normalized, text, translation };
}

// Fetch a range and concatenate (e.g., "Ephesians 6:10-18")
export async function getLocalVersesRange(translation, reference, options = {}) {
  const folder = folderFor(translation);
  if (!folder) return null;
  const pr = parseReference(reference);
  if (!pr.valid || !pr.verse) return null;

  const bookJson = await loadBookJson(folder, pr.book);
  if (!bookJson || !bookJson.chapters) return null;
  const chapterData = bookJson.chapters?.[String(pr.chapter)];
  if (!chapterData) return null;

  const start = pr.verse;
  const end = pr.verseEnd && pr.verseEnd >= start ? pr.verseEnd : start;
  const parts = [];
  for (let v = start; v <= end; v++) {
    let text = chapterData[String(v)];
    if (text) {
      text = cleanVerseText(text);

      // Apply simplified mode if requested
      if (options.simplifiedMode) {
        text = simplifyText(text, translation);
      }

      parts.push(`${v}. ${text}`);
    }
  }
  if (parts.length === 0) return null;
  return { reference: pr.normalized, text: parts.join(' '), translation };
}

// Default list of Bible books to try
const DEFAULT_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1Samuel', '2Samuel',
  '1Kings', '2Kings', '1Chronicles', '2Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
  'Proverbs', 'Ecclesiastes', 'Song', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
  'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1Corinthians', '2Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1Thessalonians', '2Thessalonians',
  '1Timothy', '2Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1Peter', '2Peter', '1John', '2John', '3John',
  'Jude', 'Revelation'
];

export async function getRandomLocalVerse(translation, bookNames = null) {
  const folder = folderFor(translation);
  if (!folder) return null;

  // Use provided bookNames or default list
  const books = (bookNames && Array.isArray(bookNames) && bookNames.length > 0) ? bookNames : DEFAULT_BOOKS;

  // Try a few random books to find one available locally
  for (let i = 0; i < Math.min(8, books.length); i++) {
    const name = books[Math.floor(Math.random() * books.length)];
    const json = await loadBookJson(folder, name);
    if (!json || !json.chapters) continue;
    const chapters = Object.keys(json.chapters);
    if (chapters.length === 0) continue;
    const ch = chapters[Math.floor(Math.random() * chapters.length)];
    const verses = Object.keys(json.chapters[ch] || {});
    if (verses.length === 0) continue;
    const vs = verses[Math.floor(Math.random() * verses.length)];
    const text = json.chapters[ch][vs];
    if (!text) continue;
    return { reference: `${name} ${ch}:${vs}`, text: cleanVerseText(text), translation, book: name };
  }
  return null;
}

export default { getLocalVerseByReference, getLocalVersesRange, getRandomLocalVerse };
