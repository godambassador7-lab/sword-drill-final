import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, CheckCircle, Star, Trophy, Shield, ArrowLeft, Lightbulb, Cross } from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const ApologeticsCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => {
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(() => {
    // Load from Firebase first, then localStorage as fallback
    if (userData?.apologeticsProgress) {
      return userData.apologeticsProgress;
    }

    const saved = localStorage.getItem('apologeticsProgress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing apologetics progress:', e);
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load lessons from JSON files
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const lessonFiles = ['lesson1.json', 'lesson2.json', 'lesson3.json', 'lesson4.json', 'lesson5.json', 'lesson6.json'];
        const loadedLessons = [];

        for (const file of lessonFiles) {
          const response = await fetch(`${process.env.PUBLIC_URL}/apologetics_course/${file}`);
          if (response.ok) {
            const data = await response.json();
            loadedLessons.push(data);
          }
        }

        setLessons(loadedLessons);
        setLoading(false);
      } catch (err) {
        console.error('Error loading apologetics lessons:', err);
        setError('Failed to load apologetics lessons');
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  // AUTO-SYNC: If we have localStorage progress but NOT Firebase progress, sync to Firebase
  useEffect(() => {
    const localSaved = localStorage.getItem('apologeticsProgress');
    if (localSaved && userId && setUserData && updateUserProgress && !userData?.apologeticsProgress) {
      try {
        const localProgress = JSON.parse(localSaved);
        console.log('🔄 AUTO-SYNC: Found localStorage progress but missing in Firebase. Syncing Apologetics progress...');

        setUserData(prev => ({
          ...prev,
          apologeticsProgress: localProgress
        }));

        updateUserProgress(userId, {
          apologeticsProgress: localProgress
        })
          .then(() => {
            console.log('✓ AUTO-SYNC: Successfully synced Apologetics progress to Firebase');
          })
          .catch(err => {
            console.error('❌ AUTO-SYNC: Error syncing Apologetics progress to Firebase:', err);
          });
      } catch (e) {
        console.error('Error parsing local Apologetics progress for auto-sync:', e);
      }
    }
  }, [userId, userData, setUserData]);

  // Save progress to both localStorage and Firebase whenever completedLessons changes
  useEffect(() => {
    localStorage.setItem('apologeticsProgress', JSON.stringify(completedLessons));

    // Sync to Firebase if user is logged in
    if (userId && setUserData && updateUserProgress) {
      setUserData(prev => ({
        ...prev,
        apologeticsProgress: completedLessons
      }));

      updateUserProgress(userId, {
        apologeticsProgress: completedLessons
      }).catch(err => {
        console.error('Error saving Apologetics progress to Firebase:', err);
      });
    }
  }, [completedLessons, userId, setUserData]);

  // Sync completed lessons when userData loads/changes
  useEffect(() => {
    if (userData?.apologeticsProgress) {
      setCompletedLessons(userData.apologeticsProgress);
    }
  }, [userData?.apologeticsProgress]);

  // Auto-resume: Start at first incomplete lesson when course loads
  useEffect(() => {
    if (lessons.length > 0 && currentLessonIndex === null) {
      // Find first incomplete lesson
      const firstIncomplete = lessons.findIndex((_, index) => !completedLessons.includes(index));

      // If found an incomplete lesson, start there. Otherwise start at first lesson.
      if (firstIncomplete !== -1) {
        setCurrentLessonIndex(firstIncomplete);
      } else if (completedLessons.length > 0) {
        // All lessons complete, show lesson list
        // Don't auto-start any lesson
      } else {
        // No progress yet, start at first lesson
        setCurrentLessonIndex(0);
      }
    }
  }, [lessons, completedLessons]); // Only run when lessons load or completed lessons change initially

  const markLessonComplete = (index) => {
    if (!completedLessons.includes(index)) {
      setCompletedLessons(prev => [...prev, index]);
    }
  };

  const getProgress = () => {
    const total = lessons.length;
    const completed = completedLessons.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading Apologetics Course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={onCancel}
            className="mt-4 bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Viewing a specific lesson
  if (currentLessonIndex !== null) {
    const lesson = lessons[currentLessonIndex];
    const isCompleted = completedLessons.includes(currentLessonIndex);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentLessonIndex(null)}
            className="mb-6 flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Lessons
          </button>

          <div className="bg-slate-800 rounded-xl p-6 sm:p-8 border-2 border-purple-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <Shield className="text-purple-400" size={32} />
                {lesson.title}
              </h2>
              {isCompleted && (
                <CheckCircle className="text-green-400" size={32} />
              )}
            </div>

            <div className="space-y-4 mb-8">
              {lesson.content.map((paragraph, idx) => (
                <p key={idx} className="text-lg text-gray-200 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex gap-4">
              {!isCompleted && (
                <button
                  onClick={() => {
                    markLessonComplete(currentLessonIndex);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Mark as Complete
                </button>
              )}

              {currentLessonIndex < lessons.length - 1 && (
                <button
                  onClick={() => setCurrentLessonIndex(currentLessonIndex + 1)}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Next Lesson
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main lesson list view
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onCancel}
          className="mb-6 flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Courses
        </button>

        <div className="bg-slate-800 rounded-xl p-6 sm:p-8 border-2 border-purple-500 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center gap-3">
            <Shield className="text-purple-400" size={40} />
            Apologetics Course
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Learn to give a reasoned defense for your faith with gentleness and respect (1 Peter 3:15)
          </p>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Course Progress</span>
              <span className="text-sm">
                {progress.completed} / {progress.total} lessons
              </span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-teal-500 h-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {progress.percentage === 100 && (
            <div className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 flex items-center gap-3">
              <Trophy className="text-yellow-300" size={32} />
              <div>
                <h3 className="font-bold text-lg">Course Complete!</h3>
                <p className="text-sm">You have completed all apologetics lessons</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(index);

            return (
              <div
                key={index}
                onClick={() => setCurrentLessonIndex(index)}
                className="bg-slate-800 rounded-xl p-6 border-2 border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-600'
                        : 'bg-purple-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={24} />
                      ) : (
                        <span className="font-bold text-lg">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-purple-300 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Lesson {index + 1} of {lessons.length}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-purple-400 group-hover:translate-x-1 transition-transform" size={24} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApologeticsCourse;
