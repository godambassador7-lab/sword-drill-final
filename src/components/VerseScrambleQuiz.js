import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Shuffle } from 'lucide-react';

const VerseScrambleQuiz = ({ verse, onComplete }) => {
  const [scrambledWords, setScrambledWords] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [incorrectPlacements, setIncorrectPlacements] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (verse) {
      const words = verse.text.split(' ');
      setCorrectOrder(words);
      setScrambledWords([...words].sort(() => Math.random() - 0.5));
      setUserOrder([]);
      setIncorrectPlacements(0);
      setShowResult(false);
      setIsCorrect(false);
      startTime.current = Date.now();
    }
  }, [verse]);

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null) return;

    const word = scrambledWords[draggedIndex];
    const newScrambled = scrambledWords.filter((_, i) => i !== draggedIndex);
    const newUserOrder = [...userOrder];
    newUserOrder.splice(targetIndex, 0, word);

    setScrambledWords(newScrambled);
    setUserOrder(newUserOrder);
    setDraggedIndex(null);

    if (newUserOrder[targetIndex] !== correctOrder[targetIndex]) {
      setIncorrectPlacements(incorrectPlacements + 1);
      if (incorrectPlacements + 1 >= 3) {
        setIsCorrect(false);
        setShowResult(true);
      }
    }
  };

  const handleWordClick = (word, index) => {
    const newScrambled = scrambledWords.filter((_, i) => i !== index);
    setScrambledWords(newScrambled);
    setUserOrder([...userOrder, word]);

    if (word !== correctOrder[userOrder.length]) {
        setIncorrectPlacements(incorrectPlacements + 1);
        if (incorrectPlacements + 1 >= 3) {
            setIsCorrect(false);
            setShowResult(true);
        }
    }
  };

  const handleUndo = () => {
    if (userOrder.length === 0) return;
    const lastWord = userOrder[userOrder.length - 1];
    setUserOrder(userOrder.slice(0, -1));
    setScrambledWords([...scrambledWords, lastWord]);
  };

  const handleSubmit = () => {
    const correct = userOrder.join(' ') === correctOrder.join(' ');
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleCompletion = () => {
    onComplete({
      score: isCorrect ? 1 : 0,
      isCorrect,
      verse,
      quizType: 'verse-scramble',
      timeTaken: (Date.now() - startTime.current) / 1000,
      userAnswer: userOrder.join(' '),
    });
  };

  if (!verse) {
    return <div>Loading...</div>;
  }

  if (showResult) {
    return (
      <div className="text-center space-y-6">
        <h2 className={`text-3xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h2>
        {incorrectPlacements >= 3 && <p className="text-red-400">You made 3 incorrect placements.</p>}
        <div className="bg-slate-800 p-6 rounded-lg">
          <p className="text-lg text-white mb-2">"{verse.text}"</p>
          <p className="text-amber-400 font-semibold">— {verse.reference}</p>
        </div>
        {!isCorrect && (
          <div className="bg-red-900/30 p-4 rounded-lg">
            <p className="text-slate-300">Your answer: <span className="font-mono text-red-300">{userOrder.join(' ')}</span></p>
            <p className="text-slate-300">Correct answer: <span className="font-mono text-green-300">{correctOrder.join(' ')}</span></p>
          </div>
        )}
        <button onClick={handleCompletion} className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg">
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-amber-400 flex items-center justify-center gap-2">
        <Shuffle size={28} />
        Verse Scramble
      </h2>
      <div className="text-center mb-4">
        <p className="text-slate-400 text-sm mt-1">Arrange the words in the correct order. 3 incorrect placements will fail the quiz.</p>
        <p className="text-red-400">Incorrect Placements: {incorrectPlacements}</p>
      </div>

      {/* User's Answer Area - Drop Zone */}
      <div
        className="min-h-32 bg-slate-900/50 rounded-xl p-4 mb-6 border-2 border-dashed border-blue-500/50"
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
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg"
              >
                {word}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Scrambled Words - Word Bank */}
      <div className="min-h-24 bg-slate-700/30 rounded-xl p-4 mb-6">
        <div className="text-slate-300 text-sm mb-2 font-semibold">Available Words:</div>
        <div className="flex flex-wrap gap-2">
          {scrambledWords.map((word, index) => (
            <div
              key={`scrambled-${index}-${word}`}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onClick={() => handleWordClick(word, index)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold cursor-move hover:bg-slate-500 transition-all transform hover:scale-105"
            >
              {word}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button onClick={handleUndo} className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg">
          Undo
        </button>
        <button
          onClick={handleSubmit}
          disabled={scrambledWords.length > 0}
          className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all transform ${
            scrambledWords.length === 0
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:scale-105'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {scrambledWords.length === 0 ? 'Submit Answer' : `Place ${scrambledWords.length} more word(s)`}
        </button>
      </div>
    </div>
  );
};

export default VerseScrambleQuiz;