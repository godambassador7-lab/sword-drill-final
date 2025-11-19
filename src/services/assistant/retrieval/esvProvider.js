// ESV Provider (licensed via api.esv.org). Requires an API token.
// Set token via env var `REACT_APP_ESV_TOKEN` or localStorage key `ESV_TOKEN`.

const ESV_API = 'https://api.esv.org/v3/passage/text/';

function getToken() {
  // Prefer React env var; fallback to localStorage for manual runtime entry
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ESV_TOKEN) {
    return process.env.REACT_APP_ESV_TOKEN;
  }
  if (typeof window !== 'undefined') {
    try { return window.localStorage.getItem('ESV_TOKEN') || ''; } catch (_) {}
  }
  return '';
}

function buildQuery(reference) {
  const params = new URLSearchParams({
    q: reference,
    'include-passage-references': 'false',
    'include-footnotes': 'false',
    'include-headings': 'false',
    'include-verse-numbers': 'false',
    'include-short-copyright': 'false',
  });
  return `${ESV_API}?${params.toString()}`;
}

export async function getESVByReference(reference) {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(buildQuery(reference), {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error(`ESV HTTP ${res.status}`);
    const data = await res.json();
    const text = (data?.passages && data.passages[0]) ? String(data.passages[0]).trim().replace(/\s+/g, ' ') : '';
    if (!text) return null;
    return { reference, text, translation: 'ESV' };
  } catch (e) {
    console.warn('ESV fetch failed:', e.message);
    return null;
  }
}

export async function getESVVerses(book, chapter, vStart, vEnd) {
  const ref = `${book} ${chapter}:${vStart}${vEnd ? '-' + vEnd : ''}`;
  const v = await getESVByReference(ref);
  return v ? [v] : [];
}

export default { getESVByReference, getESVVerses };

