/**
 * Answer Validation - Core Logic
 * This module contains answer checking and fuzzy matching algorithms.
 * Keep this in a private submodule to prevent answer exploitation.
 */

/**
 * Fuzzy matching for biblical references
 * Handles common variations and normalizes reference formats
 * @param {string} userAnswer - User's submitted answer
 * @param {string} correctAnswer - Correct biblical reference
 * @returns {boolean} True if answers match
 */
export const matchBiblicalReference = (userAnswer, correctAnswer) => {
  const normalizeRef = (ref) => {
    return ref
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/^psalms/i, 'psalm')  // Psalms -> Psalm
      .replace(/^song of solomon/i, 'song')  // Song of Solomon -> Song
      .replace(/^song of songs/i, 'song')  // Song of Songs -> Song
      .replace(/^1\s*samuel/i, '1 samuel')  // Normalize 1Samuel -> 1 Samuel
      .replace(/^2\s*samuel/i, '2 samuel')
      .replace(/^1\s*kings/i, '1 kings')
      .replace(/^2\s*kings/i, '2 kings')
      .replace(/^1\s*chronicles/i, '1 chronicles')
      .replace(/^2\s*chronicles/i, '2 chronicles')
      .replace(/^1\s*corinthians/i, '1 corinthians')
      .replace(/^2\s*corinthians/i, '2 corinthians')
      .replace(/^1\s*thessalonians/i, '1 thessalonians')
      .replace(/^2\s*thessalonians/i, '2 thessalonians')
      .replace(/^1\s*timothy/i, '1 timothy')
      .replace(/^2\s*timothy/i, '2 timothy')
      .replace(/^1\s*peter/i, '1 peter')
      .replace(/^2\s*peter/i, '2 peter')
      .replace(/^1\s*john/i, '1 john')
      .replace(/^2\s*john/i, '2 john')
      .replace(/^3\s*john/i, '3 john');
  };

  const userNormalized = normalizeRef(userAnswer);
  const correctNormalized = normalizeRef(correctAnswer);

  // Check exact match after normalization
  if (userNormalized === correctNormalized) {
    return true;
  }

  // Parse reference into components: book, chapter, verse
  const parseReference = (ref) => {
    // Match patterns like "John 3:16" or "1 John 3:16" or "Psalm 23:1"
    const match = ref.match(/^((?:\d\s+)?[a-z]+)\s+(\d+):(\d+)$/i);
    if (match) {
      return {
        book: match[1].trim(),
        chapter: match[2],
        verse: match[3]
      };
    }
    return null;
  };

  const userParsed = parseReference(userNormalized);
  const correctParsed = parseReference(correctNormalized);

  if (userParsed && correctParsed) {
    // Check if chapter and verse match, and book is similar
    return userParsed.chapter === correctParsed.chapter &&
           userParsed.verse === correctParsed.verse &&
           userParsed.book === correctParsed.book;
  }

  return false;
};

/**
 * Validate fill-in-the-blank answer
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @param {boolean} caseSensitive - Whether to check case
 * @returns {boolean} True if correct
 */
export const validateFillBlank = (userAnswer, correctAnswer, caseSensitive = false) => {
  if (!userAnswer || !correctAnswer) return false;

  // Normalize answers
  const normalize = (str) => {
    let normalized = str.trim();
    // Remove punctuation
    normalized = normalized.replace(/[.,;:!?]/g, '');
    if (!caseSensitive) {
      normalized = normalized.toLowerCase();
    }
    return normalized;
  };

  const userNormalized = normalize(userAnswer);
  const correctNormalized = normalize(correctAnswer);

  return userNormalized === correctNormalized;
};

/**
 * Validate multiple fill-in-the-blank answers
 * @param {Array} userAnswers - Array of user's answers
 * @param {Array} correctAnswers - Array of correct answers
 * @param {boolean} caseSensitive - Whether to check case
 * @returns {Object} { isCorrect: boolean, correctCount: number, totalCount: number }
 */
export const validateMultipleFillBlanks = (userAnswers, correctAnswers, caseSensitive = false) => {
  if (!Array.isArray(userAnswers) || !Array.isArray(correctAnswers)) {
    return { isCorrect: false, correctCount: 0, totalCount: correctAnswers?.length || 0 };
  }

  if (userAnswers.length !== correctAnswers.length) {
    return { isCorrect: false, correctCount: 0, totalCount: correctAnswers.length };
  }

  let correctCount = 0;
  for (let i = 0; i < userAnswers.length; i++) {
    if (validateFillBlank(userAnswers[i], correctAnswers[i], caseSensitive)) {
      correctCount++;
    }
  }

  return {
    isCorrect: correctCount === correctAnswers.length,
    correctCount,
    totalCount: correctAnswers.length
  };
};

/**
 * Validate multiple choice answer
 * @param {string|number} userAnswer - User's selected option
 * @param {string|number} correctAnswer - Correct option
 * @returns {boolean} True if correct
 */
export const validateMultipleChoice = (userAnswer, correctAnswer) => {
  // Handle both string and numeric answers
  return String(userAnswer).trim() === String(correctAnswer).trim();
};

/**
 * Calculate similarity score between two strings (0-1)
 * Used for partial credit or hints
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score between 0 and 1
 */
export const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;

  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;

  // Simple character-based similarity
  const maxLen = Math.max(s1.length, s2.length);
  let matches = 0;

  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] === s2[i]) matches++;
  }

  return matches / maxLen;
};

/**
 * Check if answer is close enough for a hint
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @param {number} threshold - Similarity threshold (0-1)
 * @returns {boolean} True if close enough
 */
export const isCloseAnswer = (userAnswer, correctAnswer, threshold = 0.7) => {
  const similarity = calculateSimilarity(userAnswer, correctAnswer);
  return similarity >= threshold;
};

export default {
  matchBiblicalReference,
  validateFillBlank,
  validateMultipleFillBlanks,
  validateMultipleChoice,
  calculateSimilarity,
  isCloseAnswer
};
