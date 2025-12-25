/**
 * Citation Extractor for SHARP Assistant
 * Extracts and validates biblical references and source citations from responses
 */

/**
 * Extract all citations from a response text
 * @param {string} responseText - Claude's response text
 * @returns {Array} Array of citation objects
 */
export function extractCitations(responseText) {
  if (!responseText) return [];

  const citations = [];

  // Extract Bible references (e.g., John 3:16, 1 Corinthians 13:4-7, Romans 8:28)
  const versePattern = /\b([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?\b/g;
  let match;

  while ((match = versePattern.exec(responseText)) !== null) {
    const ref = match[0];

    // Avoid duplicates
    if (!citations.some(c => c.type === 'verse' && c.ref === ref)) {
      citations.push({
        type: 'verse',
        ref: ref,
        book: match[1].trim(),
        chapter: match[2],
        verse: match[3],
        verseEnd: match[4] || null
      });
    }
  }

  // Extract dictionary citations (e.g., Smith's Bible Dictionary: "Paul")
  const dictPattern = /Smith's Bible Dictionary:\s*"([^"]+)"/gi;
  while ((match = dictPattern.exec(responseText)) !== null) {
    const entry = match[1];

    if (!citations.some(c => c.type === 'dictionary' && c.entry === entry)) {
      citations.push({
        type: 'dictionary',
        source: 'SMITHS',
        entry: entry
      });
    }
  }

  // Also catch format: (Smith's)
  const dictPattern2 = /\(Smith's[^)]*\)/gi;
  while ((match = dictPattern2.exec(responseText)) !== null) {
    // Try to find the headword before the citation
    const beforeText = responseText.substring(Math.max(0, match.index - 50), match.index);
    const headwordMatch = beforeText.match(/\b([A-Z][a-z]+)\s*$/);

    if (headwordMatch) {
      const entry = headwordMatch[1];
      if (!citations.some(c => c.type === 'dictionary' && c.entry === entry)) {
        citations.push({
          type: 'dictionary',
          source: 'SMITHS',
          entry: entry
        });
      }
    }
  }

  // Extract Webster's citations
  const websterPattern = /Webster's[^:]*:\s*"([^"]+)"/gi;
  while ((match = websterPattern.exec(responseText)) !== null) {
    const entry = match[1];

    if (!citations.some(c => c.type === 'dictionary' && c.entry === entry)) {
      citations.push({
        type: 'dictionary',
        source: 'WEBSTER',
        entry: entry
      });
    }
  }

  // Extract Strong's numbers (e.g., Strong's G26, Strong's H2617, G1343)
  const strongsPattern = /(?:Strong's\s+)?([GH]\d{1,5})\b/g;
  while ((match = strongsPattern.exec(responseText)) !== null) {
    const strongsNumber = match[1];

    if (!citations.some(c => c.type === 'lexicon' && c.strongsNumber === strongsNumber)) {
      citations.push({
        type: 'lexicon',
        strongsNumber: strongsNumber,
        language: strongsNumber.startsWith('G') ? 'Greek' : 'Hebrew'
      });
    }
  }

  // Extract translation citations (e.g., (KJV), (ESV), (WEB))
  const translationPattern = /\(([A-Z]{2,5})\)/g;
  const knownTranslations = ['KJV', 'ESV', 'WEB', 'ASV', 'NASB', 'NIV', 'NKJV', 'NLT', 'CSB', 'WLC', 'LXX'];

  while ((match = translationPattern.exec(responseText)) !== null) {
    const translation = match[1];

    if (knownTranslations.includes(translation)) {
      // Find if this is associated with a verse citation
      const beforeText = responseText.substring(Math.max(0, match.index - 30), match.index);
      const verseMatch = beforeText.match(/([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?\s*$/);

      if (verseMatch) {
        // Find the existing verse citation and add translation
        const existingCitation = citations.find(c =>
          c.type === 'verse' &&
          c.book === verseMatch[1].trim() &&
          c.chapter === verseMatch[2] &&
          c.verse === verseMatch[3]
        );

        if (existingCitation && !existingCitation.translation) {
          existingCitation.translation = translation;
        }
      }
    }
  }

  return citations;
}

/**
 * Validate that cited sources were actually in the retrieved context
 * @param {Array} citations - Citations extracted from response
 * @param {Object} retrievedContext - Context that was provided to Claude
 * @returns {Array} Filtered array of validated citations
 */
export function validateCitations(citations, retrievedContext) {
  if (!retrievedContext) return citations;

  return citations.filter(citation => {
    if (citation.type === 'verse') {
      // Check if verse was in retrieved context
      return retrievedContext.verses?.some(v => {
        // Match by reference string or by book/chapter
        return v.reference?.includes(citation.ref) ||
               (v.book === citation.book &&
                v.chapter === parseInt(citation.chapter) &&
                (!citation.verse || v.verse === parseInt(citation.verse)));
      });
    }

    if (citation.type === 'dictionary') {
      // Check if dictionary entry was retrieved
      return retrievedContext.definitions?.some(d =>
        d.headword?.toLowerCase() === citation.entry.toLowerCase()
      );
    }

    if (citation.type === 'lexicon') {
      // Check if lexicon entry was retrieved
      return retrievedContext.lexicon?.some(l =>
        l.strong === citation.strongsNumber ||
        l.strongsNumber === citation.strongsNumber
      );
    }

    // Unknown citation type - keep it
    return true;
  });
}

/**
 * Format citations for display
 * @param {Array} citations - Array of citation objects
 * @returns {string} Formatted citation text
 */
export function formatCitations(citations) {
  if (!citations || citations.length === 0) {
    return '';
  }

  const formatted = [];

  // Group by type
  const verses = citations.filter(c => c.type === 'verse');
  const dictionaries = citations.filter(c => c.type === 'dictionary');
  const lexicons = citations.filter(c => c.type === 'lexicon');

  // Format verses
  if (verses.length > 0) {
    const verseRefs = verses.map(v =>
      v.translation ? `${v.ref} (${v.translation})` : v.ref
    ).join(', ');
    formatted.push(`**Scriptures:** ${verseRefs}`);
  }

  // Format dictionary entries
  if (dictionaries.length > 0) {
    const dictEntries = dictionaries.map(d =>
      `${d.entry} (${d.source === 'SMITHS' ? "Smith's Bible Dictionary" : "Webster's Dictionary"})`
    ).join(', ');
    formatted.push(`**Reference Works:** ${dictEntries}`);
  }

  // Format lexicon entries
  if (lexicons.length > 0) {
    const lexiconRefs = lexicons.map(l =>
      `Strong's ${l.strongsNumber}`
    ).join(', ');
    formatted.push(`**Original Languages:** ${lexiconRefs}`);
  }

  return formatted.join('\n');
}

/**
 * Extract the "Sources:" section from response if it exists
 * @param {string} responseText - Response text
 * @returns {string|null} Sources section or null
 */
export function extractSourcesSection(responseText) {
  if (!responseText) return null;

  const sourcesMatch = responseText.match(/(?:^|\n)(?:\*\*)?Sources?:?\*\*?(?:\n|$)([\s\S]*?)(?:\n\n|$)/i);

  if (sourcesMatch) {
    return sourcesMatch[1].trim();
  }

  return null;
}

/**
 * Remove duplicate citations while preserving order
 * @param {Array} citations - Array of citations
 * @returns {Array} Deduplicated array
 */
export function deduplicateCitations(citations) {
  const seen = new Set();

  return citations.filter(citation => {
    const key = `${citation.type}-${
      citation.type === 'verse' ? citation.ref :
      citation.type === 'dictionary' ? citation.entry :
      citation.strongsNumber
    }`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
