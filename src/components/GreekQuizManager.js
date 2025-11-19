import React, { useState } from 'react';
import { X, BookOpen, Brain, Award, Zap } from 'lucide-react';
import GreekAlphabetQuiz from './GreekAlphabetQuiz';
import GreekVocabularyFlashcards from './GreekVocabularyFlashcards';
import GreekVocabularyQuiz from './GreekVocabularyQuiz';
import GreekExam from './GreekExam';
import GreekArticleQuiz from './GreekArticleQuiz';
import GreekNounDeclensionQuiz from './GreekNounDeclensionQuiz';
import GreekVerbConjugationQuiz from './GreekVerbConjugationQuiz';
import GreekCaseQuiz from './GreekCaseQuiz';

/**
 * Greek Quiz Manager - Central hub for all Greek quizzes and study tools
 */
const GreekQuizManager = ({ level = 'beginner', onClose, onComplete }) => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  const handleQuizComplete = (results) => {
    setQuizResults(prev => [...prev, { ...results, timestamp: Date.now() }]);
    setActiveQuiz(null);

    // If parent wants completion data
    if (onComplete) {
      onComplete(results);
    }
  };

  const quizTypes = [
    {
      id: 'alphabet-recognition',
      title: 'Alphabet Recognition',
      description: 'Test your knowledge of Greek letters',
      icon: '🔤',
      color: 'from-blue-600 to-cyan-600',
      difficulty: 'beginner',
      component: (
        <GreekAlphabetQuiz
          quizType="recognition"
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'alphabet-pronunciation',
      title: 'Pronunciation Quiz',
      description: 'Match letters to their sounds',
      icon: '🗣️',
      color: 'from-purple-600 to-pink-600',
      difficulty: 'beginner',
      component: (
        <GreekAlphabetQuiz
          quizType="pronunciation"
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'flashcards-beginner',
      title: 'Vocabulary Flashcards',
      description: 'Practice beginner vocabulary with spaced repetition',
      icon: '📇',
      color: 'from-green-600 to-emerald-600',
      difficulty: 'beginner',
      component: (
        <GreekVocabularyFlashcards
          level="beginner"
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'vocab-quiz-greek',
      title: 'Greek → English Quiz',
      description: 'Translate Greek words to English',
      icon: '🇬🇷',
      color: 'from-indigo-600 to-purple-600',
      difficulty: 'beginner',
      component: (
        <GreekVocabularyQuiz
          level={level}
          direction="greek-to-english"
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'vocab-quiz-english',
      title: 'English → Greek Quiz',
      description: 'Translate English words to Greek',
      icon: '🇺🇸',
      color: 'from-pink-600 to-rose-600',
      difficulty: 'beginner',
      component: (
        <GreekVocabularyQuiz
          level={level}
          direction="english-to-greek"
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'article-quiz',
      title: 'Article Forms Quiz',
      description: 'Test your knowledge of Greek article forms',
      icon: '📋',
      color: 'from-blue-600 to-cyan-600',
      difficulty: 'beginner',
      component: (
        <GreekArticleQuiz
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'noun-declension-quiz',
      title: 'Noun Declension Quiz',
      description: 'Practice 1st & 2nd declension patterns',
      icon: '📚',
      color: 'from-emerald-600 to-teal-600',
      difficulty: 'beginner',
      component: (
        <GreekNounDeclensionQuiz
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'verb-conjugation-quiz',
      title: 'Verb Conjugation Quiz',
      description: 'Master present active indicative forms',
      icon: '⚡',
      color: 'from-orange-600 to-red-600',
      difficulty: 'beginner',
      component: (
        <GreekVerbConjugationQuiz
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'case-quiz',
      title: 'Case Identification Quiz',
      description: 'Identify cases and their functions',
      icon: '🎯',
      color: 'from-violet-600 to-purple-600',
      difficulty: 'intermediate',
      component: (
        <GreekCaseQuiz
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'exam-beginner',
      title: 'Beginner Exam',
      description: 'Comprehensive beginner level exam',
      icon: '🎓',
      color: 'from-amber-600 to-yellow-600',
      difficulty: 'beginner',
      component: (
        <GreekExam
          level="beginner"
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'exam-intermediate',
      title: 'Intermediate Exam',
      description: 'Comprehensive intermediate level exam',
      icon: '🏆',
      color: 'from-yellow-600 to-amber-600',
      difficulty: 'intermediate',
      component: (
        <GreekExam
          level="intermediate"
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    },
    {
      id: 'exam-advanced',
      title: 'Advanced Exam',
      description: 'Master level comprehensive exam',
      icon: '👑',
      color: 'from-purple-600 to-indigo-600',
      difficulty: 'advanced',
      component: (
        <GreekExam
          level="advanced"
          onComplete={handleQuizComplete}
          onCancel={() => setActiveQuiz(null)}
        />
      )
    }
  ];

  // Filter quizzes by current level
  const availableQuizzes = quizTypes.filter(quiz => {
    if (level === 'beginner') return quiz.difficulty === 'beginner';
    if (level === 'intermediate') return quiz.difficulty === 'beginner' || quiz.difficulty === 'intermediate';
    return true; // Advanced users see all quizzes
  });

  // Show active quiz
  if (activeQuiz) {
    const quiz = quizTypes.find(q => q.id === activeQuiz);
    return quiz ? quiz.component : null;
  }

  // Quiz selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Koine Greek Quizzes</h1>
            <p className="text-indigo-300 capitalize">{level} Level</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Recent Results Summary */}
        {quizResults.length > 0 && (
          <div className="bg-slate-800/50 rounded-2xl border border-indigo-500/30 p-6 mb-8">
            <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
              <Zap size={20} />
              Recent Activity
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{quizResults.length}</div>
                <div className="text-slate-400 text-sm">Quizzes Taken</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {quizResults.filter(r => r.percentage >= 70).length}
                </div>
                <div className="text-slate-400 text-sm">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400">
                  {Math.round(quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / quizResults.length)}%
                </div>
                <div className="text-slate-400 text-sm">Avg Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => setActiveQuiz(quiz.id)}
              className="bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-indigo-500 p-6 cursor-pointer transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${quiz.color} flex items-center justify-center text-3xl mb-4`}>
                {quiz.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                  {quiz.difficulty}
                </span>
                <div className="text-indigo-400 hover:text-indigo-300">
                  Start →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Study Tips */}
        <div className="mt-12 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl border border-indigo-500/30 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Brain size={20} />
            Study Tips
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">•</span>
              <span>Start with the alphabet quiz to build a strong foundation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">•</span>
              <span>Use flashcards daily for spaced repetition learning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">•</span>
              <span>Take vocabulary quizzes in both directions for mastery</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">•</span>
              <span>Complete exams only after finishing all lesson quizzes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GreekQuizManager;
