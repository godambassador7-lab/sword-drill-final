/**
 * DayDetailModal Component
 *
 * Shows detailed quiz statistics for a specific day
 * - Types of quizzes taken
 * - Verses quizzed on
 * - Number of correct/missed answers
 */

import React, { useMemo } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Flame,
  TrendingUp,
  Target,
  BookOpen
} from 'lucide-react';

const DayDetailModal = ({ date, onClose }) => {
  // Format the date for display
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get detailed quiz data for this specific date
  const dayData = useMemo(() => {
    const dateString = date.toISOString().split('T')[0];
    const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
    const dayInfo = streakData[dateString];

    // Check if day exists
    if (!dayInfo) {
      return null;
    }

    // Handle old data structure (no quizzes array) or new structure
    const quizzes = Array.isArray(dayInfo.quizzes) ? dayInfo.quizzes : [];

    // If there's activity but no detailed quiz data, return legacy format
    if (quizzes.length === 0 && dayInfo.marked) {
      return {
        isLegacy: true,
        quizCount: dayInfo.quizCount || 1
      };
    }

    if (quizzes.length === 0) {
      return null;
    }

    // Calculate statistics
    const totalQuizzes = quizzes.length;
    const correctQuizzes = quizzes.filter(q => q.correct).length;
    const missedQuizzes = totalQuizzes - correctQuizzes;
    const accuracy = totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0;
    const totalPoints = quizzes.reduce((sum, q) => sum + (q.points || 0), 0);

    // Group by quiz type
    const quizzesByType = {};
    quizzes.forEach(quiz => {
      const type = quiz.type || 'Unknown';
      if (!quizzesByType[type]) {
        quizzesByType[type] = {
          total: 0,
          correct: 0,
          missed: 0
        };
      }
      quizzesByType[type].total++;
      if (quiz.correct) {
        quizzesByType[type].correct++;
      } else {
        quizzesByType[type].missed++;
      }
    });

    return {
      quizzes,
      totalQuizzes,
      correctQuizzes,
      missedQuizzes,
      accuracy,
      totalPoints,
      quizzesByType
    };
  }, [date]);

  if (!dayData) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-md w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-100">No Activity</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="text-slate-300" size={24} />
            </button>
          </div>
          <p className="text-slate-400 text-center py-8">
            No quizzes were completed on {formattedDate}.
          </p>
        </div>
      </div>
    );
  }

  // Handle legacy data (activity tracked but no detailed stats)
  if (dayData.isLegacy) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-md w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-100">{formattedDate}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="text-slate-300" size={24} />
            </button>
          </div>
          <div className="text-center py-8">
            <Flame className="text-orange-400 mx-auto mb-4" size={48} />
            <p className="text-slate-300 mb-2">
              Activity recorded on this day!
            </p>
            <p className="text-slate-400 text-sm mb-4">
              {dayData.quizCount} {dayData.quizCount === 1 ? 'quiz' : 'quizzes'} completed
            </p>
            <p className="text-slate-500 text-xs">
              Detailed statistics are only available for quizzes completed after the tracking system was updated.
              Keep quizzing to see your full stats!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get friendly names for quiz types
  const getQuizTypeName = (type) => {
    const typeMap = {
      'verse-scramble': 'Verse Scramble',
      'book-order': 'Book Order',
      'sword-drill': 'Sword Drill',
      'spelling-bee': 'Spelling Bee',
      'geoguessr': 'Biblical GeoGuessr',
      'greek-vocab': 'Greek Vocabulary',
      'greek-conjugation': 'Greek Conjugation',
      'greek-declension': 'Greek Declension',
      'greek-article': 'Greek Article',
      'greek-case': 'Greek Case',
      'greek-alphabet': 'Greek Alphabet',
      'hebrew-vocab': 'Hebrew Vocabulary',
      'trivia': 'Bible Trivia'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-t-lg border-b-2 border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{formattedDate}</h2>
              <p className="text-amber-100 text-sm">Quiz Activity Details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="text-white" size={28} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="text-orange-400" size={20} />
                <span className="text-xs text-slate-400 uppercase">Total</span>
              </div>
              <p className="text-2xl font-bold text-white">{dayData.totalQuizzes}</p>
            </div>

            <div className="bg-green-900/30 rounded-lg p-4 border border-green-600/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-green-400" size={20} />
                <span className="text-xs text-slate-400 uppercase">Correct</span>
              </div>
              <p className="text-2xl font-bold text-green-300">{dayData.correctQuizzes}</p>
            </div>

            <div className="bg-red-900/30 rounded-lg p-4 border border-red-600/50">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="text-red-400" size={20} />
                <span className="text-xs text-slate-400 uppercase">Missed</span>
              </div>
              <p className="text-2xl font-bold text-red-300">{dayData.missedQuizzes}</p>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-blue-400" size={20} />
                <span className="text-xs text-slate-400 uppercase">Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-blue-300">{dayData.accuracy}%</p>
            </div>
          </div>

          {/* Points Earned */}
          <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-lg p-4 border border-amber-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-amber-400" size={24} />
                <div>
                  <p className="text-sm text-slate-300">Points Earned</p>
                  <p className="text-2xl font-bold text-amber-300">{dayData.totalPoints}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Types Breakdown */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <BookOpen className="text-amber-400" size={20} />
              Quiz Types
            </h3>
            <div className="space-y-3">
              {Object.entries(dayData.quizzesByType).map(([type, stats]) => (
                <div key={type} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-200">{getQuizTypeName(type)}</span>
                    <span className="text-sm text-slate-400">{stats.total} quizzes</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="text-green-400" size={16} />
                      <span className="text-green-300">{stats.correct} correct</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="text-red-400" size={16} />
                      <span className="text-red-300">{stats.missed} missed</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                      style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verses Quizzed */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Verses Quizzed</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dayData.quizzes.map((quiz, index) => (
                <div
                  key={index}
                  className={`
                    p-3 rounded-lg border flex items-center justify-between
                    ${quiz.correct
                      ? 'bg-green-900/20 border-green-600/30'
                      : 'bg-red-900/20 border-red-600/30'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {quiz.correct ? (
                      <CheckCircle2 className="text-green-400 flex-shrink-0" size={18} />
                    ) : (
                      <XCircle className="text-red-400 flex-shrink-0" size={18} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-200 truncate">
                        {quiz.verseReference || 'Unknown Reference'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {getQuizTypeName(quiz.type)} • {quiz.points || 0} pts
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 flex-shrink-0">
                    {quiz.timestamp && new Date(quiz.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;
