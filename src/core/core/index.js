/**
 * Sword Drill - Core Game Logic
 *
 * This module contains all sensitive game mechanics and should be kept
 * in a private submodule when publishing the main app to GitHub.
 *
 * To use as a private submodule:
 * 1. Create a private repository for src/core
 * 2. In main repo: git submodule add <private-repo-url> src/core
 * 3. Add src/core to .gitignore in public repo
 * 4. Contributors with access can: git submodule update --init --recursive
 *
 * Security Note:
 * - Never commit this folder to public repository
 * - Keep achievement conditions, point formulas, and validation logic private
 * - Use server-side validation in production for maximum security
 */

// Import all modules first
import * as achievements from './achievements/index.js';
import * as points from './points/index.js';
import * as levels from './levels/index.js';
import * as quiz from './quiz/index.js';
import * as validation from './validation/index.js';
import * as verses from './verses/index.js';
import * as antiCheat from './antiCheat/index.js';
import * as economy from './economy/index.js';
import * as missions from './missions/index.js';

// Achievement System
export const ACHIEVEMENT_TIERS = achievements.ACHIEVEMENT_TIERS;
export const ACHIEVEMENTS = achievements.ACHIEVEMENTS;
export const ACHIEVEMENT_CONDITIONS = achievements.ACHIEVEMENT_CONDITIONS;
export const checkForNewAchievements = achievements.checkForNewAchievements;

// Point Economy
export const POINT_SYSTEM = points.POINT_SYSTEM;
export const QUIZ_POINTS = points.QUIZ_POINTS;
export const calculateQuizPoints = points.calculateQuizPoints;
export const getBonusPoints = points.getBonusPoints;
export const getPenaltyPoints = points.getPenaltyPoints;

// Level Progression
export const LEVEL_REQUIREMENTS = levels.LEVEL_REQUIREMENTS;
export const checkLevelProgression = levels.checkLevelProgression;
export const getLevelRequirements = levels.getLevelRequirements;
export const getAllLevels = levels.getAllLevels;
export const getNextLevel = levels.getNextLevel;

// Quiz Configuration
export const getQuizDifficulty = quiz.getQuizDifficulty;
export const getTimeThreshold = quiz.getTimeThreshold;
export const getTimeLimit = quiz.getTimeLimit;
export const getFillBlankConfig = quiz.getFillBlankConfig;
export const getMultipleChoiceConfig = quiz.getMultipleChoiceConfig;
export const isTooFast = quiz.isTooFast;
export const deservesSpeedBonus = quiz.deservesSpeedBonus;
export const getTimeScoreMultiplier = quiz.getTimeScoreMultiplier;

// Answer Validation
export const matchBiblicalReference = validation.matchBiblicalReference;
export const validateFillBlank = validation.validateFillBlank;
export const validateMultipleFillBlanks = validation.validateMultipleFillBlanks;
export const validateMultipleChoice = validation.validateMultipleChoice;
export const calculateSimilarity = validation.calculateSimilarity;
export const isCloseAnswer = validation.isCloseAnswer;

// Verse Selection
export const DEFAULT_VERSE_FALLBACK = verses.DEFAULT_VERSE_FALLBACK;
export const VERSE_DATABASE = verses.VERSE_DATABASE;
export const getDailyVerse = verses.getDailyVerse;
export const getRandomVerse = verses.getRandomVerse;
export const getVerseByReference = verses.getVerseByReference;
export const getRandomVerses = verses.getRandomVerses;
export const verseExists = verses.verseExists;
export const getTotalVerseCount = verses.getTotalVerseCount;
export const getVersePoolStats = verses.getVersePoolStats;

// Anti-Cheat & Validation
export const RATE_LIMITS = antiCheat.RATE_LIMITS;
export const DIMINISHING_RETURNS = antiCheat.DIMINISHING_RETURNS;
export const validateQuizSubmission = antiCheat.validateQuizSubmission;
export const calculateValidatedPoints = antiCheat.calculateValidatedPoints;
export const recomputeStreakFromHistory = antiCheat.recomputeStreakFromHistory;
export const recomputeTotalPoints = antiCheat.recomputeTotalPoints;
export const validateCooldown = antiCheat.validateCooldown;
export const validatePurchase = antiCheat.validatePurchase;
export const signEvent = antiCheat.signEvent;
export const verifySignedEvent = antiCheat.verifySignedEvent;
export const generateQuizSignature = antiCheat.generateQuizSignature;
export const calculateDiminishingReturns = antiCheat.calculateDiminishingReturns;

// Economy System
export const POWER_UPS = economy.POWER_UPS;
export const DAILY_CHESTS = economy.DAILY_CHESTS;
export const STREAK_CHESTS = economy.STREAK_CHESTS;
export const UNLOCKABLE_COSTS = economy.UNLOCKABLE_COSTS;
export const MANNA_COSTS = economy.MANNA_COSTS;
export const KEY_ECONOMY = economy.KEY_ECONOMY;
export const STREAK_REWARDS = economy.STREAK_REWARDS;
export const calculateStreakXP = economy.calculateStreakXP;
export const getStreakMilestoneRewards = economy.getStreakMilestoneRewards;
export const rollChestLoot = economy.rollChestLoot;
export const getPurchaseCost = economy.getPurchaseCost;

// Missions System
export const ALL_MISSIONS = missions.ALL_MISSIONS;
export const MISSION_CATEGORIES = missions.MISSION_CATEGORIES;
export const MISSION_PROGRESS_FIELDS = missions.MISSION_PROGRESS_FIELDS;
export const generateDailyMissions = missions.generateDailyMissions;
export const getTodaysMissions = missions.getTodaysMissions;
export const validateMissionCompletion = missions.validateMissionCompletion;
export const awardMissionReward = missions.awardMissionReward;
export const resetDailyMissionProgress = missions.resetDailyMissionProgress;
export const incrementMissionProgress = missions.incrementMissionProgress;

// Re-export all as default for convenience
export default {
  // Achievements
  ACHIEVEMENT_TIERS,
  ACHIEVEMENTS,
  ACHIEVEMENT_CONDITIONS,
  checkForNewAchievements,

  // Points
  POINT_SYSTEM,
  QUIZ_POINTS,
  calculateQuizPoints,
  getBonusPoints,
  getPenaltyPoints,

  // Levels
  LEVEL_REQUIREMENTS,
  checkLevelProgression,
  getLevelRequirements,
  getAllLevels,
  getNextLevel,

  // Quiz
  getQuizDifficulty,
  getTimeThreshold,
  getTimeLimit,
  getFillBlankConfig,
  getMultipleChoiceConfig,
  isTooFast,
  deservesSpeedBonus,
  getTimeScoreMultiplier,

  // Validation
  matchBiblicalReference,
  validateFillBlank,
  validateMultipleFillBlanks,
  validateMultipleChoice,
  calculateSimilarity,
  isCloseAnswer,

  // Verses
  DEFAULT_VERSE_FALLBACK,
  VERSE_DATABASE,
  getDailyVerse,
  getRandomVerse,
  getVerseByReference,
  getRandomVerses,
  verseExists,
  getTotalVerseCount,
  getVersePoolStats,

  // Anti-Cheat
  RATE_LIMITS,
  DIMINISHING_RETURNS,
  validateQuizSubmission,
  calculateValidatedPoints,
  recomputeStreakFromHistory,
  recomputeTotalPoints,
  validateCooldown,
  validatePurchase,
  signEvent,
  verifySignedEvent,
  generateQuizSignature,
  calculateDiminishingReturns,

  // Economy
  POWER_UPS,
  DAILY_CHESTS,
  STREAK_CHESTS,
  UNLOCKABLE_COSTS,
  MANNA_COSTS,
  KEY_ECONOMY,
  STREAK_REWARDS,
  calculateStreakXP,
  getStreakMilestoneRewards,
  rollChestLoot,
  getPurchaseCost,

  // Missions
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
