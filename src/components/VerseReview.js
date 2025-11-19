import React, { useState, useMemo } from 'react';
import { BookOpen, Search, ChevronDown, ChevronRight } from 'lucide-react';
import EnhancedReviewModal from './EnhancedReviewModal';

/**
 * Verse Review Component
 * Allows users to practice missed verses with unlimited resets and no cost
 * Organized by book and category
 */
const VerseReview = ({ missedVerses = [], onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [expandedBooks, setExpandedBooks] = useState(new Set());
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'book', 'difficulty'

  // Group verses by book
  const versesByBook = useMemo(() => {
    const grouped = {};
    missedVerses.forEach(verse => {
      const book = verse.reference.split(' ')[0];
      if (!grouped[book]) {
        grouped[book] = [];
      }
      grouped[book].push(verse);
    });
    return grouped;
  }, [missedVerses]);

  // Filter verses based on search term
  const filteredBooks = useMemo(() => {
    if (!searchTerm) return versesByBook;

    const filtered = {};
    Object.entries(versesByBook).forEach(([book, verses]) => {
      const matchingVerses = verses.filter(v =>
        v.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.topic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingVerses.length > 0) {
        filtered[book] = matchingVerses;
      }
    });
    return filtered;
  }, [versesByBook, searchTerm]);

  // Toggle book expansion
  const toggleBook = (book) => {
    const newExpanded = new Set(expandedBooks);
    if (newExpanded.has(book)) {
      newExpanded.delete(book);
    } else {
      newExpanded.add(book);
    }
    setExpandedBooks(newExpanded);
  };

  // Start review for a verse
  const startReview = (verse) => {
    setSelectedVerse(verse);
  };

  // Complete review (no points in free mode)
  const handleComplete = () => {
    setSelectedVerse(null);
  };

  // Skip review
  const handleSkip = () => {
    setSelectedVerse(null);
  };

  if (selectedVerse) {
    return (
      <EnhancedReviewModal
        verse={selectedVerse.text}
        reference={selectedVerse.reference}
        onComplete={handleComplete}
        onSkip={handleSkip}
        userPoints={0}
        isCommonVerse={false}
        isPaidMode={false} // Free mode - unlimited resets and drops
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="text-amber-400" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-amber-400">Verse Review</h1>
            <p className="text-slate-400 text-sm">Practice missed verses with no cost</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-all"
        >
          Back to Home
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 mb-6">
        <h3 className="text-blue-300 font-semibold mb-2">Free Practice Mode</h3>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Unlimited resets and word drops</li>
          <li>• No point costs or penalties</li>
          <li>• Practice as many times as you need</li>
          <li>• All 3 hints are always free</li>
        </ul>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by reference, text, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-600/40 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 bg-slate-900/60 border border-slate-600/40 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">All Verses</option>
            <option value="recent">Recently Missed</option>
            <option value="difficult">Most Difficult</option>
          </select>
        </div>

        <div className="text-sm text-slate-400">
          {missedVerses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto mb-3 text-slate-600" size={48} />
              <p className="text-lg text-slate-500">No missed verses yet!</p>
              <p className="text-sm text-slate-600 mt-1">Keep practicing and verses you miss will appear here.</p>
            </div>
          ) : (
            `${missedVerses.length} missed verse${missedVerses.length !== 1 ? 's' : ''} available for review`
          )}
        </div>
      </div>

      {/* Verse List by Book */}
      {missedVerses.length > 0 && (
        <div className="space-y-3">
          {Object.entries(filteredBooks).sort(([a], [b]) => a.localeCompare(b)).map(([book, verses]) => (
            <div key={book} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/30">
              {/* Book Header */}
              <button
                onClick={() => toggleBook(book)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedBooks.has(book) ? (
                    <ChevronDown className="text-amber-400" size={20} />
                  ) : (
                    <ChevronRight className="text-amber-400" size={20} />
                  )}
                  <span className="text-lg font-bold text-amber-400">{book}</span>
                  <span className="text-sm text-slate-400">({verses.length} verse{verses.length !== 1 ? 's' : ''})</span>
                </div>
              </button>

              {/* Verse List */}
              {expandedBooks.has(book) && (
                <div className="p-4 pt-0 space-y-2">
                  {verses.map((verse, idx) => (
                    <div
                      key={`${verse.reference}-${idx}`}
                      className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 hover:border-amber-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-amber-400 font-semibold">{verse.reference}</span>
                            {verse.topic && (
                              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                {verse.topic}
                              </span>
                            )}
                            {verse.difficulty && (
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                verse.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                                verse.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {verse.difficulty}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm italic">"{verse.text}"</p>
                          {verse.missedCount && (
                            <p className="text-xs text-slate-500 mt-2">
                              Missed {verse.missedCount} time{verse.missedCount !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => startReview(verse)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 whitespace-nowrap"
                        >
                          Practice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {missedVerses.length > 0 && Object.keys(filteredBooks).length === 0 && (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl">
          <Search className="mx-auto mb-3 text-slate-600" size={48} />
          <p className="text-lg text-slate-400">No verses match your search</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default VerseReview;
