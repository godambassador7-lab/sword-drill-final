/**
 * Quiz Configuration - Core Logic
 * This module contains quiz generation parameters and difficulty curves.
 * Keep this in a private submodule to protect game balance.
 */

import { POINT_SYSTEM } from '../points';

/**
 * Get quiz difficulty configuration for a specific level
 * @param {string} userLevel - User's current level
 * @returns {Object} Difficulty configuration
 */
export const getQuizDifficulty = (userLevel = 'Beginner') => {
  return POINT_SYSTEM.DIFFICULTY_TWEAKS[userLevel] || POINT_SYSTEM.DIFFICULTY_TWEAKS.Beginner;
};

/**
 * Get time threshold for a quiz type
 * @param {string} quizType - Type of quiz
 * @returns {Object} { min, ideal, max } time thresholds in seconds
 */
export const getTimeThreshold = (quizType) => {
  return POINT_SYSTEM.TIME_THRESHOLDS[quizType] || POINT_SYSTEM.TIME_THRESHOLDS.default;
};

/**
 * Get time limit for user's level
 * @param {string} userLevel - User's current level
 * @returns {number|null} Time limit in seconds, or null for no limit
 */
export const getTimeLimit = (userLevel = 'Beginner') => {
  const config = getQuizDifficulty(userLevel);
  return config.timeLimit;
};

/**
 * Get fill-blank configuration for user's level
 * @param {string} userLevel - User's current level
 * @returns {Object} { blanks, wordPool }
 */
export const getFillBlankConfig = (userLevel = 'Beginner') => {
  const config = getQuizDifficulty(userLevel);
  return config.fillBlank;
};

/**
 * Get multiple choice configuration for user's level
 * @param {string} userLevel - User's current level
 * @returns {Object} { options, similar }
 */
export const getMultipleChoiceConfig = (userLevel = 'Beginner') => {
  const config = getQuizDifficulty(userLevel);
  return config.multipleChoice;
};

/**
 * Determine if answer was submitted too quickly (likely guessing)
 * @param {string} quizType - Type of quiz
 * @param {number} timeTaken - Time taken in seconds
 * @returns {boolean} True if too fast
 */
export const isTooFast = (quizType, timeTaken) => {
  const threshold = getTimeThreshold(quizType);
  return timeTaken < threshold.min;
};

/**
 * Determine if answer qualifies for speed bonus
 * @param {string} quizType - Type of quiz
 * @param {number} timeTaken - Time taken in seconds
 * @returns {boolean} True if deserves speed bonus
 */
export const deservesSpeedBonus = (quizType, timeTaken) => {
  const threshold = getTimeThreshold(quizType);
  return timeTaken < threshold.ideal && timeTaken >= threshold.min;
};

/**
 * Calculate time score multiplier (0-1, higher is better)
 * @param {string} quizType - Type of quiz
 * @param {number} timeTaken - Time taken in seconds
 * @returns {number} Multiplier between 0 and 1
 */
export const getTimeScoreMultiplier = (quizType, timeTaken) => {
  const threshold = getTimeThreshold(quizType);

  // Too fast - penalty zone
  if (timeTaken < threshold.min) {
    return 0.5;
  }

  // Perfect range - full bonus
  if (timeTaken <= threshold.ideal) {
    return 1.0;
  }

  // Declining bonus as time approaches max
  if (timeTaken <= threshold.max) {
    const range = threshold.max - threshold.ideal;
    const position = timeTaken - threshold.ideal;
    return 1.0 - (position / range) * 0.5; // Linear decline from 1.0 to 0.5
  }

  // Over time limit - minimum multiplier
  return 0.3;
};

export default {
  getQuizDifficulty,
  getTimeThreshold,
  getTimeLimit,
  getFillBlankConfig,
  getMultipleChoiceConfig,
  isTooFast,
  deservesSpeedBonus,
  getTimeScoreMultiplier
};
