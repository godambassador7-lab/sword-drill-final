/**
 * Interlinear Provider for RAG System
 * Provides word-by-word Greek/Hebrew with English translation
 * Data source: public/interlinear_bibledata-master/interlinear/
 */

// Book ID mapping (book name to file name)
const BOOK_FILES = {
  // Old Testament
  'Genesis': 'genesis.json',
  'Exodus': 'exodus.json',
  'Leviticus': 'leviticus.json',
  'Numbers': 'numbers.json',
  'Deuteronomy': 'deuteronomy.json',
  'Joshua': 'joshua.json',
  'Judges': 'judges.json',
  'Ruth': 'ruth.json',
  '1 Samuel': 'i_samuel.json',
  '2 Samuel': 'ii_samuel.json',
  '1 Kings': 'i_kings.json',
  '2 Kings': 'ii_kings.json',
  '1 Chronicles': 'i_chronicles.json',
  '2 Chronicles': 'ii_chronicles.json',
  'Ezra': 'ezra.json',
  'Nehemiah': 'nehemiah.json',
  'Esther': 'esther.json',
  'Job': 'job.json',
  'Psalms': 'psalms.json',
  'Psalm': 'psalms.json',
  'Proverbs': 'proverbs.json',
  'Ecclesiastes': 'ecclesiastes.json',
  'Song of Solomon': 'song_of_songs.json',
  'Isaiah': 'isaiah.json',
  'Jeremiah': 'jeremiah.json',
  'Lamentations': 'lamentations.json',
  'Ezekiel': 'ezekiel.json',
  'Daniel': 'daniel.json',
  'Hosea': 'hosea.json',
  'Joel': 'joel.json',
  'Amos': 'amos.json',
  'Obadiah': 'obadiah.json',
  'Jonah': 'jonah.json',
  'Micah': 'micah.json',
  'Nahum': 'nahum.json',
  'Habakkuk': 'habakkuk.json',
  'Zephaniah': 'zephaniah.json',
  'Haggai': 'haggai.json',
  'Zechariah': 'zechariah.json',
  'Malachi': 'malachi.json',
  // New Testament
  'Matthew': 'matthew.json',
  'Mark': 'mark.json',
  'Luke': 'luke.json',
  'John': 'john.json',
  'Acts': 'acts.json',
  'Romans': 'romans.json',
  '1 Corinthians': 'i_corinthians.json',
  '2 Corinthians': 'ii_corinthians.json',
  'Galatians': 'galatians.json',
  'Ephesians': 'ephesians.json',
  'Philippians': 'philippians.json',
  'Colossians': 'colossians.json',
  '1 Thessalonians': 'i_thessalonians.json',
  '2 Thessalonians': 'ii_thessalonians.json',
  '1 Timothy': 'i_timothy.json',
  '2 Timothy': 'ii_timothy.json',
  'Titus': 'titus.json',
  'Philemon': 'philemon.json',
  'Hebrews': 'hebrews.json',
  'James': 'james.json',
  '1 Peter': 'i_peter.json',
  '2 Peter': 'ii_peter.json',
  '1 John': 'i_john.json',
  '2 John': 'ii_john.json',
  '3 John': 'iii_john.json',
  'Jude': 'jude.json',
  'Revelation': 'revelation.json'
};

// Book number mapping (for verse ID parsing)
const BOOK_NUMBERS = {
  1: 'Genesis', 2: 'Exodus', 3: 'Leviticus', 4: 'Numbers', 5: 'Deuteronomy',
  6: 'Joshua', 7: 'Judges', 8: 'Ruth', 9: '1 Samuel', 10: '2 Samuel',
  11: '1 Kings', 12: '2 Kings', 13: '1 Chronicles', 14: '2 Chronicles',
  15: 'Ezra', 16: 'Nehemiah', 17: 'Esther', 18: 'Job', 19: 'Psalms',
  20: 'Proverbs', 21: 'Ecclesiastes', 22: 'Song of Solomon', 23: 'Isaiah',
  24: 'Jeremiah', 25: 'Lamentations', 26: 'Ezekiel', 27: 'Daniel',
  28: 'Hosea', 29: 'Joel', 30: 'Amos', 31: 'Obadiah', 32: 'Jonah',
  33: 'Micah', 34: 'Nahum', 35: 'Habakkuk', 36: 'Zephaniah', 37: 'Haggai',
  38: 'Zechariah', 39: 'Malachi',
  40: 'Matthew', 41: 'Mark', 42: 'Luke', 43: 'John', 44: 'Acts',
  45: 'Romans', 46: '1 Corinthians', 47: '2 Corinthians', 48: 'Galatians',
  49: 'Ephesians', 50: 'Philippians', 51: 'Colossians', 52: '1 Thessalonians',
  53: '2 Thessalonians', 54: '1 Timothy', 55: '2 Timothy', 56: 'Titus',
  57: 'Philemon', 58: 'Hebrews', 59: 'James', 60: '1 Peter', 61: '2 Peter',
  62: '1 John', 63: '2 John', 64: '3 John', 65: 'Jude', 66: 'Revelation'
};

// Cache for loaded books
const bookCache = new Map();

function publicUrl(path) {
  return `${process.env.PUBLIC_URL || ''}${path}`;
}

/**
 * Load interlinear data for a book
 * @param {string} bookName - Book name
 * @returns {Promise<Array|null>} Array of verse objects
 */
async function loadBook(bookName) {
  const file = BOOK_FILES[bookName];
  if (!file) return null;

  if (bookCache.has(bookName)) {
    return bookCache.get(bookName);
  }

  try {
    const res = await fetch(publicUrl(`/interlinear_bibledata-master/interlinear/${file}`));
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    bookCache.set(bookName, json);
    return json;
  } catch (e) {
    console.warn(`[Interlinear] Could not load ${bookName}:`, e.message);
    bookCache.set(bookName, null);
    return null;
  }
}

/**
 * Parse verse ID to extract book, chapter, verse
 * Format: BBCCCVVV (book=2 digits, chapter=3 digits, verse=3 digits)
 * @param {string} id - Verse ID
 * @returns {Object|null} Parsed reference
 */
function parseVerseId(id) {
  if (!id || id.length < 8) return null;

  const bookNum = parseInt(id.substring(0, 2));
  const chapter = parseInt(id.substring(2, 5));
  const verse = parseInt(id.substring(5, 8));

  const book = BOOK_NUMBERS[bookNum];
  if (!book) return null;

  return { book, chapter, verse };
}

/**
 * Find verse in interlinear data
 * @param {Array} bookData - Book's interlinear data
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @returns {Object|null} Verse data
 */
function findVerse(bookData, chapter, verse) {
  if (!bookData || !Array.isArray(bookData)) return null;

  for (const verseObj of bookData) {
    const parsed = parseVerseId(verseObj.id);
    if (parsed && parsed.chapter === chapter && parsed.verse === verse) {
      return verseObj;
    }
  }

  return null;
}

/**
 * Get interlinear data for a verse
 * @param {string} book - Book name
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @returns {Promise<Object|null>} Interlinear verse object
 */
export async function getInterlinearVerse(book, chapter, verse) {
  const bookData = await loadBook(book);
  if (!bookData) return null;

  const verseData = findVerse(bookData, chapter, verse);
  if (!verseData || !verseData.verse) return null;

  // Determine language (Greek or Hebrew)
  const firstWord = verseData.verse[0];
  const isGreek = firstWord && firstWord.number && firstWord.number.toLowerCase().startsWith('g');
  const language = isGreek ? 'Greek' : 'Hebrew';

  return {
    reference: `${book} ${chapter}:${verse}`,
    book,
    chapter,
    verse,
    language,
    words: verseData.verse.map(wordObj => ({
      original: wordObj.word || '',
      english: wordObj.text || '',
      strongs: wordObj.number ? wordObj.number.toUpperCase() : null,
      wordOrder: wordObj.i
    }))
  };
}

/**
 * Parse reference string
 * @param {string} reference - e.g., "John 3:16"
 * @returns {Object|null} Parsed reference
 */
function parseReference(reference) {
  if (!reference) return null;

  const match = reference.match(/^([123]?\s?[A-Za-z\s]+)\s+(\d+):(\d+)$/);
  if (!match) return null;

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2]),
    verse: parseInt(match[3])
  };
}

/**
 * Get interlinear by reference string
 * @param {string} reference - e.g., "John 3:16"
 * @returns {Promise<Object|null>} Interlinear data
 */
export async function getInterlinearByReference(reference) {
  const parsed = parseReference(reference);
  if (!parsed) return null;

  return await getInterlinearVerse(parsed.book, parsed.chapter, parsed.verse);
}

/**
 * Format interlinear data for display
 * @param {Object} interlinear - Interlinear verse object
 * @returns {string} Formatted display text
 */
export function formatInterlinear(interlinear) {
  if (!interlinear || !interlinear.words) return '';

  let output = `## 📝 ${interlinear.reference} - Interlinear (${interlinear.language})\n\n`;

  // Group words in chunks of 5-6 for readability
  const chunkSize = 6;
  const chunks = [];
  for (let i = 0; i < interlinear.words.length; i += chunkSize) {
    chunks.push(interlinear.words.slice(i, i + chunkSize));
  }

  chunks.forEach((chunk, idx) => {
    // Original language line
    const originalLine = chunk.map(w => w.original || '—').join('   ');

    // English line
    const englishLine = chunk.map(w => {
      const text = w.english || '—';
      // Pad to match original word length
      const origLen = (w.original || '—').length;
      return text.padEnd(Math.max(text.length, origLen), ' ');
    }).join('   ');

    // Strong's number line
    const strongsLine = chunk.map(w => {
      const num = w.strongs || '—';
      const origLen = (w.original || '—').length;
      return num.padEnd(Math.max(num.length, origLen), ' ');
    }).join('   ');

    output += `${originalLine}\n`;
    output += `${englishLine}\n`;
    output += `${strongsLine}\n`;

    if (idx < chunks.length - 1) {
      output += `\n`;
    }
  });

  return output;
}

/**
 * Check if interlinear data is available for a book
 * @param {string} bookName - Book name
 * @returns {boolean} Whether data is available
 */
export function isInterlinearAvailable(bookName) {
  return BOOK_FILES.hasOwnProperty(bookName);
}

/**
 * Get list of books with interlinear data
 * @returns {Array} List of book names
 */
export function getAvailableBooks() {
  return Object.keys(BOOK_FILES);
}

export default {
  getInterlinearVerse,
  getInterlinearByReference,
  formatInterlinear,
  isInterlinearAvailable,
  getAvailableBooks
};
