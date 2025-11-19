#!/usr/bin/env node
// Build per-book JSON files from public/bible/<code>/verses.json produced by some datasets.
// Usage:
//   node scripts/splitFromVersesJson.js <code>
// where <code> is one of: kjv, web, asv (or any folder name under public/bible)

const fs = require('fs');
const path = require('path');

function cleanText(s) {
  if (!s) return '';
  // Drop leading control characters and odd markers like "A\u0014 " seen in some KJV dumps
  return String(s).replace(/^[\x00-\x1F]+/g, '').replace(/^A\u0014\s*/g, '').trim();
}

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

function toBookFile(book, chapters) {
  return { book, chapters };
}

function split(code) {
  const base = path.join(process.cwd(), 'public', 'bible', code);
  const versesPath = path.join(base, 'verses.json');
  if (!fs.existsSync(versesPath)) {
    console.error(`[splitFromVerses] Not found: ${versesPath}`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(versesPath, 'utf8'));
  const entries = raw?.chapters || {};
  const byBook = new Map();
  for (const key of Object.keys(entries)) {
    const v = entries[key];
    const book = v.book_name?.toString()?.trim();
    const ch = String(v.chapter);
    const vs = String(v.verse);
    const tx = cleanText(v.text);
    if (!book || !ch || !vs) continue;
    if (!byBook.has(book)) byBook.set(book, {});
    const chapters = byBook.get(book);
    if (!chapters[ch]) chapters[ch] = {};
    chapters[ch][vs] = tx;
  }
  let wrote = 0;
  for (const [book, chapters] of byBook.entries()) {
    const out = toBookFile(book, chapters);
    const file = path.join(base, `${book}.json`);
    fs.writeFileSync(file, JSON.stringify(out, null, 2), 'utf8');
    wrote++;
  }
  console.log(`[splitFromVerses] Wrote ${wrote} book files to ${base}`);
}

function main() {
  const code = (process.argv[2] || '').toLowerCase();
  if (!code) {
    console.error('Usage: node scripts/splitFromVersesJson.js <code>');
    process.exit(1);
  }
  split(code);
}

main();

