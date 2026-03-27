import { isSupabaseConfigured, supabase } from './supabaseClient';

const KB_TABLE = 'sharp_kb_chunks';
const USE_VECTOR = process.env.REACT_APP_SHARP_USE_VECTOR === 'true';
const EMBEDDING_ENDPOINT = process.env.REACT_APP_SHARP_EMBEDDING_ENDPOINT;
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'with', 'from', 'what', 'when', 'where', 'which',
  'into', 'your', 'about', 'this', 'have', 'will', 'would', 'there', 'their',
  'please', 'could', 'should', 'them', 'they', 'were', 'been', 'then', 'than',
  'who', 'whom', 'whose', 'is', 'are', 'was', 'do', 'does', 'did', 'tell', 'me',
  'difference', 'between', 'explain', 'meaning'
]);
const CACHE_TTL_MS = 2 * 60 * 1000;
const searchCache = new Map();
const QUERY_ALIASES = {
  trinity: ['godhead'],
  atonement: ['reconciliation', 'propitiation'],
  sanctification: ['holiness'],
  justification: ['righteousness'],
  apocrypha: ['deuterocanonical'],
  nicaea: ['nicea', 'nicene'],
  ephesians: ['ephesus', 'epistle to the ephesians'],
  paul: ['saul of tarsus', 'apostle paul'],
  romans: ['epistle to the romans'],
  corinthians: ['epistle to the corinthians'],
  jesus: ['christ', 'messiah'],
  agape: ['love'],
  hesed: ['chesed', 'lovingkindness', 'steadfast love'],
  baptism: ['baptize', 'immersion', 'sprinkling'],
  prayer: ['pray', 'supplication', 'intercession'],
  resurrection: ['rise again'],
  sin: ['transgression', 'iniquity'],
  grace: ['favor', 'mercy'],
  faith: ['belief', 'trust'],
  kjv: ['king james version'],
  web: ['world english bible'],
  study: ['study plan', 'study plans'],
  salvation: ['saved', 'redeemed', 'redemption'],
  church: ['ekklesia', 'assembly'],
  covenant: ['testament'],
  repentance: ['repent', 'turn back'],
  sworddrill: ['sword drill', 'sword-drill']
};

const SOURCE_WEIGHTS = {
  scripture: 1.4,
  lexicon: 1.25,
  dictionary: 1.2,
  cross_reference: 1.15,
  course: 1.0,
  app_doc: 0.95,
  other: 0.9
};
const NOISE_PATH_PATTERNS = [
  /^src\/data\/noto-emoji-2\.051\//i,
  /\/third_party\/region-flags\//i
];

function tokenize(input) {
  return (input || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((t) => {
      if (!t) return false;
      if (/^\d{1,3}$/.test(t)) return true;
      return t.length > 2 && !STOP_WORDS.has(t);
    });
}

function scoreHit(query, content, title) {
  const q = (query || '').toLowerCase();
  const c = (content || '').toLowerCase();
  const t = (title || '').toLowerCase();
  if (!c) return 0;

  let score = 0;
  if (c.includes(q)) score += 10;
  if (t.includes(q)) score += 5;

  const tokens = tokenize(query);
  for (const token of tokens) {
    if (c.includes(token)) score += 1.4;
    if (t.includes(token)) score += 0.8;
  }

  return score;
}

function inferSourceKind(sourcePath = '', title = '', metadata = {}) {
  const p = (sourcePath || '').toLowerCase();
  const t = (title || '').toLowerCase();
  const ext = (metadata?.ext || '').toLowerCase();

  if (p.includes('/bible/') || p.includes('/bibles/') || p.includes('/wlc/') || p.includes('/apocrypha/')) {
    return 'scripture';
  }
  if (p.includes('lexicon') || p.includes('strong') || t.includes('strong')) {
    return 'lexicon';
  }
  if (p.includes('dictionary') || t.includes('dictionary')) {
    return 'dictionary';
  }
  if (p.includes('cross') || p.includes('topical') || p.includes('references')) {
    return 'cross_reference';
  }
  if (p.includes('course') || p.includes('/modules/') || p.includes('/lessons/')) {
    return 'course';
  }
  if (ext === 'md' || p.includes('readme') || p.includes('guide') || p.includes('setup')) {
    return 'app_doc';
  }
  return 'other';
}

function isNoisePath(sourcePath = '') {
  const p = String(sourcePath || '').replace(/\\/g, '/');
  return NOISE_PATH_PATTERNS.some((rx) => rx.test(p));
}

function applySourceWeight(baseScore, sourceKind) {
  const weight = SOURCE_WEIGHTS[sourceKind] || SOURCE_WEIGHTS.other;
  return baseScore * weight;
}

function applySpecificityPenalty(score, sourcePath = '', title = '') {
  const p = String(sourcePath || '').toLowerCase();
  const t = String(title || '').toLowerCase();
  const isAggregateBible =
    p.startsWith('public/bibles/') ||
    ['kjv.json', 'asv.json', 'web.json', 'ylt.json'].includes(t);
  if (isAggregateBible) {
    return score * 0.45;
  }
  return score;
}

function getCached(key) {
  const hit = searchCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > CACHE_TTL_MS) {
    searchCache.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(key, value) {
  searchCache.set(key, { ts: Date.now(), value });
  // Simple cache cap
  if (searchCache.size > 300) {
    const first = searchCache.keys().next().value;
    searchCache.delete(first);
  }
}

function rewriteQuery(query = '') {
  const lower = query.toLowerCase();
  const expansions = [];
  for (const [primary, aliases] of Object.entries(QUERY_ALIASES)) {
    if (lower.includes(primary) || aliases.some((a) => lower.includes(a))) {
      expansions.push(primary, ...aliases);
    }
  }
  const expanded = [query, ...expansions].join(' ');
  return expanded.trim();
}

function coverageCount(tokens = [], text = '') {
  if (!tokens.length || !text) return 0;
  const hay = text.toLowerCase();
  let count = 0;
  for (const token of tokens) {
    if (hay.includes(token)) count += 1;
  }
  return count;
}

function minCoverageForIntent(intentKey = '') {
  if (intentKey.startsWith('scripture.reference_lookup')) return 1;
  if (intentKey.startsWith('scripture.word_study')) return 2;
  if (intentKey.startsWith('theology') || intentKey.startsWith('apologetics')) return 2;
  if (intentKey.startsWith('church_history')) return 2;
  if (intentKey.startsWith('app.')) return 2;
  return 1;
}

function minMatchRatioForIntent(intentKey = '') {
  if (intentKey.startsWith('scripture.reference_lookup')) return 0.25;
  if (intentKey.startsWith('scripture.word_study')) return 0.4;
  if (intentKey.startsWith('theology') || intentKey.startsWith('apologetics')) return 0.35;
  if (intentKey.startsWith('church_history')) return 0.35;
  if (intentKey.startsWith('app.')) return 0.4;
  return 0.3;
}

function dedupeBySource(rows = []) {
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    const source = String(row?.source_path || '');
    if (!source || seen.has(source)) continue;
    seen.add(source);
    out.push(row);
  }
  return out;
}

function shouldKeepByIntent(row, intentProfile = null) {
  if (!intentProfile?.key) return true;
  const key = String(intentProfile.key);
  const sourceKind = row.sourceKind || 'other';
  const topic = String(row?.metadata?.topic || '').toLowerCase();

  if (key.startsWith('scripture.reference_lookup')) {
    return sourceKind === 'scripture' || topic === 'scripture';
  }
  if (key.startsWith('scripture.word_study')) {
    return sourceKind === 'scripture' || sourceKind === 'lexicon' || sourceKind === 'dictionary' || topic === 'languages';
  }
  if (key.startsWith('theology') || key.startsWith('apologetics')) {
    return sourceKind !== 'app_doc' || topic === 'theology';
  }
  if (key.startsWith('church_history')) {
    return sourceKind === 'scripture' || sourceKind === 'course' || sourceKind === 'dictionary' || topic === 'history';
  }
  if (key.startsWith('app.')) {
    return sourceKind === 'app_doc' || sourceKind === 'course' || topic === 'app_features';
  }
  return true;
}

function shouldKeepByTranslation(row, selectedTranslation = '') {
  if (!selectedTranslation) return true;
  const hitTrans = String(row?.metadata?.translation || '').toUpperCase();
  if (!hitTrans) return true;
  return hitTrans === String(selectedTranslation).toUpperCase();
}

function buildOrFilter(tokens) {
  const escaped = tokens
    .slice(0, 6)
    .map((t) => t.replace(/[%_,]/g, ''))
    .filter(Boolean);
  if (!escaped.length) return null;
  return escaped.map((t) => `content.ilike.%${t}%`).join(',');
}

function extractReferenceSignals(query = '') {
  const refs = [];
  const lower = query.toLowerCase();
  const fullRef = lower.match(/\b([1-3]?\s?[a-z]+)\s+(\d{1,3}):(\d{1,3})\b/);
  if (fullRef) refs.push(`${fullRef[1]} ${fullRef[2]}:${fullRef[3]}`);
  const chapterRef = lower.match(/\b([1-3]?\s?[a-z]+)\s+(\d{1,3})\b/);
  if (chapterRef) refs.push(`${chapterRef[1]} ${chapterRef[2]}`);
  return Array.from(new Set(refs));
}

function decomposeQuery(query = '', intentKey = '') {
  const cleaned = String(query || '').trim();
  if (!cleaned) return [];
  const queries = [cleaned];
  const references = extractReferenceSignals(cleaned);
  queries.push(...references);

  const tokens = tokenize(cleaned)
    .filter((t) => !/^\d{1,3}$/.test(t))
    .sort((a, b) => b.length - a.length);

  if (tokens.length >= 2) {
    queries.push(`${tokens[0]} ${tokens[1]}`);
  } else if (tokens.length === 1) {
    queries.push(tokens[0]);
  }

  if (intentKey.startsWith('app.')) {
    queries.push(`${cleaned} sword drill app`);
    if (cleaned.toLowerCase().includes('study')) {
      queries.push('sword drill study plans');
    }
  }

  return Array.from(new Set(queries.map((q) => q.trim()).filter(Boolean))).slice(0, 4);
}

function snippet(content, max = 240) {
  if (!content) return '';
  const clean = content.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}...` : clean;
}

function isTransientQueryError(error) {
  const msg = String(error?.message || '').toLowerCase();
  return msg.includes('statement timeout') || msg.includes('fetch failed') || msg.includes('network');
}

function strongestToken(tokens = [], fallbackText = '') {
  if (tokens.length > 0) {
    return [...tokens].sort((a, b) => b.length - a.length)[0];
  }
  const simple = tokenize(fallbackText);
  return simple.length ? simple.sort((a, b) => b.length - a.length)[0] : '';
}

async function runKbQuery(rewrittenQuery, orFilter, retry = true, queryLimit = 60) {
  const tokens = tokenize(rewrittenQuery);
  let request = supabase
    .from(KB_TABLE)
    .select('source_path, title, chunk_index, content, metadata')
    .limit(queryLimit);

  const anchor = strongestToken(tokens, rewrittenQuery);
  if (tokens.length <= 2 && anchor) {
    request = request.ilike('content', `%${anchor}%`);
  } else if (orFilter) {
    request = request.or(orFilter);
  } else {
    request = request.ilike('content', `%${rewrittenQuery.trim()}%`);
  }

  const { data, error } = await request;
  if (!error || !retry || !isTransientQueryError(error)) {
    return { data, error };
  }

  // Retry once with a narrower predicate to reduce timeout risk on large datasets.
  const fallbackAnchor = strongestToken(tokens, rewrittenQuery);
  let fallback = supabase
    .from(KB_TABLE)
    .select('source_path, title, chunk_index, content, metadata')
    .limit(Math.max(20, Math.floor(queryLimit * 0.66)));
  fallback = fallbackAnchor
    ? fallback.ilike('content', `%${fallbackAnchor}%`)
    : fallback.ilike('content', `%${rewrittenQuery.trim()}%`);
  const fallbackResult = await fallback;
  return fallbackResult;
}

export async function searchSharpKnowledge(query, limit = 4, options = {}) {
  if (!isSupabaseConfigured || !supabase || !query?.trim()) {
    return [];
  }
  const rewrittenQuery = rewriteQuery(query);
  const intentKey = options?.intentProfile?.key || 'none';
  const selectedTranslation = options?.selectedTranslation || '';
  const cacheKey = `${rewrittenQuery}::${limit}::${intentKey}::${selectedTranslation}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (USE_VECTOR && EMBEDDING_ENDPOINT) {
    const vectorHits = await searchSharpKnowledgeVector(rewrittenQuery, limit, options);
    if (vectorHits.length > 0) {
      setCached(cacheKey, vectorHits);
      return vectorHits;
    }
  }

  const tokens = tokenize(rewrittenQuery);
  const minCoverage = minCoverageForIntent(intentKey);
  const minRatio = minMatchRatioForIntent(intentKey);
  const subqueries = decomposeQuery(rewrittenQuery, intentKey);

  const allCandidates = [];
  for (const subquery of subqueries) {
    const subTokens = tokenize(subquery);
    const subOrFilter = buildOrFilter(subTokens);
    const { data, error } = await runKbQuery(subquery, subOrFilter, true, 45);
    if (error || !Array.isArray(data)) continue;
    allCandidates.push(...data);
  }

  if (!allCandidates.length) {
    const orFilter = buildOrFilter(tokens);
    const { data, error } = await runKbQuery(rewrittenQuery, orFilter, true, 60);
    if (error || !Array.isArray(data)) {
      return [];
    }
    allCandidates.push(...data);
  }

  const seen = new Set();
  const dedupedCandidates = [];
  for (const row of allCandidates) {
    const key = `${row?.source_path || ''}::${row?.chunk_index ?? -1}`;
    if (seen.has(key)) continue;
    seen.add(key);
    dedupedCandidates.push(row);
  }

  const scoredRows = dedupedCandidates
    .filter((row) => !isNoisePath(row.source_path))
    .map((row) => ({
      ...row,
      sourceKind: inferSourceKind(row.source_path, row.title, row.metadata),
      score: 0,
      coverage: 0,
      matchRatio: 0,
      preview: snippet(row.content)
    }))
    .map((row) => {
      const text = `${row.title || ''}\n${row.content || ''}`;
      const lexical = scoreHit(rewrittenQuery, row.content, row.title);
      const coverage = coverageCount(tokens, text);
      const matchRatio = tokens.length > 0 ? (coverage / tokens.length) : 0;
      const coverageBoost = Math.min(coverage, 6) * 0.9;
      const weighted = applySourceWeight(lexical + coverageBoost, row.sourceKind);
      const score = applySpecificityPenalty(weighted, row.source_path, row.title);
      return { ...row, coverage, matchRatio, score };
    })
    .filter((row) => shouldKeepByIntent(row, options?.intentProfile))
    .filter((row) => shouldKeepByTranslation(row, options?.selectedTranslation))
    .filter((row) => row.coverage >= minCoverage)
    .filter((row) => row.matchRatio >= minRatio)
    .filter((row) => row.score >= 2.2)
    .sort((a, b) => b.score - a.score);

  const topScore = scoredRows[0]?.score || 0;
  const bandFloor = topScore > 0 ? topScore * 0.58 : 0;
  const rows = dedupeBySource(scoredRows)
    .filter((row) => row.score >= bandFloor)
    .slice(0, Math.max(1, limit));

  setCached(cacheKey, rows);
  return rows;
}

async function getQueryEmbedding(query) {
  if (!EMBEDDING_ENDPOINT) return null;
  try {
    const response = await fetch(EMBEDDING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!response.ok) return null;
    const json = await response.json();
    return Array.isArray(json?.embedding) ? json.embedding : null;
  } catch {
    return null;
  }
}

export async function searchSharpKnowledgeVector(query, limit = 4, options = {}) {
  if (!isSupabaseConfigured || !supabase || !query?.trim()) return [];

  const embedding = await getQueryEmbedding(query);
  if (!embedding) return [];

  const { data, error } = await supabase.rpc('match_sharp_kb_chunks', {
    query_embedding: embedding,
    match_count: Math.max(1, limit),
    min_similarity: 0.72
  });

  if (error || !Array.isArray(data)) return [];
  const minCoverage = minCoverageForIntent(options?.intentProfile?.key || 'none');

  return data
    .filter((row) => !isNoisePath(row.source_path))
    .map((row) => {
      const sourceKind = inferSourceKind(row.source_path, row.title, row.metadata);
      const semantic = Number(row.similarity) || 0;
      const lexical = scoreHit(query, row.content, row.title) / 12;
      const queryTokens = tokenize(query);
      const text = `${row.title || ''}\n${row.content || ''}`;
      const coverage = coverageCount(queryTokens, text);
      const matchRatio = queryTokens.length > 0 ? (coverage / queryTokens.length) : 0;
      const coverageBoost = Math.min(coverage, 6) * 0.06;
      const rerankedBase = (semantic * 0.75) + (lexical * 0.25) + coverageBoost;
      const rerankedWeighted = applySourceWeight(rerankedBase, sourceKind);
      const reranked = applySpecificityPenalty(rerankedWeighted, row.source_path, row.title);
      return {
        source_path: row.source_path,
        title: row.title,
        chunk_index: row.chunk_index,
        content: row.content,
        sourceKind,
        coverage,
        matchRatio,
        score: reranked,
        semanticScore: semantic,
        preview: snippet(row.content)
      };
    })
    .filter((row) => shouldKeepByIntent(row, options?.intentProfile))
    .filter((row) => shouldKeepByTranslation(row, options?.selectedTranslation))
    .filter((row) => row.coverage >= minCoverage)
    .filter((row) => row.matchRatio >= minMatchRatioForIntent(options?.intentProfile?.key || 'none'))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, limit));
}
