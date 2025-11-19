// Canonical order of Bible books (66 books total)
export const BIBLE_BOOKS = [
  // Old Testament (39 books)
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  // New Testament (27 books)
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

// Helper function to get book position (0-indexed)
export function getBookIndex(bookName) {
  return BIBLE_BOOKS.findIndex(
    (book) => book.toLowerCase() === bookName.toLowerCase()
  );
}

// Helper function to get book before
export function getBookBefore(bookName) {
  const index = getBookIndex(bookName);
  if (index <= 0) return null; // No book before Genesis
  return BIBLE_BOOKS[index - 1];
}

// Helper function to get book after
export function getBookAfter(bookName) {
  const index = getBookIndex(bookName);
  if (index === -1 || index >= BIBLE_BOOKS.length - 1) return null; // No book after Revelation
  return BIBLE_BOOKS[index + 1];
}

// Check if answer matches (case-insensitive, handles variations)
export function checkBookAnswer(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;

  const normalize = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ") // Normalize spaces
      .replace(/^(1|2|3)\s+/, "$1 ") // Ensure single space after numbers
      .replace(/^i\s+/, "1 ") // Allow Roman numerals
      .replace(/^ii\s+/, "2 ")
      .replace(/^iii\s+/, "3 ")
      .replace(/song of songs/g, "song of solomon") // Common variation
      .replace(/canticles/g, "song of solomon"); // Another variation

  return normalize(userAnswer) === normalize(correctAnswer);
}

// Generate a random question
export function generateBookOrderQuestion() {
  // Avoid first and last books to keep questions interesting
  const minIndex = 1; // Start at Exodus
  const maxIndex = BIBLE_BOOKS.length - 2; // End at Jude

  const bookIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
  const book = BIBLE_BOOKS[bookIndex];

  // Randomly choose before or after
  const direction = Math.random() < 0.5 ? "before" : "after";
  const answer = direction === "before" ? BIBLE_BOOKS[bookIndex - 1] : BIBLE_BOOKS[bookIndex + 1];

  return {
    book,
    direction,
    answer,
    bookIndex,
  };
}
