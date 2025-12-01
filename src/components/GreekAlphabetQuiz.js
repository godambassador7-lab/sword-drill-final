import React, { useState, useEffect } from 'react';
import { greekAlphabet } from '../data/koineGreekComprehensive';
import { X, CheckCircle, XCircle } from 'lucide-react';
import CorrectToast from './CorrectToast';

/**
 * Greek Alphabet Quiz - Tests knowledge of Greek letters
 * Quiz Types: Letter Recognition, Name Matching, Pronunciation
 */
const GreekAlphabetQuiz = ({ onComplete, onCancel, quizType = 'recognition' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCorrectToast, setShowCorrectToast] = useState(false);

  const totalQuestions = 10;

  // Generate quiz questions based on type
  useEffect(() => {
    generateQuestions();
  }, [quizType]);

  const generateQuestions = () => {
    const shuffled = [...greekAlphabet].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, totalQuestions);

    const quizQuestions = selected.map((letter) => {
      if (quizType === 'recognition') {
        // Show Greek letter, ask for name
        return {
          question: `What is the name of this letter: ${letter.letter}?`,
          correctAnswer: letter.name,
          options: generateOptions(letter.name, 'name'),
          type: 'recognition'
        };
      } else if (quizType === 'writing') {
        // Show name, ask for Greek letter
        return {
          question: `Which letter is ${letter.name}?`,
          correctAnswer: letter.letter,
          options: generateOptions(letter.letter, 'letter'),
          type: 'writing'
        };
      } else if (quizType === 'pronunciation') {
        // Show Greek letter, ask for pronunciation
        return {
          question: `What is the pronunciation of ${letter.letter} (${letter.name})?`,
          correctAnswer: letter.pronunciation,
          options: generateOptions(letter.pronunciation, 'pronunciation'),
          type: 'pronunciation'
        };
      }
      return null;
    });

    setQuestions(quizQuestions);
  };

  const generateOptions = (correctAnswer, type) => {
    const allOptions = greekAlphabet.map(l => l[type]);
    const wrongOptions = allOptions
      .filter(opt => opt !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
    return options;
  };

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
      setShowCorrectToast(true);
      setTimeout(() => setShowCorrectToast(false), 1300);
    }

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Quiz complete
        onComplete({
          score,
          totalQuestions,
          percentage: Math.round((score / totalQuestions) * 100),
          quizType
        });
      }
    }, 1500);
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <CorrectToast points={10} show={showCorrectToast} />
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-blue-500/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-300">Greek Alphabet Quiz</h2>
            <p className="text-slate-400 text-sm capitalize">{quizType} Mode</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span>Score: {score}/{currentQuestion + (showFeedback && isCorrect ? 1 : 0)}</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
          <p className="text-2xl text-center text-white font-semibold">
            {currentQ.question}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentQ.correctAnswer;

            let buttonClass = "p-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ";

            if (showFeedback) {
              if (isCorrectAnswer) {
                buttonClass += "bg-green-600 text-white border-2 border-green-400";
              } else if (isSelected && !isCorrectAnswer) {
                buttonClass += "bg-red-600 text-white border-2 border-red-400";
              } else {
                buttonClass += "bg-slate-700 text-slate-400 cursor-not-allowed";
              }
            } else {
              buttonClass += "bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600 hover:border-blue-500";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{option}</span>
                  {showFeedback && isCorrectAnswer && <CheckCircle size={20} />}
                  {showFeedback && isSelected && !isCorrectAnswer && <XCircle size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center p-4 rounded-xl ${isCorrect ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}>
            <p className="font-semibold text-lg">
              {isCorrect ? '✓ Correct!' : `✗ Incorrect. The answer is ${currentQ.correctAnswer}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreekAlphabetQuiz;
