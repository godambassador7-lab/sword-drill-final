// Question Analyzer: Uses grammar and linguistic patterns to understand questions

/**
 * Analyzes a question to extract its core components
 * @param {string} question - The user's question
 * @returns {object} Analysis with subject, verb, object, type, confidence
 */
export function analyzeQuestion(question) {
  const normalized = question.trim().toLowerCase();

  // Question type detection
  const questionWords = {
    who: { type: 'person', requiresSubject: true },
    what: { type: 'thing/definition', requiresSubject: false },
    where: { type: 'location', requiresSubject: true },
    when: { type: 'time', requiresSubject: true },
    why: { type: 'reason', requiresSubject: true },
    how: { type: 'method/degree', requiresSubject: false },
    which: { type: 'choice', requiresSubject: true },
    whose: { type: 'possession', requiresSubject: true },
  };

  // Detect question word
  let questionType = 'statement';
  let questionWord = null;

  for (const [word, info] of Object.entries(questionWords)) {
    if (normalized.startsWith(word + ' ') || normalized === word) {
      questionType = info.type;
      questionWord = word;
      break;
    }
  }

  // Extract subject (what the question is about)
  const subject = extractSubject(normalized, questionWord);

  // Extract verb (action or state)
  const verb = extractVerb(normalized);

  // Detect if question is well-formed
  const isWellFormed = assessWellFormedness(normalized, questionType, subject, verb);

  // Calculate confidence score
  const confidence = calculateConfidence(normalized, questionType, subject, verb, isWellFormed);

  return {
    originalQuestion: question,
    normalized,
    questionType,
    questionWord,
    subject,
    verb,
    isWellFormed,
    confidence,
    canAnswer: confidence > 0.4,
    suggestion: !isWellFormed ? generateSuggestion(normalized, questionType) : null
  };
}

/**
 * Extract the subject of the question
 */
function extractSubject(normalized, questionWord) {
  // Remove question word and common phrases
  let remaining = normalized;

  if (questionWord) {
    remaining = remaining.replace(new RegExp(`^${questionWord}\\s+`), '');
  }

  // Remove common auxiliary verbs and articles
  remaining = remaining
    .replace(/^(is|are|was|were|do|does|did|can|could|should|would|will|shall|may|might)\s+/i, '')
    .replace(/^(the|a|an)\s+/i, '');

  // Extract first noun phrase (simplified)
  const words = remaining.split(/\s+/);
  const subject = [];

  for (let i = 0; i < Math.min(words.length, 5); i++) {
    const word = words[i];
    // Stop at verbs or prepositions
    if (/^(in|on|at|to|from|with|by|about|for|of|is|are|was|were|do|does|did)$/.test(word)) {
      break;
    }
    subject.push(word);
  }

  return subject.join(' ').trim() || null;
}

/**
 * Extract the main verb
 */
function extractVerb(normalized) {
  const commonVerbs = [
    'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'do', 'does', 'did', 'done', 'doing',
    'have', 'has', 'had', 'having',
    'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'will', 'would',
    'say', 'said', 'tell', 'told', 'mean', 'meant',
    'go', 'went', 'come', 'came', 'happen', 'happened'
  ];

  const words = normalized.split(/\s+/);

  for (const word of words) {
    if (commonVerbs.includes(word)) {
      return word;
    }
  }

  return null;
}

/**
 * Assess if the question is grammatically well-formed
 */
function assessWellFormedness(normalized, questionType, subject, verb) {
  // Empty or too short
  if (normalized.length < 3) return false;

  // Single word without context (unless it's a valid one-word question)
  if (!normalized.includes(' ') && !['why', 'how', 'where', 'when', 'what', 'who'].includes(normalized)) {
    return false;
  }

  // Has question word but no subject
  if (questionType !== 'statement' && !subject && questionType !== 'thing/definition') {
    return false;
  }

  // Too many question words
  const questionWordCount = (normalized.match(/\b(who|what|where|when|why|how|which)\b/g) || []).length;
  if (questionWordCount > 2) return false;

  return true;
}

/**
 * Calculate confidence that we can answer the question
 */
function calculateConfidence(normalized, questionType, subject, verb, isWellFormed) {
  let confidence = 0.5; // Start with neutral

  // Well-formed questions get boost
  if (isWellFormed) confidence += 0.2;

  // Has clear subject
  if (subject && subject.length > 2) confidence += 0.2;

  // Has verb
  if (verb) confidence += 0.1;

  // Reasonable length (not too short, not too long)
  const wordCount = normalized.split(/\s+/).length;
  if (wordCount >= 3 && wordCount <= 20) {
    confidence += 0.1;
  } else if (wordCount > 30) {
    confidence -= 0.2; // Too long, probably rambling
  }

  // Biblical keywords boost confidence
  const biblicalKeywords = [
    'bible', 'scripture', 'verse', 'god', 'jesus', 'christ', 'lord', 'testament',
    'david', 'moses', 'paul', 'peter', 'abraham', 'israel', 'jerusalem',
    'church', 'apostle', 'prophet', 'king', 'priest', 'temple', 'covenant'
  ];

  const hasBiblicalKeyword = biblicalKeywords.some(kw => normalized.includes(kw));
  if (hasBiblicalKeyword) confidence += 0.1;

  // Cap between 0 and 1
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Generate a suggestion for poorly formed questions
 */
function generateSuggestion(normalized, questionType) {
  if (normalized.split(/\s+/).length < 2) {
    return "Try asking a complete question. For example: 'What is [topic]?' or 'Who is [person]?'";
  }

  if (questionType === 'statement') {
    return "Try starting with a question word like 'What', 'Who', 'Where', 'When', 'Why', or 'How'.";
  }

  return "Try rephrasing your question with more detail. For example: 'What does the Bible say about [topic]?'";
}

/**
 * Check if a question is too vague to answer
 */
export function isQuestionTooVague(question) {
  const analysis = analyzeQuestion(question);
  return !analysis.canAnswer || analysis.confidence < 0.4;
}

/**
 * Generate a helpful error message for unclear questions
 */
export function generateClarificationRequest(question) {
  const analysis = analyzeQuestion(question);

  if (!analysis.isWellFormed && analysis.suggestion) {
    return {
      error: true,
      message: `I don't quite understand your question. ${analysis.suggestion}`,
      suggestion: analysis.suggestion
    };
  }

  if (analysis.confidence < 0.4) {
    return {
      error: true,
      message: "I'm not sure I understand. Could you try rephrasing your question with more detail?",
      suggestion: "Try asking about a specific person, place, or topic from the Bible."
    };
  }

  return null;
}

export default {
  analyzeQuestion,
  isQuestionTooVague,
  generateClarificationRequest
};
