import React, { useState } from 'react';
import { Check, X, ChevronRight, Award, TrendingUp, Target, RotateCcw } from 'lucide-react';

const HermeneuticsQuiz = ({ questions, lessonTitle, isExam = false, onComplete, onRetry }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSelect = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newAnswers = [...answers, {
      questionId: questions[currentQuestion].id,
      selectedAnswer,
      correct: isCorrect
    }];
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const calculateScore = () => {
    const correct = answers.filter(a => a.correct).length;
    const total = answers.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  const getPerformanceBreakdown = () => {
    const score = calculateScore();
    const passingScore = isExam ? 80 : 70;
    const passed = score.percentage >= passingScore;

    return {
      ...score,
      passed,
      passingScore,
      grade: score.percentage >= 90 ? 'A' :
             score.percentage >= 80 ? 'B' :
             score.percentage >= 70 ? 'C' :
             score.percentage >= 60 ? 'D' : 'F'
    };
  };

  // Quiz complete view
  if (quizComplete) {
    const performance = getPerformanceBreakdown();

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-teal-500">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {performance.passed ? '🎉' : '📚'}
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">
                {performance.passed ? 'Congratulations!' : 'Keep Learning!'}
              </h2>
              <p className="text-xl text-teal-300">
                {isExam ? 'Exam' : 'Lesson Quiz'} Complete
              </p>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-r from-teal-900 to-cyan-900 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">
                  {performance.percentage}%
                </div>
                <div className="text-2xl text-teal-300 mb-4">
                  Grade: {performance.grade}
                </div>
                <div className="text-lg text-slate-300">
                  {performance.correct} out of {performance.total} correct
                </div>
              </div>
            </div>

            {/* Pass/Fail Status */}
            <div className={`rounded-xl p-6 mb-6 ${
              performance.passed
                ? 'bg-green-900/30 border-2 border-green-500'
                : 'bg-orange-900/30 border-2 border-orange-500'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {performance.passed ? (
                  <>
                    <Award size={32} className="text-green-400" />
                    <h3 className="text-2xl font-bold text-green-400">
                      {isExam ? 'Exam Passed!' : 'Lesson Passed!'}
                    </h3>
                  </>
                ) : (
                  <>
                    <Target size={32} className="text-orange-400" />
                    <h3 className="text-2xl font-bold text-orange-400">
                      Additional Study Needed
                    </h3>
                  </>
                )}
              </div>
              <p className="text-white">
                {performance.passed
                  ? `Excellent work! You scored ${performance.percentage}% (passing score: ${performance.passingScore}%).`
                  : `You scored ${performance.percentage}%. Review the material and try again (passing score: ${performance.passingScore}%).`
                }
              </p>
            </div>

            {/* Performance Breakdown */}
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-teal-300 mb-4 flex items-center gap-2">
                <TrendingUp size={24} />
                Performance Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Questions Answered:</span>
                  <span className="text-white font-bold">{performance.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Correct Answers:</span>
                  <span className="text-green-400 font-bold">{performance.correct}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Incorrect Answers:</span>
                  <span className="text-red-400 font-bold">{performance.total - performance.correct}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Final Score:</span>
                  <span className="text-white font-bold text-lg">{performance.percentage}%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {performance.passed ? (
                <button
                  onClick={onComplete}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Award size={20} />
                  Continue
                </button>
              ) : (
                <>
                  <button
                    onClick={onRetry}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Review & Retry
                  </button>
                  <button
                    onClick={onComplete}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all"
                  >
                    Continue Anyway
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active quiz view
  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-2xl p-8 border-2 border-teal-500">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                {lessonTitle} {isExam ? '- Exam' : '- Quiz'}
              </h2>
              <div className="text-teal-300 font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-slate-900 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              {question.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === question.correct;
                const showResult = showExplanation;

                let buttonStyle = 'bg-slate-800 border-2 border-slate-700 hover:border-teal-500 text-white';

                if (showResult) {
                  if (isCorrectAnswer) {
                    buttonStyle = 'bg-green-900/50 border-2 border-green-500 text-white';
                  } else if (isSelected && !isCorrectAnswer) {
                    buttonStyle = 'bg-red-900/50 border-2 border-red-500 text-white';
                  } else {
                    buttonStyle = 'bg-slate-800 border-2 border-slate-700 text-slate-500';
                  }
                } else if (isSelected) {
                  buttonStyle = 'bg-teal-900/50 border-2 border-teal-500 text-white';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-lg transition-all ${buttonStyle} flex items-center justify-between`}
                  >
                    <span>{option}</span>
                    {showResult && isCorrectAnswer && (
                      <Check size={24} className="text-green-400 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrectAnswer && (
                      <X size={24} className="text-red-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`rounded-xl p-6 mb-6 ${
              isCorrect
                ? 'bg-green-900/30 border-2 border-green-500'
                : 'bg-orange-900/30 border-2 border-orange-500'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <>
                    <Check size={24} className="text-green-400" />
                    <h4 className="text-xl font-bold text-green-400">Correct!</h4>
                  </>
                ) : (
                  <>
                    <X size={24} className="text-orange-400" />
                    <h4 className="text-xl font-bold text-orange-400">Incorrect</h4>
                  </>
                )}
              </div>
              <p className="text-white leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 ${
                  selectedAnswer === null
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight size={20} />
                  </>
                ) : (
                  <>
                    View Results
                    <Award size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HermeneuticsQuiz;
