import { parseReference } from './assistant/referenceParser';

const CANDIDATE_REFERENCE_RE = /\b(?:[1-3]\s)?[A-Za-z][A-Za-z.'-]*(?:\s+[A-Za-z][A-Za-z.'-]*){0,3}\s\d{1,3}(?::\d{1,3}(?:[-–—]\d{1,3})?)?\b/g;

const HISTORICAL_KEYWORDS = [
  'council', 'nicaea', 'chalcedon', 'constantinople', 'edict', 'rome', 'roman', 'martyr',
  'apostolic father', 'church father', 'didache', 'irenaeus', 'polycarp', 'augustine', 'jerome',
  'tertullian', 'arianism', 'gnostic', 'heresy', 'monastic', 'vulgate'
];

const METHOD_KEYWORDS = [
  'hermeneutic', 'interpret', 'interpretation', 'context', 'genre', 'grammatical', 'historical method',
  'exegesis', 'application', 'author', 'audience', 'textual criticism', 'canonical'
];

const DOCTRINAL_KEYWORDS = [
  'trinity', 'deity', 'christ', 'atonement', 'salvation', 'grace', 'sin', 'resurrection', 'incarnation'
];

const collectFromText = (text, outSet) => {
  if (!text || typeof text !== 'string') return;
  const matches = text.match(CANDIDATE_REFERENCE_RE) || [];
  for (const match of matches) {
    const parsed = parseReference(match);
    if (parsed?.valid && parsed.normalized) {
      outSet.add(parsed.normalized);
    }
  }
};

export const extractScriptureReferences = (question) => {
  const refs = new Set();
  const explicit = Array.isArray(question?.scriptureRefs) ? question.scriptureRefs : [];

  for (const ref of explicit) {
    const parsed = parseReference(ref);
    if (parsed?.valid && parsed.normalized) refs.add(parsed.normalized);
  }

  collectFromText(question?.question, refs);
  collectFromText(question?.explanation, refs);
  if (Array.isArray(question?.options)) {
    for (const option of question.options) collectFromText(option, refs);
  }

  return Array.from(refs).slice(0, 8);
};

const includesAny = (text, keywords) => keywords.some((kw) => text.includes(kw));

export const buildStudyLens = (question, domain = 'general') => {
  const refs = extractScriptureReferences(question);
  const corpus = [question?.question, question?.explanation, ...(question?.options || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  let claimType = 'Conceptual Knowledge Claim';
  let caution = 'Confirm terminology and definitions in course notes and primary texts.';
  let verification = 'Cross-check with at least two primary or canonical references.';

  if (refs.length > 0) {
    claimType = 'Textual Claim (Scripture Anchored)';
    caution = 'Read each cited passage in full literary context before finalizing interpretation.';
    verification = 'Compare wording in context and avoid proof-texting isolated phrases.';
  } else if (includesAny(corpus, HISTORICAL_KEYWORDS)) {
    claimType = 'Historical Claim';
    caution = 'Distinguish primary-source evidence from later summaries and devotional retellings.';
    verification = 'Verify dates, persons, and events against primary historical witnesses.';
  } else if (includesAny(corpus, METHOD_KEYWORDS) || domain === 'hermeneutics') {
    claimType = 'Interpretive Method Claim';
    caution = 'Do not confuse method labels with actual textual argumentation.';
    verification = 'Test the method on a real passage and justify each interpretive step.';
  } else if (includesAny(corpus, DOCTRINAL_KEYWORDS)) {
    claimType = 'Doctrinal Synthesis Claim';
    caution = 'Avoid single-verse formulations; doctrine should rest on broader canonical synthesis.';
    verification = 'Trace the claim across multiple passages and genres before concluding.';
  }

  return {
    references: refs,
    claimType,
    caution,
    verification,
    evidenceBasis: refs.length
      ? `${refs.length} scripture reference(s) detected in question/explanation.`
      : 'No explicit scripture reference detected in this item text.'
  };
};

export const buildConfidenceTier = (question, domain = 'general') => {
  const refs = extractScriptureReferences(question);
  const referenceText = String(question?.reference || '').toLowerCase();
  const hasExplanation = typeof question?.explanation === 'string' && question.explanation.trim().length > 20;
  const hasReferenceLabel = typeof question?.reference === 'string' && question.reference.trim().length > 0;
  const isCanonicalOrderItem = referenceText.includes('book order') || referenceText.includes('canon');

  if (refs.length >= 1 || isCanonicalOrderItem) {
    return {
      tier: 'High',
      rationale: refs.length >= 1
        ? 'Direct scripture anchor detected for this question.'
        : 'Canonical book-order claim with stable textual structure.'
    };
  }

  if (hasReferenceLabel || hasExplanation || domain === 'hermeneutics' || domain === 'textual-criticism') {
    return {
      tier: 'Moderate',
      rationale: 'Partial support is present, but explicit verse-level anchoring is limited.'
    };
  }

  return {
    tier: 'Low',
    rationale: 'Insufficient explicit source anchoring in this item text.'
  };
};
