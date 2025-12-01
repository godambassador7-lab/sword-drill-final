import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Award, Target } from 'lucide-react';

const ChurchHistoryQuiz = ({
  questions,
  lessonTitle,
  isExam = false,
  onComplete,
  onRetry
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const totalQuestions = questions.length;
  const passingScore = isExam ? 70 : 60;

  const handleAnswerSelect = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const calculateScore = () => {
    const correct = answers.filter(a => a).length;
    return Math.round((correct / totalQuestions) * 100);
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding! You've mastered this material!";
    if (score >= 80) return "Excellent work! You have a strong understanding!";
    if (score >= 70) return "Good job! You passed the exam!";
    if (score >= 60) return "Good effort! You passed the quiz!";
    return "Keep studying! You can retake this to improve your score.";
  };

  // Quiz completion view
  if (quizComplete) {
    const score = calculateScore();
    const passed = score >= passingScore;
    const correctCount = answers.filter(a => a).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-800 rounded-2xl p-8 border-2 border-purple-500">
          <div className="text-center mb-8">
            {passed ? (
              <div className="mb-6">
                <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-4" />
                <h2 className="text-4xl font-bold text-yellow-400 mb-2">
                  {isExam ? 'Certification Earned!' : 'Quiz Passed!'}
                </h2>
              </div>
            ) : (
              <div className="mb-6">
                <Target className="w-24 h-24 mx-auto text-orange-400 mb-4" />
                <h2 className="text-4xl font-bold text-orange-400 mb-2">
                  Keep Practicing!
                </h2>
              </div>
            )}

            <p className="text-2xl text-white mb-2">{lessonTitle}</p>
            <p className="text-purple-300">
              {isExam ? 'Final Exam' : 'Lesson Quiz'}
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50 rounded-xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-6xl font-bold text-white mb-2">{score}%</div>
              <div className="text-xl text-purple-200">
                {correctCount} out of {totalQuestions} correct
              </div>
            </div>

            {/* Score bar */}
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-1000 ${
                  passed
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="text-center text-white font-semibold">
              {getScoreMessage(score)}
            </p>
          </div>

          {/* Performance Breakdown */}
          <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award size={24} className="text-purple-400" />
              Performance Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">
                  {correctCount}
                </div>
                <div className="text-sm text-green-300">Correct</div>
              </div>
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-400">
                  {totalQuestions - correctCount}
                </div>
                <div className="text-sm text-red-300">Incorrect</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {passed ? (
              <button
                onClick={onComplete}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Continue
              </button>
            ) : (
              <>
                <button
                  onClick={onRetry}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Retry Quiz
                </button>
                <button
                  onClick={onComplete}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all"
                >
                  Review Material
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz question view
  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with progress */}
        <div className="mb-6">
          <div className="bg-slate-800 rounded-2xl p-6 border-2 border-purple-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">{lessonTitle}</h2>
              <div className="text-purple-300 font-semibold">
                Question {currentQuestion + 1} of {totalQuestions}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800 rounded-2xl p-8 border-2 border-purple-500 mb-6">
          {/* Question */}
          <div className="mb-8">
            <div className="text-sm font-semibold text-purple-400 mb-2">
              {isExam ? 'EXAM QUESTION' : 'QUIZ QUESTION'}
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">
              {question.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correct;

              let buttonClass = 'w-full text-left p-4 rounded-xl border-2 transition-all ';

              if (!showExplanation) {
                buttonClass += isSelected
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-slate-700 border-slate-600 text-white hover:border-purple-400 hover:bg-slate-600';
              } else {
                if (isCorrectAnswer) {
                  buttonClass += 'bg-green-900/50 border-green-500 text-white';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'bg-red-900/50 border-red-500 text-white';
                } else {
                  buttonClass += 'bg-slate-700 border-slate-600 text-gray-400';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{option}</span>
                    {showExplanation && isCorrectAnswer && (
                      <CheckCircle className="text-green-400 flex-shrink-0 ml-2" size={24} />
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <XCircle className="text-red-400 flex-shrink-0 ml-2" size={24} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`p-6 rounded-xl border-2 mb-6 ${
                isCorrect
                  ? 'bg-green-900/20 border-green-500/50'
                  : 'bg-red-900/20 border-red-500/50'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {isCorrect ? (
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={24} />
                ) : (
                  <XCircle className="text-red-400 flex-shrink-0 mt-1" size={24} />
                )}
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h4>
                  <p className="text-white">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${
                selectedAnswer === null
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {currentQuestion < totalQuestions - 1 ? (
                <>
                  Next Question
                  <ArrowRight size={20} />
                </>
              ) : (
                <>
                  View Results
                  <Trophy size={20} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Score Tracker */}
        {answers.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-300">Current Score:</span>
              <span className="text-white font-bold">
                {answers.filter(a => a).length} / {answers.length} correct
                ({Math.round((answers.filter(a => a).length / answers.length) * 100)}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChurchHistoryQuiz;
