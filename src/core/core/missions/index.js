/**
 * Daily Missions System - Private Core Module
 *
 * Contains mission definitions, rewards, rotation logic,
 * and completion validation that should be server-side.
 *
 * SECURITY: Keep in private submodule to prevent save-file editing
 */

// ============================================================================
// MISSION DEFINITIONS
// ============================================================================

export const ALL_MISSIONS = [
  {
    id: 'word-search',
    title: 'Word Search Master',
    description: 'Complete 1 Bible Word Search',
    reward: 100,
    icon: '🔍',
    category: 'activity',
    action: 'start-word-search',
    checkCompletion: (data) => (data?.dailyMissionProgress?.wordSearchCompleted || 0) >= 1
  },
  {
    id: 'storyline',
    title: 'Timeline Historian',
    description: 'Complete 1 Storyline Quiz',
    reward: 100,
    icon: '📜',
    category: 'quiz',
    action: 'start-storyline',
    checkCompletion: (data) => (data?.dailyMissionProgress?.storylineCompleted || 0) >= 1
  },
  {
    id: 'bible-reader',
    title: 'Daily Reader',
    description: 'Read 1 Bible chapter',
    reward: 75,
    icon: '📖',
    category: 'reading',
    navigateTo: 'bible-reader',
    checkCompletion: (data) => (data?.dailyMissionProgress?.chaptersRead || 0) >= 1
  },
  {
    id: 'quiz-streak',
    title: 'Quiz Marathon',
    description: 'Complete 5 quizzes',
    reward: 150,
    icon: '🎯',
    category: 'quiz',
    navigateTo: 'home',
    checkCompletion: (data) => {
      const today = new Date().toDateString();
      const todayQuizzes = (data?.quizHistory || []).filter(q =>
        new Date(q.timestamp).toDateString() === today
      );
      return todayQuizzes.length >= 5;
    }
  },
  {
    id: 'perfect-score',
    title: 'Perfectionist',
    description: 'Get 3 perfect scores',
    reward: 200,
    icon: '💯',
    category: 'achievement',
    navigateTo: 'home',
    checkCompletion: (data) => (data?.dailyMissionProgress?.perfectScores || 0) >= 3
  },
  {
    id: 'course-lesson',
    title: 'Eager Student',
    description: 'Complete 1 course lesson',
    reward: 125,
    icon: '🎓',
    category: 'learning',
    navigateTo: 'academy-about',
    checkCompletion: (data) => (data?.dailyMissionProgress?.courseLessons || 0) >= 1
  },
  {
    id: 'biblical-or-nah',
    title: 'Truth Seeker',
    description: 'Complete 10 Biblical or Nah questions',
    reward: 100,
    icon: '🧠',
    category: 'activity',
    action: 'start-biblical-or-nah',
    checkCompletion: (data) => (data?.dailyMissionProgress?.biblicalOrNahQuestions || 0) >= 10
  },
  {
    id: 'verse-detective',
    title: 'Master Detective',
    description: 'Complete 3 Verse Detective quizzes',
    reward: 150,
    icon: '🔍',
    category: 'quiz',
    action: 'start-verse-detective',
    checkCompletion: (data) => (data?.dailyMissionProgress?.verseDetectiveCompleted || 0) >= 3
  },
  {
    id: 'quick-answer',
    title: 'Speed Runner',
    description: 'Answer 5 questions under 5 seconds',
    reward: 175,
    icon: '⚡',
    category: 'achievement',
    navigateTo: 'home',
    checkCompletion: (data) => (data?.dailyMissionProgress?.quickAnswers || 0) >= 5
  },
  {
    id: 'streak-keeper',
    title: 'Streak Guardian',
    description: 'Maintain your daily streak',
    reward: 80,
    icon: '🔥',
    category: 'achievement',
    navigateTo: 'home',
    checkCompletion: (data) => (data?.currentStreak || 0) > 0
  },
  {
    id: 'memory-master',
    title: 'Memory Champion',
    description: 'Memorize 2 new verses',
    reward: 120,
    icon: '🧠',
    category: 'achievement',
    navigateTo: 'home',
    checkCompletion: (data) => (data?.dailyMissionProgress?.versesMemorized || 0) >= 2
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete a quiz before 9 AM',
    reward: 90,
    icon: '🌅',
    category: 'achievement',
    navigateTo: 'home',
    checkCompletion: (data) => {
      const today = new Date().toDateString();
      const morningQuizzes = (data?.quizHistory || []).filter(q => {
        const quizDate = new Date(q.timestamp);
        return quizDate.toDateString() === today && quizDate.getHours() < 9;
      });
      return morningQuizzes.length > 0;
    }
  }
];

// ============================================================================
// MISSION CATEGORIES (for weighted selection)
// ============================================================================

export const MISSION_CATEGORIES = {
  quiz: { weight: 40, min: 1, max: 2 },      // Always include 1-2 quiz missions
  activity: { weight: 30, min: 0, max: 1 },  // 0-1 activity missions
  achievement: { weight: 20, min: 0, max: 1 }, // 0-1 achievement missions
  learning: { weight: 15, min: 0, max: 1 },  // 0-1 learning missions
  reading: { weight: 10, min: 0, max: 1 }    // 0-1 reading missions
};

// ============================================================================
// MISSION ROTATION LOGIC
// ============================================================================

/**
 * Generate daily missions using deterministic seeded random
 * This ensures the same missions appear for all users on the same day
 * but rotates daily
 */
export function generateDailyMissions(date = new Date()) {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = dateStringToSeed(dateString);

  // Seeded random number generator
  const seededRandom = createSeededRandom(seed);

  // Shuffle missions with seeded random
  const shuffled = [...ALL_MISSIONS].sort(() => seededRandom() - 0.5);

  // Select 3 missions ensuring category diversity
  const selected = [];
  const categoryCount = {};

  for (const mission of shuffled) {
    if (selected.length >= 3) break;

    const category = mission.category;
    const categoryConfig = MISSION_CATEGORIES[category];

    // Check if we can add this category
    const currentCount = categoryCount[category] || 0;
    if (currentCount < categoryConfig.max) {
      selected.push(mission);
      categoryCount[category] = currentCount + 1;
    }
  }

  // Ensure we have at least the minimum for required categories
  for (const [category, config] of Object.entries(MISSION_CATEGORIES)) {
    const currentCount = categoryCount[category] || 0;
    if (currentCount < config.min && selected.length < 3) {
      const categoryMissions = shuffled.filter(m =>
        m.category === category && !selected.includes(m)
      );
      if (categoryMissions.length > 0) {
        selected.push(categoryMissions[0]);
        categoryCount[category] = currentCount + 1;
      }
    }
  }

  return selected.slice(0, 3);
}

/**
 * Convert date string to seed number
 */
function dateStringToSeed(dateString) {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Create seeded random number generator
 */
function createSeededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

// ============================================================================
// SERVER-SIDE MISSION COMPLETION VALIDATION
// ============================================================================

/**
 * Validate mission completion server-side
 * Prevents save-file manipulation
 */
export function validateMissionCompletion(missionId, userData, completedMissions = []) {
  // Check if already completed today
  if (completedMissions.includes(missionId)) {
    return {
      valid: false,
      error: 'Mission already completed today'
    };
  }

  // Get mission definition
  const mission = ALL_MISSIONS.find(m => m.id === missionId);
  if (!mission) {
    return {
      valid: false,
      error: 'Invalid mission ID'
    };
  }

  // Check completion criteria
  const isComplete = mission.checkCompletion(userData);

  if (!isComplete) {
    return {
      valid: false,
      error: 'Mission requirements not met'
    };
  }

  return {
    valid: true,
    mission,
    reward: mission.reward
  };
}

/**
 * Get missions for today (server-side)
 */
export function getTodaysMissions(date = new Date()) {
  return generateDailyMissions(date);
}

/**
 * Award mission rewards (server-side)
 */
export function awardMissionReward(missionId, currentPoints) {
  const mission = ALL_MISSIONS.find(m => m.id === missionId);
  if (!mission) {
    return {
      success: false,
      error: 'Invalid mission'
    };
  }

  return {
    success: true,
    pointsAwarded: mission.reward,
    newTotal: currentPoints + mission.reward,
    missionTitle: mission.title
  };
}

// ============================================================================
// MISSION PROGRESS TRACKING
// ============================================================================

/**
 * Track daily mission progress fields
 * These should be incremented server-side and synced to userData
 */
export const MISSION_PROGRESS_FIELDS = [
  'wordSearchCompleted',
  'storylineCompleted',
  'chaptersRead',
  'perfectScores',
  'courseLessons',
  'biblicalOrNahQuestions',
  'verseDetectiveCompleted',
  'quickAnswers',
  'versesMemorized'
];

/**
 * Reset daily mission progress (called at midnight server-side)
 */
export function resetDailyMissionProgress() {
  const resetData = {};
  MISSION_PROGRESS_FIELDS.forEach(field => {
    resetData[field] = 0;
  });
  return resetData;
}

/**
 * Increment mission progress field
 */
export function incrementMissionProgress(currentProgress, field, amount = 1) {
  return {
    ...currentProgress,
    [field]: (currentProgress[field] || 0) + amount
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ALL_MISSIONS,
  MISSION_CATEGORIES,
  MISSION_PROGRESS_FIELDS,
  generateDailyMissions,
  getTodaysMissions,
  validateMissionCompletion,
  awardMissionReward,
  resetDailyMissionProgress,
  incrementMissionProgress
};
