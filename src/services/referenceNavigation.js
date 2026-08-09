export const normalizeReferenceForReader = (reference) => {
  if (!reference) return null;
  const raw = String(reference).trim();
  if (!raw) return null;

  // Keep first reference if multiple are present ("Gen 1:1; Exod 3:14")
  const firstRef = raw.split(/[;,]/)[0].trim();

  // Preserve same-chapter verse ranges so the reader can isolate the requested verses.
  const verseMatch = firstRef.match(/^(.+?)\s+(\d+):(\d+)(?:\s*-\s*(?:(\d+):)?(\d+))?$/);
  if (verseMatch) {
    const [, book, chapter, startVerse, endChapter, endVerse] = verseMatch;
    if (!endVerse) return `${book.trim()} ${chapter}:${startVerse}`;
    if (!endChapter || endChapter === chapter) {
      return `${book.trim()} ${chapter}:${startVerse}-${endVerse}`;
    }

    // The current reader displays one chapter at a time.
    return `${book.trim()} ${chapter}:${startVerse}`;
  }

  // Chapter-only references should continue to show the complete chapter.
  const chapterMatch = firstRef.match(/^(.+?)\s+(\d+)$/);
  if (chapterMatch) {
    return `${chapterMatch[1].trim()} ${chapterMatch[2]}`;
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
