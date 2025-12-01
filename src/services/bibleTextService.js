// Bible Text Service - fetches full Bible verses
// Supports multiple translations

let bibleData = null;
let bibleDataLoaded = false;

/**
 * Load Bible data (ESV translation)
 */
async function loadBibleData() {
  if (bibleDataLoaded) return bibleData;

  try {
    const base = process.env.PUBLIC_URL || '';
    // Load from archived_data
    const response = await fetch(`${base}/archived_data/ESV_bible.json`);

    if (!response.ok) {
      console.error('[BibleText] Failed to load Bible data:', response.status);
      return null;
    }

    bibleData = await response.json();
    bibleDataLoaded = true;
    console.log('[BibleText] Bible data loaded successfully');
    return bibleData;
  } catch (error) {
    console.error('[BibleText] Error loading Bible data:', error);
    return null;
  }
}

/**
 * Get a verse text
 * @param {string} book - Book name (e.g., "Genesis", "Matthew")
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @returns {Promise<string|null>} Verse text or null if not found
 */
export async function getVerseText(book, chapter, verse) {
  const data = await loadBibleData();
  if (!data) return null;

  try {
    const verseText = data[book]?.[chapter]?.[verse];
    return verseText || null;
  } catch (error) {
    console.error('[BibleText] Error fetching verse:', error);
    return null;
  }
}

/**
 * Parse a verse reference string
 * @param {string} reference - Reference like "Genesis 1:1" or "Matthew 5:3"
 * @returns {Object} Parsed reference with book, chapter, verse
 */
export function parseReference(reference) {
  // Handle formats like "Genesis 1:1" or "1 John 2:3"
  const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/);

  if (!match) {
    return null;
  }

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2]),
    verse: parseInt(match[3])
  };
}

/**
 * Get verse text from a reference string
 * @param {string} reference - Reference like "Genesis 1:1"
 * @returns {Promise<string|null>} Verse text or null if not found
 */
export async function getVerseByReference(reference) {
  const parsed = parseReference(reference);
  if (!parsed) return null;

  return await getVerseText(parsed.book, parsed.chapter, parsed.verse);
}

export default {
  getVerseText,
  getVerseByReference,
  parseReference
};
