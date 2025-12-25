/**
 * Dictionary Provider for RAG System
 * Provides semantic search over Smith's Bible Dictionary and Webster's 1913
 */

import { lookupDefinition, searchDefinitionsPrefix, searchDefinitionsFuzzy } from '../dictionaryProvider';

/**
 * Search dictionary entries based on query terms
 * @param {string|Array} terms - Search term(s)
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of definition objects
 */
export async function searchDictionary(terms, options = {}) {
  const { limit = 5 } = options;

  // Normalize terms to array
  const termArray = Array.isArray(terms) ? terms : [terms];

  const results = [];
  const seen = new Set();

  for (const term of termArray) {
    if (!term || term.length < 3) continue;

    try {
      // Try exact lookup first
      const exact = await lookupDefinition(term);
      if (exact && !seen.has(exact.headword)) {
        results.push({
          headword: exact.headword,
          definition: exact.def,
          pos: exact.pos,
          source: exact.src || 'UNKNOWN'
        });
        seen.add(exact.headword);
      }

      // If we need more results, try prefix match
      if (results.length < limit) {
        const prefixMatches = await searchDefinitionsPrefix(term, limit - results.length);
        for (const match of prefixMatches) {
          if (match && !seen.has(match.headword)) {
            results.push({
              headword: match.headword,
              definition: match.def,
              pos: match.pos,
              source: match.src || 'UNKNOWN'
            });
            seen.add(match.headword);
          }
        }
      }

      // If still need more, try fuzzy search
      if (results.length < limit) {
        const fuzzyMatches = await searchDefinitionsFuzzy(term, limit - results.length);
        for (const match of fuzzyMatches) {
          if (match && !seen.has(match.headword)) {
            results.push({
              headword: match.headword,
              definition: match.def,
              pos: match.pos,
              source: match.src || 'UNKNOWN'
            });
            seen.add(match.headword);
          }
        }
      }
    } catch (error) {
      console.warn(`Error searching for term: ${term}`, error);
    }

    // Stop if we have enough results
    if (results.length >= limit) break;
  }

  return results.slice(0, limit);
}

/**
 * Get dictionary entry by exact term
 * @param {string} term - Term to look up
 * @returns {Promise<Object|null>} Dictionary entry or null
 */
export async function getDictionaryEntry(term) {
  try {
    const result = await lookupDefinition(term);
    if (!result) return null;

    return {
      headword: result.headword,
      definition: result.def,
      pos: result.pos,
      source: result.src || 'UNKNOWN'
    };
  } catch (error) {
    console.error(`Error getting dictionary entry for: ${term}`, error);
    return null;
  }
}

export default { searchDictionary, getDictionaryEntry };
