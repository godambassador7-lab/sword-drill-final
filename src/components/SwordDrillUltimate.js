import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Zap, Trophy, Sword, Sparkles, Target } from 'lucide-react';
import { getAllReferencesForDifficulty } from '../data/versesByDifficulty';

// Bible books in order
const BIBLE_BOOKS = [
  // Old Testament
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  // New Testament
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const normalizeAnswer = (answer) => {
  return answer.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Helper functions for verse selection
const levelToDifficulty = (level) => {
  const map = { Beginner: 'beginner', Intermediate: 'intermediate', Advanced: 'advanced', Elite: 'elite' };
  return map[level] || 'beginner';
};

const isVerseOnCooldown = (reference, quizType, verseProgress) => {
  if (!verseProgress || !verseProgress[reference]) return false;
  const progress = verseProgress[reference];

  // Check mastery for this quiz type
  const masteryCount = progress[quizType] || 0;
  if (masteryCount < 4) return false; // Not mastered yet

  // Mastered - put on cooldown (reduce frequency by 70%)
  return Math.random() < 0.7;
};

const generateQuestion = async (userLevel, verseProgress, getLocalVerseByReference) => {
  try {
    const difficulty = levelToDifficulty(userLevel);
    const refs = getAllReferencesForDifficulty(difficulty);
    console.log('[generateQuestion] Difficulty:', difficulty, 'Refs count:', refs?.length);

    if (!refs || refs.length === 0) {
      console.error('[generateQuestion] No references found for difficulty:', difficulty);
      return null;
    }

    // Filter out cooldown references
    const eligible = refs.filter(ref => !isVerseOnCooldown(ref, 'sword-drill-ultimate', verseProgress));
    const pool = eligible.length > 0 ? eligible : refs;
    console.log('[generateQuestion] Pool size:', pool.length);

    // Pick random reference
    const selectedRef = pool[Math.floor(Math.random() * pool.length)];
    console.log('[generateQuestion] Selected ref:', selectedRef);

    // Fetch verse text
    const verseData = await getLocalVerseByReference(selectedRef);
    console.log('[generateQuestion] Verse data:', verseData ? 'loaded' : 'null');
    if (!verseData || !verseData.text) {
      console.error('[generateQuestion] No verse text for:', selectedRef);
      return null;
    }

    // Extract book name from reference (e.g., "John 3:16" -> "John")
    const bookMatch = selectedRef.match(/^([123]?\s*[A-Za-z]+)/);
    if (!bookMatch) return null;

    const currentBook = bookMatch[1].trim();
    const index = BIBLE_BOOKS.indexOf(currentBook);

    // Make sure book is in the middle (has before and after)
    if (index <= 0 || index >= BIBLE_BOOKS.length - 1) {
      return null;
    }

    return {
      currentBook: currentBook,
      before: BIBLE_BOOKS[index - 1],
      after: BIBLE_BOOKS[index + 1],
      verse: {
        text: verseData.text,
        reference: selectedRef
      },
      index
    };
  } catch (error) {
    console.error('Error generating question:', error);
    return null;
  }
};

const SwordDrillUltimate = ({ userLevel = 'Beginner', verseProgress = {}, getLocalVerseByReference, onComplete, onCancel }) => {
  // Round management (1, 2, 3)
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState('book-order'); // 'book-order' or 'verse-scramble'
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Round data tracking
  const [roundsData, setRoundsData] = useState([]);

  // Current round state
  const [beforeAnswer, setBeforeAnswer] = useState("");
  const [afterAnswer, setAfterAnswer] = useState("");
  const [bookOrderLocked, setBookOrderLocked] = useState(false);
  const [bookOrderCorrect, setBookOrderCorrect] = useState({ before: false, after: false });

  // Verse Scramble
  const [scrambledWords, setScrambledWords] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [revisionCount, setRevisionCount] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Timing
  const roundStartTime = useRef(Date.now());
  const bookOrderTime = useRef(0);
  const verseScrambleTime = useRef(0);

  // Results
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [finalGrade, setFinalGrade] = useState(null);

  useEffect(() => {
    const loadQuestion = async () => {
      setLoading(true);
      setLoadError(false);
      console.log('[SwordDrillUltimate] Loading question with userLevel:', userLevel);
      console.log('[SwordDrillUltimate] getLocalVerseByReference:', typeof getLocalVerseByReference);
      const q = await generateQuestion(userLevel, verseProgress, getLocalVerseByReference);
      console.log('[SwordDrillUltimate] Generated question:', q);
      if (q) {
        setQuestion(q);
        roundStartTime.current = Date.now();
        setLoadError(false);
      } else {
        console.error('[SwordDrillUltimate] Failed to generate question');
        setLoadError(true);
      }
      setLoading(false);
    };
    loadQuestion();
  }, [userLevel, verseProgress, getLocalVerseByReference]);

  const handleBookOrderSubmit = (e) => {
    e.preventDefault();
    if (bookOrderLocked) return;
    if (!beforeAnswer.trim() || !afterAnswer.trim()) return;

    const beforeCorrect = normalizeAnswer(beforeAnswer) === normalizeAnswer(question.before);
    const afterCorrect = normalizeAnswer(afterAnswer) === normalizeAnswer(question.after);

    setBookOrderCorrect({ before: beforeCorrect, after: afterCorrect });
    setBookOrderLocked(true);
    bookOrderTime.current = Date.now() - roundStartTime.current;

    // Initialize verse scramble after 1 second
    setTimeout(() => {
      const words = question.verse.text.split(' ');
      setCorrectOrder(words);
      setScrambledWords([...words].sort(() => Math.random() - 0.5));
      setUserOrder([]);
      setPhase('verse-scramble');
      roundStartTime.current = Date.now(); // Reset timer for scramble phase
    }, 1000);
  };

  const handleWordClick = (word, index) => {
    const newScrambled = scrambledWords.filter((_, i) => i !== index);
    setScrambledWords(newScrambled);
    setUserOrder([...userOrder, word]);
  };

  const handleUndo = () => {
    if (userOrder.length === 0) return;
    const lastWord = userOrder[userOrder.length - 1];
    setUserOrder(userOrder.slice(0, -1));
    setScrambledWords([...scrambledWords, lastWord]);
    setRevisionCount(prev => prev + 1);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null) return;

    const word = scrambledWords[draggedIndex];
    const newScrambled = scrambledWords.filter((_, i) => i !== draggedIndex);
    const newUserOrder = [...userOrder];
    newUserOrder.splice(targetIndex, 0, word);

    setScrambledWords(newScrambled);
    setUserOrder(newUserOrder);
    setDraggedIndex(null);
  };

  const handleVerseScrambleSubmit = () => {
    verseScrambleTime.current = Date.now() - roundStartTime.current;

    // Save round data
    const verseCorrect = userOrder.join(' ') === correctOrder.join(' ');
    const roundData = {
      round: currentRound,
      book: question.currentBook,
      bookOrderCorrect,
      verseCorrect,
      bookOrderTime: (bookOrderTime.current / 1000).toFixed(2),
      verseScrambleTime: (verseScrambleTime.current / 1000).toFixed(2),
      totalTime: ((bookOrderTime.current + verseScrambleTime.current) / 1000).toFixed(2),
      revisionCount,
      before: question.before,
      after: question.after,
      verse: question.verse
    };

    const newRoundsData = [...roundsData, roundData];
    setRoundsData(newRoundsData);

    // Check if we should move to next round or show results
    if (currentRound < 3) {
      // Move to next round
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setPhase('book-order');
      setBeforeAnswer("");
      setAfterAnswer("");
      setBookOrderLocked(false);
      setBookOrderCorrect({ before: false, after: false });
      setRevisionCount(0);

      // Generate new question
      const loadNextQuestion = async () => {
        setLoading(true);
        setLoadError(false);
        const newQuestion = await generateQuestion(userLevel, verseProgress, getLocalVerseByReference);
        if (newQuestion) {
          setQuestion(newQuestion);
          roundStartTime.current = Date.now();
          setLoadError(false);
        } else {
          setLoadError(true);
        }
        setLoading(false);
      };
      loadNextQuestion();
    } else {
      // All 3 rounds complete - calculate final grade
      calculateFinalGrade(newRoundsData);
    }
  };

  const calculateFinalGrade = (rounds) => {
    let totalScore = 0;
    let maxScore = 0;

    rounds.forEach(round => {
      // Book Order: 10 points per correct answer (20 total per round)
      const bookScore = (round.bookOrderCorrect.before ? 10 : 0) + (round.bookOrderCorrect.after ? 10 : 0);
      totalScore += bookScore;
      maxScore += 20;

      // Verse Accuracy: 20 points per round
      if (round.verseCorrect) {
        totalScore += 20;
      }
      maxScore += 20;

      // Time Bonus: 5 points per round (if under 30 seconds)
      const time = parseFloat(round.totalTime);
      if (time <= 30) {
        totalScore += 5;
      } else if (time <= 45) {
        totalScore += 3;
      } else if (time <= 60) {
        totalScore += 1;
      }
      maxScore += 5;

      // Revision Penalty: 0-5 points per round
      const revisionScore = Math.max(0, 5 - round.revisionCount);
      totalScore += revisionScore;
      maxScore += 5;
    });

    const percentage = (totalScore / maxScore) * 100;
    const grade = getGradeFromPercentage(percentage);

    setFinalGrade({ grade, percentage, totalScore, maxScore, rounds });
    setShowGradeModal(true);
  };

  const getGradeFromPercentage = (percentage) => {
    if (percentage >= 98) return 'U';  // Ultimate
    if (percentage >= 95) return 'SS'; // Super Superior
    if (percentage >= 90) return 'S';  // Superior
    if (percentage >= 80) return 'A';  // Excellent
    if (percentage >= 70) return 'B';  // Good
    return 'C';                        // Average
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'U': return 'from-yellow-300 via-amber-400 to-orange-500';
      case 'SS': return 'from-purple-400 via-pink-500 to-red-500';
      case 'S': return 'from-purple-500 via-purple-600 to-indigo-600';
      case 'A': return 'from-green-400 to-emerald-500';
      case 'B': return 'from-blue-400 to-cyan-500';
      case 'C': return 'from-orange-400 to-yellow-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getGradeTitle = (grade) => {
    switch(grade) {
      case 'U': return 'ULTIMATE MASTER';
      case 'SS': return 'SUPER SUPERIOR';
      case 'S': return 'SUPERIOR PERFORMANCE';
      case 'A': return 'EXCELLENT WORK';
      case 'B': return 'GOOD JOB';
      case 'C': return 'AVERAGE PERFORMANCE';
      default: return 'COMPLETE';
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Grade Modal
  if (showGradeModal && finalGrade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-4xl w-full border-4 border-amber-500 relative overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Animated background sparkles */}
          <div className="absolute inset-0 opacity-20">
            <Sparkles className="absolute top-4 left-4 text-amber-400 animate-pulse" size={24} />
            <Sparkles className="absolute top-4 right-4 text-amber-400 animate-pulse" style={{animationDelay: '0.5s'}} size={24} />
            <Sparkles className="absolute bottom-4 left-4 text-amber-400 animate-pulse" style={{animationDelay: '1s'}} size={24} />
            <Sparkles className="absolute bottom-4 right-4 text-amber-400 animate-pulse" style={{animationDelay: '1.5s'}} size={24} />
          </div>

          <div className="relative z-10">
            {/* Header with Grade Letter on Top Left */}
            <div className="flex items-start gap-6 mb-8">
              {/* Grade Letter - Top Left */}
              <div className={`bg-gradient-to-br ${getGradeColor(finalGrade.grade)} rounded-2xl p-8 shadow-2xl`}
                   style={{
                     animation: 'countUp 0.8s ease-out',
                     boxShadow: '0 0 40px rgba(251, 191, 36, 0.5)',
                     minWidth: '140px'
                   }}>
                <div className="text-white text-7xl font-black text-center"
                     style={{textShadow: '4px 4px 8px rgba(0,0,0,0.5)'}}>
                  {finalGrade.grade}
                </div>
              </div>

              {/* Title and Summary */}
              <div className="flex-1">
                <Trophy className="text-amber-400 mb-3" size={48} />
                <h2 className="text-3xl font-bold text-amber-400 mb-3">
                  {getGradeTitle(finalGrade.grade)}
                </h2>
                <div className="bg-slate-800 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-lg">Final Score:</span>
                    <span className="text-amber-400 text-2xl font-bold">{finalGrade.totalScore}/{finalGrade.maxScore}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-300 text-lg">Percentage:</span>
                    <span className="text-green-400 text-2xl font-bold">{finalGrade.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Round-by-Round Breakdown */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6">
              <h3 className="text-amber-400 text-xl font-bold mb-4 flex items-center gap-2">
                <Target size={24} />
                Round-by-Round Performance
              </h3>

              <div className="space-y-4">
                {finalGrade.rounds.map((round, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-bold text-lg">Round {round.round} - {round.book}</h4>
                      <div className="text-amber-400 font-bold">⏱️ {round.totalTime}s</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {/* Book Order Results */}
                      <div className="bg-slate-800 rounded p-3">
                        <div className="text-blue-300 font-semibold mb-2">Book Order</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={round.bookOrderCorrect.before ? 'text-green-400' : 'text-red-400'}>
                              {round.bookOrderCorrect.before ? '✓' : '✗'}
                            </span>
                            <span className="text-slate-300">Before: {round.before}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={round.bookOrderCorrect.after ? 'text-green-400' : 'text-red-400'}>
                              {round.bookOrderCorrect.after ? '✓' : '✗'}
                            </span>
                            <span className="text-slate-300">After: {round.after}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">Time: {round.bookOrderTime}s</div>
                        </div>
                      </div>

                      {/* Verse Scramble Results */}
                      <div className="bg-slate-800 rounded p-3">
                        <div className="text-purple-300 font-semibold mb-2">Verse Scramble</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={round.verseCorrect ? 'text-green-400 text-xl' : 'text-red-400 text-xl'}>
                              {round.verseCorrect ? '✓' : '✗'}
                            </span>
                            <span className="text-slate-300">{round.verseCorrect ? 'Perfect!' : 'Incorrect'}</span>
                          </div>
                          <div className="text-xs text-slate-400">Time: {round.verseScrambleTime}s</div>
                          <div className="text-xs text-slate-400">Revisions: {round.revisionCount}</div>
                        </div>
                      </div>
                    </div>

                    {/* Verse Reference and Text */}
                    <div className="mt-3 bg-slate-900 rounded-lg p-3 border border-slate-600">
                      <div className="text-amber-400 text-sm font-semibold mb-2">
                        {round.verse.reference}
                      </div>
                      <div className="text-slate-300 text-sm leading-relaxed">
                        "{round.verse.text}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onComplete({
                    score: finalGrade.percentage,
                    grade: finalGrade.grade,
                    type: 'sword-drill-ultimate',
                    details: finalGrade
                  });
                }}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Continue
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-4 border-amber-500 text-center">
          <Sparkles size={48} className="text-amber-400 mx-auto mb-4 animate-pulse" />
          <div className="text-white text-xl">Loading Sword Drill...</div>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (loadError || !question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-4 border-red-500 text-center">
          <X size={48} className="text-red-400 mx-auto mb-4" />
          <div className="text-white text-xl mb-4">Failed to load question</div>
          <p className="text-slate-300 mb-6">
            Unable to generate a Sword Drill question. Please check your connection or try again.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all"
            >
              Retry
            </button>
            <button
              onClick={onCancel}
              className="bg-slate-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-600 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-4 border-amber-500 relative">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                <Sword size={28} />
                Sword Drill Ultimate
              </h2>
              <div className="text-slate-300 text-sm mt-1">Round {currentRound} of 3</div>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* Round Indicator */}
          <div className="flex gap-2 mb-4">
            <div className={`flex-1 h-2 rounded-full ${currentRound >= 1 ? 'bg-amber-500' : 'bg-slate-600'}`} />
            <div className={`flex-1 h-2 rounded-full ${currentRound >= 2 ? 'bg-amber-500' : 'bg-slate-600'}`} />
            <div className={`flex-1 h-2 rounded-full ${currentRound >= 3 ? 'bg-amber-500' : 'bg-slate-600'}`} />
          </div>
        </div>

        {/* Book Order Phase */}
        {phase === 'book-order' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-8 border-2 border-amber-500/30">
              <div className="text-center mb-6">
                <div className="text-slate-300 text-sm font-semibold uppercase tracking-wide mb-3">
                  Book Order Challenge
                </div>
                <div className="text-white text-4xl font-bold mb-4">
                  {question.currentBook}
                </div>
                <div className="text-slate-300 text-lg">
                  Name the books that come <span className="text-amber-400 font-bold">before</span> and <span className="text-green-400 font-bold">after</span>
                </div>
              </div>
            </div>

            {!bookOrderLocked ? (
              <form onSubmit={handleBookOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-amber-400 font-semibold mb-2">
                    Book BEFORE {question.currentBook}:
                  </label>
                  <input
                    type="text"
                    value={beforeAnswer}
                    onChange={(e) => setBeforeAnswer(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    placeholder="Type the book name..."
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border-2 border-slate-600 focus:border-amber-500 focus:outline-none text-lg"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-green-400 font-semibold mb-2">
                    Book AFTER {question.currentBook}:
                  </label>
                  <input
                    type="text"
                    value={afterAnswer}
                    onChange={(e) => setAfterAnswer(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    placeholder="Type the book name..."
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border-2 border-slate-600 focus:border-green-500 focus:outline-none text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!beforeAnswer.trim() || !afterAnswer.trim()}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  Submit & Continue
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-white">
                <div className={`p-4 rounded-lg ${bookOrderCorrect.before ? 'bg-green-600/30 border-2 border-green-500' : 'bg-red-600/30 border-2 border-red-500'}`}>
                  <span className="font-semibold">Before: </span>
                  <span className="font-bold">{question.before}</span>
                  {!bookOrderCorrect.before && beforeAnswer && (
                    <span className="text-red-300 ml-2">(You: {beforeAnswer})</span>
                  )}
                </div>
                <div className={`p-4 rounded-lg ${bookOrderCorrect.after ? 'bg-green-600/30 border-2 border-green-500' : 'bg-red-600/30 border-2 border-red-500'}`}>
                  <span className="font-semibold">After: </span>
                  <span className="font-bold">{question.after}</span>
                  {!bookOrderCorrect.after && afterAnswer && (
                    <span className="text-red-300 ml-2">(You: {afterAnswer})</span>
                  )}
                </div>
                <div className="text-center text-amber-400 animate-pulse">
                  Preparing verse scramble...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verse Scramble Phase */}
        {phase === 'verse-scramble' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-xl p-6 border-2 border-purple-500/30">
              <div className="text-center mb-4">
                <div className="text-slate-300 text-sm font-semibold uppercase tracking-wide mb-2">
                  Verse Scramble Challenge
                </div>
                <div className="text-amber-400 font-bold text-lg mb-2">
                  {question.verse.reference}
                </div>
                <div className="text-slate-300 text-sm">
                  Arrange the words in the correct order
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-3 justify-center text-sm">
                <div className="bg-orange-500/20 px-3 py-1 rounded-lg border border-orange-500/30">
                  <Zap className="inline mr-1" size={14} />
                  <span className="text-orange-400 font-semibold">Revisions:</span>{" "}
                  <span className="text-white font-bold">{revisionCount}</span>
                </div>
              </div>
            </div>

            {/* User's Answer Area */}
            <div
              className="min-h-32 bg-slate-900/50 rounded-xl p-4 border-2 border-dashed border-purple-500/50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(userOrder.length)}
            >
              <div className="flex flex-wrap gap-2 min-h-20">
                {userOrder.length === 0 ? (
                  <div className="w-full flex items-center justify-center text-slate-500 text-sm">
                    Drag words here or click them to build the verse
                  </div>
                ) : (
                  userOrder.map((word, index) => (
                    <div
                      key={`user-${index}-${word}`}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg"
                    >
                      {word}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Scrambled Words */}
            <div className="min-h-24 bg-slate-700/30 rounded-xl p-4">
              <div className="text-slate-300 text-sm mb-2 font-semibold">Available Words:</div>
              <div className="flex flex-wrap gap-2">
                {scrambledWords.map((word, index) => (
                  <div
                    key={`scrambled-${index}-${word}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onClick={() => handleWordClick(word, index)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold cursor-move hover:bg-slate-500 transition-all transform hover:scale-105"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleUndo}
                disabled={userOrder.length === 0}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Undo
              </button>
              <button
                onClick={handleVerseScrambleSubmit}
                disabled={scrambledWords.length > 0}
                className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all transform ${
                  scrambledWords.length === 0
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:scale-105 shadow-lg'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {scrambledWords.length === 0
                  ? (currentRound === 3 ? 'Submit for Grading' : `Complete Round ${currentRound}`)
                  : `Place ${scrambledWords.length} more word(s)`
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwordDrillUltimate;
