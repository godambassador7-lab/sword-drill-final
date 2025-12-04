import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy,
  GraduationCap, Zap, Target, Award, ArrowLeft, Book
} from 'lucide-react';

const AramaicCourse = ({ onComplete, onCancel }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [biblicalTexts, setBiblicalTexts] = useState(null);
  const [galileanData, setGalileanData] = useState(null);
  const [showExam, setShowExam] = useState(false);
  const [completedLessons, setCompletedLessons] = useState({
    level1: [],
    level2: [],
    level3: []
  });
  const [completedLevels, setCompletedLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define course structure inline since there's no manifest
  const courseData = {
    course_id: 'aramaic_biblical',
    title: 'Biblical Aramaic Course',
    levels: [
      {
        id: 'level1',
        title: 'Level 1 – Alphabet & Foundations',
        description: 'Learn the Aramaic alphabet, script, and basic pronunciation'
      },
      {
        id: 'level2',
        title: 'Level 2 – Grammar & Vocabulary',
        description: 'Master Aramaic grammar, verb forms, and essential vocabulary'
      },
      {
        id: 'level3',
        title: 'Level 3 – Biblical Texts & Galilean Aramaic',
        description: 'Read Daniel, Ezra, and learn the language Jesus spoke'
      }
    ]
  };

  useEffect(() => {
    const biblicalUrl = `${process.env.PUBLIC_URL || ''}/Aramaic_Course_Repo_v2/addons/biblical_reader_pack.json`;
    const galileanUrl = `${process.env.PUBLIC_URL || ''}/Aramaic_Course_Repo_v2/addons/galilean_aramaic.json`;

    Promise.all([
      fetch(biblicalUrl).then(res => res.json()),
      fetch(galileanUrl).then(res => res.json())
    ])
      .then(([biblical, galilean]) => {
        setBiblicalTexts(biblical);
        setGalileanData(galilean);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading Aramaic course:', err);
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading ܐܪܡܝܐ Aramaic Course...</div>
      </div>
    );
  }

  if (showExam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 p-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-cyan-500">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToLevels}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Levels
              </button>
              <div className="text-cyan-400 text-sm font-semibold">
                Progress: {progress.completed}/{progress.total}
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">{levelData.title}</h2>
              <p className="text-slate-300">The language Jesus spoke - Imperial & Galilean Aramaic</p>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-cyan-300 mb-4">Lesson {currentLessonIndex + 1}</h3>
              <div className="text-slate-200 space-y-4">
                <p className="text-lg font-semibold">📖 Course Content Includes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Complete Aramaic alphabet (22 letters + calligraphic forms)</li>
                  <li>Imperial Aramaic (Daniel, Ezra) grammar and syntax</li>
                  <li>Galilean Aramaic - the dialect Jesus spoke</li>
                  <li>Biblical text reading and translation practice</li>
                  <li>Verb conjugations and noun declensions</li>
                  <li>Key phrases from Scripture in original Aramaic</li>
                  <li>Historical context and linguistic development</li>
                </ul>
                <div className="bg-cyan-900/30 border border-cyan-600/50 rounded-lg p-4 mt-6">
                  <p className="text-cyan-200 text-sm">
                    ✝️ <strong>Did You Know?</strong> Aramaic was the common language of the Middle East during Jesus' time.
                    Sections of Daniel (2:4-7:28) and Ezra (4:8-6:18, 7:12-26) were written in Aramaic. Jesus' famous words
                    "Talitha koum" (Mark 5:41) and "Eloi, Eloi, lema sabachthani" (Mark 15:34) are in Aramaic!
                  </p>
                </div>

                {/* Show Biblical Texts */}
                {biblicalTexts && biblicalTexts.texts && (
                  <div className="bg-indigo-900/30 border border-indigo-600/50 rounded-lg p-4 mt-4">
                    <h4 className="text-indigo-300 font-bold mb-3">📜 Biblical Text Sample:</h4>
                    <div className="space-y-3">
                      {biblicalTexts.texts.slice(0, 2).map((text, idx) => (
                        <div key={idx} className="border-l-2 border-cyan-500 pl-3">
                          <p className="text-cyan-400 font-semibold text-sm">{text.reference}</p>
                          <p className="text-slate-200 text-lg my-1" dir="rtl">{text.aramaic}</p>
                          <p className="text-slate-400 text-sm italic">{text.translation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleLessonComplete}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Complete Lesson (+100 points)
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleLessonComplete}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  <Target size={18} />
                  Take Quiz (+50 pts)
                </button>
                <button
                  onClick={() => setShowExam(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="text-cyan-400" size={48} />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              {courseData.title}
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            ܐܪܡܝܐ - Learn the language of Jesus and read Scripture in its original form
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
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-cyan-500 hover:border-cyan-400 cursor-pointer'
                    : 'bg-slate-800/50 border-slate-700 opacity-60'
                }`}
                onClick={() => isUnlocked && setSelectedLevel(level.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {isUnlocked ? (
                      <Book className="text-cyan-400" size={32} />
                    ) : (
                      <Lock className="text-slate-500" size={32} />
                    )}
                    <h3 className="text-xl font-bold text-cyan-300">Level {index + 1}</h3>
                  </div>
                  {isCompleted && <Trophy className="text-yellow-400" size={24} />}
                </div>

                <h4 className="text-lg font-semibold text-slate-200 mb-2">{level.title}</h4>
                <p className="text-slate-400 text-sm mb-4">{level.description}</p>

                {isUnlocked && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress.percentage)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-cyan-400 mt-2">+100 points per lesson completed</div>
                  </div>
                )}

                {!isUnlocked && (
                  <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
                    <Lock size={14} />
                    Complete Level {index} to unlock
                  </div>
                )}

                {isUnlocked && (
                  <button className="mt-4 w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2">
                    {isCompleted ? 'Review' : progress.completed > 0 ? 'Continue' : 'Start'}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-cyan-700/30">
          <h3 className="text-cyan-400 font-bold text-lg mb-3 flex items-center gap-2">
            <Star className="text-cyan-400" size={20} />
            About This Course
          </h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• Learn the Aramaic alphabet and calligraphic script</li>
            <li>• Study Imperial Aramaic from Daniel and Ezra</li>
            <li>• Explore Galilean Aramaic - the language Jesus spoke</li>
            <li>• Read and translate Biblical texts in original Aramaic</li>
            <li>• Understand historical and cultural context</li>
            <li>• Master essential grammar, verbs, and vocabulary</li>
            <li>• Earn 100 points per lesson, 50 points per quiz</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AramaicCourse;
