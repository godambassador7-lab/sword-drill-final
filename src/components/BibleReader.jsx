import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Columns, BookOpen } from 'lucide-react';
import { simplifyText } from '../services/simplifiedMode';
import { getKjvStrongsChapter } from '../services/kjvStrongsProvider';
import { ESV_TRANSLATION, getEsvChapter } from '../services/esvApiService';
import AddVerseConfirmation from './AddVerseConfirmation';

const BibleReader = ({ selectedTranslation = ESV_TRANSLATION, initialReference = null, userData, onUpdateUserData }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterContent, setChapterContent] = useState([]);
  const [bookInput, setBookInput] = useState('');
  const [quickReference, setQuickReference] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const strongsCache = useRef({});
  const [strongsPopover, setStrongsPopover] = useState(null);

  // Track if this is the initial load
  const isInitialLoad = useRef(true);

  // Parallel view states
  const [parallelMode, setParallelMode] = useState(false);
  const [secondaryTranslation, setSecondaryTranslation] = useState(ESV_TRANSLATION);
  const [secondaryChapterContent, setSecondaryChapterContent] = useState([]);
  const [loadingSecondary, setLoadingSecondary] = useState(false);

  // Verse range selection states
  const [startVerse, setStartVerse] = useState('');
  const [endVerse, setEndVerse] = useState('');
  const [filteredVerses, setFilteredVerses] = useState([]);

  // Add verse confirmation modal state
  const [pendingVerse, setPendingVerse] = useState(null);
  const [showAddVerseConfirmation, setShowAddVerseConfirmation] = useState(false);

  // Scroll position tracking
  const contentRef = useRef(null);
  const hasRestoredScroll = useRef(false);

  const activeTranslation = ESV_TRANSLATION;

  const getStrongsEntry = (code) => {
    if (!code) return null;
    const key = code.toUpperCase();
    if (strongsCache.current[key]) return strongsCache.current[key];
    try {
      const isHebrew = key.startsWith('H');
      const dict = isHebrew
        ? require('../data/strongs-master/strongs-master/hebrew/strongs-hebrew-dictionary.js')
        : require('../data/strongs-master/strongs-master/greek/strongs-greek-dictionary.js');
      const entry = dict[key] || dict[key.replace(/^[HG]/, '')] || null;
      strongsCache.current[key] = entry;
      return entry;
    } catch (err) {
      console.error('Failed to load Strong\'s entry', err);
      return null;
    }
  };

  const renderStrongsTokens = (tokens = []) => {
    return (
      <span className="inline-flex flex-wrap gap-2">
        {tokens.map((tok, idx) => (
          <span
            key={`${tok.word}-${tok.strongs}-${idx}`}
            className="group inline-flex flex-col items-center leading-tight cursor-pointer transition-colors"
            title={tok.strongs}
            onClick={() => {
              const entry = getStrongsEntry(tok.strongs);
              setStrongsPopover({
                code: tok.strongs,
                def: entry?.strongs_def || 'Definition not available',
                usage: entry?.kjv_def || '',
                translit: entry?.translit || entry?.lemma || ''
              });
            }}
          >
            <span className="text-emerald-400 text-[10px] font-semibold leading-none transition-colors group-hover:text-red-400">
              {tok.strongs}
            </span>
            <span className="text-slate-200">{tok.word}</span>
          </span>
        ))}
      </span>
    );
  };

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
  // Only applies if explicitly provided, otherwise use saved passage
  useEffect(() => {
    if (initialReference && bibleBooks.length > 0 && isInitialLoad.current) {
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
        isInitialLoad.current = false;
      }
    } else if (!initialReference && isInitialLoad.current && bibleBooks.length > 0) {
      // Load saved passage on initial mount if no initialReference provided
      const saved = localStorage.getItem('bibleReaderLastPassage');
      if (saved) {
        try {
          const { bookName, chapter } = JSON.parse(saved);
          const book = bibleBooks.find(b => b.name === bookName);
          if (book) {
            console.log('📖 [BibleReader] Restoring last passage:', bookName, chapter);
            setSelectedBook(book);
            setSelectedChapter(chapter);
            // Auto-load the chapter content when restoring from localStorage
            loadChapter(book, chapter);
            if (parallelMode) {
              loadSecondaryChapter(book, chapter, secondaryTranslation);
            }
          }
        } catch (e) {
          console.error('Error restoring saved passage:', e);
        }
      }
      isInitialLoad.current = false;
    }
  }, [initialReference, bibleBooks, parallelMode, secondaryTranslation]);

  // Save current passage to localStorage whenever book or chapter changes
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      const passageData = {
        bookName: selectedBook.name,
        chapter: selectedChapter
      };
      localStorage.setItem('bibleReaderLastPassage', JSON.stringify(passageData));
      console.log('💾 [BibleReader] Saved passage:', selectedBook.name, selectedChapter);
    }
  }, [selectedBook, selectedChapter]);

  // Restore scroll position after chapter content loads
  useEffect(() => {
    if (contentRef.current && selectedBook && chapterContent.length > 0 && !hasRestoredScroll.current) {
      const scrollKey = `bibleScroll_${selectedBook.name}_${selectedChapter}`;
      const savedScroll = localStorage.getItem(scrollKey);
      if (savedScroll) {
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.scrollTop = parseInt(savedScroll);
            console.log('📜 [BibleReader] Restored scroll position:', savedScroll);
          }
        }, 100);
      }
      hasRestoredScroll.current = true;
    }
  }, [selectedBook, selectedChapter, chapterContent]);

  const loadChapter = async (book, chapter) => {
    // Save current scroll position before loading new chapter
    if (contentRef.current && selectedBook) {
      const scrollKey = `bibleScroll_${selectedBook.name}_${selectedChapter}`;
      localStorage.setItem(scrollKey, contentRef.current.scrollTop.toString());
    }

    // Reset scroll restoration flag for new chapter
    hasRestoredScroll.current = false;

    setLoading(true);
    try {
      const esvVerses = await getEsvChapter(book.name, chapter);
      setChapterContent(
        esvVerses && esvVerses.length > 0
          ? esvVerses
          : [{ verse: 1, text: `${book.name} ${chapter} was not returned by the ESV API.` }]
      );
      setLoading(false);
      return;

      if (activeTranslation === 'KJV_STRONGS') {
        const verses = await getKjvStrongsChapter(book.name, chapter);
        if (verses && verses.length > 0) {
          setChapterContent(verses);
        } else {
          setChapterContent([
            { verse: 1, text: `No Strong's data for ${book.name} ${chapter}` }
          ]);
        }
        setLoading(false);
        return;
      }
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
          const verses = Object.entries(chapterData).map(([verseNum, text]) => {
            // Remove paragraph marker at the beginning
            let cleanedText = text.replace(/^¶\s*/, '');

            // Apply simplified mode if enabled
            if (userData?.simplifiedMode) {
              cleanedText = simplifyText(cleanedText, activeTranslation);
            }

            return {
              verse: parseInt(verseNum),
              text: cleanedText
            };
          });
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
      const esvVerses = await getEsvChapter(book.name, chapter);
      setSecondaryChapterContent(
        esvVerses && esvVerses.length > 0
          ? esvVerses
          : [{ verse: 1, text: `${book.name} ${chapter} was not returned by the ESV API.` }]
      );
      setLoadingSecondary(false);
      return;

      if (translation === 'KJV_STRONGS') {
        const verses = await getKjvStrongsChapter(book.name, chapter);
        if (verses && verses.length > 0) {
          setSecondaryChapterContent(verses);
        } else {
          setSecondaryChapterContent([
            { verse: 1, text: `No Strong's data for ${book.name} ${chapter}` }
          ]);
        }
        setLoadingSecondary(false);
        return;
      }
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
          const verses = Object.entries(chapterData).map(([verseNum, text]) => {
            // Remove paragraph marker at the beginning
            let cleanedText = text.replace(/^¶\s*/, '');

            // Apply simplified mode if enabled
            if (userData?.simplifiedMode) {
              cleanedText = simplifyText(cleanedText, translation);
            }

            return {
              verse: parseInt(verseNum),
              text: cleanedText
            };
          });
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

  const handleQuickReferenceGo = () => {
    const ref = quickReference.trim();
    if (!ref) return;
    const match = ref.match(/^\s*([1-3]?\\s?[A-Za-z][A-Za-z\\s]+)\\s+(\\d+)(?::(\\d+))?/i);
    if (!match) return;
    const bookName = match[1].trim();
    const chapterNum = parseInt(match[2], 10);
    const verseNum = match[3] ? parseInt(match[3], 10) : null;
    const book = bibleBooks.find(b =>
      b.name.toLowerCase() === bookName.toLowerCase() ||
      b.abbr.toLowerCase() === bookName.toLowerCase() ||
      b.name.toLowerCase().startsWith(bookName.toLowerCase())
    );
    if (!book) return;
    if (chapterNum < 1 || chapterNum > book.chapters) return;
    setQuickReference('');
    setSelectedBook(book);
    setBookInput(book.name);
    setSelectedChapter(chapterNum);
    setStartVerse(verseNum ? String(verseNum) : '');
    setEndVerse(verseNum ? String(verseNum) : '');
    loadChapter(book, chapterNum);
    if (parallelMode) {
      loadSecondaryChapter(book, chapterNum, secondaryTranslation);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setSearching(true);
    setSearchResults([]);
    setSearching(false);
    return;

    const results = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);

    try {
      for (const book of bibleBooks) {
        if (activeTranslation === 'KJV_STRONGS') {
          for (let ch = 1; ch <= book.chapters; ch++) {
            const verses = await getKjvStrongsChapter(book.name, ch);
            if (!verses || verses.length === 0) continue;

            verses.forEach(v => {
              const cleanedText = (v.text || '').toLowerCase();
              if (searchTerms.every(term => cleanedText.includes(term))) {
                results.push({
                  book: book.name,
                  chapter: ch,
                  verse: v.verse,
                  text: v.text,
                  bookData: book
                });
              }
            });
          }
          continue;
        }
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
    if (translation === 'KJV_STRONGS' && !userData?.unlockables?.kjvStrongs) {
      alert("Unlock KJV w/ Strong's before using it as a parallel translation.");
      return;
    }
    setSecondaryTranslation(translation);

    // Reload secondary chapter with new translation if in parallel mode
    if (parallelMode && selectedBook) {
      loadSecondaryChapter(selectedBook, selectedChapter, translation);
    }
  };

  const showAddVerseModal = (verse) => {
    setPendingVerse(verse);
    setShowAddVerseConfirmation(true);
  };

  const confirmAddVerse = () => {
    if (!pendingVerse || !userData || !onUpdateUserData) return;

    if (activeTranslation === 'KJV_STRONGS') {
      window.alert('KJV w/ Strong\'s cannot be saved to the Personal Verse Bank. Please switch to KJV (or another translation) before adding.');
      setShowAddVerseConfirmation(false);
      setPendingVerse(null);
      return;
    }

    const verseReference = `${selectedBook.name} ${selectedChapter}:${pendingVerse.verse}`;
    const personalVerse = {
      reference: verseReference,
      text: pendingVerse.text,
      book: selectedBook.name,
      chapter: selectedChapter,
      verse: pendingVerse.verse,
      translation: activeTranslation,
      dateAdded: new Date().toISOString()
    };

    // Initialize personalMemoryVerses if it doesn't exist
    const currentVerses = userData.personalMemoryVerses || [];

    // Add the verse
    const updatedVerses = [...currentVerses, personalVerse];
    onUpdateUserData({
      ...userData,
      personalMemoryVerses: updatedVerses
    });

    // Close modal and reset
    setShowAddVerseConfirmation(false);
    setPendingVerse(null);
  };

  const cancelAddVerse = () => {
    setShowAddVerseConfirmation(false);
    setPendingVerse(null);
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

  // State for collapsible advanced features
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  return (
    <div className="w-full">
      {/* Clean Header - YouVersion Style */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <BookOpen size={20} className="text-amber-400 flex-shrink-0" />
          <span className="text-white font-semibold text-base truncate">
            {selectedBook ? `${selectedBook.name} ${selectedChapter}` : 'Bible Reader'}
          </span>
          <span className="text-slate-400 text-sm flex-shrink-0">{activeTranslation}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleParallelMode}
            className={`p-2 rounded-lg transition-all ${
              parallelMode
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="Parallel View"
          >
            <Columns size={20} />
          </button>
          <button
            onClick={toggleSearchMode}
            className={`p-2 rounded-lg transition-all ${
              searchMode
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="Search Bible"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Quick reference jump */}
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          value={quickReference}
          onChange={(e) => setQuickReference(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleQuickReferenceGo(); }}
          placeholder="Jump to reference (e.g., John 3:16)"
          className="flex-1 px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-emerald-500 focus:outline-none text-sm"
        />
        <button
          onClick={handleQuickReferenceGo}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all text-sm"
        >
          Go
        </button>
      </div>

      {/* Collapsible Advanced Features */}
      <div className="mb-3">
        <button
          onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
          className="w-full text-left px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600 transition-all flex items-center justify-between text-sm"
        >
          <span className="text-slate-300">Advanced Features</span>
          <ChevronRight
            size={16}
            className={`text-slate-400 transition-transform ${showAdvancedFeatures ? 'rotate-90' : ''}`}
          />
        </button>

        {showAdvancedFeatures && (
          <div className="mt-2 p-3 bg-slate-800/30 rounded-lg border border-slate-600 space-y-3">
            {/* Parallel Translation Selector */}
            {parallelMode && !searchMode && (
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1">
                  Translation
                </label>
                <div className="w-full px-3 py-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-sm">
                  ESV only via Crossway API
                </div>
              </div>
            )}

            {/* Verse Range Filter */}
            {selectedBook && chapterContent.length > 0 && (
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1">
                  Verse Range Filter
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={chapterContent.length}
                    value={startVerse}
                    onChange={(e) => setStartVerse(e.target.value)}
                    placeholder="From"
                    className="w-20 px-2 py-1 bg-slate-700 text-white border border-slate-600 rounded text-center text-sm"
                  />
                  <span className="text-slate-400 text-xs">to</span>
                  <input
                    type="number"
                    min={startVerse || "1"}
                    max={chapterContent.length}
                    value={endVerse}
                    onChange={(e) => setEndVerse(e.target.value)}
                    placeholder="To"
                    className="w-20 px-2 py-1 bg-slate-700 text-white border border-slate-600 rounded text-center text-sm"
                  />
                  {(startVerse || endVerse) && (
                    <button
                      onClick={() => {
                        setStartVerse('');
                        setEndVerse('');
                      }}
                      className="px-2 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="mt-1 text-slate-400 text-xs">
                  Showing {filteredVerses.length} of {chapterContent.length} verses
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
              <h3 className="text-lg font-bold text-amber-400 mb-4 sticky top-0 bg-slate-800 pb-2 border-b border-slate-700 z-10">
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
          {/* Compact Book Selection */}
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                value={bookInput}
                onChange={(e) => setBookInput(e.target.value)}
                onFocus={() => bookInput && setShowSuggestions(true)}
                placeholder="Select a book..."
                className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-emerald-500 focus:outline-none text-sm"
              />

              {/* Book Suggestions Dropdown */}
              {showSuggestions && filteredBooks.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredBooks.map((book) => (
                    <button
                      key={book.abbr}
                      onClick={() => handleBookSelect(book)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-700 transition-all border-b border-slate-700 last:border-0 text-sm"
                    >
                      <span className="text-white font-semibold">{book.name}</span>
                      <span className="text-slate-400 text-xs ml-2">({book.chapters} chapters)</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Compact Chapter Navigation */}
          {selectedBook && (
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => handleChapterChange(selectedChapter - 1)}
                disabled={selectedChapter === 1}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous chapter"
              >
                <ChevronLeft size={18} />
              </button>

              <select
                value={selectedChapter}
                onChange={(e) => handleChapterChange(parseInt(e.target.value))}
                className="flex-1 px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none text-sm"
              >
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
                  <option key={ch} value={ch}>
                    {selectedBook.name} {ch}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleChapterChange(selectedChapter + 1)}
                disabled={selectedChapter === selectedBook.chapters}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next chapter"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Chapter Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading chapter...</p>
            </div>
          ) : selectedBook && chapterContent.length > 0 ? (
            <div ref={contentRef} className="relative max-h-[70vh] overflow-y-auto overflow-x-hidden">
              {/* Removed sticky header - book/chapter shown in top navigation */}

              {parallelMode ? (
                // Parallel View Layout
                <div className="space-y-6 px-1">
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
                        <div
                          key={index}
                          className="group grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-700/50 last:border-0"
                          onDoubleClick={() => {
                            if (!inBank && activeTranslation !== 'KJV_STRONGS') {
                              showAddVerseModal(verse);
                            }
                          }}
                        >
                          {/* Primary Translation */}
                          <div className="flex gap-2">
                            <span className="text-slate-400 font-semibold text-sm mt-1 flex-shrink-0">
                              {verse.verse}
                            </span>
                            <div className="text-slate-100 leading-relaxed text-base flex-1">
                              {activeTranslation === 'KJV_STRONGS' && verse.tokens
                                ? renderStrongsTokens(verse.tokens)
                                : verse.text}
                            </div>
                          </div>

                          {/* Secondary Translation */}
                          <div className="flex gap-2 md:border-l md:border-slate-600 md:pl-4">
                            <span className="text-slate-400 font-semibold text-sm mt-1 flex-shrink-0 md:hidden">
                              {verse.verse}
                            </span>
                            <div className="text-slate-300 leading-relaxed text-base flex-1">
                              {secondaryTranslation === 'KJV_STRONGS' && secondaryVerse?.tokens
                                ? renderStrongsTokens(secondaryVerse.tokens)
                                : (secondaryVerse ? secondaryVerse.text : '...')}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                // Single View Layout - Full Width YouVersion Style
                <div className="space-y-5 px-2">
                  {filteredVerses.map((verse, index) => {
                    const inBank = isVerseInBank(verse);

                    return (
                      <div
                        key={index}
                        className="group relative"
                        onDoubleClick={() => {
                          if (!inBank && activeTranslation !== 'KJV_STRONGS') {
                            showAddVerseModal(verse);
                          }
                        }}
                      >
                        <div className="flex gap-3 items-start">
                          <span className="text-slate-400 font-semibold text-sm mt-1 flex-shrink-0">
                            {verse.verse}
                          </span>
                          <p className="text-slate-100 leading-relaxed text-base flex-1">
                            {activeTranslation === 'KJV_STRONGS' && verse.tokens
                              ? renderStrongsTokens(verse.tokens)
                              : verse.text}
                          </p>
                        </div>
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
      {strongsPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setStrongsPopover(null)}>
          <div className="bg-slate-800 border border-emerald-500/50 rounded-xl p-4 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-amber-400 font-bold text-lg">{strongsPopover.code}</div>
              <button onClick={() => setStrongsPopover(null)} className="text-slate-300 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            {strongsPopover.translit && <div className="text-slate-200 text-sm mb-1">Translit: {strongsPopover.translit}</div>}
            <div className="text-slate-100 text-base mb-2">{strongsPopover.def}</div>
            {strongsPopover.usage && (
              <div className="text-slate-300 text-sm">
                <span className="font-semibold text-emerald-300">Usage: </span>
                {strongsPopover.usage}
              </div>
            )}
          </div>
        </div>
      )}
      {showAddVerseConfirmation && pendingVerse && (
        <AddVerseConfirmation
          verse={{
            ...pendingVerse,
            book: selectedBook.name,
            chapter: selectedChapter
          }}
          onConfirm={confirmAddVerse}
          onCancel={cancelAddVerse}
        />
      )}
    </div>
  );
};

export default BibleReader;






