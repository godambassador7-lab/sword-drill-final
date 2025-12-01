import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy, Crown, ArrowLeft, Scroll, Shield } from 'lucide-react';

const KingsOfIsraelCourse = ({ onComplete, onCancel }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentKingIndex, setCurrentKingIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [kingsData, setKingsData] = useState({ beginner: [], intermediate: [], advanced: [] });
  const [completedKings, setCompletedKings] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('kingsOfIsraelProgress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing kings progress:', e);
      }
    }
    return { beginner: [], intermediate: [], advanced: [] };
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState({});
  const [isStudyMode, setIsStudyMode] = useState(true); // Track study vs quiz mode for intermediate/advanced

  // Save progress to localStorage whenever completedKings changes
  useEffect(() => {
    localStorage.setItem('kingsOfIsraelProgress', JSON.stringify(completedKings));
  }, [completedKings]);

  // Shuffle array helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Load all three levels (support subdirectory deploys via PUBLIC_URL)
    const base = process.env.PUBLIC_URL || '';
    const loadJson = async (path) => {
      const res = await fetch(`${base}${path}`);
      if (!res.ok) {
        throw new Error(`Failed to load ${path} (${res.status})`);
      }
      // Guard against HTML fallback responses
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error(`Invalid JSON in ${path}`);
      }
    };

    Promise.all([
      loadJson('/kings_of_israel_course/beginner.json'),
      loadJson('/kings_of_israel_course/intermediate.json'),
      loadJson('/kings_of_israel_course/advanced.json')
    ]).then(([beginner, intermediate, advanced]) => {
      const merged = {
        beginner: beginner.map((b, i) => ({ ...b, ...intermediate[i], ...advanced[i] })),
        intermediate: intermediate,
        advanced: advanced
      };
      setKingsData({ beginner, intermediate, advanced });
      setIsLoading(false);
    }).catch(err => {
      console.error('Error loading Kings of Israel data:', err);
      setLoadError(err.message);
      setIsLoading(false);
    });
  }, []);

  // Check if a level is unlocked
  const isLevelUnlocked = (level) => {
    if (level === 'beginner') return true;
    if (level === 'intermediate') return completedKings.beginner.length >= 10;
    if (level === 'advanced') return completedKings.intermediate.length >= 10;
    return false;
  };

  // Get level progress
  const getLevelProgress = (level) => {
    const total = kingsData[level]?.length || 0;
    const completed = completedKings[level]?.length || 0;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const handleKingComplete = () => {
    const currentKing = kingsData[selectedLevel][currentKingIndex];
    if (!completedKings[selectedLevel].includes(currentKingIndex)) {
      setCompletedKings(prev => ({
        ...prev,
        [selectedLevel]: [...prev[selectedLevel], currentKingIndex]
      }));
    }

    // Move to next king or complete level
    if (currentKingIndex < kingsData[selectedLevel].length - 1) {
      setCurrentKingIndex(currentKingIndex + 1);
      setShowAnswer(false);
    } else {
      // Level complete
      alert(`🎉 ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Level Complete!\n\nYou've learned about all ${kingsData[selectedLevel].length} kings!`);
      onComplete({ type: 'level', level: selectedLevel, kings: kingsData[selectedLevel].length });
      setSelectedLevel(null);
      setCurrentKingIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentKingIndex > 0) {
      setCurrentKingIndex(currentKingIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setCurrentKingIndex(0);
    setShowAnswer(false);
    setCurrentQuestionIndex(0);
    setQuizAnswers({});
    setShowQuizResults(false);
    setShuffledOptions({});
    setIsStudyMode(true);
  };

  // Level selection view
  if (!selectedLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-4 border-amber-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Crown className="text-amber-400" size={40} />
                <div>
                  <h1 className="text-3xl font-bold text-amber-400">Kings of Israel Course</h1>
                  <p className="text-slate-300 text-sm mt-1">Learn the chronology, prophets, and events of Israel's kings</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={28} />
              </button>
            </div>

            {/* Overview */}
            <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-6 mb-8 border-2 border-amber-500/30">
              <div className="flex items-start gap-4">
                <Shield className="text-amber-400 flex-shrink-0" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-amber-300 mb-2">About This Course</h3>
                  <p className="text-slate-200 text-sm mb-2">
                    Master the chronology of the Kings of Israel and Judah through three progressive levels:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-1 ml-4">
                    <li>• <strong>Beginner:</strong> Study detailed history and answer 5 quiz questions per king</li>
                    <li>• <strong>Intermediate:</strong> Discover which prophets ministered during each reign</li>
                    <li>• <strong>Advanced:</strong> Deep dive into prophetic ministry with harder questions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Levels */}
            <div className="space-y-4">
              {/* Beginner */}
              <div
                onClick={() => isLevelUnlocked('beginner') && setSelectedLevel('beginner')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isLevelUnlocked('beginner')
                    ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/50 hover:border-green-400 cursor-pointer'
                    : 'bg-slate-700/30 border-slate-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isLevelUnlocked('beginner') ? (
                      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                        <BookOpen className="text-white" size={24} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                        <Lock className="text-slate-400" size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">Beginner Level</h3>
                      <p className="text-sm text-slate-300">Study each king's history and pass quizzes (5 questions each)</p>
                    </div>
                  </div>
                  {isLevelUnlocked('beginner') && <ChevronRight className="text-green-400" size={28} />}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-300">
                    {getLevelProgress('beginner').completed} / {getLevelProgress('beginner').total} Kings Learned
                  </div>
                  <div className="w-1/3 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${getLevelProgress('beginner').percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Intermediate */}
              <div
                onClick={() => isLevelUnlocked('intermediate') && setSelectedLevel('intermediate')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isLevelUnlocked('intermediate')
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/50 hover:border-blue-400 cursor-pointer'
                    : 'bg-slate-700/30 border-slate-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isLevelUnlocked('intermediate') ? (
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <Scroll className="text-white" size={24} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                        <Lock className="text-slate-400" size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">Intermediate Level</h3>
                      <p className="text-sm text-slate-300">Learn which prophets served during each reign</p>
                    </div>
                  </div>
                  {isLevelUnlocked('intermediate') && <ChevronRight className="text-blue-400" size={28} />}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-300">
                    {isLevelUnlocked('intermediate') ? `${getLevelProgress('intermediate').completed} / ${getLevelProgress('intermediate').total} Kings Learned` : 'Complete 10 beginner kings to unlock'}
                  </div>
                  {isLevelUnlocked('intermediate') && (
                    <div className="w-1/3 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${getLevelProgress('intermediate').percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced */}
              <div
                onClick={() => isLevelUnlocked('advanced') && setSelectedLevel('advanced')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isLevelUnlocked('advanced')
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 hover:border-purple-400 cursor-pointer'
                    : 'bg-slate-700/30 border-slate-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isLevelUnlocked('advanced') ? (
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                        <Trophy className="text-white" size={24} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                        <Lock className="text-slate-400" size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">Advanced Level</h3>
                      <p className="text-sm text-slate-300">Study prophetic ministry and pass harder quizzes (5 questions each)</p>
                    </div>
                  </div>
                  {isLevelUnlocked('advanced') && <ChevronRight className="text-purple-400" size={28} />}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-300">
                    {isLevelUnlocked('advanced') ? `${getLevelProgress('advanced').completed} / ${getLevelProgress('advanced').total} Kings Learned` : 'Complete 10 intermediate kings to unlock'}
                  </div>
                  {isLevelUnlocked('advanced') && (
                    <div className="w-1/3 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${getLevelProgress('advanced').percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Learning view - Beginner: Detailed with Quiz, Others: Flashcard style
  if (selectedLevel && kingsData[selectedLevel]?.length > 0) {
    const currentKing = kingsData[selectedLevel][currentKingIndex];
    const levelColors = {
      beginner: { bg: 'from-green-900', border: 'border-green-500', text: 'text-green-400' },
      intermediate: { bg: 'from-blue-900', border: 'border-blue-500', text: 'text-blue-400' },
      advanced: { bg: 'from-purple-900', border: 'border-purple-500', text: 'text-purple-400' }
    };
    const colors = levelColors[selectedLevel];

    // BEGINNER LEVEL: Detailed study with quiz questions
    if (selectedLevel === 'beginner') {
      const currentQuestion = currentKing.questions?.[currentQuestionIndex];
      const score = Object.values(quizAnswers).filter(a => a.correct).length;

      // Generate shuffle key for current question
      const shuffleKey = `${currentKingIndex}-${currentQuestionIndex}`;

      // Shuffle options if not already shuffled for this question
      if (currentQuestion && !shuffledOptions[shuffleKey]) {
        const newShuffled = { ...shuffledOptions };
        newShuffled[shuffleKey] = shuffleArray(currentQuestion.options);
        setShuffledOptions(newShuffled);
      }

      // Get shuffled options for current question
      const displayOptions = shuffledOptions[shuffleKey] || currentQuestion?.options || [];

      return (
        <div className={`min-h-screen bg-gradient-to-br ${colors.bg} via-slate-900 to-slate-900 p-4`}>
          <div className="max-w-4xl mx-auto">
            <div className={`bg-slate-800 rounded-2xl p-8 border-4 ${colors.border}`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handleBackToLevels}
                  className={`flex items-center gap-2 ${colors.text} hover:opacity-80 transition-colors`}
                >
                  <ArrowLeft size={20} />
                  Back to Levels
                </button>
                <div className={`${colors.text} font-bold`}>
                  King {currentKingIndex + 1} / {kingsData[selectedLevel].length}
                </div>
              </div>

              {/* King Title */}
              <div className="text-center mb-8">
                <Crown className={`${colors.text} mx-auto mb-4`} size={64} />
                <h1 className="text-5xl font-bold text-white mb-2">{currentKing.king}</h1>
                <p className="text-2xl text-amber-400">{currentKing.reign}</p>
              </div>

              {/* King Details */}
              <div className="space-y-6 mb-8">
                {/* Description */}
                <div className="bg-slate-700/50 rounded-xl p-6 border-2 border-green-500/30">
                  <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center gap-2">
                    <BookOpen size={24} />
                    About This King
                  </h3>
                  <p className="text-slate-200 text-lg leading-relaxed">{currentKing.description}</p>
                </div>

                {/* Key Events */}
                {currentKing.keyEvents && (
                  <div className="bg-slate-700/50 rounded-xl p-6 border-2 border-green-500/30">
                    <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center gap-2">
                      <Star size={24} />
                      Key Events
                    </h3>
                    <ul className="space-y-2">
                      {currentKing.keyEvents.map((event, i) => (
                        <li key={i} className="text-slate-200 flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{event}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scripture & Verdict */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-green-500/30">
                    <h4 className="text-sm font-bold text-green-300 mb-2">Scripture Reference</h4>
                    <p className="text-slate-200">{currentKing.scripture}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-green-500/30">
                    <h4 className="text-sm font-bold text-green-300 mb-2">God's Verdict</h4>
                    <p className="text-slate-200">{currentKing.verdict}</p>
                  </div>
                </div>
              </div>

              {/* Quiz Section */}
              {!showQuizResults && currentQuestion && (
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border-2 border-amber-500/50 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-amber-300">
                      Question {currentQuestionIndex + 1} of 5
                    </h3>
                    <span className="text-slate-300">
                      Score: {score} / {currentQuestionIndex}
                    </span>
                  </div>

                  <p className="text-xl text-white mb-6">{currentQuestion.question}</p>

                  <div className="space-y-3">
                    {displayOptions.map((option, i) => {
                      const isSelected = quizAnswers[currentQuestionIndex]?.selected === option;
                      const isCorrect = option === currentQuestion.answer;
                      const showResult = quizAnswers[currentQuestionIndex] !== undefined;

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (!showResult) {
                              setQuizAnswers(prev => ({
                                ...prev,
                                [currentQuestionIndex]: {
                                  selected: option,
                                  correct: isCorrect
                                }
                              }));
                            }
                          }}
                          disabled={showResult}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            showResult
                              ? isSelected
                                ? isCorrect
                                  ? 'bg-green-600 border-green-400 text-white'
                                  : 'bg-red-600 border-red-400 text-white'
                                : isCorrect
                                ? 'bg-green-600/30 border-green-400 text-white'
                                : 'bg-slate-700 border-slate-600 text-slate-400'
                              : isSelected
                              ? 'bg-amber-600 border-amber-400 text-white'
                              : 'bg-slate-700 border-slate-600 text-white hover:border-amber-500'
                          }`}
                        >
                          {option}
                          {showResult && isCorrect && ' ✓'}
                          {showResult && isSelected && !isCorrect && ' ✗'}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswers[currentQuestionIndex] && (
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex < 4) {
                            setCurrentQuestionIndex(currentQuestionIndex + 1);
                          } else {
                            setShowQuizResults(true);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                      >
                        {currentQuestionIndex < 4 ? 'Next Question' : 'See Results'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quiz Results */}
              {showQuizResults && (
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border-2 border-amber-500/50 mb-6 text-center">
                  <Trophy className="text-amber-400 mx-auto mb-4" size={64} />
                  <h3 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h3>
                  <p className="text-2xl text-amber-300 mb-6">
                    You scored {score} out of 5
                  </p>
                  <p className="text-slate-300 mb-6">
                    {score === 5 ? '🎉 Perfect! You mastered this king!' :
                     score >= 4 ? '👑 Great job! You know this king well!' :
                     score >= 3 ? '👍 Good effort! Review the details and try again.' :
                     '📚 Keep studying! Review the material above.'}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex(0);
                        setQuizAnswers({});
                        setShowQuizResults(false);
                        // Clear shuffled options for this king to get new shuffle
                        const newShuffled = { ...shuffledOptions };
                        for (let i = 0; i < 5; i++) {
                          delete newShuffled[`${currentKingIndex}-${i}`];
                        }
                        setShuffledOptions(newShuffled);
                      }}
                      className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Retake Quiz
                    </button>
                    <button
                      onClick={() => {
                        if (score >= 4) {
                          // Mark as completed and move to next
                          if (!completedKings.beginner.includes(currentKingIndex)) {
                            setCompletedKings(prev => ({
                              ...prev,
                              beginner: [...prev.beginner, currentKingIndex]
                            }));
                          }

                          if (currentKingIndex < kingsData.beginner.length - 1) {
                            setCurrentKingIndex(currentKingIndex + 1);
                            setCurrentQuestionIndex(0);
                            setQuizAnswers({});
                            setShowQuizResults(false);
                          } else {
                            alert(`🎉 Beginner Level Complete!\n\nYou've learned about all ${kingsData.beginner.length} kings!`);
                            onComplete({ type: 'level', level: 'beginner', kings: kingsData.beginner.length });
                            setSelectedLevel(null);
                            setCurrentKingIndex(0);
                            setCurrentQuestionIndex(0);
                            setQuizAnswers({});
                            setShowQuizResults(false);
                          }
                        }
                      }}
                      disabled={score < 4}
                      className={`flex-1 ${
                        score >= 4
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                          : 'bg-slate-700 cursor-not-allowed opacity-50'
                      } text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2`}
                    >
                      {currentKingIndex === kingsData.beginner.length - 1 ? (
                        <>
                          <Trophy size={20} />
                          Complete Level
                        </>
                      ) : (
                        <>
                          Next King
                          <ChevronRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                  {score < 4 && (
                    <p className="text-yellow-300 text-sm mt-4">
                      You need to score at least 4 out of 5 to continue.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ADVANCED LEVEL: Prophet-focused with quiz questions
    if (selectedLevel === 'advanced') {
      const currentQuestion = currentKing.questions?.[currentQuestionIndex];
      const score = Object.values(quizAnswers).filter(a => a.correct).length;

      // Generate shuffle key for current question
      const shuffleKey = `${currentKingIndex}-${currentQuestionIndex}`;

      // Shuffle options if not already shuffled for this question
      if (currentQuestion && !shuffledOptions[shuffleKey]) {
        const newShuffled = { ...shuffledOptions };
        newShuffled[shuffleKey] = shuffleArray(currentQuestion.options);
        setShuffledOptions(newShuffled);
      }

      // Get shuffled options for current question
      const displayOptions = shuffledOptions[shuffleKey] || currentQuestion?.options || [];

      return (
        <div className={`min-h-screen bg-gradient-to-br ${colors.bg} via-slate-900 to-slate-900 p-4`}>
          <div className="max-w-4xl mx-auto">
            <div className={`bg-slate-800 rounded-2xl p-8 border-4 ${colors.border}`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handleBackToLevels}
                  className={`flex items-center gap-2 ${colors.text} hover:opacity-80 transition-colors`}
                >
                  <ArrowLeft size={20} />
                  Back to Levels
                </button>
                <div className={`${colors.text} font-bold`}>
                  King {currentKingIndex + 1} / {kingsData[selectedLevel].length}
                </div>
              </div>

              {/* King Title */}
              <div className="text-center mb-8">
                <Crown className={`${colors.text} mx-auto mb-4`} size={64} />
                <h1 className="text-5xl font-bold text-white mb-2">{currentKing.king}</h1>
                <p className="text-2xl text-amber-400">{currentKing.reign}</p>
                {currentKing.prophets && currentKing.prophets.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {currentKing.prophets.map((prophet, i) => (
                      <span key={i} className="bg-purple-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                        Prophet: {prophet}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* King Details - Prophet Focused - Only show in study mode */}
              {isStudyMode && (
                <div className="space-y-6 mb-8">
                  {/* Description */}
                  <div className="bg-slate-700/50 rounded-xl p-6 border-2 border-purple-500/30">
                    <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                      <Scroll size={24} />
                      Prophetic Ministry During This Reign
                    </h3>
                    <p className="text-slate-200 text-lg leading-relaxed">{currentKing.description}</p>
                  </div>

                  {/* Prophetic Details */}
                  {currentKing.propheticDetails && (
                    <div className="bg-slate-700/50 rounded-xl p-6 border-2 border-purple-500/30">
                      <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                        <Star size={24} />
                        Key Prophetic Events
                      </h3>
                      <ul className="space-y-2">
                        {currentKing.propheticDetails.map((detail, i) => (
                          <li key={i} className="text-slate-200 flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Scripture */}
                  <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-purple-500/30">
                    <h4 className="text-sm font-bold text-purple-300 mb-2">Scripture Reference</h4>
                    <p className="text-slate-200">{currentKing.scripture}</p>
                  </div>

                  {/* Start Quiz Button */}
                  <div className="text-center">
                    <button
                      onClick={() => setIsStudyMode(false)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              )}

              {/* Quiz Section - Only show in quiz mode */}
              {!isStudyMode && !showQuizResults && currentQuestion && (
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border-2 border-amber-500/50 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-amber-300">
                      Question {currentQuestionIndex + 1} of 5
                    </h3>
                    <span className="text-slate-300">
                      Score: {score} / {currentQuestionIndex}
                    </span>
                  </div>

                  <p className="text-xl text-white mb-6">{currentQuestion.question}</p>

                  <div className="space-y-3">
                    {displayOptions.map((option, i) => {
                      const isSelected = quizAnswers[currentQuestionIndex]?.selected === option;
                      const isCorrect = option === currentQuestion.answer;
                      const showResult = quizAnswers[currentQuestionIndex] !== undefined;

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (!showResult) {
                              setQuizAnswers(prev => ({
                                ...prev,
                                [currentQuestionIndex]: {
                                  selected: option,
                                  correct: isCorrect
                                }
                              }));
                            }
                          }}
                          disabled={showResult}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            showResult
                              ? isSelected
                                ? isCorrect
                                  ? 'bg-green-600 border-green-400 text-white'
                                  : 'bg-red-600 border-red-400 text-white'
                                : isCorrect
                                ? 'bg-green-600/30 border-green-400 text-white'
                                : 'bg-slate-700 border-slate-600 text-slate-400'
                              : isSelected
                              ? 'bg-amber-600 border-amber-400 text-white'
                              : 'bg-slate-700 border-slate-600 text-white hover:border-amber-500'
                          }`}
                        >
                          {option}
                          {showResult && isCorrect && ' ✓'}
                          {showResult && isSelected && !isCorrect && ' ✗'}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswers[currentQuestionIndex] && (
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex < 4) {
                            setCurrentQuestionIndex(currentQuestionIndex + 1);
                          } else {
                            setShowQuizResults(true);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                      >
                        {currentQuestionIndex < 4 ? 'Next Question' : 'See Results'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quiz Results */}
              {!isStudyMode && showQuizResults && (
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border-2 border-amber-500/50 mb-6 text-center">
                  <Trophy className="text-amber-400 mx-auto mb-4" size={64} />
                  <h3 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h3>
                  <p className="text-2xl text-amber-300 mb-6">
                    You scored {score} out of 5
                  </p>
                  <p className="text-slate-300 mb-6">
                    {score === 5 ? '🎉 Perfect! You mastered the prophetic ministry during this reign!' :
                     score >= 4 ? '👑 Excellent! You understand the prophetic context well!' :
                     score >= 3 ? '👍 Good effort! Review the prophetic details and try again.' :
                     '📚 Keep studying! Review the prophetic ministry section above.'}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex(0);
                        setQuizAnswers({});
                        setShowQuizResults(false);
                        setIsStudyMode(true);
                        // Clear shuffled options for this king to get new shuffle
                        const newShuffled = { ...shuffledOptions };
                        for (let i = 0; i < 5; i++) {
                          delete newShuffled[`${currentKingIndex}-${i}`];
                        }
                        setShuffledOptions(newShuffled);
                      }}
                      className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Study Again
                    </button>
                    <button
                      onClick={() => {
                        if (score >= 4) {
                          // Mark as completed and move to next
                          if (!completedKings.advanced.includes(currentKingIndex)) {
                            setCompletedKings(prev => ({
                              ...prev,
                              advanced: [...prev.advanced, currentKingIndex]
                            }));
                          }

                          if (currentKingIndex < kingsData.advanced.length - 1) {
                            setCurrentKingIndex(currentKingIndex + 1);
                            setCurrentQuestionIndex(0);
                            setQuizAnswers({});
                            setShowQuizResults(false);
                            setIsStudyMode(true);
                          } else {
                            alert(`🎉 Advanced Level Complete!\n\nYou've mastered the prophetic ministry of all ${kingsData.advanced.length} kings!`);
                            onComplete({ type: 'level', level: 'advanced', kings: kingsData.advanced.length });
                            setSelectedLevel(null);
                            setCurrentKingIndex(0);
                            setCurrentQuestionIndex(0);
                            setQuizAnswers({});
                            setShowQuizResults(false);
                            setIsStudyMode(true);
                          }
                        }
                      }}
                      disabled={score < 4}
                      className={`flex-1 ${
                        score >= 4
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
                          : 'bg-slate-700 cursor-not-allowed opacity-50'
                      } text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2`}
                    >
                      {currentKingIndex === kingsData.advanced.length - 1 ? (
                        <>
                          <Trophy size={20} />
                          Complete Level
                        </>
                      ) : (
                        <>
                          Next King
                          <ChevronRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                  {score < 4 && (
                    <p className="text-yellow-300 text-sm mt-4">
                      You need to score at least 4 out of 5 to continue.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // INTERMEDIATE LEVEL: Event-focused with quiz questions
    if (selectedLevel === 'intermediate') {
      const currentQuestion = currentKing.questions?.[currentQuestionIndex];
      const score = Object.values(quizAnswers).filter(a => a.correct).length;

      // Generate shuffle key for current question
      const shuffleKey = `${currentKingIndex}-${currentQuestionIndex}`;

      // Shuffle options if not already shuffled for this question
      if (currentQuestion && !shuffledOptions[shuffleKey]) {
        const newShuffled = { ...shuffledOptions };
        newShuffled[shuffleKey] = shuffleArray(currentQuestion.options);
        setShuffledOptions(newShuffled);
      }

      // Get shuffled options for current question
      const displayOptions = shuffledOptions[shuffleKey] || currentQuestion?.options || [];

      return (
        <div className={`min-h-screen bg-gradient-to-br ${colors.bg} via-slate-900 to-slate-900 p-4`}>
          <div className="max-w-4xl mx-auto">
            <div className={`bg-slate-800 rounded-2xl p-8 border-4 ${colors.border}`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handleBackToLevels}
                  className={`flex items-center gap-2 ${colors.text} hover:opacity-80 transition-colors`}
                >
                  <ArrowLeft size={20} />
                  Back to Levels
                </button>
                <div className={`${colors.text} font-bold`}>
                  King {currentKingIndex + 1} / {kingsData[selectedLevel].length}
                </div>
              </div>

              {/* King Title */}
              <div className="text-center mb-8">
                <Crown className={`${colors.text} mx-auto mb-4`} size={64} />
                <h1 className="text-5xl font-bold text-white mb-2">{currentKing.king}</h1>
                <p className="text-2xl text-amber-400">{currentKing.reign}</p>
                {currentKing.prophets && currentKing.prophets.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {currentKing.prophets.map((prophet, i) => (
                      <span key={i} className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                        Prophet: {prophet}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* King Details - Event Focused - Only show in study mode */}
              {isStudyMode && (
                <div className="space-y-6 mb-8">
                  {/* Description */}
                  <div className="bg-slate-700/50 rounded-xl p-6 border-2 border-blue-500/30">
                    <h3 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2">
                      <Scroll size={24} />
                      Historical Overview
                    </h3>
                    <p className="text-slate-200 text-lg leading-relaxed">{currentKing.description}</p>
                  </div>

                  {/* Key Events */}
                  {currentKing.keyEvents && (
                    <div className="bg-slate-700/50 rounded-xl p-6 border-2 border-blue-500/30">
                      <h3 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2">
                        <Star size={24} />
                        Key Events
                      </h3>
                      <ul className="space-y-2">
                        {currentKing.keyEvents.map((event, i) => (
                          <li key={i} className="text-slate-200 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{event}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Scripture */}
                  <div className="bg-slate-700/50 rounded-xl p-4 border-2 border-blue-500/30">
                    <h4 className="text-sm font-bold text-blue-300 mb-2">Scripture Reference</h4>
                    <p className="text-slate-200">{currentKing.scripture}</p>
                  </div>

                  {/* Start Quiz Button */}
                  <div className="text-center">
                    <button
                      onClick={() => setIsStudyMode(false)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              )}

              {/* Quiz Section - Only show in quiz mode */}
              {!isStudyMode && !showQuizResults && currentQuestion && (
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border-2 border-amber-500/50 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-amber-300">
                      Question {currentQuestionIndex + 1} of 5
                    </h3>
                    <span className="text-slate-300">
                      Score: {score} / {currentQuestionIndex}
                    </span>
                  </div>

                  <p className="text-xl text-white mb-6">{currentQuestion.question}</p>

                  <div className="space-y-3">
                    {displayOptions.map((option, i) => {
                      const isSelected = quizAnswers[currentQuestionIndex]?.selected === option;
                      const isCorrect = option === currentQuestion.answer;
                      const showResult = quizAnswers[currentQuestionIndex] !== undefined;

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (!showResult) {
                              setQuizAnswers(prev => ({
                                ...prev,
                                [currentQuestionIndex]: {
                                  selected: option,
                                  correct: isCorrect
                                }
                              }));
                            }
                          }}
                          disabled={showResult}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            showResult
                              ? isSelected
                                ? isCorrect
                                  ? 'bg-green-600 border-green-400 text-white'
                                  : 'bg-red-600 border-red-400 text-white'
                                : isCorrect
                                ? 'bg-green-600/30 border-green-400 text-white'
                                : 'bg-slate-700 border-slate-600 text-slate-400'
                              : isSelected
                              ? 'bg-amber-600 border-amber-400 text-white'
                              : 'bg-slate-700 border-slate-600 text-white hover:border-amber-500'
                          }`}
                        >
                          {option}
                          {showResult && isCorrect && ' ✓'}
                          {showResult && isSelected && !isCorrect && ' ✗'}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswers[currentQuestionIndex] && (
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex < 4) {
                            setCurrentQuestionIndex(currentQuestionIndex + 1);
                          } else {
                            setShowQuizResults(true);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                      >
                        {currentQuestionIndex < 4 ? 'Next Question' : 'See Results'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quiz Results */}
              {!isStudyMode && showQuizResults && (
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border-2 border-amber-500/50 mb-6 text-center">
                  <Trophy className="text-amber-400 mx-auto mb-4" size={64} />
                  <h3 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h3>
                  <p className="text-2xl text-amber-300 mb-6">
                    You scored {score} out of 5
                  </p>
                  <p className="text-slate-300 mb-6">
                    {score === 5 ? '🎉 Perfect! You mastered the events of this reign!' :
                     score >= 4 ? '👑 Excellent! You understand the key events well!' :
                     score >= 3 ? '👍 Good effort! Review the events and try again.' :
                     '📚 Keep studying! Review the events section above.'}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex(0);
                        setQuizAnswers({});
                        setShowQuizResults(false);
                        setIsStudyMode(true);
                        // Clear shuffled options for this king to get new shuffle
                        const newShuffled = { ...shuffledOptions };
                        for (let i = 0; i < 5; i++) {
                          delete newShuffled[`${currentKingIndex}-${i}`];
                        }
                        setShuffledOptions(newShuffled);
                      }}
                      className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Study Again
                    </button>
                    <button
                      onClick={() => {
                        if (score >= 4) {
                          // Mark as completed and move to next
                          if (!completedKings.intermediate.includes(currentKingIndex)) {
                            setCompletedKings(prev => ({
                              ...prev,
                              intermediate: [...prev.intermediate, currentKingIndex]
                            }));
                          }

                          if (currentKingIndex < kingsData.intermediate.length - 1) {
                            setCurrentKingIndex(currentKingIndex + 1);
                            setCurrentQuestionIndex(0);
                            setQuizAnswers({});
                            setShowQuizResults(false);
                            setIsStudyMode(true);
                          } else {
                            alert(`🎉 Intermediate Level Complete!\n\nYou've mastered the events of all ${kingsData.intermediate.length} kings!`);
                            onComplete({ type: 'level', level: 'intermediate', kings: kingsData.intermediate.length });
                            setSelectedLevel(null);
                            setCurrentKingIndex(0);
                            setCurrentQuestionIndex(0);
                            setQuizAnswers({});
                            setShowQuizResults(false);
                            setIsStudyMode(true);
                          }
                        }
                      }}
                      disabled={score < 4}
                      className={`flex-1 ${
                        score >= 4
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
                          : 'bg-slate-700 cursor-not-allowed opacity-50'
                      } text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2`}
                    >
                      {currentKingIndex === kingsData.intermediate.length - 1 ? (
                        <>
                          <Trophy size={20} />
                          Complete Level
                        </>
                      ) : (
                        <>
                          Next King
                          <ChevronRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                  {score < 4 && (
                    <p className="text-yellow-300 text-sm mt-4">
                      You need to score at least 4 out of 5 to continue.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 border-2 border-red-500 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Course</h2>
          <p className="text-white mb-4">{loadError}</p>
          <button
            onClick={onCancel}
            className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Should not reach here
  return null;
};

export default KingsOfIsraelCourse;
