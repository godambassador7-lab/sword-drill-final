/**
 * Context Builder for SHARP Assistant
 * Assembles retrieved reference materials into optimized context for Claude API
 * Manages token limits and prioritizes content based on question type
 */

/**
 * Build context string for Claude API from retrieved materials
 * @param {Object} retrievedContext - Retrieved materials from RAG orchestrator
 * @param {string} query - User's original question
 * @param {number} maxTokens - Maximum tokens to use (default: 100K for Claude)
 * @returns {string} Formatted context string for Claude
 */
export function buildContextForClaude(retrievedContext, query, maxTokens = 100000) {
  const sections = [];

  // Priority 1: Bible verses (always highest priority)
  if (retrievedContext.verses?.length > 0) {
    sections.push({
      priority: 1,
      content: formatVersesSection(retrievedContext.verses),
      tokens: estimateTokens(formatVersesSection(retrievedContext.verses))
    });
  }

  // Priority 2: Dictionary definitions
  if (retrievedContext.definitions?.length > 0) {
    sections.push({
      priority: 2,
      content: formatDefinitionsSection(retrievedContext.definitions),
      tokens: estimateTokens(formatDefinitionsSection(retrievedContext.definitions))
    });
  }

  // Priority 3: Lexical data (Greek/Hebrew)
  if (retrievedContext.lexicon?.length > 0) {
    sections.push({
      priority: 3,
      content: formatLexiconSection(retrievedContext.lexicon),
      tokens: estimateTokens(formatLexiconSection(retrievedContext.lexicon))
    });
  }

  // Priority 4: Cross-references
  if (retrievedContext.crossRefs?.length > 0) {
    sections.push({
      priority: 4,
      content: formatCrossReferencesSection(retrievedContext.crossRefs),
      tokens: estimateTokens(formatCrossReferencesSection(retrievedContext.crossRefs))
    });
  }

  // Assemble sections within token budget
  const contextString = assembleSections(sections, maxTokens);

  return contextString;
}

/**
 * Format Bible verses section
 * @param {Array} verses - Array of verse objects
 * @returns {string} Formatted markdown section
 */
function formatVersesSection(verses) {
  if (!verses || verses.length === 0) return '';

  let section = '## 📖 Bible Verses\n\n';

  verses.forEach(verse => {
    section += `### ${verse.reference} (${verse.translation || 'KJV'})\n\n`;
    section += `> ${verse.text}\n\n`;
  });

  return section;
}

/**
 * Format dictionary definitions section
 * @param {Array} definitions - Array of definition objects
 * @returns {string} Formatted markdown section
 */
function formatDefinitionsSection(definitions) {
  if (!definitions || definitions.length === 0) return '';

  let section = '## 📚 Dictionary Definitions\n\n';

  definitions.forEach(def => {
    const source = def.source === 'SMITHS' ? "Smith's Bible Dictionary" : "Webster's 1913 Dictionary";
    section += `### ${def.headword || def.term} (${source})\n\n`;
    section += `${def.definition || def.def}\n\n`;
  });

  return section;
}

/**
 * Format lexicon/word study section
 * @param {Array} lexiconEntries - Array of lexicon entries
 * @returns {string} Formatted markdown section
 */
function formatLexiconSection(lexiconEntries) {
  if (!lexiconEntries || lexiconEntries.length === 0) return '';

  let section = '## 🔤 Greek & Hebrew Lexicon\n\n';

  lexiconEntries.forEach(entry => {
    section += `### ${entry.word || entry.term}`;

    if (entry.strongs) {
      section += ` (Strong's ${entry.strongs})`;
    }

    section += '\n\n';

    if (entry.transliteration) {
      section += `**Transliteration:** ${entry.transliteration}\n\n`;
    }

    if (entry.pronunciation) {
      section += `**Pronunciation:** ${entry.pronunciation}\n\n`;
    }

    if (entry.definition) {
      section += `**Definition:** ${entry.definition}\n\n`;
    }

    if (entry.kjvUsage) {
      section += `**KJV Usage:** ${entry.kjvUsage}\n\n`;
    }

    if (entry.morphology) {
      section += `**Morphology:** ${entry.morphology}\n\n`;
    }
  });

  return section;
}

/**
 * Format cross-references section
 * @param {Array} crossRefs - Array of cross-reference objects
 * @returns {string} Formatted markdown section
 */
function formatCrossReferencesSection(crossRefs) {
  if (!crossRefs || crossRefs.length === 0) return '';

  let section = '## 🔗 Related Passages (Cross-References)\n\n';

  crossRefs.forEach(ref => {
    section += `### ${ref.reference || ref.ref}\n\n`;

    if (ref.text) {
      section += `> ${ref.text}\n\n`;
    }

    if (ref.relationship) {
      section += `*Related by: ${ref.relationship}*\n\n`;
    }
  });

  return section;
}

/**
 * Assemble sections within token budget
 * @param {Array} sections - Array of section objects with priority and content
 * @param {number} maxTokens - Maximum tokens allowed
 * @returns {string} Assembled context string
 */
function assembleSections(sections, maxTokens) {
  // Sort by priority (lower number = higher priority)
  sections.sort((a, b) => a.priority - b.priority);

  let totalTokens = 0;
  const includedSections = [];

  // Include sections in priority order until we hit token limit
  for (const section of sections) {
    if (totalTokens + section.tokens <= maxTokens) {
      includedSections.push(section.content);
      totalTokens += section.tokens;
    } else {
      // Try to include partial section if there's room
      const remainingTokens = maxTokens - totalTokens;
      if (remainingTokens > 500) { // Only include if we have meaningful space left
        const partialContent = truncateToTokenLimit(section.content, remainingTokens);
        if (partialContent) {
          includedSections.push(partialContent + '\n\n*[Content truncated due to length]*');
          break;
        }
      }
      break;
    }
  }

  // Add header
  const header = '# Reference Materials for Your Question\n\n';
  const footer = '\n\n---\n\n*Use these references to answer the user\'s question. Always cite your sources in the "Sources:" section at the end of your response.*\n';

  return header + includedSections.join('\n---\n\n') + footer;
}

/**
 * Estimate token count for text
 * Uses rough approximation: ~4 characters per token for English text
 * @param {string} text - Text to estimate
 * @returns {number} Estimated token count
 */
export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Truncate content to fit within token limit
 * @param {string} content - Content to truncate
 * @param {number} maxTokens - Maximum tokens
 * @returns {string} Truncated content
 */
function truncateToTokenLimit(content, maxTokens) {
  const maxChars = maxTokens * 4; // Rough approximation

  if (content.length <= maxChars) {
    return content;
  }

  // Truncate at word boundary
  const truncated = content.substring(0, maxChars);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex);
  }

  return truncated;
}

/**
 * Build minimal context for simple queries
 * @param {Array} verses - Just the verses
 * @returns {string} Simple context string
 */
export function buildMinimalContext(verses) {
  if (!verses || verses.length === 0) return '';

  let context = '# Bible Verses\n\n';

  verses.forEach(verse => {
    context += `**${verse.reference}** (${verse.translation || 'KJV'})\n`;
    context += `> ${verse.text}\n\n`;
  });

  return context;
}
