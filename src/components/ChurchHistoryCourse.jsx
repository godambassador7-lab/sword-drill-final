import React, { useState } from 'react';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy,
  GraduationCap, Zap, Target, Award, ArrowLeft, Church, Globe, Scroll
} from 'lucide-react';
import courseData from '../data/church_history_course/course_content.json';
import quizData from '../data/church_history_course/quiz_content.json';
import lessonContent from '../data/church_history_course/lesson_content.json';
import ChurchHistoryQuiz from './ChurchHistoryQuiz';

const ChurchHistoryCourse = ({ onComplete, onCancel }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState({
    beginner: [],
    intermediate: [],
    advanced: []
  });

  // Check if a level is unlocked
  const isLevelUnlocked = (level) => {
    if (level === 'beginner') return true;
    if (level === 'intermediate') return completedLessons.beginner.length >= 5;
    if (level === 'advanced') return completedLessons.intermediate.length >= 6;
    return false;
  };

  // Get level progress
  const getLevelProgress = (level) => {
    const totalLessons = courseData.levels[level].lessons.length;
    const completed = completedLessons[level]?.length || 0;
    return { completed, total: totalLessons, percentage: (completed / totalLessons) * 100 };
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    // Mark lesson as completed
    setCompletedLessons(prev => ({
      ...prev,
      [selectedLevel]: [...new Set([...prev[selectedLevel], selectedLesson])]
    }));

    // Check if this was an exam
    const lesson = courseData.levels[selectedLevel].lessons.find(l => l.id === selectedLesson);
    if (lesson?.isExam) {
      // Award course completion points
      const completionType = selectedLevel === 'beginner' ? 'lesson' :
                            selectedLevel === 'intermediate' ? 'level' : 'course';
      onComplete({ type: completionType, level: selectedLevel });
    }

    setShowQuiz(false);
    setSelectedLesson(null);
  };

  const handleQuizRetry = () => {
    setShowQuiz(false);
    // Stay on the same lesson to allow retry
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedLesson(null);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  // Quiz view
  if (showQuiz && selectedLesson) {
    const lessonData = courseData.levels[selectedLevel].lessons.find(l => l.id === selectedLesson);
    const questions = quizData[selectedLevel]?.[selectedLesson]?.questions || [];

    return (
      <ChurchHistoryQuiz
        questions={questions}
        lessonTitle={lessonData.title}
        isExam={lessonData.isExam}
        onComplete={handleQuizComplete}
        onRetry={handleQuizRetry}
      />
    );
  }

  // Lesson content viewer
  if (selectedLesson) {
    const lessonData = courseData.levels[selectedLevel].lessons.find(l => l.id === selectedLesson);
    const isCompleted = completedLessons[selectedLevel]?.includes(selectedLesson);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-purple-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToLessons}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Lessons
              </button>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={20} />
                  Completed
                </div>
              )}
            </div>

            {/* Lesson Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{lessonData.icon}</div>
              <h2 className="text-3xl font-bold text-white mb-2">{lessonData.title}</h2>
              <p className="text-purple-300">Duration: {lessonData.duration}</p>
            </div>

            {/* Lesson Content */}
            {lessonData.isExam ? (
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-8 mb-6">
                <div className="text-center mb-6">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">Certification Exam</h3>
                  <p className="text-white mb-4">
                    This exam covers all the material from the {selectedLevel} level lessons.
                  </p>
                  <p className="text-purple-200">
                    Complete all lessons before taking the exam to earn your certification and unlock the next level!
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-bold text-white mb-4">Exam Format:</h4>
                  <ul className="space-y-2 text-purple-200">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>Multiple choice and true/false questions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>Questions cover all lesson topics from this level</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>Must score 70% or higher to pass</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>Can retake if needed to improve your score</span>
                    </li>
                  </ul>
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
                {lessonContent[selectedLevel]?.[selectedLesson]?.sections && (
                  <div className="mb-8">
                    {lessonContent[selectedLevel][selectedLesson].sections.map((section, index) => (
                      <div key={index} className="mb-8">
                        <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
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
                )}

                {/* Topics Section - Fallback if no detailed content */}
                {!lessonContent[selectedLevel]?.[selectedLesson] && lessonData.topics && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                      <BookOpen size={24} />
                      Topics Covered
                    </h3>
                    <div className="bg-slate-900/50 rounded-xl p-6">
                      <ul className="space-y-3">
                        {lessonData.topics.map((topic, index) => (
                          <li key={index} className="flex items-start gap-3 text-white">
                            <span className="text-purple-400 font-bold">{index + 1}.</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Key Points Section */}
                {lessonData.keyPoints && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                      <Target size={24} />
                      Key Learning Points
                    </h3>
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 rounded-xl p-6">
                      <ul className="space-y-4">
                        {lessonData.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                            <span className="text-white">{point}</span>
                          </li>
                        ))}
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
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
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

  // Lesson list view
  if (selectedLevel) {
    const levelData = courseData.levels[selectedLevel];
    const progress = getLevelProgress(selectedLevel);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBackToLevels}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              Back to Levels
            </button>
            <div className="bg-slate-800 rounded-2xl p-6 border-2 border-purple-500">
              <h2 className="text-3xl font-bold text-white mb-2">{levelData.title}</h2>
              <p className="text-purple-200 mb-4">{levelData.description}</p>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-purple-300 mb-1">
                  <span>Progress</span>
                  <span>{progress.completed} / {progress.total} lessons</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="space-y-4">
            {levelData.lessons.map((lesson, index) => {
              const isCompleted = completedLessons[selectedLevel]?.includes(lesson.id);
              const isLocked = index > 0 && !completedLessons[selectedLevel]?.includes(levelData.lessons[index - 1].id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => !isLocked && setSelectedLesson(lesson.id)}
                  disabled={isLocked}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    isLocked
                      ? 'bg-slate-800/50 border-slate-700 cursor-not-allowed opacity-50'
                      : isCompleted
                      ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500 hover:border-green-400'
                      : 'bg-slate-800 border-purple-500 hover:border-purple-400 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{lesson.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{lesson.title}</h3>
                        <p className="text-purple-300 text-sm">{lesson.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLocked && <Lock size={24} className="text-slate-500" />}
                      {isCompleted && <CheckCircle size={24} className="text-green-400" />}
                      {!isLocked && !isCompleted && <ChevronRight size={24} className="text-purple-400" />}
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

  // Level selection view
  const levels = [
    {
      id: 'beginner',
      title: 'Beginner',
      subtitle: courseData.levels.beginner.title,
      icon: <Globe className="w-12 h-12" />,
      color: 'from-green-600 to-emerald-600',
      borderColor: 'border-green-500',
      unlocked: isLevelUnlocked('beginner')
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      subtitle: courseData.levels.intermediate.title,
      icon: <Church className="w-12 h-12" />,
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500',
      unlocked: isLevelUnlocked('intermediate')
    },
    {
      id: 'advanced',
      title: 'Advanced',
      subtitle: courseData.levels.advanced.title,
      icon: <Scroll className="w-12 h-12" />,
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500',
      unlocked: isLevelUnlocked('advanced')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="text-center mb-12">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="mb-6">
            <Church className="w-20 h-20 mx-auto mb-4 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {courseData.courseTitle}
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            {courseData.courseDescription}
          </p>
        </div>

        {/* Level Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {levels.map((level) => {
            const progress = getLevelProgress(level.id);

            return (
              <button
                key={level.id}
                onClick={() => level.unlocked && setSelectedLevel(level.id)}
                disabled={!level.unlocked}
                className={`relative p-6 rounded-2xl border-2 ${level.borderColor} transition-all ${
                  level.unlocked
                    ? `bg-gradient-to-br ${level.color} hover:scale-105 hover:shadow-2xl`
                    : 'bg-slate-800/50 opacity-50 cursor-not-allowed'
                }`}
              >
                {!level.unlocked && (
                  <div className="absolute top-4 right-4">
                    <Lock size={24} className="text-slate-400" />
                  </div>
                )}

                <div className="text-white mb-4">{level.icon}</div>

                <h2 className="text-2xl font-bold text-white mb-2">{level.title}</h2>
                <p className="text-sm text-white/80 mb-4">{level.subtitle}</p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>Progress</span>
                    <span>{progress.completed}/{progress.total}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                {progress.percentage === 100 && (
                  <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold">
                    <Trophy size={20} />
                    Completed!
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Course Info */}
        <div className="bg-slate-800/50 rounded-xl p-8 border-2 border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <GraduationCap size={28} className="text-purple-400" />
            What You'll Learn
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-purple-100">
            <div>
              <h4 className="font-bold text-white mb-2">📖 Biblical Culture</h4>
              <p className="text-sm">Daily life, customs, festivals, and worship practices in ancient Israel</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">⛪ Temple & Synagogue</h4>
              <p className="text-sm">Second Temple Judaism and the context of Jesus' ministry</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">🔥 Early Church</h4>
              <p className="text-sm">From Pentecost to Paul's missionary journeys and church planting</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">📜 Church Fathers</h4>
              <p className="text-sm">Apostolic fathers, councils, heresies, and theological development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurchHistoryCourse;
