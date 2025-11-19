#!/usr/bin/env node
// Build a lightweight index from Project Gutenberg Webster 1913 HTML
// Input: src/data/pg29765-h/pg29765-images.html
// Output: public/dictionaries/webster1913_index.json

const fs = require('fs');
const path = require('path');

function normalizeKey(s) {
  return (s || '').toLowerCase().replace(/[^a-z]/g, '');
}

function firstSentence(s) {
  const t = (s || '').replace(/\s+/g, ' ').trim();
  const m = t.match(/(.+?[\.!?])(\s|$)/);
  return m ? m[1] : t;
}

function build() {
  const htmlPath = path.join(process.cwd(), 'src', 'data', 'pg29765-h', 'pg29765-images.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('Not found:', htmlPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(htmlPath, 'utf8');
  const paras = raw.split(/<p>/i); // paragraph chunks
  const index = {};
  function clean(t) {
    return (t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function guessHead(prevText) {
    if (!prevText) return null;
    let t = clean(prevText);
    t = t.replace(/^[\d\s\.-]+/, ''); // drop leading markers
    // Stop at first bracket or semicolon
    t = t.split(/[:;\(\[]/)[0].trim();
    // If multiple words, take up to 4 to keep key short
    const words = t.split(/\s+/).filter(Boolean).slice(0, 4);
    let head = words.join(' ');
    head = head.replace(/[,\.]+$/, '').trim();
    if (!/[A-Za-z]/.test(head)) return null;
    if (head.length < 2) return null;
    return head;
  }
  for (let i = 1; i < paras.length; i++) {
    const paraHtml = paras[i];
    const content = paraHtml.split(/<\/p>/i)[0] || '';
    if (!/Defn:/i.test(content)) continue;
    // Look back 1-3 paragraphs for a headword line
    let head = null;
    for (let back = 1; back <= 3 && !head; back++) {
      const prevHtml = paras[i - back] || '';
      const prev = prevHtml.split(/<\/p>/i)[0] || prevHtml;
      const candidate = guessHead(prev);
      if (candidate && normalizeKey(candidate).length >= 2) head = candidate;
    }
    if (!head) continue;
    const key = normalizeKey(head);
    if (!key || index[key]) continue;
    const defText = firstSentence(clean(content.replace(/^.*?Defn:/i, '')));
    if (!defText || defText.length < 8) continue;
    index[key] = { headword: head, pos: null, def: defText };
    // Safety cap to avoid overly large payloads in dev
    if (Object.keys(index).length > 100000) break;
  }
  const outDir = path.join(process.cwd(), 'public', 'dictionaries');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'webster1913_index.json');
  fs.writeFileSync(outPath, JSON.stringify(index));
  console.log('Wrote', outPath, 'entries:', Object.keys(index).length);
}

build();
