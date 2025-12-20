import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, CheckCircle, ArrowLeft, Book, Scroll
} from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const SecondTempleJudaismCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(() => {
    return userData?.secondTempleJudaismProgress?.completedLessons || [];
  });

  // Hydrate from userData when it changes (handles late Firebase load)
  useEffect(() => {
    if (userData?.secondTempleJudaismProgress?.completedLessons) {
      setCompletedLessons(userData.secondTempleJudaismProgress.completedLessons);
    }
  }, [userData?.secondTempleJudaismProgress]);

  // Persist progress to localStorage + Firebase
  useEffect(() => {
    const progressPayload = { completedLessons };
    localStorage.setItem('secondTempleJudaismProgress', JSON.stringify(progressPayload));

    if (setUserData) {
      setUserData(prev => ({ ...prev, secondTempleJudaismProgress: progressPayload }));
    }

    if (userId) {
      updateUserProgress(userId, { secondTempleJudaismProgress: progressPayload }).catch(err =>
        console.error('Error saving Second Temple Judaism progress:', err)
      );
    }
  }, [completedLessons, userId, setUserData]);

  const lessons = [
    { id: '01', title: 'Historical Framework', file: 'Unit_01_Historical_Framework.md', icon: '🏛️', duration: '20 min' },
    { id: '02', title: 'Temple & Worship', file: 'Unit_02_Temple_and_Worship.md', icon: '⛪', duration: '25 min' },
    { id: '03', title: 'Torah & Interpretation', file: 'Unit_03_Torah_and_Interpretation.md', icon: '📜', duration: '20 min' },
    { id: '04', title: 'Jewish Sects', file: 'Unit_04_Jewish_Sects.md', icon: '👥', duration: '25 min' },
    { id: '05', title: 'Synagogue & Daily Life', file: 'Unit_05_Synagogue_and_Daily_Life.md', icon: '🕍', duration: '20 min' },
    { id: '06', title: 'Messianic Expectations', file: 'Unit_06_Messianic_Expectations.md', icon: '👑', duration: '25 min' },
    { id: '07', title: 'Apocalyptic Worldview', file: 'Unit_07_Apocalyptic_Worldview.md', icon: '🌟', duration: '20 min' },
    { id: '08', title: 'Roman Occupation', file: 'Unit_08_Roman_Occupation.md', icon: '⚔️', duration: '20 min' },
    { id: '09', title: 'Jesus within Second Temple Judaism', file: 'Unit_09_Jesus_within_Second_Temple_Judaism.md', icon: '✝️', duration: '25 min' },
    { id: '10', title: 'Early Christianity & Judaism', file: 'Unit_10_Early_Christianity_and_Judaism.md', icon: '✉️', duration: '25 min' },
    { id: '11', title: 'Theological Synthesis', file: 'Unit_11_Theological_Synthesis.md', icon: '🎓', duration: '20 min' },
    { id: '12', title: 'Assessments', file: 'Assessments.md', icon: '✍️', duration: '10 min' }
  ];

  const loadLessonContent = async (lesson) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.PUBLIC_URL || ''}/SwordDrill_Associate_Second_Temple_Judaism/${lesson.file}`);
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
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
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
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl p-6 border-2 border-blue-500/50 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{selectedLesson.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedLesson.title}</h1>
                <p className="text-blue-300 text-sm">{selectedLesson.duration}</p>
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
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
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
            <BookOpen size={32} className="text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Second Temple Judaism (Associate Level)</h1>
              <p className="text-slate-400">Judaism from Exile to AD 70</p>
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
        <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-500/30 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Course Progress</span>
            <span className="text-blue-400 font-bold">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500"
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
                    : 'bg-slate-800/50 border-blue-500/30 hover:border-blue-400 hover:bg-slate-800/70'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{lesson.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm font-mono">Unit {lesson.id}</span>
                        {isCompleted && <CheckCircle size={16} className="text-emerald-400" />}
                      </div>
                      <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                      <p className="text-blue-300 text-sm">{lesson.duration}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-blue-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Course Info */}
        <div className="mt-6 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-500/30">
          <h2 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2">
            <Scroll size={24} />
            About This Course
          </h2>
          <p className="text-slate-300 mb-3">
            <strong className="text-blue-300">Associate-Level Course</strong> - A rigorous, text-driven study of Judaism
            from the return from Babylonian exile to the destruction of the Second Temple (AD 70). Covers Persian, Hellenistic,
            Hasmonean, and Roman periods, including Temple worship, Torah interpretation, Jewish sects, messianic expectations,
            apocalyptic worldview, and the historical context of Jesus and early Christianity.
          </p>
          <p className="text-slate-300 mb-3">
            <strong className="text-blue-300">Credit Equivalent:</strong> 6 credits |
            <strong className="text-blue-300"> Prerequisites:</strong> Basic biblical and historical knowledge recommended
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-blue-400 font-bold text-sm">Total Units</div>
              <div className="text-white text-2xl font-bold">{lessons.length}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-blue-400 font-bold text-sm">Course Duration</div>
              <div className="text-white text-2xl font-bold">~4 hrs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondTempleJudaismCourse;
