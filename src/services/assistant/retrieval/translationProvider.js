/**
 * Translation Provider for RAG System
 * Unified access to all available Bible translations
 * Supports: KJV, ASV, WEB, ESV, NIV, NLT, YLT (all from local JSON files)
 */

// Available translations (no API required - all local JSON)
const AVAILABLE_TRANSLATIONS = {
  'KJV': { name: 'King James Version', year: 1611, philosophy: 'Literal' },
  'ASV': { name: 'American Standard Version', year: 1901, philosophy: 'Literal' },
  'WEB': { name: 'World English Bible', year: 2000, philosophy: 'Literal' },
  'YLT': { name: "Young's Literal Translation", year: 1898, philosophy: 'Very Literal' },
  'ESV': { name: 'English Standard Version', year: 2001, philosophy: 'Essentially Literal' },
  'NIV': { name: 'New International Version', year: 1978, philosophy: 'Dynamic Equivalence' },
  'NLT': { name: 'New Living Translation', year: 1996, philosophy: 'Thought-for-Thought' }
};

const BOOK_FILENAMES = {
  'Genesis': 'Genesis.json', 'Exodus': 'Exodus.json', 'Leviticus': 'Leviticus.json',
  'Numbers': 'Numbers.json', 'Deuteronomy': 'Deuteronomy.json',
  'Joshua': 'Joshua.json', 'Judges': 'Judges.json', 'Ruth': 'Ruth.json',
  '1 Samuel': '1 Samuel.json', '2 Samuel': '2 Samuel.json',
  '1 Kings': '1 Kings.json', '2 Kings': '2 Kings.json',
  '1 Chronicles': '1 Chronicles.json', '2 Chronicles': '2 Chronicles.json',
  'Ezra': 'Ezra.json', 'Nehemiah': 'Nehemiah.json', 'Esther': 'Esther.json',
  'Job': 'Job.json', 'Psalms': 'Psalms.json', 'Proverbs': 'Proverbs.json',
  'Ecclesiastes': 'Ecclesiastes.json', 'Song of Solomon': 'Song of Solomon.json',
  'Isaiah': 'Isaiah.json', 'Jeremiah': 'Jeremiah.json',
  'Lamentations': 'Lamentations.json', 'Ezekiel': 'Ezekiel.json',
  'Daniel': 'Daniel.json', 'Hosea': 'Hosea.json', 'Joel': 'Joel.json',
  'Amos': 'Amos.json', 'Obadiah': 'Obadiah.json', 'Jonah': 'Jonah.json',
  'Micah': 'Micah.json', 'Nahum': 'Nahum.json',
  'Habakkuk': 'Habakkuk.json', 'Zephaniah': 'Zephaniah.json',
  'Haggai': 'Haggai.json', 'Zechariah': 'Zechariah.json', 'Malachi': 'Malachi.json',
  'Matthew': 'Matthew.json', 'Mark': 'Mark.json', 'Luke': 'Luke.json',
  'John': 'John.json', 'Acts': 'Acts.json',
  'Romans': 'Romans.json', '1 Corinthians': '1 Corinthians.json',
  '2 Corinthians': '2 Corinthians.json', 'Galatians': 'Galatians.json',
  'Ephesians': 'Ephesians.json', 'Philippians': 'Philippians.json',
  'Colossians': 'Colossians.json', '1 Thessalonians': '1 Thessalonians.json',
  '2 Thessalonians': '2 Thessalonians.json', '1 Timothy': '1 Timothy.json',
  '2 Timothy': '2 Timothy.json', 'Titus': 'Titus.json', 'Philemon': 'Philemon.json',
  'Hebrews': 'Hebrews.json', 'James': 'James.json', '1 Peter': '1 Peter.json',
  '2 Peter': '2 Peter.json', '1 John': '1 John.json',
  '2 John': '2 John.json', '3 John': '3 John.json', 'Jude': 'Jude.json',
  'Revelation': 'Revelation.json'
};

// Cache for loaded books
const bookCache = new Map();

function publicUrl(path) {
  return `${process.env.PUBLIC_URL || ''}${path}`;
}

function getCacheKey(translation, bookName) {
  return `${translation}:${bookName}`;
}

/**
 * Load a book from a specific translation
 * @param {string} translation - Translation code (KJV, ASV, etc.)
 * @param {string} bookName - Book name
 * @returns {Promise<Object|null>} Book data
 */
async function loadBook(translation, bookName) {
  const file = BOOK_FILENAMES[bookName];
  if (!file) return null;

  const cacheKey = getCacheKey(translation, bookName);
  if (bookCache.has(cacheKey)) {
    return bookCache.get(cacheKey);
  }

  try {
    const translationLower = translation.toLowerCase();
    const res = await fetch(publicUrl(`/bible/${translationLower}/${file}`));
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    bookCache.set(cacheKey, json);
    return json;
  } catch (e) {
    console.warn(`[Translation] Could not load ${translation} ${bookName}:`, e.message);
    bookCache.set(cacheKey, null);
    return null;
  }
}

/**
 * Get chapters object from book JSON
 */
function getChaptersObject(bookJson) {
  if (!bookJson) return null;
  if (bookJson.chapters) return bookJson.chapters;
  const hasNumericKeys = Object.keys(bookJson).every(k => /^\d+$/.test(k));
  return hasNumericKeys ? bookJson : null;
}

/**
 * Get a single verse from a specific translation
 * @param {string} translation - Translation code
 * @param {string} book - Book name
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @returns {Promise<Object|null>} Verse object
 */
export async function getVerse(translation, book, chapter, verse) {
  const data = await loadBook(translation, book);
  const chapters = getChaptersObject(data);
  if (!chapters) return null;

  const ch = chapters[String(chapter)] || {};
  const text = ch[String(verse)];

  if (!text) return null;

  return {
    reference: `${book} ${chapter}:${verse}`,
    text,
    translation
  };
}

/**
 * Get multiple verses from a specific translation
 * @param {string} translation - Translation code
 * @param {string} book - Book name
 * @param {number} chapter - Chapter number
 * @param {number} vStart - Starting verse
 * @param {number} vEnd - Ending verse (optional)
 * @returns {Promise<Array>} Array of verse objects
 */
export async function getVerses(translation, book, chapter, vStart, vEnd) {
  const data = await loadBook(translation, book);
  const chapters = getChaptersObject(data);
  if (!chapters) return [];

  const ch = chapters[String(chapter)] || {};
  const start = vStart ?? 1;
  const end = vEnd ?? start;
  const out = [];

  for (let v = start; v <= end; v++) {
    const text = ch[String(v)];
    if (text) {
      out.push({
        reference: `${book} ${chapter}:${v}`,
        text,
        translation
      });
    }
  }

  return out;
}

/**
 * Get the same verse from multiple translations
 * @param {string} book - Book name
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @param {Array<string>} translations - Array of translation codes
 * @returns {Promise<Array>} Array of verse objects from different translations
 */
export async function getVerseInTranslations(book, chapter, verse, translations = null) {
  const translationsToFetch = translations || Object.keys(AVAILABLE_TRANSLATIONS);
  const results = [];

  // Fetch all translations in parallel
  const promises = translationsToFetch.map(trans =>
    getVerse(trans, book, chapter, verse)
  );

  const verses = await Promise.all(promises);

  for (let i = 0; i < verses.length; i++) {
    if (verses[i]) {
      results.push(verses[i]);
    }
  }

  return results;
}

/**
 * Parse a reference string into components
 * @param {string} reference - e.g., "John 3:16" or "Romans 8:28-30"
 * @returns {Object|null} Parsed reference
 */
export function parseReference(reference) {
  if (!reference) return null;

  // Match patterns like "John 3:16" or "John 3:16-18"
  const match = reference.match(/^([123]?\s?[A-Za-z\s]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2]),
    verseStart: parseInt(match[3]),
    verseEnd: match[4] ? parseInt(match[4]) : parseInt(match[3])
  };
}

/**
 * Get verse by reference string
 * @param {string} reference - e.g., "John 3:16"
 * @param {string} translation - Translation code
 * @returns {Promise<Object|null>} Verse object
 */
export async function getVerseByReference(reference, translation = 'KJV') {
  const parsed = parseReference(reference);
  if (!parsed) return null;

  return await getVerse(translation, parsed.book, parsed.chapter, parsed.verseStart);
}

/**
 * Compare a verse across all available translations
 * @param {string} reference - Verse reference
 * @returns {Promise<Object>} Comparison object
 */
export async function compareTranslations(reference) {
  const parsed = parseReference(reference);
  if (!parsed) return null;

  const verses = await getVerseInTranslations(
    parsed.book,
    parsed.chapter,
    parsed.verseStart
  );

  return {
    reference,
    translations: verses,
    availableCount: verses.length,
    comparisonNote: 'Translation philosophies range from literal (KJV, ASV, YLT) to dynamic equivalence (NIV, NLT)'
  };
}

/**
 * Get available translations list
 * @returns {Array} List of available translations
 */
export function getAvailableTranslations() {
  return Object.entries(AVAILABLE_TRANSLATIONS).map(([code, info]) => ({
    code,
    name: info.name,
    year: info.year,
    philosophy: info.philosophy
  }));
}

/**
 * Get translation info
 * @param {string} code - Translation code
 * @returns {Object|null} Translation information
 */
export function getTranslationInfo(code) {
  const info = AVAILABLE_TRANSLATIONS[code];
  if (!info) return null;

  return {
    code,
    ...info
  };
}

export default {
  getVerse,
  getVerses,
  getVerseInTranslations,
  getVerseByReference,
  compareTranslations,
  getAvailableTranslations,
  getTranslationInfo,
  parseReference
};
