/**
 * Point Economy System - Core Logic
 * This module contains sensitive game economics and scoring algorithms.
 * Keep this in a private submodule to prevent exploitation.
 */

// Comprehensive Point Economy System
export const POINT_SYSTEM = {
  // Base points for quiz types (multiplied by difficulty multiplier)
  BASE_QUIZ_POINTS: {
    'fill-blank': 8,
    'multiple-choice': 3,
    'reference-recall': 5,
    'verse-scramble': 10,
    'book-order': 13,
    'sword-drill-ultimate': 25,
    'verse-detective': 15,
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
    verseOfDayChecked: 5,
    dailyStreakMaintained: 3, // Per day in streak
    firstQuizOfDay: 10,
    perfectQuiz: 25, // All answers correct in session
    speedBonus: 13, // Completed quickly
    bonusTrivia: 15, // Base bonus points per correct trivia answer
    courseLesson: 50,
    courseLevel: 250,
    courseComplete: 750,
    planMilestone: 100,
    planComplete: 400,
    achievement: 75,
  },

  // Point penalties (incorrectAnswer scales by difficulty level)
  PENALTIES: {
    incorrectAnswer: {
      Beginner: -5,
      Intermediate: -10,
      Advanced: -18,
      Elite: -25
    },
    streakBroken: -25,
    inactiveDay: -5, // Per day inactive (max 7 days)
    quizFailed: -10,
    tooFastAnswer: -5, // Answered too quickly (likely guessing)
    repeatedMistake: -4, // Missing the same verse/question multiple times
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
    unlockApocrypha: 500,
    customTheme: 250,
    skipDifficulty: 150,
    extraHint: 50,
    streakFreeze: 100, // Protect streak for 1 day
    doublePoints: 200, // 2x points for next quiz
    revealAnswer: 25,
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
