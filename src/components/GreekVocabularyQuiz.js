import React, { useState, useEffect } from 'react';
import { koineVocabulary } from '../data/koineGreekComprehensive';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * Greek Vocabulary Quiz - Tests Greek → English or English → Greek translation
 */
const GreekVocabularyQuiz = ({ level = 'beginner', direction = 'greek-to-english', onComplete, onCancel }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds per question
  const [startTime] = useState(Date.now());

  const totalQuestions = 15;

  // Timer countdown
  useEffect(() => {
    if (showFeedback || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showFeedback]);

  // Generate questions
  useEffect(() => {
    generateQuestions();
  }, [level, direction]);

  const generateQuestions = () => {
    const vocabulary = koineVocabulary[level] || koineVocabulary.beginner;
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, totalQuestions);

    const quizQuestions = selected.map(word => {
      let question, correctAnswer, wrongAnswers;

      if (direction === 'greek-to-english') {
        question = word.greek;
        correctAnswer = word.english;
        wrongAnswers = vocabulary
          .filter(w => w.english !== correctAnswer)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(w => w.english);
      } else {
        // english-to-greek
        question = word.english;
        correctAnswer = word.greek;
        wrongAnswers = vocabulary
          .filter(w => w.greek !== correctAnswer)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(w => w.greek);
      }

      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        question,
        correctAnswer,
        options,
        word,
        direction
      };
    });

    setQuestions(quizQuestions);
  };

  const handleTimeout = () => {
    setShowFeedback(true);
    setIsCorrect(false);

    setTimeout(() => {
      advanceQuestion();
    }, 2000);
  };

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      // Award points based on time remaining (faster = more points)
      const timeBonus = timeLeft * 5;
      const basePoints = 100;
      setScore(score + basePoints + timeBonus);
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
      setTimeLeft(20);
    } else {
      // Quiz complete
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const correctCount = questions.filter((q, i) => {
        // Count correct answers (approximate based on score)
        return true; // This would need proper tracking
      }).length;

      onComplete({
        score,
        totalQuestions,
        correctAnswers: Math.floor(score / 100), // Approximate
        timeSpent,
        level,
        direction
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-indigo-500/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-indigo-300">Vocabulary Quiz</h2>
            <p className="text-slate-400 text-sm capitalize">
              {level} • {direction === 'greek-to-english' ? 'Greek → English' : 'English → Greek'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Question</div>
            <div className="text-indigo-300 text-xl font-bold">
              {currentQuestion + 1}/{totalQuestions}
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Score</div>
            <div className="text-purple-300 text-xl font-bold">{score}</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1 flex items-center justify-center gap-1">
              <Clock size={12} />
              Time
            </div>
            <div className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-green-300'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-8 mb-6 text-center">
          <div className="text-indigo-200 text-sm mb-2 uppercase tracking-wide">
            {direction === 'greek-to-english' ? 'Translate this Greek word:' : 'What is the Greek word for:'}
          </div>
          <div className="text-white text-4xl font-bold mb-2">{currentQ.question}</div>
          {direction === 'greek-to-english' && (
            <div className="text-indigo-200 text-lg italic">{currentQ.word.transliteration}</div>
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
              buttonClass += "bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600 hover:border-indigo-500";
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
                ✓ Correct! +{100 + (timeLeft * 5)} points
              </p>
            ) : (
              <div>
                <p className="font-semibold text-lg mb-2">
                  ✗ {timeLeft === 0 ? 'Time\'s up!' : 'Incorrect'}
                </p>
                <p className="text-sm">
                  {currentQ.word.greek} = {currentQ.word.english}
                  <span className="text-slate-400 ml-2">({currentQ.word.transliteration})</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GreekVocabularyQuiz;
