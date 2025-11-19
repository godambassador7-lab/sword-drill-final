import React, { useState, useEffect, useCallback } from "react";
import { parseReference } from "./assistant/referenceParser";
// DISABLED: Not using API calls - only local verses
// import { fetchPassageWithFallback, searchVerses, SUPPORTED_TRANSLATIONS } from "../services/bibleApiService";

// All available translations (excluding ancient manuscripts)
const SUPPORTED_TRANSLATIONS = [
  { id: "KJV", name: "King James Version (KJV)" },
  { id: "NIV", name: "New International Version (NIV)" },
  { id: "NLT", name: "New Living Translation (NLT)" },
  { id: "ESV", name: "English Standard Version (ESV)" },
  { id: "WEB", name: "World English Bible (WEB)" },
  { id: "ASV", name: "American Standard Version (ASV)" },
  { id: "YLT", name: "Young's Literal Translation (YLT)" }
];

// Complete list of Bible books with their abbreviations
const BIBLE_BOOKS = [
  // Old Testament
  { abbr: "GEN", name: "Genesis" },
  { abbr: "EXO", name: "Exodus" },
  { abbr: "LEV", name: "Leviticus" },
  { abbr: "NUM", name: "Numbers" },
  { abbr: "DEU", name: "Deuteronomy" },
  { abbr: "JOS", name: "Joshua" },
  { abbr: "JDG", name: "Judges" },
  { abbr: "RUT", name: "Ruth" },
  { abbr: "1SA", name: "1 Samuel" },
  { abbr: "2SA", name: "2 Samuel" },
  { abbr: "1KI", name: "1 Kings" },
  { abbr: "2KI", name: "2 Kings" },
  { abbr: "1CH", name: "1 Chronicles" },
  { abbr: "2CH", name: "2 Chronicles" },
  { abbr: "EZR", name: "Ezra" },
  { abbr: "NEH", name: "Nehemiah" },
  { abbr: "EST", name: "Esther" },
  { abbr: "JOB", name: "Job" },
  { abbr: "PSA", name: "Psalms" },
  { abbr: "PRO", name: "Proverbs" },
  { abbr: "ECC", name: "Ecclesiastes" },
  { abbr: "SNG", name: "Song of Solomon" },
  { abbr: "ISA", name: "Isaiah" },
  { abbr: "JER", name: "Jeremiah" },
  { abbr: "LAM", name: "Lamentations" },
  { abbr: "EZK", name: "Ezekiel" },
  { abbr: "DAN", name: "Daniel" },
  { abbr: "HOS", name: "Hosea" },
  { abbr: "JOL", name: "Joel" },
  { abbr: "AMO", name: "Amos" },
  { abbr: "OBA", name: "Obadiah" },
  { abbr: "JON", name: "Jonah" },
  { abbr: "MIC", name: "Micah" },
  { abbr: "NAM", name: "Nahum" },
  { abbr: "HAB", name: "Habakkuk" },
  { abbr: "ZEP", name: "Zephaniah" },
  { abbr: "HAG", name: "Haggai" },
  { abbr: "ZEC", name: "Zechariah" },
  { abbr: "MAL", name: "Malachi" },
  // New Testament
  { abbr: "MAT", name: "Matthew" },
  { abbr: "MRK", name: "Mark" },
  { abbr: "LUK", name: "Luke" },
  { abbr: "JOH", name: "John" },
  { abbr: "ACT", name: "Acts" },
  { abbr: "ROM", name: "Romans" },
  { abbr: "1CO", name: "1 Corinthians" },
  { abbr: "2CO", name: "2 Corinthians" },
  { abbr: "GAL", name: "Galatians" },
  { abbr: "EPH", name: "Ephesians" },
  { abbr: "PHP", name: "Philippians" },
  { abbr: "COL", name: "Colossians" },
  { abbr: "1TH", name: "1 Thessalonians" },
  { abbr: "2TH", name: "2 Thessalonians" },
  { abbr: "1TI", name: "1 Timothy" },
  { abbr: "2TI", name: "2 Timothy" },
  { abbr: "TIT", name: "Titus" },
  { abbr: "PHM", name: "Philemon" },
  { abbr: "HEB", name: "Hebrews" },
  { abbr: "JAS", name: "James" },
  { abbr: "1PE", name: "1 Peter" },
  { abbr: "2PE", name: "2 Peter" },
  { abbr: "1JN", name: "1 John" },
  { abbr: "2JN", name: "2 John" },
  { abbr: "3JN", name: "3 John" },
  { abbr: "JUD", name: "Jude" },
  { abbr: "REV", name: "Revelation" }
];

const BibleReaderView = ({ isOpen, onClose, onBack, initialReference }) => {
  // Don't render if not open
  if (!isOpen) return null;
  const [selectedTranslation, setSelectedTranslation] = useState(SUPPORTED_TRANSLATIONS[0]);
  const [bookInput, setBookInput] = useState("Genesis");
  const [selectedBook, setSelectedBook] = useState("GEN");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterText, setChapterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showBookSuggestions, setShowBookSuggestions] = useState(false);
  
  // Search feature states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Filter books based on user input
  useEffect(() => {
    if (bookInput.trim() === "") {
      setFilteredBooks(BIBLE_BOOKS);
      return;
    }

    const query = bookInput.toLowerCase();
    const matches = BIBLE_BOOKS.filter(book =>
      book.name.toLowerCase().includes(query) ||
      book.abbr.toLowerCase().includes(query)
    );

    setFilteredBooks(matches);
    setShowBookSuggestions(matches.length > 0);
  }, [bookInput]);

  const handleBookSelect = useCallback((book) => {
    setSelectedBook(book.abbr);
    setBookInput(book.name);
    setShowBookSuggestions(false);
  }, []);

  const handleTranslationChange = useCallback((e) => {
    setSelectedTranslation(
      SUPPORTED_TRANSLATIONS.find((t) => t.id === e.target.value)
    );
  }, []);

  const handleBookInputChange = useCallback((e) => {
    setBookInput(e.target.value);
  }, []);

  const handleBookInputFocus = useCallback(() => {
    setShowBookSuggestions(true);
  }, []);

  const handleLoadChapter = useCallback(async (override = {}) => {
    setLoading(true);
    setError(null);
    setShowSearchResults(false);

    const bookCode = override.selectedBook || selectedBook;
    const chapterNumber = override.selectedChapter || selectedChapter;
    const translation = override.selectedTranslation || selectedTranslation;

    try {
      const translationCode = translation.id.toLowerCase();
      const bookEntry = BIBLE_BOOKS.find(b => b.abbr === bookCode);
      const bookName = bookEntry?.name || bookInput || bookCode || "Genesis";
      const chapterKey = chapterNumber || 1;

      const url = `${process.env.PUBLIC_URL || ''}/bible/${translationCode}/${bookName}.json`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Book not found: ${bookName}`);
      }

      const bookData = await response.json();
      const chapterData = bookData.chapters?.[String(chapterKey)];

      if (!chapterData) {
        setChapterText("<p class='italic text-amber-400'>This chapter is not available in the selected translation.</p>");
        setLoading(false);
        return;
      }

      let formatted = '';
      const verses = Object.keys(chapterData).sort((a, b) => parseInt(a) - parseInt(b));

      for (const verseNum of verses) {
        const verseText = chapterData[verseNum]
          .replace(/¶/g, '')
          .replace(/\u00B6/g, '')
          .trim();
        formatted += `<span class="verse-num">${verseNum}</span> ${verseText} `;
      }

      formatted = `<p class="leading-relaxed text-lg">${formatted}</p>`;
      setChapterText(formatted);
      setError(null);
    } catch (error) {
      console.error("Error loading chapter:", error);
      const bookEntry = BIBLE_BOOKS.find(b => b.abbr === bookCode);
      const bookName = bookEntry?.name || bookInput || bookCode;
      setError(`Unable to load ${bookName} chapter ${chapterNumber || selectedChapter}. This translation may not have this book available.`);
      setChapterText("<p class='italic text-amber-400'>Chapter not available.</p>");
    } finally {
      setLoading(false);
    }
  }, [selectedBook, selectedChapter, selectedTranslation, bookInput]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
      return;
    }

    setSearching(true);
    setShowSearchResults(true);

    try {
      // DISABLED: Using local verses only - no API calls
      setError("Search feature temporarily disabled. Using local verses only.");
      setSearchResults([]);
      /* const results = await searchVerses(selectedTranslation.id, searchQuery);
      setSearchResults(results);

      if (results.length === 0) {
        setError("No results found for your search query.");
      } else {
        setError(null);
      } */
    } catch (err) {
      console.error("Search error:", err);
      setError("Unable to perform search. Please try again.");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!initialReference) return;
    const parsed = parseReference(initialReference);
    if (!parsed.valid) return;

    let normalizedBook = BIBLE_BOOKS.find(
      book => book.name.toLowerCase() === parsed.book.toLowerCase()
    );
    if (!normalizedBook) {
      normalizedBook = BIBLE_BOOKS.find(
        book => book.abbr.toLowerCase() === parsed.book.toLowerCase()
      );
    }

    if (normalizedBook) {
      setSelectedBook(normalizedBook.abbr);
      setBookInput(normalizedBook.name);
    } else {
      setBookInput(parsed.book);
    }

    if (parsed.chapter) {
      setSelectedChapter(parsed.chapter);
    }

    handleLoadChapter({
      selectedBook: normalizedBook?.abbr,
      selectedChapter: parsed.chapter
    });
  }, [initialReference, handleLoadChapter]);

  useEffect(() => {
    handleLoadChapter();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto p-4">
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <style>{`
          .verse-num {
            color: #FBBF24 !important;
            font-weight: bold !important;
            margin-right: 0.5rem !important;
            display: inline-block !important;
            font-size: 0.9em !important;
          }
          .verse-num::after {
            content: " ";
            white-space: pre;
          }
        `}</style>

        {/* Back button (if coming from another view) */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors z-10 bg-slate-800/80 px-4 py-2 rounded-lg hover:bg-slate-700/80"
            aria-label="Back to Study Plan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-semibold">Back</span>
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          aria-label="Close Bible Reader"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 py-6">
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-4">
            📖 Bible Reader
          </h2>
          <p className="text-slate-300 text-center mb-6">
            Read full chapters or search Scripture across translations
          </p>

          <div className="bg-slate-800/70 backdrop-blur-lg rounded-lg p-6 shadow-lg space-y-4 relative z-10">
        {/* Translation and Chapter Selection */}
        <div className="flex flex-wrap justify-center gap-4">
          <select
            className="bg-slate-700 text-white rounded-md px-4 py-2"
            value={selectedTranslation.id}
            onChange={handleTranslationChange}
          >
            {SUPPORTED_TRANSLATIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Book Input with Autocomplete */}
          <div className="relative">
            <input
              type="text"
              className="bg-slate-700 text-white rounded-md px-4 py-2 w-48"
              placeholder="Type book name..."
              value={bookInput}
              onChange={handleBookInputChange}
              onFocus={handleBookInputFocus}
              onBlur={() => setTimeout(() => setShowBookSuggestions(false), 200)}
            />

            {/* Book Suggestions Dropdown */}
            {showBookSuggestions && filteredBooks.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto z-50 border border-slate-600">
                {filteredBooks.map((book) => (
                  <button
                    key={book.abbr}
                    onClick={() => handleBookSelect(book)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-600 text-white"
                  >
                    {book.name} ({book.abbr})
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="number"
            min="1"
            className="bg-slate-700 text-white rounded-md px-4 py-2 w-20"
            placeholder="Ch."
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
          />

          <button
            onClick={handleLoadChapter}
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-md"
          >
            Load Chapter
          </button>
        </div>

        {/* Search Feature */}
        <div className="border-t border-slate-600 pt-4 mt-4">
          <h3 className="text-amber-400 font-semibold mb-3 text-center">Search Scripture</h3>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-slate-700 text-white rounded-md px-4 py-2"
              placeholder="Search for verses (e.g., 'love', 'faith', 'salvation')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2 rounded-md disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Content Display Area */}
      <div className="mt-8 bg-slate-900/60 rounded-lg p-6 shadow-inner">
        {loading ? (
          <p className="text-amber-400 italic">Loading chapter...</p>
        ) : searching ? (
          <p className="text-blue-400 italic">Searching...</p>
        ) : error ? (
          <p className={error.startsWith('⚠️') ? "text-amber-400" : "text-red-400"}>{error}</p>
        ) : showSearchResults ? (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-400 mb-4">
              Search Results ({searchResults.length})
            </h3>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div key={index} className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-amber-400 font-semibold mb-2">
                    {result.reference}
                  </div>
                  <div className="text-slate-100 leading-relaxed">
                    {result.text}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">No results found.</p>
            )}
          </div>
        ) : (
          <div
            className="text-slate-100 text-lg text-left px-6 py-4 max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: chapterText }}
          />
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleReaderView;
