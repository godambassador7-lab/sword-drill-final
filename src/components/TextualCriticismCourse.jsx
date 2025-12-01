import React, { useState } from 'react';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy,
  GraduationCap, Zap, Target, Award, ArrowLeft, Lightbulb, Scroll, Search
} from 'lucide-react';
import quizData from '../data/textual_criticism_course/quiz_content.json';
import lessonContent from '../data/textual_criticism_course/lesson_content.json';
import TextualCriticismQuiz from './TextualCriticismQuiz';

const TextualCriticismCourse = ({ onComplete, onCancel }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [quizScores, setQuizScores] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);

  // Course modules based on the folder structure
  const modules = [
    {
      id: 'module1',
      title: 'History of Textual Criticism',
      icon: '📜',
      duration: '30 min',
      description: 'Explore the fascinating history of how biblical texts were transmitted and preserved through the centuries.'
    },
    {
      id: 'module2',
      title: 'Critical Methods & Principles',
      icon: '🔬',
      duration: '35 min',
      description: 'Learn the fundamental methods scholars use to evaluate manuscript evidence and textual variants.'
    },
    {
      id: 'module3',
      title: 'Ancient Manuscripts & Witnesses',
      icon: '📖',
      duration: '40 min',
      description: 'Discover the major manuscript families, papyri, uncials, and versions that preserve the biblical text.'
    },
    {
      id: 'module4',
      title: 'Understanding Textual Variants',
      icon: '🔍',
      duration: '35 min',
      description: 'Examine types of variants, their causes, and how to evaluate their significance.'
    },
    {
      id: 'module5',
      title: 'Practical Application',
      icon: '💡',
      duration: '30 min',
      description: 'Apply textual criticism principles to real biblical passages and textual challenges.'
    },
    {
      id: 'module6',
      title: 'Canons of Textual Criticism',
      icon: '⚖️',
      duration: '35 min',
      description: 'Master the key rules and principles that guide textual decision-making.'
    },
    {
      id: 'final-exam',
      title: 'Final Certification Exam',
      icon: '🎓',
      duration: '60 min',
      isExam: true,
      description: 'Demonstrate mastery of textual criticism principles and earn your certificate.'
    }
  ];

  // Check if module is unlocked
  const isModuleUnlocked = (moduleIndex) => {
    if (moduleIndex === 0) return true;
    return completedModules.includes(modules[moduleIndex - 1].id);
  };

  // Get overall progress
  const getProgress = () => {
    const total = modules.length;
    const completed = completedModules.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    // Mark module as completed
    if (!completedModules.includes(selectedModule)) {
      setCompletedModules(prev => [...prev, selectedModule]);
    }

    // If this was the final exam, award completion
    const module = modules.find(m => m.id === selectedModule);
    if (module?.isExam) {
      onComplete({ type: 'course', level: 'textual-criticism' });
    }

    setShowQuiz(false);
    setSelectedModule(null);
  };

  const handleQuizRetry = () => {
    setShowQuiz(false);
    // Stay on the same module to allow retry
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setShowQuiz(false);
  };

  // Quiz view
  if (showQuiz && selectedModule) {
    const module = modules.find(m => m.id === selectedModule);
    const questions = quizData[selectedModule]?.questions || [];

    return (
      <TextualCriticismQuiz
        questions={questions}
        moduleTitle={module.title}
        isExam={module.isExam}
        onComplete={handleQuizComplete}
        onRetry={handleQuizRetry}
      />
    );
  }

  // Module content viewer
  if (selectedModule) {
    const module = modules.find(m => m.id === selectedModule);
    const isCompleted = completedModules.includes(selectedModule);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-purple-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToModules}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Modules
              </button>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={20} />
                  <span className="text-sm font-semibold">Completed</span>
                </div>
              )}
            </div>

            {/* Module Title */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{module.icon}</div>
              <h1 className="text-4xl font-bold text-white mb-2">{module.title}</h1>
              <p className="text-purple-300">{module.description}</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Zap size={16} />
                  {module.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {module.isExam ? 'Exam' : 'Study Material'}
                </span>
              </div>
            </div>

            {/* Content Area */}
            {module.isExam ? (
              <div className="bg-slate-900 rounded-xl p-6 mb-6 border border-purple-500/30">
                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-300 leading-relaxed space-y-4">
                    <h2 className="text-2xl font-bold text-purple-400 mb-4">📝 Final Certification Exam</h2>
                    <p className="text-lg">
                      This comprehensive exam will test your understanding of all six modules in Understanding Textual Criticism.
                    </p>
                    <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 my-6">
                      <h3 className="text-xl font-semibold text-purple-300 mb-3">Exam Details:</h3>
                      <ul className="space-y-2">
                        <li>✓ 30 questions covering all modules</li>
                        <li>✓ Must score 80% or higher to pass</li>
                        <li>✓ Instant feedback with explanations</li>
                        <li>✓ Earn your Textual Criticism Certificate</li>
                      </ul>
                    </div>
                    <p className="text-yellow-300">
                      <strong>Note:</strong> Make sure you've reviewed all previous modules before attempting the final exam.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all mt-6"
                >
                  Start Final Exam
                </button>
              </div>
            ) : (
              <>
                {/* Detailed Lesson Content */}
                {lessonContent[selectedModule]?.sections && (
                  <div className="mb-8">
                    {lessonContent[selectedModule].sections.map((section, index) => (
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
                      Module Completed
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

  // Module Selection Screen
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800 rounded-2xl p-8 border-2 border-purple-500 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Courses
            </button>
            <div className="flex items-center gap-2 text-purple-400">
              <Scroll size={24} />
              <span className="font-bold">Textual Criticism</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-3">
              Understanding Textual Criticism
            </h1>
            <p className="text-xl text-purple-200 mb-6">
              Master the science and art of biblical manuscript analysis
            </p>

            {/* Progress Bar */}
            <div className="bg-slate-900 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-300 font-semibold">Overall Progress</span>
                <span className="text-white font-bold">
                  {progress.completed} / {progress.total} Modules
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="mt-3 text-center text-sm text-purple-300">
                {progress.percentage === 100 ? (
                  <span className="flex items-center justify-center gap-2 text-green-400">
                    <Trophy size={18} />
                    Course Complete! 🎉
                  </span>
                ) : (
                  `${Math.round(progress.percentage)}% Complete`
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => {
            const isUnlocked = isModuleUnlocked(index);
            const isCompleted = completedModules.includes(module.id);

            return (
              <div
                key={module.id}
                className={`bg-slate-800 rounded-xl p-6 border-2 transition-all transform hover:scale-105 ${
                  isCompleted
                    ? 'border-green-500 bg-gradient-to-br from-slate-800 to-green-900/20'
                    : isUnlocked
                    ? 'border-purple-500 hover:border-purple-400 cursor-pointer'
                    : 'border-slate-700 opacity-60'
                }`}
                onClick={() => isUnlocked && setSelectedModule(module.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{module.icon}</div>
                  {isCompleted ? (
                    <CheckCircle size={28} className="text-green-400" />
                  ) : isUnlocked ? (
                    <ChevronRight size={28} className="text-purple-400" />
                  ) : (
                    <Lock size={28} className="text-slate-600" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{module.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-purple-300">
                    <Zap size={16} />
                    {module.duration}
                  </span>
                  {isCompleted && (
                    <span className="text-green-400 font-semibold">✓ Complete</span>
                  )}
                  {!isUnlocked && (
                    <span className="text-slate-500">🔒 Locked</span>
                  )}
                </div>

                {module.isExam && !isUnlocked && (
                  <div className="mt-3 text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-500/30 rounded px-3 py-2">
                    Complete all {modules.length - 1} modules to unlock
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Course Information */}
        <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb size={24} className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">About This Course</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <h3 className="font-semibold text-purple-300 mb-2">What You'll Learn:</h3>
              <ul className="space-y-1 text-slate-400">
                <li>• History of biblical text transmission</li>
                <li>• Major manuscript families and witnesses</li>
                <li>• Methods for evaluating textual variants</li>
                <li>• Canons of textual criticism</li>
                <li>• Practical application to Bible study</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-300 mb-2">Course Features:</h3>
              <ul className="space-y-1 text-slate-400">
                <li>• 6 comprehensive modules with quizzes</li>
                <li>• Final certification exam (80% to pass)</li>
                <li>• Detailed explanations for every question</li>
                <li>• Self-paced learning</li>
                <li>• Biblical scholarship insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextualCriticismCourse;
