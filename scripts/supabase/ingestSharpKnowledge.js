/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_SOURCES = [
  'README.md',
  'public/bibles',
  'public/bible',
  'public/apocrypha',
  'public/Biblical_Archaeology_Full_Course_Cited',
  'public/Sword_Drill_World_Religions_Course',
  'public/SwordDrill_Associate_Exegetical_Methods',
  'public/understanding_textual_criticism_full',
  'src/data'
];

const MAX_FILE_BYTES = 30 * 1024 * 1024; // 30 MB per file
const DEFAULT_TARGET_MB = 900;
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 180;
const DEFAULT_BATCH_SIZE = 250;

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'build',
  'reports',
  '.vercel'
]);

const TEXT_EXTENSIONS = new Set([
  '.md',
  '.txt',
  '.json',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.html',
  '.csv'
]);

const IGNORE_PATH_PATTERNS = [
  /[\\/]src[\\/]data[\\/]noto-emoji-2\.051[\\/]/i,
  /[\\/]third_party[\\/]region-flags[\\/]/i
];

function extractBookFromPath(rel = '', title = '') {
  const source = `${rel} ${title}`.toLowerCase();
  const match = source.match(/\b(genesis|exodus|leviticus|numbers|deuteronomy|joshua|judges|ruth|samuel|kings|chronicles|ezra|nehemiah|esther|job|psalm|psalms|proverbs|ecclesiastes|song of solomon|isaiah|jeremiah|lamentations|ezekiel|daniel|hosea|joel|amos|obadiah|jonah|micah|nahum|habakkuk|zephaniah|haggai|zechariah|malachi|matthew|mark|luke|john|acts|romans|corinthians|galatians|ephesians|philippians|colossians|thessalonians|timothy|titus|philemon|hebrews|james|peter|jude|revelation|tobit|judith|maccabees|sirach|baruch|wisdom)\b/);
  return match ? match[1] : null;
}

function extractChapterFromPath(rel = '', title = '') {
  const source = `${rel}/${title}`;
  const cMatch = source.match(/(?:chapter|ch|c)[ _-]?(\d{1,3})/i);
  if (cMatch) return Number(cMatch[1]);
  const simple = source.match(/(?:^|[\\/ _-])(\d{1,3})(?:\.[a-z0-9]+)?$/i);
  if (simple) return Number(simple[1]);
  return null;
}

function inferTranslation(rel = '', title = '') {
  const source = `${rel} ${title}`.toLowerCase();
  if (/\bkjv\b/.test(source)) return 'KJV';
  if (/\basv\b/.test(source)) return 'ASV';
  if (/\bweb\b/.test(source)) return 'WEB';
  if (/\bylt\b/.test(source)) return 'YLT';
  if (/\besv\b/.test(source)) return 'ESV';
  if (/\bwlc\b/.test(source) || /masoretic/.test(source)) return 'WLC';
  if (/\blxx\b|septuagint/.test(source)) return 'LXX';
  if (/sinaiticus/.test(source)) return 'SINAITICUS';
  return null;
}

function inferTopic(rel = '', title = '') {
  const source = `${rel} ${title}`.toLowerCase();
  if (/theology|doctrine|hermeneutics|apologetics/.test(source)) return 'theology';
  if (/history|archaeology|canon|textual_criticism/.test(source)) return 'history';
  if (/greek|hebrew|aramaic|lexicon|strong/.test(source)) return 'languages';
  if (/quiz|study_plan|study plan|memory/.test(source)) return 'app_features';
  if (/bible|apocrypha|wlc|lxx|sinaiticus/.test(source)) return 'scripture';
  return 'general';
}

function inferCourse(rel = '') {
  const m = rel.match(/(course[^/]*|courses\/[^/]+|understanding_textual_criticism_full|Sword_Drill_World_Religions_Course|SwordDrill_Associate_Exegetical_Methods)/i);
  return m ? m[1] : null;
}

function buildMetadata(filePath, rel, title) {
  return {
    ext: path.extname(filePath).toLowerCase().slice(1),
    sourceCategory: rel.split('/')[0] || 'root',
    book: extractBookFromPath(rel, title),
    chapter: extractChapterFromPath(rel, title),
    translation: inferTranslation(rel, title),
    topic: inferTopic(rel, title),
    course: inferCourse(rel)
  };
}

function getArgValue(name, fallback = null) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((x) => x.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function toBytes(text) {
  return Buffer.byteLength(text || '', 'utf8');
}

function safeRelative(p) {
  return p.replace(PROJECT_ROOT, '').replace(/^[\\/]/, '').replace(/\\/g, '/');
}

function shouldIncludeFile(filePath, stat) {
  const normalized = filePath.replace(/\\/g, '/');
  if (IGNORE_PATH_PATTERNS.some((rx) => rx.test(normalized))) return false;
  const ext = path.extname(filePath).toLowerCase();
  if (!TEXT_EXTENSIONS.has(ext)) return false;
  if (stat.size <= 0 || stat.size > MAX_FILE_BYTES) return false;
  return true;
}

function collectFiles(startPath, out = []) {
  if (!fs.existsSync(startPath)) return out;

  const stat = fs.statSync(startPath);
  if (stat.isFile()) {
    if (shouldIncludeFile(startPath, stat)) out.push(startPath);
    return out;
  }

  const entries = fs.readdirSync(startPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(startPath, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      collectFiles(full, out);
      continue;
    }
    const entryStat = fs.statSync(full);
    if (shouldIncludeFile(full, entryStat)) out.push(full);
  }
  return out;
}

function flattenJsonStrings(value, out = []) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length >= 2) out.push(trimmed);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) flattenJsonStrings(item, out);
    return out;
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) flattenJsonStrings(value[key], out);
  }
  return out;
}

function readTextContent(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const raw = fs.readFileSync(filePath, 'utf8');
  if (ext !== '.json') {
    return raw;
  }

  try {
    const parsed = JSON.parse(raw);
    const strings = flattenJsonStrings(parsed);
    return strings.join('\n');
  } catch {
    return raw;
  }
}

function normalizeWhitespace(input) {
  return input
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function buildChunks(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const clean = normalizeWhitespace(text);
  if (!clean) return [];

  const blocks = clean
    .split(/\n{2,}/g)
    .map((b) => b.trim())
    .filter(Boolean);

  const chunks = [];
  let current = '';

  const pushCurrent = () => {
    const value = current.trim();
    if (value.length > 60) chunks.push(value);
    current = '';
  };

  for (const block of blocks) {
    const isHeaderLike = /^#{1,6}\s|^[A-Z][A-Z0-9 _:-]{6,}$/.test(block);
    const isVerseLike = /^\d{1,3}[:.]\d{1,3}\s/.test(block) || /^[1-3]?\s?[A-Za-z]+\s+\d{1,3}:\d{1,3}/.test(block);

    // Start a fresh chunk at hard semantic boundaries
    if ((isHeaderLike || isVerseLike) && current.length > Math.floor(chunkSize * 0.6)) {
      pushCurrent();
    }

    const candidate = current ? `${current}\n\n${block}` : block;
    if (candidate.length <= chunkSize) {
      current = candidate;
      continue;
    }

    // Flush current and split oversized blocks sentence-first
    if (current) pushCurrent();
    if (block.length <= chunkSize) {
      current = block;
      continue;
    }

    const sentences = block.split(/(?<=[.!?])\s+/g);
    let sentenceChunk = '';
    for (const sentence of sentences) {
      const merged = sentenceChunk ? `${sentenceChunk} ${sentence}` : sentence;
      if (merged.length <= chunkSize) {
        sentenceChunk = merged;
      } else {
        if (sentenceChunk.trim().length > 60) chunks.push(sentenceChunk.trim());
        sentenceChunk = sentence;
      }
    }
    if (sentenceChunk.trim().length > 60) chunks.push(sentenceChunk.trim());
  }

  if (current) pushCurrent();

  // Add lightweight overlap to preserve continuity between adjacent chunks
  const withOverlap = [];
  for (let i = 0; i < chunks.length; i++) {
    if (i === 0) {
      withOverlap.push(chunks[i]);
      continue;
    }
    const prevTail = chunks[i - 1].slice(-overlap).trim();
    const merged = `${prevTail}\n${chunks[i]}`.trim();
    withOverlap.push(merged.length <= chunkSize + overlap ? merged : chunks[i]);
  }

  return withOverlap;
}

async function insertBatch(supabase, rows) {
  if (!rows.length) return;
  const { error } = await supabase
    .from('sharp_kb_chunks')
    .upsert(rows, { onConflict: 'source_path,chunk_index' });
  if (error) {
    throw new Error(`Supabase upsert failed: ${error.message}`);
  }
}

async function main() {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing env vars: REACT_APP_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  }

  const targetMB = Number(getArgValue('target-mb', String(DEFAULT_TARGET_MB)));
  const parsedBatchSize = Number(getArgValue('batch-size', String(DEFAULT_BATCH_SIZE)));
  const batchSize = Number.isFinite(parsedBatchSize) ? Math.max(1, parsedBatchSize) : DEFAULT_BATCH_SIZE;
  const targetBytes = Math.floor(targetMB * 1024 * 1024);
  const sourceArg = getArgValue('sources');
  const sourceList = sourceArg
    ? sourceArg.split(',').map((p) => p.trim()).filter(Boolean)
    : DEFAULT_SOURCES;
  const reset = hasFlag('reset');

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  if (reset) {
    console.log('Resetting sharp_kb_chunks...');
    const { error } = await supabase.from('sharp_kb_chunks').delete().gt('chunk_index', -1);
    if (error) {
      throw new Error(`Reset failed: ${error.message}`);
    }
  }

  const files = [];
  for (const rel of sourceList) {
    const abs = path.join(PROJECT_ROOT, rel);
    collectFiles(abs, files);
  }

  files.sort((a, b) => safeRelative(a).localeCompare(safeRelative(b)));

  console.log(`Found ${files.length} candidate files`);
  console.log(`Target budget: ${targetMB} MB`);

  const pendingRows = [];
  let insertedBytes = 0;
  let insertedRows = 0;
  let processedFiles = 0;

  for (const filePath of files) {
    if (insertedBytes >= targetBytes) break;

    const rel = safeRelative(filePath);
    const title = path.basename(filePath);
    const baseMetadata = buildMetadata(filePath, rel, title);

    let text = '';
    try {
      text = readTextContent(filePath);
    } catch {
      continue;
    }
    const chunks = buildChunks(text);
    if (!chunks.length) continue;

    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];
      const bytes = toBytes(content);
      if (insertedBytes + bytes > targetBytes) break;

      pendingRows.push({
        source_path: rel,
        title,
        chunk_index: i,
        content,
        content_length: content.length,
        metadata: baseMetadata
      });

      insertedBytes += bytes;
      insertedRows += 1;

      if (pendingRows.length >= batchSize) {
        await insertBatch(supabase, pendingRows.splice(0, pendingRows.length));
        console.log(`Inserted rows: ${insertedRows} | Approx text bytes: ${insertedBytes}`);
      }
    }

    processedFiles += 1;
  }

  if (pendingRows.length) {
    await insertBatch(supabase, pendingRows);
  }

  console.log('Done.');
  console.log(`Processed files: ${processedFiles}`);
  console.log(`Inserted rows: ${insertedRows}`);
  console.log(`Approx ingested text: ${(insertedBytes / (1024 * 1024)).toFixed(2)} MB`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
