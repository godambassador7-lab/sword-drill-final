import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, BookOpen, Menu as MenuIcon, X } from 'lucide-react';

const PDFBookReader = ({ bookTitle, pdfPath, onClose, tableOfContents = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showTOC, setShowTOC] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [scale, setScale] = useState(1.0);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(`bookmarks_${bookTitle}`);
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    // Load last read page
    const lastPage = localStorage.getItem(`lastPage_${bookTitle}`);
    if (lastPage) {
      setCurrentPage(parseInt(lastPage));
    }
  }, [bookTitle]);

  // Save current page to localStorage
  useEffect(() => {
    localStorage.setItem(`lastPage_${bookTitle}`, currentPage.toString());
  }, [currentPage, bookTitle]);

  const toggleBookmark = () => {
    const newBookmarks = bookmarks.includes(currentPage)
      ? bookmarks.filter(p => p !== currentPage)
      : [...bookmarks, currentPage].sort((a, b) => a - b);

    setBookmarks(newBookmarks);
    localStorage.setItem(`bookmarks_${bookTitle}`, JSON.stringify(newBookmarks));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setShowTOC(false);
  };

  // Default table of contents based on book
  const getDefaultTOC = () => {
    if (bookTitle === 'Book of Enoch') {
      return [
        { title: 'Introduction', page: 1 },
        { title: 'Book I: The Watchers', page: 5 },
        { title: 'Book II: The Parables', page: 25 },
        { title: 'Book III: The Astronomical Book', page: 45 },
        { title: 'Book IV: The Dream Visions', page: 65 },
        { title: 'Book V: The Epistle of Enoch', page: 80 }
      ];
    } else if (bookTitle === 'Book of Jubilees') {
      return [
        { title: 'Introduction', page: 1 },
        { title: 'Chapter 1-10: Creation to Noah', page: 5 },
        { title: 'Chapter 11-23: Abraham', page: 20 },
        { title: 'Chapter 24-45: Isaac and Jacob', page: 40 },
        { title: 'Chapter 46-50: Joseph and Moses', page: 65 }
      ];
    }
    return tableOfContents;
  };

  const toc = getDefaultTOC();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-200" />
        </button>

        <h1 className="text-lg md:text-xl font-bold text-slate-200 truncate max-w-xs md:max-w-md">
          {bookTitle}
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTOC(!showTOC)}
            className={`p-2 rounded-lg transition-colors ${
              showTOC ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-200'
            }`}
          >
            <MenuIcon size={20} />
          </button>
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              bookmarks.includes(currentPage)
                ? 'bg-amber-600 text-white'
                : 'hover:bg-slate-700 text-slate-200'
            }`}
          >
            <BookOpen size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showTOC && (
          <div className="w-64 md:w-80 bg-slate-800/50 border-r border-slate-700 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-bold text-emerald-400 mb-4">Table of Contents</h2>
              <div className="space-y-2">
                {toc.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToPage(item.page)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-200 text-sm"
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-1">Page {item.page}</div>
                  </button>
                ))}
              </div>

              {bookmarks.length > 0 && (
                <>
                  <h2 className="text-lg font-bold text-amber-400 mt-6 mb-4">Bookmarks</h2>
                  <div className="space-y-2">
                    {bookmarks.map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-200 text-sm flex justify-between items-center"
                      >
                        <span>Page {page}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newBookmarks = bookmarks.filter(p => p !== page);
                            setBookmarks(newBookmarks);
                            localStorage.setItem(`bookmarks_${bookTitle}`, JSON.stringify(newBookmarks));
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 flex flex-col bg-slate-900">
          <div className="flex-1 overflow-auto p-2 md:p-4">
            <div className="max-w-full h-full flex items-center justify-center">
              <iframe
                src={`${pdfPath}#page=${currentPage}&zoom=${scale * 100}`}
                className="w-full h-full border-2 border-slate-700 rounded-lg bg-white"
                title={bookTitle}
                style={{ minHeight: '70vh' }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} className="text-slate-200" />
                </button>

                <div className="flex items-center gap-2 px-3">
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value) || 1;
                      setCurrentPage(Math.max(1, page));
                    }}
                    className="w-16 bg-slate-700 text-slate-200 px-2 py-1 rounded text-center"
                    min="1"
                  />
                  <span className="text-slate-400 text-sm">/ Page</span>
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <ChevronRight size={20} className="text-slate-200" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                  className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm"
                >
                  -
                </button>
                <span className="text-slate-400 text-sm w-12 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={() => setScale(Math.min(2.0, scale + 0.1))}
                  className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFBookReader;
