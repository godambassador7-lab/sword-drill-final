import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, CheckCircle, ArrowLeft, Book, Scroll
} from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const BiblicalCanonCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(() => {
    return userData?.biblicalCanonProgress?.completedLessons || [];
  });

  // Hydrate from userData when it changes (handles late Firebase load)
  useEffect(() => {
    if (userData?.biblicalCanonProgress?.completedLessons) {
      setCompletedLessons(userData.biblicalCanonProgress.completedLessons);
    }
  }, [userData?.biblicalCanonProgress]);

  // Persist progress to localStorage + Firebase
  useEffect(() => {
    const progressPayload = { completedLessons };
    localStorage.setItem('biblicalCanonProgress', JSON.stringify(progressPayload));

    if (setUserData) {
      setUserData(prev => ({ ...prev, biblicalCanonProgress: progressPayload }));
    }

    if (userId) {
      updateUserProgress(userId, { biblicalCanonProgress: progressPayload }).catch(err =>
        console.error('Error saving Biblical Canon progress:', err)
      );
    }
  }, [completedLessons, userId, setUserData]);

  const lessons = [
    { id: '01', title: 'What Is Canon', file: '01_What_Is_Canon.md', icon: '📚', duration: '15 min' },
    { id: '02', title: 'Hebrew Tanakh Canon', file: '02_Hebrew_Tanakh_Canon.md', icon: '📖', duration: '20 min' },
    { id: '03', title: 'Septuagint Canon (LXX)', file: '03_Septuagint_Canon_LXX.md', icon: '🏛️', duration: '25 min' },
    { id: '04', title: 'Protestant Canon', file: '04_Protestant_Canon.md', icon: '⛪', duration: '20 min' },
    { id: '05', title: 'Roman Catholic Canon', file: '05_Roman_Catholic_Canon.md', icon: '✝️', duration: '25 min' },
    { id: '06', title: 'Eastern Orthodox Canon', file: '06_Eastern_Orthodox_Canon.md', icon: '☦️', duration: '25 min' },
    { id: '07', title: 'Ethiopian Canon', file: '07_Ethiopian_Canon.md', icon: '🇪🇹', duration: '20 min' },
    { id: '08', title: 'Syriac Peshitta Canon', file: '08_Syriac_Peshitta_Canon.md', icon: '📜', duration: '20 min' },
    { id: '09', title: 'Samaritan Canon', file: '09_Samaritan_Canon.md', icon: '🕍', duration: '15 min' },
    { id: '10', title: 'New Testament Formation', file: '10_New_Testament_Formation.md', icon: '📃', duration: '30 min' },
    { id: '11', title: 'Disputed and Excluded Books', file: '11_Disputed_and_Excluded_Books.md', icon: '❓', duration: '25 min' },
    { id: '12', title: 'Sword Drill Use Cases', file: '12_Sword_Drill_Use_Cases.md', icon: '⚔️', duration: '15 min' }
  ];

  const loadLessonContent = async (lesson) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.PUBLIC_URL || ''}/Sword_Drill_Biblical_Canons_Course/${lesson.file}`);
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

  const renderMarkdown = (markdown) => {
    // Simple markdown renderer for basic formatting
    return markdown
      .split('\n')
      .map((line, idx) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-bold text-amber-400 mb-4 mt-6">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold text-purple-400 mb-3 mt-5">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-xl font-bold text-cyan-400 mb-2 mt-4">{line.slice(4)}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={idx} className="text-lg font-bold text-blue-400 mb-2 mt-3">{line.slice(5)}</h4>;
        }

        // Lists
        if (line.match(/^[\-\*]\s/)) {
          return <li key={idx} className="text-slate-200 ml-6 mb-1">{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\.\s/)) {
          return <li key={idx} className="text-slate-200 ml-6 mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
        }

        // Bold text
        let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>');

        // Empty lines
        if (line.trim() === '') {
          return <br key={idx} />;
        }

        // Regular paragraphs
        return <p key={idx} className="text-slate-300 mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />;
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
              className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
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
          <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 rounded-xl p-6 border-2 border-violet-500/50 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{selectedLesson.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedLesson.title}</h1>
                <p className="text-violet-300 text-sm">{selectedLesson.duration}</p>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            {loading ? (
              <div className="text-center text-slate-400 py-12">Loading lesson content...</div>
            ) : (
              <div className="prose prose-invert max-w-none">
                {renderMarkdown(lessonContent)}
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
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
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
            <BookOpen size={32} className="text-violet-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Biblical Canons Course</h1>
              <p className="text-slate-400">Explore the history and formation of Scripture canons</p>
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
        <div className="bg-slate-800/50 rounded-xl p-6 border border-violet-500/30 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Course Progress</span>
            <span className="text-violet-400 font-bold">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-600 h-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="text-slate-400 text-sm mt-2">
            {progress.completed} of {progress.total} lessons completed
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = false; // All lessons are unlocked in this course

            return (
              <button
                key={lesson.id}
                onClick={() => !isLocked && loadLessonContent(lesson)}
                disabled={isLocked}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/50 hover:border-emerald-400'
                    : 'bg-slate-800/50 border-violet-500/30 hover:border-violet-400 hover:bg-slate-800/70'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{lesson.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm font-mono">Lesson {lesson.id}</span>
                        {isCompleted && <CheckCircle size={16} className="text-emerald-400" />}
                      </div>
                      <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                      <p className="text-violet-300 text-sm">{lesson.duration}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-violet-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Course Info */}
        <div className="mt-6 bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-6 border border-violet-500/30">
          <h2 className="text-xl font-bold text-violet-300 mb-3 flex items-center gap-2">
            <Scroll size={24} />
            About This Course
          </h2>
          <p className="text-slate-300 mb-3">
            This comprehensive course explores the formation and history of biblical canons across different Christian traditions and historical periods.
            You'll learn about the Hebrew Tanakh, the Septuagint, Protestant, Catholic, Orthodox, Ethiopian, Syriac, and Samaritan canons.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-violet-400 font-bold text-sm">Total Lessons</div>
              <div className="text-white text-2xl font-bold">{lessons.length}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-violet-400 font-bold text-sm">Course Duration</div>
              <div className="text-white text-2xl font-bold">~4.5 hrs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiblicalCanonCourse;
