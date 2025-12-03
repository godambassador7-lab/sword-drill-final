/**
 * Simplified Mode Service
 * Modernizes public domain Bible translations by:
 * - Removing archaic pronouns (thee, thou, thy, thine, ye)
 * - Modernizing verb forms (-eth, -est endings)
 * - Replacing archaic words with modern equivalents
 * - Converting "Jehovah" to "LORD" (ASV compatibility)
 *
 * This is 100% legal - we're only modifying public domain text
 */

// Archaic pronoun replacements
const PRONOUN_MAP = {
  // Subject pronouns
  'thou': 'you',
  'ye': 'you',

  // Object pronouns
  'thee': 'you',

  // Possessive pronouns
  'thy': 'your',
  'thine': 'your',

  // Reflexive
  'thyself': 'yourself',
};

// Archaic verb endings
const VERB_PATTERNS = [
  // -eth endings (he doeth -> he does)
  { pattern: /(\w+)eth\b/gi, replacement: (match, stem) => {
    // Common irregular verbs
    const irregulars = {
      'do': 'does',
      'go': 'goes',
      'have': 'has',
      'say': 'says',
    };
    const lower = stem.toLowerCase();
    if (irregulars[lower]) return irregulars[lower];
    // Regular verbs: add 's'
    if (lower.endsWith('s') || lower.endsWith('sh') || lower.endsWith('ch') ||
        lower.endsWith('x') || lower.endsWith('z')) {
      return stem + 'es';
    }
    return stem + 's';
  }},

  // -est endings (thou goest -> you go)
  { pattern: /(\w+)est\b/gi, replacement: (match, stem) => stem },

  // -edst endings (thou lovedst -> you loved)
  { pattern: /(\w+)edst\b/gi, replacement: (match, stem) => stem + 'ed' },
];

// Archaic word replacements
const ARCHAIC_WORDS = {
  'hath': 'has',
  'doth': 'does',
  'saith': 'says',
  'spake': 'spoke',
  'brake': 'broke',
  'begat': 'fathered',
  'begot': 'fathered',
  'shalt': 'shall',
  'wilt': 'will',
  'shouldest': 'should',
  'wouldest': 'would',
  'canst': 'can',
  'mayest': 'may',
  'mightest': 'might',
  'unto': 'to',
  'verily': 'truly',
  'behold': 'look',
  'lo': 'look',
  'yea': 'yes',
  'nay': 'no',
  'whence': 'where from',
  'whither': 'where',
  'thither': 'there',
  'hither': 'here',
  'whilst': 'while',
  'amongst': 'among',
  'betwixt': 'between',
};

// Divine name replacements (for ASV)
const DIVINE_NAMES = {
  'Jehovah': 'LORD',
  'JEHOVAH': 'LORD',
};

/**
 * Simplify/modernize verse text
 * @param {string} text - Original verse text
 * @param {string} translation - Translation code (KJV, ASV, etc.)
 * @returns {string} Modernized text
 */
export function simplifyText(text, translation = 'KJV') {
  if (!text) return text;

  let simplified = text;

  // Step 1: Replace divine names (especially for ASV)
  if (translation.toUpperCase() === 'ASV') {
    Object.entries(DIVINE_NAMES).forEach(([archaic, modern]) => {
      const regex = new RegExp(`\\b${archaic}\\b`, 'g');
      simplified = simplified.replace(regex, modern);
    });
  }

  // Step 2: Replace archaic pronouns (case-insensitive but preserve capitalization)
  Object.entries(PRONOUN_MAP).forEach(([archaic, modern]) => {
    // Match whole words only, preserve case
    const regex = new RegExp(`\\b${archaic}\\b`, 'gi');
    simplified = simplified.replace(regex, (match) => {
      // If original was capitalized, capitalize replacement
      if (match[0] === match[0].toUpperCase()) {
        return modern.charAt(0).toUpperCase() + modern.slice(1);
      }
      return modern;
    });
  });

  // Step 3: Replace archaic words
  Object.entries(ARCHAIC_WORDS).forEach(([archaic, modern]) => {
    const regex = new RegExp(`\\b${archaic}\\b`, 'gi');
    simplified = simplified.replace(regex, (match) => {
      // Preserve case
      if (match[0] === match[0].toUpperCase()) {
        return modern.charAt(0).toUpperCase() + modern.slice(1);
      }
      return modern;
    });
  });

  // Step 4: Handle verb endings
  VERB_PATTERNS.forEach(({ pattern, replacement }) => {
    simplified = simplified.replace(pattern, replacement);
  });

  // Step 5: Clean up any double spaces
  simplified = simplified.replace(/\s+/g, ' ').trim();

  return simplified;
}

/**
 * Get translation style description
 * Maps free translations to their reading style
 */
export const TRANSLATION_STYLES = {
  KJV: {
    name: 'King James Version',
    style: 'Traditional Formal',
    comparable: 'Similar formality to NKJV/ESV',
    year: '1611',
    description: 'Majestic, literary English with archaic pronouns'
  },
  ASV: {
    name: 'American Standard Version',
    style: 'Literal/Formal',
    comparable: 'Similar approach to NASB/ESV',
    year: '1901',
    description: 'Word-for-word accuracy with some archaic language'
  },
  WEB: {
    name: 'World English Bible',
    style: 'Balanced/Modern',
    comparable: 'Similar readability to NIV',
    year: '2000',
    description: 'Modern English, updated from ASV'
  },
  YLT: {
    name: "Young's Literal Translation",
    style: 'Very Literal',
    comparable: 'Most literal available',
    year: '1862',
    description: 'Preserves Hebrew/Greek word order'
  },
  BISHOPS: {
    name: "Bishops' Bible",
    style: 'Traditional',
    comparable: 'Pre-KJV formal style',
    year: '1568',
    description: 'Precursor to KJV, formal Tudor English'
  },
  GENEVA: {
    name: 'Geneva Bible',
    style: 'Traditional',
    comparable: 'Similar era to KJV',
    year: '1560',
    description: 'First Bible with verse numbers, used by Pilgrims'
  }
};

/**
 * Get comparison label for translation
 */
export function getComparisonLabel(translationCode) {
  const info = TRANSLATION_STYLES[translationCode?.toUpperCase()];
  if (!info) return '';
  return info.comparable;
}

/**
 * Check if simplified mode is recommended for this translation
 */
export function isSimplificationRecommended(translationCode) {
  const archaic = ['KJV', 'ASV', 'YLT', 'BISHOPS', 'GENEVA'];
  return archaic.includes(translationCode?.toUpperCase());
}

export default {
  simplifyText,
  getComparisonLabel,
  isSimplificationRecommended,
  TRANSLATION_STYLES
};
