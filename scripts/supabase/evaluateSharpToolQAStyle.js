/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '..', '..');
const EVAL_PATH = path.join(ROOT, 'reports', 'sharp-golden-eval.json');
const OUT_PATH = path.join(ROOT, 'reports', 'sharp-toolqa-style-report.json');

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

function decomposeQuery(query = '') {
  const cleaned = String(query || '').trim();
  if (!cleaned) return [];
  const queries = [cleaned];
  const references = extractReferenceSignals(cleaned);
  queries.push(...references);

  const tokens = tokenize(cleaned)
    .filter((t) => !/^\d{1,3}$/.test(t))
    .sort((a, b) => b.length - a.length);

  if (tokens.length >= 2) queries.push(`${tokens[0]} ${tokens[1]}`);
  else if (tokens.length === 1) queries.push(tokens[0]);

  return Array.from(new Set(queries.map((q) => q.trim()).filter(Boolean))).slice(0, 4);
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
  if (tokens.length > 0) return [...tokens].sort((a, b) => b.length - a.length)[0];
  const simple = tokenize(fallbackText);
  return simple.length ? simple.sort((a, b) => b.length - a.length)[0] : '';
}

function scoreHit(query, content, title) {
  const q = (query || '').toLowerCase();
  const c = (content || '').toLowerCase();
  const t = (title || '').toLowerCase();
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
  const lower = (text || '').toLowerCase();
  let count = 0;
  for (const token of tokens) {
    if (lower.includes(token)) count += 1;
  }
  return count;
}

function applySpecificityPenalty(score, sourcePath = '', title = '') {
  const p = String(sourcePath || '').toLowerCase();
  const t = String(title || '').toLowerCase();
  const isAggregateBible = p.startsWith('public/bibles/') || ['kjv.json', 'asv.json', 'web.json', 'ylt.json'].includes(t);
  return isAggregateBible ? score * 0.45 : score;
}

function matchAny(text, tokens) {
  const lower = (text || '').toLowerCase();
  return (tokens || []).some((t) => lower.includes((t || '').toLowerCase()));
}

async function runQuery(supabase, query, trace) {
  const rewritten = rewriteQuery(query);
  const qTokens = tokenize(rewritten);
  const orFilter = buildOrFilter(qTokens);
  const anchor = strongestToken(qTokens, rewritten);

  let request = supabase.from('sharp_kb_chunks').select('source_path,title,content').limit(80);
  if (qTokens.length <= 2 && anchor) {
    request = request.ilike('content', `%${anchor}%`);
    trace.steps.push({ type: 'query', mode: 'anchor', anchor, limit: 80 });
  } else if (orFilter) {
    request = request.or(orFilter);
    trace.steps.push({ type: 'query', mode: 'orFilter', tokens: qTokens.slice(0, 6), limit: 80 });
  } else {
    request = request.ilike('content', `%${rewritten.trim()}%`);
    trace.steps.push({ type: 'query', mode: 'ilike', query: rewritten.trim(), limit: 80 });
  }

  let { data, error } = await request;
  if (error && isTransientQueryError(error)) {
    const fallback = await supabase
      .from('sharp_kb_chunks')
      .select('source_path,title,content')
      .ilike('content', `%${anchor || rewritten.trim()}%`)
      .limit(40);
    trace.steps.push({ type: 'retry', mode: 'fallback', anchor: anchor || rewritten.trim(), limit: 40 });
    data = fallback.data;
    error = fallback.error;
  }

  return { data: data || [], error, rewritten, qTokens };
}

async function main() {
  const url = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon = process.env.REACT_APP_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error('Missing REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY');

  const evalSet = JSON.parse(fs.readFileSync(EVAL_PATH, 'utf8'));
  const supabase = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });

  const traces = [];
  let pass = 0;
  let timeoutCount = 0;
  let errorCount = 0;

  for (const item of evalSet) {
    const trace = { id: item.id, question: item.question, steps: [] };
    const subqueries = decomposeQuery(item.question || '');
    trace.steps.push({ type: 'decompose', subqueries });

    const all = [];
    let anyTimeout = false;
    for (const sub of subqueries) {
      const result = await runQuery(supabase, sub, trace);
      if (result.error) {
        errorCount += 1;
        const msg = String(result.error.message || '');
        if (msg.toLowerCase().includes('timeout')) anyTimeout = true;
        trace.steps.push({ type: 'error', message: msg });
        continue;
      }
      all.push(...result.data);
    }

    if (anyTimeout) timeoutCount += 1;

    const ranked = all
      .filter((r) => !isNoisePath(r.source_path))
      .map((r) => {
        const text = `${r.title || ''}\n${r.content || ''}`;
        const rewritten = rewriteQuery(item.question || '');
        const qTokens = tokenize(rewritten);
        const lexical = scoreHit(rewritten, r.content, r.title);
        const coverage = coverageCount(qTokens, text);
        const score = applySpecificityPenalty(lexical + (Math.min(coverage, 6) * 0.9), r.source_path, r.title);
        return { ...r, score, coverage };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    trace.steps.push({
      type: 'rank',
      top: ranked.slice(0, 3).map((r) => ({
        title: r.title,
        source_path: r.source_path,
        score: Number(r.score.toFixed(3)),
        coverage: r.coverage
      }))
    });

    const bundle = ranked.map((r) => `${r.title}\n${r.source_path}\n${r.content}`).join('\n');
    const ok = matchAny(bundle, item.mustIncludeAny || []);
    trace.outcome = ok ? 'pass' : 'fail';
    if (ok) pass += 1;

    traces.push(trace);
  }

  const total = evalSet.length;
  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      total,
      pass,
      fail: total - pass,
      passRate: total ? Number(((pass / total) * 100).toFixed(1)) : 0
    },
    reliability: {
      timeoutCount,
      timeoutRate: total ? Number(((timeoutCount / total) * 100).toFixed(1)) : 0,
      errorCount
    },
    traces
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(report, null, 2));
  console.log(`ToolQA-style pass: ${pass}/${total} (${report.totals.passRate}%)`);
  console.log(`Timeouts: ${timeoutCount}/${total} (${report.reliability.timeoutRate}%)`);
  console.log(`Saved report: ${path.relative(ROOT, OUT_PATH)}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
