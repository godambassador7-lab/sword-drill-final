import React, { useState } from 'react';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy,
  GraduationCap, Zap, Target, Award, ArrowLeft, Scroll
} from 'lucide-react';

const AncientHebrewCourse = ({ onComplete, onCancel }) => {
  const [selectedLevel, setSelectedLevel] = useState(null); // 'beginner', 'intermediate', 'advanced'
  const [selectedLesson, setSelectedLesson] = useState(null);
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
        { id: 'alphabet', title: 'The Hebrew Alphabet (Aleph-Bet)', icon: 'א', duration: '20 min' },
        { id: 'pronunciation', title: 'Pronunciation & Vowel Points', icon: 'ָ', duration: '25 min' },
        { id: 'grammar', title: 'Basic Grammar Foundations', icon: '📖', duration: '30 min' },
        { id: 'vocab-150', title: 'Essential Vocabulary (150 words)', icon: '📚', duration: '30 min' },
        { id: 'reading-practice', title: 'Reading Practice', icon: '📜', duration: '25 min' },
        { id: 'beginner-exam', title: 'Beginner Certification Exam', icon: '🎓', duration: '45 min', isExam: true }
      ],
      intermediate: [
        { id: 'verb-system', title: 'Hebrew Verb System (Binyanim)', icon: 'פ', duration: '40 min' },
        { id: 'nouns-adjectives', title: 'Nouns & Adjectives', icon: 'ש', duration: '35 min' },
        { id: 'construct-state', title: 'The Construct State (Smichut)', icon: '🔗', duration: '30 min' },
        { id: 'prepositions', title: 'Prepositions & Particles', icon: 'מ', duration: '30 min' },
        { id: 'intermediate-vocab', title: 'Intermediate Vocabulary', icon: '📚', duration: '35 min' },
        { id: 'biblical-texts', title: 'Reading Biblical Texts', icon: '📜', duration: '40 min' },
        { id: 'intermediate-exam', title: 'Intermediate Certification Exam', icon: '🏆', duration: '60 min', isExam: true }
      ],
      advanced: [
        { id: 'syntax', title: 'Advanced Hebrew Syntax', icon: '🔀', duration: '45 min' },
        { id: 'poetry', title: 'Biblical Poetry & Parallelism', icon: '📝', duration: '40 min' },
        { id: 'narrative', title: 'Hebrew Narrative Techniques', icon: '📖', duration: '45 min' },
        { id: 'prophetic-texts', title: 'Prophetic Literature', icon: '⚡', duration: '40 min' },
        { id: 'textual-criticism', title: 'Masoretic Text & Variants', icon: '📜', duration: '45 min' },
        { id: 'advanced-vocab', title: 'Theological & Rare Vocabulary', icon: '✡️', duration: '35 min' },
        { id: 'aramaic-intro', title: 'Introduction to Biblical Aramaic', icon: 'ܐ', duration: '50 min' },
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
    setSelectedLesson(null);
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedLesson(null);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  // Lesson content viewer
  if (selectedLesson) {
    const lessons = getLessonsForLevel(selectedLevel);
    const lesson = lessons.find(l => l.id === selectedLesson);

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-amber-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToLessons}
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Lessons
              </button>
              <div className="text-amber-400 text-sm font-semibold">
                {lesson?.duration}
              </div>
            </div>

            {/* Lesson Title */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{lesson?.icon}</div>
              <h2 className="text-3xl font-bold text-amber-400 mb-2">{lesson?.title}</h2>
              <p className="text-slate-300 text-sm uppercase tracking-wide">
                {selectedLevel} Level
              </p>
            </div>

            {/* Lesson Content */}
            <div className="bg-slate-900/50 rounded-xl p-6 mb-6 text-white space-y-4">
              <p className="text-lg leading-relaxed">
                📚 This lesson covers fundamental concepts of Ancient Hebrew.
              </p>
              <p className="text-slate-300">
                The content for this lesson includes comprehensive instruction on {lesson?.title.toLowerCase()},
                with practice exercises, examples from Biblical texts, and interactive drills.
              </p>
              <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4 mt-4">
                <h3 className="text-amber-400 font-bold mb-2">Learning Objectives:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Understand core Hebrew linguistic principles</li>
                  <li>Apply knowledge to Biblical text analysis</li>
                  <li>Practice reading and comprehension</li>
                  <li>Build vocabulary and grammatical awareness</li>
                </ul>
              </div>
            </div>

            {/* Complete Button */}
            <button
              onClick={() => handleLessonComplete(selectedLesson)}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle size={24} />
              Mark as Complete
            </button>
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
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToLevels}
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-lg"
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
            <h2 className="text-4xl font-bold text-amber-400 mb-2 capitalize">{selectedLevel} Level</h2>
            <div className="flex items-center justify-center gap-2 text-white">
              <Trophy size={20} />
              <span>{progress.completed} / {progress.total} Lessons Completed</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-800 rounded-full h-4 mb-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-500"
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
                      ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500 hover:border-amber-400'
                      : 'bg-slate-800 border-slate-600 hover:border-amber-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{lesson.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{lesson.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span>⏱️ {lesson.duration}</span>
                          {lesson.isExam && <span className="text-amber-400">🎓 Certification</span>}
                        </div>
                      </div>
                    </div>
                    <div>
                      {isLocked ? (
                        <Lock className="text-slate-500" size={24} />
                      ) : isCompleted ? (
                        <CheckCircle className="text-green-400" size={28} />
                      ) : (
                        <ChevronRight className="text-amber-400" size={28} />
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
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Scroll className="text-amber-400" size={64} />
            <h1 className="text-5xl font-bold text-amber-400">עברית עתיקה</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Ancient Hebrew Complete Course</h2>
          <p className="text-amber-200 text-lg">
            Master the language of the Hebrew Bible
          </p>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30 text-center">
            <div className="text-amber-400 text-3xl font-bold">
              {completedLessons.beginner.length + completedLessons.intermediate.length + completedLessons.advanced.length}
            </div>
            <div className="text-slate-300 text-sm">Lessons Completed</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30 text-center">
            <div className="text-amber-400 text-3xl font-bold">
              {[completedLessons.beginner, completedLessons.intermediate, completedLessons.advanced]
                .filter(level => level.some(id => id.includes('exam'))).length}
            </div>
            <div className="text-slate-300 text-sm">Certifications Earned</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30 text-center">
            <div className="text-amber-400 text-3xl font-bold">3</div>
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
              <p className="text-slate-400 text-sm">Foundation Level</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <Star size={16} className="text-amber-400" />
                <span>Hebrew Alphabet</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Star size={16} className="text-amber-400" />
                <span>Pronunciation & Vowels</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Star size={16} className="text-amber-400" />
                <span>150 Essential Words</span>
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
              <p className="text-slate-400 text-sm">Development Level</p>
              {!isLevelUnlocked('intermediate') && (
                <div className="flex items-center justify-center gap-1 text-orange-400 text-xs mt-2">
                  <Lock size={12} />
                  <span>Complete 3 Beginner lessons</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <Zap size={16} className="text-amber-400" />
                <span>Verb System (Binyanim)</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Zap size={16} className="text-amber-400" />
                <span>Nouns & Construct State</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Zap size={16} className="text-amber-400" />
                <span>Biblical Text Reading</span>
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
              <p className="text-slate-400 text-sm">Mastery Level</p>
              {!isLevelUnlocked('advanced') && (
                <div className="flex items-center justify-center gap-1 text-orange-400 text-xs mt-2">
                  <Lock size={12} />
                  <span>Complete 3 Intermediate lessons</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <Target size={16} className="text-amber-400" />
                <span>Advanced Syntax</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Target size={16} className="text-amber-400" />
                <span>Poetry & Prophecy</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Target size={16} className="text-amber-400" />
                <span>Biblical Aramaic</span>
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

export default AncientHebrewCourse;
