import { parseReference } from './assistant/referenceParser';

const BOOK_SLUGS = {
  'GENESIS': 'genesis',
  'EXODUS': 'exodus',
  'LEVITICUS': 'leviticus',
  'NUMBERS': 'numbers',
  'DEUTERONOMY': 'deuteronomy',
  'JOSHUA': 'joshua',
  'JUDGES': 'judges',
  'RUTH': 'ruth',
  '1 SAMUEL': 'i_samuel',
  '2 SAMUEL': 'ii_samuel',
  '1 KINGS': 'i_kings',
  '2 KINGS': 'ii_kings',
  '1 CHRONICLES': 'i_chronicles',
  '2 CHRONICLES': 'ii_chronicles',
  'EZRA': 'ezra',
  'NEHEMIAH': 'nehemiah',
  'ESTHER': 'esther',
  'JOB': 'job',
  'PSALMS': 'psalms',
  'PSALM': 'psalms',
  'PROVERBS': 'proverbs',
  'ECCLESIASTES': 'ecclesiastes',
  'SONG': 'song_of_solomon',
  'SONG OF SOLOMON': 'song_of_solomon',
  'SONG OF SONGS': 'song_of_solomon',
  'ISAIAH': 'isaiah',
  'JEREMIAH': 'jeremiah',
  'LAMENTATIONS': 'lamentations',
  'EZEKIEL': 'ezekiel',
  'DANIEL': 'daniel',
  'HOSEA': 'hosea',
  'JOEL': 'joel',
  'AMOS': 'amos',
  'OBADIAH': 'obadiah',
  'JONAH': 'jonah',
  'MICAH': 'micah',
  'NAHUM': 'nahum',
  'HABAKKUK': 'habakkuk',
  'ZEPHANIAH': 'zephaniah',
  'HAGGAI': 'haggai',
  'ZECHARIAH': 'zechariah',
  'MALACHI': 'malachi',
  'MATTHEW': 'matthew',
  'MARK': 'mark',
  'LUKE': 'luke',
  'JOHN': 'john',
  'ACTS': 'acts',
  'ROMANS': 'romans',
  '1 CORINTHIANS': 'i_corinthians',
  '2 CORINTHIANS': 'ii_corinthians',
  'GALATIANS': 'galatians',
  'EPHESIANS': 'ephesians',
  'PHILIPPIANS': 'philippians',
  'COLOSSIANS': 'colossians',
  '1 THESSALONIANS': 'i_thessalonians',
  '2 THESSALONIANS': 'ii_thessalonians',
  '1 TIMOTHY': 'i_timothy',
  '2 TIMOTHY': 'ii_timothy',
  'TITUS': 'titus',
  'PHILEMON': 'philemon',
  'HEBREWS': 'hebrews',
  'JAMES': 'james',
  '1 PETER': 'i_peter',
  '2 PETER': 'ii_peter',
  '1 JOHN': 'i_john',
  '2 JOHN': 'ii_john',
  '3 JOHN': 'iii_john',
  'JUDE': 'jude',
  'REVELATION': 'revelation'
};

const BOOK_CACHE = {};
const TRANSLATION_CODE = 'KJV_STRONGS';

function slugForBook(bookName) {
  if (!bookName) return null;
  const key = bookName.toUpperCase().trim();
  return BOOK_SLUGS[key] || null;
}

function buildBookMap(raw = []) {
  const versesByRef = {};
  raw.forEach(entry => {
    const id = entry.id || '';
    const chapter = parseInt(id.slice(2, 5), 10);
    const verse = parseInt(id.slice(5, 8), 10);
    if (!Number.isFinite(chapter) || !Number.isFinite(verse)) return;
    const key = `${chapter}:${verse}`;
    versesByRef[key] = entry.verse || [];
  });
  return versesByRef;
}

async function loadBook(slug) {
  if (BOOK_CACHE[slug]) return BOOK_CACHE[slug];

  const base = process.env.PUBLIC_URL || '';
  const urls = [
    `${base}/interlinear_bibledata-master/interlinear/${slug}.json`,
    `${base}/public/interlinear_bibledata-master/interlinear/${slug}.json`
  ];

  const loader = (async () => {
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const raw = await res.json();
          return buildBookMap(raw);
        }
      } catch (err) {
        // swallow and try next URL
      }
    }
    throw new Error(`Unable to load interlinear data for ${slug}`);
  })();

  BOOK_CACHE[slug] = loader;
  return loader;
}

function formatTokens(tokens = []) {
  if (!Array.isArray(tokens) || tokens.length === 0) return null;

  const sorted = tokens
    .map((t, idx) => ({ ...t, __idx: idx }))
    .sort((a, b) => {
      const ai = Number.isFinite(a.i) ? a.i : a.__idx;
      const bi = Number.isFinite(b.i) ? b.i : b.__idx;
      if (ai === bi) return a.__idx - b.__idx;
      return ai - bi;
    });

  const parts = sorted.map(tok => {
    const baseWord = (tok.text || '').trim() || (tok.word || '').trim();
    const strongs = tok.number ? tok.number.toUpperCase() : '';
    if (!baseWord && !strongs) return null;
    const tagged = strongs ? `${baseWord} [${strongs}]`.trim() : baseWord;
    return tagged;
  }).filter(Boolean);

  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

export async function getKjvStrongsVerse(reference) {
  const parsed = parseReference(reference);
  if (!parsed.valid || !parsed.verse) return null;

  const slug = slugForBook(parsed.book);
  if (!slug) return null;

  const book = await loadBook(slug);
  const tokens = book[`${parsed.chapter}:${parsed.verse}`];
  if (!tokens) return null;

  const text = formatTokens(tokens);
  if (!text) return null;

  return {
    reference: parsed.normalized,
    text,
    translation: TRANSLATION_CODE
  };
}

export async function getKjvStrongsRange(reference) {
  const parsed = parseReference(reference);
  if (!parsed.valid || !parsed.verse) return null;

  const slug = slugForBook(parsed.book);
  if (!slug) return null;

  const book = await loadBook(slug);
  const start = parsed.verse;
  const end = parsed.verseEnd && parsed.verseEnd >= start ? parsed.verseEnd : start;

  const parts = [];
  for (let v = start; v <= end; v++) {
    const tokens = book[`${parsed.chapter}:${v}`];
    if (!tokens) continue;
    const text = formatTokens(tokens);
    if (text) {
      parts.push(`${v}. ${text}`);
    }
  }

  if (parts.length === 0) return null;

  return {
    reference: parsed.normalized,
    text: parts.join(' '),
    translation: TRANSLATION_CODE
  };
}

export async function getKjvStrongsChapter(bookName, chapter) {
  const slug = slugForBook(bookName);
  if (!slug || !chapter) return null;

  const book = await loadBook(slug);
  const verses = Object.entries(book)
    .map(([key, tokens]) => {
      const [ch, v] = key.split(':').map(num => parseInt(num, 10));
      if (ch !== chapter) return null;
      const text = formatTokens(tokens);
      if (!text) return null;
      return { verse: v, text };
    })
    .filter(Boolean)
    .sort((a, b) => a.verse - b.verse);

  return verses;
}

export default {
  getKjvStrongsVerse,
  getKjvStrongsRange,
  getKjvStrongsChapter
};
