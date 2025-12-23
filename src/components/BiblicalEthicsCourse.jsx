import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, CheckCircle, ArrowLeft, Scale, Heart
} from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const BiblicalEthicsCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(() => {
    return userData?.biblicalEthicsProgress?.completedLessons || [];
  });

  useEffect(() => {
    if (userData?.biblicalEthicsProgress?.completedLessons) {
      setCompletedLessons(userData.biblicalEthicsProgress.completedLessons);
    }
  }, [userData?.biblicalEthicsProgress]);

  useEffect(() => {
    const progressPayload = { completedLessons };
    localStorage.setItem('biblicalEthicsProgress', JSON.stringify(progressPayload));

    if (setUserData) {
      setUserData(prev => ({ ...prev, biblicalEthicsProgress: progressPayload }));
    }

    if (userId) {
      updateUserProgress(userId, { biblicalEthicsProgress: progressPayload }).catch(err =>
        console.error('Error saving Biblical Ethics progress:', err)
      );
    }
  }, [completedLessons, userId, setUserData]);

  const lessons = [
    { id: '01', title: 'Introduction to Biblical Ethics', file: 'Unit_01_Introduction.md', icon: '⚖️', duration: '15 min' },
    { id: '02', title: 'The Character of God', file: 'Unit_02_Character_of_God.md', icon: '👑', duration: '20 min' },
    { id: '03', title: 'The Ten Commandments', file: 'Unit_03_Ten_Commandments.md', icon: '📜', duration: '30 min' },
    { id: '04', title: 'The Sermon on the Mount', file: 'Unit_04_Sermon_Mount.md', icon: '⛰️', duration: '25 min' },
    { id: '05', title: 'Love and Justice', file: 'Unit_05_Love_Justice.md', icon: '❤️', duration: '25 min' },
    { id: '06', title: 'Contemporary Ethical Issues', file: 'Unit_06_Contemporary_Issues.md', icon: '🌍', duration: '30 min' },
    { id: '07', title: 'Christian Living', file: 'Unit_07_Christian_Living.md', icon: '✝️', duration: '20 min' },
    { id: '08', title: 'Assessments', file: 'Assessments.md', icon: '✍️', duration: '10 min' }
  ];

  const loadLessonContent = async (lesson) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.PUBLIC_URL || ''}/SwordDrill_Associate_Biblical_Ethics/${lesson.file}`);
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
    return markdown
      .split('\n')
      .map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-bold text-rose-400 mb-4 mt-6">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold text-rose-300 mb-3 mt-5">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-xl font-bold text-pink-400 mb-2 mt-4">{line.slice(4)}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={idx} className="text-lg font-bold text-red-400 mb-2 mt-3">{line.slice(5)}</h4>;
        }
        if (line.match(/^[\-\*]\s/)) {
          return <li key={idx} className="text-slate-200 ml-6 mb-1">{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\.\s/)) {
          return <li key={idx} className="text-slate-200 ml-6 mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
        }
        if (line.startsWith('> ')) {
          return <blockquote key={idx} className="border-l-4 border-rose-500 pl-4 italic text-slate-300 my-2">{line.slice(2)}</blockquote>;
        }
        let processedLine = line;
        processedLine = processedLine.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-rose-300">$1</strong>');
        processedLine = processedLine.replace(/\*(.+?)\*/g, '<em class="italic text-slate-300">$1</em>');
        if (line.trim() === '') {
          return <div key={idx} className="h-3" />;
        }
        return <p key={idx} className="text-slate-200 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: processedLine }} />;
      });
  };

  if (!selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900/20 to-slate-900 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-rose-400 flex items-center gap-3">
                <Scale size={40} className="text-rose-400" />
                Biblical Ethics
              </h1>
              <p className="text-slate-400 mt-2">Moral Principles and Christian Living - Associate Level</p>
            </div>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson, idx) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isLocked = idx > 0 && !completedLessons.includes(lessons[idx - 1].id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => !isLocked && loadLessonContent(lesson)}
                  disabled={isLocked}
                  className={`text-left p-6 rounded-xl border-2 transition-all ${
                    isCompleted
                      ? 'bg-rose-900/30 border-rose-500/50 hover:bg-rose-900/40'
                      : isLocked
                      ? 'bg-slate-800/50 border-slate-700/50 opacity-50 cursor-not-allowed'
                      : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 hover:border-rose-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{lesson.icon}</span>
                    {isCompleted && <CheckCircle className="text-rose-400" size={24} />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{lesson.title}</h3>
                  <p className="text-slate-400 text-sm">{lesson.duration}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-8 bg-rose-900/20 border-2 border-rose-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-rose-400 mb-3">Course Overview</h3>
            <p className="text-slate-300 leading-relaxed">
              Study biblical principles for moral decision-making and righteous living. Examine God's character,
              the Ten Commandments, Jesus's ethical teachings, and how to apply biblical ethics to contemporary issues.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900/20 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedLesson(null)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
            Back to Lessons
          </button>
          <button
            onClick={() => markLessonComplete(selectedLesson.id)}
            className="flex items-center gap-2 px-6 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg transition-all font-bold"
          >
            <CheckCircle size={20} />
            Mark Complete
          </button>
        </div>

        <div className="bg-slate-800/90 backdrop-blur rounded-xl p-8 border border-rose-500/30">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{selectedLesson.icon}</span>
            <div>
              <h2 className="text-3xl font-bold text-rose-400">{selectedLesson.title}</h2>
              <p className="text-slate-400">{selectedLesson.duration}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              {renderMarkdown(lessonContent)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiblicalEthicsCourse;
