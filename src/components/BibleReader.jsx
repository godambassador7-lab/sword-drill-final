import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Columns, Heart, BookmarkPlus, BookOpen } from 'lucide-react';

const BibleReader = ({ selectedTranslation = 'KJV', initialReference = null, userData, onUpdateUserData }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterContent, setChapterContent] = useState([]);
  const [bookInput, setBookInput] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  // Parallel view states
  const [parallelMode, setParallelMode] = useState(false);
  const [secondaryTranslation, setSecondaryTranslation] = useState('ESV');
  const [secondaryChapterContent, setSecondaryChapterContent] = useState([]);
  const [loadingSecondary, setLoadingSecondary] = useState(false);

  // Verse range selection states
  const [startVerse, setStartVerse] = useState('');
  const [endVerse, setEndVerse] = useState('');
  const [filteredVerses, setFilteredVerses] = useState([]);

  // Validate and fix translation
  const validTranslations = ['KJV', 'ASV', 'WEB', 'ESV', 'NIV', 'NLT', 'YLT'];
  const activeTranslation = validTranslations.includes(selectedTranslation?.toUpperCase())
    ? selectedTranslation.toUpperCase()
    : 'KJV';

  // Bible book structure with chapter counts
  const bibleBooks = [
    // Old Testament
    { name: 'Genesis', abbr: 'Gen', chapters: 50 },
    { name: 'Exodus', abbr: 'Exod', chapters: 40 },
    { name: 'Leviticus', abbr: 'Lev', chapters: 27 },
    { name: 'Numbers', abbr: 'Num', chapters: 36 },
    { name: 'Deuteronomy', abbr: 'Deut', chapters: 34 },
    { name: 'Joshua', abbr: 'Josh', chapters: 24 },
    { name: 'Judges', abbr: 'Judg', chapters: 21 },
    { name: 'Ruth', abbr: 'Ruth', chapters: 4 },
    { name: '1 Samuel', abbr: '1Sam', chapters: 31 },
    { name: '2 Samuel', abbr: '2Sam', chapters: 24 },
    { name: '1 Kings', abbr: '1Kgs', chapters: 22 },
    { name: '2 Kings', abbr: '2Kgs', chapters: 25 },
    { name: '1 Chronicles', abbr: '1Chr', chapters: 29 },
    { name: '2 Chronicles', abbr: '2Chr', chapters: 36 },
    { name: 'Ezra', abbr: 'Ezra', chapters: 10 },
    { name: 'Nehemiah', abbr: 'Neh', chapters: 13 },
    { name: 'Esther', abbr: 'Esth', chapters: 10 },
    { name: 'Job', abbr: 'Job', chapters: 42 },
    { name: 'Psalms', abbr: 'Ps', chapters: 150 },
    { name: 'Proverbs', abbr: 'Prov', chapters: 31 },
    { name: 'Ecclesiastes', abbr: 'Eccl', chapters: 12 },
    { name: 'Song of Solomon', abbr: 'Song', chapters: 8 },
    { name: 'Isaiah', abbr: 'Isa', chapters: 66 },
    { name: 'Jeremiah', abbr: 'Jer', chapters: 52 },
    { name: 'Lamentations', abbr: 'Lam', chapters: 5 },
    { name: 'Ezekiel', abbr: 'Ezek', chapters: 48 },
    { name: 'Daniel', abbr: 'Dan', chapters: 12 },
    { name: 'Hosea', abbr: 'Hos', chapters: 14 },
    { name: 'Joel', abbr: 'Joel', chapters: 3 },
    { name: 'Amos', abbr: 'Amos', chapters: 9 },
    { name: 'Obadiah', abbr: 'Obad', chapters: 1 },
    { name: 'Jonah', abbr: 'Jonah', chapters: 4 },
    { name: 'Micah', abbr: 'Mic', chapters: 7 },
    { name: 'Nahum', abbr: 'Nah', chapters: 3 },
    { name: 'Habakkuk', abbr: 'Hab', chapters: 3 },
    { name: 'Zephaniah', abbr: 'Zeph', chapters: 3 },
    { name: 'Haggai', abbr: 'Hag', chapters: 2 },
    { name: 'Zechariah', abbr: 'Zech', chapters: 14 },
    { name: 'Malachi', abbr: 'Mal', chapters: 4 },
    // New Testament
    { name: 'Matthew', abbr: 'Matt', chapters: 28 },
    { name: 'Mark', abbr: 'Mark', chapters: 16 },
    { name: 'Luke', abbr: 'Luke', chapters: 24 },
    { name: 'John', abbr: 'John', chapters: 21 },
    { name: 'Acts', abbr: 'Acts', chapters: 28 },
    { name: 'Romans', abbr: 'Rom', chapters: 16 },
    { name: '1 Corinthians', abbr: '1Cor', chapters: 16 },
    { name: '2 Corinthians', abbr: '2Cor', chapters: 13 },
    { name: 'Galatians', abbr: 'Gal', chapters: 6 },
    { name: 'Ephesians', abbr: 'Eph', chapters: 6 },
    { name: 'Philippians', abbr: 'Phil', chapters: 4 },
    { name: 'Colossians', abbr: 'Col', chapters: 4 },
    { name: '1 Thessalonians', abbr: '1Thess', chapters: 5 },
    { name: '2 Thessalonians', abbr: '2Thess', chapters: 3 },
    { name: '1 Timothy', abbr: '1Tim', chapters: 6 },
    { name: '2 Timothy', abbr: '2Tim', chapters: 4 },
    { name: 'Titus', abbr: 'Titus', chapters: 3 },
    { name: 'Philemon', abbr: 'Phlm', chapters: 1 },
    { name: 'Hebrews', abbr: 'Heb', chapters: 13 },
    { name: 'James', abbr: 'Jas', chapters: 5 },
    { name: '1 Peter', abbr: '1Pet', chapters: 5 },
    { name: '2 Peter', abbr: '2Pet', chapters: 3 },
    { name: '1 John', abbr: '1John', chapters: 5 },
    { name: '2 John', abbr: '2John', chapters: 1 },
    { name: '3 John', abbr: '3John', chapters: 1 },
    { name: 'Jude', abbr: 'Jude', chapters: 1 },
    { name: 'Revelation', abbr: 'Rev', chapters: 22 },
  ];

  // Topic-based search keywords
  const topicKeywords = {
    'Love': ['love', 'beloved', 'charity'],
    'Faith': ['faith', 'believe', 'trust'],
    'Hope': ['hope', 'trust', 'confidence'],
    'Peace': ['peace', 'rest', 'calm'],
    'Prayer': ['pray', 'prayer', 'supplication'],
    'Salvation': ['salvation', 'saved', 'redemption', 'redeemed'],
    'Grace': ['grace', 'mercy', 'merciful'],
    'Wisdom': ['wisdom', 'wise', 'understanding'],
    'Joy': ['joy', 'joyful', 'rejoice', 'gladness'],
    'Strength': ['strength', 'strong', 'mighty', 'power'],
    'Forgiveness': ['forgive', 'forgiveness', 'pardon'],
    'Comfort': ['comfort', 'console', 'encourage'],
    'Righteousness': ['righteous', 'righteousness', 'just', 'justice'],
    'Heaven': ['heaven', 'heavenly', 'eternal life'],
    'Holy Spirit': ['spirit', 'holy spirit', 'comforter'],
  };

  // Filter books based on search input
  useEffect(() => {
    if (bookInput.trim() === '') {
      setFilteredBooks([]);
      setShowSuggestions(false);
    } else {
      const filtered = bibleBooks.filter(book =>
        book.name.toLowerCase().includes(bookInput.toLowerCase()) ||
        book.abbr.toLowerCase().includes(bookInput.toLowerCase())
      );
      setFilteredBooks(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  }, [bookInput]);

  // Filter verses based on range selection
  useEffect(() => {
    if (chapterContent.length === 0) {
      setFilteredVerses([]);
      return;
    }

    // If no range specified, show all verses
    if (!startVerse && !endVerse) {
      setFilteredVerses(chapterContent);
      return;
    }

    const start = startVerse ? parseInt(startVerse) : 1;
    const end = endVerse ? parseInt(endVerse) : chapterContent.length;

    const filtered = chapterContent.filter(verse =>
      verse.verse >= start && verse.verse <= end
    );
    setFilteredVerses(filtered);
  }, [chapterContent, startVerse, endVerse]);

  // Parse and navigate to initial reference (e.g., "John 3:16")
  useEffect(() => {
    if (initialReference && bibleBooks.length > 0) {
      const parseReference = (ref) => {
        const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
        if (match) {
          const bookName = match[1].trim();
          const chapter = parseInt(match[2]);
          const verse = parseInt(match[3]);

          const book = bibleBooks.find(b =>
            b.name.toLowerCase() === bookName.toLowerCase() ||
            b.abbr.toLowerCase() === bookName.toLowerCase()
          );

          if (book) {
            return { book, chapter, verse };
          }
        }
        return null;
      };

      const parsed = parseReference(initialReference);
      if (parsed) {
        setSelectedBook(parsed.book);
        setSelectedChapter(parsed.chapter);
      }
    }
  }, [initialReference]);

  const loadChapter = async (book, chapter) => {
    setLoading(true);
    try {
      // Load from local Bible files using the validated translation
      // Files are named by book name (e.g., Genesis.json)
      // Using process.env.PUBLIC_URL to ensure correct path in all environments
      const url = `${process.env.PUBLIC_URL}/bible/${activeTranslation.toLowerCase()}/${book.name}.json`;
      console.log('Fetching:', url);

      const response = await fetch(url);
      console.log('Response status:', response.status, response.statusText);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON but got ${contentType}. File may not exist at ${url}`);
        }

        const data = await response.json();
        console.log('Loaded book data:', data.book, 'Chapters:', Object.keys(data.chapters).length);

        // Structure: { "book": "Genesis", "chapters": { "1": { "1": "verse text", "2": "verse text" } } }
        const chapterData = data.chapters[chapter.toString()];
        if (chapterData) {
          // Convert object to array format and remove paragraph markers
          const verses = Object.entries(chapterData).map(([verseNum, text]) => ({
            verse: parseInt(verseNum),
            text: text.replace(/^¶\s*/, '') // Remove paragraph marker at the beginning
          }));
          console.log(`Loaded ${verses.length} verses for chapter ${chapter}`);
          setChapterContent(verses);
        } else {
          console.error(`Chapter ${chapter} not found in ${book.name}`);
          setChapterContent([
            { verse: 1, text: `Chapter ${chapter} not found in ${book.name}. Available chapters: ${Object.keys(data.chapters).join(', ')}` }
          ]);
        }
      } else {
        console.error('Failed to fetch:', response.status, response.statusText);
        setChapterContent([
          { verse: 1, text: `${book.name} not found in ${activeTranslation}. Status: ${response.status}` }
        ]);
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
      setChapterContent([
        { verse: 1, text: `Error: ${error.message}` }
      ]);
    }
    setLoading(false);
  };

  const loadSecondaryChapter = async (book, chapter, translation) => {
    setLoadingSecondary(true);
    try {
      const url = `${process.env.PUBLIC_URL}/bible/${translation.toLowerCase()}/${book.name}.json`;
      console.log('Fetching secondary translation:', url);

      const response = await fetch(url);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON but got ${contentType}. File may not exist at ${url}`);
        }

        const data = await response.json();
        const chapterData = data.chapters[chapter.toString()];

        if (chapterData) {
          const verses = Object.entries(chapterData).map(([verseNum, text]) => ({
            verse: parseInt(verseNum),
            text: text.replace(/^¶\s*/, '')
          }));
          setSecondaryChapterContent(verses);
        } else {
          console.error(`Chapter ${chapter} not found in ${book.name} (${translation})`);
          setSecondaryChapterContent([
            { verse: 1, text: `Chapter ${chapter} not found in ${book.name}` }
          ]);
        }
      } else {
        console.error('Failed to fetch secondary translation:', response.status, response.statusText);
        setSecondaryChapterContent([
          { verse: 1, text: `${book.name} not found in ${translation}. Status: ${response.status}` }
        ]);
      }
    } catch (error) {
      console.error('Error loading secondary chapter:', error);
      setSecondaryChapterContent([
        { verse: 1, text: `Error: ${error.message}` }
      ]);
    }
    setLoadingSecondary(false);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setBookInput(book.name);
    setShowSuggestions(false);
    loadChapter(book, 1);
    if (parallelMode) {
      loadSecondaryChapter(book, 1, secondaryTranslation);
    }
  };

  const handleChapterChange = (newChapter) => {
    if (selectedBook && newChapter >= 1 && newChapter <= selectedBook.chapters) {
      setSelectedChapter(newChapter);
      loadChapter(selectedBook, newChapter);
      if (parallelMode) {
        loadSecondaryChapter(selectedBook, newChapter, secondaryTranslation);
      }
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setSearching(true);
    const results = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);

    try {
      for (const book of bibleBooks) {
        const url = `${process.env.PUBLIC_URL}/bible/${activeTranslation.toLowerCase()}/${book.name}.json`;

        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();

            for (const [chapterNum, verses] of Object.entries(data.chapters)) {
              for (const [verseNum, verseText] of Object.entries(verses)) {
                const cleanedText = verseText.replace(/^¶\s*/, '').toLowerCase();

                if (searchTerms.every(term => cleanedText.includes(term))) {
                  results.push({
                    book: book.name,
                    chapter: parseInt(chapterNum),
                    verse: parseInt(verseNum),
                    text: verseText.replace(/^¶\s*/, ''),
                    bookData: book
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error searching ${book.name}:`, error);
        }
      }

      setSearchResults(results.slice(0, 100));
    } catch (error) {
      console.error('Search error:', error);
    }
    setSearching(false);
  };

  const handleSearch = () => {
    performSearch(searchQuery);
  };

  const handleTopicSearch = (topic) => {
    setSelectedTopic(topic);
    const keywords = topicKeywords[topic];
    if (keywords && keywords.length > 0) {
      setSearchQuery(keywords[0]);
      performSearch(keywords.join(' OR '));
    }
  };

  const navigateToVerse = (result) => {
    setSelectedBook(result.bookData);
    setSelectedChapter(result.chapter);
    setBookInput(result.book);
    setSearchMode(false);
    setSearchResults([]);
    loadChapter(result.bookData, result.chapter);
    if (parallelMode) {
      loadSecondaryChapter(result.bookData, result.chapter, secondaryTranslation);
    }
  };

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    if (!searchMode) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedTopic('');
    }
  };

  const toggleParallelMode = () => {
    const newParallelMode = !parallelMode;
    setParallelMode(newParallelMode);

    // Load secondary translation if turning on parallel mode and a book is selected
    if (newParallelMode && selectedBook) {
      loadSecondaryChapter(selectedBook, selectedChapter, secondaryTranslation);
    }
  };

  const handleSecondaryTranslationChange = (translation) => {
    setSecondaryTranslation(translation);

    // Reload secondary chapter with new translation if in parallel mode
    if (parallelMode && selectedBook) {
      loadSecondaryChapter(selectedBook, selectedChapter, translation);
    }
  };

  const addToPersonalMemoryVerses = (verse) => {
    if (!userData || !onUpdateUserData) {
      alert('Unable to save verse. User data not available.');
      return;
    }

    const verseReference = `${selectedBook.name} ${selectedChapter}:${verse.verse}`;
    const personalVerse = {
      reference: verseReference,
      text: verse.text,
      book: selectedBook.name,
      chapter: selectedChapter,
      verse: verse.verse,
      translation: activeTranslation,
      dateAdded: new Date().toISOString()
    };

    // Initialize personalMemoryVerses if it doesn't exist
    const currentVerses = userData.personalMemoryVerses || [];

    // Check if verse already exists
    const alreadyExists = currentVerses.some(v =>
      v.book === personalVerse.book &&
      v.chapter === personalVerse.chapter &&
      v.verse === personalVerse.verse &&
      v.translation === personalVerse.translation
    );

    if (alreadyExists) {
      alert(`${verseReference} is already in your Personal Verse Bank!`);
      return;
    }

    // Add the verse
    const updatedVerses = [...currentVerses, personalVerse];
    onUpdateUserData({
      ...userData,
      personalMemoryVerses: updatedVerses
    });

    alert(`✓ Added ${verseReference} to Personal Verse Bank!`);
  };

  const isVerseInBank = (verse) => {
    if (!userData || !userData.personalMemoryVerses) return false;

    return userData.personalMemoryVerses.some(v =>
      v.book === selectedBook.name &&
      v.chapter === selectedChapter &&
      v.verse === verse.verse &&
      v.translation === activeTranslation
    );
  };

  return (
    <div>
      {/* Translation Info & Control Buttons */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-slate-400 text-sm">Reading from {activeTranslation} • All content stored locally</p>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleParallelMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              parallelMode
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            <Columns size={18} />
            {parallelMode ? 'Single View' : 'Parallel View'}
          </button>
          <button
            onClick={toggleSearchMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              searchMode
                ? 'bg-amber-500 text-slate-900 hover:bg-amber-600'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            {searchMode ? <X size={18} /> : <Search size={18} />}
            {searchMode ? 'Close Search' : 'Search Bible'}
          </button>
        </div>
      </div>

      {/* Secondary Translation Selector (visible in parallel mode) */}
      {parallelMode && !searchMode && (
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
          <label className="block text-slate-300 text-sm font-semibold mb-2">
            Secondary Translation for Comparison
          </label>
          <select
            value={secondaryTranslation}
            onChange={(e) => handleSecondaryTranslationChange(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-emerald-500 focus:outline-none"
          >
            {validTranslations
              .filter(trans => trans !== activeTranslation)
              .map(trans => (
                <option key={trans} value={trans}>
                  {trans}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Search Interface */}
      {searchMode ? (
        <div className="space-y-4">
          {/* Keyword Search */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Search by Keyword
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter keywords (e.g., faith love hope)..."
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="px-6 py-3 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Topic Search */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Or Search by Topic
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(topicKeywords).map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicSearch(topic)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedTopic === topic
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-slate-400">Searching entire Bible...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-bold text-amber-400 mb-4 sticky top-0 bg-slate-800 pb-2 border-b border-slate-700">
                Found {searchResults.length} verses {searchResults.length === 100 && '(showing first 100)'}
              </h3>
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => navigateToVerse(result)}
                    className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-amber-400 font-bold text-sm">
                        {result.book} {result.chapter}:{result.verse}
                      </span>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {result.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery && !searching ? (
            <div className="text-center py-12 text-slate-400">
              <Search size={48} className="mx-auto mb-3 opacity-50" />
              <p>No results found. Try different keywords.</p>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {/* Book Selection Input */}
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Select Book
            </label>
            <div className="relative">
              <input
                type="text"
                value={bookInput}
                onChange={(e) => setBookInput(e.target.value)}
                onFocus={() => bookInput && setShowSuggestions(true)}
                placeholder="Type a book name (e.g., John, Genesis, Romans)..."
                className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />

              {/* Book Suggestions Dropdown */}
              {showSuggestions && filteredBooks.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredBooks.map((book) => (
                    <button
                      key={book.abbr}
                      onClick={() => handleBookSelect(book)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-all border-b border-slate-700 last:border-0"
                    >
                      <span className="text-white font-semibold">{book.name}</span>
                      <span className="text-slate-400 text-sm ml-2">({book.chapters} chapters)</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chapter Navigation */}
          {selectedBook && (
            <>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-600">
                <button
                  onClick={() => handleChapterChange(selectedChapter - 1)}
                  disabled={selectedChapter === 1}
                  className="p-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>

                <select
                  value={selectedChapter}
                  onChange={(e) => handleChapterChange(parseInt(e.target.value))}
                  className="flex-1 px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
                    <option key={ch} value={ch}>
                      {selectedBook.name} Chapter {ch}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleChapterChange(selectedChapter + 1)}
                  disabled={selectedChapter === selectedBook.chapters}
                  className="p-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Verse Range Selector */}
              {chapterContent.length > 0 && (
                <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Filter by Verse Range (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">From:</span>
                      <input
                        type="number"
                        min="1"
                        max={chapterContent.length}
                        value={startVerse}
                        onChange={(e) => setStartVerse(e.target.value)}
                        placeholder="1"
                        className="w-20 px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">To:</span>
                      <input
                        type="number"
                        min={startVerse || "1"}
                        max={chapterContent.length}
                        value={endVerse}
                        onChange={(e) => setEndVerse(e.target.value)}
                        placeholder={chapterContent.length.toString()}
                        className="w-20 px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    {(startVerse || endVerse) && (
                      <button
                        onClick={() => {
                          setStartVerse('');
                          setEndVerse('');
                        }}
                        className="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all text-sm"
                      >
                        Clear
                      </button>
                    )}
                    <div className="ml-auto text-slate-400 text-sm">
                      Showing {filteredVerses.length} of {chapterContent.length} verses
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Chapter Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading chapter...</p>
            </div>
          ) : selectedBook && chapterContent.length > 0 ? (
            <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-slate-800 pb-2 border-b border-slate-700 mb-4">
                {parallelMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="text-lg font-bold text-amber-400">
                      {selectedBook.name} {selectedChapter} ({activeTranslation})
                    </h3>
                    <h3 className="text-lg font-bold text-emerald-400">
                      {selectedBook.name} {selectedChapter} ({secondaryTranslation})
                    </h3>
                  </div>
                ) : (
                  <h3 className="text-lg font-bold text-amber-400">
                    {selectedBook.name} {selectedChapter}
                  </h3>
                )}
              </div>

              {parallelMode ? (
                // Parallel View Layout
                <div className="space-y-4">
                  {loadingSecondary ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-2"></div>
                      <p className="text-slate-400 text-sm">Loading secondary translation...</p>
                    </div>
                  ) : (
                    filteredVerses.map((verse, index) => {
                      const secondaryVerse = secondaryChapterContent.find(v => v.verse === verse.verse);
                      const inBank = isVerseInBank(verse);
                      return (
                        <div key={index} className="group grid grid-cols-1 md:grid-cols-2 gap-4 p-3 hover:bg-slate-700/30 rounded transition-all border border-transparent hover:border-slate-600 relative">
                          {/* Primary Translation (Left Column) */}
                          <div className="flex gap-3">
                            <span className="text-amber-400 font-bold text-sm mt-0.5 min-w-[2rem]">
                              {verse.verse}
                            </span>
                            <p className="text-slate-200 leading-relaxed">
                              {verse.text}
                            </p>
                          </div>

                          {/* Divider for mobile */}
                          <div className="md:hidden border-l-2 border-slate-600 mx-4"></div>

                          {/* Secondary Translation (Right Column) */}
                          <div className="flex gap-3 md:border-l-2 md:border-slate-600 md:pl-4">
                            <span className="text-emerald-400 font-bold text-sm mt-0.5 min-w-[2rem] md:hidden">
                              {verse.verse}
                            </span>
                            <p className="text-slate-200 leading-relaxed flex-1">
                              {secondaryVerse ? secondaryVerse.text : '...'}
                            </p>
                          </div>

                          {/* Add to Memory Verse Button */}
                          <button
                            onClick={() => addToPersonalMemoryVerses(verse)}
                            disabled={inBank}
                            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg ${
                              inBank
                                ? 'bg-emerald-600 cursor-not-allowed'
                                : 'bg-cyan-600 hover:bg-cyan-700'
                            }`}
                            title={inBank ? 'Already in Personal Verse Bank' : 'Add to Personal Memory Verse'}
                          >
                            {inBank ? (
                              <BookOpen size={16} className="text-white" />
                            ) : (
                              <BookmarkPlus size={16} className="text-white" />
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                // Single View Layout
                <div className="space-y-3">
                  {filteredVerses.map((verse, index) => {
                    const inBank = isVerseInBank(verse);
                    return (
                      <div key={index} className="group relative flex gap-3 hover:bg-slate-700/30 p-3 rounded transition-all border border-transparent hover:border-slate-600">
                        <span className="text-amber-400 font-bold text-sm mt-0.5 min-w-[2rem]">
                          {verse.verse}
                        </span>
                        <p className="text-slate-200 leading-relaxed flex-1">
                          {verse.text}
                        </p>
                        <button
                          onClick={() => addToPersonalMemoryVerses(verse)}
                          disabled={inBank}
                          className={`opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg ${
                            inBank
                              ? 'bg-emerald-600 cursor-not-allowed'
                              : 'bg-cyan-600 hover:bg-cyan-700'
                          }`}
                          title={inBank ? 'Already in Personal Verse Bank' : 'Add to Personal Memory Verse'}
                        >
                          {inBank ? (
                            <BookOpen size={16} className="text-white" />
                          ) : (
                            <BookmarkPlus size={16} className="text-white" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <div className="text-6xl mb-3">📖</div>
              <p>Type a book name above to start reading</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BibleReader;
