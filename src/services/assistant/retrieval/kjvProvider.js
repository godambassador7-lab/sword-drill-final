// KJV Provider: loads public‑domain KJV JSON per book from the public folder at runtime.
// Expected location: /bible/kjv/<Book>.json (e.g., /bible/kjv/John.json)
// Expected format options (supports both):
// A) { "book": "John", "chapters": { "3": { "16": "For God so loved..." } } }
// B) { "1": { "1": "..." }, "2": { ... } }  // chapters object directly

const BOOK_FILENAMES = {
  'Genesis': 'Genesis.json', 'Exodus': 'Exodus.json', 'Leviticus': 'Leviticus.json', 'Numbers': 'Numbers.json', 'Deuteronomy': 'Deuteronomy.json',
  'Joshua': 'Joshua.json', 'Judges': 'Judges.json', 'Ruth': 'Ruth.json', '1 Samuel': '1 Samuel.json', '2 Samuel': '2 Samuel.json',
  '1 Kings': '1 Kings.json', '2 Kings': '2 Kings.json', '1 Chronicles': '1 Chronicles.json', '2 Chronicles': '2 Chronicles.json', 'Ezra': 'Ezra.json',
  'Nehemiah': 'Nehemiah.json', 'Esther': 'Esther.json', 'Job': 'Job.json', 'Psalms': 'Psalms.json', 'Proverbs': 'Proverbs.json',
  'Ecclesiastes': 'Ecclesiastes.json', 'Song of Solomon': 'Song of Solomon.json', 'Isaiah': 'Isaiah.json', 'Jeremiah': 'Jeremiah.json',
  'Lamentations': 'Lamentations.json', 'Ezekiel': 'Ezekiel.json', 'Daniel': 'Daniel.json', 'Hosea': 'Hosea.json', 'Joel': 'Joel.json',
  'Amos': 'Amos.json', 'Obadiah': 'Obadiah.json', 'Jonah': 'Jonah.json', 'Micah': 'Micah.json', 'Nahum': 'Nahum.json',
  'Habakkuk': 'Habakkuk.json', 'Zephaniah': 'Zephaniah.json', 'Haggai': 'Haggai.json', 'Zechariah': 'Zechariah.json', 'Malachi': 'Malachi.json',
  'Matthew': 'Matthew.json', 'Mark': 'Mark.json', 'Luke': 'Luke.json', 'John': 'John.json', 'Acts': 'Acts.json',
  'Romans': 'Romans.json', '1 Corinthians': '1 Corinthians.json', '2 Corinthians': '2 Corinthians.json', 'Galatians': 'Galatians.json',
  'Ephesians': 'Ephesians.json', 'Philippians': 'Philippians.json', 'Colossians': 'Colossians.json', '1 Thessalonians': '1 Thessalonians.json',
  '2 Thessalonians': '2 Thessalonians.json', '1 Timothy': '1 Timothy.json', '2 Timothy': '2 Timothy.json', 'Titus': 'Titus.json', 'Philemon': 'Philemon.json',
  'Hebrews': 'Hebrews.json', 'James': 'James.json', '1 Peter': '1 Peter.json', '2 Peter': '2 Peter.json', '1 John': '1 John.json',
  '2 John': '2 John.json', '3 John': '3 John.json', 'Jude': 'Jude.json', 'Revelation': 'Revelation.json',
  // Apocrypha (optional files)
  'Tobit': 'Tobit.json', 'Judith': 'Judith.json', 'Additions to Esther': 'Additions to Esther.json',
  '1 Esdras': '1 Esdras.json', '2 Esdras': '2 Esdras.json', 'Prayer of Manasseh': 'Prayer of Manasseh.json',
  'Psalm 151': 'Psalm 151.json', '3 Maccabees': '3 Maccabees.json', '4 Maccabees': '4 Maccabees.json',
  'Wisdom of Solomon': 'Wisdom of Solomon.json', 'Sirach': 'Sirach.json', 'Baruch': 'Baruch.json',
  'Letter of Jeremiah': 'Letter of Jeremiah.json',
  'Prayer of Azariah': 'Prayer of Azariah.json', 'Song of the Three Holy Children': 'Song of the Three Holy Children.json',
  'Susanna': 'Susanna.json', 'Bel and the Dragon': 'Bel and the Dragon.json',
  '1 Maccabees': '1 Maccabees.json', '2 Maccabees': '2 Maccabees.json'
};

const cache = new Map();

function publicUrl(path) {
  // CRA/React uses process.env.PUBLIC_URL for public assets, but simple '/' works at runtime
  return `${process.env.PUBLIC_URL || ''}${path}`;
}

export async function loadBook(bookName) {
  const file = BOOK_FILENAMES[bookName];
  if (!file) return null;
  if (cache.has(bookName)) return cache.get(bookName);
  try {
    const res = await fetch(publicUrl(`/bible/kjv/${file}`));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    cache.set(bookName, json);
    return json;
  } catch (e) {
    console.warn(`[KJV] Could not load book JSON for ${bookName}:`, e.message);
    cache.set(bookName, null);
    return null;
  }
}

function getChaptersObject(bookJson) {
  if (!bookJson) return null;
  if (bookJson.chapters) return bookJson.chapters;
  // format B: chapters as top-level keys
  const hasNumericKeys = Object.keys(bookJson).every(k => /^\d+$/.test(k));
  return hasNumericKeys ? bookJson : null;
}

export async function getKJVVerses(book, chapter, vStart, vEnd) {
  const data = await loadBook(book);
  const chapters = getChaptersObject(data);
  if (!chapters) return [];
  const ch = chapters[String(chapter)] || {};
  const start = vStart ?? 1;
  const end = vEnd ?? start;
  const out = [];
  for (let v = start; v <= end; v++) {
    const text = ch[String(v)];
    if (text) out.push({ reference: `${book} ${chapter}:${v}`, text, translation: 'KJV' });
  }
  return out;
}

export default { loadBook, getKJVVerses };
