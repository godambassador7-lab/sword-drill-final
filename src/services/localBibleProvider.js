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

// Fetch chapter/verse range (e.g., "1 Kings 11-14", "John 3:16-18", "1 Kings 15:25-16:7")
export async function getLocalChapterRange(translation, reference, options = {}) {
  const folder = folderFor(translation);
  if (!folder) return null;

  // Try to parse verse range first (e.g., "1 Kings 15:25-32" or "1 Kings 15:25-16:7")
  const verseRangeMatch = reference.match(/^(.+?)\s+(\d+):(\d+)-(\d+):?(\d+)?$/);
  if (verseRangeMatch) {
    const bookName = verseRangeMatch[1].trim();
    const startChapter = parseInt(verseRangeMatch[2]);
    const startVerse = parseInt(verseRangeMatch[3]);
    const endChapterOrVerse = parseInt(verseRangeMatch[4]);
    const endVerse = verseRangeMatch[5] ? parseInt(verseRangeMatch[5]) : null;

    // Determine if it's same chapter or cross-chapter range
    const isSameChapter = !endVerse; // If no second colon, it's same chapter
    const endChapter = isSameChapter ? startChapter : endChapterOrVerse;
    const finalEndVerse = isSameChapter ? endChapterOrVerse : endVerse;

    const bookJson = await loadBookJson(folder, bookName);
    if (!bookJson || !bookJson.chapters) return null;

    const allText = [];

    if (isSameChapter) {
      // Same chapter: "1 Kings 15:25-32"
      const chapterData = bookJson.chapters?.[String(startChapter)];
      if (chapterData) {
        for (let v = startVerse; v <= finalEndVerse; v++) {
          let text = chapterData[String(v)];
          if (text) {
            text = cleanVerseText(text);
            if (options.simplifiedMode) {
              text = simplifyText(text, translation);
            }
            allText.push(`${startChapter}:${v} ${text}`);
          }
        }
      }
    } else {
      // Cross-chapter: "1 Kings 15:25-16:7"
      // First chapter: from startVerse to end of chapter
      const firstChapterData = bookJson.chapters?.[String(startChapter)];
      if (firstChapterData) {
        const versesInFirstChapter = Object.keys(firstChapterData).map(v => parseInt(v)).sort((a, b) => a - b);
        const maxVerseInFirstChapter = Math.max(...versesInFirstChapter);
        for (let v = startVerse; v <= maxVerseInFirstChapter; v++) {
          let text = firstChapterData[String(v)];
          if (text) {
            text = cleanVerseText(text);
            if (options.simplifiedMode) {
              text = simplifyText(text, translation);
            }
            allText.push(`${startChapter}:${v} ${text}`);
          }
        }
      }

      // Middle chapters (if any): entire chapters
      for (let ch = startChapter + 1; ch < endChapter; ch++) {
        const chapterData = bookJson.chapters?.[String(ch)];
        if (chapterData) {
          const verses = Object.keys(chapterData).sort((a, b) => parseInt(a) - parseInt(b));
          for (const verseNum of verses) {
            let text = chapterData[verseNum];
            if (text) {
              text = cleanVerseText(text);
              if (options.simplifiedMode) {
                text = simplifyText(text, translation);
              }
              allText.push(`${ch}:${verseNum} ${text}`);
            }
          }
        }
      }

      // Last chapter: from verse 1 to endVerse
      const lastChapterData = bookJson.chapters?.[String(endChapter)];
      if (lastChapterData) {
        for (let v = 1; v <= finalEndVerse; v++) {
          let text = lastChapterData[String(v)];
          if (text) {
            text = cleanVerseText(text);
            if (options.simplifiedMode) {
              text = simplifyText(text, translation);
            }
            allText.push(`${endChapter}:${v} ${text}`);
          }
        }
      }
    }

    if (allText.length === 0) return null;
    return { reference, text: allText.join('\n\n'), translation };
  }

  // Parse chapter range (e.g., "1 Kings 11-14" or "John 3")
  const chapterMatch = reference.match(/^(.+?)\s+(\d+)(?:-(\d+))?$/);
  if (!chapterMatch) return null;

  const bookName = chapterMatch[1].trim();
  const startChapter = parseInt(chapterMatch[2]);
  const endChapter = chapterMatch[3] ? parseInt(chapterMatch[3]) : startChapter;

  const bookJson = await loadBookJson(folder, bookName);
  if (!bookJson || !bookJson.chapters) return null;

  const allText = [];
  for (let ch = startChapter; ch <= endChapter; ch++) {
    const chapterData = bookJson.chapters?.[String(ch)];
    if (chapterData) {
      const verses = Object.keys(chapterData).sort((a, b) => parseInt(a) - parseInt(b));
      for (const verseNum of verses) {
        let text = chapterData[verseNum];
        if (text) {
          text = cleanVerseText(text);
          if (options.simplifiedMode) {
            text = simplifyText(text, translation);
          }
          allText.push(`${ch}:${verseNum} ${text}`);
        }
      }
    }
  }

  if (allText.length === 0) return null;
  return { reference, text: allText.join('\n\n'), translation };
}

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

export default { getLocalVerseByReference, getLocalVersesRange, getLocalChapterRange, getRandomLocalVerse };
