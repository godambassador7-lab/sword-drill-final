/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '..', '..');
const EVAL_PATH = path.join(ROOT, 'reports', 'sharp-golden-eval.json');

function tokenize(input) {
  return (input || '').toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean);
}

function matchAny(text, tokens) {
  const lower = (text || '').toLowerCase();
  return (tokens || []).some((t) => lower.includes((t || '').toLowerCase()));
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
    const qTokens = tokenize(item.question).slice(0, 6);
    const orFilter = qTokens.map((t) => `content.ilike.%${t}%`).join(',');
    const { data, error } = await supabase
      .from('sharp_kb_chunks')
      .select('source_path,title,content')
      .or(orFilter)
      .limit(10);

    if (error) {
      failures.push({ id: item.id, reason: error.message });
      continue;
    }

    const bundle = (data || []).map((r) => `${r.title}\n${r.source_path}\n${r.content}`).join('\n');
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

