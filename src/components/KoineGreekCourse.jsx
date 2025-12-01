import React, { useState } from 'react';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy,
  GraduationCap, Zap, Target, Award, ArrowLeft, Play
} from 'lucide-react';
import { koineGreekModules } from '../data/koineGreekCourse';
import { koineLessonContent } from '../data/koineGreekLessonContent';
import GreekQuizManager from './GreekQuizManager';

const KoineGreekCourse = ({ onComplete, onCancel }) => {
  const [selectedLevel, setSelectedLevel] = useState(null); // 'beginner', 'intermediate', 'advanced'
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showQuizManager, setShowQuizManager] = useState(false);
  const [completedLessons, setCompletedLessons] = useState({
    beginner: [],
    intermediate: [],
    advanced: []
  });

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
        { id: 'alphabet', title: 'The Greek Alphabet', icon: '📝', duration: '15 min' },
        { id: 'pronunciation', title: 'Pronunciation & Breathing Marks', icon: '🗣️', duration: '20 min' },
        { id: 'basic-vocab', title: 'Essential Vocabulary (50 words)', icon: '📚', duration: '25 min' },
        { id: 'articles', title: 'The Definite Article', icon: 'ὁ', duration: '20 min' },
        { id: 'nouns-intro', title: 'Introduction to Nouns', icon: '📖', duration: '30 min' },
        { id: 'beginner-exam', title: 'Beginner Certification Exam', icon: '🎓', duration: '45 min', isExam: true }
      ],
      intermediate: [
        { id: 'noun-cases', title: 'The Five Cases', icon: '📋', duration: '30 min' },
        { id: 'declensions', title: '1st & 2nd Declensions', icon: 'N', duration: '35 min' },
        { id: 'verbs-intro', title: 'Introduction to Verbs', icon: 'V', duration: '30 min' },
        { id: 'present-tense', title: 'Present Active Indicative', icon: '⏱️', duration: '40 min' },
        { id: 'intermediate-vocab', title: 'Intermediate Vocabulary', icon: '📚', duration: '30 min' },
        { id: 'sentence-structure', title: 'Basic Sentence Structure', icon: '🔗', duration: '35 min' },
        { id: 'intermediate-exam', title: 'Intermediate Certification Exam', icon: '🏆', duration: '60 min', isExam: true }
      ],
      advanced: [
        { id: 'verb-system', title: 'Complete Verb System', icon: 'V', duration: '45 min' },
        { id: 'participles', title: 'Participles & Their Uses', icon: '⚡', duration: '40 min' },
        { id: 'syntax', title: 'Greek Syntax & Word Order', icon: '🔀', duration: '50 min' },
        { id: 'conditionals', title: 'Conditional Sentences', icon: '❓', duration: '35 min' },
        { id: 'aspect', title: 'Verbal Aspect Theory', icon: '🎯', duration: '40 min' },
        { id: 'advanced-vocab', title: 'Theological Vocabulary', icon: '✝️', duration: '30 min' },
        { id: 'textual-criticism', title: 'Introduction to Textual Criticism', icon: '📜', duration: '45 min' },
        { id: 'advanced-exam', title: 'Advanced Certification Exam', icon: '👑', duration: '75 min', isExam: true }
      ]
    };
    return levelMap[level] || [];
  };

  const handleLessonComplete = (lessonId) => {
    setCompletedLessons(prev => ({
      ...prev,
      [selectedLevel]: [...new Set([...prev[selectedLevel], lessonId])]
    }));
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedLesson(null);
    setShowQuizManager(false);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  // Main Course Overview
  if (!selectedLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <GraduationCap className="text-amber-400" size={64} />
              <h1 className="text-5xl font-bold text-amber-400">Κοινή Greek</h1>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Complete Course</h2>
            <p className="text-blue-200 text-lg">
              Master the language of the New Testament
            </p>
            <p className="text-slate-300 text-sm mt-2">
              From alphabet to advanced syntax • Structured for Bible students
            </p>
          </div>

          {/* Course Levels */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* BEGINNER */}
            <div
              onClick={() => isLevelUnlocked('beginner') && setSelectedLevel('beginner')}
              className={`bg-slate-800 rounded-2xl p-6 border-4 transition-all transform hover:scale-105 ${
                isLevelUnlocked('beginner')
                  ? 'border-green-500 cursor-pointer hover:border-green-400 shadow-xl hover:shadow-green-500/50'
                  : 'border-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-center mb-4">
                <div className="inline-block bg-green-600 rounded-full p-4 mb-3">
                  <Star className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Beginner</h3>
                <p className="text-slate-300 text-sm">Alphabet & Foundations</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-green-400" />
                  24-letter alphabet with pronunciation
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-green-400" />
                  Breathing marks & accents
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-green-400" />
                  50 essential vocabulary words
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-green-400" />
                  Definite articles & basic nouns
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{getLevelProgress('beginner').completed}/{getLevelProgress('beginner').total}</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all"
                    style={{ width: `${getLevelProgress('beginner').percentage}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                {isLevelUnlocked('beginner') ? (
                  <div className="text-green-400 font-bold flex items-center justify-center gap-2">
                    <Play size={20} /> Start Learning
                  </div>
                ) : (
                  <div className="text-slate-500 flex items-center justify-center gap-2">
                    <Lock size={20} /> Locked
                  </div>
                )}
              </div>
            </div>

            {/* INTERMEDIATE */}
            <div
              onClick={() => isLevelUnlocked('intermediate') && setSelectedLevel('intermediate')}
              className={`bg-slate-800 rounded-2xl p-6 border-4 transition-all transform hover:scale-105 ${
                isLevelUnlocked('intermediate')
                  ? 'border-blue-500 cursor-pointer hover:border-blue-400 shadow-xl hover:shadow-blue-500/50'
                  : 'border-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-center mb-4">
                <div className="inline-block bg-blue-600 rounded-full p-4 mb-3">
                  <Trophy className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-blue-400 mb-2">Intermediate</h3>
                <p className="text-slate-300 text-sm">Cases, Tenses & Moods</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-blue-400" />
                  5 noun cases (Nom, Gen, Dat, Acc, Voc)
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-blue-400" />
                  1st & 2nd declension patterns
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-blue-400" />
                  Present active indicative verbs
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-blue-400" />
                  Sentence structure basics
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{getLevelProgress('intermediate').completed}/{getLevelProgress('intermediate').total}</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all"
                    style={{ width: `${getLevelProgress('intermediate').percentage}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                {isLevelUnlocked('intermediate') ? (
                  <div className="text-blue-400 font-bold flex items-center justify-center gap-2">
                    <Play size={20} /> Continue Learning
                  </div>
                ) : (
                  <div className="text-slate-500 flex items-center justify-center gap-2">
                    <Lock size={20} /> Complete {3 - completedLessons.beginner.length} more beginner lessons
                  </div>
                )}
              </div>
            </div>

            {/* ADVANCED */}
            <div
              onClick={() => isLevelUnlocked('advanced') && setSelectedLevel('advanced')}
              className={`bg-slate-800 rounded-2xl p-6 border-4 transition-all transform hover:scale-105 ${
                isLevelUnlocked('advanced')
                  ? 'border-purple-500 cursor-pointer hover:border-purple-400 shadow-xl hover:shadow-purple-500/50'
                  : 'border-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-center mb-4">
                <div className="inline-block bg-purple-600 rounded-full p-4 mb-3">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-purple-400 mb-2">Advanced</h3>
                <p className="text-slate-300 text-sm">Syntax & Mastery</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-purple-400" />
                  Complete verb system (all tenses)
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-purple-400" />
                  Participles & infinitives
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-purple-400" />
                  Syntax & conditional sentences
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-purple-400" />
                  Textual criticism introduction
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{getLevelProgress('advanced').completed}/{getLevelProgress('advanced').total}</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                    style={{ width: `${getLevelProgress('advanced').percentage}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                {isLevelUnlocked('advanced') ? (
                  <div className="text-purple-400 font-bold flex items-center justify-center gap-2">
                    <Play size={20} /> Master the Language
                  </div>
                ) : (
                  <div className="text-slate-500 flex items-center justify-center gap-2">
                    <Lock size={20} /> Complete {3 - completedLessons.intermediate.length} more intermediate lessons
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <button
              onClick={onCancel}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              <ArrowLeft className="inline mr-2" size={20} />
              Back to Home
            </button>
          </div>

          <div className="mt-6 bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-xl p-6 border border-amber-700/50">
            <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
              <BookOpen size={24} />
              Why Koine Greek?
            </h3>
            <div className="text-slate-300 space-y-2 text-sm">
              <p>• Read the New Testament in its original language</p>
              <p>• Discover nuances lost in translation</p>
              <p>• Access 2000+ years of Christian scholarship</p>
              <p>• Deepen your understanding of Scripture</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lesson List View (when a level is selected)
  if (selectedLevel && !selectedLesson && !showQuizManager) {
    const lessons = getLessonsForLevel(selectedLevel);
    const levelColors = {
      beginner: { border: 'border-green-500', text: 'text-green-400', bg: 'from-green-600' },
      intermediate: { border: 'border-blue-500', text: 'text-blue-400', bg: 'from-blue-600' },
      advanced: { border: 'border-purple-500', text: 'text-purple-400', bg: 'from-purple-600' }
    };
    const colors = levelColors[selectedLevel];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBackToLevels}
              className="text-white hover:text-amber-400 flex items-center gap-2 mb-4"
            >
              <ArrowLeft size={20} />
              Back to Course Overview
            </button>
            <h2 className={`text-4xl font-bold ${colors.text} mb-2 capitalize`}>
              {selectedLevel} Level
            </h2>
            <p className="text-slate-300">
              {koineGreekModules.find(m => m.levelKey === selectedLevel)?.summary}
            </p>
          </div>

          {/* Lessons Grid */}
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons[selectedLevel]?.includes(lesson.id);
              const isUnlocked = index === 0 || completedLessons[selectedLevel]?.includes(lessons[index - 1].id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => isUnlocked && setSelectedLesson(lesson)}
                  className={`bg-slate-800 rounded-xl p-6 border-2 transition-all ${
                    isUnlocked
                      ? `${colors.border} cursor-pointer hover:scale-102 hover:shadow-lg`
                      : 'border-slate-600 opacity-50 cursor-not-allowed'
                  } ${isCompleted ? 'bg-gradient-to-r from-slate-800 to-slate-700' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${lesson.isExam ? 'animate-pulse' : ''}`}>
                        {lesson.icon}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${colors.text}`}>
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-slate-400 text-sm">{lesson.duration}</span>
                          {lesson.isExam && (
                            <span className="text-amber-400 text-xs font-bold bg-amber-900/30 px-2 py-1 rounded">
                              CERTIFICATION
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      {isCompleted ? (
                        <CheckCircle className="text-green-400" size={32} />
                      ) : isUnlocked ? (
                        <ChevronRight className={colors.text} size={32} />
                      ) : (
                        <Lock className="text-slate-500" size={32} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Practice Quizzes Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowQuizManager(true)}
              className={`w-full bg-gradient-to-r ${colors.bg} to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}
            >
              <Zap size={24} />
              Practice with Interactive Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Manager View
  if (showQuizManager) {
    return (
      <GreekQuizManager
        level={selectedLevel}
        onComplete={(results) => {
          console.log('Quiz completed:', results);
          setShowQuizManager(false);
        }}
        onCancel={() => setShowQuizManager(false)}
      />
    );
  }

  // Lesson Content View
  if (selectedLesson) {
    const colors = {
      beginner: 'text-green-400',
      intermediate: 'text-blue-400',
      advanced: 'text-purple-400'
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToLessons}
            className="text-white hover:text-amber-400 flex items-center gap-2 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Lessons
          </button>

          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-amber-500">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedLesson.icon}</div>
              <h2 className={`text-3xl font-bold ${colors[selectedLevel]} mb-2`}>
                {selectedLesson.title}
              </h2>
              <p className="text-slate-400">{selectedLesson.duration} • {selectedLevel} level</p>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="bg-slate-900 rounded-lg p-6 mb-6">
                <p className="text-slate-300 leading-relaxed">
                  This lesson covers essential concepts in Koine Greek. Content includes interactive
                  examples, practice exercises, and biblical references to help you master the material.
                </p>
              </div>

              {selectedLesson.isExam ? (
                <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-6 mb-6">
                  <h3 className="text-amber-400 font-bold text-xl mb-3">Certification Exam</h3>
                  <p className="text-slate-300 mb-4">
                    This comprehensive exam tests all concepts from the {selectedLevel} level.
                    You'll need to demonstrate proficiency in:
                  </p>
                  <ul className="text-slate-300 space-y-2 mb-4">
                    <li>• Vocabulary recognition and usage</li>
                    <li>• Grammar rules and applications</li>
                    <li>• Translation accuracy</li>
                    <li>• Biblical text comprehension</li>
                  </ul>
                  <p className="text-amber-300 font-semibold">
                    Passing score: 80% or higher
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  handleLessonComplete(selectedLesson.id);
                  handleBackToLessons();
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={24} />
                Mark as Complete
              </button>
              <button
                onClick={handleBackToLessons}
                className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default KoineGreekCourse;
