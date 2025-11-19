#!/usr/bin/env node
// Convert Project Gutenberg Apocrypha HTML to per-book JSON files
// Input: src/data/Aprocrypha.html
// Output: public/apocrypha/<Book>.json with { book, chapters: { ch: { vs: text } } }

const fs = require('fs');
const path = require('path');

const INPUT = path.join(process.cwd(), 'src', 'data', 'Aprocrypha.html');
const OUTDIR = path.join(process.cwd(), 'public', 'apocrypha');

const BOOK_NAME_MAP = new Map([
  ['The First Book of Esdras', '1 Esdras'],
  ['The Second Book of Esdras', '2 Esdras'],
  ['The Book of Tobit', 'Tobit'],
  ['The Book of Judith', 'Judith'],
  ['The Greek Additions to Esther', 'Additions to Esther'],
  ['The Book of Wisdom', 'Wisdom of Solomon'],
  ['The Book of Sirach (or Ecclesiasticus)', 'Sirach'],
  ['The Book of Baruch', 'Baruch'],
  ['The Epistle [or Letter] of Jeremiah [Jeremy]', 'Letter of Jeremiah'],
  ['The Song of the Three Holy Children', 'Song of the Three Holy Children'],
  ['The Book of Susanna [in Daniel]', 'Susanna'],
  ['The History of the Destruction of Bel and the Dragon', 'Bel and the Dragon'],
  ['The Prayer of Manasses King of Judah', 'Prayer of Manasseh'],
  ['The First Book of the Maccabees', '1 Maccabees'],
  ['The Second Book of the Maccabees', '2 Maccabees'],
]);

function cleanHtmlToText(html) {
  return String(html || '')
    .replace(/<br\s*\/?>(\s*)/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitBooks(raw) {
  // Find all <h2> ... </h2> blocks to mark book titles
  const h2Regex = /<h2>([\s\S]*?)<\/h2>/gi;
  let m;
  const blocks = [];
  const positions = [];
  while ((m = h2Regex.exec(raw)) !== null) {
    positions.push({ start: m.index, end: h2Regex.lastIndex, titleHtml: m[1] });
  }
  for (let i = 0; i < positions.length; i++) {
    const t = positions[i];
    const next = positions[i + 1] || { start: raw.length };
    let title = cleanHtmlToText(t.titleHtml)
      .replace(/\[.*?\]/g, '') // drop bracketed alternates
      .replace(/\s+/g, ' ')
      .replace(/\]+$/g, '')
      .trim();
    if (title.toLowerCase() === 'contents') continue;
    // Direct map or contains-based normalization
    let norm = BOOK_NAME_MAP.get(title) || title;
    const low = title.toLowerCase();
    if (BOOK_NAME_MAP.has(title) === false) {
      if (low.includes('epistle') && low.includes('jerem')) norm = 'Letter of Jeremiah';
      else if (low.includes('susanna')) norm = 'Susanna';
      else if (low.includes('song of') && low.includes('holy children')) norm = 'Song of the Three Holy Children';
    }
    const body = raw.slice(t.end, next.start);
    blocks.push({ title: norm, body });
  }
  return blocks;
}

function parseVerses(text) {
  // Heuristic: verses appear as "ch:vs" like 1:1, 1:2 ...
  // We'll capture pairs of marker and following text until next marker.
  const chapters = {};
  const rx = /\b(\d{1,3}):(\d{1,3})\b/g;
  let last = null;
  const positions = [];
  let m;
  while ((m = rx.exec(text)) !== null) {
    positions.push({ idx: m.index, ch: parseInt(m[1], 10), vs: parseInt(m[2], 10) });
  }
  for (let i = 0; i < positions.length; i++) {
    const cur = positions[i];
    const next = positions[i + 1];
    const sliceStart = cur.idx + `${cur.ch}:${cur.vs}`.length;
    const sliceEnd = next ? next.idx : text.length;
    let verseText = text.slice(sliceStart, sliceEnd);
    verseText = verseText.replace(/^[\s\)\]\.:;,-]+/, '').trim();
    if (!chapters[cur.ch]) chapters[cur.ch] = {};
    if (!chapters[cur.ch][cur.vs]) chapters[cur.ch][cur.vs] = verseText;
  }
  return chapters;
}

function writeBook(name, chapters) {
  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
  const file = path.join(OUTDIR, `${name}.json`);
  const obj = { book: name, chapters };
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8');
  console.log('Wrote', file);
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Not found:', INPUT);
    process.exit(1);
  }
  const raw = fs.readFileSync(INPUT, 'utf8');
  const books = splitBooks(raw);
  if (!books.length) {
    console.error('No book blocks found');
    process.exit(2);
  }
  for (const b of books) {
    const text = cleanHtmlToText(b.body);
    const chapters = parseVerses(text);
    // Only write if we found verse markers; some headings may be editorial
    const nonEmpty = Object.keys(chapters).length > 0;
    if (nonEmpty) writeBook(b.title, chapters);
  }
}

main();
