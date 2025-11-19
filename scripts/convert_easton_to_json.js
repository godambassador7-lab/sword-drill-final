#!/usr/bin/env node
// Normalize various Easton Bible Dictionary inputs to a common JSON shape
// Output: public/dictionaries/easton.json with entries as an array of {headword, def, pos?}

const fs = require('fs');
const path = require('path');

function outDir() {
  return path.join(process.cwd(), 'public', 'dictionaries');
}

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function writeOut(entries) {
  ensureDir(outDir());
  const out = path.join(outDir(), 'easton.json');
  fs.writeFileSync(out, JSON.stringify(entries, null, 2), 'utf8');
  console.log('Wrote', out, 'entries:', entries.length);
}

function normalizeFromObject(obj) {
  const arr = [];
  for (const k of Object.keys(obj || {})) {
    const v = obj[k];
    const head = v?.headword || k;
    const def = v?.def || v?.definition || (typeof v === 'string' ? v : '');
    const pos = v?.pos || null;
    if (!head || !def) continue;
    arr.push({ headword: head, def, pos });
  }
  return arr;
}

function normalizeFromArray(arr) {
  return (arr || [])
    .map(e => ({
      headword: e?.headword || e?.title || e?.term,
      def: Array.isArray(e?.info) ? e.info.join(' ') : (e?.def || e?.definition || e?.text || ''),
      pos: e?.pos || null
    }))
    .filter(e => e.headword && e.def);
}

function cleanText(html) {
  return String(html || '')
    .replace(/<br\s*\/?>(\s*)/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseHtml(raw) {
  // Very naive: split by <b>headword</b> blocks or <h2>/<h3>
  const entries = [];
  const byB = raw.split(/<b>/i);
  if (byB.length > 1) {
    for (let i = 1; i < byB.length; i++) {
      const chunk = byB[i];
      const head = cleanText((chunk.split(/<\/b>/i)[0] || '').slice(0, 120));
      const after = chunk.split(/<\/b>/i)[1] || '';
      const def = cleanText((after.split(/<b>/i)[0] || '').slice(0, 8000));
      if (head && def) entries.push({ headword: head, def });
    }
    return entries;
  }
  // headings fallback
  const headChunks = raw.split(/<h[23][^>]*>/i);
  if (headChunks.length > 1) {
    for (let i = 1; i < headChunks.length; i++) {
      const chunk = headChunks[i];
      const head = cleanText(chunk.split(/<\/h[23]>/i)[0] || '');
      const after = chunk.split(/<\/h[23]>/i)[1] || '';
      const def = cleanText((after.split(/<h[23][^>]*>/i)[0] || '').slice(0, 8000));
      if (head && def) entries.push({ headword: head, def });
    }
  }
  return entries;
}

function main() {
  const arg = process.argv[2];
  const candidates = [
    path.join(process.cwd(), 'src', 'data', 'easton.json'),
    path.join(process.cwd(), 'src', 'data', 'eastons.json'),
    path.join(process.cwd(), 'src', 'data', 'easton_bible_dictionary.json'),
    path.join(process.cwd(), 'src', 'data', 'easton.html'),
    path.join(process.cwd(), 'src', 'data', 'eastons.html')
  ];
  let src = null;
  if (arg && fs.existsSync(arg)) {
    src = arg;
  } else {
    for (const p of candidates) { if (fs.existsSync(p)) { src = p; break; } }
  }
  if (!src) {
    console.error('No Easton source found. Provide a path argument or place a JSON (object/array) or HTML file under src/data (easton*.json/html).');
    process.exit(1);
  }
  let text = fs.readFileSync(src, 'utf8');
  // Pre-clean for non-JSON constructs like ObjectId("...") seen in some dumps
  text = text.replace(/"_id"\s*:\s*ObjectId\("[^"]*"\)\s*,?/g, '');
  let entries = [];
  try {
    const asJson = JSON.parse(text);
    entries = Array.isArray(asJson)
      ? normalizeFromArray(asJson)
      : normalizeFromObject(asJson);
  } catch (_) {
    // Not JSON, try HTML
    entries = parseHtml(text);
  }
  if (!entries.length) {
    console.error('Parsed 0 entries from', src);
    process.exit(2);
  }
  writeOut(entries);
}

main();
