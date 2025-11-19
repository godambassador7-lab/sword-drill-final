import React, { useState, useEffect } from 'react';
import { X, Trophy, CheckCircle, XCircle, Award, Flame, Clock } from 'lucide-react';

/**
 * Exam Mode - Consecutive quiz challenge with comprehensive results
 * Users take multiple quizzes in a row based on their settings
 */
const ExamMode = ({ quizCount = 3, onComplete, onCancel, startQuiz, QUIZ_TYPES, QUIZ_POINTS }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [isSelectingQuizzes, setIsSelectingQuizzes] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [startTime] = useState(Date.now());

  // Initialize quiz selection
  useEffect(() => {
    // Pre-select random quiz types
    const availableTypes = QUIZ_TYPES.filter(q => q !== 'verse-of-day');
    const shuffled = [...availableTypes].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, quizCount);
    setSelectedQuizzes(selected.map(type => ({ type, completed: false })));
  }, [quizCount, QUIZ_TYPES]);

  const handleQuizTypeSelect = (quizType) => {
    const newSelections = [...selectedQuizzes];
    const index = newSelections.findIndex(q => q.type === quizType);

    if (index >= 0) {
      // Already selected, remove it
      newSelections.splice(index, 1);
    } else if (newSelections.length < quizCount) {
      // Add new selection
      newSelections.push({ type: quizType, completed: false });
    }

    setSelectedQuizzes(newSelections);
  };

  const startExam = () => {
    if (selectedQuizzes.length === quizCount) {
      setIsSelectingQuizzes(false);
      startNextQuiz();
    }
  };

  const startNextQuiz = () => {
    if (currentQuizIndex < selectedQuizzes.length) {
      const quizType = selectedQuizzes[currentQuizIndex].type;
      setActiveQuiz(quizType);
      // Trigger the parent's startQuiz function
      startQuiz(quizType);
    } else {
      // All quizzes completed
      completeExam();
    }
  };

  const handleQuizComplete = (result) => {
    const newResults = [...quizResults, {
      ...result,
      quizType: selectedQuizzes[currentQuizIndex].type,
      quizIndex: currentQuizIndex
    }];

    setQuizResults(newResults);
    setActiveQuiz(null);

    // Mark current quiz as completed
    const updatedQuizzes = [...selectedQuizzes];
    updatedQuizzes[currentQuizIndex].completed = true;
    setSelectedQuizzes(updatedQuizzes);

    // Move to next quiz
    if (currentQuizIndex + 1 < quizCount) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      // Small delay before starting next quiz
      setTimeout(() => {
        startNextQuiz();
      }, 1500);
    } else {
      completeExam();
    }
  };

  const completeExam = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const totalPoints = quizResults.reduce((sum, r) => sum + (r.pointsEarned || r.score || 0), 0);
    const totalCorrect = quizResults.reduce((sum, r) => sum + (r.correctAnswers || r.correct || 0), 0);
    const totalQuestions = quizResults.reduce((sum, r) => sum + (r.totalQuestions || r.total || 0), 0);
    const avgPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Completion bonus
    const completionBonus = quizCount * 50;

    onComplete({
      results: quizResults,
      totalPoints: totalPoints + completionBonus,
      totalCorrect,
      totalQuestions,
      avgPercentage,
      completionBonus,
      timeSpent: totalTime,
      quizCount
    });
  };

  // Quiz Selection Screen
  if (isSelectingQuizzes) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full border-2 border-purple-500/30 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-purple-300 flex items-center gap-2">
                <Trophy size={32} />
                Exam Mode
              </h2>
              <p className="text-slate-400 text-sm mt-1">Select {quizCount} quiz types for your exam</p>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Selection Progress */}
          <div className="mb-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200 font-semibold">
                Selected: {selectedQuizzes.length}/{quizCount}
              </span>
              <span className="text-sm text-slate-400">
                {quizCount - selectedQuizzes.length > 0 ? `Select ${quizCount - selectedQuizzes.length} more` : 'Ready to start!'}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${(selectedQuizzes.length / quizCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Quiz Type Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {QUIZ_TYPES.filter(q => q !== 'verse-of-day').map((quizType) => {
              const isSelected = selectedQuizzes.some(q => q.type === quizType);
              const quizTypeNames = {
                'type-it-out': 'Type It Out',
                'fill-in-blank': 'Fill in the Blank',
                'multiple-choice': 'Multiple Choice',
                'reference-recall': 'Reference Recall'
              };

              return (
                <button
                  key={quizType}
                  onClick={() => handleQuizTypeSelect(quizType)}
                  className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    isSelected
                      ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-purple-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{quizTypeNames[quizType] || quizType}</span>
                    {isSelected && <CheckCircle size={20} />}
                  </div>
                  <div className="text-sm opacity-75">
                    +{QUIZ_POINTS[quizType] || 100} points
                  </div>
                </button>
              );
            })}
          </div>

          {/* Start Button */}
          <button
            onClick={startExam}
            disabled={selectedQuizzes.length !== quizCount}
            className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all transform ${
              selectedQuizzes.length === quizCount
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white hover:scale-105'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {selectedQuizzes.length === quizCount ? 'Start Exam' : `Select ${quizCount - selectedQuizzes.length} More`}
          </button>
        </div>
      </div>
    );
  }

  // Progress Screen (shown between quizzes)
  if (!activeQuiz && currentQuizIndex < quizCount) {
    const progress = (currentQuizIndex / quizCount) * 100;

    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-purple-500/30">
          <div className="text-center">
            <Trophy size={64} className="mx-auto text-purple-300 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Exam in Progress</h2>
            <p className="text-slate-400 mb-6">
              Quiz {currentQuizIndex + 1} of {quizCount}
            </p>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Quiz List */}
            <div className="space-y-2 mb-6">
              {selectedQuizzes.map((quiz, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    quiz.completed
                      ? 'bg-green-600/20 border border-green-500/30'
                      : index === currentQuizIndex
                      ? 'bg-purple-600/20 border border-purple-500/30'
                      : 'bg-slate-700/30 border border-slate-600/30'
                  }`}
                >
                  <span className="text-white font-semibold capitalize">{quiz.type.replace('-', ' ')}</span>
                  {quiz.completed ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : index === currentQuizIndex ? (
                    <Flame size={20} className="text-purple-400 animate-pulse" />
                  ) : (
                    <Clock size={20} className="text-slate-500" />
                  )}
                </div>
              ))}
            </div>

            <p className="text-slate-300">Preparing next quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  // When activeQuiz is set, the parent component will render the actual quiz
  // This component just manages the flow
  return null;
};

export default ExamMode;
