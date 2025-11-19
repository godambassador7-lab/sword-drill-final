// Reference parser that normalizes common Bible and Apocrypha references

const BOOK_ALIASES = {
  'gen': 'Genesis', 'ex': 'Exodus', 'lev': 'Leviticus', 'num': 'Numbers', 'deut': 'Deuteronomy',
  'jos': 'Joshua', 'jdg': 'Judges', 'rut': 'Ruth', '1sa': '1 Samuel', '2sa': '2 Samuel',
  '1ki': '1 Kings', '2ki': '2 Kings', '1ch': '1 Chronicles', '2ch': '2 Chronicles', 'ezr': 'Ezra',
  'neh': 'Nehemiah', 'est': 'Esther', 'job': 'Job', 'ps': 'Psalms', 'pro': 'Proverbs', 'eccl': 'Ecclesiastes',
  'isa': 'Isaiah', 'jer': 'Jeremiah', 'lam': 'Lamentations', 'ezek': 'Ezekiel', 'dan': 'Daniel',
  'hos': 'Hosea', 'joel': 'Joel', 'amos': 'Amos', 'obad': 'Obadiah', 'jon': 'Jonah', 'mic': 'Micah',
  'nah': 'Nahum', 'hab': 'Habakkuk', 'zeph': 'Zephaniah', 'hag': 'Haggai', 'zech': 'Zechariah', 'mal': 'Malachi',
  'mat': 'Matthew', 'mk': 'Mark', 'lk': 'Luke', 'jn': 'John', 'acts': 'Acts', 'rom': 'Romans',
  '1co': '1 Corinthians', '2co': '2 Corinthians', 'gal': 'Galatians', 'eph': 'Ephesians', 'php': 'Philippians',
  'col': 'Colossians', '1th': '1 Thessalonians', '2th': '2 Thessalonians', '1ti': '1 Timothy', '2ti': '2 Timothy',
  'tit': 'Titus', 'phm': 'Philemon', 'heb': 'Hebrews', 'jas': 'James', '1pe': '1 Peter', '2pe': '2 Peter',
  '1jn': '1 John', '2jn': '2 John', '3jn': '3 John', 'jud': 'Jude', 'rev': 'Revelation'
};

// Apocrypha aliases (normalized key -> canonical name)
const APOCRYPHA_ALIASES = {
  'tobit': 'Tobit', 'tobias': 'Tobit', 'tob': 'Tobit',
  'judith': 'Judith', 'jdt': 'Judith',
  'additions toesther': 'Additions to Esther', 'greekesther': 'Additions to Esther', 'addesth': 'Additions to Esther',
  '1esdras': '1 Esdras', 'i esdras': '1 Esdras', '3esdras': '1 Esdras',
  '2esdras': '2 Esdras', 'iv esdras': '2 Esdras', '4esdras': '2 Esdras',
  'prayerofmanasseh': 'Prayer of Manasseh', 'prmanasseh': 'Prayer of Manasseh',
  'prayerofmanasses': 'Prayer of Manasseh',
  'psalm151': 'Psalm 151', 'ps151': 'Psalm 151',
  '3maccabees': '3 Maccabees', 'iiimaccabees': '3 Maccabees',
  '4maccabees': '4 Maccabees', 'ivmaccabees': '4 Maccabees',
  'wisdomofsolomon': 'Wisdom of Solomon', 'wisdom': 'Wisdom of Solomon', 'wisd': 'Wisdom of Solomon',
  'sirach': 'Sirach', 'ecclesiasticus': 'Sirach', 'ecclus': 'Sirach',
  'baruch': 'Baruch',
  'letterofjeremiah': 'Letter of Jeremiah', 'epistleofjeremiah': 'Letter of Jeremiah',
  'prayerofazariah': 'Prayer of Azariah', 'songofthreeholychildren': 'Song of the Three Holy Children', 'songofthreeyouths': 'Song of the Three Holy Children', 'songofthethree': 'Song of the Three Holy Children',
  'susanna': 'Susanna',
  'belandthedragon': 'Bel and the Dragon',
  '1maccabees': '1 Maccabees', 'imaccabees': '1 Maccabees', 'i maccabees': '1 Maccabees',
  '2maccabees': '2 Maccabees', 'iimaccabees': '2 Maccabees', 'ii maccabees': '2 Maccabees'
};

// Capture multi-word book names until chapter number
const REF_RE = /\b(\d?\s?[A-Za-z][A-Za-z\s'()\-]+?)\s+(\d{1,3})(?::(\d{1,3})(?:[-–](\d{1,3}))?)?\b/;

export function parseReference(raw) {
  if (!raw) return { valid: false };
  const m = raw.match(REF_RE);
  if (!m) return { valid: false };
  let book = m[1].replace(/\./g, '').trim();
  const ch = parseInt(m[2], 10);
  const vs = m[3] ? m[3] : undefined;
  const ve = m[4] ? m[4] : undefined;

  const key3 = book.toLowerCase().replace(/\s+/g, '').slice(0, 3);
  const norm = book.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (BOOK_ALIASES[key3]) {
    book = BOOK_ALIASES[key3];
  } else if (APOCRYPHA_ALIASES[norm]) {
    book = APOCRYPHA_ALIASES[norm];
  } else {
    // Keep provided book casing normalized
    book = book.replace(/\s+/g, ' ').replace(/\b([a-z])/g, s => s.toUpperCase());
  }

  return {
    valid: true,
    book,
    chapter: ch,
    verse: vs ? parseInt(vs, 10) : undefined,
    verseEnd: ve ? parseInt(ve, 10) : undefined,
    normalized: vs ? `${book} ${ch}:${vs}${ve ? '-' + ve : ''}` : `${book} ${ch}`
  };
}

export default parseReference;
