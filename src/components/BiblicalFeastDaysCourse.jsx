import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, CheckCircle, ArrowLeft, Book, Calendar
} from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const BiblicalFeastDaysCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(() => {
    return userData?.feastDaysProgress?.completedLessons || [];
  });

  // Hydrate from userData when it changes (handles late Firebase load)
  useEffect(() => {
    if (userData?.feastDaysProgress?.completedLessons) {
      setCompletedLessons(userData.feastDaysProgress.completedLessons);
    }
  }, [userData?.feastDaysProgress]);

  // Persist progress to localStorage + Firebase
  useEffect(() => {
    const progressPayload = { completedLessons };
    localStorage.setItem('feastDaysProgress', JSON.stringify(progressPayload));

    if (setUserData) {
      setUserData(prev => ({ ...prev, feastDaysProgress: progressPayload }));
    }

    if (userId) {
      updateUserProgress(userId, { feastDaysProgress: progressPayload }).catch(err =>
        console.error('Error saving Feast Days progress:', err)
      );
    }
  }, [completedLessons, userId, setUserData]);

  const lessons = [
    { id: '01', title: 'Foundations', file: 'Level_1_Foundations.txt', icon: '📜', duration: '25 min', level: 'Level 1' },
    { id: '02', title: 'Interpretation', file: 'Level_2_Interpretation.txt', icon: '✝️', duration: '30 min', level: 'Level 2' },
    { id: '03', title: 'Theology & Fulfillment', file: 'Level_3_Fulfillment.txt', icon: '🎓', duration: '35 min', level: 'Level 3' }
  ];

  const loadLessonContent = async (lesson) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.PUBLIC_URL || ''}/Biblical_Feast_Days_Course/${lesson.file}`);
      if (!response.ok) throw new Error('Failed to load lesson');
      const text = await response.text();
      setLessonContent(text);
      setSelectedLesson(lesson);
    } catch (error) {
      console.error('Error loading lesson:', error);
      setLessonContent('# Error Loading Lesson\n\nUnable to load the lesson content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
      if (onComplete) {
        onComplete({ lessonId });
      }
    }
  };

  const renderContent = (content) => {
    return content
      .split('\n')
      .map((line, idx) => {
        // Headers
        if (line.startsWith('LEVEL ')) {
          return <h1 key={idx} className="text-3xl font-bold text-purple-400 mb-4 mt-6">{line}</h1>;
        }
        if (line.startsWith('MODULE ')) {
          return <h2 key={idx} className="text-2xl font-bold text-cyan-400 mb-3 mt-5">{line}</h2>;
        }
        if (line.startsWith('ASSESSMENTS:') || line.startsWith('CAPSTONE OPTIONS:')) {
          return <h3 key={idx} className="text-xl font-bold text-amber-400 mb-2 mt-4">{line}</h3>;
        }

        // Key Texts
        if (line.startsWith('Key Texts:')) {
          return <h4 key={idx} className="text-lg font-bold text-emerald-400 mb-2 mt-3">{line}</h4>;
        }

        // Lists
        if (line.match(/^[\-–]\s/)) {
          return <li key={idx} className="text-slate-200 ml-6 mb-1 list-disc">{line.slice(2)}</li>;
        }

        // Empty lines
        if (line.trim() === '') {
          return <br key={idx} />;
        }

        // Regular paragraphs
        return <p key={idx} className="text-slate-300 mb-2 leading-relaxed">{line}</p>;
      });
  };

  const progress = {
    completed: completedLessons.length,
    total: lessons.length,
    percentage: Math.round((completedLessons.length / lessons.length) * 100)
  };

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Lessons
            </button>
            {!completedLessons.includes(selectedLesson.id) && (
              <button
                onClick={() => markLessonComplete(selectedLesson.id)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                <CheckCircle size={18} />
                Mark Complete
              </button>
            )}
            {completedLessons.includes(selectedLesson.id) && (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle size={18} />
                Completed
              </div>
            )}
          </div>

          {/* Lesson Header */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl p-6 border-2 border-purple-500/50 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{selectedLesson.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedLesson.title}</h1>
                <p className="text-purple-300 text-sm">{selectedLesson.level} • {selectedLesson.duration}</p>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            {loading ? (
              <div className="text-center text-slate-400 py-12">Loading lesson content...</div>
            ) : (
              <div className="prose prose-invert max-w-none">
                {renderContent(lessonContent)}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
                if (currentIndex > 0) {
                  loadLessonContent(lessons[currentIndex - 1]);
                }
              }}
              disabled={lessons.findIndex(l => l.id === selectedLesson.id) === 0}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              <ArrowLeft size={18} />
              Previous
            </button>
            <button
              onClick={() => {
                const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
                if (currentIndex < lessons.length - 1) {
                  loadLessonContent(lessons[currentIndex + 1]);
                }
              }}
              disabled={lessons.findIndex(l => l.id === selectedLesson.id) === lessons.length - 1}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar size={32} className="text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Biblical Feast Days</h1>
              <p className="text-slate-400">Sacred Times & Appointed Feasts</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/30 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-300 font-semibold">Course Progress</span>
            <span className="text-slate-300">{progress.completed} / {progress.total} lessons</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Course Description */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/30 mb-6">
          <h2 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
            <Book size={24} />
            About This Course
          </h2>
          <p className="text-slate-300 mb-3">
            Explore the biblical foundation of sacred time as instituted by God. This elective course examines the feast days commanded in Leviticus 23, their observance in Second Temple Judaism, their significance in the life of Jesus, and their theological fulfillment in Christian understanding.
          </p>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-purple-400 mt-1 flex-shrink-0" />
              <span><strong>Level 1:</strong> Foundations of biblical feast days and their commandments</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-purple-400 mt-1 flex-shrink-0" />
              <span><strong>Level 2:</strong> Feasts in Second Temple Judaism and the life of Jesus</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-purple-400 mt-1 flex-shrink-0" />
              <span><strong>Level 3:</strong> Theological interpretation and fulfillment themes</span>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Course Modules</h2>
          {lessons.map(lesson => {
            const isCompleted = completedLessons.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                onClick={() => loadLessonContent(lesson)}
                className={`bg-slate-800/50 border-2 ${
                  isCompleted ? 'border-emerald-500/50' : 'border-purple-500/30'
                } rounded-xl p-4 hover:bg-slate-700/50 transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{lesson.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                      <p className="text-sm text-slate-400">{lesson.level} • {lesson.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle size={20} />
                        <span className="hidden sm:inline">Completed</span>
                      </div>
                    )}
                    <ChevronRight size={24} className="text-purple-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {progress.percentage === 100 && (
          <div className="mt-6 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-2 border-emerald-500/50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold text-emerald-300 mb-2">
              Course Complete!
            </h3>
            <p className="text-slate-300">
              Congratulations on completing Biblical Feast Days! You've gained deep insight into God's appointed times and their fulfillment in Christ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiblicalFeastDaysCourse;
