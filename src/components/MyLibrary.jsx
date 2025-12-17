import React, { useState } from 'react';
import { Book, Lock, ChevronRight, BookOpen, Star, Globe } from 'lucide-react';
import PDFBookReader from './PDFBookReader';

const MyLibrary = ({ userData, onPurchaseBook, playChaChing, showToast }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  const libraryBooks = [
    {
      id: 'bookOfEnoch',
      title: 'Book of Enoch',
      subtitle: '1 Enoch',
      description: 'Ancient Jewish apocalyptic text attributed to Enoch, great-grandfather of Noah. Contains visions, angelology, and prophecies.',
      pdfPath: `${process.env.PUBLIC_URL}/Book of Enoch.pdf`,
      cost: 1000,
      category: 'Apocrypha',
      icon: '📜',
      color: 'from-purple-600/20 to-indigo-600/20',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-400'
    },
    {
      id: 'bookOfJubilees',
      title: 'Book of Jubilees',
      subtitle: 'Lesser Genesis',
      description: 'Ancient Jewish text recounting Genesis and Exodus with emphasis on law, calendar, and angels. Divided into jubilee periods.',
      pdfPath: `${process.env.PUBLIC_URL}/Book of Jubilees.pdf`,
      cost: 1000,
      category: 'Apocrypha',
      icon: '📖',
      color: 'from-emerald-600/20 to-teal-600/20',
      borderColor: 'border-emerald-500',
      textColor: 'text-emerald-400'
    }
  ];

  const handleBookClick = (book) => {
    const isUnlocked = userData.unlockables?.[book.id];

    if (isUnlocked) {
      setSelectedBook(book);
    } else {
      if (userData.totalPoints >= book.cost) {
        const confirmPurchase = window.confirm(
          `Unlock ${book.title} for ${book.cost} points?\n\n${book.description}`
        );

        if (confirmPurchase) {
          onPurchaseBook(book.id, book.cost, book.title);
        }
      } else {
        showToast(
          `You need ${book.cost - userData.totalPoints} more points to unlock ${book.title}`,
          'error'
        );
      }
    }
  };

  if (selectedBook) {
    return (
      <PDFBookReader
        bookTitle={selectedBook.title}
        pdfPath={selectedBook.pdfPath}
        onClose={() => setSelectedBook(null)}
      />
    );
  }

  const unlockedBooks = libraryBooks.filter(book => userData.unlockables?.[book.id]);
  const lockedBooks = libraryBooks.filter(book => !userData.unlockables?.[book.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={32} className="text-emerald-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-200">My Library</h1>
          </div>
          <p className="text-slate-400 ml-11">
            Unlock and read ancient biblical texts and apocryphal books
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm">Books Unlocked</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {unlockedBooks.length} / {libraryBooks.length}
                </div>
              </div>
              <BookOpen size={32} className="text-emerald-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm">Your Points</div>
                <div className="text-2xl font-bold text-amber-400">
                  {userData.totalPoints || 0}
                </div>
              </div>
              <Star size={32} className="text-amber-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm">Categories</div>
                <div className="text-2xl font-bold text-purple-400">
                  {new Set(libraryBooks.map(b => b.category)).size}
                </div>
              </div>
              <Globe size={32} className="text-purple-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Unlocked Books Section */}
        {unlockedBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center gap-2">
              <BookOpen size={24} className="text-emerald-400" />
              Your Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className={`bg-gradient-to-r ${book.color} border-2 ${book.borderColor} rounded-lg p-6 text-left hover:scale-105 transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{book.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-200 mb-1">
                        {book.title}
                      </h3>
                      <div className={`text-sm ${book.textColor} mb-2`}>
                        {book.subtitle}
                      </div>
                      <p className="text-slate-400 text-sm mb-3">
                        {book.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                          <Book size={16} /> Unlocked
                        </span>
                        <ChevronRight size={20} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Locked Books Section */}
        {lockedBooks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Lock size={24} className="text-amber-400" />
              Available to Unlock
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedBooks.map((book) => {
                const canAfford = userData.totalPoints >= book.cost;
                return (
                  <button
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className={`bg-gradient-to-r ${book.color} border-2 ${book.borderColor} rounded-lg p-6 text-left hover:scale-105 transition-all relative overflow-hidden ${
                      !canAfford ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl opacity-50">{book.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-200 mb-1">
                          {book.title}
                        </h3>
                        <div className={`text-sm ${book.textColor} mb-2`}>
                          {book.subtitle}
                        </div>
                        <p className="text-slate-400 text-sm mb-3">
                          {book.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold flex items-center gap-1 ${
                            canAfford ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            <Lock size={16} /> {book.cost} points
                          </span>
                          {canAfford ? (
                            <span className="text-emerald-400 text-sm">Click to unlock</span>
                          ) : (
                            <span className="text-red-400 text-sm">
                              Need {book.cost - userData.totalPoints} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Lock overlay */}
                    <div className="absolute top-4 right-4">
                      <Lock size={24} className="text-slate-400 opacity-30" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {libraryBooks.length === 0 && (
          <div className="text-center py-16">
            <Book size={64} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">No Books Available</h3>
            <p className="text-slate-500">Check back later for new additions to the library</p>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <BookOpen size={24} className="text-blue-400 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">About the Library</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The library contains ancient texts and apocryphal books that provide additional
                context to biblical history. These books, while not part of the traditional biblical
                canon, offer valuable insights into Jewish thought, angelology, and historical traditions.
                Unlock books with points earned through studying and completing challenges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLibrary;
