import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';
import { getLxxVerseByReference } from '../services/assistant/retrieval/lxxProvider';

const UnlockableLXX = ({ onBack }) => {
  const [reference, setReference] = useState('');
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!reference.trim()) {
      setError('Please enter a Bible reference');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await getLxxVerseByReference(reference);

      if (result) {
        setVerseData(result);
        setError('');
      } else {
        setError('Verse not found in LXX. The Septuagint only contains Old Testament books.');
        setVerseData(null);
      }
    } catch (err) {
      setError('Error loading verse. Please check your reference format.');
      setVerseData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">📜</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Septuagint (LXX)
              </h1>
              <p className="text-slate-400 mt-2">Greek Old Testament Translation</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-emerald-500/20 mb-6">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">About the Septuagint</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              The Septuagint (from the Latin <em>septuaginta</em>, "seventy") is a Greek translation of the Hebrew Bible
              (Old Testament) that was made in the 3rd-2nd centuries BC in Alexandria, Egypt.
            </p>
            <p>
              According to tradition, seventy (or seventy-two) Jewish scholars produced this translation,
              which became widely used by Greek-speaking Jews and early Christians.
            </p>
            <p>
              The New Testament authors frequently quoted from the Septuagint, making it invaluable for
              understanding the biblical text and early Christian theology.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-emerald-500/20 mb-6">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <Search size={24} />
            Search LXX Verses
          </h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter reference (e.g., Genesis 1:1, Psalm 23:1)"
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {verseData && (
            <div className="bg-slate-700/50 rounded-lg p-6 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-emerald-400" size={24} />
                <h3 className="text-xl font-bold text-emerald-400">{verseData.reference}</h3>
              </div>
              <div
                className="text-2xl leading-relaxed text-white font-serif mb-4"
                style={{ direction: 'ltr' }}
              >
                {verseData.text}
              </div>
              <div className="text-sm text-slate-400 border-t border-slate-600 pt-3">
                Translation: {verseData.translation} | Language: Greek ({verseData.language})
              </div>
            </div>
          )}
        </div>

        {/* Usage Guide */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-emerald-500/20">
          <h2 className="text-xl font-bold text-emerald-400 mb-3">How to Use</h2>
          <ul className="text-slate-300 space-y-2 list-disc list-inside">
            <li>Enter a Bible reference in the search box (Old Testament only)</li>
            <li>Examples: "Genesis 1:1", "Psalm 23:1", "Isaiah 53:5"</li>
            <li>The Greek text will be displayed with modern Unicode characters</li>
            <li>Compare with other translations to see differences in wording</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnlockableLXX;
