/**
 * Level Progression System - Core Logic
 * This module contains level requirements and progression mechanics.
 * Keep this in a private submodule to prevent manipulation.
 */

// Level up requirements - shows what's needed to reach each level
export const LEVEL_REQUIREMENTS = {
  Beginner: {
    nextLevel: 'Intermediate',
    versesMastered: 25,    // Need 25 verses to reach Intermediate
    quizzesCompleted: 50,  // Need 50 quizzes to reach Intermediate
    streakDays: 7          // Need 7 day streak to reach Intermediate
  },
  Intermediate: {
    nextLevel: 'Advanced',
    versesMastered: 75,    // Need 75 total verses to reach Advanced
    quizzesCompleted: 150, // Need 150 total quizzes to reach Advanced
    streakDays: 21         // Need 21 day streak to reach Advanced
  },
  Advanced: {
    nextLevel: 'Elite',
    versesMastered: 200,   // Need 200 total verses to reach Elite
    quizzesCompleted: 500, // Need 500 total quizzes to reach Elite
    streakDays: 90         // Need 90 day streak to reach Elite
  },
  Elite: {
    nextLevel: null, // Max level - no more progression
    versesMastered: 200,
    quizzesCompleted: 500,
    streakDays: 90
  }
};

/**
 * Check if user can level up
 * @param {Object} userData - User's current progress
 * @returns {Object} { canLevelUp: boolean, nextLevel: string|null, progress: Object }
 */
export const checkLevelProgression = (userData) => {
  const currentLevel = userData.currentLevel || 'Beginner';
  const requirements = LEVEL_REQUIREMENTS[currentLevel];

  if (!requirements || !requirements.nextLevel) {
    return {
      canLevelUp: false,
      nextLevel: null,
      progress: { verses: 1, quizzes: 1, streak: 1 }
    };
  }

  // Calculate progress for each requirement
  const versesProgress = Math.min(1, (userData.versesMemorized || 0) / requirements.versesMastered);
  const quizzesProgress = Math.min(1, (userData.quizzesCompleted || 0) / requirements.quizzesCompleted);
  const streakProgress = Math.min(1, (userData.currentStreak || 0) / requirements.streakDays);

  // User can level up if ALL requirements are met
  const canLevelUp = (
    userData.versesMemorized >= requirements.versesMastered &&
    userData.quizzesCompleted >= requirements.quizzesCompleted &&
    userData.currentStreak >= requirements.streakDays
  );

  return {
    canLevelUp,
    nextLevel: requirements.nextLevel,
    progress: {
      verses: versesProgress,
      quizzes: quizzesProgress,
      streak: streakProgress
    }
  };
};

/**
 * Get requirements for a specific level
 * @param {string} level - Level name
 * @returns {Object} Level requirements
 */
export const getLevelRequirements = (level = 'Beginner') => {
  return LEVEL_REQUIREMENTS[level] || LEVEL_REQUIREMENTS.Beginner;
};

/**
 * Get all level names in order
 * @returns {Array} Array of level names
 */
export const getAllLevels = () => {
  return ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
};

/**
 * Get next level name
 * @param {string} currentLevel - Current level
 * @returns {string|null} Next level name or null if at max level
 */
export const getNextLevel = (currentLevel = 'Beginner') => {
  const requirements = LEVEL_REQUIREMENTS[currentLevel];
  return requirements ? requirements.nextLevel : null;
};

export default {
  LEVEL_REQUIREMENTS,
  checkLevelProgression,
  getLevelRequirements,
  getAllLevels,
  getNextLevel
};
