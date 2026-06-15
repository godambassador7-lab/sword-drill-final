/**
 * RAG (Retrieval-Augmented Generation) Orchestrator for SHARP Assistant
 * Coordinates parallel retrieval from multiple reference sources
 */

import { searchLocalVerses, getVerseByReference } from './retrieval/bibleProvider';
import { searchDictionary } from './retrieval/dictionaryProvider';
import { lookupWordStudy } from './retrieval/lexiconProvider';
import { getCrossReferences } from './retrieval/crossRefsProvider';
import { contextCache } from './cache';
import { BIBLE_BOOKS } from '../../data/bibleBooks';
import { isApocryphaBook } from './retrieval/apocryphaProvider';

/**
 * Orchestrate retrieval from multiple sources based on question classification
 * @param {string} query - User's question
 * @param {Object} classification - Question classification
 * @param {Object} context - Additional context (user preferences, etc.)
 * @returns {Promise<Object>} Retrieved context from all sources
 */
export async function orchestrateRetrieval(query, classification, context = {}) {
  // Check cache first
  const cached = contextCache.get(query, classification);
  if (cached) {
    console.log('Using cached context for query');
    return cached;
  }

  // Create retrieval plan based on classification
  const plan = createRetrievalPlan(classification, query);

  console.log('Retrieval plan:', plan);

  // Execute retrievals in parallel
  const results = await Promise.all([
    // Always retrieve Bible verses (core of biblical questions)
    retrieveBibleVerses(query, context, plan),

    // Conditional retrievals based on plan
    plan.needsDictionary ? retrieveDictionary(query, plan) : Promise.resolve(null),
    plan.needsLexicon ? retrieveLexicon(query, plan) : Promise.resolve(null),
    plan.needsCrossRefs ? retrieveCrossReferences(query, context, plan) : Promise.resolve(null)
  ]);

  // Assemble results
  const retrievedContext = {
    verses: results[0] || [],
    definitions: results[1] || [],
    lexicon: results[2] || [],
    crossRefs: results[3] || []
  };

  // Rank and filter results
  const rankedContext = rankAndFilterResults(retrievedContext, query, classification);

  // Cache for future use
  contextCache.set(query, classification, rankedContext);

  return rankedContext;
}

/**
 * Create retrieval plan based on question classification
 * @param {Object} classification - Question classification
 * @param {string} query - User's question
 * @returns {Object} Retrieval plan
 */
function createRetrievalPlan(classification, query) {
  const plan = {
    needsDictionary: false,
    needsLexicon: false,
    needsCrossRefs: false,
    maxVerses: 5,
    maxDefinitions: 3,
    maxLexiconEntries: 2,
    maxCrossRefs: 3,
    bookName: null  // Add bookName field for book-specific queries
  };

  if (!classification) return plan;

  const { category, subcategory } = classification;

  // SPECIAL: Detect single-word book name queries
  const trimmedQuery = query.trim();
  const isSingleWord = !trimmedQuery.includes(' ') && trimmedQuery.length > 2;

  if (isSingleWord) {
    // Check canonical books
    const bookMatch = BIBLE_BOOKS.find(book =>
      book.toLowerCase() === trimmedQuery.toLowerCase()
    );

    if (bookMatch) {
      plan.bookName = bookMatch;  // Store book name for special retrieval
      plan.needsDictionary = true;  // Get book overview from dictionary
      plan.maxDefinitions = 1;
      plan.maxVerses = 3;  // Show key verses FROM this book
      return plan;  // Return early with book-specific plan
    }

    // Check Apocrypha books
    if (isApocryphaBook(trimmedQuery)) {
      plan.bookName = trimmedQuery;  // Store apocrypha book name
      plan.isApocrypha = true;  // Flag as apocrypha
      plan.needsDictionary = true;  // Get book overview from dictionary
      plan.maxDefinitions = 1;
      plan.maxVerses = 3;  // Show key verses FROM this apocrypha book
      return plan;  // Return early with apocrypha book plan
    }
  }

  // WHO questions -> Dictionary + verses
  if (subcategory === 'who') {
    plan.needsDictionary = true;
    plan.maxDefinitions = 1; // Just the biographical entry
    plan.maxVerses = 5; // Key passages featuring the person
  }

  // WHAT questions (definitions) -> Dictionary + lexicon
  if (subcategory === 'what_definition' || subcategory === 'define') {
    plan.needsDictionary = true;
    plan.needsLexicon = true;
    plan.maxDefinitions = 2;
    plan.maxLexiconEntries = 2;
  }

  // Language questions -> Lexicon primary with concordance
  if (subcategory === 'language' || category === 'scripture' && query.match(/greek|hebrew|original|word/i)) {
    plan.needsLexicon = true;
    plan.maxLexiconEntries = 1; // Focus on single primary word
    plan.maxVerses = 8; // More usage examples from concordance
    plan.includeConcordance = true; // Use concordance for frequency/examples
  }

  // Interpretation questions -> Full context
  if (subcategory === 'interpretation' || subcategory === 'context') {
    plan.needsCrossRefs = true;
    plan.needsLexicon = true;
    plan.maxCrossRefs = 5;
    plan.maxVerses = 6;
  }

  // Theological questions -> Broad retrieval
  if (category === 'theology') {
    plan.needsDictionary = true;
    plan.needsCrossRefs = true;
    plan.maxDefinitions = 2;
    plan.maxCrossRefs = 6;
    plan.maxVerses = 8;
  }

  // Comparison questions -> More verses
  if (subcategory === 'compare_translations' || query.match(/compare|different|version/i)) {
    plan.maxVerses = 3; // Same verse in multiple translations
  }

  // WHERE questions (locations) -> Dictionary for place names
  if (subcategory === 'where') {
    plan.needsDictionary = true;
    plan.maxDefinitions = 1;
  }

  return plan;
}

/**
 * Retrieve Bible verses relevant to query
 * @param {string} query - User's question
 * @param {Object} context - Context including preferred translation
 * @param {Object} plan - Retrieval plan
 * @returns {Promise<Array>} Array of verse objects
 */
async function retrieveBibleVerses(query, context, plan) {
  try {
    const translation = context.selectedTranslation || 'ESV';

    // SPECIAL: If query is for a specific book, retrieve verses FROM that book
    if (plan.bookName) {
      // Handle Apocrypha books
      if (plan.isApocrypha) {
        const verses = await retrieveKeyVersesFromApocrypha(plan.bookName, plan.maxVerses);
        return verses || [];
      }

      // Handle canonical books
      const verses = await retrieveKeyVersesFromBook(plan.bookName, translation, plan.maxVerses);
      return verses || [];
    }

    // Use existing bible provider
    const verses = await searchLocalVerses(query, {
      selectedTranslation: translation,
      limit: plan.maxVerses,
      verseHistory: context.verseHistory || []
    });

    return verses || [];
  } catch (error) {
    console.error('Error retrieving Bible verses:', error);
    return [];
  }
}

/**
 * Retrieve key verses from a specific book
 * @param {string} bookName - Name of the biblical book
 * @param {string} translation - Bible translation
 * @param {number} maxVerses - Maximum number of verses to retrieve
 * @returns {Promise<Array>} Array of key verses from the book
 */
async function retrieveKeyVersesFromBook(bookName, translation, maxVerses = 3) {
  try {
    // Define key verse references for important books
    const keyVerses = {
      'Esther': ['Esther 4:14', 'Esther 2:17', 'Esther 7:3-4'],
      'Ruth': ['Ruth 1:16', 'Ruth 4:13-14', 'Ruth 2:12'],
      'John': ['John 1:1', 'John 3:16', 'John 14:6'],
      'Genesis': ['Genesis 1:1', 'Genesis 1:27', 'Genesis 12:1-3'],
      'Psalms': ['Psalm 23:1', 'Psalm 119:105', 'Psalm 46:1'],
      'Proverbs': ['Proverbs 3:5-6', 'Proverbs 16:3', 'Proverbs 22:6'],
      'Isaiah': ['Isaiah 53:5', 'Isaiah 40:31', 'Isaiah 9:6'],
      'Romans': ['Romans 3:23', 'Romans 6:23', 'Romans 8:28'],
      'Ephesians': ['Ephesians 2:8-9', 'Ephesians 6:10', 'Ephesians 4:32'],
      'Philippians': ['Philippians 4:13', 'Philippians 4:6-7', 'Philippians 2:3-4'],
      'Revelation': ['Revelation 21:4', 'Revelation 1:8', 'Revelation 22:13']
    };

    // Get predefined key verses or generate from chapter 1
    const references = keyVerses[bookName] || [`${bookName} 1:1`, `${bookName} 1:2`, `${bookName} 1:3`];

    // Fetch the verses
    const verses = [];
    for (const ref of references.slice(0, maxVerses)) {
      try {
        const verse = getVerseByReference(ref, translation);
        if (verse) {
          verses.push({
            reference: verse.reference || ref,
            text: verse.text,
            book: bookName,
            chapter: verse.chapter || parseInt(ref.split(':')[0].split(' ').pop()),
            verse: verse.verse || parseInt(ref.split(':')[1]),
            translation: verse.translation || translation
          });
        }
      } catch (err) {
        console.error(`Error fetching verse ${ref}:`, err);
      }
    }

    return verses;
  } catch (error) {
    console.error(`Error retrieving key verses from ${bookName}:`, error);
    return [];
  }
}

/**
 * Retrieve key verses from an Apocrypha book
 * @param {string} bookName - Name of the apocryphal book
 * @param {number} maxVerses - Maximum number of verses to retrieve
 * @returns {Promise<Array>} Array of key verses from the apocrypha book
 */
async function retrieveKeyVersesFromApocrypha(bookName, maxVerses = 3) {
  return [];
}

/**
 * Retrieve dictionary definitions
 * @param {string} query - User's question
 * @param {Object} plan - Retrieval plan
 * @returns {Promise<Array>} Array of definition objects
 */
async function retrieveDictionary(query, plan) {
  try {
    // Extract key terms from query
    const terms = extractKeyTerms(query);

    const definitions = await searchDictionary(terms, {
      limit: plan.maxDefinitions
    });

    return definitions || [];
  } catch (error) {
    console.error('Error retrieving dictionary entries:', error);
    return [];
  }
}

/**
 * Retrieve lexicon/word study data
 * @param {string} query - User's question
 * @param {Object} plan - Retrieval plan
 * @returns {Promise<Array>} Array of lexicon entries
 */
async function retrieveLexicon(query, plan) {
  try {
    // Extract potential Greek/Hebrew terms or English words to look up
    const terms = extractKeyTerms(query);

    const lexiconData = [];

    for (const term of terms.slice(0, plan.maxLexiconEntries)) {
      try {
        const entry = await lookupWordStudy(term);
        if (entry) {
          lexiconData.push(entry);
        }
      } catch (err) {
        console.warn(`Failed to lookup word: ${term}`, err);
      }
    }

    return lexiconData;
  } catch (error) {
    console.error('Error retrieving lexicon data:', error);
    return [];
  }
}

/**
 * Retrieve cross-references for verses
 * @param {string} query - User's question
 * @param {Object} context - Context
 * @param {Object} plan - Retrieval plan
 * @returns {Promise<Array>} Array of cross-reference objects
 */
async function retrieveCrossReferences(query, context, plan) {
  try {
    // First get primary verses
    const primaryVerses = await retrieveBibleVerses(query, context, { maxVerses: 2 });

    if (!primaryVerses || primaryVerses.length === 0) {
      return [];
    }

    // Get cross-references for primary verses
    const crossRefs = [];

    for (const verse of primaryVerses) {
      try {
        const refs = await getCrossReferences(verse.reference, {
          limit: plan.maxCrossRefs
        });

        if (refs && refs.length > 0) {
          crossRefs.push(...refs);
        }
      } catch (err) {
        console.warn(`Failed to get cross-refs for ${verse.reference}`, err);
      }
    }

    // Deduplicate and limit
    const uniqueRefs = deduplicateByReference(crossRefs).slice(0, plan.maxCrossRefs);

    return uniqueRefs;
  } catch (error) {
    console.error('Error retrieving cross-references:', error);
    return [];
  }
}

/**
 * Extract key terms from query for dictionary/lexicon lookup
 * @param {string} query - User's question
 * @returns {Array} Array of key terms
 */
function extractKeyTerms(query) {
  // Remove common question words
  const cleaned = query.replace(/\b(who|what|when|where|why|how|is|are|was|were|the|a|an|in|on|at|to|for|of|about|does|did|do)\b/gi, '');

  // Split into words and filter
  const words = cleaned.split(/\s+/).filter(word =>
    word.length > 2 && // At least 3 characters
    !/^\d+$/.test(word) && // Not just numbers
    !/^[^a-zA-Z]+$/.test(word) // Contains letters
  );

  // Capitalize first letter for proper nouns (likely names/places)
  const terms = words.map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  // Remove duplicates
  return [...new Set(terms)];
}

/**
 * Rank and filter results by relevance
 * @param {Object} retrievedContext - All retrieved results
 * @param {string} query - Original query
 * @param {Object} classification - Question classification
 * @returns {Object} Ranked and filtered results
 */
function rankAndFilterResults(retrievedContext, query, classification) {
  // For now, return as-is
  // In future, could implement relevance scoring and filtering

  return {
    verses: retrievedContext.verses.slice(0, 8), // Limit total verses
    definitions: retrievedContext.definitions.slice(0, 3),
    lexicon: retrievedContext.lexicon.slice(0, 3),
    crossRefs: retrievedContext.crossRefs.slice(0, 5)
  };
}

/**
 * Deduplicate verses/references by reference string
 * @param {Array} items - Array of verse/reference objects
 * @returns {Array} Deduplicated array
 */
function deduplicateByReference(items) {
  const seen = new Set();

  return items.filter(item => {
    const ref = item.reference || item.ref;
    if (seen.has(ref)) {
      return false;
    }
    seen.add(ref);
    return true;
  });
}
