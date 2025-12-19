import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Clock, Star, Trophy, Zap } from 'lucide-react';

const DailyMissionBoard = ({ userData, setUserData, onMissionComplete, onNavigate }) => {
  const [missions, setMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);

  // Define all possible missions
  const ALL_MISSIONS = [
    {
      id: 'word-search',
      title: 'Word Search Master',
      description: 'Complete 1 Bible Word Search',
      reward: 100,
      icon: '🔍',
      navigateTo: 'word-search',
      checkCompletion: (data) => (data?.dailyMissionProgress?.wordSearchCompleted || 0) >= 1
    },
    {
      id: 'storyline',
      title: 'Timeline Historian',
      description: 'Complete 1 Storyline Quiz',
      reward: 100,
      icon: '📜',
      navigateTo: 'storyline-quiz',
      checkCompletion: (data) => (data?.dailyMissionProgress?.storylineCompleted || 0) >= 1
    },
    {
      id: 'bible-reader',
      title: 'Daily Reader',
      description: 'Read 1 Bible chapter',
      reward: 75,
      icon: '📖',
      navigateTo: 'bible-reader',
      checkCompletion: (data) => (data?.dailyMissionProgress?.chaptersRead || 0) >= 1
    },
    {
      id: 'quiz-streak',
      title: 'Quiz Marathon',
      description: 'Complete 5 quizzes',
      reward: 150,
      icon: '🎯',
      navigateTo: 'home',
      checkCompletion: (data) => (data?.quizzesCompleted || 0) >= 5
    },
    {
      id: 'perfect-score',
      title: 'Perfectionist',
      description: 'Get 3 perfect scores',
      reward: 200,
      icon: '💯',
      navigateTo: 'home',
      checkCompletion: (data) => (data?.dailyMissionProgress?.perfectScores || 0) >= 3
    },
    {
      id: 'course-lesson',
      title: 'Eager Student',
      description: 'Complete 1 course lesson',
      reward: 125,
      icon: '🎓',
      navigateTo: 'academy-about',
      checkCompletion: (data) => (data?.dailyMissionProgress?.courseLessons || 0) >= 1
    },
    {
      id: 'biblical-or-nah',
      title: 'Truth Seeker',
      description: 'Complete 10 Biblical or Nah questions',
      reward: 100,
      icon: '🧠',
      navigateTo: 'biblical-or-nah',
      checkCompletion: (data) => (data?.dailyMissionProgress?.biblicalOrNahQuestions || 0) >= 10
    },
    {
      id: 'verse-detective',
      title: 'Master Detective',
      description: 'Complete 3 Verse Detective quizzes',
      reward: 150,
      icon: '🔍',
      navigateTo: 'verse-detective',
      checkCompletion: (data) => (data?.dailyMissionProgress?.verseDetectiveCompleted || 0) >= 3
    },
    {
      id: 'quick-answer',
      title: 'Speed Runner',
      description: 'Answer 5 questions under 5 seconds',
      reward: 175,
      icon: '⚡',
      navigateTo: 'home',
      checkCompletion: (data) => (data?.dailyMissionProgress?.quickAnswers || 0) >= 5
    }
  ];

  // Generate 3 random missions for the day
  const generateDailyMissions = () => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('dailyMissions');

    if (savedData) {
      const { date, missions: savedMissions } = JSON.parse(savedData);
      if (date === today) {
        return savedMissions;
      }
    }

    // Select 3 random missions
    const shuffled = [...ALL_MISSIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    localStorage.setItem('dailyMissions', JSON.stringify({
      date: today,
      missions: selected
    }));

    return selected;
  };

  // Initialize missions
  useEffect(() => {
    const dailyMissions = generateDailyMissions();
    setMissions(dailyMissions);

    // Load completed missions
    const savedCompleted = localStorage.getItem('dailyMissionsCompleted');
    if (savedCompleted) {
      const { date, completed } = JSON.parse(savedCompleted);
      if (date === new Date().toDateString()) {
        setCompletedMissions(completed);
      }
    }
  }, []);

  // Check mission completion
  useEffect(() => {
    if (!userData || missions.length === 0) return;

    missions.forEach(mission => {
      try {
        if (!completedMissions.includes(mission.id) && mission.checkCompletion(userData)) {
        // Mission just completed!
        const newCompleted = [...completedMissions, mission.id];
        setCompletedMissions(newCompleted);

        // Save to localStorage
        localStorage.setItem('dailyMissionsCompleted', JSON.stringify({
          date: new Date().toDateString(),
          completed: newCompleted
        }));

        // Award points
        if (setUserData) {
          setUserData(prev => ({
            ...prev,
            totalPoints: prev.totalPoints + mission.reward
          }));
        }

        if (onMissionComplete) {
          onMissionComplete(mission);
        }
        }
      } catch (error) {
        console.error('Error checking mission completion:', error);
      }
    });
  }, [userData, missions, completedMissions]);

  const allCompleted = missions.length > 0 && missions.every(m => completedMissions.includes(m.id));

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-amber-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Target size={28} className="text-amber-400" />
          <div>
            <h2 className="text-2xl font-bold text-amber-400">Daily Missions</h2>
            <p className="text-slate-400 text-sm">Complete tasks for bonus points</p>
          </div>
        </div>
        {allCompleted && (
          <div className="flex items-center gap-2 bg-green-600/20 border border-green-500 rounded-lg px-3 py-2">
            <Trophy size={20} className="text-green-400" />
            <span className="text-green-400 font-bold text-sm">All Complete!</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {missions.map(mission => {
          const isCompleted = completedMissions.includes(mission.id);

          return (
            <div
              key={mission.id}
              className={`rounded-xl p-4 border-2 transition-all ${
                isCompleted
                  ? 'bg-green-600/20 border-green-500'
                  : 'bg-slate-700/50 border-slate-600 hover:border-amber-500/50 cursor-pointer'
              }`}
              onClick={() => {
                if (!isCompleted && onNavigate && mission.navigateTo) {
                  onNavigate(mission.navigateTo);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-3xl">{mission.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{mission.title}</h3>
                    <p className="text-slate-300 text-sm">{mission.description}</p>
                    {!isCompleted && (
                      <p className="text-amber-400 text-xs mt-1">Click to start →</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star size={16} />
                      <span>+{mission.reward}</span>
                    </div>
                    <div className="text-xs text-slate-400">points</div>
                  </div>
                  {isCompleted ? (
                    <CheckCircle size={32} className="text-green-400" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-slate-500" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>Resets at midnight</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-400" />
          <span className="text-amber-400 font-bold">
            {completedMissions.length}/{missions.length} Complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyMissionBoard;
