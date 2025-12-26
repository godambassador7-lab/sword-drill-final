/**
 * Cross-Reference Provider for RAG System
 * Provides comprehensive cross-references from OpenGNT and curated sources
 */

import { THEMATIC_CROSS_REFS, TOPIC_SYNONYMS } from '../../../data/thematicCrossRefs';
import { GOSPEL_HARMONY, GOSPEL_UNIQUE_CONTENT } from '../../../data/gospelHarmony';

// Hardcoded high-value cross-references (always available immediately)
const CORE_CROSS_REFS = {
  'John 3:16': ['Romans 5:8', '1 John 4:9-10', 'John 3:17', 'Titus 3:4-5'],
  'Genesis 1:1': ['John 1:1-3', 'Hebrews 11:3', 'Psalm 33:6', 'Colossians 1:16'],
  'Psalm 23:1': ['John 10:11', 'Ezekiel 34:11-12', '1 Peter 2:25'],
  'Romans 8:28': ['Genesis 50:20', 'Jeremiah 29:11', 'Philippians 1:6'],
  'Proverbs 3:5': ['Jeremiah 17:7', 'Psalm 37:5', 'Isaiah 26:3-4'],
  'John 1:1': ['Genesis 1:1-3', 'Colossians 1:16-17', 'Hebrews 1:2-3', 'Revelation 19:13'],
  'John 14:6': ['Acts 4:12', '1 Timothy 2:5', 'John 10:9'],
  'Romans 3:23': ['Psalm 14:3', 'Ecclesiastes 7:20', '1 John 1:8'],
  'Romans 6:23': ['John 3:36', 'Ephesians 2:8-9', 'James 1:15'],
  '1 Corinthians 13:4': ['Galatians 5:22-23', '1 Peter 4:8', 'Colossians 3:14'],
  'Ephesians 2:8': ['Romans 3:24', 'Titus 3:5', '2 Timothy 1:9', 'Romans 11:6'],
  '1 John 4:8': ['1 John 4:16', 'John 3:16', 'Romans 5:8', 'Deuteronomy 7:8'],
  'Philippians 4:13': ['2 Corinthians 12:9', 'Colossians 1:11', 'Ephesians 3:16'],
};

// Cache for loaded cross-reference data
let crossRefData = null;
let crossRefDataLoaded = false;
const crossRefCache = new Map();

// Book name mapping (OpenGNT format to standard names)
const BOOK_NAME_MAP = {
  'matthew': 'Matthew',
  'mark': 'Mark',
  'luke': 'Luke',
  'john': 'John',
  'acts': 'Acts',
  'romans': 'Romans',
  '1corinthians': '1 Corinthians',
  '2corinthians': '2 Corinthians',
  'galatians': 'Galatians',
  'ephesians': 'Ephesians',
  'philippians': 'Philippians',
  'colossians': 'Colossians',
  '1thessalonians': '1 Thessalonians',
  '2thessalonians': '2 Thessalonians',
  '1timothy': '1 Timothy',
  '2timothy': '2 Timothy',
  'titus': 'Titus',
  'philemon': 'Philemon',
  'hebrews': 'Hebrews',
  'james': 'James',
  '1peter': '1 Peter',
  '2peter': '2 Peter',
  '1john': '1 John',
  '2john': '2 John',
  '3john': '3 John',
  'jude': 'Jude',
  'revelation': 'Revelation',
  // OT books
  'genesis': 'Genesis',
  'exodus': 'Exodus',
  'leviticus': 'Leviticus',
  'numbers': 'Numbers',
  'deuteronomy': 'Deuteronomy',
  'joshua': 'Joshua',
  'judges': 'Judges',
  'ruth': 'Ruth',
  '1samuel': '1 Samuel',
  '2samuel': '2 Samuel',
  '1kings': '1 Kings',
  '2kings': '2 Kings',
  '1chronicles': '1 Chronicles',
  '2chronicles': '2 Chronicles',
  'ezra': 'Ezra',
  'nehemiah': 'Nehemiah',
  'esther': 'Esther',
  'job': 'Job',
  'psalms': 'Psalms',
  'psalm': 'Psalm',
  'proverbs': 'Proverbs',
  'ecclesiastes': 'Ecclesiastes',
  'song': 'Song of Solomon',
  'isaiah': 'Isaiah',
  'jeremiah': 'Jeremiah',
  'lamentations': 'Lamentations',
  'ezekiel': 'Ezekiel',
  'daniel': 'Daniel',
  'hosea': 'Hosea',
  'joel': 'Joel',
  'amos': 'Amos',
  'obadiah': 'Obadiah',
  'jonah': 'Jonah',
  'micah': 'Micah',
  'nahum': 'Nahum',
  'habakkuk': 'Habakkuk',
  'zephaniah': 'Zephaniah',
  'haggai': 'Haggai',
  'zechariah': 'Zechariah',
  'malachi': 'Malachi'
};

/**
 * Parse cross-reference entry from OpenGNT format
 * Format: 『book｜chapter｜verse｜Display Text』
 */
function parseCrossRefEntry(entry) {
  const match = entry.match(/『([^｜]+)｜(\d+)｜(\d+)｜([^』]+)』/);
  if (!match) return null;

  const [, book, chapter, verse, displayText] = match;
  const bookName = BOOK_NAME_MAP[book.toLowerCase()] || book;

  return {
    reference: displayText,
    book: bookName,
    chapter: parseInt(chapter),
    verse: parseInt(verse),
    raw: entry
  };
}

/**
 * Load OpenGNT cross-reference data
 */
async function loadCrossRefData() {
  if (crossRefDataLoaded) return crossRefData;

  try {
    const base = process.env.PUBLIC_URL || '';
    const url = `${base}/data/OpenGNT-master/OpenGNT-master/OpenGNT_headingCrossRef.tsv`;

    console.log('[CrossRefs] Loading OpenGNT cross-references...');

    const response = await fetch(url);
    if (!response.ok) {
      console.error('[CrossRefs] Failed to load:', response.status, response.statusText);
      return null;
    }

    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());

    // Skip header line
    const dataLines = lines.slice(1);

    // Build lookup map: Book Chapter:Verse -> array of cross-refs
    const crossRefMap = new Map();

    for (const line of dataLines) {
      const columns = line.split('\t');
      if (columns.length < 7) continue;

      const [, , book, chapter, verse, heading, crossrefData] = columns;

      if (!crossrefData || crossrefData.trim() === '') continue;

      // Parse book number to name
      const bookNum = parseInt(book);
      let bookName = '';
      if (bookNum >= 40 && bookNum <= 66) {
        // NT books (Matthew=40 to Revelation=66)
        const ntBooks = [
          'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
          '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
          'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
          '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
          'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
          'Jude', 'Revelation'
        ];
        bookName = ntBooks[bookNum - 40];
      }

      if (!bookName) continue;

      const reference = `${bookName} ${chapter}:${verse}`;

      // Parse cross-reference entries
      const entries = crossrefData.match(/『[^』]+』/g) || [];
      const parsedRefs = entries
        .map(parseCrossRefEntry)
        .filter(ref => ref !== null);

      if (parsedRefs.length > 0) {
        crossRefMap.set(reference, parsedRefs);
      }
    }

    crossRefData = crossRefMap;
    crossRefDataLoaded = true;

    console.log(`[CrossRefs] Loaded ${crossRefMap.size} cross-reference entries`);
    return crossRefData;
  } catch (error) {
    console.error('[CrossRefs] Error loading:', error);
    return null;
  }
}

/**
 * Get cross-references for a verse
 * @param {string} reference - Verse reference (e.g., "John 3:16")
 * @returns {Promise<Array>} Array of cross-reference strings
 */
export async function getCrossReferences(reference) {
  if (!reference) return [];

  // Check cache first
  if (crossRefCache.has(reference)) {
    return crossRefCache.get(reference);
  }

  // Start with core hardcoded references
  const coreRefs = CORE_CROSS_REFS[reference] || [];

  // Try to load OpenGNT data
  const data = await loadCrossRefData();
  let openGNTRefs = [];

  if (data && data.has(reference)) {
    openGNTRefs = data.get(reference).map(ref => ref.reference);
  }

  // Combine and deduplicate
  const allRefs = [...new Set([...coreRefs, ...openGNTRefs])];

  // Cache the result
  crossRefCache.set(reference, allRefs);

  return allRefs;
}

/**
 * Get cross-references with metadata
 * @param {string} reference - Verse reference
 * @returns {Promise<Array>} Array of cross-reference objects with metadata
 */
export async function getCrossReferencesWithMetadata(reference) {
  if (!reference) return [];

  const data = await loadCrossRefData();
  if (!data || !data.has(reference)) {
    // Fallback to core refs
    const coreRefs = CORE_CROSS_REFS[reference] || [];
    return coreRefs.map(ref => ({ reference: ref, source: 'core' }));
  }

  return data.get(reference).map(ref => ({
    reference: ref.reference,
    book: ref.book,
    chapter: ref.chapter,
    verse: ref.verse,
    source: 'opengnt'
  }));
}

/**
 * Search for cross-references by topic or keyword
 * @param {string} topic - Topic to search for
 * @returns {Promise<Array>} Related verses
 */
export async function searchCrossRefsByTopic(topic) {
  if (!topic) return [];

  const normalized = topic.toLowerCase().trim();

  // Check for synonyms
  const actualTopic = TOPIC_SYNONYMS[normalized] || normalized;

  // Look up in thematic cross-refs
  const thematicData = THEMATIC_CROSS_REFS[actualTopic];

  if (thematicData) {
    return {
      topic: actualTopic,
      description: thematicData.description,
      verses: thematicData.verses
    };
  }

  // Try partial matching
  for (const [key, data] of Object.entries(THEMATIC_CROSS_REFS)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return {
        topic: key,
        description: data.description,
        verses: data.verses
      };
    }
  }

  return null;
}

/**
 * Get all available topics
 * @returns {Array} List of topic objects
 */
export function getAvailableTopics() {
  return Object.entries(THEMATIC_CROSS_REFS).map(([key, data]) => ({
    topic: key,
    description: data.description,
    verseCount: data.verses.length
  }));
}

/**
 * Get Gospel parallels for a passage
 * @param {string} reference - Verse reference (e.g., "Matthew 5:1")
 * @returns {Array} Parallel passages in other Gospels
 */
export function getGospelParallels(reference) {
  if (!reference) return [];

  // Extract book name from reference
  const bookMatch = reference.match(/^(Matthew|Mark|Luke|John)/i);
  if (!bookMatch) return [];

  const book = bookMatch[1];
  const bookLower = book.toLowerCase();

  // Find matching events in harmony
  const parallels = [];

  for (const event of GOSPEL_HARMONY) {
    // Check if this event includes the requested book
    if (event[bookLower]) {
      // Check if the reference might match this event's passage
      // (This is a simplified check - could be enhanced with precise verse matching)
      if (event[bookLower].includes(reference) || reference.includes(event[bookLower].split('-')[0])) {
        // Add parallels from other Gospels
        const otherGospels = ['matthew', 'mark', 'luke', 'john'].filter(g => g !== bookLower);

        for (const gospel of otherGospels) {
          if (event[gospel]) {
            parallels.push({
              event: event.event,
              reference: event[gospel],
              gospel: gospel.charAt(0).toUpperCase() + gospel.slice(1),
              category: event.category,
              notes: event.notes || null
            });
          }
        }

        // If we found matches, return them
        if (parallels.length > 0) {
          return parallels;
        }
      }
    }
  }

  return parallels;
}

/**
 * Get synoptic parallels (Matthew, Mark, Luke similarities)
 * @param {string} reference - Verse reference
 * @returns {Object|null} Synoptic parallel information
 */
export function getSynopticParallels(reference) {
  const parallels = getGospelParallels(reference);

  if (parallels.length === 0) return null;

  const synoptic = parallels.filter(p =>
    ['Matthew', 'Mark', 'Luke'].includes(p.gospel)
  );

  if (synoptic.length === 0) return null;

  return {
    reference,
    parallels: synoptic,
    note: 'Synoptic Gospels (Matthew, Mark, Luke) share similar perspectives on Jesus\' life and ministry'
  };
}

/**
 * Get unique content for a Gospel
 * @param {string} gospel - Gospel name (Matthew, Mark, Luke, John)
 * @returns {Array|null} List of unique content
 */
export function getGospelUniqueContent(gospel) {
  const key = gospel.toLowerCase();
  return GOSPEL_UNIQUE_CONTENT[key] || null;
}

export default {
  getCrossReferences,
  getCrossReferencesWithMetadata,
  searchCrossRefsByTopic,
  getAvailableTopics,
  getGospelParallels,
  getSynopticParallels,
  getGospelUniqueContent
};
