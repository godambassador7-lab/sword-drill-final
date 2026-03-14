const normalizeReferenceForReader = (reference) => {
  if (!reference) return null;
  const raw = String(reference).trim();
  if (!raw) return null;

  // Keep first reference if multiple are present ("Gen 1:1; Exod 3:14")
  const firstRef = raw.split(/[;,]/)[0].trim();

  // Already has chapter:verse (possibly range) => keep the first verse
  const verseMatch = firstRef.match(/^(.+?)\s+(\d+):(\d+)(?:-\d+(?::\d+)?)?$/);
  if (verseMatch) {
    return `${verseMatch[1].trim()} ${verseMatch[2]}:${verseMatch[3]}`;
  }

  // Chapter-only references => default to verse 1
  const chapterMatch = firstRef.match(/^(.+?)\s+(\d+)$/);
  if (chapterMatch) {
    return `${chapterMatch[1].trim()} ${chapterMatch[2]}:1`;
  }

  return firstRef;
};

export const openReferenceInBibleReader = (reference, navigateHome) => {
  const normalized = normalizeReferenceForReader(reference);
  if (!normalized) return false;
  localStorage.setItem('pendingBibleReference', normalized);

  if (typeof navigateHome === 'function') {
    navigateHome();
  }

  return true;
};

export default openReferenceInBibleReader;
