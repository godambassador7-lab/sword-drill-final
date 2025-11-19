import React, { useState, useEffect } from 'react';
import { greekArticles } from '../data/koineGreekComprehensive';
import { X, CheckCircle, XCircle, Award } from 'lucide-react';

/**
 * Greek Article Quiz - Tests knowledge of definite article forms
 * Covers all genders, cases, and numbers
 */
const GreekArticleQuiz = ({ onComplete, onCancel }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const totalQuestions = 15;

  // Generate questions on mount
  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const allArticles = [];

    // Build array of all article forms
    ['singular', 'plural'].forEach(number => {
      ['masculine', 'feminine', 'neuter'].forEach(gender => {
        ['nominative', 'genitive', 'dative', 'accusative'].forEach(caseType => {
          const article = greekArticles[number][gender][caseType];
          allArticles.push({
            ...article,
            number,
            gender,
            case: caseType
          });
        });
      });
    });

    // Generate random questions
    const quizQuestions = [];
    for (let i = 0; i < totalQuestions; i++) {
      const questionType = Math.random() > 0.5 ? 'identify' : 'produce';
      const correctArticle = allArticles[Math.floor(Math.random() * allArticles.length)];

      let question, correctAnswer, options;

      if (questionType === 'identify') {
        // Given Greek form, identify gender/case/number
        question = `What is the gender, case, and number of: ${correctArticle.greek}?`;
        correctAnswer = `${correctArticle.gender} ${correctArticle.case} ${correctArticle.number}`;

        // Generate wrong answers
        const wrongAnswers = allArticles
          .filter(a => a.greek !== correctArticle.greek)
          .map(a => `${a.gender} ${a.case} ${a.number}`)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      } else {
        // Given gender/case/number, produce Greek form
        question = `What is the ${correctArticle.gender} ${correctArticle.case} ${correctArticle.number} form of the article?`;
        correctAnswer = correctArticle.greek;

        // Generate wrong answers
        const wrongAnswers = allArticles
          .filter(a => !(a.gender === correctArticle.gender && a.case === correctArticle.case && a.number === correctArticle.number))
          .map(a => a.greek)
          .filter((value, index, self) => self.indexOf(value) === index) // unique
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      }

      quizQuestions.push({
        question,
        correctAnswer,
        options,
        type: questionType,
        article: correctArticle
      });
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
        quizType: 'article-quiz'
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-blue-500/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-300">Greek Article Quiz</h2>
            <p className="text-slate-400 text-sm">Master the definite article forms</p>
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
            <div className="text-blue-300 text-xl font-bold">
              {currentQuestion + 1}/{totalQuestions}
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Score</div>
            <div className="text-purple-300 text-xl font-bold">{score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-8 mb-6 text-center">
          <div className="text-white text-2xl font-bold">{currentQ.question}</div>
          {currentQ.type === 'produce' && (
            <div className="mt-4 text-blue-200 text-sm">
              ({currentQ.article.transliteration})
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
              <p className="font-semibold text-lg flex items-center justify-center gap-2">
                <Award size={20} />
                Correct! +100 points
              </p>
            ) : (
              <div>
                <p className="font-semibold text-lg mb-2">Incorrect</p>
                <p className="text-sm">
                  {currentQ.article.greek} ({currentQ.article.transliteration}) is {currentQ.article.gender} {currentQ.article.case} {currentQ.article.number}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GreekArticleQuiz;
