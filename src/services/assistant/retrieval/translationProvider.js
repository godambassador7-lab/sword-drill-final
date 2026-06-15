import { getEsvVerseByReference } from '../../esvApiService';

const AVAILABLE_TRANSLATIONS = {
  ESV: { name: 'English Standard Version', year: 2001, philosophy: 'Essentially Literal' }
};

export function parseReference(reference) {
  if (!reference) return null;

  const match = reference.match(/^([123]?\s?[A-Za-z\s]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2], 10),
    verseStart: parseInt(match[3], 10),
    verseEnd: match[4] ? parseInt(match[4], 10) : parseInt(match[3], 10)
  };
}

export async function getVerse(translation, book, chapter, verse) {
  return getEsvVerseByReference(`${book} ${chapter}:${verse}`);
}

export async function getVerses(translation, book, chapter, vStart, vEnd) {
  const suffix = vEnd && vEnd !== vStart ? `${vStart}-${vEnd}` : `${vStart}`;
  const verse = await getEsvVerseByReference(`${book} ${chapter}:${suffix}`);
  return verse ? [verse] : [];
}

export async function getVerseInTranslations(book, chapter, verse) {
  const esv = await getVerse('ESV', book, chapter, verse);
  return esv ? [esv] : [];
}

export async function getVerseByReference(reference) {
  return getEsvVerseByReference(reference);
}

export async function compareTranslations(reference) {
  const esv = await getEsvVerseByReference(reference);
  return {
    reference,
    translations: esv ? [esv] : [],
    availableCount: esv ? 1 : 0,
    comparisonNote: 'Translation comparison is disabled because Sword Drill is approved to use ESV only.'
  };
}

export function getAvailableTranslations() {
  return Object.entries(AVAILABLE_TRANSLATIONS).map(([code, info]) => ({
    code,
    name: info.name,
    year: info.year,
    philosophy: info.philosophy
  }));
}

export function getTranslationInfo(code) {
  const info = AVAILABLE_TRANSLATIONS.ESV;
  return {
    code: 'ESV',
    ...info
  };
}

export default {
  getVerse,
  getVerses,
  getVerseInTranslations,
  getVerseByReference,
  compareTranslations,
  getAvailableTranslations,
  getTranslationInfo,
  parseReference
};
