import React, { useState, useEffect, useMemo } from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';

/**
 * Simple Verse Scramble Quiz Component
 * User must arrange scrambled words in correct order to reconstruct a verse
 */
const VerseScrambleQuiz = ({ verse, scramble, onComplete, onSkip, isPracticeMode = false }) => {
  const [wordBank, setWordBank] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [incorrectPlacements, setIncorrectPlacements] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [completionCalled, setCompletionCalled] = useState(false);

  // Debug logging to track renders
  console.log('[VerseScramble] Component rendered. Selected words:', selectedWords.length, 'Bank:', wordBank.length);

  // Initialize the quiz only once when component mounts
  // Use a ref to track if we've initialized for this verse
  const initializedRef = React.useRef(null);

  useEffect(() => {
    if (!verse) return;

    // Only initialize if we haven't initialized this exact verse yet
    const verseKey = `${verse.reference}-${verse.text}`;
    if (initializedRef.current === verseKey) {
      console.log('[VerseScramble] Skipping re-initialization - already initialized');
      return;
    }

    console.log('[VerseScramble] Initializing quiz for:', verse.reference);
    initializedRef.current = verseKey;

    // Filter out verse numbers (words that are purely numeric or numeric with punctuation)
    const words = verse.text
      .split(' ')
      .filter(word => {
        const trimmed = word.trim();
        return !/^\d+[.:,;]?$/.test(trimmed);
      });

    setCorrectAnswer(words);

    // Use provided scramble if available, otherwise create our own
    let wordBankToUse;
    if (scramble && Array.isArray(scramble) && scramble.length > 0) {
      wordBankToUse = scramble.map((item, idx) => ({
        id: `word-${idx}`,
        text: item.word || item.text || String(item),
      }));
    } else {
      // Create word objects with unique IDs
      const wordObjects = words.map((word, index) => ({
        id: `word-${index}`,
        text: word,
      }));
      // Shuffle for word bank
      wordBankToUse = [...wordObjects].sort(() => Math.random() - 0.5);
    }

    setWordBank(wordBankToUse);
    setSelectedWords([]);
    setIncorrectPlacements(0);
    setShowResult(false);
    setIsCorrect(false);
  }, [verse?.reference, verse?.text, scramble]); // Keep dependencies but use ref to prevent re-runs

  // Handle word selection from word bank
  const handleWordSelect = (e, wordObj) => {
    e.stopPropagation();
    const newSelected = [...selectedWords, wordObj];
    setSelectedWords(newSelected);
    setWordBank(prev => prev.filter(w => w.id !== wordObj.id));

    // Check if this placement is correct
    const currentPosition = newSelected.length - 1;
    if (wordObj.text !== correctAnswer[currentPosition]) {
      const newIncorrect = incorrectPlacements + 1;
      setIncorrectPlacements(newIncorrect);

      // Auto-fail after 3 incorrect placements
      if (newIncorrect >= 3) {
        console.log('[VerseScramble] 3 STRIKES! Auto-failing quiz');
        setIsCorrect(false);
        setShowResult(true);
      }
    }
  };

  // Handle undo last word
  const handleUndo = () => {
    if (selectedWords.length === 0) return;
    const lastWord = selectedWords[selectedWords.length - 1];
    setSelectedWords(selectedWords.slice(0, -1));
    setWordBank(prev => [...prev, lastWord]);

    // If the last placement was incorrect, reduce the incorrect counter
    const lastPosition = selectedWords.length - 1;
    if (lastWord.text !== correctAnswer[lastPosition]) {
      setIncorrectPlacements(prev => Math.max(0, prev - 1));
    }
  };

  // Handle submit answer
  const handleSubmit = () => {
    const userAnswer = selectedWords.map(w => w.text).join(' ');
    const correctText = correctAnswer.join(' ');
    const correct = userAnswer === correctText;
    setIsCorrect(correct);
    setShowResult(true);
  };

  // Reset the quiz
  const handleReset = () => {
    if (!verse) return;

    const words = verse.text
      .split(' ')
      .filter(word => {
        const trimmed = word.trim();
        return !/^\d+[.:,;]?$/.test(trimmed);
      });

    const wordObjects = words.map((word, index) => ({
      id: `word-reset-${index}`,
      text: word,
    }));

    const shuffled = [...wordObjects].sort(() => Math.random() - 0.5);

    setWordBank(shuffled);
    setSelectedWords([]);
    setIncorrectPlacements(0);
    setShowResult(false);
    setIsCorrect(false);
  };

  // Handle completion
  const handleCompletion = () => {
    console.log('[VerseScramble] handleCompletion called');
    console.log('[VerseScramble] isCorrect:', isCorrect);
    console.log('[VerseScramble] verse:', verse);
    console.log('[VerseScramble] onComplete:', onComplete);
    const timeTaken = (Date.now() - startTime) / 1000;
    const result = {
      score: isCorrect ? 1 : 0,
      isCorrect,
      verse,
      quizType: 'verse-scramble',
      timeTaken,
      userAnswer: selectedWords.map(w => w.text).join(' '),
    };
    console.log('[VerseScramble] Calling onComplete with:', result);
    setCompletionCalled(true);
    onComplete(result);
  };

  // Create set of selected IDs for quick lookup
  const selectedIds = useMemo(() => new Set(selectedWords.map(w => w.id)), [selectedWords]);
  const availableWords = wordBank.filter(w => !selectedIds.has(w.id));

  if (!verse) {
    return <div>Loading...</div>;
  }

  // Hide component after completion is called - let parent handle toasts
  if (completionCalled) {
    return null;
  }

  // Result screen
  if (showResult) {
    console.log('[VerseScramble] SHOWING RESULT SCREEN - isCorrect:', isCorrect);
    return (
      <div className="space-y-6">
        <div className={`${isCorrect ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 border-emerald-500/50' : 'bg-gradient-to-r from-red-600/20 to-red-700/20 border-red-500/50'} border rounded-xl p-6`}>
          <h2 className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </h2>
          {incorrectPlacements >= 3 && (
            <p className="text-red-400 mb-4">You made 3 incorrect placements.</p>
          )}
          <div className="bg-slate-800 p-6 rounded-lg mb-4">
            <p className="text-lg text-white mb-2">"{verse.text}"</p>
            <p className="text-amber-400 font-semibold">Reference: {verse.reference}</p>
          </div>
          {!isCorrect && (
            <div className="bg-red-900/30 p-4 rounded-lg mb-4">
              <p className="text-slate-300">
                Your answer:{' '}
                <span className="font-mono text-red-300">
                  {selectedWords.map(w => w.text).join(' ')}
                </span>
              </p>
            </div>
          )}
          <button
            onClick={() => {
              console.log('[VerseScramble] Continue button clicked!');
              handleCompletion();
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-amber-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Shuffle className="text-amber-400" size={28} />
          <div>
            <h2 className="text-xl font-bold text-amber-400">Verse Scramble</h2>
            <div className="text-sm text-slate-400">{verse.reference}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <p className="text-slate-300 text-sm">
            <strong className="text-amber-400">Instructions:</strong> Click words below in the correct order to reconstruct the verse.
            <span className="text-red-400 font-semibold"> 3 incorrect placements will fail the quiz.</span>
          </p>
          <p className="text-red-400 font-semibold mt-2">
            Incorrect Placements: {incorrectPlacements} / 3
          </p>
        </div>

        {/* User's Answer Area */}
        <div className="min-h-32 bg-slate-900/50 rounded-xl p-4 mb-6 border-2 border-dashed border-blue-500/50">
          <div className="flex flex-wrap gap-2 min-h-20 items-start">
            {selectedWords.length === 0 ? (
              <div className="w-full flex items-center justify-center text-slate-500 text-sm h-20">
                Click words below to build the verse
              </div>
            ) : (
              selectedWords.map((wordObj, idx) => {
                const isCorrectPlacement = wordObj.text === correctAnswer[idx];
                return (
                  <div
                    key={`selected-${wordObj.id}-${idx}`}
                    className={`px-4 py-2 rounded-lg font-semibold shadow-lg ${
                      isCorrectPlacement
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                    }`}
                  >
                    {wordObj.text}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Word Bank - Available Words */}
        <div className="min-h-24 bg-slate-700/30 rounded-xl p-4 mb-6">
          <div className="text-slate-300 text-sm mb-3 font-semibold">
            Available Words ({availableWords.length} remaining):
          </div>
          <div className="flex flex-wrap gap-2">
            {availableWords.length === 0 ? (
              <div className="w-full text-center text-slate-500 text-sm py-4">
                All words have been selected
              </div>
            ) : (
              availableWords.map((wordObj) => (
                <button
                  key={wordObj.id}
                  type="button"
                  onClick={(e) => handleWordSelect(e, wordObj)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-slate-500 transition-all transform hover:scale-105 active:scale-95 select-none"
                >
                  {wordObj.text}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-all"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleUndo}
            disabled={selectedWords.length === 0}
            className="px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo Last Word
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-lg transition-all transform bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:scale-105 active:scale-95 cursor-pointer"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerseScrambleQuiz;
