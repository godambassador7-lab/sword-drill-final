/**
 * Citation Discipline Enforcer
 * Ensures every claim has a proper source citation with rationale
 */

/**
 * Create a well-formed citation with optional rationale
 * @param {Object} params - Citation parameters
 * @returns {Object} Standardized citation object
 */
export function createCitation(params) {
  const {
    type,
    rationale = null,
    // Common fields
    ref = null,
    book = null,
    chapter = null,
    verse = null,
    // Type-specific fields
    source = null,
    entry = null,
    strongsNumber = null,
    translation = null,
    topicId = null,
    title = null,
    position = null,
    event = null,
    otRef = null,
    ntRef = null,
    quoteType = null,
    topic = null,
    author = null,
    section = null,
    isApocrypha = null
  } = params;

  // Base citation structure
  const citation = {
    type,
    timestamp: new Date().toISOString()
  };

  // Add rationale if provided
  if (rationale) {
    citation.rationale = rationale;
  }

  // Add fields based on type
  switch (type) {
    case 'verse':
      citation.ref = ref;
      if (book) citation.book = book;
      if (chapter) citation.chapter = chapter;
      if (verse) citation.verse = verse;
      if (translation) citation.translation = translation;
      if (isApocrypha !== null) citation.isApocrypha = isApocrypha;
      if (!rationale) citation.rationale = 'Biblical text citation';
      break;

    case 'dictionary':
      citation.source = source;
      citation.entry = entry;
      if (!rationale) citation.rationale = `Definition from ${source}`;
      break;

    case 'lexicon':
      citation.strongsNumber = strongsNumber;
      if (!rationale) citation.rationale = `Original language reference (Strong's ${strongsNumber})`;
      break;

    case 'concordance':
      citation.ref = ref;
      if (!rationale) citation.rationale = 'Usage example from biblical concordance';
      break;

    case 'book_context':
      citation.book = book;
      if (author) citation.author = author;
      if (!rationale) citation.rationale = `Historical context for ${book}`;
      break;

    case 'book_section':
      citation.book = book;
      citation.section = section;
      if (!rationale) citation.rationale = `Section outline showing structural context`;
      break;

    case 'topical_chain':
      citation.topicId = topicId;
      citation.title = title;
      if (position) citation.position = position;
      if (!rationale) citation.rationale = `Curated teaching sequence on ${title}`;
      break;

    case 'ot_quote':
      citation.ntRef = ntRef;
      citation.otRef = otRef;
      citation.quoteType = quoteType;
      if (!rationale) citation.rationale = `OT ${quoteType} identified by biblical scholarship`;
      break;

    case 'gospel_parallel':
      citation.ref = ref;
      if (event) citation.event = event;
      if (!rationale) citation.rationale = `Parallel account in synoptic Gospels`;
      break;

    case 'cross_ref':
      citation.ref = ref;
      if (!rationale) citation.rationale = 'Thematically related passage';
      break;

    case 'thematic_cross_ref':
      citation.ref = ref;
      citation.topic = topic;
      if (!rationale) citation.rationale = `Related passage on topic: ${topic}`;
      break;

    default:
      // Generic citation
      Object.assign(citation, params);
      if (!citation.rationale) {
        citation.rationale = 'Supporting reference';
      }
  }

  return citation;
}

/**
 * Validate that a response has sufficient citations
 * @param {string} answer - Response text
 * @param {Array} citations - Citation array
 * @returns {Object} Validation result
 */
export function validateCitations(answer, citations) {
  const issues = [];
  const warnings = [];

  // Count factual claims (statements with specific information)
  const claimIndicators = [
    /\b(wrote|authored|written)\b/gi,
    /\b(dated|date|year|century|BC|AD)\b/gi,
    /\b(means|meaning|defined|definition)\b/gi,
    /\b(according to|based on|from)\b/gi,
    /\*\*[A-Z][^*]+\*\*:/g, // Bolded labels like "**Author**:"
  ];

  let estimatedClaims = 0;
  claimIndicators.forEach(pattern => {
    const matches = answer.match(pattern);
    if (matches) estimatedClaims += matches.length;
  });

  // Check citation count
  if (citations.length === 0 && estimatedClaims > 0) {
    issues.push('Response contains factual claims but has no citations');
  }

  // Check for uncited verses (quoted text without attribution)
  const quotedText = answer.match(/> .+/g);
  const verseCitations = citations.filter(c => c.type === 'verse');
  if (quotedText && quotedText.length > verseCitations.length) {
    warnings.push(`Found ${quotedText.length} quoted passages but only ${verseCitations.length} verse citations`);
  }

  // Check for rationale completeness
  const citationsWithoutRationale = citations.filter(c => !c.rationale);
  if (citationsWithoutRationale.length > 0) {
    warnings.push(`${citationsWithoutRationale.length} citations missing rationale`);
  }

  // Calculate citation density (citations per 100 words)
  const wordCount = answer.split(/\s+/).length;
  const citationDensity = (citations.length / wordCount) * 100;

  if (citationDensity < 2 && estimatedClaims > 3) {
    warnings.push(`Low citation density: ${citationDensity.toFixed(1)} citations per 100 words`);
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
    stats: {
      wordCount,
      citationCount: citations.length,
      citationDensity: citationDensity.toFixed(1),
      estimatedClaims,
      citationsWithRationale: citations.filter(c => c.rationale).length
    }
  };
}

/**
 * Format citations for display (append to response)
 * @param {Array} citations - Citation array
 * @param {boolean} showRationale - Whether to show rationale
 * @returns {string} Formatted citations
 */
export function formatCitationsSection(citations, showRationale = false) {
  if (!citations || citations.length === 0) return '';

  let output = '\n\n---\n\n## 📚 Sources\n\n';

  // Group citations by type
  const grouped = citations.reduce((acc, citation) => {
    if (!acc[citation.type]) acc[citation.type] = [];
    acc[citation.type].push(citation);
    return acc;
  }, {});

  // Order of display
  const typeOrder = [
    'verse',
    'ot_quote',
    'gospel_parallel',
    'topical_chain',
    'dictionary',
    'lexicon',
    'concordance',
    'book_context',
    'book_section',
    'cross_ref',
    'thematic_cross_ref'
  ];

  // Type labels
  const typeLabels = {
    verse: 'Biblical Text',
    ot_quote: 'OT Quotations',
    gospel_parallel: 'Gospel Parallels',
    topical_chain: 'Teaching Chains',
    dictionary: "Smith's Bible Dictionary",
    lexicon: "Strong's Lexicon",
    concordance: "Strong's Concordance",
    book_context: 'Book Background',
    book_section: 'Book Outline',
    cross_ref: 'Cross-References',
    thematic_cross_ref: 'Thematic References'
  };

  typeOrder.forEach(type => {
    if (grouped[type]) {
      output += `**${typeLabels[type]}**:\n`;

      // Remove duplicates
      const unique = Array.from(new Set(grouped[type].map(c => JSON.stringify(c)))).map(s => JSON.parse(s));

      unique.forEach(citation => {
        output += `- `;

        // Format based on type
        switch (type) {
          case 'verse':
            output += citation.ref;
            if (citation.translation) output += ` (${citation.translation})`;
            if (citation.isApocrypha) output += ' [Apocrypha]';
            break;

          case 'dictionary':
            output += `${citation.entry} (${citation.source})`;
            break;

          case 'lexicon':
            output += `Strong's ${citation.strongsNumber}`;
            break;

          case 'book_context':
            output += `${citation.book} - Background`;
            if (citation.author) output += ` (by ${citation.author})`;
            break;

          case 'book_section':
            output += `${citation.book} - ${citation.section}`;
            break;

          case 'topical_chain':
            output += citation.title;
            if (citation.position) output += ` (#${citation.position})`;
            break;

          case 'ot_quote':
            output += `${citation.ntRef} → ${citation.otRef} (${citation.quoteType})`;
            break;

          case 'gospel_parallel':
            output += citation.ref;
            if (citation.event) output += ` (${citation.event})`;
            break;

          case 'cross_ref':
          case 'thematic_cross_ref':
            output += citation.ref;
            if (citation.topic) output += ` (${citation.topic})`;
            break;

          default:
            output += JSON.stringify(citation);
        }

        // Add rationale if requested and available
        if (showRationale && citation.rationale) {
          output += ` - *${citation.rationale}*`;
        }

        output += `\n`;
      });

      output += `\n`;
    }
  });

  return output;
}

/**
 * Enforce citation discipline on a response
 * @param {Object} response - Response object with answer and citations
 * @param {Object} options - Enforcement options
 * @returns {Object} Enhanced response with validation
 */
export function enforceCitationDiscipline(response, options = {}) {
  const {
    validateCitationsEnabled = true,
    appendCitationsSection = false,
    showRationale = false,
    throwOnValidationFailure = false
  } = options;

  // Validate citations
  let validation = null;
  if (validateCitationsEnabled) {
    validation = validateCitations(response.answer, response.citations || []);

    if (!validation.valid && throwOnValidationFailure) {
      throw new Error(`Citation validation failed: ${validation.issues.join(', ')}`);
    }
  }

  // Append formatted citations section
  let enhancedAnswer = response.answer;
  if (appendCitationsSection && response.citations && response.citations.length > 0) {
    enhancedAnswer += formatCitationsSection(response.citations, showRationale);
  }

  return {
    ...response,
    answer: enhancedAnswer,
    citationValidation: validation,
    metadata: {
      ...response.metadata,
      citationStats: validation?.stats
    }
  };
}

export default {
  createCitation,
  validateCitations,
  formatCitationsSection,
  enforceCitationDiscipline
};
