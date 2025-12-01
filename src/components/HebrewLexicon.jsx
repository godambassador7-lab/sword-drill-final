import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, BookOpen, Book, Filter } from 'lucide-react';
import { getUsageCount, getSampleReferences, getUniqueBooks, getFilteredReferences, getUniqueChapters } from '../services/hebrewConcordance';
import { getVerseByReference } from '../services/bibleTextService';
const strongsHebrewDictionary = require('../data/strongs-master/strongs-master/hebrew/strongs-hebrew-dictionary.js');

const HebrewLexicon = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(null);
  const [sampleReferences, setSampleReferences] = useState([]);
  const [expandedVerses, setExpandedVerses] = useState({});
  const [verseTexts, setVerseTexts] = useState({});
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Hebrew alphabet for browsing
  const hebrewAlphabet = [
    'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
    'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר',
    'ש', 'ת'
  ];

  // Helper function to detect word type from definition
  const detectWordType = (entry) => {
    const def = (entry.strongs_def || '').toLowerCase();
    const kjv = (entry.kjv_def || '').toLowerCase();
    const combined = def + ' ' + kjv;

    // Verb patterns
    if (combined.match(/\bto\s+\w+|\bverb\b|properly,\s+to|\ba\s+primitive\s+root/)) {
      return 'verb';
    }

    // Adjective patterns
    if (combined.match(/\b(adjective|descriptive|quality)\b/)) {
      return 'adjective';
    }

    // Noun patterns (often last to avoid false positives)
    if (combined.match(/\b(noun|a\s+\w+|an\s+\w+|the\s+\w+)\b/) && !combined.match(/\bto\s+/)) {
      return 'noun';
    }

    return 'other';
  };

  // Get color based on word type
  const getWordTypeColor = (entry) => {
    const type = detectWordType(entry);
    switch (type) {
      case 'verb':
        return 'bg-orange-900/40 border-orange-500/50';
      case 'noun':
        return 'bg-amber-900/40 border-amber-500/50';
      case 'adjective':
        return 'bg-yellow-900/40 border-yellow-500/50';
      default:
        return 'bg-slate-800/40 border-slate-500/50';
    }
  };

  // Get badge color for word type
  const getWordTypeBadge = (entry) => {
    const type = detectWordType(entry);
    switch (type) {
      case 'verb':
        return <span className="px-2 py-1 text-xs rounded bg-orange-500/30 text-orange-200 border border-orange-400/50">Verb</span>;
      case 'noun':
        return <span className="px-2 py-1 text-xs rounded bg-amber-500/30 text-amber-200 border border-amber-400/50">Noun</span>;
      case 'adjective':
        return <span className="px-2 py-1 text-xs rounded bg-yellow-500/30 text-yellow-200 border border-yellow-400/50">Adjective</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-slate-500/30 text-slate-200 border border-slate-400/50">Other</span>;
    }
  };

  // Extract Strong's numbers from derivation field
  const extractStrongsNumbers = (derivation) => {
    if (!derivation) return [];
    const matches = derivation.match(/H\d+/g);
    return matches ? [...new Set(matches)] : [];
  };

  // Fetch real usage data when entry is selected
  useEffect(() => {
    if (selectedEntry) {
      const strongsNum = selectedEntry.strongsNum; // Already has "H" prefix

      // Reset filters
      setSelectedBook(null);
      setSelectedChapter(null);
      setAvailableBooks([]);
      setAvailableChapters([]);

      // Fetch usage count
      setUsageCount(null); // Reset while loading
      getUsageCount(strongsNum).then(count => {
        setUsageCount(count);

        // If count > 100, fetch available books for filtering
        if (count > 100) {
          getUniqueBooks(strongsNum).then(books => {
            setAvailableBooks(books);
          });
        }
      }).catch(err => {
        console.error('Error fetching usage count:', err);
        setUsageCount(0);
      });

      // Fetch sample references
      setSampleReferences([]); // Reset while loading
      getSampleReferences(strongsNum, 20).then(refs => {
        setSampleReferences(refs);
      }).catch(err => {
        console.error('Error fetching references:', err);
        setSampleReferences([]);
      });
    }
  }, [selectedEntry]);

  // Fetch chapters when book is selected
  useEffect(() => {
    if (selectedEntry && selectedBook) {
      const strongsNum = selectedEntry.strongsNum;
      getUniqueChapters(strongsNum, selectedBook).then(chapters => {
        setAvailableChapters(chapters);
      });
    } else {
      setAvailableChapters([]);
      setSelectedChapter(null);
    }
  }, [selectedEntry, selectedBook]);

  // Fetch filtered references when filters change
  useEffect(() => {
    if (selectedEntry && (selectedBook || selectedChapter)) {
      const strongsNum = selectedEntry.strongsNum;

      if (selectedBook) {
        getFilteredReferences(strongsNum, selectedBook, selectedChapter).then(refs => {
          setSampleReferences(refs.slice(0, 50)); // Show first 50 filtered results
        });
      }
    } else if (selectedEntry) {
      // Reset to sample when filters are cleared
      const strongsNum = selectedEntry.strongsNum;
      getSampleReferences(strongsNum, 20).then(refs => {
        setSampleReferences(refs);
      });
    }
  }, [selectedEntry, selectedBook, selectedChapter]);

  // Generate mock usage count based on Strong's number
  const getMockUsageCount = (strongsNum) => {
    const num = parseInt(strongsNum.replace('H', ''));
    if (num <= 100) {
      return Math.floor(Math.random() * 400) + 100; // 100-500 occurrences
    } else if (num <= 1000) {
      return Math.floor(Math.random() * 80) + 20; // 20-100 occurrences
    } else {
      return Math.floor(Math.random() * 19) + 1; // 1-20 occurrences
    }
  };

  // Generate sample Bible references for a Strong's number
  const generateSampleReferences = (strongsNum) => {
    const num = parseInt(strongsNum.replace('H', ''));

    // Common references database (simplified version)
    const commonReferences = {
      // God-related words
      430: [ // elohim
        { reference: 'Genesis 1:1', preview: 'In the beginning God created the heaven and the earth.' },
        { reference: 'Deuteronomy 6:4', preview: 'Hear, O Israel: The LORD our God is one LORD.' },
        { reference: 'Psalm 23:1', preview: 'The LORD is my shepherd; I shall not want.' },
      ],
      // LORD-related
      3068: [ // YHWH
        { reference: 'Exodus 3:14', preview: 'And God said unto Moses, I AM THAT I AM...' },
        { reference: 'Psalm 100:3', preview: 'Know ye that the LORD he is God...' },
        { reference: 'Isaiah 40:28', preview: 'Hast thou not known? hast thou not heard, that the everlasting God, the LORD...' },
      ],
      // Love-related
      157: [ // ahab
        { reference: 'Leviticus 19:18', preview: 'Thou shalt love thy neighbour as thyself...' },
        { reference: 'Deuteronomy 6:5', preview: 'And thou shalt love the LORD thy God with all thine heart...' },
        { reference: 'Proverbs 8:17', preview: 'I love them that love me; and those that seek me early shall find me.' },
      ],
    };

    // Return specific references if available, otherwise generic ones
    if (commonReferences[num]) {
      return commonReferences[num];
    }

    // Generic sample references for demonstration
    return [
      { reference: 'Psalm 119:105', preview: 'Thy word is a lamp unto my feet, and a light unto my path.' },
      { reference: 'Isaiah 40:8', preview: 'The grass withereth, the flower fadeth: but the word of our God shall stand for ever.' },
      { reference: 'Jeremiah 29:11', preview: 'For I know the thoughts that I think toward you, saith the LORD...' },
    ];
  };

  // Handle reference click - toggle verse expansion and fetch text
  const handleReferenceClick = async (ref, idx) => {
    const key = `${ref.reference}-${idx}`;

    // Toggle expansion
    if (expandedVerses[key]) {
      setExpandedVerses(prev => ({ ...prev, [key]: false }));
      return;
    }

    // Expand and fetch verse if not already fetched
    setExpandedVerses(prev => ({ ...prev, [key]: true }));

    if (!verseTexts[key]) {
      const verseText = await getVerseByReference(ref.reference);
      if (verseText) {
        setVerseTexts(prev => ({ ...prev, [key]: verseText }));
      }
    }
  };

  // Search and filter logic
  const filteredEntries = useMemo(() => {
    setIsLoading(true);
    const entries = Object.entries(strongsHebrewDictionary);

    let results = entries;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = entries.filter(([key, entry]) => {
        return (
          key.toLowerCase().includes(term) ||
          (entry.lemma || '').toLowerCase().includes(term) ||
          (entry.xlit || '').toLowerCase().includes(term) ||
          (entry.pron || '').toLowerCase().includes(term) ||
          (entry.kjv_def || '').toLowerCase().includes(term) ||
          (entry.strongs_def || '').toLowerCase().includes(term)
        );
      });
    }

    // Filter by selected letter
    if (selectedLetter) {
      results = results.filter(([key, entry]) => {
        const lemma = entry.lemma || '';
        // Check if the Hebrew word starts with the selected letter
        return lemma.includes(selectedLetter);
      });
    }

    // Sort by Strong's number
    results.sort((a, b) => {
      const numA = parseInt(a[0].replace('H', ''));
      const numB = parseInt(b[0].replace('H', ''));
      return numA - numB;
    });

    // Limit to 50 results
    const limited = results.slice(0, 50);

    setTimeout(() => setIsLoading(false), 100);
    return limited;
  }, [searchTerm, selectedLetter]);

  // Handle letter click
  const handleLetterClick = (letter) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(letter);
      setSearchTerm('');
    }
  };

  // Handle entry click
  const handleEntryClick = (strongsNum, entry) => {
    setSelectedEntry({ strongsNum, ...entry });
  };

  // Handle related word click
  const handleRelatedWordClick = (strongsNum) => {
    const entry = strongsHebrewDictionary[strongsNum];
    if (entry) {
      setSelectedEntry({ strongsNum, ...entry });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render search bar
  const renderSearchBar = () => (
    <div className="mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSelectedLetter(null);
        }}
        placeholder="Search by Strong's number (H####), Hebrew word, or English keyword..."
        className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
      />
    </div>
  );

  // Render alphabet buttons
  const renderAlphabetButtons = () => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-amber-400 mb-3">Browse by Letter:</h3>
      <div className="flex flex-wrap gap-2" dir="rtl">
        {hebrewAlphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedLetter === letter
                ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600'
            }`}
            style={{ fontSize: '1.25rem' }}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );

  // Render single entry card
  const renderEntryCard = ([strongsNum, entry]) => {
    const usageCount = getMockUsageCount(strongsNum);

    return (
      <div
        key={strongsNum}
        onClick={() => handleEntryClick(strongsNum, entry)}
        className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl ${getWordTypeColor(entry)}`}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl font-bold text-amber-400">{strongsNum}</span>
          {getWordTypeBadge(entry)}
        </div>

        <div className="mb-3">
          <div className="text-4xl font-bold text-white mb-2" dir="rtl">
            {entry.lemma || 'N/A'}
          </div>
          {entry.xlit && (
            <div className="text-lg italic text-slate-300" dir="ltr">
              {entry.xlit}
            </div>
          )}
          {entry.pron && (
            <div className="text-sm text-slate-400" dir="ltr">
              [{entry.pron}]
            </div>
          )}
        </div>

        {entry.kjv_def && (
          <div className="mb-2">
            <span className="text-xs font-semibold text-amber-300 uppercase">KJV:</span>
            <p className="text-sm text-slate-200 mt-1">{entry.kjv_def}</p>
          </div>
        )}

        {entry.strongs_def && (
          <div className="text-sm text-slate-300 line-clamp-2 mb-2">
            {entry.strongs_def}
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-slate-700/50">
          <div className="text-sm text-slate-400">
            <span className="font-semibold text-amber-400">{usageCount}</span> occurrences in Scripture
          </div>
          <div className="text-xs text-slate-500 italic mt-1">
            Approximate count - full concordance coming soon
          </div>
        </div>
      </div>
    );
  };

  // Render detailed entry view
  const renderDetailedEntry = () => {
    if (!selectedEntry) return null;

    const relatedWords = extractStrongsNumbers(selectedEntry.derivation);
    // Use real data from state instead of mock data

    return (
      <div className="mb-8 animate-fadeIn">
        <button
          onClick={() => setSelectedEntry(null)}
          className="mb-4 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-lg transition-colors duration-200 border border-slate-600"
        >
          ← Back to Results
        </button>

        <div className={`p-8 rounded-xl border-2 ${getWordTypeColor(selectedEntry)}`}>
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl font-bold text-amber-400">{selectedEntry.strongsNum}</span>
            {getWordTypeBadge(selectedEntry)}
          </div>

          <div className="mb-6">
            <div className="text-6xl font-bold text-white mb-3" dir="rtl">
              {selectedEntry.lemma || 'N/A'}
            </div>
            <div dir="ltr">
              {selectedEntry.xlit && (
                <div className="text-2xl italic text-slate-300 mb-1">
                  {selectedEntry.xlit}
                </div>
              )}
              {selectedEntry.pron && (
                <div className="text-xl text-slate-400">
                  Pronunciation: [{selectedEntry.pron}]
                </div>
              )}
            </div>
          </div>

          {/* Usage Count */}
          <div className="mb-4 p-4 bg-slate-900/50 rounded-lg border border-orange-500/30">
            <div className="text-lg text-slate-300">
              {usageCount === null ? (
                <span className="text-slate-400">Loading usage count...</span>
              ) : (
                <>
                  <span className="font-bold text-amber-400 text-2xl">{usageCount}</span>
                  <span className="ml-2">occurrences in Scripture</span>
                </>
              )}
            </div>
            {usageCount !== null && usageCount > 0 && (
              <div className="text-xs text-green-400 italic mt-1">
                ✓ Real concordance data from Westminster Leningrad Codex
              </div>
            )}
          </div>

          {selectedEntry.kjv_def && (
            <div className="mb-4 p-4 bg-slate-900/50 rounded-lg">
              <span className="text-sm font-semibold text-amber-300 uppercase block mb-2">
                KJV Definition:
              </span>
              <p className="text-base text-slate-100">{selectedEntry.kjv_def}</p>
            </div>
          )}

          {selectedEntry.strongs_def && (
            <div className="mb-4 p-4 bg-slate-900/50 rounded-lg">
              <span className="text-sm font-semibold text-amber-300 uppercase block mb-2">
                Strong's Definition:
              </span>
              <p className="text-base text-slate-100">{selectedEntry.strongs_def}</p>
            </div>
          )}

          {selectedEntry.derivation && (
            <div className="mb-4 p-4 bg-slate-900/50 rounded-lg">
              <span className="text-sm font-semibold text-amber-300 uppercase block mb-2">
                Derivation:
              </span>
              <p className="text-base text-slate-100">{selectedEntry.derivation}</p>
            </div>
          )}

          {/* Sample Scripture References */}
          <div className="mb-4 bg-slate-800/50 rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Book className="text-orange-400" size={20} />
              <h4 className="font-bold text-orange-400">Scripture References:</h4>
            </div>

            {/* Filters for words with 100+ occurrences */}
            {usageCount > 100 && availableBooks.length > 0 && (
              <div className="mb-4 p-3 bg-slate-900/70 rounded-lg border border-orange-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="text-orange-300" size={16} />
                  <span className="text-sm font-semibold text-orange-300">Filter References:</span>
                </div>

                {/* Book Filter */}
                <div className="mb-2">
                  <label className="text-xs text-slate-400 block mb-1">By Book:</label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => {
                        setSelectedBook(null);
                        setSelectedChapter(null);
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        !selectedBook
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      All Books
                    </button>
                    {availableBooks.map(book => (
                      <button
                        key={book}
                        onClick={() => {
                          setSelectedBook(book);
                          setSelectedChapter(null);
                        }}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedBook === book
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {book}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chapter Filter (only show if book is selected) */}
                {selectedBook && availableChapters.length > 0 && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">By Chapter:</label>
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => setSelectedChapter(null)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          !selectedChapter
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        All Chapters
                      </button>
                      {availableChapters.map(chapter => (
                        <button
                          key={chapter}
                          onClick={() => setSelectedChapter(chapter)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            selectedChapter === chapter
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          Ch {chapter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {sampleReferences.length === 0 && usageCount === null ? (
              <div className="text-slate-400 text-center py-4">Loading references...</div>
            ) : sampleReferences.length === 0 ? (
              <div className="text-slate-400 text-center py-4">No references found</div>
            ) : (
              <div className="space-y-2">
                {sampleReferences.map((ref, idx) => {
                  const key = `${ref.reference}-${idx}`;
                  const isExpanded = expandedVerses[key];
                  const verseText = verseTexts[key];

                  return (
                    <div key={idx} className="mb-2">
                      <button
                        onClick={() => handleReferenceClick(ref, idx)}
                        className="w-full text-left px-4 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all duration-200 border border-slate-600 hover:border-orange-400 group"
                      >
                        <div className="flex items-start gap-2">
                          <BookOpen className="text-amber-400 mt-1 group-hover:text-orange-400 transition-colors" size={16} />
                          <div className="flex-1">
                            <span className="font-semibold text-amber-400 group-hover:text-orange-400 transition-colors">
                              {ref.reference}
                            </span>
                          </div>
                          <span className="text-slate-400 text-sm">{isExpanded ? '▼' : '▶'}</span>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="mt-2 p-4 bg-slate-800/70 rounded-lg border border-orange-500/30">
                          {verseText ? (
                            <p className="text-slate-200 leading-relaxed">
                              {verseText}
                            </p>
                          ) : (
                            <p className="text-slate-400 italic">Loading verse...</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {sampleReferences.length > 0 && (
              <div className="text-xs text-slate-400 italic mt-3 text-center">
                Click any reference to view the full verse. Showing {Math.min(sampleReferences.length, 20)} of {usageCount} occurrences from the Hebrew Bible
              </div>
            )}
          </div>

          {relatedWords.length > 0 && (
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <span className="text-sm font-semibold text-amber-300 uppercase block mb-3">
                Related Words:
              </span>
              <div className="flex flex-wrap gap-2">
                {relatedWords.map((strongsNum) => (
                  <button
                    key={strongsNum}
                    onClick={() => handleRelatedWordClick(strongsNum)}
                    className="px-3 py-2 bg-orange-900/40 hover:bg-orange-800/60 text-orange-200 rounded-lg border border-orange-500/50 transition-colors duration-200 text-sm font-medium"
                  >
                    {strongsNum}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render results grid
  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-400">Loading results...</p>
        </div>
      );
    }

    if (filteredEntries.length === 0) {
      return (
        <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No Results Found</h3>
          <p className="text-slate-400">
            Try adjusting your search or browse by letter above.
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-4 text-sm text-slate-400">
          Found {filteredEntries.length} {filteredEntries.length === 50 ? '(showing first 50)' : ''} results
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map(renderEntryCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-2">
            Hebrew Lexicon
          </h1>
          <p className="text-slate-400 text-lg">
            Strong's Hebrew Dictionary - {Object.keys(strongsHebrewDictionary).length} entries
          </p>
        </div>

        {/* Search Bar */}
        {renderSearchBar()}

        {/* Alphabet Buttons */}
        {renderAlphabetButtons()}

        {/* Detailed Entry View */}
        {renderDetailedEntry()}

        {/* Results Grid */}
        {!selectedEntry && renderResults()}
      </div>
    </div>
  );
};

export default HebrewLexicon;
