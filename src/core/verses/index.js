/**
 * Verse Selection - Core Logic
 * This module contains verse pool management and daily verse selection.
 * Keep this in a private submodule to protect content strategy.
 */

import { DAILY_VERSES_POOL } from '../../dailyVerses';

// Default fallback verse
export const DEFAULT_VERSE_FALLBACK = {
  id: 'John 3:16',
  reference: 'John 3:16',
  text: 'For God so loved the world...',
  translation: 'KJV'
};

// Verse database for daily rotation
export const VERSE_DATABASE = DAILY_VERSES_POOL;

/**
 * Get verse of the day based on current date
 * Uses day of year to rotate through verse pool
 * @param {Date} date - Date to get verse for (defaults to today)
 * @returns {Object} Verse object { id, reference, text, translation }
 */
export const getDailyVerse = (date = new Date()) => {
  try {
    // Calculate day of year
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Select verse based on day of year (cycles through pool)
    const verseIndex = dayOfYear % VERSE_DATABASE.length;
    return VERSE_DATABASE[verseIndex] || DEFAULT_VERSE_FALLBACK;
  } catch (error) {
    console.error('Error getting daily verse:', error);
    return DEFAULT_VERSE_FALLBACK;
  }
};

/**
 * Get a random verse from the pool
 * @param {Array} excludeReferences - Array of references to exclude
 * @returns {Object} Verse object
 */
export const getRandomVerse = (excludeReferences = []) => {
  try {
    // Filter out excluded verses
    const availableVerses = VERSE_DATABASE.filter(
      verse => !excludeReferences.includes(verse.reference)
    );

    if (availableVerses.length === 0) {
      return DEFAULT_VERSE_FALLBACK;
    }

    // Select random verse
    const randomIndex = Math.floor(Math.random() * availableVerses.length);
    return availableVerses[randomIndex];
  } catch (error) {
    console.error('Error getting random verse:', error);
    return DEFAULT_VERSE_FALLBACK;
  }
};

/**
 * Get verse by specific reference
 * @param {string} reference - Biblical reference (e.g., "John 3:16")
 * @returns {Object|null} Verse object or null if not found
 */
export const getVerseByReference = (reference) => {
  try {
    const verse = VERSE_DATABASE.find(v => v.reference === reference);
    return verse || null;
  } catch (error) {
    console.error('Error getting verse by reference:', error);
    return null;
  }
};

/**
 * Get multiple random verses
 * @param {number} count - Number of verses to get
 * @param {Array} excludeReferences - References to exclude
 * @returns {Array} Array of verse objects
 */
export const getRandomVerses = (count, excludeReferences = []) => {
  try {
    const verses = [];
    const usedReferences = [...excludeReferences];

    for (let i = 0; i < count; i++) {
      const verse = getRandomVerse(usedReferences);
      verses.push(verse);
      usedReferences.push(verse.reference);
    }

    return verses;
  } catch (error) {
    console.error('Error getting random verses:', error);
    return [DEFAULT_VERSE_FALLBACK];
  }
};

/**
 * Check if a verse is in the database
 * @param {string} reference - Biblical reference
 * @returns {boolean} True if verse exists in database
 */
export const verseExists = (reference) => {
  return VERSE_DATABASE.some(v => v.reference === reference);
};

/**
 * Get total number of verses in database
 * @returns {number} Total verse count
 */
export const getTotalVerseCount = () => {
  return VERSE_DATABASE.length;
};

/**
 * Get verse pool statistics
 * @returns {Object} Statistics about the verse pool
 */
export const getVersePoolStats = () => {
  const books = new Set();
  const translations = new Set();

  VERSE_DATABASE.forEach(verse => {
    // Extract book name from reference
    const bookMatch = verse.reference.match(/^([123]?\s*[A-Za-z]+)/);
    if (bookMatch) {
      books.add(bookMatch[1].trim());
    }
    translations.add(verse.translation);
  });

  return {
    totalVerses: VERSE_DATABASE.length,
    uniqueBooks: books.size,
    translations: Array.from(translations),
    booksRepresented: Array.from(books).sort()
  };
};

export default {
  DEFAULT_VERSE_FALLBACK,
  VERSE_DATABASE,
  getDailyVerse,
  getRandomVerse,
  getVerseByReference,
  getRandomVerses,
  verseExists,
  getTotalVerseCount,
  getVersePoolStats
};
