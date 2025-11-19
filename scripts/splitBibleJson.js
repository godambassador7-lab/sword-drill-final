#!/usr/bin/env node
// Splits a full Bible JSON into per‑book files under public/bible/<translation>/
// Usage: node scripts/splitBibleJson.js <input.json> <kjv|web>

const fs = require('fs');
const path = require('path');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function writeBook(outDir, name, chaptersObj) {
  const data = { book: name, chapters: chaptersObj };
  const file = path.join(outDir, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log('Wrote', file);
}

function normalizeChapters(chapters) {
  // Accept arrays or objects; convert to object of chapter->verse->text
  if (Array.isArray(chapters)) {
    const obj = {};
    chapters.forEach((verses, idx) => {
      const chNum = String(idx + 1);
      if (Array.isArray(verses)) {
        const vobj = {};
        verses.forEach((txt, vIdx) => { vobj[String(vIdx + 1)] = txt; });
        obj[chNum] = vobj;
      } else if (typeof verses === 'object') {
        obj[chNum] = verses;
      }
    });
    return obj;
  }
  return chapters; // assume object already
}

function main() {
  const [,, inputPath, translation] = process.argv;
  if (!inputPath || !translation) {
    console.error('Usage: node scripts/splitBibleJson.js <input.json> <kjv|web>');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const outDir = path.join(process.cwd(), 'public', 'bible', translation.toLowerCase());
  ensureDir(outDir);

  // Common shapes:
  // 1) { books:[ { name, chapters:[ ["v1","v2"], ... ] }, ... ] }
  // 2) { Genesis:{ '1':{'1':'...'}, ... }, 'Exodus':{...} }
  if (Array.isArray(raw.books)) {
    raw.books.forEach(b => writeBook(outDir, b.name, normalizeChapters(b.chapters)));
    return;
  }
  const bookNames = Object.keys(raw);
  const looksLikeBooks = bookNames.every(k => typeof raw[k] === 'object');
  if (looksLikeBooks) {
    bookNames.forEach(name => {
      const chapters = normalizeChapters(raw[name].chapters || raw[name]);
      writeBook(outDir, name, chapters);
    });
    return;
  }
  console.error('Unrecognized input format. Expect {books:[...]} or top-level book objects.');
  process.exit(2);
}

main();

