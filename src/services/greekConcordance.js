// Greek Concordance Service - fetches verse references from OpenGNT data
// Uses OpenGNT concordance data to map Strong's numbers to Bible verses

const BOOK_ID_TO_NAME = {
  40: 'Matthew', 41: 'Mark', 42: 'Luke', 43: 'John',
  44: 'Acts', 45: 'Romans', 46: '1 Corinthians', 47: '2 Corinthians',
  48: 'Galatians', 49: 'Ephesians', 50: 'Philippians', 51: 'Colossians',
  52: '1 Thessalonians', 53: '2 Thessalonians', 54: '1 Timothy', 55: '2 Timothy',
  56: 'Titus', 57: 'Philemon', 58: 'Hebrews', 59: 'James',
  60: '1 Peter', 61: '2 Peter', 62: '1 John', 63: '2 John',
  64: '3 John', 65: 'Jude', 66: 'Revelation'
};

// Cache for concordance data
const concordanceCache = new Map();
let concordanceDataLoaded = false;
let concordanceData = null;

/**
 * Load the OpenGNT concordance data
 */
async function loadConcordanceData() {
  if (concordanceDataLoaded) return concordanceData;

  try {
    const base = process.env.PUBLIC_URL || '';
    const url = `${base}/data/OpenGNT-master/OpenGNT-master/OpenGNT-concordance/OpenGNT-concordance-sortedByBook_raw.csv`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error('[Concordance] Failed to load:', response.status, response.statusText);
      return null;
    }

    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());

    // Parse the concordance data into a map
    const concordanceMap = new Map();

    for (const line of lines) {
      // Each line format: G1234<tab><html with verse references>
      const tabIndex = line.indexOf('\t');
      if (tabIndex === -1) continue;

      const strongsNum = line.substring(0, tabIndex).trim();
      const htmlData = line.substring(tabIndex + 1);

      // Extract verse references from the HTML
      // Format: ｛book.chapter.verse｜book.chapter.verse｝
      const references = [];
      const refPattern = /｛(\d+)\.(\d+)\.(\d+)｜/g;
      let match;

      while ((match = refPattern.exec(htmlData)) !== null) {
        const bookId = parseInt(match[1]);
        const chapter = parseInt(match[2]);
        const verse = parseInt(match[3]);

        const bookName = BOOK_ID_TO_NAME[bookId];
        if (bookName) {
          references.push({
            reference: `${bookName} ${chapter}:${verse}`,
            book: bookName,
            chapter,
            verse,
            bookId
          });
        }
      }

      concordanceMap.set(strongsNum, references);
    }

    concordanceData = concordanceMap;
    concordanceDataLoaded = true;

    return concordanceData;
  } catch (error) {
    console.error('[Concordance] Error loading:', error);
    return null;
  }
}

/**
 * Get verse references for a Strong's number
 * @param {string} strongsNum - Strong's number (e.g., "G25")
 * @returns {Promise<Array>} Array of verse reference objects
 */
export async function getVerseReferences(strongsNum) {
  // Check cache first
  if (concordanceCache.has(strongsNum)) {
    return concordanceCache.get(strongsNum);
  }

  // Load concordance data if not already loaded
  const data = await loadConcordanceData();
  if (!data) {
    return [];
  }

  // Get references for this Strong's number
  const references = data.get(strongsNum) || [];

  // Cache the result
  concordanceCache.set(strongsNum, references);

  return references;
}

/**
 * Get usage count for a Strong's number
 * @param {string} strongsNum - Strong's number (e.g., "G25")
 * @returns {Promise<number>} Number of times the word appears
 */
export async function getUsageCount(strongsNum) {
  const references = await getVerseReferences(strongsNum);
  return references.length;
}

/**
 * Get a sample of verse references (for display purposes)
 * @param {string} strongsNum - Strong's number (e.g., "G25")
 * @param {number} limit - Maximum number of references to return
 * @returns {Promise<Array>} Array of verse reference objects
 */
export async function getSampleReferences(strongsNum, limit = 10) {
  const allReferences = await getVerseReferences(strongsNum);

  if (allReferences.length <= limit) {
    return allReferences;
  }

  // Return evenly distributed sample
  const step = Math.floor(allReferences.length / limit);
  const samples = [];

  for (let i = 0; i < limit; i++) {
    const index = i * step;
    if (index < allReferences.length) {
      samples.push(allReferences[index]);
    }
  }

  return samples;
}

/**
 * Get references grouped by book
 * @param {string} strongsNum - Strong's number (e.g., "G25")
 * @returns {Promise<Object>} Object with book names as keys and reference arrays as values
 */
export async function getReferencesByBook(strongsNum) {
  const allReferences = await getVerseReferences(strongsNum);

  const grouped = {};

  for (const ref of allReferences) {
    if (!grouped[ref.book]) {
      grouped[ref.book] = [];
    }
    grouped[ref.book].push(ref);
  }

  return grouped;
}

/**
 * Get unique books where this word appears
 * @param {string} strongsNum - Strong's number (e.g., "G25")
 * @returns {Promise<Array>} Array of unique book names
 */
export async function getUniqueBooks(strongsNum) {
  const allReferences = await getVerseReferences(strongsNum);
  const books = [...new Set(allReferences.map(ref => ref.book))];
  return books.sort((a, b) => {
    const bookIds = Object.entries(BOOK_ID_TO_NAME).reduce((acc, [id, name]) => {
      acc[name] = parseInt(id);
      return acc;
    }, {});
    return (bookIds[a] || 0) - (bookIds[b] || 0);
  });
}

/**
 * Get filtered references by book and optionally chapter
 * @param {string} strongsNum - Strong's number (e.g., "G25")
 * @param {string} book - Book name to filter by
 * @param {number|null} chapter - Optional chapter number to filter by
 * @returns {Promise<Array>} Filtered array of verse references
 */
export async function getFilteredReferences(strongsNum, book, chapter = null) {
  const allReferences = await getVerseReferences(strongsNum);

  let filtered = allReferences.filter(ref => ref.book === book);

  if (chapter !== null) {
    filtered = filtered.filter(ref => ref.chapter === chapter);
  }

  return filtered;
}

/**
 * Get unique chapters for a book where this word appears
 * @param {string} strongsNum - Strong's number (e.g., "G25")
 * @param {string} book - Book name
 * @returns {Promise<Array>} Array of unique chapter numbers
 */
export async function getUniqueChapters(strongsNum, book) {
  const allReferences = await getVerseReferences(strongsNum);
  const chapters = [...new Set(
    allReferences
      .filter(ref => ref.book === book)
      .map(ref => ref.chapter)
  )];
  return chapters.sort((a, b) => a - b);
}

export default {
  getVerseReferences,
  getUsageCount,
  getSampleReferences,
  getReferencesByBook,
  getUniqueBooks,
  getFilteredReferences,
  getUniqueChapters
};
