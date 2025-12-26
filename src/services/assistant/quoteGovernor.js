/**
 * Quote Length Governor
 * Manages verse quotation length to keep responses readable
 * Clips long passages with ellipses and provides "show more" hints
 */

// Configuration
const QUOTE_LIMITS = {
  singleVerse: 300,        // Max characters for single verse
  multiVerse: 500,         // Max characters for verse range
  verseRange: 5,           // Max verses to show in full
  contextPreview: 150      // Characters for context snippets
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateWithEllipsis(text, maxLength) {
  if (!text || text.length <= maxLength) return text;

  // Try to break at sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastComma = truncated.lastIndexOf(',');

  // Break at sentence if within 50 chars of limit
  if (lastPeriod > maxLength - 50) {
    return text.substring(0, lastPeriod + 1);
  }

  // Break at comma if within 30 chars of limit
  if (lastComma > maxLength - 30) {
    return text.substring(0, lastComma + 1) + '...';
  }

  // Otherwise break at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) {
    return text.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Govern single verse quotation
 * @param {Object} verse - Verse object with text, reference
 * @returns {Object} Governed verse with clipped flag
 */
export function governSingleVerse(verse) {
  if (!verse || !verse.text) return verse;

  const governed = { ...verse };

  if (verse.text.length > QUOTE_LIMITS.singleVerse) {
    governed.text = truncateWithEllipsis(verse.text, QUOTE_LIMITS.singleVerse);
    governed.clipped = true;
    governed.originalLength = verse.text.length;
  } else {
    governed.clipped = false;
  }

  return governed;
}

/**
 * Govern verse range quotation
 * @param {Array} verses - Array of verse objects
 * @returns {Object} Governed result with verses and metadata
 */
export function governVerseRange(verses) {
  if (!verses || verses.length === 0) {
    return { verses: [], clipped: false };
  }

  const result = {
    verses: [],
    clipped: false,
    totalVerses: verses.length,
    shownVerses: 0,
    hiddenVerses: 0
  };

  // If range is small, show all verses (with individual governing)
  if (verses.length <= QUOTE_LIMITS.verseRange) {
    result.verses = verses.map(v => governSingleVerse(v));
    result.shownVerses = verses.length;
    result.clipped = result.verses.some(v => v.clipped);
    return result;
  }

  // For long ranges, show first few verses
  const shownCount = QUOTE_LIMITS.verseRange;
  result.verses = verses.slice(0, shownCount).map(v => governSingleVerse(v));
  result.shownVerses = shownCount;
  result.hiddenVerses = verses.length - shownCount;
  result.clipped = true;

  // Add summary of hidden verses
  result.hiddenSummary = `${result.hiddenVerses} more verses in this passage`;

  return result;
}

/**
 * Govern multi-verse concatenated text
 * @param {Array} verses - Array of verse objects
 * @returns {Object} Governed result with combined text
 */
export function governCombinedVerses(verses) {
  if (!verses || verses.length === 0) {
    return { text: '', clipped: false };
  }

  // Combine all verse texts
  const combinedText = verses.map(v => v.text).join(' ');

  const result = {
    text: combinedText,
    clipped: false,
    totalVerses: verses.length,
    originalLength: combinedText.length
  };

  // Check if combined text exceeds limit
  if (combinedText.length > QUOTE_LIMITS.multiVerse) {
    result.text = truncateWithEllipsis(combinedText, QUOTE_LIMITS.multiVerse);
    result.clipped = true;
  }

  return result;
}

/**
 * Create context snippet from verse
 * @param {Object} verse - Verse object
 * @returns {string} Short context preview
 */
export function createContextSnippet(verse) {
  if (!verse || !verse.text) return '';

  return truncateWithEllipsis(verse.text, QUOTE_LIMITS.contextPreview);
}

/**
 * Format governed verse for display
 * @param {Object} governedVerse - Verse from governSingleVerse
 * @param {boolean} showMetadata - Whether to show clip indicator
 * @returns {string} Formatted verse
 */
export function formatGovernedVerse(governedVerse, showMetadata = true) {
  if (!governedVerse) return '';

  let output = `> ${governedVerse.text}\n`;

  if (showMetadata && governedVerse.clipped) {
    const saved = governedVerse.originalLength - governedVerse.text.length;
    output += `\n*[${saved} characters clipped - read full verse in Bible Reader]*\n`;
  }

  return output;
}

/**
 * Format governed verse range for display
 * @param {Object} governedRange - Result from governVerseRange
 * @param {string} startRef - Starting reference (e.g., "John 3:1")
 * @param {string} endRef - Ending reference (e.g., "John 3:21")
 * @returns {string} Formatted range
 */
export function formatGovernedRange(governedRange, startRef, endRef) {
  if (!governedRange || governedRange.verses.length === 0) return '';

  let output = '';

  // Show governed verses
  governedRange.verses.forEach((verse, idx) => {
    output += `**${verse.reference || `${startRef}-${idx + 1}`}**: ${verse.text}\n\n`;
  });

  // Add "show more" indicator if clipped
  if (governedRange.clipped) {
    if (governedRange.hiddenVerses > 0) {
      output += `\n📖 *[${governedRange.hiddenVerses} more verses - read full pericope ${startRef}-${endRef} in Bible Reader]*\n`;
    } else {
      output += `\n📖 *[Some verses clipped - read full text in Bible Reader]*\n`;
    }
  }

  return output;
}

/**
 * Decide whether to quote in full or provide snippet
 * @param {Array} verses - Verses to potentially quote
 * @param {string} context - Context of usage ('answer', 'example', 'related')
 * @returns {Object} Decision with recommendation
 */
export function quoteDecision(verses, context = 'answer') {
  if (!verses || verses.length === 0) {
    return { recommendation: 'none', reason: 'No verses provided' };
  }

  const totalChars = verses.reduce((sum, v) => sum + (v.text?.length || 0), 0);
  const verseCount = verses.length;

  // Context-specific thresholds
  const thresholds = {
    answer: { verses: 3, chars: 400 },
    example: { verses: 1, chars: 150 },
    related: { verses: 2, chars: 250 }
  };

  const threshold = thresholds[context] || thresholds.answer;

  // Decision logic
  if (verseCount === 1) {
    if (totalChars <= QUOTE_LIMITS.singleVerse) {
      return { recommendation: 'full', reason: 'Single verse within limit' };
    } else {
      return { recommendation: 'truncate', reason: 'Single verse too long', maxChars: QUOTE_LIMITS.singleVerse };
    }
  }

  if (verseCount <= threshold.verses && totalChars <= threshold.chars) {
    return { recommendation: 'full', reason: `${verseCount} verses within ${context} limit` };
  }

  if (verseCount <= QUOTE_LIMITS.verseRange && totalChars <= QUOTE_LIMITS.multiVerse) {
    return { recommendation: 'governed', reason: 'Moderate range, use governing' };
  }

  return {
    recommendation: 'snippet',
    reason: `${verseCount} verses (${totalChars} chars) exceeds ${context} threshold`,
    suggestCount: threshold.verses
  };
}

/**
 * Apply quote governing based on decision
 * @param {Array} verses - Verses to quote
 * @param {Object} decision - Decision from quoteDecision
 * @returns {Object} Governed result ready for display
 */
export function applyQuoteGovernor(verses, decision) {
  if (!verses || verses.length === 0) {
    return { verses: [], clipped: false, recommendation: 'none' };
  }

  switch (decision.recommendation) {
    case 'full':
      return {
        verses: verses.map(v => ({ ...v, clipped: false })),
        clipped: false,
        recommendation: 'full'
      };

    case 'truncate':
      return {
        verses: [governSingleVerse(verses[0])],
        clipped: true,
        recommendation: 'truncate'
      };

    case 'governed':
      return {
        ...governVerseRange(verses),
        recommendation: 'governed'
      };

    case 'snippet':
      // Show snippets of suggested count
      const snippetCount = decision.suggestCount || 2;
      return {
        verses: verses.slice(0, snippetCount).map(v => ({
          ...v,
          text: createContextSnippet(v),
          clipped: true
        })),
        clipped: true,
        totalVerses: verses.length,
        hiddenVerses: verses.length - snippetCount,
        recommendation: 'snippet'
      };

    default:
      return {
        verses: [],
        clipped: false,
        recommendation: 'none'
      };
  }
}

/**
 * Get configuration values
 * @returns {Object} Current limits
 */
export function getQuoteLimits() {
  return { ...QUOTE_LIMITS };
}

export default {
  governSingleVerse,
  governVerseRange,
  governCombinedVerses,
  createContextSnippet,
  formatGovernedVerse,
  formatGovernedRange,
  quoteDecision,
  applyQuoteGovernor,
  getQuoteLimits
};
