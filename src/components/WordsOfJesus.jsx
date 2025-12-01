import React, { useState, useEffect } from 'react';
import { X, Clock, Trophy, Zap, Check, AlertCircle, Timer } from 'lucide-react';
import CorrectToast from './CorrectToast';

// Load quiz data
let QUIZ_DATA = [];

const dataUrl = `${process.env.PUBLIC_URL || ''}/word_of_jesus_or_not/word_of_jesus_or_not.json`;
fetch(dataUrl)
  .then(res => res.json())
  .then(data => {
    QUIZ_DATA = data.quiz || [];
  })
  .catch(err => {
    console.warn('Failed to load Words of Jesus quiz data:', err);
    // Fallback to sample data
    QUIZ_DATA = [
      { saying: "I am the way, the truth, and the life", is_jesus: true },
      { saying: "The heart is deceitful above all things", is_jesus: false },
      { saying: "Before Abraham was, I am", is_jesus: true },
      { saying: "The Lord is my shepherd", is_jesus: false },
      { saying: "I am the bread of life", is_jesus: true },
    ];
  });

const POINTS_PER_CORRECT = 10;
const TIME_LIMIT_SECONDS = 30; // 30 seconds total for the quiz
const QUESTIONS_COUNT = 5; // Number of questions per quiz

const WordsOfJesus = ({ onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showCorrectToast, setShowCorrectToast] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Initialize questions
  useEffect(() => {
    const checkAndLoadQuestions = () => {
      if (QUIZ_DATA.length > 0) {
        // Shuffle and select questions
        const shuffled = [...QUIZ_DATA].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(QUESTIONS_COUNT, shuffled.length));
        setQuestions(selected);
      } else {
        // Retry after a short delay if data not loaded yet
        setTimeout(checkAndLoadQuestions, 100);
      }
    };
    checkAndLoadQuestions();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameOver || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameOver, questions]);

  const handleTimeout = () => {
    // Auto-submit current progress
    endGame();
  };

  const handleAnswer = (isJesus) => {
    if (feedback || gameOver) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = isJesus === currentQuestion.is_jesus;

    if (isCorrect) {
      setScore(prev => prev + POINTS_PER_CORRECT);
      setCorrectAnswers(prev => prev + 1);
      setShowCorrectToast(true);
      setTimeout(() => setShowCorrectToast(false), 800);
    }

    // Record answer
    setAnswers(prev => [...prev, {
      saying: currentQuestion.saying,
      userAnswer: isJesus,
      correctAnswer: currentQuestion.is_jesus,
      isCorrect
    }]);

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex + 1 >= questions.length) {
        endGame();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 800);
  };

  const endGame = () => {
    setGameOver(true);
  };

  const handlePlayAgain = () => {
    // Shuffle and select new questions
    const shuffled = [...QUIZ_DATA].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(QUESTIONS_COUNT, shuffled.length));
    setQuestions(selected);
    setCurrentQuestionIndex(0);
    setTimeLeft(TIME_LIMIT_SECONDS);
    setScore(0);
    setCorrectAnswers(0);
    setFeedback(null);
    setGameOver(false);
    setAnswers([]);
  };

  const handleFinish = () => {
    const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
    onComplete({
      score,
      correctAnswers,
      totalQuestions: questions.length,
      accuracy,
      timeUsed: TIME_LIMIT_SECONDS - timeLeft
    });
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-white text-2xl">Loading quiz...</div>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    const timeUsed = TIME_LIMIT_SECONDS - timeLeft;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-purple-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Quiz Complete!</h2>
              <button
                onClick={onCancel}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Results */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '📖'}
              </div>
              <div className="text-5xl font-bold text-purple-400 mb-2">
                {score} Points
              </div>
              <div className="text-xl text-slate-300">
                {correctAnswers} / {questions.length} Correct ({accuracy}%)
              </div>
              <div className="text-lg text-slate-400 mt-2">
                ⏱️ Time Used: {timeUsed}s
              </div>
            </div>

            {/* Performance */}
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-purple-300 mb-4">Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Accuracy:</span>
                  <span className={`font-bold ${accuracy >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                    {accuracy}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Correct Answers:</span>
                  <span className="text-white font-bold">{correctAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Wrong Answers:</span>
                  <span className="text-red-400 font-bold">{questions.length - correctAnswers}</span>
                </div>
              </div>
            </div>

            {/* Answer Review */}
            <div className="bg-slate-900 rounded-xl p-6 mb-6 max-h-64 overflow-y-auto">
              <h3 className="text-xl font-bold text-purple-300 mb-4">Review</h3>
              <div className="space-y-3">
                {answers.map((answer, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-2 ${
                      answer.isCorrect
                        ? 'bg-green-900/20 border-green-500/30'
                        : 'bg-red-900/20 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {answer.isCorrect ? (
                        <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-white text-sm mb-1">"{answer.saying}"</p>
                        <div className="text-xs text-slate-400">
                          {answer.correctAnswer ? (
                            <span className="text-purple-300">✓ Jesus said this</span>
                          ) : (
                            <span className="text-blue-300">✗ Not Jesus</span>
                          )}
                          {!answer.isCorrect && (
                            <span className="text-red-400 ml-2">
                              (You said: {answer.userAnswer ? "Jesus" : "Not Jesus"})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePlayAgain}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                Play Again
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Trophy size={20} />
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active quiz
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timePercentage = (timeLeft / TIME_LIMIT_SECONDS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {showCorrectToast && <CorrectToast />}

      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-2xl p-8 border-2 border-purple-500">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Words of Jesus?</h2>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-400" size={20} />
                <span className="text-white font-bold">{score} pts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-400" size={20} />
                <span className="text-white font-bold">{correctAnswers}/{questions.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer className={`${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-purple-400'}`} size={20} />
              <span className={`font-bold text-xl ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-purple-400 text-sm font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Time Bar */}
          <div className="mb-8">
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                style={{ width: `${timePercentage}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-slate-900 rounded-xl p-8 mb-6">
            <p className="text-2xl text-white text-center font-medium leading-relaxed">
              "{currentQuestion.saying}"
            </p>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              disabled={feedback !== null}
              className={`p-6 rounded-xl text-xl font-bold transition-all transform hover:scale-105 ${
                feedback === 'correct' && currentQuestion.is_jesus
                  ? 'bg-green-600 border-2 border-green-400 text-white'
                  : feedback === 'incorrect' && currentQuestion.is_jesus
                  ? 'bg-green-600 border-2 border-green-400 text-white'
                  : feedback === 'incorrect' && !currentQuestion.is_jesus
                  ? 'bg-red-900/50 border-2 border-red-500/50 text-red-300'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border-2 border-blue-400'
              } disabled:cursor-not-allowed`}
            >
              ✝️ Jesus
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={feedback !== null}
              className={`p-6 rounded-xl text-xl font-bold transition-all transform hover:scale-105 ${
                feedback === 'correct' && !currentQuestion.is_jesus
                  ? 'bg-green-600 border-2 border-green-400 text-white'
                  : feedback === 'incorrect' && !currentQuestion.is_jesus
                  ? 'bg-green-600 border-2 border-green-400 text-white'
                  : feedback === 'incorrect' && currentQuestion.is_jesus
                  ? 'bg-red-900/50 border-2 border-red-500/50 text-red-300'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-2 border-red-400'
              } disabled:cursor-not-allowed`}
            >
              📖 Not Jesus
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mt-6 p-4 rounded-xl text-center font-bold ${
              feedback === 'correct'
                ? 'bg-green-900/30 border-2 border-green-500 text-green-300'
                : 'bg-red-900/30 border-2 border-red-500 text-red-300'
            }`}>
              {feedback === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordsOfJesus;
