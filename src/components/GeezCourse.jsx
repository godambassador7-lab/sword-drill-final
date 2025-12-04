import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy,
  GraduationCap, Zap, Target, Award, ArrowLeft, Scroll
} from 'lucide-react';

const GeezCourse = ({ onComplete, onCancel }) => {
  const [courseData, setCourseData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [completedLessons, setCompletedLessons] = useState({
    level1: [],
    level2: [],
    level3: []
  });
  const [completedLevels, setCompletedLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const manifestUrl = `${process.env.PUBLIC_URL || ''}/GeEz_Course_Repo_v1/courses/geez/manifest.json`;
    const quizzesUrl = `${process.env.PUBLIC_URL || ''}/GeEz_Course_Repo_v1/data/quizzes.json`;

    Promise.all([
      fetch(manifestUrl).then(res => res.json()),
      fetch(quizzesUrl).then(res => res.json())
    ])
      .then(([manifest, quizzes]) => {
        setCourseData(manifest);
        setQuizData(quizzes);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading Ge\'ez course:', err);
        setLoading(false);
      });
  }, []);

  const isLevelUnlocked = (levelId) => {
    if (levelId === 'level1') return true;
    if (levelId === 'level2') return completedLevels.includes('level1');
    if (levelId === 'level3') return completedLevels.includes('level2');
    return false;
  };

  const getLevelProgress = (levelId) => {
    const completed = completedLessons[levelId]?.length || 0;
    const total = 8;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setCurrentLessonIndex(0);
    setShowQuiz(false);
    setShowExam(false);
  };

  const handleLessonComplete = () => {
    const lessonId = `lesson_${currentLessonIndex}`;
    setCompletedLessons(prev => ({
      ...prev,
      [selectedLevel]: [...new Set([...prev[selectedLevel], lessonId])]
    }));

    if (onComplete) {
      onComplete({
        type: 'lesson',
        level: selectedLevel,
        lessonIndex: currentLessonIndex,
        points: 100
      });
    }

    setCurrentLessonIndex(prev => prev + 1);
  };

  const handleLevelComplete = () => {
    setCompletedLevels(prev => [...new Set([...prev, selectedLevel])]);

    if (onComplete) {
      onComplete({
        type: 'level',
        level: selectedLevel,
        levelTitle: courseData.levels.find(l => l.id === selectedLevel)?.title,
        points: 100
      });
    }

    handleBackToLevels();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-rose-400 text-xl">Loading ግዕዝ Ge'ez Course...</div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load course data</div>
      </div>
    );
  }

  if (showExam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-red-900 p-4 flex items-center justify-center">
        <div className="bg-slate-800 rounded-2xl p-8 border-2 border-purple-500 max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">Level Certification Exam</h2>
          <p className="text-slate-300 mb-6">Complete this exam with 80% or higher to unlock the next level!</p>
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowExam(false);
                handleLevelComplete();
              }}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-500"
            >
              Start Exam
            </button>
            <button onClick={() => setShowExam(false)} className="w-full bg-slate-700 text-white py-3 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedLevel) {
    const levelData = courseData.levels.find(l => l.id === selectedLevel);
    const progress = getLevelProgress(selectedLevel);

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-red-900 p-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-rose-500">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToLevels}
                className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Levels
              </button>
              <div className="text-rose-400 text-sm font-semibold">
                Progress: {progress.completed}/{progress.total}
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-rose-400 mb-2">{levelData.title}</h2>
              <p className="text-slate-300">Classical Ethiopic - Language of ancient scripture</p>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-rose-300 mb-4">Lesson {currentLessonIndex + 1}</h3>
              <div className="text-slate-200 space-y-4">
                <p className="text-lg font-semibold">📜 Course Content Includes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Complete Ge'ez Fidäl alphabet (231 characters)</li>
                  <li>Classical pronunciation and vowel system</li>
                  <li>Root-based word formation and etymology</li>
                  <li>Verb conjugations and grammatical forms</li>
                  <li>Reading ancient Biblical manuscripts</li>
                  <li>Scriptural parsing and translation skills</li>
                  <li>Historical and liturgical texts</li>
                </ul>
                <div className="bg-rose-900/30 border border-rose-600/50 rounded-lg p-4 mt-6">
                  <p className="text-rose-200 text-sm">
                    💡 <strong>Tip:</strong> Ge'ez is the liturgical language of the Ethiopian Orthodox Church and the ancestor
                    of Amharic and Tigrinya. It preserves ancient Semitic features lost in other languages!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleLessonComplete}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-rose-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Complete Lesson (+100 points)
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2"
                >
                  <Target size={18} />
                  Take Quiz (+50 pts)
                </button>
                <button
                  onClick={() => setShowExam(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  <Trophy size={18} />
                  Level Exam
                </button>
              </div>

              <button
                onClick={handleBackToLevels}
                className="w-full bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-600 transition-all"
              >
                Exit to Levels
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-red-900 p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scroll className="text-rose-400" size={48} />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-400">
              {courseData.title}
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            ግዕዝ - Master the ancient Ethiopian script used in sacred texts
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {courseData.levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(level.id);
            const progress = getLevelProgress(level.id);
            const isCompleted = completedLevels.includes(level.id);

            return (
              <div
                key={level.id}
                className={`rounded-2xl p-6 border-2 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-rose-500 hover:border-rose-400 cursor-pointer'
                    : 'bg-slate-800/50 border-slate-700 opacity-60'
                }`}
                onClick={() => isUnlocked && setSelectedLevel(level.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {isUnlocked ? (
                      <Scroll className="text-rose-400" size={32} />
                    ) : (
                      <Lock className="text-slate-500" size={32} />
                    )}
                    <h3 className="text-xl font-bold text-rose-300">Level {index + 1}</h3>
                  </div>
                  {isCompleted && <Trophy className="text-yellow-400" size={24} />}
                </div>

                <h4 className="text-lg font-semibold text-slate-200 mb-4">{level.title}</h4>

                {isUnlocked && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress.percentage)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-rose-400 mt-2">+100 points per lesson completed</div>
                  </div>
                )}

                {!isUnlocked && (
                  <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
                    <Lock size={14} />
                    Complete Level {index} to unlock
                  </div>
                )}

                {isUnlocked && (
                  <button className="mt-4 w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-rose-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2">
                    {isCompleted ? 'Review' : progress.completed > 0 ? 'Continue' : 'Start'}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-rose-700/30">
          <h3 className="text-rose-400 font-bold text-lg mb-3 flex items-center gap-2">
            <Star className="text-rose-400" size={20} />
            About This Course
          </h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• Learn the complete Ge'ez Fidäl syllabary</li>
            <li>• Study the root system and verb morphology</li>
            <li>• Read and translate ancient Biblical manuscripts</li>
            <li>• Understand Ethiopian Orthodox liturgical texts</li>
            <li>• Master classical pronunciation standards</li>
            <li>• Complete quizzes and comprehensive exams</li>
            <li>• Earn 100 points per lesson, 50 points per quiz</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeezCourse;
