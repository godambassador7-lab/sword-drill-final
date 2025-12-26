// Reference parser that normalizes common Bible and Apocrypha references

const BOOK_ALIASES = {
  // Genesis
  'gen': 'Genesis', 'gn': 'Genesis', 'gns': 'Genesis',
  // Exodus
  'ex': 'Exodus', 'exo': 'Exodus', 'exod': 'Exodus',
  // Leviticus
  'lev': 'Leviticus', 'le': 'Leviticus', 'lv': 'Leviticus',
  // Numbers
  'num': 'Numbers', 'nm': 'Numbers', 'nb': 'Numbers',
  // Deuteronomy
  'deut': 'Deuteronomy', 'deu': 'Deuteronomy', 'dt': 'Deuteronomy',
  // Joshua
  'jos': 'Joshua', 'josh': 'Joshua', 'jsh': 'Joshua',
  // Judges
  'jdg': 'Judges', 'jdgs': 'Judges', 'jg': 'Judges',
  // Ruth
  'rut': 'Ruth', 'rth': 'Ruth', 'ru': 'Ruth',
  // 1 Samuel
  '1sa': '1 Samuel', '1sm': '1 Samuel', '1s': '1 Samuel', 'isa': '1 Samuel', 'isam': '1 Samuel',
  // 2 Samuel
  '2sa': '2 Samuel', '2sm': '2 Samuel', '2s': '2 Samuel', 'iisa': '2 Samuel', 'iisam': '2 Samuel',
  // 1 Kings
  '1ki': '1 Kings', '1kg': '1 Kings', '1k': '1 Kings', 'iki': '1 Kings', 'ikgs': '1 Kings',
  // 2 Kings
  '2ki': '2 Kings', '2kg': '2 Kings', '2k': '2 Kings', 'iiki': '2 Kings', 'iikgs': '2 Kings',
  // 1 Chronicles
  '1ch': '1 Chronicles', '1chr': '1 Chronicles', 'ich': '1 Chronicles', 'ichr': '1 Chronicles',
  // 2 Chronicles
  '2ch': '2 Chronicles', '2chr': '2 Chronicles', 'iich': '2 Chronicles', 'iichr': '2 Chronicles',
  // Ezra
  'ezr': 'Ezra', 'ezra': 'Ezra',
  // Nehemiah
  'neh': 'Nehemiah', 'ne': 'Nehemiah',
  // Esther
  'est': 'Esther', 'esth': 'Esther', 'es': 'Esther',
  // Job
  'job': 'Job', 'jb': 'Job',
  // Psalms
  'ps': 'Psalms', 'psa': 'Psalms', 'psm': 'Psalms', 'pss': 'Psalms',
  // Proverbs
  'pro': 'Proverbs', 'prv': 'Proverbs', 'pr': 'Proverbs', 'prov': 'Proverbs',
  // Ecclesiastes
  'eccl': 'Ecclesiastes', 'ecc': 'Ecclesiastes', 'ec': 'Ecclesiastes', 'qoh': 'Ecclesiastes',
  // Isaiah
  'isa': 'Isaiah', 'is': 'Isaiah',
  // Jeremiah
  'jer': 'Jeremiah', 'je': 'Jeremiah', 'jr': 'Jeremiah',
  // Lamentations
  'lam': 'Lamentations', 'la': 'Lamentations',
  // Ezekiel
  'ezek': 'Ezekiel', 'eze': 'Ezekiel', 'ezk': 'Ezekiel',
  // Daniel
  'dan': 'Daniel', 'da': 'Daniel', 'dn': 'Daniel',
  // Hosea
  'hos': 'Hosea', 'ho': 'Hosea',
  // Joel
  'joel': 'Joel', 'joe': 'Joel', 'jl': 'Joel',
  // Amos
  'amos': 'Amos', 'am': 'Amos',
  // Obadiah
  'obad': 'Obadiah', 'oba': 'Obadiah', 'ob': 'Obadiah',
  // Jonah
  'jon': 'Jonah', 'jnh': 'Jonah',
  // Micah
  'mic': 'Micah', 'mi': 'Micah',
  // Nahum
  'nah': 'Nahum', 'na': 'Nahum', 'nam': 'Nahum',
  // Habakkuk
  'hab': 'Habakkuk', 'hb': 'Habakkuk',
  // Zephaniah
  'zeph': 'Zephaniah', 'zep': 'Zephaniah', 'zp': 'Zephaniah',
  // Haggai
  'hag': 'Haggai', 'hg': 'Haggai',
  // Zechariah
  'zech': 'Zechariah', 'zec': 'Zechariah', 'zc': 'Zechariah',
  // Malachi
  'mal': 'Malachi', 'ml': 'Malachi',
  // Matthew
  'mat': 'Matthew', 'matt': 'Matthew', 'mt': 'Matthew',
  // Mark
  'mk': 'Mark', 'mar': 'Mark', 'mrk': 'Mark',
  // Luke
  'lk': 'Luke', 'luk': 'Luke', 'lu': 'Luke',
  // John (Gospel)
  'jn': 'John', 'jhn': 'John', 'joh': 'John',
  // Acts
  'acts': 'Acts', 'act': 'Acts', 'ac': 'Acts',
  // Romans
  'rom': 'Romans', 'ro': 'Romans', 'rm': 'Romans',
  // 1 Corinthians
  '1co': '1 Corinthians', '1cor': '1 Corinthians', 'ico': '1 Corinthians', 'icor': '1 Corinthians',
  // 2 Corinthians
  '2co': '2 Corinthians', '2cor': '2 Corinthians', 'iico': '2 Corinthians', 'iicor': '2 Corinthians',
  // Galatians
  'gal': 'Galatians', 'ga': 'Galatians',
  // Ephesians
  'eph': 'Ephesians', 'ephes': 'Ephesians',
  // Philippians
  'php': 'Philippians', 'phil': 'Philippians', 'pp': 'Philippians',
  // Colossians
  'col': 'Colossians', 'co': 'Colossians',
  // 1 Thessalonians
  '1th': '1 Thessalonians', '1thess': '1 Thessalonians', 'ith': '1 Thessalonians', 'ithess': '1 Thessalonians',
  // 2 Thessalonians
  '2th': '2 Thessalonians', '2thess': '2 Thessalonians', 'iith': '2 Thessalonians', 'iithess': '2 Thessalonians',
  // 1 Timothy
  '1ti': '1 Timothy', '1tim': '1 Timothy', 'iti': '1 Timothy', 'itim': '1 Timothy',
  // 2 Timothy
  '2ti': '2 Timothy', '2tim': '2 Timothy', 'iiti': '2 Timothy', 'iitim': '2 Timothy',
  // Titus
  'tit': 'Titus', 'ti': 'Titus',
  // Philemon
  'phm': 'Philemon', 'phlm': 'Philemon', 'phile': 'Philemon',
  // Hebrews
  'heb': 'Hebrews', 'he': 'Hebrews',
  // James
  'jas': 'James', 'jam': 'James', 'jm': 'James',
  // 1 Peter
  '1pe': '1 Peter', '1pet': '1 Peter', 'ipe': '1 Peter', 'ipet': '1 Peter', '1pt': '1 Peter',
  // 2 Peter
  '2pe': '2 Peter', '2pet': '2 Peter', 'iipe': '2 Peter', 'iipet': '2 Peter', '2pt': '2 Peter',
  // 1 John (Epistle)
  '1jn': '1 John', '1jo': '1 John', 'ijn': '1 John', 'ijo': '1 John',
  // 2 John
  '2jn': '2 John', '2jo': '2 John', 'iijn': '2 John', 'iijo': '2 John',
  // 3 John
  '3jn': '3 John', '3jo': '3 John', 'iiijn': '3 John', 'iiijo': '3 John',
  // Jude
  'jud': 'Jude', 'jude': 'Jude', 'jd': 'Jude',
  // Revelation
  'rev': 'Revelation', 're': 'Revelation', 'apocalypse': 'Revelation'
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

// Normalize ordinal numbers (1st, 2nd, 3rd -> 1, 2, 3)
function normalizeOrdinal(str) {
  return str
    .replace(/\b(first|1st)\s+/gi, '1 ')
    .replace(/\b(second|2nd)\s+/gi, '2 ')
    .replace(/\b(third|3rd)\s+/gi, '3 ')
    .replace(/\b(fourth|4th)\s+/gi, '4 ');
}

// Capture multi-word book names until chapter number (supports en-dash – and hyphen -)
const REF_RE = /\b(\d?\s?[A-Za-z][A-Za-z\s'()\-]+?)\s+(\d{1,3})(?::(\d{1,3})(?:[-–—](\d{1,3}))?)?\b/;

export function parseReference(raw) {
  if (!raw) return { valid: false };

  // Normalize ordinals and special characters
  let normalized = normalizeOrdinal(raw);

  const m = normalized.match(REF_RE);
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
    // Handle singular "Psalm" → "Psalms"
    if (book === 'Psalm') {
      book = 'Psalms';
    }
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
