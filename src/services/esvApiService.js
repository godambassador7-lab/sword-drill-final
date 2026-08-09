const ESV_API_URL = '/api/esv';
export const ESV_TRANSLATION = 'ESV';

const passageCache = new Map();

function stripCrosswayFormatting(text) {
  return String(text || '')
    .replace(/\s*\(ESV\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseNumberedVerses(passageText) {
  const cleaned = stripCrosswayFormatting(passageText);
  const matches = [...cleaned.matchAll(/\[(\d+)\]\s*([^[]+)/g)];

  if (matches.length === 0) {
    return cleaned ? [{ verse: 1, text: cleaned }] : [];
  }

  return matches.map((match) => ({
    verse: Number(match[1]),
    text: stripCrosswayFormatting(match[2])
  }));
}

export function isEsvApiConfigured() {
  return true;
}

export async function fetchEsvPassage(reference, options = {}) {
  const query = String(reference || '').trim();
  if (!query) return null;

  const params = new URLSearchParams({
    q: query,
    includePassageReferences: options.includePassageReferences ? 'true' : 'false'
  });

  const cacheKey = params.toString();
  if (passageCache.has(cacheKey)) return passageCache.get(cacheKey);

  const response = await fetch(`${ESV_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Crossway ESV API request failed: ${response.status}`);
  }

  const data = await response.json();
  const text = stripCrosswayFormatting((data.passages || []).join(' '));
  const result = {
    reference: data.canonical || query,
    text,
    translation: ESV_TRANSLATION,
    verses: parseNumberedVerses(text)
  };

  passageCache.set(cacheKey, result);
  return result;
}

export async function getEsvVerseByReference(reference) {
  return fetchEsvPassage(reference);
}

export async function getEsvVersesRange(reference) {
  return fetchEsvPassage(reference);
}

export async function getEsvChapter(book, chapter) {
  const passage = await fetchEsvPassage(`${book} ${chapter}`);
  return passage?.verses || [];
}

export async function getEsvChapterRange(reference) {
  return fetchEsvPassage(reference);
}

export default {
  ESV_TRANSLATION,
  fetchEsvPassage,
  getEsvVerseByReference,
  getEsvVersesRange,
  getEsvChapter,
  getEsvChapterRange,
  isEsvApiConfigured
};
