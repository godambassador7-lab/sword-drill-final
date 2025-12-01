import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Trash2, Sparkles, Filter } from 'lucide-react';

const PersonalVerseBank = ({ onBack, userData, onUpdateUserData, onStartPersonalQuiz }) => {
  const [filterBook, setFilterBook] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, book, reference

  const personalVerses = userData?.personalMemoryVerses || [];

  // Get unique books from personal verses
  const uniqueBooks = [...new Set(personalVerses.map(v => v.book))].sort();

  // Filter and sort verses
  const filteredVerses = personalVerses
    .filter(verse => !filterBook || verse.book === filterBook)
    .sort((a, b) => {
      if (sortBy === 'dateAdded') {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      } else if (sortBy === 'book') {
        return a.book.localeCompare(b.book) || a.chapter - b.chapter || a.verse - b.verse;
      } else if (sortBy === 'reference') {
        return a.book.localeCompare(b.book) || a.chapter - b.chapter || a.verse - b.verse;
      }
      return 0;
    });

  const removeVerse = (verse) => {
    const confirmed = window.confirm(
      `Remove ${verse.reference} from your Personal Verse Bank?`
    );

    if (confirmed) {
      const updatedVerses = personalVerses.filter(v =>
        !(v.book === verse.book &&
          v.chapter === verse.chapter &&
          v.verse === verse.verse &&
          v.translation === verse.translation)
      );

      onUpdateUserData({
        ...userData,
        personalMemoryVerses: updatedVerses
      });
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="text-cyan-400" size={32} />
              Personal Verse Bank
            </h1>
            <p className="text-slate-400 mt-1">
              Your collection of {personalVerses.length} personal memory verses
            </p>
          </div>
        </div>

        {/* Quiz Button */}
        {personalVerses.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="text-cyan-400" size={20} />
                  Quiz Your Personal Verses
                </h3>
                <p className="text-slate-300 text-sm mt-1">
                  Practice with your personal memory verses in any verse-based quiz
                </p>
              </div>
              <button
                onClick={onStartPersonalQuiz}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-bold transition-all shadow-lg hover:shadow-cyan-500/50"
              >
                Start Personal Quiz
              </button>
            </div>
          </div>
        )}

        {/* Filters and Sorting */}
        {personalVerses.length > 0 && (
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-400" />
                <span className="text-slate-300 text-sm font-semibold">Filter:</span>
                <select
                  value={filterBook}
                  onChange={(e) => setFilterBook(e.target.value)}
                  className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">All Books ({personalVerses.length})</option>
                  {uniqueBooks.map(book => (
                    <option key={book} value={book}>
                      {book} ({personalVerses.filter(v => v.book === book).length})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-300 text-sm font-semibold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none"
                >
                  <option value="dateAdded">Date Added (Newest First)</option>
                  <option value="book">Book & Reference</option>
                </select>
              </div>

              <div className="ml-auto text-slate-400 text-sm">
                Showing {filteredVerses.length} of {personalVerses.length} verses
              </div>
            </div>
          </div>
        )}

        {/* Verse List */}
        {filteredVerses.length > 0 ? (
          <div className="space-y-4">
            {filteredVerses.map((verse, index) => (
              <div
                key={index}
                className="group bg-slate-800/50 border border-slate-600 hover:border-cyan-500/50 rounded-lg p-4 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    {/* Reference */}
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen size={18} className="text-cyan-400" />
                      <span className="text-cyan-400 font-bold text-lg">
                        {verse.reference}
                      </span>
                      <span className="text-slate-500 text-sm">
                        ({verse.translation})
                      </span>
                      <span className="ml-auto text-slate-500 text-xs">
                        Added {formatDate(verse.dateAdded)}
                      </span>
                    </div>

                    {/* Verse Text */}
                    <p className="text-slate-200 leading-relaxed pl-7">
                      {verse.text}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeVerse(verse)}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                    title="Remove from Personal Verse Bank"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : personalVerses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">
              No Personal Memory Verses Yet
            </h3>
            <p className="text-slate-500 mb-6">
              Visit the Bible Reader and click the bookmark icon on any verse to add it to your Personal Verse Bank
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-bold transition-all"
            >
              Go to Bible Reader
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter size={64} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">
              No verses match your filter
            </h3>
            <button
              onClick={() => setFilterBook('')}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-bold transition-all"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalVerseBank;
