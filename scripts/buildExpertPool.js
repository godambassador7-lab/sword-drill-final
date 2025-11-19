#!/usr/bin/env node
// Build a curated Expert pool (2000 unique references) for a translation
// Usage: node scripts/buildExpertPool.js <TRANSLATION_CODE>
// Codes: kjv, web, asv, niv, nlt, ylt, esv, bishops, geneva

const fs = require('fs');
const path = require('path');

const CODE_ALIASES = {
  KJV: 'kjv', NKJV: 'kjv', WEB: 'web', ASV: 'asv', NIV: 'niv', NLT: 'nlt', YLT: 'ylt', ESV: 'esv', BISHOPS: 'bishops', GENEVA: 'geneva'
};

const BOOK_NAME_BY_CODE = {
  GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers', DEU: 'Deuteronomy',
  JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
  '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles',
  EZR: 'Ezra', NEH: 'Nehemiah', EST: 'Esther', JOB: 'Job', PSA: 'Psalms', PRO: 'Proverbs',
  ECC: 'Ecclesiastes', SNG: 'Song of Solomon', ISA: 'Isaiah', JER: 'Jeremiah', LAM: 'Lamentations',
  EZK: 'Ezekiel', DAN: 'Daniel', HOS: 'Hosea', JOL: 'Joel', AMO: 'Amos', OBA: 'Obadiah',
  JON: 'Jonah', MIC: 'Micah', NAM: 'Nahum', HAB: 'Habakkuk', ZEP: 'Zephaniah', HAG: 'Haggai',
  ZEC: 'Zechariah', MAL: 'Malachi', MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JOH: 'John',
  ACT: 'Acts', ROM: 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians', GAL: 'Galatians',
  EPH: 'Ephesians', PHP: 'Philippians', COL: 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians',
  '1TI': '1 Timothy', '2TI': '2 Timothy', TIT: 'Titus', PHM: 'Philemon', HEB: 'Hebrews', JAS: 'James',
  '1PE': '1 Peter', '2PE': '2 Peter', '1JN': '1 John', '2JN': '2 John', '3JN': '3 John', JUD: 'Jude', REV: 'Revelation'
};

const EXPERT_CODES = [
  'GEN','EXO','DEU','JOS','1SA','2SA','1KI','2KI','PSA','PRO','ISA','JER','EZK','DAN','MAT','MRK','LUK','JOH','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'
];

function normalizeRef(r){ return String(r||'').replace(/\s+/g,' ').trim(); }

function extractArrayFromFile(filePath, varName){
  const txt = fs.readFileSync(filePath,'utf8');
  const re = new RegExp(`export\\s+const\\s+${varName}\\s*=\\s*\\[(.*?)\\];`,`s`);
  const m = txt.match(re);
  if(!m) return [];
  const body = m[1];
  const refs = [];
  const qre = /"([^"]+?)"/g;
  let mm;
  while((mm=qre.exec(body))){ refs.push(normalizeRef(mm[1])); }
  return refs;
}

function loadExcludedRefs(){
  const svc = path.join(process.cwd(),'src','services','bibleApiService.js');
  if(!fs.existsSync(svc)) return new Set();
  const a = extractArrayFromFile(svc,'APPRENTICE_VERSES');
  const b = extractArrayFromFile(svc,'INTERMEDIATE_VERSES');
  return new Set([...a,...b]);
}

function readBook(folder, bookName){
  const file = path.join(folder, `${bookName}.json`);
  if(!fs.existsSync(file)) return null;
  try{ return JSON.parse(fs.readFileSync(file,'utf8')); }catch{ return null; }
}

function gatherRefsFromBook(folder, bookName){
  const j = readBook(folder, bookName); if(!j||!j.chapters) return [];
  const out=[]; for(const ch of Object.keys(j.chapters)){
    for(const vs of Object.keys(j.chapters[ch])){ out.push(`${bookName} ${ch}:${vs}`); }
  }
  return out;
}

function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]] } return arr; }

function buildFor(code){
  const folder = path.join(process.cwd(),'public','bible',code);
  if(!fs.existsSync(folder)) { console.warn(`[expert] Missing folder ${folder}`); return; }
  const excluded = loadExcludedRefs();
  const names = EXPERT_CODES.map(c=>BOOK_NAME_BY_CODE[c]).filter(Boolean);
  let all=[]; for(const n of names){ all = all.concat(gatherRefsFromBook(folder, n)); }
  const uniq = Array.from(new Set(all.map(normalizeRef))).filter(r=>!excluded.has(r));
  const pool = shuffle(uniq).slice(0,2000);
  const out = path.join(folder,'expert_pool.json');
  fs.writeFileSync(out, JSON.stringify(pool,null,2),'utf8');
  console.log(`[expert] ${code}: wrote ${pool.length} refs to ${out}`);
}

function main(){
  const arg = (process.argv[2]||'').toUpperCase();
  if(!arg){ console.error('Usage: node scripts/buildExpertPool.js <TRANSLATION_CODE>'); process.exit(1); }
  const code = CODE_ALIASES[arg] || arg.toLowerCase();
  buildFor(code);
}

main();

