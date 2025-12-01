import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';
import { getWlcVerseByReference } from '../services/assistant/retrieval/wlcProvider';

const UnlockableMasoretic = ({ onBack }) => {
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
      const result = await getWlcVerseByReference(reference);

      if (result) {
        setVerseData(result);
        setError('');
      } else {
        setError('Verse not found in Masoretic Text. The WLC only contains Old Testament books.');
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
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">📜</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Masoretic Text (WLC)
              </h1>
              <p className="text-slate-400 mt-2">Westminster Leningrad Codex - Hebrew Bible</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-amber-500/20 mb-6">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">About the Masoretic Text</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              The Masoretic Text is the authoritative Hebrew text of the Jewish Bible (Tanakh). It was
              carefully preserved and transmitted by Jewish scholars called the Masoretes between the 7th
              and 10th centuries AD.
            </p>
            <p>
              The Westminster Leningrad Codex (WLC) is a modern critical edition based on the Leningrad
              Codex, the oldest complete manuscript of the Masoretic Text, dating to 1008 AD.
            </p>
            <p>
              This text includes vowel points (niqqud) and cantillation marks added by the Masoretes to
              preserve pronunciation and liturgical reading traditions that had been passed down orally
              for centuries.
            </p>
            <p>
              The Masoretic Text is the basis for most modern Old Testament translations and is considered
              the most reliable witness to the original Hebrew Scriptures.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-amber-500/20 mb-6">
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Search size={24} />
            Search Masoretic Text
          </h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter reference (e.g., Genesis 1:1, Psalm 23:1)"
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
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
            <div className="bg-slate-700/50 rounded-lg p-6 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-amber-400" size={24} />
                <h3 className="text-xl font-bold text-amber-400">{verseData.reference}</h3>
              </div>
              <div
                className="text-3xl leading-relaxed text-white font-serif mb-4 text-right"
                style={{ direction: 'rtl' }}
              >
                {verseData.text}
              </div>
              <div className="text-sm text-slate-400 border-t border-slate-600 pt-3">
                Text: {verseData.translation} (Westminster Leningrad Codex) | Language: Hebrew ({verseData.language}) | Direction: Right-to-Left
              </div>
            </div>
          )}
        </div>

        {/* Usage Guide */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-amber-500/20">
          <h2 className="text-xl font-bold text-amber-400 mb-3">How to Use</h2>
          <ul className="text-slate-300 space-y-2 list-disc list-inside">
            <li>Enter a Bible reference in the search box (Old Testament only)</li>
            <li>Examples: "Genesis 1:1", "Psalm 119:105", "Isaiah 53:5"</li>
            <li>The Hebrew text will be displayed right-to-left with vowel points</li>
            <li>This represents the original Hebrew language of the Old Testament</li>
            <li>Compare with translations to understand nuances in the original language</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnlockableMasoretic;
