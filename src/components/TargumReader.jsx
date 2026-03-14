import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft, Lock } from 'lucide-react';

const TargumReader = ({ onBack, userData, targumType = 'jonathan' }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterContent, setChapterContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Targum Jonathan covers the Prophets (Nevi'im)
  const jonathanBooks = [
    // Former Prophets
    { name: 'Joshua', abbr: 'Josh', chapters: 24, category: 'Former Prophets' },
    { name: 'Judges', abbr: 'Judg', chapters: 21, category: 'Former Prophets' },
    { name: '1 Samuel', abbr: '1Sam', chapters: 31, category: 'Former Prophets' },
    { name: '2 Samuel', abbr: '2Sam', chapters: 24, category: 'Former Prophets' },
    { name: '1 Kings', abbr: '1Kgs', chapters: 22, category: 'Former Prophets' },
    { name: '2 Kings', abbr: '2Kgs', chapters: 25, category: 'Former Prophets' },
    // Latter Prophets
    { name: 'Isaiah', abbr: 'Isa', chapters: 66, category: 'Latter Prophets' },
    { name: 'Jeremiah', abbr: 'Jer', chapters: 52, category: 'Latter Prophets' },
    { name: 'Ezekiel', abbr: 'Ezek', chapters: 48, category: 'Latter Prophets' },
    // Minor Prophets (The Twelve)
    { name: 'Hosea', abbr: 'Hos', chapters: 14, category: 'Minor Prophets' },
    { name: 'Joel', abbr: 'Joel', chapters: 3, category: 'Minor Prophets' },
    { name: 'Amos', abbr: 'Amos', chapters: 9, category: 'Minor Prophets' },
    { name: 'Obadiah', abbr: 'Obad', chapters: 1, category: 'Minor Prophets' },
    { name: 'Jonah', abbr: 'Jonah', chapters: 4, category: 'Minor Prophets' },
    { name: 'Micah', abbr: 'Mic', chapters: 7, category: 'Minor Prophets' },
    { name: 'Nahum', abbr: 'Nah', chapters: 3, category: 'Minor Prophets' },
    { name: 'Habakkuk', abbr: 'Hab', chapters: 3, category: 'Minor Prophets' },
    { name: 'Zephaniah', abbr: 'Zeph', chapters: 3, category: 'Minor Prophets' },
    { name: 'Haggai', abbr: 'Hag', chapters: 2, category: 'Minor Prophets' },
    { name: 'Zechariah', abbr: 'Zech', chapters: 14, category: 'Minor Prophets' },
    { name: 'Malachi', abbr: 'Mal', chapters: 4, category: 'Minor Prophets' },
  ];

  // Targum Onkelos covers the Torah (Pentateuch)
  const onkelosBooks = [
    { name: 'Genesis', abbr: 'Gen', chapters: 50, category: 'Torah' },
    { name: 'Exodus', abbr: 'Exod', chapters: 40, category: 'Torah' },
    { name: 'Leviticus', abbr: 'Lev', chapters: 27, category: 'Torah' },
    { name: 'Numbers', abbr: 'Num', chapters: 36, category: 'Torah' },
    { name: 'Deuteronomy', abbr: 'Deut', chapters: 34, category: 'Torah' },
  ];

  const bibleBooks = targumType === 'jonathan' ? jonathanBooks : onkelosBooks;
  const targumName = targumType === 'jonathan' ? 'Targum Jonathan' : 'Targum Onkelos';
  const targumDescription = targumType === 'jonathan'
    ? 'Aramaic Translation of the Prophets (Nevi\'im)'
    : 'Aramaic Translation of the Torah';
  const pdfPath = targumType === 'jonathan'
    ? 'The-Targum-of-Jonathan-Ben-Uzziel.pdf'
    : 'targumjonathant00churgoog.pdf';
  const pdfNote = targumType === 'jonathan'
    ? 'Scholarly PDF edition of Targum Jonathan.'
    : 'Legacy Targum scan currently used as an interim source while dedicated Onkelos chapter JSON is being prepared.';

  // Check if user has unlocked this Targum
  const isUnlocked = targumType === 'jonathan'
    ? userData?.unlockables?.targumJonathan
    : userData?.unlockables?.targumOnkelos;

  // Group books by category
  const groupedBooks = bibleBooks.reduce((acc, book) => {
    if (!acc[book.category]) {
      acc[book.category] = [];
    }
    acc[book.category].push(book);
    return acc;
  }, {});

  const loadChapter = async (book, chapter) => {
    setLoading(true);
    setError(null);
    try {
      // For now, we'll show a message that the Aramaic text is available in PDF format
      // In the future, if you have JSON data for Targum chapters, you can load them here
      const url = `${process.env.PUBLIC_URL}/targum/${targumType}/${book.name}.json`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        const chapterData = data.chapters[chapter.toString()];

        if (chapterData) {
          const verses = Object.entries(chapterData).map(([verseNum, text]) => ({
            verse: parseInt(verseNum),
            text: text
          }));
          setChapterContent(verses);
        } else {
          throw new Error('Chapter data not available');
        }
      } else {
        // If JSON not available, show PDF access message
        throw new Error('Chapter content not yet digitized');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading Targum chapter:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBook && selectedChapter) {
      loadChapter(selectedBook, selectedChapter);
    }
  }, [selectedBook, selectedChapter]);

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < selectedBook.chapters) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 text-white p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="bg-slate-800 rounded-xl p-8 border-2 border-cyan-500 text-center">
            <Lock size={64} className="mx-auto mb-4 text-cyan-400" />
            <h2 className="text-3xl font-bold mb-4">{targumName}</h2>
            <p className="text-xl text-gray-300 mb-6">{targumDescription}</p>
            <p className="text-gray-400 mb-4">
              This ancient Aramaic translation is available for 6000 points in the Store.
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              Go to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Book selection view
  if (!selectedBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 text-white p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="bg-slate-800 rounded-xl p-6 sm:p-8 border-2 border-cyan-500 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center gap-3">
              <BookOpen className="text-cyan-400" size={40} />
              {targumName}
            </h1>
            <p className="text-xl text-gray-300 mb-4">{targumDescription}</p>
            <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-600/30">
              <p className="text-sm text-cyan-200">
                <strong>About Targums:</strong> Aramaic translations and paraphrases of the Hebrew Bible
                created during the Second Temple period. These texts provide valuable insights into
                ancient Jewish interpretation and understanding of Scripture.
              </p>
            </div>
          </div>

          {/* PDF Access */}
          <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border-2 border-amber-600/50 mb-8">
            <h3 className="text-xl font-bold text-amber-300 mb-3">📜 Original PDF Document</h3>
            <p className="text-amber-200 mb-4">
              Access the complete scholarly edition of the {targumName}
            </p>
            <a
              href={`${process.env.PUBLIC_URL}/${pdfPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Open Full PDF Document
            </a>
            <p className="mt-3 text-xs text-amber-100">{pdfNote}</p>
          </div>

          {/* Book Grid */}
          {Object.entries(groupedBooks).map(([category, books]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">{category}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {books.map((book) => (
                  <button
                    key={book.name}
                    onClick={() => {
                      setSelectedBook(book);
                      setSelectedChapter(1);
                    }}
                    className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 hover:from-cyan-800/50 hover:to-teal-800/50 rounded-lg p-4 border-2 border-cyan-600/30 hover:border-cyan-400 transition-all text-center group"
                  >
                    <div className="font-bold text-lg text-cyan-300 group-hover:text-cyan-100 transition-colors">
                      {book.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {book.chapters} chapters
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600 text-center">
            <p className="text-gray-400 text-sm">
              💡 <strong>Note:</strong> Digital chapter-by-chapter content is being prepared.
              For now, access the complete text via the PDF link above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chapter reading view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedBook(null)}
          className="mb-6 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Books
        </button>

        <div className="bg-slate-800 rounded-xl p-6 sm:p-8 border-2 border-cyan-500">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-cyan-300">
                {selectedBook.name} {selectedChapter}
              </h1>
              <div className="text-sm text-gray-400">
                {targumName}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-600">
            <button
              onClick={handlePrevChapter}
              disabled={selectedChapter === 1}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <div className="flex-1 text-center">
              <span className="text-cyan-300 font-semibold">
                Chapter {selectedChapter} of {selectedBook.chapters}
              </span>
            </div>

            <button
              onClick={handleNextChapter}
              disabled={selectedChapter === selectedBook.chapters}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Content */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading chapter...</p>
            </div>
          )}

          {error && (
            <div className="bg-amber-900/30 border-2 border-amber-600/50 rounded-lg p-6 text-center">
              <p className="text-amber-200 mb-4">
                Chapter content is not yet available in digital format.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Please access the complete text via the PDF document:
              </p>
              <a
                href={`${process.env.PUBLIC_URL}/${pdfPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-2 px-6 rounded-lg transition-all"
              >
                Open PDF - {selectedBook.name} Chapter {selectedChapter}
              </a>
              <p className="mt-3 text-xs text-amber-100">{pdfNote}</p>
            </div>
          )}

          {!loading && !error && chapterContent.length > 0 && (
            <div className="space-y-4">
              {chapterContent.map((verse) => (
                <div key={verse.verse} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 text-cyan-400 font-semibold text-right">
                    {verse.verse}
                  </div>
                  <div className="flex-1 text-gray-200 leading-relaxed">
                    {verse.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargumReader;
