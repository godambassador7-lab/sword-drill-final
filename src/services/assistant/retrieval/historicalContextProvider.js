/**
 * Historical Context Provider for RAG System
 * Provides book context, authorship, dating, historical background
 */

import { BIBLICAL_CONTEXT } from '../../../data/biblicalContext.js';

/**
 * Get complete context for a Bible book
 * @param {string} bookName - Book name
 * @returns {Object|null} Book context
 */
export function getBookContext(bookName) {
  return BIBLICAL_CONTEXT.books[bookName] || null;
}

/**
 * Get book metadata summary
 * @param {string} bookName - Book name
 * @returns {string} Formatted summary
 */
export function formatBookContext(bookName) {
  const context = getBookContext(bookName);
  if (!context) return null;

  let output = `## 📚 ${bookName} - Background\n\n`;

  output += `**Author**: ${context.author}\n`;
  output += `**Date**: ${context.date}\n`;
  output += `**Audience**: ${context.audience}\n`;
  output += `**Genre**: ${context.genre}\n\n`;

  output += `**Purpose**: ${context.purpose}\n\n`;

  if (context.themes && context.themes.length > 0) {
    output += `**Major Themes**: ${context.themes.map(t => t.replace(/_/g, ' ')).join(', ')}\n\n`;
  }

  if (context.keyVerses && context.keyVerses.length > 0) {
    output += `**Key Verses**: ${context.keyVerses.map(v => `${bookName} ${v}`).join(', ')}\n\n`;
  }

  if (context.uniqueFeatures) {
    output += `**Unique Features**: ${context.uniqueFeatures}\n\n`;
  }

  return output;
}

/**
 * Get outline for a Bible book
 * @param {string} bookName - Book name
 * @returns {Array|null} Outline sections
 */
export function getBookOutline(bookName) {
  const context = getBookContext(bookName);
  return context?.outline || null;
}

/**
 * Format book outline for display
 * @param {string} bookName - Book name
 * @returns {string|null} Formatted outline
 */
export function formatBookOutline(bookName) {
  const outline = getBookOutline(bookName);
  if (!outline) return null;

  let output = `## 📖 ${bookName} - Outline\n\n`;

  outline.forEach((section, idx) => {
    output += `**${idx + 1}. ${section.section}** (${section.verses})\n`;
    output += `   ${section.description}\n\n`;
  });

  return output;
}

/**
 * Determine which section of a book a passage falls into
 * @param {string} bookName - Book name
 * @param {number} chapter - Chapter number
 * @returns {Object|null} Section info
 */
export function getPassageSection(bookName, chapter) {
  const outline = getBookOutline(bookName);
  if (!outline) return null;

  for (const section of outline) {
    // Parse verse range (e.g., "1:1-4:13" or "1:1-20")
    const match = section.verses.match(/(\d+):(\d+)-(\d+):?(\d+)?/);
    if (match) {
      const startChapter = parseInt(match[1]);
      const endChapter = match[4] ? parseInt(match[3]) : parseInt(match[1]);

      if (chapter >= startChapter && chapter <= endChapter) {
        return {
          section: section.section,
          verses: section.verses,
          description: section.description
        };
      }
    }
  }

  return null;
}

/**
 * Get all books with context data
 * @returns {Array} List of book names
 */
export function getAvailableBooks() {
  return Object.keys(BIBLICAL_CONTEXT.books);
}

/**
 * Get books by genre
 * @param {string} genre - Genre filter
 * @returns {Array} List of books matching genre
 */
export function getBooksByGenre(genre) {
  const books = [];

  for (const [bookName, context] of Object.entries(BIBLICAL_CONTEXT.books)) {
    if (context.genre.toLowerCase().includes(genre.toLowerCase())) {
      books.push({
        book: bookName,
        author: context.author,
        date: context.date
      });
    }
  }

  return books;
}

/**
 * Get books by author
 * @param {string} author - Author name
 * @returns {Array} List of books by author
 */
export function getBooksByAuthor(author) {
  const books = [];

  for (const [bookName, context] of Object.entries(BIBLICAL_CONTEXT.books)) {
    if (context.author.toLowerCase().includes(author.toLowerCase())) {
      books.push({
        book: bookName,
        date: context.date,
        genre: context.genre
      });
    }
  }

  return books;
}

/**
 * Get books by theme
 * @param {string} theme - Theme keyword
 * @returns {Array} List of books containing theme
 */
export function getBooksByTheme(theme) {
  const books = [];
  const normalizedTheme = theme.toLowerCase().replace(/\s+/g, '_');

  for (const [bookName, context] of Object.entries(BIBLICAL_CONTEXT.books)) {
    if (context.themes && context.themes.some(t => t.includes(normalizedTheme) || normalizedTheme.includes(t))) {
      books.push({
        book: bookName,
        author: context.author,
        themes: context.themes
      });
    }
  }

  return books;
}

/**
 * Search book contexts by keyword
 * @param {string} keyword - Search term
 * @returns {Array} Matching books with context
 */
export function searchBookContext(keyword) {
  const results = [];
  const normalizedKeyword = keyword.toLowerCase();

  for (const [bookName, context] of Object.entries(BIBLICAL_CONTEXT.books)) {
    const matches = [];

    if (bookName.toLowerCase().includes(normalizedKeyword)) {
      matches.push('book name');
    }
    if (context.author.toLowerCase().includes(normalizedKeyword)) {
      matches.push('author');
    }
    if (context.purpose.toLowerCase().includes(normalizedKeyword)) {
      matches.push('purpose');
    }
    if (context.themes && context.themes.some(t => t.includes(normalizedKeyword))) {
      matches.push('themes');
    }

    if (matches.length > 0) {
      results.push({
        book: bookName,
        author: context.author,
        matchedFields: matches
      });
    }
  }

  return results;
}

export default {
  getBookContext,
  formatBookContext,
  getBookOutline,
  formatBookOutline,
  getPassageSection,
  getAvailableBooks,
  getBooksByGenre,
  getBooksByAuthor,
  getBooksByTheme,
  searchBookContext
};
