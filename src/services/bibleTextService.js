import { getEsvVerseByReference } from './esvApiService';

export async function getVerseText(book, chapter, verse) {
  const result = await getEsvVerseByReference(`${book} ${chapter}:${verse}`);
  return result?.text || null;
}

export function parseReference(reference) {
  const match = String(reference || '').match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2], 10),
    verse: parseInt(match[3], 10)
  };
}

export async function getVerseByReference(reference) {
  const result = await getEsvVerseByReference(reference);
  return result?.text || null;
}

export default {
  getVerseText,
  getVerseByReference,
  parseReference
};
