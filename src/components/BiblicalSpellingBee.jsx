import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Clock, Trophy, Zap, Check, AlertCircle } from 'lucide-react';
import CorrectToast from './CorrectToast';
import StableInput from './StableInput';

// Load words from Smith's Bible Dictionary
let SMITHS_WORDS = [];

// Fetch Smith's dictionary on module load
const smithsUrl = `${process.env.PUBLIC_URL || ''}/dictionaries/smiths.json`;
fetch(smithsUrl)
  .then(res => {
    // If we somehow got HTML (e.g., index.html), treat as failure and fallback
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Unexpected content-type for smiths.json: ${contentType}`);
    }
    return res.json();
  })
  .then(data => {
    // Convert Smith's entries to spelling bee format
    SMITHS_WORDS = Object.values(data).map(entry => {
      const word = entry.headword.toLowerCase();
      // Extract first sentence of definition as hint
      const defSentences = entry.def.split('.');
      const hint = defSentences[0]?.substring(0, 100) || 'Biblical term';

      // Determine difficulty based on word length
      let difficulty = 'easy';
      if (word.length >= 10) difficulty = 'hard';
      else if (word.length >= 7) difficulty = 'medium';

      return { word, hint, difficulty };
    }).filter(w => {
      // Only include valid words (letters only, reasonable length)
      return /^[a-z]+$/.test(w.word) && w.word.length >= 4 && w.word.length <= 20;
    });
  })
  .catch(err => {
    console.warn('Falling back to built-in spelling bee word list:', err);
    // Fallback to basic biblical words if dictionary fails to load
    SMITHS_WORDS = [
      { word: 'faith', hint: 'Belief and trust in God', difficulty: 'easy' },
      { word: 'grace', hint: 'Unmerited favor from God', difficulty: 'easy' },
      { word: 'mercy', hint: 'Compassion and forgiveness', difficulty: 'easy' },
      { word: 'blessing', hint: 'Divine favor or gift', difficulty: 'medium' },
      { word: 'covenant', hint: 'Sacred agreement with God', difficulty: 'medium' },
      { word: 'resurrection', hint: 'Rising from the dead', difficulty: 'hard' },
    ];
  });

// Scramble a word
const scrambleWord = (word) => {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  // Ensure it's actually scrambled (not the same as original)
  const scrambled = letters.join('');
  return scrambled === word && word.length > 1 ? scrambleWord(word) : scrambled;
};

const MAX_POINTS_PER_WORD = 10;
const HINT_PENALTY = 2;

const BiblicalSpellingBee = ({ onComplete, onCancel }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const userAnswerRef = useRef(''); // Using ref instead of state to prevent re-renders
  const [scrambled, setScrambled] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [totalQuestions] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [showCorrectToast, setShowCorrectToast] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Initialize words
  useEffect(() => {
    // Wait for Smith's dictionary to load
    const checkAndLoadWords = () => {
      if (SMITHS_WORDS.length > 0) {
        const shuffled = [...SMITHS_WORDS].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, totalQuestions);
        setWords(selected);
      } else {
        // Retry after a short delay if dictionary not loaded yet
        setTimeout(checkAndLoadWords, 100);
      }
    };
    checkAndLoadWords();
  }, [totalQuestions]);

  // Set up current word
  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length) {
      const currentWord = words[currentWordIndex];
      setScrambled(scrambleWord(currentWord.word));
      userAnswerRef.current = ''; // Reset ref instead of state
      setShowHint(false);
      setFeedback(null);
    }
  }, [currentWordIndex, words]);

  // Timer
  useEffect(() => {
    if (gameOver || feedback) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameOver, feedback]);

  const handleTimeout = () => {
    setFeedback('incorrect');
    setStreak(0);

    setTimeout(() => {
      if (currentWordIndex + 1 >= totalQuestions) {
        endGame();
      } else {
        setCurrentWordIndex((prev) => prev + 1);
        setTimeLeft(60);
      }
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback || gameOver) return;

    const currentWord = words[currentWordIndex];
    const isCorrect = userAnswerRef.current.toLowerCase().trim() === currentWord.word.toLowerCase();

    if (isCorrect) {
      // Flat scoring capped at 10 points per correct word, with a small hint penalty
      const pointsEarned = Math.max(0, Math.min(
        MAX_POINTS_PER_WORD,
        MAX_POINTS_PER_WORD - (showHint ? HINT_PENALTY : 0)
      ));

      setScore((prev) => prev + pointsEarned);
      setFeedback('correct');
      setEarnedPoints(pointsEarned);
      setShowCorrectToast(true);

      setTimeout(() => setShowCorrectToast(false), 2300);

      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((best) => Math.max(best, newStreak));
        return newStreak;
      });

      setTimeout(() => {
        if (currentWordIndex + 1 >= totalQuestions) {
          endGame();
        } else {
          setCurrentWordIndex((prev) => prev + 1);
          setTimeLeft(60);
        }
      }, 2300);
    } else {
      setFeedback('incorrect');
      setStreak(0);

      setTimeout(() => {
        if (currentWordIndex + 1 >= totalQuestions) {
          endGame();
        } else {
          setCurrentWordIndex((prev) => prev + 1);
          setTimeLeft(60);
        }
      }, 2000);
    }
  };

  const handleShowHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setFeedback('skipped');
    setStreak(0);

    setTimeout(() => {
      if (currentWordIndex + 1 >= totalQuestions) {
        endGame();
      } else {
        setCurrentWordIndex((prev) => prev + 1);
        setTimeLeft(60);
      }
    }, 1000);
  };

  const endGame = () => {
    setGameOver(true);
    onComplete({
      score,
      questionsAnswered: totalQuestions,
      bestStreak,
      hintsUsed,
      type: 'spelling-bee'
    });
  };

  if (!words.length || currentWordIndex >= words.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (gameOver) {
    const maxPossibleScore = totalQuestions * MAX_POINTS_PER_WORD;
    const accuracy = maxPossibleScore ? Math.round((score / maxPossibleScore) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-purple-500">
          <div className="text-center mb-6">
            <Trophy className="mx-auto text-amber-400 mb-4" size={64} />
            <h2 className="text-3xl font-bold text-white mb-2">
              Spelling Bee Complete!
            </h2>
            <p className="text-slate-300">Great job with biblical vocabulary!</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-center">
              <div className="text-white text-sm font-semibold uppercase tracking-wide mb-1">
                Final Score
              </div>
              <div className="text-white text-5xl font-bold">{score}</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600">
                <div className="text-slate-400 text-xs font-semibold mb-1">
                  Efficiency
                </div>
                <div className="text-white text-2xl font-bold">
                  {accuracy}%
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600">
                <div className="text-slate-400 text-xs font-semibold mb-1">
                  Best Streak
                </div>
                <div className="text-white text-2xl font-bold">
                  {bestStreak}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600">
                <div className="text-slate-400 text-xs font-semibold mb-1">
                  Hints Used
                </div>
                <div className="text-white text-2xl font-bold">
                  {hintsUsed}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Play Again
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const progressPercent = ((currentWordIndex + 1) / totalQuestions) * 100;
  const timePercent = (timeLeft / 60) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <CorrectToast points={earnedPoints} show={showCorrectToast} />
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-purple-500">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🐝 Biblical Spelling Bee
            </h2>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-3 text-sm mb-4">
            <div className="bg-amber-500/20 px-4 py-2 rounded-lg border border-amber-500/30">
              <span className="text-amber-400 font-semibold">Score:</span>{" "}
              <span className="text-white font-bold">{score}</span>
            </div>
            <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
              <Zap className="inline mr-1" size={16} />
              <span className="text-green-400 font-semibold">Streak:</span>{" "}
              <span className="text-white font-bold">{streak}</span>
            </div>
            <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
              <span className="text-purple-400 font-semibold">Word:</span>{" "}
              <span className="text-white font-bold">
                {currentWordIndex + 1}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <Clock size={20} />
              Time Left:
            </span>
            <span
              className={`text-3xl font-bold ${
                timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-green-400"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 10
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : "bg-gradient-to-r from-green-500 to-blue-500"
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        </div>

        {/* Scrambled Word */}
        <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-xl p-8 mb-6 border-2 border-purple-500/30">
          <div className="text-center mb-4">
            <div className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-3">
              Unscramble this word:
            </div>
            <div className="text-white text-5xl font-bold tracking-widest mb-4">
              {scrambled.toUpperCase()}
            </div>
            <div className="text-slate-500 text-sm">
              ({currentWord.word.length} letters)
            </div>
          </div>

          {showHint && (
            <div className="mt-4 p-4 bg-amber-500/20 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-1">
                <AlertCircle size={16} />
                Hint:
              </div>
              <p className="text-slate-200">{currentWord.hint}</p>
            </div>
          )}
        </div>

        {/* Answer Form */}
        {!feedback ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Your Answer:
              </label>
              <StableInput
                defaultValue=""
                onChange={(value) => { userAnswerRef.current = value; }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
                placeholder="Type the unscrambled word..."
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border-2 border-slate-600 focus:border-purple-500 focus:outline-none text-lg"
                autoFocus
                autoComplete="off"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleShowHint}
                disabled={showHint}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Hint (-2 pts)
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200"
              >
                Skip
              </button>
            </div>
          </form>
        ) : (
          <div className={`rounded-xl p-6 border-2 ${
            feedback === 'correct' ? 'bg-green-500/20 border-green-500' :
            feedback === 'skipped' ? 'bg-slate-500/20 border-slate-500' :
            'bg-red-500/20 border-red-500'
          }`}>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                feedback === 'correct' ? 'text-green-400' :
                feedback === 'skipped' ? 'text-slate-400' :
                'text-red-400'
              }`}>
                {feedback === 'correct' ? '✓ Correct!' :
                 feedback === 'skipped' ? 'Skipped' :
                 '✗ Incorrect'}
              </div>
              <div className="text-white text-2xl font-semibold">
                {currentWord.word.toUpperCase()}
              </div>
              <p className="text-slate-300 mt-2">{currentWord.hint}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiblicalSpellingBee;
