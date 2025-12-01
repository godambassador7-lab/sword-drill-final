import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';
import { getSinaiticusVerseByReference } from '../services/assistant/retrieval/sinaiticusProvider';

const UnlockableSinaiticus = ({ onBack }) => {
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
      const result = await getSinaiticusVerseByReference(reference);

      if (result) {
        setVerseData(result);
        setError('');
      } else {
        setError('Verse not found in Codex Sinaiticus. Please verify the reference.');
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
            className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">📖</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Codex Sinaiticus
              </h1>
              <p className="text-slate-400 mt-2">Ancient Greek Bible Manuscript</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-violet-500/20 mb-6">
          <h2 className="text-2xl font-bold text-violet-400 mb-4">About Codex Sinaiticus</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              Codex Sinaiticus is one of the most important manuscripts of the Greek Bible, dating from the 4th century AD.
              It is one of the oldest complete manuscripts of the Christian Bible.
            </p>
            <p>
              Discovered at the Monastery of St. Catherine on Mount Sinai by Constantin von Tischendorf in the mid-19th century,
              this codex contains the oldest complete copy of the New Testament and significant portions of the Old Testament.
            </p>
            <p>
              Written in Greek uncial script (all capital letters with no spaces between words), it provides invaluable
              insight into the biblical text and early Christian scripture transmission.
            </p>
            <p>
              The manuscript is now divided between the British Library, Leipzig University Library, St. Catherine's Monastery,
              and the National Library of Russia.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-violet-500/20 mb-6">
          <h2 className="text-2xl font-bold text-violet-400 mb-4 flex items-center gap-2">
            <Search size={24} />
            Search Codex Sinaiticus
          </h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter reference (e.g., John 3:16, Romans 8:28)"
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
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
            <div className="bg-slate-700/50 rounded-lg p-6 border border-violet-500/30">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-violet-400" size={24} />
                <h3 className="text-xl font-bold text-violet-400">{verseData.reference}</h3>
              </div>
              <div
                className="text-2xl leading-relaxed text-white font-serif mb-4"
                style={{ direction: 'ltr' }}
              >
                {verseData.text}
              </div>
              <div className="text-sm text-slate-400 border-t border-slate-600 pt-3">
                Manuscript: {verseData.translation} | Language: Greek ({verseData.language}) | Date: 4th century AD
              </div>
            </div>
          )}
        </div>

        {/* Usage Guide */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-violet-500/20">
          <h2 className="text-xl font-bold text-violet-400 mb-3">How to Use</h2>
          <ul className="text-slate-300 space-y-2 list-disc list-inside">
            <li>Enter a Bible reference in the search box (Old or New Testament)</li>
            <li>Examples: "Matthew 5:3", "John 1:1", "Genesis 1:1", "Revelation 22:21"</li>
            <li>The Greek text from this 4th-century manuscript will be displayed</li>
            <li>This represents one of the earliest complete witnesses to the biblical text</li>
            <li>Variations from modern texts reflect the manuscript tradition</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnlockableSinaiticus;
