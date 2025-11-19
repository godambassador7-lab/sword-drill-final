#!/usr/bin/env node
// Copies an Easton Bible Dictionary JSON file from src/data into public/dictionaries
// Accepts either key->entry shape or array of {headword, def}

const fs = require('fs');
const path = require('path');

function publish() {
  const candidates = [
    path.join(process.cwd(), 'src', 'data', 'easton.json'),
    path.join(process.cwd(), 'src', 'data', 'eastons.json'),
    path.join(process.cwd(), 'src', 'data', 'easton_bible_dictionary.json')
  ];
  let found = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) { found = p; break; }
  }
  if (!found) {
    console.error('No Easton dictionary JSON found in src/data (looked for easton.json, eastons.json, easton_bible_dictionary.json)');
    process.exit(1);
  }
  const outDir = path.join(process.cwd(), 'public', 'dictionaries');
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, 'easton.json');
  fs.copyFileSync(found, out);
  console.log('Published Easton dictionary to', out);
}

publish();
