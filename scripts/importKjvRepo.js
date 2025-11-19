#!/usr/bin/env node
/**
 * Imports the KJV JSON from the GitHub repo into public/bible/kjv as per‑book files.
 *
 * Usage:
 *   node scripts/importKjvRepo.js [repoUrl]
 *
 * Defaults to: https://github.com/farskipper/kjv
 *
 * Requirements: git (recommended). If git is missing, the script will instruct you
 * to download a ZIP and re‑run the splitter for the JSON manually.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_DEFAULT = 'https://github.com/farskipper/kjv';
const DEST_REPO_DIR = path.join(process.cwd(), 'external', 'kjv');
const PUBLIC_KJV_DIR = path.join(process.cwd(), 'public', 'bible', 'kjv');

function log(msg) { console.log(`[import-kjv] ${msg}`); }
function warn(msg) { console.warn(`[import-kjv] ${msg}`); }
function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  return res.status === 0;
}

function findJsonFiles(startDir) {
  const results = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.json')) results.push(p);
    }
  }
  walk(startDir);
  return results;
}

function looksLikeFullBible(json) {
  // Accept common shapes: { books:[{name,chapters}] } or top-level book objects
  if (Array.isArray(json?.books)) return true;
  const keys = Object.keys(json || {});
  const hasBooks = keys.some(k => /genesis|exodus|leviticus|matthew|john/i.test(k));
  const valueIsObj = hasBooks && typeof json[keys[0]] === 'object';
  return hasBooks && valueIsObj;
}

function trySplit(jsonPath) {
  log(`Splitting full Bible JSON: ${path.relative(process.cwd(), jsonPath)}`);
  const splitter = path.join(process.cwd(), 'scripts', 'splitBibleJson.js');
  if (!fs.existsSync(splitter)) {
    warn('splitBibleJson.js not found. Aborting split.');
    return false;
  }
  ensureDir(PUBLIC_KJV_DIR);
  const ok = run(process.execPath, [splitter, jsonPath, 'kjv']);
  if (!ok) {
    warn('Split failed. Please run the command manually as shown above.');
  }
  return ok;
}

function maybeCopyPerBook(files) {
  // Detect if these look like per‑book files (e.g., Genesis.json ... Revelation.json)
  const names = files.map(f => path.basename(f).toLowerCase());
  const hasGenesis = names.some(n => n.includes('genesis'));
  const hasJohn = names.some(n => /^john\.json$/.test(n) || n.includes('john'));
  if (!hasGenesis && !hasJohn) return false;
  ensureDir(PUBLIC_KJV_DIR);
  let copied = 0;
  for (const f of files) {
    const base = path.basename(f);
    const dest = path.join(PUBLIC_KJV_DIR, base);
    try {
      fs.copyFileSync(f, dest);
      copied++;
    } catch (e) {
      warn(`Failed to copy ${base}: ${e.message}`);
    }
  }
  log(`Copied ${copied} JSON files into public/bible/kjv/`);
  return copied > 0;
}

async function main() {
  const repoUrl = process.argv[2] || REPO_DEFAULT;
  ensureDir(path.dirname(DEST_REPO_DIR));

  if (fs.existsSync(DEST_REPO_DIR)) {
    log(`Repo dir exists: ${path.relative(process.cwd(), DEST_REPO_DIR)} — pulling latest`);
    if (!run('git', ['-C', DEST_REPO_DIR, 'pull', '--ff-only'])) {
      warn('git pull failed. Proceeding with existing files.');
    }
  } else {
    log(`Cloning ${repoUrl} into external/kjv`);
    const ok = run('git', ['clone', '--depth=1', repoUrl, DEST_REPO_DIR]);
    if (!ok) {
      warn('git clone failed. If git is not installed or blocked, download the ZIP from the repo page, extract to external/kjv, and rerun this script.');
      process.exit(1);
    }
  }

  // Search for JSON files inside the cloned repo
  const jsonFiles = findJsonFiles(DEST_REPO_DIR);
  if (jsonFiles.length === 0) {
    warn('No JSON files found in the repo. Please check the repository contents.');
    process.exit(2);
  }

  // Try to detect a full‑bible JSON file to split
  for (const f of jsonFiles) {
    try {
      const raw = fs.readFileSync(f, 'utf8');
      const data = JSON.parse(raw);
      if (looksLikeFullBible(data)) {
        const ok = trySplit(f);
        if (ok) return;
      }
    } catch (_) {
      // ignore parse errors, might be per‑book files
    }
  }

  // Otherwise, treat as per‑book and copy
  const copied = maybeCopyPerBook(jsonFiles);
  if (!copied) {
    warn('Could not identify format automatically. You can manually run the splitter on a full JSON:');
    console.log('  npm run split:kjv   # or');
    console.log('  node scripts/splitBibleJson.js <path-to-kjv.json> kjv');
    process.exit(3);
  }

  log('KJV import complete. Try references like "Genesis 1:1" in SHARP.');
}

main().catch(err => {
  console.error('[import-kjv] Unexpected error:', err);
  process.exit(99);
});
