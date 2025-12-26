/**
 * Lexicon Provider for RAG System
 * Provides Greek and Hebrew word study data from Strong's Concordance
 */

// Import Strong's dictionaries
import GREEK_LEXICON from '../../../data/strongs-master/strongs-master/greek/strongs-greek-dictionary';
import HEBREW_LEXICON from '../../../data/strongs-master/strongs-master/hebrew/strongs-hebrew-dictionary';

// Import concordance services
import * as greekConcordance from '../../greekConcordance';
import * as hebrewConcordance from '../../hebrewConcordance';

// Import morphology provider
import * as morphologyProvider from './morphologyProvider';

// Combine dictionaries for unified lookup
const FULL_LEXICON = { ...GREEK_LEXICON, ...HEBREW_LEXICON };

/**
 * Lookup word study data for a term
 * @param {string} term - English word, Greek word, Hebrew word, or Strong's number
 * @returns {Promise<Object|null>} Lexicon entry or null
 */
export async function lookupWordStudy(term) {
  if (!term) return null;

  try {
    // Check if it's a Strong's number (G#### or H####)
    const strongsMatch = term.match(/^([GH])(\d{1,5})$/i);
    if (strongsMatch) {
      const type = strongsMatch[1].toUpperCase();
      const number = strongsMatch[2].padStart(4, '0');
      return await getStrongsEntry(type, number);
    }

    // Try searching by original language (Greek/Hebrew text)
    const originalMatch = await searchByOriginalLanguage(term);
    if (originalMatch) return originalMatch;

    // Otherwise, try to find by English word
    return await searchByEnglishWord(term);
  } catch (error) {
    console.error('Error looking up word study:', error);
    return null;
  }
}

/**
 * Get Strong's concordance entry by number
 * @param {string} type - 'G' for Greek or 'H' for Hebrew
 * @param {string} number - Strong's number (4 digits)
 * @returns {Promise<Object|null>} Lexicon entry
 */
async function getStrongsEntry(type, number) {
  try {
    const key = `${type}${number}`;
    const entry = FULL_LEXICON[key];

    if (!entry) {
      console.warn(`Strong's entry not found: ${key}`);
      return null;
    }

    // Standardize the response format
    return {
      strongs: key,
      word: entry.lemma || entry.word || '',
      transliteration: entry.translit || entry.xlit || entry.transliteration || '',
      pronunciation: entry.pron || entry.pronunciation || '',
      definition: entry.strongs_def || entry.definition || '',
      kjvUsage: entry.kjv_def || entry.kjvUsage || '',
      derivation: entry.derivation || '',
      language: type === 'G' ? 'Greek' : 'Hebrew'
    };
  } catch (error) {
    console.error(`Error getting Strong's entry ${type}${number}:`, error);
    return null;
  }
}

/**
 * Search for lexicon entries by English word
 * @param {string} word - English word to search for
 * @returns {Promise<Object|null>} Lexicon entry
 */
async function searchByEnglishWord(word) {
  const normalized = word.toLowerCase().trim();

  // Search through all KJV definitions
  for (const [strongsNum, entry] of Object.entries(FULL_LEXICON)) {
    const kjvDef = (entry.kjv_def || '').toLowerCase();
    const strongsDef = (entry.strongs_def || '').toLowerCase();

    // Check for exact word match in KJV definition
    const words = kjvDef.split(/[,\s]+/);
    if (words.includes(normalized)) {
      return getStrongsEntry(strongsNum[0], strongsNum.substring(1));
    }

    // Check if word appears in definition
    if (kjvDef.includes(normalized) || strongsDef.includes(normalized)) {
      return getStrongsEntry(strongsNum[0], strongsNum.substring(1));
    }
  }

  return null;
}

/**
 * Search for lexicon entries by original language (Greek/Hebrew text)
 * @param {string} term - Greek or Hebrew word
 * @returns {Promise<Object|null>} Lexicon entry
 */
async function searchByOriginalLanguage(term) {
  const normalized = term.trim();

  // Search through lemmas and transliterations
  for (const [strongsNum, entry] of Object.entries(FULL_LEXICON)) {
    const lemma = entry.lemma || entry.word || '';
    const translit = entry.translit || entry.xlit || '';

    // Check for match in lemma or transliteration
    if (lemma === normalized || translit.toLowerCase() === normalized.toLowerCase()) {
      return getStrongsEntry(strongsNum[0], strongsNum.substring(1));
    }
  }

  return null;
}

/**
 * Get morphological analysis for a word
 * @param {string} strongsNumber - Strong's number (e.g., "G26")
 * @param {string} morphCode - Optional morphology code
 * @returns {Promise<Object|null>} Morphological data
 */
export async function getMorphology(strongsNumber, morphCode) {
  return await morphologyProvider.getMorphology(strongsNumber, morphCode);
}

/**
 * Search lexicon by multiple terms
 * @param {Array} terms - Array of search terms
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of lexicon entries
 */
export async function searchLexicon(terms, limit = 5) {
  const results = [];
  const seen = new Set();

  for (const term of terms) {
    if (results.length >= limit) break;

    const entry = await lookupWordStudy(term);
    if (entry && entry.strongs && !seen.has(entry.strongs)) {
      results.push(entry);
      seen.add(entry.strongs);
    }
  }

  return results;
}

/**
 * Get usage examples for a Strong's number
 * @param {string} strongsNum - Strong's number (e.g., "G26" or "H2617")
 * @param {number} limit - Maximum number of examples to return
 * @returns {Promise<Array>} Array of verse reference objects
 */
export async function getUsageExamples(strongsNum, limit = 8) {
  if (!strongsNum) return [];

  try {
    const type = strongsNum[0].toUpperCase();

    if (type === 'G') {
      return await greekConcordance.getSampleReferences(strongsNum, limit);
    } else if (type === 'H') {
      return await hebrewConcordance.getSampleReferences(strongsNum, limit);
    }

    return [];
  } catch (error) {
    console.error(`Error getting usage examples for ${strongsNum}:`, error);
    return [];
  }
}

/**
 * Get frequency count for a Strong's number
 * @param {string} strongsNum - Strong's number (e.g., "G26" or "H2617")
 * @returns {Promise<number>} Number of times the word appears in Scripture
 */
export async function getFrequency(strongsNum) {
  if (!strongsNum) return 0;

  try {
    const type = strongsNum[0].toUpperCase();

    if (type === 'G') {
      return await greekConcordance.getUsageCount(strongsNum);
    } else if (type === 'H') {
      return await hebrewConcordance.getUsageCount(strongsNum);
    }

    return 0;
  } catch (error) {
    console.error(`Error getting frequency for ${strongsNum}:`, error);
    return 0;
  }
}

/**
 * Get book distribution for a Strong's number
 * @param {string} strongsNum - Strong's number (e.g., "G26" or "H2617")
 * @returns {Promise<Array>} Array of book names where the word appears
 */
export async function getBookDistribution(strongsNum) {
  if (!strongsNum) return [];

  try {
    const type = strongsNum[0].toUpperCase();

    if (type === 'G') {
      return await greekConcordance.getUniqueBooks(strongsNum);
    } else if (type === 'H') {
      return await hebrewConcordance.getUniqueBooks(strongsNum);
    }

    return [];
  } catch (error) {
    console.error(`Error getting book distribution for ${strongsNum}:`, error);
    return [];
  }
}

export default {
  lookupWordStudy,
  getMorphology,
  searchLexicon,
  getUsageExamples,
  getFrequency,
  getBookDistribution
};
