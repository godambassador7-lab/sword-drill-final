/**
 * Practice Review Component
 *
 * Allows users to practice missed verses and quizzes without affecting their points
 * - Review incorrectly answered verses
 * - Practice weak areas
 * - No point penalties or rewards
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Target,
  TrendingDown,
  Filter,
  Play,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import VerseScrambleQuiz from './VerseScrambleQuiz';
import BookOrderQuiz from './BookOrderQuiz';
import SwordDrillUltimate from './SwordDrillUltimate';
import BiblicalSpellingBee from './BiblicalSpellingBee';

const PracticeReview = ({ onClose, userData }) => {
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, verse-scramble, book-order, sword-drill
  const [practiceMode, setPracticeMode] = useState(null);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [showQuizTypeMenu, setShowQuizTypeMenu] = useState(null); // Track which verse's menu is open

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showQuizTypeMenu) {
        setShowQuizTypeMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showQuizTypeMenu]);

  // Get missed verses from user data
  const missedVerses = useMemo(() => {
    if (!userData || !userData.verseProgress) return [];

    const verses = [];
    Object.entries(userData.verseProgress).forEach(([reference, progress]) => {
      if (progress.incorrectCount > 0) {
        // Calculate struggle score (higher = needs more practice)
        const totalAttempts = progress.correctCount + progress.incorrectCount;
        const accuracy = totalAttempts > 0 ? (progress.correctCount / totalAttempts) * 100 : 0;
        const struggleScore = progress.incorrectCount * 10 - accuracy;

        verses.push({
          reference,
          correctCount: progress.correctCount,
          incorrectCount: progress.incorrectCount,
          accuracy: Math.round(accuracy),
          struggleScore,
          lastReview: progress.lastReview,
          quizTypes: progress.quizTypes || {}
        });
      }
    });

    // Sort by struggle score (most struggled first)
    return verses.sort((a, b) => b.struggleScore - a.struggleScore);
  }, [userData]);

  // Filter by quiz type
  const filteredVerses = useMemo(() => {
    if (selectedFilter === 'all') return missedVerses;

    return missedVerses.filter(verse => {
      const types = verse.quizTypes || {};
      return types[selectedFilter] && types[selectedFilter].incorrectCount > 0;
    });
  }, [missedVerses, selectedFilter]);

  // Start practice session
  const startPractice = (verse, quizType) => {
    setCurrentVerse(verse);
    setPracticeMode(quizType);
  };

  // Complete practice (no points affected)
  const completePractice = () => {
    setPracticeMode(null);
    setCurrentVerse(null);
  };

  // Available quiz types for practice (verse-based only)
  const availableQuizTypes = [
    { id: 'verse-scramble', name: 'Verse Scramble', icon: '🔀' },
    { id: 'fill-blank', name: 'Fill in the Blank', icon: '📝' },
    { id: 'multiple-choice', name: 'Multiple Choice', icon: '✔️' },
    { id: 'reference-recall', name: 'Reference Recall', icon: '📖' },
  ];

  // Get quiz type name
  const getQuizTypeName = (type) => {
    const typeMap = {
      'verse-scramble': 'Verse Scramble',
      'book-order': 'Book Order',
      'sword-drill': 'Sword Drill',
      'fill-blank': 'Fill in the Blank',
      'multiple-choice': 'Multiple Choice',
      'reference-recall': 'Reference Recall',
      'spelling-bee': 'Spelling Bee'
    };
    return typeMap[type] || type;
  };

  // Render practice quiz
  if (practiceMode && currentVerse) {
    const practiceVerse = {
      reference: currentVerse.reference,
      id: currentVerse.reference
    };

    return (
      <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {/* Practice Mode Header */}
          <div className="bg-blue-900/40 border border-blue-600/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="text-blue-400" size={24} />
                <div>
                  <h2 className="text-xl font-bold text-blue-200">Practice Mode</h2>
                  <p className="text-blue-300 text-sm">No points will be affected</p>
                </div>
              </div>
              <button
                onClick={completePractice}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Exit Practice
              </button>
            </div>
          </div>

          {/* Render appropriate quiz */}
          {practiceMode === 'verse-scramble' && (
            <VerseScrambleQuiz
              verse={practiceVerse}
              onComplete={completePractice}
              onSkip={completePractice}
              isPracticeMode={true}
            />
          )}
          {practiceMode === 'book-order' && (
            <BookOrderQuiz
              onComplete={completePractice}
              onCancel={completePractice}
              isPracticeMode={true}
            />
          )}
          {practiceMode === 'sword-drill' && (
            <SwordDrillUltimate
              onComplete={completePractice}
              onCancel={completePractice}
              isPracticeMode={true}
            />
          )}
          {practiceMode === 'spelling-bee' && (
            <BiblicalSpellingBee
              onComplete={completePractice}
              onCancel={completePractice}
              isPracticeMode={true}
            />
          )}
          {(practiceMode === 'fill-blank' || practiceMode === 'multiple-choice' || practiceMode === 'reference-recall') && (
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
              <AlertCircle className="text-amber-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-100 mb-2">
                {getQuizTypeName(practiceMode)}
              </h3>
              <p className="text-slate-400 mb-4">
                This quiz type uses the main quiz flow. Practice with: {currentVerse.reference}
              </p>
              <button
                onClick={completePractice}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Return to Practice List
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 z-40 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg z-10 border-b-2 border-blue-500/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="text-blue-100" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">Practice Review</h1>
              <p className="text-blue-100 text-sm">Review & Practice Without Point Penalties</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close Practice Review"
          >
            <X className="text-white" size={28} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-900/40 border border-blue-600/50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-bold text-blue-200 mb-2">Practice Mode Benefits</h3>
              <ul className="text-blue-300 space-y-1 text-sm">
                <li>• Review verses you've previously missed</li>
                <li>• Practice without affecting your points or streak</li>
                <li>• Focus on your weakest areas</li>
                <li>• Build confidence before taking scored quizzes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <TrendingDown className="text-red-400" size={24} />
              <div>
                <p className="text-sm text-slate-400">Verses to Review</p>
                <p className="text-2xl font-bold text-white">{missedVerses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <Target className="text-orange-400" size={24} />
              <div>
                <p className="text-sm text-slate-400">Most Struggled</p>
                <p className="text-lg font-bold text-white truncate">
                  {missedVerses.length > 0 ? missedVerses[0].reference : 'None'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400" size={24} />
              <div>
                <p className="text-sm text-slate-400">Practice Sessions</p>
                <p className="text-2xl font-bold text-white">∞</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Quizzes Section */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-6 border border-purple-700/50">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-purple-300 mb-2">🎁 Bonus Quizzes</h3>
            <p className="text-purple-200/80 text-sm">Challenge yourself with these special quiz types</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spelling Bee */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-lg p-4 border border-yellow-600/50">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🐝</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-amber-300 mb-1">Biblical Spelling Bee</h4>
                  <p className="text-amber-200/70 text-sm mb-3">Spell words from Smith's Bible Dictionary</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentVerse({ reference: 'Spelling Bee' });
                  setPracticeMode('spelling-bee');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors font-semibold"
              >
                <Play size={18} />
                <span>Practice Spelling</span>
              </button>
            </div>

            {/* Book Order */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-lg p-4 border border-blue-600/50">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">📚</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-blue-300 mb-1">Book Order Challenge</h4>
                  <p className="text-blue-200/70 text-sm mb-3">Arrange Bible books in correct order</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentVerse({ reference: 'Book Order' });
                  setPracticeMode('book-order');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-semibold"
              >
                <Play size={18} />
                <span>Practice Books</span>
              </button>
            </div>

            {/* Sword Drill */}
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-lg p-4 border border-red-600/50">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">⚔️</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-red-300 mb-1">Sword Drill Ultimate</h4>
                  <p className="text-red-200/70 text-sm mb-3">Speed finding verses in the Bible</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentVerse({ reference: 'Sword Drill' });
                  setPracticeMode('sword-drill');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-semibold"
              >
                <Play size={18} />
                <span>Practice Speed</span>
              </button>
            </div>

            {/* GeoGuessr Placeholder */}
            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-lg p-4 border border-green-600/50">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🗺️</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-green-300 mb-1">Biblical GeoGuessr</h4>
                  <p className="text-green-200/70 text-sm mb-3">Explore biblical locations on the map</p>
                </div>
              </div>
              <button
                onClick={() => {
                  alert('GeoGuessr practice coming soon! Access it from the main menu for now.');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-semibold"
              >
                <Play size={18} />
                <span>Practice Geography</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="text-slate-400" size={20} />
            <h3 className="text-sm font-bold text-slate-200">Filter Verse Reviews</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'verse-scramble', 'book-order', 'sword-drill'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold
                  ${selectedFilter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }
                `}
              >
                {type === 'all' ? 'All Types' : getQuizTypeName(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Missed Verses List */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-amber-400" size={24} />
            <h3 className="text-xl font-bold text-slate-100">Verses to Practice</h3>
          </div>

          {filteredVerses.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="text-green-400 mx-auto mb-4" size={64} />
              <h3 className="text-xl font-bold text-green-300 mb-2">Great Job!</h3>
              <p className="text-slate-400">
                {selectedFilter === 'all'
                  ? "You haven't missed any verses yet. Keep up the excellent work!"
                  : `No missed verses in ${getQuizTypeName(selectedFilter)}.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVerses.map((verse, index) => (
                <div
                  key={verse.reference}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-amber-400">
                          #{index + 1}
                        </span>
                        <h4 className="text-lg font-bold text-slate-100">
                          {verse.reference}
                        </h4>
                        <span
                          className={`
                            px-2 py-1 rounded text-xs font-semibold
                            ${verse.accuracy >= 70
                              ? 'bg-green-900/40 text-green-300'
                              : verse.accuracy >= 40
                              ? 'bg-yellow-900/40 text-yellow-300'
                              : 'bg-red-900/40 text-red-300'
                            }
                          `}
                        >
                          {verse.accuracy}% accuracy
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>✓ {verse.correctCount} correct</span>
                        <span>✗ {verse.incorrectCount} missed</span>
                        {verse.lastReview && (
                          <span>
                            Last review: {new Date(verse.lastReview).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      {/* Practice Button with Dropdown */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQuizTypeMenu(showQuizTypeMenu === verse.reference ? null : verse.reference);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                      >
                        <Play size={16} />
                        <span className="text-sm font-semibold">Practice</span>
                        <ChevronDown size={16} />
                      </button>

                      {/* Quiz Type Dropdown Menu */}
                      {showQuizTypeMenu === verse.reference && (
                        <div className="absolute right-0 mt-2 w-56 bg-slate-700 rounded-lg shadow-xl border border-slate-600 z-10">
                          <div className="p-2">
                            <div className="text-xs text-slate-400 uppercase font-semibold px-3 py-2">
                              Choose Quiz Type
                            </div>
                            {availableQuizTypes.map(quizType => (
                              <button
                                key={quizType.id}
                                onClick={() => {
                                  startPractice(verse, quizType.id);
                                  setShowQuizTypeMenu(null);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-slate-600 rounded transition-colors flex items-center gap-3"
                              >
                                <span className="text-xl">{quizType.icon}</span>
                                <span className="text-sm text-slate-200">{quizType.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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

export default PracticeReview;
