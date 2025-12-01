/**
 * Point Economy System - Core Logic
 * This module contains sensitive game economics and scoring algorithms.
 * Keep this in a private submodule to prevent exploitation.
 */

// Comprehensive Point Economy System
export const POINT_SYSTEM = {
  // Base points for quiz types (multiplied by difficulty multiplier)
  BASE_QUIZ_POINTS: {
    'fill-blank': 15,
    'multiple-choice': 5,
    'reference-recall': 10,
    'verse-scramble': 20,
    'book-order': 25,
    'sword-drill-ultimate': 50,
    'verse-detective': 30,
  },

  // Difficulty multipliers based on user level
  DIFFICULTY_MULTIPLIERS: {
    Beginner: {
      multiplier: 1.0,
      timeBonus: false,
      perfectBonus: 1.2,
    },
    Intermediate: {
      multiplier: 1.5,
      timeBonus: true,
      perfectBonus: 1.5,
    },
    Advanced: {
      multiplier: 2.0,
      timeBonus: true,
      perfectBonus: 2.0,
    },
    Elite: {
      multiplier: 3.0,
      timeBonus: true,
      perfectBonus: 2.5,
    },
  },

  // Bonus points
  BONUSES: {
    verseOfDayChecked: 10,
    dailyStreakMaintained: 5, // Per day in streak
    firstQuizOfDay: 20,
    perfectQuiz: 50, // All answers correct in session
    speedBonus: 25, // Completed quickly
    bonusTrivia: 30, // Base bonus points per correct trivia answer
    courseLesson: 100,
    courseLevel: 500,
    courseComplete: 1500,
    planMilestone: 200,
    planComplete: 800,
    achievement: 150,
  },

  // Point penalties (incorrectAnswer scales by difficulty level)
  PENALTIES: {
    incorrectAnswer: {
      Beginner: -10,
      Intermediate: -20,
      Advanced: -35,
      Elite: -50
    },
    streakBroken: -50,
    inactiveDay: -10, // Per day inactive (max 7 days)
    quizFailed: -20,
    tooFastAnswer: -10, // Answered too quickly (likely guessing)
    repeatedMistake: -8, // Missing the same verse/question multiple times
  },

  // Time thresholds (in seconds)
  TIME_THRESHOLDS: {
    'verse-scramble': { min: 3, ideal: 15, max: 60 },
    'book-order': { min: 5, ideal: 20, max: 90 },
    'sword-drill-ultimate': { min: 2, ideal: 10, max: 45 },
    'multiple-choice': { min: 2, ideal: 8, max: 30 },
    'fill-blank': { min: 3, ideal: 12, max: 45 },
    'reference-recall': { min: 2, ideal: 10, max: 40 },
    'verse-detective': { min: 15, ideal: 30, max: 120 },
    default: { min: 2, ideal: 10, max: 60 }
  },

  // Point spending options
  SHOP_ITEMS: {
    unlockApocrypha: 1000,
    customTheme: 500,
    skipDifficulty: 300,
    extraHint: 100,
    streakFreeze: 200, // Protect streak for 1 day
    doublePoints: 400, // 2x points for next quiz
    revealAnswer: 50,
  },

  // Difficulty tweaks based on level
  DIFFICULTY_TWEAKS: {
    Beginner: {
      fillBlank: { blanks: 1, wordPool: 'easy' },
      multipleChoice: { options: 3, similar: false },
      timeLimit: null, // No time pressure
    },
    Intermediate: {
      fillBlank: { blanks: 2, wordPool: 'medium' },
      multipleChoice: { options: 4, similar: true },
      timeLimit: 120, // 2 minutes
    },
    Advanced: {
      fillBlank: { blanks: 3, wordPool: 'hard' },
      multipleChoice: { options: 4, similar: true },
      timeLimit: 90, // 1.5 minutes
    },
    Elite: {
      fillBlank: { blanks: 4, wordPool: 'expert' },
      multipleChoice: { options: 5, similar: true },
      timeLimit: 60, // 1 minute
    },
  },
};

// Legacy support - will be replaced by dynamic calculation
export const QUIZ_POINTS = POINT_SYSTEM.BASE_QUIZ_POINTS;

/**
 * Calculate points for a quiz based on performance
 * @param {string} quizType - Type of quiz
 * @param {boolean} isCorrect - Whether answer was correct
 * @param {string} userLevel - User's current difficulty level
 * @param {number} timeTaken - Time taken in seconds
 * @param {boolean} isPerfect - Whether quiz was perfect (all correct)
 * @param {Object} currentProgress - User's current progress for anti-exploit
 * @param {boolean} isPersonalVerse - Whether this is from personal verse bank
 * @returns {number} Points earned (can be negative)
 */
export const calculateQuizPoints = (
  quizType,
  isCorrect,
  userLevel = 'Beginner',
  timeTaken = 0,
  isPerfect = false,
  currentProgress = {},
  isPersonalVerse = false
) => {
  // Base points
  const basePoints = POINT_SYSTEM.BASE_QUIZ_POINTS[quizType] || 10;

  // Get difficulty multiplier
  const levelConfig = POINT_SYSTEM.DIFFICULTY_MULTIPLIERS[userLevel] || POINT_SYSTEM.DIFFICULTY_MULTIPLIERS.Beginner;
  let points = basePoints * levelConfig.multiplier;

  // If incorrect, apply penalty
  if (!isCorrect) {
    const penalty = POINT_SYSTEM.PENALTIES.incorrectAnswer[userLevel] || -10;
    return penalty;
  }

  // Perfect bonus
  if (isPerfect && levelConfig.perfectBonus) {
    points = Math.floor(points * levelConfig.perfectBonus);
  }

  // Time bonus (if enabled for this level)
  if (levelConfig.timeBonus && timeTaken > 0) {
    const threshold = POINT_SYSTEM.TIME_THRESHOLDS[quizType] || POINT_SYSTEM.TIME_THRESHOLDS.default;

    // Award bonus if completed faster than ideal time
    if (timeTaken < threshold.ideal && timeTaken >= threshold.min) {
      points += POINT_SYSTEM.BONUSES.speedBonus;
    }

    // Penalize if too fast (likely guessing)
    if (timeTaken < threshold.min) {
      points += POINT_SYSTEM.PENALTIES.tooFastAnswer;
    }
  }

  // Personal verse cap (max 5 points)
  if (isPersonalVerse) {
    points = Math.min(5, points);
  }

  return Math.floor(points);
};

/**
 * Get bonus points for various actions
 * @param {string} bonusType - Type of bonus (e.g., 'verseOfDayChecked')
 * @param {number} multiplier - Optional multiplier (e.g., for streak days)
 * @returns {number} Bonus points
 */
export const getBonusPoints = (bonusType, multiplier = 1) => {
  const baseBonus = POINT_SYSTEM.BONUSES[bonusType] || 0;
  return Math.floor(baseBonus * multiplier);
};

/**
 * Get penalty points for various actions
 * @param {string} penaltyType - Type of penalty
 * @param {string} userLevel - User's current level (for incorrectAnswer)
 * @returns {number} Penalty points (negative)
 */
export const getPenaltyPoints = (penaltyType, userLevel = 'Beginner') => {
  if (penaltyType === 'incorrectAnswer') {
    return POINT_SYSTEM.PENALTIES.incorrectAnswer[userLevel] || -10;
  }
  return POINT_SYSTEM.PENALTIES[penaltyType] || 0;
};

export default {
  POINT_SYSTEM,
  QUIZ_POINTS,
  calculateQuizPoints,
  getBonusPoints,
  getPenaltyPoints
};
