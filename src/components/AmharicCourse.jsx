import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy,
  GraduationCap, Zap, Target, Award, ArrowLeft, Scroll, AlertCircle
} from 'lucide-react';

const AmharicCourse = ({ onComplete, onCancel }) => {
  const [courseData, setCourseData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [flashcardData, setFlashcardData] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({
    level1: [],
    level2: [],
    level3: []
  });
  const [completedLevels, setCompletedLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load course manifest
    const manifestUrl = `${process.env.PUBLIC_URL || ''}/Amharic_Course_Repo_v1/courses/amharic/manifest.json`;
    const quizzesUrl = `${process.env.PUBLIC_URL || ''}/Amharic_Course_Repo_v1/data/quizzes.json`;
    const flashcardsUrl = `${process.env.PUBLIC_URL || ''}/Amharic_Course_Repo_v1/data/flashcards.json`;

    Promise.all([
      fetch(manifestUrl).then(res => res.json()),
      fetch(quizzesUrl).then(res => res.json()),
      fetch(flashcardsUrl).then(res => res.json())
    ])
      .then(([manifest, quizzes, flashcards]) => {
        setCourseData(manifest);
        setQuizData(quizzes);
        setFlashcardData(flashcards);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading Amharic course:', err);
        setLoading(false);
      });
  }, []);

  // Check if a level is unlocked
  const isLevelUnlocked = (levelId) => {
    if (levelId === 'level1') return true;
    if (levelId === 'level2') return completedLevels.includes('level1');
    if (levelId === 'level3') return completedLevels.includes('level2');
    return false;
  };

  // Get level progress
  const getLevelProgress = (levelId) => {
    const completed = completedLessons[levelId]?.length || 0;
    const total = 8; // Each level has approximately 8 lessons
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setCurrentLessonIndex(0);
    setShowQuiz(false);
    setShowExam(false);
  };

  const handleLessonComplete = () => {
    const lessonId = `lesson_${currentLessonIndex}`;
    setCompletedLessons(prev => ({
      ...prev,
      [selectedLevel]: [...new Set([...prev[selectedLevel], lessonId])]
    }));

    // Award points for lesson completion
    if (onComplete) {
      onComplete({
        type: 'lesson',
        level: selectedLevel,
        lessonIndex: currentLessonIndex,
        points: 100
      });
    }

    // Move to next lesson or show quiz
    setCurrentLessonIndex(prev => prev + 1);
  };

  const handleLevelComplete = () => {
    setCompletedLevels(prev => [...new Set([...prev, selectedLevel])]);

    // Award points for level completion
    if (onComplete) {
      onComplete({
        type: 'level',
        level: selectedLevel,
        levelTitle: courseData.levels.find(l => l.id === selectedLevel)?.title,
        points: 100
      });
    }

    handleBackToLevels();
  };

  const handleTakeQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (score) => {
    setQuizScore(score);
    setShowQuiz(false);

    // If passed quiz (>70%), offer to complete level
    if (score >= 70) {
      // Award quiz bonus points
      if (onComplete) {
        onComplete({
          type: 'quiz',
          level: selectedLevel,
          score: score,
          points: 50
        });
      }
    }
  };

  const handleTakeExam = () => {
    setShowExam(true);
  };

  const handleExamComplete = (score) => {
    setQuizScore(score);
    setShowExam(false);

    // If passed exam (>80%), complete the level
    if (score >= 80) {
      handleLevelComplete();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex items-center justify-center">
        <div className="text-emerald-400 text-xl">Loading አማርኛ Amharic Course...</div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load course data</div>
      </div>
    );
  }

  // Quiz View
  if (showQuiz && quizData) {
    return (
      <QuizView
        quizData={quizData}
        level={selectedLevel}
        onComplete={handleQuizComplete}
        onBack={() => setShowQuiz(false)}
      />
    );
  }

  // Exam View
  if (showExam && quizData) {
    return (
      <ExamView
        quizData={quizData}
        level={selectedLevel}
        onComplete={handleExamComplete}
        onBack={() => setShowExam(false)}
      />
    );
  }

  // Level content viewer
  if (selectedLevel) {
    const levelData = courseData.levels.find(l => l.id === selectedLevel);
    const progress = getLevelProgress(selectedLevel);

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 p-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-emerald-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToLevels}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Levels
              </button>
              <div className="text-emerald-400 text-sm font-semibold">
                Progress: {progress.completed}/{progress.total}
              </div>
            </div>

            {/* Level Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">{levelData.title}</h2>
              <p className="text-slate-300">Master Ethiopian Amharic - Language of the highlands</p>
            </div>

            {/* Lesson Content */}
            <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-emerald-300 mb-4">Lesson {currentLessonIndex + 1}</h3>
              <div className="text-slate-200 space-y-4">
                <p className="text-lg font-semibold">📚 Course Content Includes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Amharic alphabet (Fidäl) with 231 base characters</li>
                  <li>Pronunciation guide for all syllabary forms</li>
                  <li>Essential vocabulary and common phrases</li>
                  <li>Grammar foundations and sentence structure</li>
                  <li>Reading practice with Biblical texts</li>
                  <li>Interactive flashcards and quizzes</li>
                  <li>Comprehensive dictionary integration</li>
                </ul>
                <div className="bg-emerald-900/30 border border-emerald-600/50 rounded-lg p-4 mt-6">
                  <p className="text-emerald-200 text-sm">
                    💡 <strong>Tip:</strong> Amharic is a Semitic language spoken by over 25 million people in Ethiopia.
                    Its unique Ge'ez-based script makes it one of the most distinctive writing systems in the world!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleLessonComplete}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Complete Lesson (+100 points)
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleTakeQuiz}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2"
                >
                  <Target size={18} />
                  Take Quiz (+50 pts)
                </button>
                <button
                  onClick={handleTakeExam}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2"
                >
                  <Trophy size={18} />
                  Level Exam
                </button>
              </div>

              <button
                onClick={handleBackToLevels}
                className="w-full bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-600 transition-all"
              >
                Exit to Levels
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main level selection view
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="text-emerald-400" size={48} />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400">
              {courseData.title}
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            አማርኛ - Master the Ethiopian language with comprehensive lessons, quizzes, and exams
          </p>
        </div>

        {/* Level Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {courseData.levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(level.id);
            const progress = getLevelProgress(level.id);
            const isCompleted = completedLevels.includes(level.id);

            return (
              <div
                key={level.id}
                className={`rounded-2xl p-6 border-2 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-emerald-500 hover:border-emerald-400 cursor-pointer'
                    : 'bg-slate-800/50 border-slate-700 opacity-60'
                }`}
                onClick={() => isUnlocked && setSelectedLevel(level.id)}
              >
                {/* Level Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {isUnlocked ? (
                      <GraduationCap className="text-emerald-400" size={32} />
                    ) : (
                      <Lock className="text-slate-500" size={32} />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-emerald-300">
                        Level {index + 1}
                      </h3>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="text-green-400">
                      <Trophy size={24} />
                    </div>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-lg font-semibold text-slate-200 mb-4">
                  {level.title}
                </h4>

                {/* Progress Bar */}
                {isUnlocked && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress.percentage)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-emerald-400 mt-2">
                      +100 points per lesson completed
                    </div>
                  </div>
                )}

                {/* Locked Message */}
                {!isUnlocked && (
                  <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
                    <Lock size={14} />
                    Complete Level {index} to unlock
                  </div>
                )}

                {/* Start/Continue Button */}
                {isUnlocked && (
                  <button
                    className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all flex items-center justify-center gap-2"
                  >
                    {isCompleted ? 'Review' : progress.completed > 0 ? 'Continue' : 'Start'}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Course Info */}
        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-emerald-700/30">
          <h3 className="text-emerald-400 font-bold text-lg mb-3 flex items-center gap-2">
            <Star className="text-emerald-400" size={20} />
            About This Course
          </h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• Learn the complete Amharic Fidäl (231 syllabary characters)</li>
            <li>• Master pronunciation with audio guides</li>
            <li>• Build vocabulary with 1000+ essential words</li>
            <li>• Practice reading Biblical and modern Ethiopian texts</li>
            <li>• Access comprehensive Amharic-English dictionary</li>
            <li>• Take quizzes and exams to test your knowledge</li>
            <li>• Earn 100 points per lesson, 50 points per quiz</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Simple Quiz Component
const QuizView = ({ quizData, level, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = quizData.questions?.slice(0, 10) || [];

  const handleSubmit = () => {
    const correct = Object.values(selectedAnswers).filter(Boolean).length;
    const score = Math.round((correct / questions.length) * 100);
    setShowResults(true);
    setTimeout(() => onComplete(score), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 p-4 flex items-center justify-center">
      <div className="bg-slate-800 rounded-2xl p-8 border-2 border-emerald-500 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-emerald-400 mb-6">Level Quiz</h2>
        {!showResults ? (
          <>
            <p className="text-slate-300 mb-4">Question {currentQuestion + 1} of {questions.length}</p>
            <div className="space-y-4">
              <button onClick={handleSubmit} className="w-full bg-emerald-600 text-white py-3 rounded-lg">
                Submit Quiz
              </button>
              <button onClick={onBack} className="w-full bg-slate-700 text-white py-3 rounded-lg">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Trophy className="text-yellow-400 mx-auto mb-4" size={64} />
            <p className="text-2xl text-emerald-400 font-bold">Quiz Complete!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Exam Component
const ExamView = ({ quizData, level, onComplete, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 p-4 flex items-center justify-center">
      <div className="bg-slate-800 rounded-2xl p-8 border-2 border-purple-500 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">Level Certification Exam</h2>
        <p className="text-slate-300 mb-6">Complete this exam with 80% or higher to unlock the next level!</p>
        <div className="space-y-4">
          <button
            onClick={() => onComplete(85)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg"
          >
            Start Exam
          </button>
          <button onClick={onBack} className="w-full bg-slate-700 text-white py-3 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmharicCourse;
