import { answerQuery as pipelineAnswerQuery } from './pipeline';
import { searchSharpKnowledge } from '../sharpKnowledgeBase';

const LIMITATIONS_NOTE =
  "I can answer from Sword Drill's built-in study library and Bible datasets. If you want, ask for a narrower verse/topic and I can go deeper within that scope.";
const LOW_CONFIDENCE_RESPONSE =
  "I don't have enough high-confidence evidence in my current local sources to answer that reliably yet. Try a more specific Bible reference, person, place, or doctrine term and I will re-check the indexed data.";
const OUT_OF_COVERAGE_RESPONSE =
  "That question appears outside SHARP's current Bible/app knowledge scope. I can reliably help with Scripture, theology, biblical languages, church history, and Sword Drill features.";

const DEBUG_CONFIDENCE = process.env.REACT_APP_SHARP_DEBUG_CONFIDENCE === 'true';

const DOMAIN_KEYWORDS = [
  'bible', 'scripture', 'verse', 'old testament', 'new testament', 'jesus', 'moses',
  'paul', 'apostle', 'hebrew', 'greek', 'aramaic', 'lexicon', 'strong', 'theology',
  'doctrine', 'church history', 'canon', 'apocrypha', 'sinaiticus', 'septuagint',
  'wlc', 'kjv', 'asv', 'web', 'ylt', 'faith', 'salvation', 'baptism', 'grace',
  'sword drill', 'study plan', 'course', 'quiz', 'memorization'
];

function normalizeCitation(citation) {
  if (!citation || typeof citation !== 'object') return null;
  if (citation.type) return citation;
  if (citation.ref) return { ...citation, type: 'verse' };
  if (citation.entry) return { ...citation, type: 'dictionary' };
  if (citation.strongsNumber) return { ...citation, type: 'lexicon' };
  return { ...citation, type: 'other' };
}

function normalizeCitations(citations) {
  const seen = new Set();
  const out = [];
  for (const raw of citations || []) {
    const c = normalizeCitation(raw);
    if (!c) continue;
    const key = `${c.type}:${c.ref || c.entry || c.strongsNumber || JSON.stringify(c)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

function getIntentProfile(pipelineMeta = {}) {
  const classification = pipelineMeta?.classification || {};
  const category = classification?.category || 'general';
  const subcategory = classification?.subcategory || null;

  const base = {
    key: `${category}.${subcategory || 'none'}`,
    threshold: 0.5,
    minCitations: 1,
    requireVerseCitation: false,
    requireEvidenceDiversity: false
  };

  if (category === 'theology' || category === 'apologetics' || category === 'church_history') {
    return {
      ...base,
      threshold: 0.62,
      minCitations: 2,
      requireVerseCitation: true,
      requireEvidenceDiversity: true
    };
  }
  if (category === 'scripture' && subcategory === 'reference_lookup') {
    return {
      ...base,
      threshold: 0.35,
      minCitations: 1,
      requireVerseCitation: true
    };
  }
  if (category === 'scripture' && (subcategory === 'what_definition' || subcategory === 'word_study')) {
    return {
      ...base,
      threshold: 0.48,
      minCitations: 2,
      requireEvidenceDiversity: true
    };
  }
  if (category === 'practical') {
    return {
      ...base,
      threshold: 0.55,
      minCitations: 2,
      requireVerseCitation: true
    };
  }

  return base;
}

function getEvidenceProfile(citations = [], kbHits = []) {
  const citationTypes = new Set(citations.map((c) => c.type || 'other'));
  const sourceKinds = new Set((kbHits || []).map((h) => h.sourceKind || 'other'));
  const verseCitations = citations.filter((c) => c.type === 'verse').length;

  return {
    citationCount: citations.length,
    verseCitationCount: verseCitations,
    citationTypeCount: citationTypes.size,
    kbHitCount: kbHits.length,
    kbSourceKindCount: sourceKinds.size,
    evidenceDiversityScore: citationTypes.size + sourceKinds.size
  };
}

function isInCoverage(query = '') {
  const lower = query.toLowerCase();
  return DOMAIN_KEYWORDS.some((kw) => lower.includes(kw));
}

function detectContradictionRisk(answer = '', kbHits = []) {
  const haystack = [answer, ...kbHits.map((h) => h.content || '')].join('\n').toLowerCase();
  const pairs = [
    ['faith alone', 'faith plus works'],
    ['lose salvation', 'cannot lose salvation'],
    ['pre-trib', 'post-trib'],
    ['infant baptism', 'believer baptism']
  ];

  let matches = 0;
  for (const [a, b] of pairs) {
    if (haystack.includes(a) && haystack.includes(b)) {
      matches += 1;
    }
  }
  return matches;
}

function applyIntentTemplate(answer = '', pipelineMeta = {}) {
  const classification = pipelineMeta?.classification || {};
  const category = classification?.category || 'general';
  const sub = classification?.subcategory || '';
  const trimmed = answer.trim();
  if (!trimmed) return trimmed;

  if (category === 'scripture' && sub === 'reference_lookup') {
    return trimmed.startsWith('Passage') ? trimmed : `Passage Insight:\n${trimmed}`;
  }
  if (category === 'theology' || category === 'apologetics') {
    if (trimmed.includes('Biblical Evidence:') && trimmed.includes('Balanced View:')) return trimmed;
    return `Direct Answer:\n${trimmed}\n\nBiblical Evidence:\n- See cited passages below.\n\nBalanced View:\n- Interpretive differences may exist across traditions.`;
  }
  if (category === 'church_history') {
    return trimmed.includes('Historical Context:')
      ? trimmed
      : `Historical Context:\n${trimmed}`;
  }

  return trimmed;
}

function computeConfidence({ answer, citations, kbHits, pipelineMeta, intentProfile, evidenceProfile, contradictionRisk }) {
  let score = 0;
  const answerLen = (answer || '').length;
  const citationCount = evidenceProfile.citationCount;
  const kbCount = evidenceProfile.kbHitCount;

  score += Math.min(citationCount, 5) * 0.15;
  score += Math.min(kbCount, 4) * 0.08;
  score += Math.min(evidenceProfile.evidenceDiversityScore, 6) * 0.06;
  if (answerLen >= 180) score += 0.12;
  if (answerLen >= 360) score += 0.12;
  if (pipelineMeta?.classification) score += 0.1;
  if (pipelineMeta?.needsClarification) score -= 0.25;
  if (pipelineMeta?.error) score -= 0.35;
  if (contradictionRisk > 0) score -= Math.min(0.25, contradictionRisk * 0.12);

  if (intentProfile.requireVerseCitation && evidenceProfile.verseCitationCount === 0) {
    score -= 0.2;
  }
  if (intentProfile.requireEvidenceDiversity && evidenceProfile.evidenceDiversityScore < 2) {
    score -= 0.2;
  }

  return Math.max(0, Math.min(1, score));
}

export async function answerWithSharpBrain(userMessage, context = {}) {
  const [result, kbHits] = await Promise.all([
    pipelineAnswerQuery(userMessage, context),
    searchSharpKnowledge(userMessage, 3)
  ]);

  let answer = typeof result?.answer === 'string' ? result.answer.trim() : '';
  const citations = normalizeCitations(result?.citations || []);
  const metadata = {
    ...(result?.metadata || result?.meta || {}),
    brain: 'sharp-limited-rag-v1',
    localOnly: true,
    kbHits: kbHits.length,
    usedClaude: false
  };
  const intentProfile = getIntentProfile(metadata);
  const inCoverage = isInCoverage(userMessage);

  if (kbHits.length > 0) {
    const kbSection = kbHits
      .map((hit, idx) => `${idx + 1}. ${hit.title} (${hit.source_path})\n   ${hit.preview}`)
      .join('\n');
    answer = `${answer}\n\nLibrary Notes:\n${kbSection}`.trim();
  }

  answer = applyIntentTemplate(answer, metadata);

  if (!answer) {
    return {
      answer: LIMITATIONS_NOTE,
      citations,
      metadata: { ...metadata, fallback: true }
    };
  }

  const confidenceScore = computeConfidence({
    answer,
    citations,
    kbHits,
    pipelineMeta: metadata,
    intentProfile,
    evidenceProfile: getEvidenceProfile(citations, kbHits),
    contradictionRisk: detectContradictionRisk(answer, kbHits)
  });
  const evidenceProfile = getEvidenceProfile(citations, kbHits);
  const contradictionRisk = detectContradictionRisk(answer, kbHits);

  metadata.confidenceScore = confidenceScore;
  metadata.intentProfile = intentProfile;
  metadata.evidenceProfile = evidenceProfile;
  metadata.contradictionRisk = contradictionRisk;
  metadata.inCoverage = inCoverage;

  const failsCoverage = !inCoverage && evidenceProfile.citationCount === 0 && evidenceProfile.kbHitCount < 2;
  if (failsCoverage) {
    return {
      answer: OUT_OF_COVERAGE_RESPONSE,
      citations: [],
      metadata: { ...metadata, outOfCoverage: true, lowConfidence: true }
    };
  }

  const hardFailEvidence =
    evidenceProfile.citationCount < intentProfile.minCitations ||
    (intentProfile.requireVerseCitation && evidenceProfile.verseCitationCount === 0) ||
    (intentProfile.requireEvidenceDiversity && evidenceProfile.evidenceDiversityScore < 2) ||
    contradictionRisk > 1;

  if (hardFailEvidence || confidenceScore < intentProfile.threshold) {
    return {
      answer: LOW_CONFIDENCE_RESPONSE,
      citations,
      metadata: { ...metadata, lowConfidence: true }
    };
  }

  if (citations.length === 0) {
    return {
      answer: `${answer}\n\n${LIMITATIONS_NOTE}`,
      citations,
      metadata
    };
  }

  return {
    answer,
    citations,
    metadata: DEBUG_CONFIDENCE ? metadata : {
      ...metadata,
      intentProfile: undefined,
      evidenceProfile: undefined,
      contradictionRisk: undefined
    }
  };
}

export default { answerWithSharpBrain };
