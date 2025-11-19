import React, { useState, useEffect } from 'react';
import { nounDeclensions } from '../data/koineGreekComprehensive';
import { X, CheckCircle, XCircle, BookOpen } from 'lucide-react';

/**
 * Greek Noun Declension Quiz - Tests 1st and 2nd declension patterns
 */
const GreekNounDeclensionQuiz = ({ onComplete, onCancel }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const totalQuestions = 12;

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const quizQuestions = [];
    const declensions = Object.values(nounDeclensions);

    for (let i = 0; i < totalQuestions; i++) {
      const declension = declensions[Math.floor(Math.random() * declensions.length)];
      const number = Math.random() > 0.5 ? 'singular' : 'plural';
      const cases = ['nominative', 'genitive', 'dative', 'accusative', 'vocative'];
      const randomCase = cases[Math.floor(Math.random() * cases.length)];

      const questionType = Math.random() > 0.5 ? 'ending' : 'function';

      if (questionType === 'ending') {
        // Ask for the ending
        const correctForm = declension.pattern[number][randomCase];
        const question = `What is the ${randomCase} ${number} ending for ${declension.name}?`;
        const correctAnswer = correctForm.ending;

        // Generate wrong answers from other forms
        const allEndings = [];
        ['singular', 'plural'].forEach(num => {
          cases.forEach(cas => {
            const ending = declension.pattern[num][cas].ending;
            if (ending !== correctAnswer) {
              allEndings.push(ending);
            }
          });
        });

        const wrongAnswers = [...new Set(allEndings)]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

        quizQuestions.push({
          question,
          correctAnswer,
          options,
          type: 'ending',
          declension: declension.name,
          case: randomCase,
          number,
          example: correctForm.example
        });
      } else {
        // Ask for the function
        const correctForm = declension.pattern[number][randomCase];
        const question = `What is the function of the ${randomCase} case?`;
        const correctAnswer = correctForm.function;

        // Generate wrong answers
        const allFunctions = [];
        ['singular', 'plural'].forEach(num => {
          cases.forEach(cas => {
            const func = declension.pattern[num][cas].function;
            if (func !== correctAnswer) {
              allFunctions.push(func);
            }
          });
        });

        const wrongAnswers = [...new Set(allFunctions)]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

        quizQuestions.push({
          question,
          correctAnswer,
          options,
          type: 'function',
          declension: declension.name,
          case: randomCase,
          number,
          example: correctForm.example
        });
      }
    }

    setQuestions(quizQuestions);
  };

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 100);
    }

    setTimeout(() => {
      advanceQuestion();
    }, 1500);
  };

  const advanceQuestion = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete
      const percentage = Math.round((score / (totalQuestions * 100)) * 100);
      onComplete({
        score,
        totalQuestions,
        correctAnswers: score / 100,
        percentage,
        quizType: 'noun-declension-quiz'
      });
    }
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-emerald-500/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-emerald-300 flex items-center gap-2">
              <BookOpen size={28} />
              Noun Declension Quiz
            </h2>
            <p className="text-slate-400 text-sm">1st & 2nd Declension Patterns</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Question</div>
            <div className="text-emerald-300 text-xl font-bold">
              {currentQuestion + 1}/{totalQuestions}
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Score</div>
            <div className="text-teal-300 text-xl font-bold">{score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-8 mb-6">
          <div className="text-emerald-100 text-sm mb-2 uppercase tracking-wide">
            {currentQ.declension}
          </div>
          <div className="text-white text-2xl font-bold mb-3">{currentQ.question}</div>
          {currentQ.example && (
            <div className="text-emerald-200 text-lg">
              Example: {currentQ.example}
            </div>
          )}
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
              } else if (isSelected) {
                buttonClass += "bg-red-600 text-white border-2 border-red-400";
              } else {
                buttonClass += "bg-slate-700 text-slate-400 cursor-not-allowed";
              }
            } else {
              buttonClass += "bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600 hover:border-emerald-500";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center justify-center gap-2">
                  {option}
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
            {isCorrect ? (
              <p className="font-semibold text-lg">
                Correct! +100 points
              </p>
            ) : (
              <div>
                <p className="font-semibold text-lg mb-2">Incorrect</p>
                <p className="text-sm">
                  The {currentQ.case} {currentQ.number} {currentQ.type === 'ending' ? 'ending' : 'function'} is: <span className="font-bold">{currentQ.correctAnswer}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GreekNounDeclensionQuiz;
