/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '..', '..');
const EVAL_PATH = path.join(ROOT, 'reports', 'sharp-golden-eval.json');
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'with', 'from', 'what', 'when', 'where', 'which',
  'into', 'your', 'about', 'this', 'have', 'will', 'would', 'there', 'their',
  'please', 'could', 'should', 'them', 'they', 'were', 'been', 'then', 'than',
  'who', 'whom', 'whose', 'is', 'are', 'was', 'do', 'does', 'did', 'tell', 'me',
  'difference', 'between', 'explain', 'meaning'
]);
const QUERY_ALIASES = {
  trinity: ['godhead'],
  sanctification: ['holiness'],
  justification: ['righteousness'],
  apocrypha: ['deuterocanonical'],
  nicaea: ['nicea', 'nicene'],
  ephesians: ['ephesus'],
  paul: ['apostle paul'],
  romans: ['epistle to the romans'],
  corinthians: ['epistle to the corinthians'],
  agape: ['love'],
  hesed: ['chesed', 'lovingkindness', 'steadfast love'],
  kjv: ['king james version'],
  web: ['world english bible'],
  study: ['study plan', 'study plans'],
  resurrection: ['rise again']
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

function matchAny(text, tokens) {
  const lower = (text || '').toLowerCase();
  return (tokens || []).some((t) => lower.includes((t || '').toLowerCase()));
}

function rewriteQuery(query = '') {
  const lower = query.toLowerCase();
  const expansions = [];
  for (const [primary, aliases] of Object.entries(QUERY_ALIASES)) {
    if (lower.includes(primary) || aliases.some((a) => lower.includes(a))) {
      expansions.push(primary, ...aliases);
    }
  }
  return [query, ...expansions].join(' ').trim();
}

function scoreHit(query, content, title) {
  const q = (query || '').toLowerCase();
  const c = (content || '').toLowerCase();
  const t = (title || '').toLowerCase();
  if (!c) return 0;

  let score = 0;
  if (c.includes(q)) score += 10;
  if (t.includes(q)) score += 5;
  for (const token of tokenize(query)) {
    if (c.includes(token)) score += 1.4;
    if (t.includes(token)) score += 0.8;
  }
  return score;
}

function coverageCount(tokens = [], text = '') {
  if (!tokens.length || !text) return 0;
  const lower = text.toLowerCase();
  let count = 0;
  for (const token of tokens) {
    if (lower.includes(token)) count += 1;
  }
  return count;
}

function applySpecificityPenalty(score, sourcePath = '', title = '') {
  const p = String(sourcePath || '').toLowerCase();
  const t = String(title || '').toLowerCase();
  const isAggregateBible =
    p.startsWith('public/bibles/') ||
    ['kjv.json', 'asv.json', 'web.json', 'ylt.json'].includes(t);
  return isAggregateBible ? score * 0.45 : score;
}

function buildOrFilter(tokens) {
  const escaped = tokens
    .slice(0, 6)
    .map((t) => t.replace(/[%_,]/g, ''))
    .filter(Boolean);
  if (!escaped.length) return null;
  return escaped.map((t) => `content.ilike.%${t}%`).join(',');
}

function isNoisePath(sourcePath = '') {
  const p = String(sourcePath || '').replace(/\\/g, '/');
  return NOISE_PATH_PATTERNS.some((rx) => rx.test(p));
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

async function main() {
  const url = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon = process.env.REACT_APP_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Missing REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY env vars');
  }

  const supabase = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const evalSet = JSON.parse(fs.readFileSync(EVAL_PATH, 'utf8'));

  let pass = 0;
  const failures = [];

  for (const item of evalSet) {
    const rewritten = rewriteQuery(item.question || '');
    const qTokens = tokenize(rewritten);
    const orFilter = buildOrFilter(qTokens);

    let request = supabase
      .from('sharp_kb_chunks')
      .select('source_path,title,content')
      .limit(80);

    const anchor = strongestToken(qTokens, rewritten);
    if (qTokens.length <= 2 && anchor) {
      request = request.ilike('content', `%${anchor}%`);
    } else {
      request = orFilter
        ? request.or(orFilter)
        : request.ilike('content', `%${rewritten.trim()}%`);
    }

    let { data, error } = await request;
    if (error && isTransientQueryError(error)) {
      const fallback = await supabase
        .from('sharp_kb_chunks')
        .select('source_path,title,content')
        .ilike('content', `%${anchor || rewritten.trim()}%`)
        .limit(40);
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      failures.push({ id: item.id, reason: error.message });
      continue;
    }

    const ranked = (data || [])
      .filter((r) => !isNoisePath(r.source_path))
      .map((r) => {
        const text = `${r.title || ''}\n${r.content || ''}`;
        const lexical = scoreHit(rewritten, r.content, r.title);
        const coverage = coverageCount(qTokens, text);
        const coverageBoost = Math.min(coverage, 6) * 0.9;
        const score = applySpecificityPenalty(lexical + coverageBoost, r.source_path, r.title);
        return { ...r, score, coverage };
      })
      .filter((r) => r.coverage >= 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const bundle = ranked.map((r) => `${r.title}\n${r.source_path}\n${r.content}`).join('\n');
    const ok = matchAny(bundle, item.mustIncludeAny || []);
    if (ok) {
      pass += 1;
    } else {
      failures.push({ id: item.id, reason: 'No expected token in top retrieval hits' });
    }
  }

  const total = evalSet.length;
  const rate = total ? ((pass / total) * 100).toFixed(1) : '0.0';
  console.log(`Golden retrieval pass: ${pass}/${total} (${rate}%)`);
  if (failures.length) {
    console.log('Failures:');
    for (const f of failures.slice(0, 20)) {
      console.log(`- ${f.id}: ${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
