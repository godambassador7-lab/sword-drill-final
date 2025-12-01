import React, { useState, useEffect } from 'react';
import { caseFunctions, nounDeclensions } from '../data/koineGreekComprehensive';
import { X, CheckCircle, XCircle, Target } from 'lucide-react';
import CorrectToast from './CorrectToast';

/**
 * Greek Case Quiz - Tests case identification and function understanding
 */
const GreekCaseQuiz = ({ onComplete, onCancel }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCorrectToast, setShowCorrectToast] = useState(false);

  const totalQuestions = 15;

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const quizQuestions = [];
    const cases = Object.keys(caseFunctions);

    for (let i = 0; i < totalQuestions; i++) {
      const questionType = Math.random() > 0.33 ? (Math.random() > 0.5 ? 'function' : 'example') : 'identify';

      if (questionType === 'function') {
        // Ask: What is the function of this case?
        const randomCase = cases[Math.floor(Math.random() * cases.length)];
        const caseData = caseFunctions[randomCase];

        const question = `What is the primary function of the ${caseData.name} case?`;
        const correctAnswer = caseData.primaryFunction;

        const wrongAnswers = cases
          .filter(c => c !== randomCase)
          .map(c => caseFunctions[c].primaryFunction)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

        quizQuestions.push({
          question,
          correctAnswer,
          options,
          type: 'function',
          case: randomCase,
          description: caseData.description
        });
      } else if (questionType === 'example') {
        // Ask: Which case is used in this sentence?
        const randomCase = cases[Math.floor(Math.random() * cases.length)];
        const caseData = caseFunctions[randomCase];

        if (caseData.examples && caseData.examples.length > 0) {
          const example = caseData.examples[0];
          const question = `In "${example.english}", what case is being demonstrated?`;
          const correctAnswer = caseData.name;

          const wrongAnswers = cases
            .filter(c => c !== randomCase)
            .map(c => caseFunctions[c].name)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

          const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

          quizQuestions.push({
            question,
            correctAnswer,
            options,
            type: 'example',
            case: randomCase,
            greekExample: example.greek,
            explanation: example.explanation
          });
        } else {
          // Fallback to function question if no example
          i--;
          continue;
        }
      } else {
        // Ask: Identify the case from the ending
        const declensions = Object.values(nounDeclensions);
        const declension = declensions[Math.floor(Math.random() * declensions.length)];
        const number = Math.random() > 0.5 ? 'singular' : 'plural';
        const casesList = ['nominative', 'genitive', 'dative', 'accusative', 'vocative'];
        const randomCase = casesList[Math.floor(Math.random() * casesList.length)];

        const form = declension.pattern[number][randomCase];
        const question = `What case is the word ${form.example}?`;
        const correctAnswer = randomCase.charAt(0).toUpperCase() + randomCase.slice(1);

        const wrongAnswers = casesList
          .filter(c => c !== randomCase)
          .map(c => c.charAt(0).toUpperCase() + c.slice(1))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

        quizQuestions.push({
          question,
          correctAnswer,
          options,
          type: 'identify',
          case: randomCase,
          declension: declension.name,
          ending: form.ending,
          function: form.function
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
      setShowCorrectToast(true);
      setTimeout(() => setShowCorrectToast(false), 1300);
    }

    setTimeout(() => {
      advanceQuestion();
    }, 2000);
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
        quizType: 'case-quiz'
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4">
      <CorrectToast points={10} show={showCorrectToast} />
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-violet-500/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-violet-300 flex items-center gap-2">
              <Target size={28} />
              Greek Case Quiz
            </h2>
            <p className="text-slate-400 text-sm">Case Identification & Functions</p>
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
            <div className="text-violet-300 text-xl font-bold">
              {currentQuestion + 1}/{totalQuestions}
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Score</div>
            <div className="text-fuchsia-300 text-xl font-bold">{score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl p-8 mb-6">
          <div className="text-white text-2xl font-bold mb-3">{currentQ.question}</div>
          {currentQ.greekExample && (
            <div className="text-violet-200 text-lg mt-3">
              Greek: {currentQ.greekExample}
            </div>
          )}
          {currentQ.type === 'identify' && currentQ.declension && (
            <div className="text-violet-200 text-sm mt-2">
              {currentQ.declension}
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
              buttonClass += "bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600 hover:border-violet-500";
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
                Perfect! +100 points
              </p>
            ) : (
              <div>
                <p className="font-semibold text-lg mb-2">Incorrect</p>
                <p className="text-sm mb-1">
                  Correct answer: <span className="font-bold">{currentQ.correctAnswer}</span>
                </p>
                {currentQ.description && (
                  <p className="text-xs text-slate-300 mt-2">{currentQ.description}</p>
                )}
                {currentQ.explanation && (
                  <p className="text-xs text-slate-300 mt-2">{currentQ.explanation}</p>
                )}
                {currentQ.function && (
                  <p className="text-xs text-slate-300 mt-2">Function: {currentQ.function}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GreekCaseQuiz;
