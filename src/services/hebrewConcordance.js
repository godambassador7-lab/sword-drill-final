// Hebrew Concordance Service - fetches verse references from morphhb data
// Uses morphhb XML data to map Strong's numbers to Old Testament verses

const BOOK_FILES = {
  'Genesis': 'Gen',
  'Exodus': 'Exod',
  'Leviticus': 'Lev',
  'Numbers': 'Num',
  'Deuteronomy': 'Deut',
  'Joshua': 'Josh',
  'Judges': 'Judg',
  'Ruth': 'Ruth',
  '1 Samuel': '1Sam',
  '2 Samuel': '2Sam',
  '1 Kings': '1Kgs',
  '2 Kings': '2Kgs',
  '1 Chronicles': '1Chr',
  '2 Chronicles': '2Chr',
  'Ezra': 'Ezra',
  'Nehemiah': 'Neh',
  'Esther': 'Esth',
  'Job': 'Job',
  'Psalms': 'Ps',
  'Proverbs': 'Prov',
  'Ecclesiastes': 'Eccl',
  'Song of Solomon': 'Song',
  'Isaiah': 'Isa',
  'Jeremiah': 'Jer',
  'Lamentations': 'Lam',
  'Ezekiel': 'Ezek',
  'Daniel': 'Dan',
  'Hosea': 'Hos',
  'Joel': 'Joel',
  'Amos': 'Amos',
  'Obadiah': 'Obad',
  'Jonah': 'Jonah',
  'Micah': 'Mic',
  'Nahum': 'Nah',
  'Habakkuk': 'Hab',
  'Zephaniah': 'Zeph',
  'Haggai': 'Hag',
  'Zechariah': 'Zech',
  'Malachi': 'Mal'
};

// Cache for concordance data
const concordanceCache = new Map();
let concordanceDataLoaded = false;
let concordanceData = null;

/**
 * Parse Strong's number from lemma attribute
 * Handles formats like "430", "1254 a", "b/7225", "c/d/776"
 */
function parseStrongsNumber(lemma) {
  if (!lemma) return null;

  // Remove prefixes (b/, c/, d/, etc.) and suffixes (a, b, c)
  const cleaned = lemma.replace(/^[a-z]\//g, '').replace(/\s+[a-z]$/i, '').trim();

  // Extract just the number
  const match = cleaned.match(/\d+/);
  return match ? `H${match[0]}` : null;
}

/**
 * Load and parse all Hebrew Bible XML files to build concordance
 */
async function loadConcordanceData() {
  if (concordanceDataLoaded) return concordanceData;

  try {
    const base = process.env.PUBLIC_URL || '';
    const concordanceMap = new Map();

    console.log('[Hebrew Concordance] Starting to load concordance data...');

    // Load each book's XML file
    for (const [bookName, fileName] of Object.entries(BOOK_FILES)) {
      try {
        const url = `${base}/morphhb-master/wlc/${fileName}.xml`;
        const response = await fetch(url);

        if (!response.ok) {
          console.warn(`[Hebrew Concordance] Failed to load ${bookName}:`, response.status);
          continue;
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // Find all verse elements
        const verses = xmlDoc.getElementsByTagName('verse');

        for (const verse of verses) {
          const osisID = verse.getAttribute('osisID');
          if (!osisID) continue;

          // Parse book.chapter.verse
          const parts = osisID.split('.');
          if (parts.length !== 3) continue;

          const chapter = parseInt(parts[1]);
          const verseNum = parseInt(parts[2]);
          const reference = `${bookName} ${chapter}:${verseNum}`;

          // Find all word elements with lemma attributes
          const words = verse.getElementsByTagName('w');

          for (const word of words) {
            const lemma = word.getAttribute('lemma');
            if (!lemma) continue;

            const strongsNum = parseStrongsNumber(lemma);
            if (!strongsNum) continue;

            // Add reference to this Strong's number
            if (!concordanceMap.has(strongsNum)) {
              concordanceMap.set(strongsNum, []);
            }

            concordanceMap.get(strongsNum).push({
              reference,
              book: bookName,
              chapter,
              verse: verseNum,
              osisID
            });
          }
        }

        console.log(`[Hebrew Concordance] Loaded ${bookName}`);
      } catch (error) {
        console.error(`[Hebrew Concordance] Error loading ${bookName}:`, error);
      }
    }

    concordanceData = concordanceMap;
    concordanceDataLoaded = true;

    console.log(`[Hebrew Concordance] Loaded concordance with ${concordanceMap.size} unique words`);
    return concordanceData;
  } catch (error) {
    console.error('[Hebrew Concordance] Error loading:', error);
    return null;
  }
}

/**
 * Get verse references for a Strong's number
 * @param {string} strongsNum - Strong's number (e.g., "H430")
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
 * @param {string} strongsNum - Strong's number (e.g., "H430")
 * @returns {Promise<number>} Number of times the word appears
 */
export async function getUsageCount(strongsNum) {
  const references = await getVerseReferences(strongsNum);
  return references.length;
}

/**
 * Get a sample of verse references (for display purposes)
 * @param {string} strongsNum - Strong's number (e.g., "H430")
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
 * @param {string} strongsNum - Strong's number (e.g., "H430")
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
 * @param {string} strongsNum - Strong's number (e.g., "H430")
 * @returns {Promise<Array>} Array of unique book names
 */
export async function getUniqueBooks(strongsNum) {
  const allReferences = await getVerseReferences(strongsNum);
  const books = [...new Set(allReferences.map(ref => ref.book))];
  // Sort by book order (OT books in order)
  const bookOrder = Object.values(BOOK_FILES);
  return books.sort((a, b) => {
    const indexA = bookOrder.indexOf(BOOK_FILES[a]);
    const indexB = bookOrder.indexOf(BOOK_FILES[b]);
    return indexA - indexB;
  });
}

/**
 * Get filtered references by book and optionally chapter
 * @param {string} strongsNum - Strong's number (e.g., "H430")
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
 * @param {string} strongsNum - Strong's number (e.g., "H430")
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
