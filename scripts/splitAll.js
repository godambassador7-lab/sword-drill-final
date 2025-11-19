#!/usr/bin/env node
// Splits any known translation JSONs found under src/data into per-book files.

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAP = [
  { file: 'src/data/kjv.json', code: 'kjv' },
  { file: 'src/data/web.json', code: 'web' },
  { file: 'src/data/asv.json', code: 'asv' },
  { file: 'src/data/NIV_bible.json', code: 'niv' },
  { file: 'src/data/NLT_bible.json', code: 'nlt' },
  { file: 'src/data/YLT_bible.json', code: 'ylt' },
  { file: 'src/data/ESV_bible.json', code: 'esv' }, // optional local ESV
];

const splitter = path.join(process.cwd(), 'scripts', 'splitBibleJson.js');
if (!fs.existsSync(splitter)) {
  console.error('[splitAll] splitter not found at', splitter);
  process.exit(1);
}

let any = false;
for (const { file, code } of MAP) {
  const abs = path.join(process.cwd(), file);
  if (!fs.existsSync(abs)) {
    console.log(`[skip] ${file} not found`);
    continue;
    }
  console.log(`[split] ${file} -> ${code}`);
  const res = spawnSync(process.execPath, [splitter, abs, code], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.warn(`[warn] Split failed for ${file}`);
  } else {
    any = true;
  }
}

if (!any) {
  console.log('[splitAll] No known JSON files found in src/data.');
}

