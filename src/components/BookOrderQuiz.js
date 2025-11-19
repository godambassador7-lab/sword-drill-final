import React, { useState, useEffect, useCallback } from "react";
import {
  generateBookOrderQuestion,
  checkBookAnswer,
} from "../data/bibleBooks";

const BookOrderQuiz = ({ onComplete, onCancel, userData }) => {
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [totalQuestions] = useState(10); // 10 questions per game
  const [feedback, setFeedback] = useState(null); // "correct" or "incorrect"
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Generate new question
  const newQuestion = useCallback(() => {
    const q = generateBookOrderQuestion();
    setQuestion(q);
    setUserAnswer("");
    setTimeLeft(15);
    setFeedback(null);
  }, []);

  // Start first question on mount
  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  // Timer countdown
  useEffect(() => {
    if (gameOver || feedback) return; // Don't count down during feedback or game over

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
    setFeedback("incorrect");
    setStreak(0);

    setTimeout(() => {
      if (questionsAnswered + 1 >= totalQuestions) {
        endGame();
      } else {
        setQuestionsAnswered((prev) => prev + 1);
        newQuestion();
      }
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || feedback || gameOver) return;

    const isCorrect = checkBookAnswer(userAnswer, question.answer);

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 10); // Bonus points for speed
      const basePoints = 100;
      const earnedPoints = basePoints + timeBonus;

      setScore((prev) => prev + earnedPoints);
      setFeedback("correct");
      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((best) => Math.max(best, newStreak));
        return newStreak;
      });
    } else {
      setFeedback("incorrect");
      setStreak(0);
    }

    setTimeout(() => {
      if (questionsAnswered + 1 >= totalQuestions) {
        endGame();
      } else {
        setQuestionsAnswered((prev) => prev + 1);
        newQuestion();
      }
    }, 1500);
  };

  const endGame = () => {
    setGameOver(true);
    onComplete({
      score,
      questionsAnswered: totalQuestions,
      correctAnswers: Math.floor(score / 100), // Approximate based on base points
      bestStreak,
    });
  };

  const handleSkip = () => {
    setFeedback("incorrect");
    setStreak(0);

    setTimeout(() => {
      if (questionsAnswered + 1 >= totalQuestions) {
        endGame();
      } else {
        setQuestionsAnswered((prev) => prev + 1);
        newQuestion();
      }
    }, 1500);
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-900">
            Quiz Complete!
          </h2>

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-center">
              <div className="text-white text-sm font-semibold uppercase tracking-wide">
                Final Score
              </div>
              <div className="text-white text-4xl font-bold">{score}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <div className="text-blue-600 text-sm font-semibold">
                  Questions
                </div>
                <div className="text-blue-900 text-2xl font-bold">
                  {questionsAnswered}
                </div>
              </div>

              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-green-600 text-sm font-semibold">
                  Best Streak
                </div>
                <div className="text-green-900 text-2xl font-bold">
                  {bestStreak}
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
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = (questionsAnswered / totalQuestions) * 100;
  const timePercent = (timeLeft / 15) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-900">
              Bible Book Order Quiz
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4 text-sm">
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <span className="text-blue-600 font-semibold">Score:</span>{" "}
              <span className="text-blue-900 font-bold">{score}</span>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <span className="text-green-600 font-semibold">Streak:</span>{" "}
              <span className="text-green-900 font-bold">{streak}</span>
            </div>
            <div className="bg-purple-100 px-4 py-2 rounded-lg">
              <span className="text-purple-600 font-semibold">Question:</span>{" "}
              <span className="text-purple-900 font-bold">
                {questionsAnswered + 1}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-semibold">Time Left:</span>
            <span
              className={`text-2xl font-bold ${
                timeLeft <= 5 ? "text-red-600" : "text-green-600"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : "bg-gradient-to-r from-green-500 to-blue-500"
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 text-center">
            <p className="text-lg text-gray-700 mb-2">
              Which book comes{" "}
              <span className="font-bold text-purple-900">
                {question.direction}
              </span>
            </p>
            <p className="text-3xl font-bold text-indigo-900">
              {question.book}
            </p>
            <p className="text-sm text-gray-500 mt-2">in the Bible canon?</p>
          </div>
        </div>

        {/* Answer Input */}
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type the book name..."
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 text-lg text-center"
            autoFocus
            disabled={feedback !== null}
          />
        </form>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-4 p-4 rounded-xl text-center font-bold text-lg ${
              feedback === "correct"
                ? "bg-green-100 text-green-900"
                : "bg-red-100 text-red-900"
            }`}
          >
            {feedback === "correct" ? (
              <>
                ✓ Correct! The answer is{" "}
                <span className="font-extrabold">{question.answer}</span>
                <div className="text-sm mt-1">
                  +{100 + Math.floor(timeLeft * 10)} points
                </div>
              </>
            ) : (
              <>
                ✗ Incorrect. The answer is{" "}
                <span className="font-extrabold">{question.answer}</span>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || feedback !== null}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleSkip}
            disabled={feedback !== null}
            className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Skip
          </button>
        </div>

        {/* Hint */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Tip: Speed bonus! Answer quickly for extra points.
        </div>
      </div>
    </div>
  );
};

export default BookOrderQuiz;
