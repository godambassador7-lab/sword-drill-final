const ESV_API_URL = 'https://api.esv.org/v3/passage/text/';
export const ESV_TRANSLATION = 'ESV';

const passageCache = new Map();

function getApiKey() {
  const environmentKey =
    process.env.REACT_APP_ESV_API_KEY ||
    process.env.REACT_APP_CROSSWAY_ESV_API_KEY ||
    process.env.REACT_APP_ESV_TOKEN ||
    '';

  if (environmentKey) return environmentKey.trim();

  // Supports native/local builds where a token was configured at runtime.
  if (typeof window !== 'undefined') {
    try {
      return (window.localStorage.getItem('ESV_TOKEN') || '').trim();
    } catch (_) {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }

  return '';
}

function stripCrosswayFormatting(text) {
  return String(text || '')
    .replace(/\s*\(ESV\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseNumberedVerses(passageText) {
  const cleaned = stripCrosswayFormatting(passageText);
  const matches = [...cleaned.matchAll(/\[(\d+)\]\s*([^\[]+)/g)];

  if (matches.length === 0) {
    return cleaned ? [{ verse: 1, text: cleaned }] : [];
  }

  return matches.map((match) => ({
    verse: Number(match[1]),
    text: stripCrosswayFormatting(match[2])
  }));
}

export function isEsvApiConfigured() {
  return Boolean(getApiKey());
}

export async function fetchEsvPassage(reference, options = {}) {
  const query = String(reference || '').trim();
  if (!query) return null;

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Missing REACT_APP_ESV_API_KEY for Crossway ESV API access.');
  }

  const params = new URLSearchParams({
    q: query,
    'include-passage-references': options.includePassageReferences ? 'true' : 'false',
    'include-verse-numbers': 'true',
    'include-first-verse-numbers': 'true',
    'include-footnotes': 'false',
    'include-footnote-body': 'false',
    'include-headings': 'false',
    'include-short-copyright': 'false',
    'include-copyright': 'false'
  });

  const cacheKey = params.toString();
  if (passageCache.has(cacheKey)) return passageCache.get(cacheKey);

  const response = await fetch(`${ESV_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Token ${apiKey}`
    }
  });

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
