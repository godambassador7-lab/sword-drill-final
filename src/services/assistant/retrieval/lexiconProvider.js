/**
 * Lexicon Provider for RAG System
 * Provides Greek and Hebrew word study data from Strong's Concordance
 */

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
    // Load the appropriate dictionary
    const dictPath = type === 'G'
      ? '/data/strongs-master/strongs-master/greek/strongs-greek-dictionary.js'
      : '/data/strongs-master/strongs-master/hebrew/strongs-hebrew-dictionary.js';

    // This is a placeholder - in real implementation, you would load from your data source
    // For now, return a structured placeholder
    return {
      strongs: `${type}${number}`,
      word: `[${type === 'G' ? 'Greek' : 'Hebrew'} word for ${type}${number}]`,
      transliteration: `[Transliteration]`,
      pronunciation: `[Pronunciation]`,
      definition: `[Definition from Strong's ${type}${number}]`,
      kjvUsage: `[KJV translation usage]`,
      derivation: `[Etymology and derivation]`,
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
  // Common biblical words mapping (placeholder)
  const commonWords = {
    love: { strongs: 'G26', word: 'ἀγάπη', transliteration: 'agapē', definition: 'love, affection, benevolence', language: 'Greek' },
    faith: { strongs: 'G4102', word: 'πίστις', transliteration: 'pistis', definition: 'faith, belief, trust', language: 'Greek' },
    grace: { strongs: 'G5485', word: 'χάρις', transliteration: 'charis', definition: 'grace, favor, thanks', language: 'Greek' },
    righteousness: { strongs: 'G1343', word: 'δικαιοσύνη', transliteration: 'dikaiosynē', definition: 'righteousness, justice', language: 'Greek' },
    salvation: { strongs: 'G4991', word: 'σωτηρία', transliteration: 'sōtēria', definition: 'salvation, deliverance', language: 'Greek' },
    lord: { strongs: 'H3068', word: 'יְהוָה', transliteration: 'YHWH', definition: 'the proper name of God', language: 'Hebrew' },
    covenant: { strongs: 'H1285', word: 'בְּרִית', transliteration: 'berith', definition: 'covenant, compact, agreement', language: 'Hebrew' }
  };

  const normalized = word.toLowerCase().trim();
  if (commonWords[normalized]) {
    return {
      ...commonWords[normalized],
      kjvUsage: `[KJV usage for "${word}"]`,
      pronunciation: `[Pronunciation]`
    };
  }

  return null;
}

/**
 * Get morphological analysis for a word
 * @param {string} strongsNumber - Strong's number (e.g., "G26")
 * @param {string} morphology - Morphology code
 * @returns {Promise<Object|null>} Morphological data
 */
export async function getMorphology(strongsNumber, morphology) {
  // Placeholder for morphological analysis
  return {
    strongs: strongsNumber,
    code: morphology,
    analysis: '[Morphological parsing would go here]'
  };
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

export default { lookupWordStudy, getMorphology, searchLexicon };
