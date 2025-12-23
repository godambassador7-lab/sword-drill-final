import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, CheckCircle, ArrowLeft, GraduationCap, FileText, Send, Award
} from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const CapstoneCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(() => {
    return userData?.capstoneProgress?.completedLessons || [];
  });
  const [submissionStatus, setSubmissionStatus] = useState(() => {
    return userData?.capstoneProgress?.submissionStatus || 'not_submitted';
  });

  useEffect(() => {
    if (userData?.capstoneProgress?.completedLessons) {
      setCompletedLessons(userData.capstoneProgress.completedLessons);
    }
    if (userData?.capstoneProgress?.submissionStatus) {
      setSubmissionStatus(userData.capstoneProgress.submissionStatus);
    }
  }, [userData?.capstoneProgress]);

  useEffect(() => {
    const progressPayload = { completedLessons, submissionStatus };
    localStorage.setItem('capstoneProgress', JSON.stringify(progressPayload));

    if (setUserData) {
      setUserData(prev => ({ ...prev, capstoneProgress: progressPayload }));
    }

    if (userId) {
      updateUserProgress(userId, { capstoneProgress: progressPayload }).catch(err =>
        console.error('Error saving Capstone progress:', err)
      );
    }
  }, [completedLessons, submissionStatus, userId, setUserData]);

  const lessons = [
    { id: '01', title: 'Capstone Project Overview', file: 'Unit_01_Overview.md', icon: '🎓', duration: '15 min' },
    { id: '02', title: 'Research Guidelines', file: 'Unit_02_Research_Guidelines.md', icon: '🔍', duration: '20 min' },
    { id: '03', title: 'Paper Structure and Format', file: 'Unit_03_Paper_Structure.md', icon: '📝', duration: '25 min' },
    { id: '04', title: 'Biblical Citation Methods', file: 'Unit_04_Citations.md', icon: '📚', duration: '20 min' },
    { id: '05', title: 'Grading Rubric', file: 'Unit_05_Rubric.md', icon: '✅', duration: '15 min' },
    { id: '06', title: 'Submission Instructions', file: 'Unit_06_Submission.md', icon: '📧', duration: '10 min' }
  ];

  const loadLessonContent = async (lesson) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.PUBLIC_URL || ''}/SwordDrill_Associate_Capstone/${lesson.file}`);
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
          return <h1 key={idx} className="text-3xl font-bold text-indigo-400 mb-4 mt-6">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold text-indigo-300 mb-3 mt-5">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-xl font-bold text-purple-400 mb-2 mt-4">{line.slice(4)}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={idx} className="text-lg font-bold text-violet-400 mb-2 mt-3">{line.slice(5)}</h4>;
        }
        if (line.match(/^[\-\*]\s/)) {
          return <li key={idx} className="text-slate-200 ml-6 mb-1">{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\.\s/)) {
          return <li key={idx} className="text-slate-200 ml-6 mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
        }
        if (line.startsWith('> ')) {
          return <blockquote key={idx} className="border-l-4 border-indigo-500 pl-4 italic text-slate-300 my-2">{line.slice(2)}</blockquote>;
        }
        let processedLine = line;
        processedLine = processedLine.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-indigo-300">$1</strong>');
        processedLine = processedLine.replace(/\*(.+?)\*/g, '<em class="italic text-slate-300">$1</em>');
        if (line.trim() === '') {
          return <div key={idx} className="h-3" />;
        }
        return <p key={idx} className="text-slate-200 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: processedLine }} />;
      });
  };

  const getSubmissionStatusBadge = () => {
    switch (submissionStatus) {
      case 'not_submitted':
        return <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">Not Submitted</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm">Under Review</span>;
      case 'passed':
        return <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-sm">✓ Passed</span>;
      case 'failed':
        return <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm">Needs Revision</span>;
      default:
        return null;
    }
  };

  if (!selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-indigo-400 flex items-center gap-3">
                <GraduationCap size={40} className="text-indigo-400" />
                Associate Level Capstone
              </h1>
              <p className="text-slate-400 mt-2">Final Research Project - Complete all Associate courses to unlock</p>
              <div className="mt-3">
                {getSubmissionStatusBadge()}
              </div>
            </div>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>

          {/* Submission Info Banner */}
          <div className="mb-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-2 border-indigo-500/50 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-indigo-300 mb-3 flex items-center gap-2">
              <FileText size={28} />
              Capstone Submission
            </h3>
            <p className="text-slate-300 mb-4">
              Submit your completed capstone research paper to: <strong className="text-indigo-300">capstone@sworddrill.academy</strong>
            </p>
            <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-slate-200 mb-2">Email Subject Line:</h4>
              <code className="text-emerald-400">Capstone Submission - [Your Full Name] - [User ID: {userId || 'your-id'}]</code>
            </div>
            <p className="text-sm text-slate-400">
              Include your research paper as a PDF attachment. Papers are reviewed within 7-10 business days.
            </p>
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
                      ? 'bg-indigo-900/30 border-indigo-500/50 hover:bg-indigo-900/40'
                      : isLocked
                      ? 'bg-slate-800/50 border-slate-700/50 opacity-50 cursor-not-allowed'
                      : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{lesson.icon}</span>
                    {isCompleted && <CheckCircle className="text-indigo-400" size={24} />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{lesson.title}</h3>
                  <p className="text-slate-400 text-sm">{lesson.duration}</p>
                </button>
              );
            })}
          </div>

          {/* Grading Criteria Overview */}
          <div className="mt-8 bg-indigo-900/20 border-2 border-indigo-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-indigo-400 mb-3 flex items-center gap-2">
              <Award size={24} />
              Grading Criteria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div>
                <h4 className="font-bold text-indigo-300 mb-2">Content (40%)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Biblical accuracy and depth</li>
                  <li>• Theological soundness</li>
                  <li>• Original insight and analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-indigo-300 mb-2">Research (30%)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Quality of sources</li>
                  <li>• Proper citations</li>
                  <li>• Scholarly engagement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-indigo-300 mb-2">Writing (20%)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Clarity and organization</li>
                  <li>• Grammar and style</li>
                  <li>• Logical argumentation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-indigo-300 mb-2">Format (10%)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Proper structure</li>
                  <li>• Citation format (Turabian/Chicago)</li>
                  <li>• Professional presentation</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
              <p className="text-sm text-emerald-300">
                <strong>Passing Grade:</strong> 70% or higher required to earn your Associate Level Certificate
              </p>
            </div>
          </div>

          {/* Course Overview */}
          <div className="mt-6 bg-purple-900/20 border-2 border-purple-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-3">Course Overview</h3>
            <p className="text-slate-300 leading-relaxed">
              The Capstone project synthesizes all Associate Level coursework into an original research paper.
              Choose a topic from biblical theology, develop a thesis, conduct scholarly research, and present
              your findings in a 15-20 page academic paper. Upon passing, you will receive your Associate Level
              Certificate in Biblical Studies.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 text-white p-4">
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
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all font-bold"
          >
            <CheckCircle size={20} />
            Mark Complete
          </button>
        </div>

        <div className="bg-slate-800/90 backdrop-blur rounded-xl p-8 border border-indigo-500/30">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{selectedLesson.icon}</span>
            <div>
              <h2 className="text-3xl font-bold text-indigo-400">{selectedLesson.title}</h2>
              <p className="text-slate-400">{selectedLesson.duration}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
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

export default CapstoneCourse;
