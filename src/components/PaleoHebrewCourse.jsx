import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Star, Trophy,
  GraduationCap, Zap, Target, Award, ArrowLeft, Scroll
} from 'lucide-react';

const PaleoHebrewCourse = ({ onComplete, onCancel }) => {
  const [courseData, setCourseData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({
    level1: [],
    level2: [],
    level3: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load course manifest
    const manifestUrl = `${process.env.PUBLIC_URL || ''}/Paleo_Pronunciation_Repo_v3/courses/paleo/course_manifest.json`;

    fetch(manifestUrl)
      .then(res => res.json())
      .then(data => {
        setCourseData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading Paleo Hebrew course:', err);
        setLoading(false);
      });
  }, []);

  // Check if a level is unlocked
  const isLevelUnlocked = (levelId) => {
    if (levelId === 'level1') return true;
    if (levelId === 'level2') return completedLessons.level1.length >= 3;
    if (levelId === 'level3') return completedLessons.level2.length >= 3;
    return false;
  };

  // Get level progress
  const getLevelProgress = (levelId) => {
    const completed = completedLessons[levelId]?.length || 0;
    const total = 6; // Each level has approximately 6 lessons
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setCurrentLessonIndex(0);
  };

  const handleLessonComplete = () => {
    setCompletedLessons(prev => ({
      ...prev,
      [selectedLevel]: [...new Set([...prev[selectedLevel], currentLessonIndex])]
    }));

    // Move to next lesson or back to levels
    setCurrentLessonIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-orange-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading Paleo-Hebrew Course...</div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-orange-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load course data</div>
      </div>
    );
  }

  // Level content viewer
  if (selectedLevel) {
    const levelData = courseData.levels.find(l => l.id === selectedLevel);
    const progress = getLevelProgress(selectedLevel);

    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-orange-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-amber-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToLevels}
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Levels
              </button>
              <div className="text-amber-400 text-sm font-semibold">
                Progress: {progress.completed}/{progress.total}
              </div>
            </div>

            {/* Level Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-amber-400 mb-2">{levelData.title}</h2>
              <p className="text-slate-300">{levelData.description}</p>
            </div>

            {/* Lesson Content Placeholder */}
            <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Lesson {currentLessonIndex + 1}</h3>
              <div className="text-slate-200 space-y-4">
                <p>This is a placeholder for the Paleo-Hebrew lesson content.</p>
                <p>In a full implementation, this would display:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Letter symbols and SVG images</li>
                  <li>Pronunciation guides</li>
                  <li>Root meanings and word building</li>
                  <li>Interactive exercises</li>
                  <li>Biblical word analysis</li>
                </ul>
              </div>
            </div>

            {/* Complete Lesson Button */}
            <div className="flex gap-4">
              <button
                onClick={handleLessonComplete}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Complete Lesson
              </button>
              <button
                onClick={handleBackToLevels}
                className="bg-slate-700 text-slate-300 font-semibold py-4 px-6 rounded-xl hover:bg-slate-600 transition-all"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main level selection view
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-orange-900 p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scroll className="text-amber-400" size={48} />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              {courseData.title}
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Master the ancient Paleo-Hebrew script, symbols, and word meanings
          </p>
        </div>

        {/* Level Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {courseData.levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(level.id);
            const progress = getLevelProgress(level.id);

            return (
              <div
                key={level.id}
                className={`rounded-2xl p-6 border-2 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500 hover:border-amber-400 cursor-pointer'
                    : 'bg-slate-800/50 border-slate-700 opacity-60'
                }`}
                onClick={() => isUnlocked && setSelectedLevel(level.id)}
              >
                {/* Level Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {isUnlocked ? (
                      <GraduationCap className="text-amber-400" size={32} />
                    ) : (
                      <Lock className="text-slate-500" size={32} />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-amber-300">
                        Level {index + 1}
                      </h3>
                    </div>
                  </div>
                  {progress.completed > 0 && (
                    <div className="text-green-400">
                      <CheckCircle size={24} />
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className="text-lg font-semibold text-slate-200 mb-2">
                  {level.title}
                </h4>
                <p className="text-slate-400 text-sm mb-4">
                  {level.description}
                </p>

                {/* Progress Bar */}
                {isUnlocked && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress.percentage)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Locked Message */}
                {!isUnlocked && (
                  <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
                    <Lock size={14} />
                    Complete {index === 1 ? 'Level 1' : 'Level 2'} to unlock
                  </div>
                )}

                {/* Start/Continue Button */}
                {isUnlocked && (
                  <button
                    className="mt-4 w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2"
                  >
                    {progress.completed > 0 ? 'Continue' : 'Start'}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Course Info */}
        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-amber-700/30">
          <h3 className="text-amber-400 font-bold text-lg mb-3 flex items-center gap-2">
            <Star className="text-amber-400" size={20} />
            About This Course
          </h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• Learn the 22 letters of the Paleo-Hebrew alphabet</li>
            <li>• Discover the pictographic meanings behind each symbol</li>
            <li>• Understand how roots combine to create biblical words</li>
            <li>• Apply Paleo-Hebrew insights to Scripture interpretation</li>
            <li>• 300+ roots with detailed semantic frameworks</li>
            <li>• SVG artwork for visual learning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaleoHebrewCourse;
