import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Clock, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getRandomReferenceByDifficulty } from '../data/versesByDifficulty';
import { BIBLE_BOOKS } from '../data/bibleBooks';

/**
 * Sword Drill Ultimate - The most challenging quiz mode
 * Combines book order knowledge with verse scrambling under time pressure
 */
const SwordDrillUltimate = ({ difficulty = 'Beginner', onComplete, onCancel }) => {
  // Quiz stages: 'intro' | 'book-order' | 'scramble' | 'results'
  const [stage, setStage] = useState('intro');
  const [verseData, setVerseData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Stage 1: Book Order
  const [bookBefore, setBookBefore] = useState('');
  const [bookAfter, setBookAfter] = useState('');
  const [bookOrderComplete, setBookOrderComplete] = useState(false);
  const [bookBeforeAccuracy, setBookBeforeAccuracy] = useState(100);
  const [bookAfterAccuracy, setBookAfterAccuracy] = useState(100);

  // Stage 2: Scramble
  const [scrambledWords, setScrambledWords] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [incorrectPlacements, setIncorrectPlacements] = useState(0);

  // Results
  const [finalGrade, setFinalGrade] = useState(null);

  // Time limits based on difficulty (in seconds)
  const timeByDifficulty = {
    'Beginner': 180, // 3 minutes
    'Intermediate': 120, // 2 minutes
    'Advanced': 90 // 1.5 minutes
  };

  // Fuzzy matching for book names
  const fuzzyMatchBook = (input, target) => {
    const normalize = (str) => str.toLowerCase().replace(/\s+/g, '').replace(/\d+/g, '');
    const inputNorm = normalize(input);
    const targetNorm = normalize(target);

    if (inputNorm === targetNorm) return 100; // Perfect match

    // Levenshtein distance for fuzzy matching
    const distance = levenshteinDistance(inputNorm, targetNorm);
    const maxLen = Math.max(inputNorm.length, targetNorm.length);
    const accuracy = Math.max(0, 100 - (distance / maxLen) * 100);

    return accuracy;
  };

  // Calculate Levenshtein distance
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  // Initialize quiz
  const startQuiz = useCallback(async () => {
    const verse = await getRandomReferenceByDifficulty(difficulty);
    if (!verse) {
      alert('Unable to load verse. Please try again.');
      return;
    }

    setVerseData(verse);
    setStage('book-order');
    setTimeRemaining(timeByDifficulty[difficulty]);
    setTimerActive(true);
  }, [difficulty, timeByDifficulty]);

  // Timer countdown
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            if (stage === 'scramble' || stage === 'book-order') {
              calculateFinalGrade();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timeRemaining, stage]);

  // Handle book order submission
  const handleBookOrderSubmit = () => {
    if (!verseData) return;

    const bookIndex = bibleBooks.findIndex(b => b === verseData.book);
    const correctBefore = bookIndex > 0 ? bibleBooks[bookIndex - 1] : '';
    const correctAfter = bookIndex < bibleBooks.length - 1 ? bibleBooks[bookIndex + 1] : '';

    const beforeAccuracy = correctBefore ? fuzzyMatchBook(bookBefore, correctBefore) : 0;
    const afterAccuracy = correctAfter ? fuzzyMatchBook(bookAfter, correctAfter) : 0;

    setBookBeforeAccuracy(beforeAccuracy);
    setBookAfterAccuracy(afterAccuracy);

    // Require at least 70% accuracy to proceed
    if (beforeAccuracy >= 70 && afterAccuracy >= 70) {
      setBookOrderComplete(true);
      // Scramble the verse
      const words = verseData.text.split(/\s+/);
      const scrambled = [...words].sort(() => Math.random() - 0.5);
      setScrambledWords(scrambled);
      setUserSequence([]);
      setStage('scramble');
    } else {
      alert('Not quite right! Check your spelling and try again.');
    }
  };

  // Handle word drag
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null) return;

    const newSequence = [...userSequence];
    const draggedWord = scrambledWords[draggedIndex];

    // Check if this placement is correct
    const correctWords = verseData.text.split(/\s+/);
    if (correctWords[targetIndex] !== draggedWord) {
      // Deduct time for incorrect placement
      const penalty = difficulty === 'Advanced' ? 3 : difficulty === 'Intermediate' ? 2 : 1;
      setTimeRemaining(prev => Math.max(0, prev - penalty));
      setIncorrectPlacements(prev => prev + 1);
    }

    newSequence[targetIndex] = draggedWord;
    setUserSequence(newSequence);
    setDraggedIndex(null);
  };

  // Handle word click for mobile
  const handleWordClick = (word) => {
    if (userSequence.length < verseData.text.split(/\s+/).length) {
      const newSequence = [...userSequence, word];
      setUserSequence(newSequence);

      // Check if this placement is correct
      const correctWords = verseData.text.split(/\s+/);
      const index = newSequence.length - 1;
      if (correctWords[index] !== word) {
        const penalty = difficulty === 'Advanced' ? 3 : difficulty === 'Intermediate' ? 2 : 1;
        setTimeRemaining(prev => Math.max(0, prev - penalty));
        setIncorrectPlacements(prev => prev + 1);
      }
    }
  };

  // Calculate final grade
  const calculateFinalGrade = useCallback(() => {
    if (!verseData) return;

    const totalTime = timeByDifficulty[difficulty];
    const timeScore = (timeRemaining / totalTime) * 100;

    // Calculate scramble accuracy
    const correctWords = verseData.text.split(/\s+/);
    const correctCount = userSequence.filter((word, i) => word === correctWords[i]).length;
    const scrambleAccuracy = (correctCount / correctWords.length) * 100;

    // Average book order accuracy
    const bookOrderScore = (bookBeforeAccuracy + bookAfterAccuracy) / 2;

    // Penalty for incorrect placements
    const placementPenalty = Math.min(incorrectPlacements * 5, 30);

    // Final score calculation
    const finalScore = (
      timeScore * 0.3 +
      scrambleAccuracy * 0.4 +
      bookOrderScore * 0.3 -
      placementPenalty
    );

    // Determine rank
    let rank = 'D';
    if (finalScore >= 95) rank = 'U'; // Ultimate
    else if (finalScore >= 85) rank = 'S'; // Super
    else if (finalScore >= 75) rank = 'A';
    else if (finalScore >= 60) rank = 'B';
    else if (finalScore >= 45) rank = 'C';

    setFinalGrade({
      rank,
      score: Math.round(finalScore),
      timeScore: Math.round(timeScore),
      scrambleAccuracy: Math.round(scrambleAccuracy),
      bookOrderScore: Math.round(bookOrderScore),
      incorrectPlacements
    });

    setStage('results');
    setTimerActive(false);

    // Notify parent
    if (onComplete) {
      onComplete({
        rank,
        score: Math.round(finalScore),
        reference: verseData.reference
      });
    }
  }, [verseData, timeRemaining, userSequence, bookBeforeAccuracy, bookAfterAccuracy, incorrectPlacements, difficulty, timeByDifficulty, onComplete]);

  // Handle scramble submit
  const handleScrambleSubmit = () => {
    calculateFinalGrade();
  };

  // Rank colors
  const rankColors = {
    'U': 'from-purple-500 to-pink-500',
    'S': 'from-yellow-400 to-amber-500',
    'A': 'from-green-500 to-emerald-500',
    'B': 'from-blue-500 to-cyan-500',
    'C': 'from-orange-500 to-red-500',
    'D': 'from-gray-500 to-slate-600'
  };

  // Render intro screen
  if (stage === 'intro') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Trophy size={64} className="text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Sword Drill Ultimate</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            The ultimate Bible knowledge challenge! First, identify the books before and after your target verse.
            Then, unscramble the entire verse under time pressure. Speed and accuracy determine your rank!
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-yellow-400 font-bold">Stage 1</div>
              <div className="text-slate-400">Book Order</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-blue-400 font-bold">Stage 2</div>
              <div className="text-slate-400">Verse Scramble</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-purple-400 font-bold">Results</div>
              <div className="text-slate-400">Rank & Score</div>
            </div>
          </div>
          <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-amber-300 mb-2">
              <Clock size={18} />
              <span className="font-semibold">Time Limit: {Math.floor(timeByDifficulty[difficulty] / 60)}:{(timeByDifficulty[difficulty] % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="text-xs text-amber-200">
              Difficulty: <span className="font-bold">{difficulty}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={startQuiz}
            className="relative btn bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold px-8 py-3 overflow-hidden"
            style={{
              animation: 'shimmer 2s infinite'
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Zap size={20} />
              Start Ultimate Challenge
            </span>
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                animation: 'beam 3s infinite'
              }}
            />
          </button>
        </div>

        <style>{`
          @keyframes shimmer {
            0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
            50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.8); }
          }
          @keyframes beam {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  // Render book order stage
  if (stage === 'book-order') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy size={24} className="text-yellow-400" />
            Stage 1: Book Order
          </h3>
          <div className="flex items-center gap-2 text-lg font-bold text-amber-300">
            <Clock size={20} />
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-200 mb-2">Find the verse:</p>
          <h2 className="text-3xl font-bold text-white">{verseData?.reference}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">What book comes BEFORE {verseData?.book}?</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter book name..."
              value={bookBefore}
              onChange={(e) => setBookBefore(e.target.value)}
              disabled={bookOrderComplete}
            />
          </div>

          <div>
            <label className="label">What book comes AFTER {verseData?.book}?</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter book name..."
              value={bookAfter}
              onChange={(e) => setBookAfter(e.target.value)}
              disabled={bookOrderComplete}
            />
          </div>
        </div>

        <button
          onClick={handleBookOrderSubmit}
          disabled={!bookBefore.trim() || !bookAfter.trim() || bookOrderComplete}
          className="btn w-full flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={20} />
          Submit Book Order
        </button>
      </div>
    );
  }

  // Render scramble stage
  if (stage === 'scramble') {
    const correctWords = verseData.text.split(/\s+/);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap size={24} className="text-blue-400" />
            Stage 2: Unscramble the Verse
          </h3>
          <div className="flex items-center gap-2 text-lg font-bold text-amber-300">
            <Clock size={20} />
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Stage 1 Complete (Greyed Out) */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 opacity-50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-slate-400">Stage 1 Complete</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>Before: {bookBefore} ({Math.round(bookBeforeAccuracy)}%)</div>
            <div>After: {bookAfter} ({Math.round(bookAfterAccuracy)}%)</div>
          </div>
        </div>

        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-purple-200">Reference:</p>
          <h3 className="text-xl font-bold text-white">{verseData?.reference}</h3>
        </div>

        {/* User's answer area */}
        <div className="bg-slate-800/50 rounded-lg p-4 min-h-32 border-2 border-dashed border-slate-600">
          <p className="text-xs text-slate-400 mb-2">Drop words here or click them in order:</p>
          <div className="flex flex-wrap gap-2">
            {correctWords.map((_, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded ${
                  userSequence[index]
                    ? userSequence[index] === correctWords[index]
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-400'
                } min-w-16 text-center text-sm`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {userSequence[index] || '___'}
              </div>
            ))}
          </div>
        </div>

        {/* Scrambled words */}
        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Available words:</p>
          <div className="flex flex-wrap gap-2">
            {scrambledWords.map((word, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onClick={() => handleWordClick(word)}
                className={`px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-sm transition ${
                  userSequence.includes(word) ? 'opacity-30' : ''
                }`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setUserSequence([])} className="btn btn-secondary flex-1">
            Reset
          </button>
          <button
            onClick={handleScrambleSubmit}
            className="btn flex-1 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} />
            Submit Answer
          </button>
        </div>
      </div>
    );
  }

  // Render results
  if (stage === 'results' && finalGrade) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Challenge Complete!</h2>

          {/* Rank Display */}
          <div className={`inline-block p-8 rounded-2xl bg-gradient-to-br ${rankColors[finalGrade.rank]} shadow-2xl`}>
            <div className="text-9xl font-black text-white drop-shadow-lg">
              {finalGrade.rank}
            </div>
            <div className="text-lg font-semibold text-white mt-2">
              {finalGrade.rank === 'U' && 'ULTIMATE'}
              {finalGrade.rank === 'S' && 'SUPER'}
              {finalGrade.rank === 'A' && 'EXCELLENT'}
              {finalGrade.rank === 'B' && 'GOOD'}
              {finalGrade.rank === 'C' && 'FAIR'}
              {finalGrade.rank === 'D' && 'NEEDS IMPROVEMENT'}
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-slate-800/50 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-bold text-white mb-4">Score Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Final Score:</span>
                <span className="text-white font-bold">{finalGrade.score}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Bonus:</span>
                <span className="text-amber-300">{finalGrade.timeScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scramble Accuracy:</span>
                <span className="text-blue-300">{finalGrade.scrambleAccuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Book Order:</span>
                <span className="text-green-300">{finalGrade.bookOrderScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Incorrect Placements:</span>
                <span className="text-red-300">-{finalGrade.incorrectPlacements * 5}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="btn btn-secondary">
            Close
          </button>
          <button onClick={() => {
            setStage('intro');
            setFinalGrade(null);
            setBookBefore('');
            setBookAfter('');
            setUserSequence([]);
            setIncorrectPlacements(0);
          }} className="btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SwordDrillUltimate;
