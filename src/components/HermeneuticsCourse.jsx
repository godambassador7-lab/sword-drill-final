import React, { useState } from 'react';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy,
  GraduationCap, Zap, Target, Award, ArrowLeft, Lightbulb
} from 'lucide-react';
import quizData from '../data/hermeneutics_course/quiz_content.json';
import lessonContent from '../data/hermeneutics_course/lesson_content.json';
import HermeneuticsQuiz from './HermeneuticsQuiz';

const HermeneuticsCourse = ({ onComplete, onCancel }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({
    beginner: [],
    intermediate: [],
    advanced: []
  });
  const [showQuiz, setShowQuiz] = useState(false);

  // Check if a level is unlocked
  const isLevelUnlocked = (level) => {
    if (level === 'beginner') return true;
    if (level === 'intermediate') return completedLessons.beginner.length >= 3;
    if (level === 'advanced') return completedLessons.intermediate.length >= 3;
    return false;
  };

  // Get level progress
  const getLevelProgress = (level) => {
    const totalLessons = getLessonsForLevel(level).length;
    const completed = completedLessons[level]?.length || 0;
    return { completed, total: totalLessons, percentage: (completed / totalLessons) * 100 };
  };

  // Get lessons for a specific level
  const getLessonsForLevel = (level) => {
    const levelMap = {
      beginner: [
        { id: 'what-is-hermeneutics', title: 'What Is Hermeneutics?', icon: '📖', duration: '15 min' },
        { id: 'why-interpretation-matters', title: 'Why Interpretation Matters', icon: '🎯', duration: '20 min' },
        { id: 'four-pillars', title: 'The Four Pillars of Interpretation', icon: '🏛️', duration: '25 min' },
        { id: 'genre-basics', title: 'Biblical Genre Study Basics', icon: '📚', duration: '30 min' },
        { id: 'literal-vs-figurative', title: 'Literal vs. Figurative Language', icon: '🔤', duration: '25 min' },
        { id: 'context-is-king', title: 'Context Is King', icon: '👑', duration: '30 min' },
        { id: 'beginner-exam', title: 'Foundations Certification Exam', icon: '🎓', duration: '45 min', isExam: true }
      ],
      intermediate: [
        { id: 'grammatical-historical', title: 'Grammatical-Historical Method', icon: '📜', duration: '35 min' },
        { id: 'narrative-interpretation', title: 'Interpreting Biblical Narratives', icon: '📖', duration: '40 min' },
        { id: 'poetry-interpretation', title: 'Hebrew Poetry & Parallelism', icon: '✍️', duration: '35 min' },
        { id: 'prophecy-interpretation', title: 'Understanding Prophecy', icon: '⚡', duration: '40 min' },
        { id: 'epistles-interpretation', title: 'Interpreting the Epistles', icon: '✉️', duration: '35 min' },
        { id: 'typology-symbolism', title: 'Typology & Symbolism', icon: '🔮', duration: '40 min' },
        { id: 'covenant-theology', title: 'Covenant Context in Scripture', icon: '🤝', duration: '35 min' },
        { id: 'intermediate-exam', title: 'Methods Certification Exam', icon: '🏆', duration: '60 min', isExam: true }
      ],
      advanced: [
        { id: 'textual-criticism', title: 'Introduction to Textual Criticism', icon: '🔬', duration: '45 min' },
        { id: 'cultural-context', title: 'Ancient Near Eastern Context', icon: '🏺', duration: '40 min' },
        { id: 'intertextuality', title: 'Intertextuality & Scripture', icon: '🔗', duration: '45 min' },
        { id: 'discourse-analysis', title: 'Discourse & Rhetorical Analysis', icon: '🗣️', duration: '50 min' },
        { id: 'canonical-interpretation', title: 'Canonical Interpretation', icon: '📚', duration: '40 min' },
        { id: 'theological-interpretation', title: 'Theological Interpretation', icon: '✝️', duration: '45 min' },
        { id: 'application-principles', title: 'Principles of Application', icon: '💡', duration: '40 min' },
        { id: 'common-pitfalls', title: 'Avoiding Interpretive Pitfalls', icon: '⚠️', duration: '35 min' },
        { id: 'advanced-exam', title: 'Advanced Certification Exam', icon: '👑', duration: '75 min', isExam: true }
      ]
    };
    return levelMap[level] || [];
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    const lesson = getLessonsForLevel(selectedLevel).find(l => l.id === selectedLesson);
    const isFirstCompletion = !completedLessons[selectedLevel]?.includes(selectedLesson);

    // Mark lesson as completed
    if (isFirstCompletion) {
      setCompletedLessons(prev => ({
        ...prev,
        [selectedLevel]: [...new Set([...prev[selectedLevel], selectedLesson])]
      }));
    }

    // Call onComplete for section completion (for points tracking)
    if (lesson && !lesson.isExam) {
      onComplete({
        type: 'lesson',
        level: selectedLevel,
        lessonId: selectedLesson,
        lessonTitle: lesson.title,
        isFirstCompletion
      });
    } else if (lesson?.isExam) {
      onComplete({ type: 'course-level', level: selectedLevel });
    }

    setShowQuiz(false);
    setSelectedLesson(null);
  };

  const handleQuizRetry = () => {
    setShowQuiz(false);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedLesson(null);
    setShowQuiz(false);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
    setShowQuiz(false);
  };

  // Quiz view
  if (showQuiz && selectedLesson) {
    const lesson = getLessonsForLevel(selectedLevel).find(l => l.id === selectedLesson);
    const questions = quizData[selectedLevel]?.[selectedLesson]?.questions || [];

    return (
      <HermeneuticsQuiz
        questions={questions}
        lessonTitle={lesson.title}
        isExam={lesson.isExam}
        onComplete={handleQuizComplete}
        onRetry={handleQuizRetry}
      />
    );
  }

  // Lesson content viewer
  if (selectedLesson) {
    const lessons = getLessonsForLevel(selectedLevel);
    const lesson = lessons.find(l => l.id === selectedLesson);
    const isCompleted = completedLessons[selectedLevel]?.includes(selectedLesson);

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-teal-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToLessons}
                className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Lessons
              </button>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={20} />
                  <span className="text-sm font-semibold">Completed</span>
                </div>
              )}
            </div>

            {/* Lesson Title */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{lesson?.icon}</div>
              <h2 className="text-3xl font-bold text-teal-400 mb-2">{lesson?.title}</h2>
              <p className="text-slate-300 text-sm uppercase tracking-wide">
                {selectedLevel} Level
              </p>
            </div>

            {/* Content Area */}
            {lesson?.isExam ? (
              <div className="bg-slate-900/50 rounded-xl p-6 mb-6 text-white space-y-4">
                <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4">
                  <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                    <Trophy size={20} />
                    Certification Exam
                  </h3>
                  <p className="text-slate-300 text-sm mb-2">
                    This comprehensive exam tests your understanding of all {selectedLevel} level concepts.
                    Pass to earn your certification and unlock the next level!
                  </p>
                  <p className="text-yellow-300 text-sm">
                    <strong>Passing Score:</strong> {lesson.id === 'advanced-exam' ? '80%' : '70%'}
                  </p>
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all"
                >
                  Start Certification Exam
                </button>
              </div>
            ) : (
              <>
                {/* Detailed Lesson Content */}
                {lessonContent[selectedLevel]?.[selectedLesson]?.sections ? (
                  <div className="mb-8">
                    {lessonContent[selectedLevel][selectedLesson].sections.map((section, index) => (
                      <div key={index} className="mb-8">
                        <h3 className="text-2xl font-bold text-teal-300 mb-4 flex items-center gap-2">
                          <BookOpen size={24} />
                          {section.title}
                        </h3>
                        <div className="bg-slate-900/50 rounded-xl p-6">
                          <div className="text-white whitespace-pre-line leading-relaxed">
                            {section.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900/50 rounded-xl p-6 mb-8 text-white space-y-4">
                    <p className="text-lg leading-relaxed">
                      📚 This lesson provides comprehensive instruction on {lesson?.title.toLowerCase()}.
                    </p>
                    <p className="text-slate-300">
                      You'll learn biblical interpretation principles, proper methodology, and practical application
                      techniques used by scholars and pastors worldwide.
                    </p>
                    <div className="bg-teal-900/30 border border-teal-500/30 rounded-lg p-4">
                      <h3 className="text-teal-400 font-bold mb-2">Learning Objectives:</h3>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Understand core hermeneutical principles</li>
                        <li>Apply proper interpretive methods to Scripture</li>
                        <li>Recognize common interpretive errors</li>
                        <li>Develop skills for accurate biblical analysis</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Take Quiz Button */}
                <button
                  onClick={handleStartQuiz}
                  disabled={isCompleted}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    isCompleted
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle size={20} />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      Take Quiz
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Lessons list for selected level
  if (selectedLevel) {
    const lessons = getLessonsForLevel(selectedLevel);
    const progress = getLevelProgress(selectedLevel);

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToLevels}
              className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-lg"
            >
              <ArrowLeft size={24} />
              Back to Levels
            </button>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Exit Course
            </button>
          </div>

          {/* Level Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-teal-400 mb-2 capitalize">{selectedLevel} Level</h2>
            <div className="flex items-center justify-center gap-2 text-white">
              <Trophy size={20} />
              <span>{progress.completed} / {progress.total} Lessons Completed</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-800 rounded-full h-4 mb-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* Lessons Grid */}
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons[selectedLevel]?.includes(lesson.id);
              const isLocked = index > 0 && !completedLessons[selectedLevel]?.includes(lessons[index - 1].id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => !isLocked && setSelectedLesson(lesson.id)}
                  disabled={isLocked}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    isLocked
                      ? 'bg-slate-700/50 border-slate-600 cursor-not-allowed opacity-50'
                      : isCompleted
                      ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500 hover:border-green-400'
                      : lesson.isExam
                      ? 'bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border-teal-500 hover:border-teal-400'
                      : 'bg-slate-800 border-slate-600 hover:border-teal-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{lesson.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{lesson.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span>⏱️ {lesson.duration}</span>
                          {lesson.isExam && <span className="text-teal-400">🎓 Certification</span>}
                        </div>
                      </div>
                    </div>
                    <div>
                      {isLocked ? (
                        <Lock className="text-slate-500" size={24} />
                      ) : isCompleted ? (
                        <CheckCircle className="text-green-400" size={28} />
                      ) : (
                        <ChevronRight className="text-teal-400" size={28} />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Main Course Overview
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Lightbulb className="text-teal-400" size={64} />
            <h1 className="text-5xl font-bold text-teal-400">Hermeneutics</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Biblical Interpretation Complete Course</h2>
          <p className="text-cyan-200 text-lg">
            Master the art and science of interpreting Scripture
          </p>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-teal-500/30 text-center">
            <div className="text-teal-400 text-3xl font-bold">
              {completedLessons.beginner.length + completedLessons.intermediate.length + completedLessons.advanced.length}
            </div>
            <div className="text-slate-300 text-sm">Lessons Completed</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-teal-500/30 text-center">
            <div className="text-teal-400 text-3xl font-bold">
              {[completedLessons.beginner, completedLessons.intermediate, completedLessons.advanced]
                .filter(level => level.some(id => id.includes('exam'))).length}
            </div>
            <div className="text-slate-300 text-sm">Certifications Earned</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-teal-500/30 text-center">
            <div className="text-teal-400 text-3xl font-bold">3</div>
            <div className="text-slate-300 text-sm">Total Levels</div>
          </div>
        </div>

        {/* Level Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Beginner Level */}
          <div
            onClick={() => isLevelUnlocked('beginner') && setSelectedLevel('beginner')}
            className={`bg-slate-800 rounded-2xl p-6 border-2 transition-all cursor-pointer ${
              isLevelUnlocked('beginner')
                ? 'border-green-500 hover:border-green-400 hover:scale-105'
                : 'border-slate-600 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">🌱</div>
              <h3 className="text-2xl font-bold text-green-400 mb-1">Beginner</h3>
              <p className="text-slate-400 text-sm">Foundations</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <Star size={16} className="text-teal-400" />
                <span>What Is Hermeneutics?</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Star size={16} className="text-teal-400" />
                <span>Four Pillars of Interpretation</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Star size={16} className="text-teal-400" />
                <span>Context & Genre Study</span>
              </div>
            </div>

            {(() => {
              const progress = getLevelProgress('beginner');
              return (
                <>
                  <div className="bg-slate-900 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="bg-green-500 h-full transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-center text-slate-400 text-xs">
                    {progress.completed}/{progress.total} Complete
                  </div>
                </>
              );
            })()}
          </div>

          {/* Intermediate Level */}
          <div
            onClick={() => isLevelUnlocked('intermediate') && setSelectedLevel('intermediate')}
            className={`bg-slate-800 rounded-2xl p-6 border-2 transition-all cursor-pointer ${
              isLevelUnlocked('intermediate')
                ? 'border-blue-500 hover:border-blue-400 hover:scale-105'
                : 'border-slate-600 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">🔥</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-1">Intermediate</h3>
              <p className="text-slate-400 text-sm">Methods</p>
              {!isLevelUnlocked('intermediate') && (
                <div className="flex items-center justify-center gap-1 text-orange-400 text-xs mt-2">
                  <Lock size={12} />
                  <span>Complete 3 Beginner lessons</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <Zap size={16} className="text-teal-400" />
                <span>Grammatical-Historical Method</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Zap size={16} className="text-teal-400" />
                <span>Interpreting Genres</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Zap size={16} className="text-teal-400" />
                <span>Typology & Symbolism</span>
              </div>
            </div>

            {(() => {
              const progress = getLevelProgress('intermediate');
              return (
                <>
                  <div className="bg-slate-900 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-center text-slate-400 text-xs">
                    {progress.completed}/{progress.total} Complete
                  </div>
                </>
              );
            })()}
          </div>

          {/* Advanced Level */}
          <div
            onClick={() => isLevelUnlocked('advanced') && setSelectedLevel('advanced')}
            className={`bg-slate-800 rounded-2xl p-6 border-2 transition-all cursor-pointer ${
              isLevelUnlocked('advanced')
                ? 'border-purple-500 hover:border-purple-400 hover:scale-105'
                : 'border-slate-600 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">💎</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-1">Advanced</h3>
              <p className="text-slate-400 text-sm">Mastery</p>
              {!isLevelUnlocked('advanced') && (
                <div className="flex items-center justify-center gap-1 text-orange-400 text-xs mt-2">
                  <Lock size={12} />
                  <span>Complete 3 Intermediate lessons</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <Target size={16} className="text-teal-400" />
                <span>Textual Criticism</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Target size={16} className="text-teal-400" />
                <span>Canonical Interpretation</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Target size={16} className="text-teal-400" />
                <span>Application Principles</span>
              </div>
            </div>

            {(() => {
              const progress = getLevelProgress('advanced');
              return (
                <>
                  <div className="bg-slate-900 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-center text-slate-400 text-xs">
                    {progress.completed}/{progress.total} Complete
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onCancel}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default HermeneuticsCourse;
