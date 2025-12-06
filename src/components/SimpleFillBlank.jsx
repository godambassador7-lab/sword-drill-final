import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Simple Fill in the Blank Quiz for Practice Mode
 * Just text inputs - no drag and drop complexity
 */
const SimpleFillBlank = ({ verse, reference, onComplete, onSkip }) => {
  // Parse the verse and create blanks (remove every 5th word or key words)
  const [blanks, setBlanks] = useState(() => {
    const words = verse.split(' ');
    const blankedWords = [];
    const answers = [];

    words.forEach((word, idx) => {
      // Remove every 5th word or words longer than 5 characters
      if ((idx + 1) % 5 === 0 || word.length > 6) {
        blankedWords.push('___');
        answers.push({ answer: word.replace(/[.,!?;:'"]/g, ''), userInput: '' });
      } else {
        blankedWords.push(word);
      }
    });

    return { blankedWords, answers };
  });

  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleInputChange = (index, value) => {
    const newAnswers = [...blanks.answers];
    newAnswers[index].userInput = value;
    setBlanks({ ...blanks, answers: newAnswers });
  };

  const handleSubmit = () => {
    // Check if all answers are correct (case-insensitive, allow for punctuation differences)
    const allCorrect = blanks.answers.every(({ answer, userInput }) => {
      const cleanAnswer = answer.toLowerCase().replace(/[.,!?;:'"]/g, '');
      const cleanInput = userInput.toLowerCase().replace(/[.,!?;:'"]/g, '');
      return cleanAnswer === cleanInput || cleanAnswer.includes(cleanInput) || cleanInput.includes(cleanAnswer);
    });

    setIsCorrect(allCorrect);
    setShowResult(true);

    setTimeout(() => {
      onComplete({ success: allCorrect });
    }, 2000);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full border border-slate-700">
          {isCorrect ? (
            <>
              <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-green-300 text-center mb-4">Excellent!</h2>
              <p className="text-slate-300 text-center">You filled in all the blanks correctly!</p>
            </>
          ) : (
            <>
              <AlertCircle className="text-amber-400 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-amber-300 text-center mb-4">Good Try!</h2>
              <p className="text-slate-300 text-center mb-4">Here's what you learned:</p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-white italic">"{verse}"</p>
                <p className="text-slate-400 text-sm mt-2">- {reference}</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  let blankCounter = 0;

  return (
    <div className="min-h-screen bg-slate-900 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-amber-400">Fill in the Blank</h2>
              <p className="text-slate-400 text-sm">{reference}</p>
            </div>
            <button
              onClick={onSkip}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="text-slate-400" size={24} />
            </button>
          </div>

          <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
            <p className="text-blue-200 text-sm">
              Practice Mode: Type the missing words to complete the verse. No points affected.
            </p>
          </div>
        </div>

        {/* Verse with blanks */}
        <div className="bg-slate-800 rounded-xl p-8 mb-6 border border-slate-700">
          <div className="text-lg leading-relaxed text-white">
            {blanks.blankedWords.map((word, idx) => {
              if (word === '___') {
                const currentBlank = blankCounter;
                blankCounter++;
                return (
                  <span key={idx} className="inline-block mx-1 my-1">
                    <input
                      type="text"
                      value={blanks.answers[currentBlank]?.userInput || ''}
                      onChange={(e) => handleInputChange(currentBlank, e.target.value)}
                      onFocus={() => setCurrentBlankIndex(currentBlank)}
                      placeholder="___"
                      className="px-3 py-1 rounded bg-slate-700 border border-slate-600 focus:border-amber-500 focus:outline-none text-white text-center min-w-[80px]"
                      autoComplete="off"
                    />
                  </span>
                );
              }
              return <span key={idx}>{word} </span>;
            })}
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={blanks.answers.some(a => !a.userInput)}
          className="w-full px-6 py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all"
        >
          {blanks.answers.some(a => !a.userInput) ? 'Fill in all blanks to continue' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};

export default SimpleFillBlank;
